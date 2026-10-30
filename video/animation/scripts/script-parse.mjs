// Reads the locked AV table in video/VIDEO_STRUCTURE.md.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '..');
export const SCRIPT_PATH = path.resolve(ROOT, '../VIDEO_STRUCTURE.md');

const toSec = (m, s) => Number(m) * 60 + Number(s);

/** [{id, start, end, vo: string|null, cues: [{id, wordIndex}], words}] in script order. */
export function parseScript(file = SCRIPT_PATH) {
  const md = fs.readFileSync(file, 'utf8');
  const rows = [];
  for (const line of md.split('\n')) {
    const m = line.match(/^\| \*\*([0-9.]+[a-z]?)\*\* \|(.*)$/);
    if (!m) continue;
    const cells = m[2].split('|').map((c) => c.trim());
    const [beat, audio, , cueCol] = cells;
    const time = beat.match(/(\d+):(\d+)–(\d+):(\d+)/);
    if (!time) continue;
    const voMatch = audio.match(/\[VO\]\s*(.*?)(?:<br>\[MUSIC\]|$)/);
    const row = {id: m[1], start: toSec(time[1], time[2]), end: toSec(time[3], time[4]), vo: null, cues: [], words: 0, triggerCues: []};
    row.triggerCues = [...(cueCol ?? '').matchAll(/\*\*(C\d+[a-z]?(?:\/[a-z])*|M\d)\*\*/g)].flatMap((x) => {
      // "C09a/b/c" expands to C09a, C09b, C09c
      const [head, ...rest] = x[1].split('/');
      return [head, ...rest.map((suffix) => head.slice(0, -1) + suffix)];
    });
    if (voMatch) {
      row.vo = voMatch[1].trim();
      let idx = 0;
      for (const tok of row.vo.split(/\s+/)) {
        const tag = tok.match(/^\{(C\d+[a-z]?)\}$/);
        if (tag) row.cues.push({id: tag[1], wordIndex: idx});
        else if (tok.replace(/[^\p{L}\p{N}]/gu, '')) idx++;
      }
      row.words = idx;
    }
    rows.push(row);
  }
  if (rows.length === 0) throw new Error(`No AV rows found in ${file}`);
  return rows;
}

/** Placeholder cues.json estimated from the script's row times and word positions. */
export function placeholderCues(rows, holdIds) {
  const BREATH = 0.6;
  let holdSoFar = 0;
  const out = {source: 'PLACEHOLDER (estimated from VIDEO_STRUCTURE.md row times)', duration: 0, placeholder: true, rows: {}, cues: {}};
  for (const r of rows) {
    if (holdIds.includes(r.id)) {
      holdSoFar += r.end - r.start;
      continue;
    }
    const start = r.start - holdSoFar;
    const end = r.end - holdSoFar - BREATH;
    out.rows[r.id] = {start: +start.toFixed(3), end: +end.toFixed(3)};
    for (const c of r.cues) out.cues[c.id] = +(start + (c.wordIndex / r.words) * (end - start)).toFixed(3);
    out.duration = +(end + BREATH).toFixed(3);
  }
  return out;
}
