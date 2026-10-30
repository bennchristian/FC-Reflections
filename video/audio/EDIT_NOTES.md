# VO edit notes

**Source:** `~/Desktop/FC Reflection Video VO.m4a` (mono, 24 kHz AAC, 32 kbps), left untouched.
**Script:** `video/VIDEO_STRUCTURE.md` v6 (locked).

## Files

| File | What it is |
|---|---|
| `vo_edited.wav` | The master: 48 kHz, 24-bit PCM, mono |
| `vo_edited.m4a` | AAC at 160 kbps, 48 kHz mono, for convenience |
| `cues.json` | Row spans and `{Cxx}` cue times in seconds from the start of `vo_edited.wav` |
| `transcript_words.json` | Word timestamps for the edited audio |

## Duration

| | Seconds |
|---|---|
| Original | **158.89** |
| Edited | **144.91** (−13.98 s, −8.8 %) |

How it adds up (seconds):

- **Original:** 1.06 opening noise + 124.35 kept speech + 31.21 pauses + 2.27 trailing breath and room tone = 158.89.
- **Edited:** 0.30 lead-in + 124.35 kept speech + 19.65 new pauses + 0.60 tail + 0.015 crossfade = 144.91.

The speech is unchanged: nothing was time-stretched, sped up, reordered, or removed.

## What was cut

- **Opening (0.00–1.06 s):** a loud broadband noise burst (about −25 dBFS, probably a breath or handling noise) just before "When". Removed.
- **Ending (156.62 s onward):** a breath and room tone after the final "true". Replaced with a 0.6 s room-tone tail and a 0.3 s fade.
- **55 phrase gaps:** each was cut back to silence. Audible breaths, plus one mouth click (before "beyond"), went with them. Each gap was then refilled with room tone at the target length. The larger breaths sat before:
  - "When I first joined"
  - "At FC"
  - "but I adapted"
  - "and for Christian…"
  - "I can learn"
  - "This experience"
  - "All that said"
  - "Even as this Fellowship"
  - "I know I'd still"
  - "At the start"
  - "Two months later"
- **Left alone:** gaps under 0.2 s inside a phrase (stop closures and natural rhythm). A breath fused onto a word with no pause around it can't be cut without cutting the word, so those were left too.

### Gap targets used

| Kind | Count | Original | New |
|---|---|---|---|
| Between rows | 15 | 0.58–1.56 s | **0.60 s** (0.58 where the original was already shorter); measured voice-to-voice 0.60–0.71 s |
| Sentence end within a row | 9 | 0.31–0.81 s | **0.35 s** (or the original, if shorter) |
| Comma pause | 28 | 0.22–0.70 s | **0.25 s** (or the original, if shorter) |
| Mid-phrase hesitation | 3 | 0.36–0.63 s | **0.20 s** ("ministry / and", "work / beyond", "that / even") |

<details><summary>Every gap (original time of the cut, original gap → new gap, in seconds)</summary>

| Join | Cut at (orig s) | Orig gap | New gap |
|---|---|---|---|
| me, / my | 4.20 | 0.46 | 0.25 |
| were, / This | 5.87 | 0.54 | 0.25 |
| true. / When [1a] | 7.82 | 0.58 | 0.58 |
| joined, / I | 9.46 | 0.29 | 0.25 |
| transition. / I'd | 11.56 | 0.58 | 0.35 |
| bar, / I | 15.12 | 0.28 | 0.25 |
| go. / At [1b] | 17.03 | 0.90 | 0.60 |
| FC, / who | 21.25 | 0.37 | 0.25 |
| me. / There | 25.40 | 0.74 | 0.35 |
| mentorship, / discipleship | 27.22 | 0.26 | 0.25 |
| importantly, / room | 30.52 | 0.41 | 0.25 |
| skills. / In [2a] | 33.52 | 0.88 | 0.60 |
| hindsight, / the | 35.12 | 0.28 | 0.25 |
| confidence. / At [2b] | 38.34 | 0.90 | 0.60 |
| dataset. / I'd [2c] | 45.95 | 0.95 | 0.60 |
| before, / never | 48.66 | 0.38 | 0.25 |
| then, / but | 51.47 | 0.52 | 0.25 |
| adapted, / googled | 52.79 | 0.33 | 0.25 |
| spot. / I [2d] | 54.62 | 1.17 | 0.60 |
| ministry / and | 59.02 | 0.39 | 0.20 |
| code. / Through [2f] | 64.02 | 1.56 | 0.60 |
| all, / the | 66.21 | 0.30 | 0.25 |
| warm, / welcoming | 67.95 | 0.34 | 0.25 |
| welcoming, / and | 68.90 | 0.30 | 0.25 |
| produced. / I [3a] | 72.38 | 1.04 | 0.60 |
| possible. / Then | 77.10 | 0.31 | 0.31 |
| that. / Through [3b] | 83.32 | 0.92 | 0.60 |
| iteration, / I | 85.89 | 0.33 | 0.25 |
| doable. / That | 88.50 | 0.67 | 0.35 |
| me. / Just | 90.58 | 0.49 | 0.35 |
| way. / When [4a] | 94.17 | 0.93 | 0.60 |
| confidence, / I | 96.84 | 0.22 | 0.22 |
| steps. / I | 98.86 | 0.50 | 0.35 |
| appointment. / In [4b] | 103.95 | 1.00 | 0.60 |
| letter, / I | 105.85 | 0.39 | 0.25 |
| work / beyond | 109.85 | 0.63 | 0.20 |
| matters, / pointing | 111.80 | 0.30 | 0.25 |
| FC. / Before [4c] | 114.00 | 1.40 | 0.60 |
| that, / but | 117.68 | 0.70 | 0.25 |
| that / even | 120.89 | 0.36 | 0.20 |
| expertise, / I | 123.54 | 0.27 | 0.25 |
| learn, / and | 124.38 | 0.29 | 0.25 |
| done. / Without | 125.48 | 0.53 | 0.35 |
| first, / I | 128.06 | 0.36 | 0.25 |
| shot. / This [5a] | 130.91 | 0.99 | 0.60 |
| yet. / All [5b] | 137.57 | 0.81 | 0.60 |
| said, / if | 139.08 | 0.47 | 0.25 |
| again, / I'd | 140.63 | 0.41 | 0.25 |
| again. / Even | 141.98 | 0.81 | 0.35 |
| close, / I | 145.31 | 0.24 | 0.24 |
| me. / At [5c] | 148.80 | 0.65 | 0.60 |
| start, / I | 150.28 | 0.31 | 0.25 |
| true. / Two | 152.34 | 0.55 | 0.35 |
| later, / I | 153.76 | 0.38 | 0.25 |
| good, / and | 155.42 | 0.28 | 0.25 |

</details>

## Processing chain

1. **Upsample** 24 kHz → 48 kHz (polyphase). The source is 32 kbps AAC, so there's nothing above about 10–12 kHz to recover.
2. **High-pass** at 70 Hz to remove rumble.
3. **Light noise reduction.** The room noise was about −50 dBFS before gain, broadband at 40 Hz–3 kHz, like a fan or AC. It would have sat at about −44 dBFS after loudness gain. Applied stationary spectral reduction (`noisereduce`, `prop_decrease = 0.5`, about 6 dB at most), profiled on clean room tone. The gaps now measure about −50 dBFS.
4. **Cuts.**
   - Every cut point was set by hand from spectrograms, then snapped to the nearest quiet frame within 60 ms.
   - Each gap was refilled with real room tone taken from the recording's own silences, not digital silence.
   - Every join uses a 15 ms equal-power crossfade.
5. **Gentle compression** (2.5:1 above −20 dBFS, 6 dB knee, 5 ms attack, 120 ms release), then a true-peak limiter (4× oversampled, 5 ms lookahead). The limiter takes more than 3 dB off in only about 0.5 % of 10 ms frames.
6. **Result:** **−16.0 LUFS integrated, −1.2 dBTP** for the WAV. The M4A measures −16.0 LUFS and −1.1 dBTP after encoding.

**Word-final "s" sounds:** the speaker holds a long, strong "s" at the end of words (up to 0.2 s, in "confidence", "steps", "expertise", "close" and others). The first pass clipped some of them; ASR then heard "confident". Every join was then checked for high-band (4–9.5 kHz) energy and fixed. "groups, streamlined" is one continuous s–s sound with no real pause, so it was left uncut.

## Where the spoken words differ from the script

Nothing was cut or changed for any of these. They're as recorded.

| Row | Script | Spoken |
|---|---|---|
| 0 | "my initial thoughts were **that** this is too good to be true" | "my initial thoughts were, this is too good to be true" ("that" dropped) |
| 2d | "despite having minimal experience in code" | "despite having **very** minimal experience in code" |
| 2f | "the community was warm and welcoming, **caring** more about us as people than the things we **produce**" | "the community was warm, welcoming, and **cared** more about us as people than the things we **produced**" |
| 3a | "and **more** importantly the bandwidth" | "and **most** importantly, the bandwidth" |
| 3b | "I realised it was in fact doable" | "I realised **that** it was in fact doable" |
| 4a | "When I say I grew in confidence, I saw it in my next steps" | "When I say **that** I grew in confidence, I **really** saw it in my next steps" |
| 4c | "Before FC, I **wouldn't** have offered that" | "Before FC, I **don't think I would** have offered that" |
| 4c | "with the experience I had here" | "with the experience **that** I had here" |
| 4c | "I **wouldn't** have had the assurance" | "I **don't think I would** have had the assurance" |

**Not sure; worth listening:**

- **1a, "I'd just graduated":** two ASR passes both heard "I just". The "'d" may be swallowed rather than missing.
- **4b, "what I'd built at FC":** one ASR pass heard "what I built", the other "what I'd built".

**ASR mishearing, not a deviation:** "Claude Code" (2c) comes out of Whisper as "clock code". In `transcript_words.json` it is corrected to "Claude", with `"asr": "clock"` kept on the word.

None of the deviations touches a cue's trigger word. Rows 2f and 4c are 2–4 words longer than scripted, which accounts for some of the extra length in those rows.

## Cues

- **Placed:** all 51 `{Cxx}` cues in the script (C00–C46, with C09a/b/c and C36/C36b/C36c), in strictly increasing time order. M1–M3 (music cues) are left out, as asked.
- **Rows:** all 16 rows with a `[VO]` line are covered.
  - **Row `start`:** the first audible frame of the row's first word.
  - **Row `end`:** the end of its last word, including any final "s".
- **How cue times were set:** each cue sits at the onset of the first word after its tag.
  - Times come from the Whisper word timestamps on the edited file.
  - Where a word follows a pause, its onset is taken from the energy, because Whisper often starts such a word at the end of the previous one.
  - A cue on a row's first word uses the row's start.
- **Spot checks:** nine cues were checked visually on spectrograms: C00, C03, C09a, C17, C25, C26, C36b, C36c and C42.
- **Unplaced:** none.
- **Lower-confidence ASR on three cue words; placement is still fine:**
  - **C17** "Claude Code": heard as "clock"; the onset was checked by eye.
  - **C36** "Before FC": takes the row 4c start, from energy.
  - **C40** "recognise": low probability only because of the US/UK spelling.
- **Precision:** expect about ±30–50 ms for cues inside continuous speech, which is fine at 30 fps. Cues after a pause are tighter.

## Verification

- **Re-transcription:** the edited WAV was transcribed again (faster-whisper small.en) and diffed word by word against the original recording's transcript. Apart from spelling variants ("dataset"/"data set", "realized"/"realised") and the "I"/"I'd" ambiguity above, the word sequence is identical. That means no word was lost at a cut.
- **Diff against the script:** the result is exactly the deviation table above.
- **Durations:** these add up exactly, as shown in the Duration section.
- **What wasn't done: no listening test.** The edits were placed and checked with spectrograms, energy curves and ASR. Give the file one listen before the final mix.
