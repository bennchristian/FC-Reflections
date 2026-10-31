# FC reflection video: animation

The animated picture for *Why I'd say yes to FC again*, built in [Remotion](https://www.remotion.dev/) (React). It follows the locked script and cue sheet in [`../VIDEO_STRUCTURE.md`](../VIDEO_STRUCTURE.md) (v6). Output is 1920×1080 at 30 fps.

Picture and sound come from one timeline: the composition places the edited VO (`../audio/vo_edited.wav`) row by row and plays an optional music bed under it. See [Sound](#sound).

## Run it

You need Node 22 or later (Node 24 is installed).

```bash
npm install
```

Open Remotion Studio to scrub through the video. `FCReflection` is the full cut, and the `Rows/` folder has one composition per script row:

```bash
npm run studio
```

Check that every script cue has a cue time and a scene trigger, and typecheck:

```bash
npm run check
```

Render a still at every cue, with the debug overlay on, into `out/stills/`. Add row IDs after `--` to render only those rows:

```bash
npm run stills -- 1a 2c 5c
```

Print the edit list and write `out/timeline.json`:

```bash
npm run timeline
```

Render the finished video (H.264, AAC 48 kHz stereo) to `../out/FC_Reflection_v1.mp4`. For a new version, pass another path: `npx remotion render FCReflection ../out/FC_Reflection_v2.mp4`.

```bash
npm run render
```

`npm run render:silent` renders the picture alone to `out/fc-reflection-silent.mp4`.

A full render takes about 40 minutes. `remotion.config.ts` sets concurrency to 1 on purpose: on an 8 GB Mac, parallel tabs ran Chrome out of memory and produced corrupt frames (the page drawn tiled) in the 2e showcase. Pass `--concurrency=4` only on a machine with plenty of free RAM, then check the result for single-frame glitches.

To preview part of it, render a frame range at half size:

```bash
npx remotion render FCReflection out/preview.mp4 --frames=354-1224 --scale=0.5
```

The first render downloads Remotion's Chrome Headless Shell, which is about 170 MB and can be slow. To use the Chrome you already have instead, set `REMOTION_BROWSER` for `npm run stills`, or pass `--browser-executable` to `remotion render`:

```bash
REMOTION_BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run stills
```

`out/`, `node_modules/`, the staged `src/data/vo.wav` and everything in `video/out/` are gitignored. In Studio, set the input prop `{"debug": true}` to show the row, the frame and each cue as it fires.

## How timing works

Nothing is tied to fixed seconds. Every time comes from a cue file.

1. **The cue file.** `scripts/sync-cues.mjs` runs before `studio`, `render`, `stills`, `check` and `timeline`. It copies the first of these that exists into `src/data/cues.json`, and copies the VO file the cues name (`source`, next to the cue file) to `src/data/vo.wav`:
   - `$CUES`, if you set it, for example `CUES=/path/to/cues.json npm run studio`
   - `../audio/cues.json`, the real file from the audio session
   - otherwise, a **placeholder** worked out from `VIDEO_STRUCTURE.md`. Each row's start and end come from the timing table (minus the holds before it), and each cue is placed by its word position in the row. `npm run check` flags the placeholder with ⚠.

   The cue file looks like this, with times in seconds from the start of the VO file:
   ```json
   { "source": "vo_edited.wav", "duration": 0.0,
     "rows": { "0": {"start":0,"end":0}, "1a": {...}, ... },
     "cues": { "C00": 0.0, "C09a": 0.0, "C36b": 0.0, ... } }
   ```

2. **The timeline builder.** `src/timing/timeline.ts` is pure TypeScript, so both Remotion and Node use the same code.
   - It cuts the VO into one span per row. Each cut sits 0.2 s (`ROW_LEAD`) before the next row's first word, so a page turn can start before that word. A cut never falls inside the previous row.
   - It lays the spans end to end and inserts the no-VO holds:
     - **title card** (0.5): 3 s after row 0, music cue **M1**
     - **showcase** (2e): 5 s after row 2d, music cue **M2**
     - **end card** (6): 4 s after row 5c, music cue **M3**
   - The composition length is the VO up to 0.5 s after the last word, plus the 12 s of holds. With the real `video/audio/cues.json` (VO 144.91 s), that's 4707 frames (2:36.9). The placeholder came to 5757 frames (3:11.9).
   - It converts every cue to a video frame.

3. **Scenes.** Each row is one scene component in `src/scenes/Row<id>.tsx`, where `0.5` becomes `0_5`. Inside a scene:
   - `c('C04')` is the scene-local frame where that cue's change starts. That's the cue frame minus a 3-frame anticipation, so the motion lands on the word.
   - `c.between('C00', 'C01', 2/17)` gives a point between two cues by word position. A few extra beats use it, such as the stamps in 2c and the "?" words in row 0, so that something still changes every 2–4 s.
   - Nothing in the scenes uses a fixed number of seconds.

**Swapping in the real cue file:** once `video/audio/cues.json` exists, run `npm run check`. Everything re-times itself, and the composition length follows the new file. The check fails loudly if a row or cue is missing, if a cue falls outside its row, or if the cues are out of order.

### The edit list

`npm run timeline` writes `out/timeline.json`. Its `editList` has one entry per row:

| field | meaning |
|---|---|
| `videoIn` / `videoOut` | where the piece sits in the video (s) |
| `voIn` / `voOut` | what to cut from the VO file (s); `null` for holds |
| `music` | `M1` / `M2` / `M3` on the three holds |

`src/Soundtrack.tsx` does exactly this inside the composition (below), so you only need the edit list to check the cut or to mix elsewhere.

## Sound

`src/Soundtrack.tsx`, mounted in `Main.tsx`:

- **VO.** One `<Html5Audio>` per VO row, cut from `vo_edited.wav` at the edit-list boundaries and placed at its scene. Each piece is trimmed so that VO time `t` plays at `scene.start + (t − vo.from)`, the same mapping the cues use, so consecutive rows join sample-accurately with no gap or repeat. The holds (0.5, 2e, 6) are VO-silent. Where a piece meets a hold or the start/end, it fades over 3 frames; every cut sits in at least 0.2 s of room tone, so no word is touched. With placeholder timing there is no VO.
- **Music bed.** The `music.bed` slot in `assets.manifest.json`. Until it's `ready` with a file that exists in `video/assets/`, the video renders without music. To add a track (royalty-free and cleared for this use):
  1. Put it in `video/assets/music/`, set `file` to e.g. `"music/bed.mp3"` and `status` to `"ready"`.
  2. Run `npm run music:measure` and put the LUFS it prints in `value.lufs`.
  3. Optionally set `value.hits.M1/M2/M3` to the time (s) in the track of a beat drop, swell or final chord. The track is then spliced (0.5 s equal-power crossfade, under the VO at the start of the row before that hold) so the hit lands on the hold's first frame.
- **Levels.** Relative to the VO (−16 LUFS): `underVoDb` (default −19) while the VO speaks, `holdDb` (−5) in the holds. Ducking ramps down over 15 frames to 3 frames before a row's first word and back up over 10 frames after its last word. Rows less than 1.5 s apart stay ducked, so the music only comes up in the holds. On top of that, the arc from `VIDEO_STRUCTURE.md`: −3 dB soft intro until M1, −6 dB thin from "never" (C16) to "But" (C18), +3 dB swell through 2d into the showcase (M2), +2 dB lift from "shifted" (C39) to the bookend (C44), a 1 s fade-in, and a fade to silence from 1 s after M3 to the last frame.

## Assets

Every swappable asset is a slot in **[`assets.manifest.json`](assets.manifest.json)**. That file is the single list, and the code reads from it.

To swap in a real asset:

1. Drop the file in `video/assets/`. This is Remotion's public dir (see `remotion.config.ts`).
2. In the manifest, set the slot's `file` (or its `value`) and set `status` to `"ready"`.
3. Run `npm run stills -- 2d 2e` to look at it.

Until then, a slot draws a clearly labelled stand-in, for example a brand-coloured card with a red dashed **SLOT · known.screenshot** tag, an **FC** sticker reading **SLOT · fc.logo**, or `[Fellowship dates]`.

Brand fonts: the stand-ins use Inter. If a project's real font is open-licence, install it (`npm i @fontsource/<font>`), import it in `src/fonts.ts`, and put its CSS family in that project's `*.brand.font`.

Screenshots can carry an optional `crop` `{x, y, w}`, given as fractions of the image, to frame the useful part. The People Group Browser capture uses one to trim its side margins.

## What's on screen, and where it comes from

- **Generated in code** (`src/kit/`): paper grain and ruling (SVG `feTurbulence`), the desk and kraft cover, washi tape, pins, the paperclip, sticky notes, rubber stamps, and all marker and pencil strokes, which draw on via `pathLength`. Also the timeline thread and every doodle: mortarboard, books, seedling, terminal, clock, envelope, sunburst, thought cloud, the ring of people and the crumpled spreadsheet. No third-party images are used.
- **Fonts**, open-licence and bundled from npm `@fontsource`:
  - Caveat (handwriting), SIL OFL 1.1
  - Courier Prime (the cover letter), SIL OFL 1.1
  - Permanent Marker (marker lettering), Apache 2.0
  - Inter (fallback brand font), SIL OFL 1.1
  - Project brand fonts, all SIL OFL 1.1: Instrument Serif (Living Letter), Literata (KNOWN), Geist (Cadgy Clone), Newsreader (Portfolio)
- **Supplied by you:**
  - `arise-asia-logo.webp`
  - `cadgy-daily.jpg`, the Cadgy Clone daily puzzle
  - `livingletter-hero.png` and `livingletter-review.png`, pages 2 and 5 of the Living Letter brand guide
  - `livingletter-logo-cream.png`, from the Living Letter project
- **From the official site:** `fc-logo-mark.png`, the Frontier Commons mark from `https://frontiercommons.org/favicon.png`.
- **Captured on 2026-10-30 from your public apps:**
  - `pgb-list-filters.png`: the People Group Browser list and filters, from `https://fc-iota-sandy.vercel.app/?view=groups`
  - `known-home.png`: from `https://known-prototype-sigma.vercel.app/`, after choosing English
  - `known-pictures-wide.png`: the screen after **Begin** ("Which picture feels closest today?"), set onto a landscape canvas in the app's own background colour
  - `portfolio-home.png`: from `https://bennett-christian-portfolio.vercel.app/`

  The manifest records the colours read from each app.

## The motifs

- **The thread** (`kit/Thread.tsx`) is one procedural path whose states blend from 0 to 1: `draw`, `fray`, `tangle`, `lift` and `runOff`.
  - It starts in 1a and frays at "no clear direction".
  - It straightens at "room to grow" in 1b, where a seedling sprouts from the fray point.
  - It tangles at "never" in 2c and loosens on "learned".
  - It bends up at "shifted" in 5a and runs off the page at "recognise yet".
  - It runs along the bottom of every page in between.
- **Page turns** (`kit/Paper.tsx` `PageTurn`) lift the previous scene, frozen on its last frame with `FrozenScene`, off its left hinge. The 5b recap reuses the same mechanism to flip back through real frozen frames of 1a, 2a, 2e and 4b, then lands on 2f.
- **The bookend:** row 0's note (`kit/Recurring.tsx` `QuestionNote`) comes back in 5c. "good" and "true" are circled, "too" and "to be" are crossed out, and the "?" becomes "!". The title label returns in 5b, and the CONFIDENCE header from 2a returns in 4a.

## Layout

```
assets.manifest.json   every asset slot and its status
scripts/               sync-cues, check, timeline, stills (+ script-parse: reads VIDEO_STRUCTURE.md)
src/timing/            timeline.ts (pure builder), context.tsx (scene context + cue hooks)
src/kit/               scrapbook kit: Paper, Bits, Thread, Doodles, Project, Recurring, rough, Frozen
src/scenes/            Row0.tsx … Row6.tsx, one per script row; spread.tsx is shared by 2d/2e/2f
src/Main.tsx, Root.tsx the full composition and the per-row previews
```
