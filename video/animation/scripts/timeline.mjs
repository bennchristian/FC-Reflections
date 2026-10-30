// Writes out/timeline.json: scene frames, cue frames and the VO edit list
// (where to cut the VO and where each piece lands; holds are silent gaps for M1–M3).
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './script-parse.mjs';
import {buildTimeline, editList} from '../src/timing/timeline.ts';

const cues = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/cues.json'), 'utf8'));
const tl = buildTimeline(cues);
const edl = editList(tl);
fs.mkdirSync(path.join(ROOT, 'out'), {recursive: true});
fs.writeFileSync(path.join(ROOT, 'out/timeline.json'), JSON.stringify({...tl, editList: edl}, null, 2));
console.table(edl);
console.log(`total ${tl.totalFrames} frames (${(tl.totalFrames / tl.fps).toFixed(2)} s) → out/timeline.json`);
