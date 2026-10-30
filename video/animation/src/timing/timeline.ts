// Maps VO time (seconds into the VO file) to video frames.
//
// Pure and dependency-free so Node scripts (scripts/*.mjs) can import it
// directly with type stripping, and the Remotion bundle can import it too.

export const FPS = 30;

/** Cue anticipation: motion starts this many frames early so it lands on the word. */
export const ANTICIPATION = 3;

/** A row's scene starts this long before its first word (room for a page turn). */
export const ROW_LEAD = 0.2;

/** After the last row, keep this much VO tail before the end card. */
export const LAST_ROW_TAIL = 0.5;

/** Script order of every row in VIDEO_STRUCTURE.md. Holds have no VO. */
export const ROW_ORDER = [
  '0', '0.5', '1a', '1b', '2a', '2b', '2c', '2d', '2e', '2f',
  '3a', '3b', '4a', '4b', '4c', '5a', '5b', '5c', '6',
] as const;
export type RowId = (typeof ROW_ORDER)[number];

/** No-VO holds, inserted after the named VO row. Music cue M1–M3 sits on each. */
export const HOLDS: Record<string, {after: RowId; seconds: number; music: string}> = {
  '0.5': {after: '0', seconds: 3, music: 'M1'},
  '2e': {after: '2d', seconds: 5, music: 'M2'},
  '6': {after: '5c', seconds: 4, music: 'M3'},
};

export type CueFile = {
  source: string;
  duration: number;
  rows: Record<string, {start: number; end: number}>;
  cues: Record<string, number>;
  /** Present only on the generated placeholder. */
  placeholder?: boolean;
};

export type Scene = {
  id: RowId;
  kind: 'vo' | 'hold';
  /** First frame of the scene in the video. */
  from: number;
  /** Exact (unrounded) start in video seconds; VO time t plays at start + (t - vo.from). */
  start: number;
  durationInFrames: number;
  /** VO span this scene plays (seconds into the VO file); null for holds. */
  vo: {from: number; to: number} | null;
  music?: string;
};

export type Timeline = {
  fps: number;
  totalFrames: number;
  scenes: Scene[];
  /** Absolute video frame of every cue (C.. and M..), without anticipation. */
  cueFrames: Record<string, number>;
  /** Which scene each cue falls in. */
  cueScene: Record<string, RowId>;
  /** Absolute video frames of each VO row's first word and last word end. */
  rowFrames: Record<string, {start: number; end: number}>;
  source: string;
  placeholder: boolean;
};

export const isHold = (id: string) => id in HOLDS;

export function buildTimeline(cues: CueFile, fps = FPS): Timeline {
  const voRows = ROW_ORDER.filter((id) => !isHold(id));
  for (const id of voRows) {
    if (!cues.rows[id]) throw new Error(`cues.json is missing row "${id}"`);
  }

  // VO-time boundaries between consecutive VO rows. A boundary sits ROW_LEAD
  // before the next row's first word, but never cuts into the previous row.
  const bounds: number[] = [0];
  for (let i = 1; i < voRows.length; i++) {
    const prev = cues.rows[voRows[i - 1]];
    const next = cues.rows[voRows[i]];
    bounds.push(Math.max(prev.end, next.start - ROW_LEAD));
  }
  const last = cues.rows[voRows[voRows.length - 1]];
  const voEnd = cues.duration > last.end ? Math.min(cues.duration, last.end + LAST_ROW_TAIL) : last.end + LAST_ROW_TAIL;
  bounds.push(voEnd);

  // Walk the script order, laying VO spans and holds end to end in video time.
  type Seg = {id: RowId; kind: 'vo' | 'hold'; start: number; seconds: number; vo: Scene['vo']; music?: string};
  const segs: Seg[] = [];
  let t = 0;
  for (const id of ROW_ORDER) {
    if (isHold(id)) {
      const h = HOLDS[id];
      segs.push({id, kind: 'hold', start: t, seconds: h.seconds, vo: null, music: h.music});
      t += h.seconds;
    } else {
      const i = voRows.indexOf(id);
      const vo = {from: bounds[i], to: bounds[i + 1]};
      segs.push({id, kind: 'vo', start: t, seconds: vo.to - vo.from, vo});
      t += vo.to - vo.from;
    }
  }

  const toFrame = (s: number) => Math.round(s * fps);
  const totalFrames = toFrame(t);
  const scenes: Scene[] = segs.map((s, i) => {
    const from = toFrame(s.start);
    const to = i + 1 < segs.length ? toFrame(segs[i + 1].start) : totalFrames;
    return {id: s.id, kind: s.kind, from, start: s.start, durationInFrames: to - from, vo: s.vo, music: s.music};
  });

  const segAt = (voT: number) => segs.find((s) => s.vo && voT >= s.vo.from && voT < s.vo.to) ?? segs.filter((s) => s.vo).at(-1)!;
  const voToFrame = (voT: number) => {
    const seg = segAt(voT);
    return toFrame(seg.start + (voT - seg.vo!.from));
  };

  const cueFrames: Record<string, number> = {};
  const cueScene: Record<string, RowId> = {};
  for (const [cue, voT] of Object.entries(cues.cues)) {
    cueFrames[cue] = voToFrame(voT);
    cueScene[cue] = segAt(voT).id;
  }
  const rowFrames: Record<string, {start: number; end: number}> = {};
  for (const s of segs) {
    if (!s.vo) continue;
    const r = cues.rows[s.id];
    rowFrames[s.id] = {start: toFrame(s.start + (r.start - s.vo.from)), end: toFrame(s.start + (r.end - s.vo.from))};
  }
  for (const s of scenes) {
    if (s.music) {
      cueFrames[s.music] = s.from;
      cueScene[s.music] = s.id;
    }
  }

  return {fps, totalFrames, scenes, cueFrames, cueScene, rowFrames, source: cues.source, placeholder: Boolean(cues.placeholder)};
}

/**
 * Edit decision list for the assembly session: where to cut the VO file and
 * where each piece lands in the video. Holds are silent gaps for music.
 */
export function editList(tl: Timeline) {
  return tl.scenes.map((s) => ({
    row: s.id,
    kind: s.kind,
    videoIn: +(s.from / tl.fps).toFixed(3),
    videoOut: +((s.from + s.durationInFrames) / tl.fps).toFixed(3),
    voIn: s.vo ? +s.vo.from.toFixed(3) : null,
    voOut: s.vo ? +s.vo.to.toFixed(3) : null,
    music: s.music ?? null,
  }));
}
