// The soundtrack, on the same timeline as the picture:
//   - the edited VO, cut into one piece per row and placed at its scene, so the
//     holds (0.5, 2e, 6) are VO-silent;
//   - an optional music bed from assets.manifest.json "music.bed", ducked under
//     the VO and shaped to the arc in VIDEO_STRUCTURE.md "Music & pacing".
import React from 'react';
import {Html5Audio, Sequence, getStaticFiles, interpolate, staticFile} from 'remotion';
import voUrl from './data/vo.wav';
import {slot} from './assets';
import {TIMELINE, sceneById} from './timing/context';
import type {RowId} from './timing/timeline';

const {fps, totalFrames, scenes, cueFrames: cf, rowFrames} = TIMELINE;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const lerp = (f: number, input: number[], output: number[]) => interpolate(f, input, output, clamp);
const dbToGain = (db: number) => 10 ** (db / 20);

/** Fade where a VO piece meets silence (a hold, or the start/end of the video). */
const VO_EDGE_FADE = 3;

export const Voiceover: React.FC = () => {
  if (TIMELINE.placeholder) return null;
  return (
    <>
      {scenes.map((s, i) => {
        if (!s.vo) return null;
        const d = s.durationInFrames;
        const fadeIn = !scenes[i - 1]?.vo;
        const fadeOut = !scenes[i + 1]?.vo;
        // VO time t plays at video time s.start + (t - vo.from). The piece starts
        // on the whole frame s.from, so trim to the VO time that falls there.
        const trimBefore = Math.max(0, (s.vo.from + s.from / fps - s.start) * fps);
        const volume = (f: number) =>
          Math.min(fadeIn ? lerp(f, [0, VO_EDGE_FADE], [0, 1]) : 1, fadeOut ? lerp(f, [d - VO_EDGE_FADE, d], [1, 0]) : 1);
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={d} name={`VO ${s.id}`} layout="none">
            <Html5Audio src={voUrl} trimBefore={trimBefore} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Music bed

type MusicSettings = {
  /** Integrated loudness of the track (LUFS); null assumes a typical -14. */
  lufs: number | null;
  /** Music loudness relative to the VO while the VO plays (dB). */
  underVoDb: number;
  /** Music loudness relative to the VO in the no-VO holds (dB). */
  holdDb: number;
  /** Time (s) in the track of a hit to land on each hold, or null. */
  hits: Record<string, number | null>;
};

/** vo_edited.wav integrated loudness (video/audio/EDIT_NOTES.md). */
const VO_LUFS = -16;
/** Duck ramps: down over DUCK_ATTACK frames, done 3 frames before a row's first word; back up over DUCK_RELEASE frames after its last word. */
const DUCK_ATTACK = 15;
const DUCK_RELEASE = 10;
/** VO rows closer than this (frames) count as one span, so the music doesn't pump between rows. */
const DUCK_MERGE = 45;
/** Splice crossfade when the track is re-cut to land a hit (frames). */
const SPLICE_XF = 15;

const voSpans = Object.values(rowFrames)
  .sort((a, b) => a.start - b.start)
  .reduce<{start: number; end: number}[]>((spans, r) => {
    const last = spans.at(-1);
    if (last && r.start - last.end < DUCK_MERGE) last.end = r.end;
    else spans.push({...r});
    return spans;
  }, []);

/** 1 while the VO speaks, 0 in the holds. */
const duckAmount = (f: number) =>
  Math.max(0, ...voSpans.map((r) => lerp(f, [r.start - 3 - DUCK_ATTACK, r.start - 3, r.end, r.end + DUCK_RELEASE], [0, 1, 1, 0])));

/** The arc from VIDEO_STRUCTURE.md, in dB on top of the ducked/hold level. */
const arcDb = (f: number) => {
  const from = (id: RowId) => sceneById(id).from;
  return (
    // soft intro (0), beat drops on the title card (M1)
    lerp(f, [cf.M1 - 6, cf.M1], [-3, 0]) +
    // thins at "never done anything like that" (2c), back on "But I adapted"
    lerp(f, [cf.C16 - 3, cf.C16 + 9, cf.C18 - 9, cf.C18], [0, -6, -6, 0]) +
    // swells through the projects (2d) to the showcase peak (2e, M2)
    lerp(f, [from('2d'), cf.M2, from('2f') - 15, from('2f') + 6], [0, 3, 3, 0]) +
    // lifts at "shifted my life's trajectory" (5a), settles for the bookend (5c)
    lerp(f, [cf.C39, cf.C39 + 30, cf.C44 - 15, cf.C44], [0, 2, 2, 0])
  );
};

/** Fade in over the first second; after the final chord (M3) the tail fades out by the last frame. */
const fades = (f: number) => lerp(f, [0, fps], [0, 1]) * lerp(f, [cf.M3 + fps, totalFrames - 1], [1, 0]);

/**
 * Where the track plays. With no hits it runs from frame 0. Each hit makes a
 * segment that is spliced in at the start of the VO row before that hold
 * (under the VO, ducked) and lines the hit up with the hold's first frame.
 */
const musicSegments = (hits: MusicSettings['hits']) => {
  const holdOf = (m: string) => scenes.find((s) => s.music === m)!;
  const anchors = Object.entries(hits)
    .filter((e): e is [string, number] => typeof e[1] === 'number')
    .map(([m, hit]) => {
      const hold = holdOf(m);
      const splice = scenes[scenes.indexOf(hold) - 1].from;
      return {splice, trackAt: hit - (hold.from - splice) / fps};
    })
    .sort((a, b) => a.splice - b.splice);
  if (!anchors.length || anchors[0].splice > 0) anchors.unshift({splice: 0, trackAt: 0});
  return anchors.map((a, i) => {
    const end = anchors[i + 1] ? anchors[i + 1].splice + SPLICE_XF : totalFrames;
    // A hit earlier in the track than the splice allows: start the segment late.
    const late = Math.max(0, Math.round(-a.trackAt * fps));
    return {from: a.splice + late, end, trimBefore: Math.max(0, a.trackAt) * fps, xfIn: i > 0, xfOut: i + 1 < anchors.length};
  });
};

export const Music: React.FC = () => {
  const s = slot('music.bed');
  const settings = s.value as MusicSettings;
  if (s.status !== 'ready' || !s.file) return null;
  if (!getStaticFiles().some((f) => f.name === s.file)) {
    console.warn(`music.bed: ${s.file} is not in video/assets/, rendering without music`);
    return null;
  }
  const src = staticFile(s.file);
  const trackLufs = settings.lufs ?? -14;
  const gainAt = (abs: number) => {
    const mixDb = settings.underVoDb + (settings.holdDb - settings.underVoDb) * (1 - duckAmount(abs));
    return dbToGain(VO_LUFS + mixDb + arcDb(abs) - trackLufs) * fades(abs);
  };
  return (
    <>
      {musicSegments(settings.hits).map((seg, i) => {
        const len = seg.end - seg.from;
        // Equal-power crossfade at splices.
        const xf = (f: number) =>
          (seg.xfIn ? Math.sin((Math.PI / 2) * lerp(f, [0, SPLICE_XF], [0, 1])) : 1) *
          (seg.xfOut ? Math.cos((Math.PI / 2) * lerp(f, [len - SPLICE_XF, len], [0, 1])) : 1);
        return (
          <Sequence key={i} from={seg.from} durationInFrames={len} name={`Music ${i + 1}`} layout="none">
            <Html5Audio src={src} trimBefore={seg.trimBefore} volume={(f) => gainAt(seg.from + f) * xf(f)} />
          </Sequence>
        );
      })}
    </>
  );
};
