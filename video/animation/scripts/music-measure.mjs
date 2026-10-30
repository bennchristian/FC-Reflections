// Prints the integrated loudness (LUFS) of the music bed, for "music.bed".value.lufs
// in assets.manifest.json. Uses the ffmpeg that ships with Remotion.
//   npm run music:measure                 the slot's file
//   npm run music:measure -- path/to.mp3  any file
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './script-parse.mjs';

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets.manifest.json'), 'utf8'));
const slotFile = manifest.slots['music.bed'].file;
const file = process.argv[2] ? path.resolve(process.argv[2]) : slotFile && path.resolve(ROOT, '../assets', slotFile);
if (!file || !fs.existsSync(file)) {
  console.error(`No music file${file ? ` at ${file}` : ''}. Set "music.bed".file in assets.manifest.json or pass a path.`);
  process.exit(1);
}
const ff = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-nostats', '-i', file, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], {cwd: ROOT, encoding: 'utf8'});
const lufs = (ff.stderr + ff.stdout).match(/"input_i"\s*:\s*"(-?[\d.]+)"/)?.[1];
if (!lufs) {
  console.error(ff.stderr);
  throw new Error('Could not read the loudness from ffmpeg');
}
const shown = path.relative(process.cwd(), file);
console.log(`${shown.startsWith('..') ? file : shown}: ${lufs} LUFS → set "music.bed".value.lufs to ${lufs}`);
