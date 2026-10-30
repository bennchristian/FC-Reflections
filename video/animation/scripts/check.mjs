// Verifies the build against the locked script and the current cue file:
//   1. every {Cxx} in the script's AUDIO column is also listed in its cue column (and vice versa)
//   2. src/data/cues.json has every VO row and every cue
//   3. every row has a scene file, and that file triggers every cue of its row (and M1–M3 on holds)
//   4. the timeline: composition length follows the cue file; each cue lands inside its own row's scene
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, parseScript} from './script-parse.mjs';
import {buildTimeline, HOLDS, ROW_ORDER} from '../src/timing/timeline.ts';

const problems = [];
const rows = parseScript();
const cues = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/cues.json'), 'utf8'));

// 1. script self-consistency
const scriptIds = rows.map((r) => r.id);
if (JSON.stringify(scriptIds) !== JSON.stringify([...ROW_ORDER])) problems.push(`Row order in script ${scriptIds} != ROW_ORDER ${ROW_ORDER}`);
for (const r of rows) {
  const spoken = r.cues.map((c) => c.id).sort();
  const listed = r.triggerCues.filter((c) => c.startsWith('C')).sort();
  if (JSON.stringify(spoken) !== JSON.stringify(listed)) problems.push(`Row ${r.id}: VO tags [${spoken}] vs cue column [${listed}]`);
}

// 2. cue file coverage
const allCues = rows.flatMap((r) => r.cues.map((c) => c.id));
for (const r of rows.filter((r) => r.vo)) if (!cues.rows[r.id]) problems.push(`cues.json: missing row ${r.id}`);
for (const id of allCues) if (cues.cues[id] === undefined) problems.push(`cues.json: missing cue ${id}`);
for (const id of Object.keys(cues.cues)) if (!allCues.includes(id)) problems.push(`cues.json: unknown cue ${id} (not in script)`);

// 3. scene triggers
let triggers = 0;
for (const r of rows) {
  const file = path.join(ROOT, 'src/scenes', `Row${r.id.replace('.', '_')}.tsx`);
  if (!fs.existsSync(file)) {
    problems.push(`Row ${r.id}: no scene file ${path.relative(ROOT, file)}`);
    continue;
  }
  const src = fs.readFileSync(file, 'utf8');
  const want = [...r.cues.map((c) => c.id), ...(HOLDS[r.id] ? [HOLDS[r.id].music] : [])];
  for (const id of want) {
    if (new RegExp(`['"]${id}['"]`).test(src)) triggers++;
    else problems.push(`Row ${r.id}: ${path.basename(file)} has no trigger for ${id}`);
  }
}

// 4. timeline
const tl = buildTimeline(cues);
const last = tl.scenes.at(-1);
if (last.from + last.durationInFrames !== tl.totalFrames) problems.push('Scenes do not end at totalFrames');
for (const [id, frame] of Object.entries(tl.cueFrames)) {
  const s = tl.scenes.find((x) => x.id === tl.cueScene[id]);
  const row = rows.find((r) => r.cues.some((c) => c.id === id) || HOLDS[r.id]?.music === id);
  if (row && row.id !== s.id) problems.push(`${id} falls in scene ${s.id}, but the script puts it in row ${row.id}`);
  if (frame < s.from || frame >= s.from + s.durationInFrames) problems.push(`${id} at frame ${frame} is outside scene ${s.id}`);
}
const ordered = allCues.map((id) => tl.cueFrames[id]);
ordered.forEach((f, i) => i && f < ordered[i - 1] && problems.push(`${allCues[i]} comes before ${allCues[i - 1]}`));
let minGap = Infinity;
let minGapAt = '';
for (let i = 1; i < ordered.length; i++) if (ordered[i] - ordered[i - 1] < minGap) [minGap, minGapAt] = [ordered[i] - ordered[i - 1], `${allCues[i - 1]}→${allCues[i]}`];

console.log(`script: ${rows.length} rows, ${allCues.length} cues + ${Object.keys(HOLDS).length} music holds`);
console.log(`cues:   ${tl.source}${tl.placeholder ? '  ⚠ placeholder' : ''}`);
console.log(`scenes: ${triggers} cue triggers found in ${rows.length} scene files`);
console.log(`length: ${tl.totalFrames} frames = ${(tl.totalFrames / tl.fps).toFixed(2)} s at ${tl.fps} fps (VO ${cues.duration}s + holds ${Object.values(HOLDS).reduce((a, h) => a + h.seconds, 0)}s)`);
console.log(`tightest cue gap: ${minGap} frames (${minGapAt})`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log('✓ every script cue has a cue time and a scene trigger');
