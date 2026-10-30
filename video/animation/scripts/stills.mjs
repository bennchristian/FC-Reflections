// Renders a still at each cue (a few frames after it, once the motion has landed).
//   npm run stills                 all cues
//   npm run stills -- 1a 2c 5c     only those rows
// Output: out/stills/<row>_<cue>.jpg (half size, debug overlay on).
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {ROOT} from './script-parse.mjs';
import {buildTimeline} from '../src/timing/timeline.ts';

const only = process.argv.slice(2);
const after = Number(process.env.AFTER ?? 10);
const cues = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/cues.json'), 'utf8'));
const tl = buildTimeline(cues);
const jobs = Object.entries(tl.cueFrames)
  .filter(([id]) => !only.length || only.includes(tl.cueScene[id]))
  .sort((a, b) => a[1] - b[1]);

const outDir = path.join(ROOT, 'out/stills');
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src/index.ts'), publicDir: path.resolve(ROOT, '../assets')});
const inputProps = {debug: true};
// Set REMOTION_BROWSER to a local Chrome to skip Remotion's headless-shell download.
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const composition = await selectComposition({serveUrl, id: 'FCReflection', inputProps, browserExecutable});
for (const [id, frame] of jobs) {
  const f = Math.min(composition.durationInFrames - 1, frame + after);
  const output = path.join(outDir, `${tl.cueScene[id].replace('.', '_')}_${id}.jpg`);
  await renderStill({serveUrl, composition, frame: f, output, inputProps, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5, browserExecutable});
  console.log(`${id.padEnd(5)} frame ${f} → ${path.relative(ROOT, output)}`);
}
