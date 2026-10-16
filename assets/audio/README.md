# Notsims audio library

This release ships **35 original synthesized assets**, including three 40-second
instrumental pieces. All audio is local; no third-party pack, remote audio URL,
borrowed melody, voice recording or source-pack archive is shipped. Audio files
are dedicated to CC0-1.0; see [licenses](LICENSES.md) and the existing
[CC0 legal text](../CC0-1.0.txt).

## Production set and layout

- music/: Little Morning (menu/day), Clover Walk (day alternate), Porch Light
  (evening). Soft synthesized keys, bass and sparse melodic phrases. MP3, mono,
  64 kbit/s, 22050 Hz; note tails wrap at the phrase boundary for looping.
- sfx/ui/: subdued selection, confirmation, cancellation, error and rotation.
- sfx/build/: floor, wall, door, placement and sale feedback.
- sfx/foley/: two indoor and two outdoor step variations.
- sfx/interactions/: fabric, refrigerator, eating, flush, page and switch sounds;
  water/cooking/TV/typing loops. These are stylized synthesized foley, not field
  recordings. WAV, mono PCM16, 22050 Hz.
- ambience/: a quiet synthesized garden-breeze loop, also PCM WAV.

The initial production choice is this small original set. Candidate OGA/Kenney
packs in the task descriptions were not downloaded or licensed for this release.
There are no unused source-pack files or production WAV music masters. The lamp
switch cue is reserved: lamps currently have no gameplay use interaction.

## Provenance and regeneration

library.json is the per-file provenance/size/duration record. audio-library.js is
a generated JS copy for browser lookup; tests require exact equality. Every asset
records title, author, local source recipe, creation date, original/local filename,
format modifications and license. Music also records allowed states, loopability
and gain normalization. Future imported assets must additionally record actual
source URL, uploader, download date, original filename and archive-license proof.

Run `python3 scripts/generate-audio.py` from any directory with Python 3 and ffmpeg
(libmp3lame) installed. The script has a fixed synthesis seed; music and effects
are original recipes. Temporary WAV music masters are outside the repository.
Encoding may differ across ffmpeg versions; regenerate both manifests together.
Normal builds use committed derivatives and do not require Python or ffmpeg.

`node scripts/check-audio.mjs` validates headers, metadata, licenses, cue IDs,
references, unused audio files and budgets. `npm run build` runs the same check
against dist and writes assets/audio/manifest.json with cue-to-local-source
metadata. CI needs no external asset URL and fails on missing/bad references.

## Budgets

Before user gesture: **zero audio payload requested**. On unlock, essential UI
preload is **51,816 bytes**. Music streams only when selected; other sounds load
on demand. Full library: **1,898,360 bytes**. Decoded short-buffer planning
estimate at 48 kHz: **4,068,481 bytes**. These are byte budgets, not a promise of identical
browser memory allocation.

Warning / failure thresholds: total 2 MiB / 3 MiB; unlock preload 96 KiB / 128 KiB;
decoded short-buffer estimate and runtime buffer-cache hard limit 8 MiB. Maximum active short voices is 24;
maximum streaming music elements is two, including pending crossfades.
