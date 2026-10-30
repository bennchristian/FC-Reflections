// Picks the cue file the animation uses and copies it to src/data/cues.json.
//   1. $CUES, if set
//   2. video/audio/cues.json (written by the audio session), if it exists
//   3. otherwise a placeholder estimated from VIDEO_STRUCTURE.md
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, parseScript, placeholderCues} from './script-parse.mjs';
import {HOLDS} from '../src/timing/timeline.ts';

const real = process.env.CUES ? path.resolve(process.env.CUES) : path.resolve(ROOT, '../audio/cues.json');
const target = path.join(ROOT, 'src/data/cues.json');

let data;
if (fs.existsSync(real)) {
  data = JSON.parse(fs.readFileSync(real, 'utf8'));
  for (const k of ['rows', 'cues']) if (typeof data[k] !== 'object') throw new Error(`${real}: missing "${k}"`);
  delete data.placeholder;
  console.log(`cues: using ${path.relative(process.cwd(), real)} (${Object.keys(data.cues).length} cues)`);
} else {
  data = placeholderCues(parseScript(), Object.keys(HOLDS));
  console.log(`cues: ${path.relative(process.cwd(), real)} not found, using PLACEHOLDER timing from VIDEO_STRUCTURE.md`);
}
fs.mkdirSync(path.dirname(target), {recursive: true});
const json = JSON.stringify(data, null, 2) + '\n';
if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== json) fs.writeFileSync(target, json);

// Stage the VO next to the cues so the bundle can import it (the public dir is
// video/assets, which doesn't hold the audio). Without a real VO (placeholder
// timing, or a missing file) a 0.1 s silent WAV is staged and Soundtrack skips the VO.
const voSrc = data.placeholder ? null : path.resolve(path.dirname(real), data.source);
const voTarget = path.join(ROOT, 'src/data/vo.wav');
if (voSrc && fs.existsSync(voSrc)) {
  const a = fs.statSync(voSrc);
  const b = fs.existsSync(voTarget) ? fs.statSync(voTarget) : null;
  if (!b || b.size !== a.size || b.mtimeMs < a.mtimeMs) fs.copyFileSync(voSrc, voTarget);
  console.log(`vo:   using ${path.relative(process.cwd(), voSrc)}`);
} else {
  const n = 4800; // 0.1 s, 48 kHz, 16-bit mono
  const wav = Buffer.alloc(44 + n * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + n * 2, 4); wav.write('WAVE', 8);
  wav.write('fmt ', 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(48000, 24); wav.writeUInt32LE(96000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(n * 2, 40);
  fs.writeFileSync(voTarget, wav);
  console.log(`vo:   ${voSrc ? path.relative(process.cwd(), voSrc) + ' not found' : 'placeholder timing'}, rendering without VO`);
}
