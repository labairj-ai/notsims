# Audio acceptance record

Date: 2026-10-16. Baseline: `6334607`. Tasks **0013–0020 complete** in numeric
dependency order. This record describes local validation; it does not claim a
production deployment, GitHub push or remote CI result.

## Implemented outcome

A semantic cue resolver and one presentation audio service provide five mixer
buses, gesture unlock, original music, building/UI feedback, interaction foley,
owned activity loops, indoor/outdoor footsteps and subtle garden ambience.
Menu → Audio settings provides labelled live sliders and reversible Mute All.
Versioned device preferences remain separate from all world saves. The initial
production set is original synthesis, not imported OGA/Kenney packs. All 35 files
have CC0 provenance and a reproducible recipe; three are streamed music pieces.

## Automated acceptance

- `npm test`: **75 passed; zero failed/skipped**. The previous simulation,
  interface, rendering, frozen-baseline and deterministic replay suites pass.
- Focused checks cover taxonomy uniqueness/buses, local asset references and
  provenance, format headers, cue routing, atomic failure without success audio,
  unchanged audio-enabled command/time results and serialized GameState,
  cooldown/polyphony including pending decodes, independent loop handles,
  cancellation before decode, disposal during decode, memory limits, hidden
  suspension, mute restore, media failure backoff, cancel-safe crossfades,
  no-repeat playlists, indoor/outdoor surface selection and bounded real-time
  footsteps at 1×/3×/8×.
- Settings tests cover malformed/future versions, clamping, blocked storage,
  live labelled sliders, mute, persistence and new-game/import isolation.
- `npm run check`: all source, test and script syntax passes.
- `npm run build`: passes, verifies 71 reachable packaged modules, validates all
  audio assets, prints budgets and emits dist/assets/audio/manifest.json.
- `git diff --check`: passes.

The existing CI workflow runs these tests, syntax checks and the build without
any external asset URL, browser speaker or microphone requirement.

## Resource report

| Metric | Measured / planned | Warning | Failure limit |
| --- | --- | --- | --- |
| All production audio | 1,898,360 B | 2 MiB | 3 MiB |
| Essential unlock preload | 51,816 B | 96 KiB | 128 KiB |
| Audio requested before first gesture | 0 B | — | Must remain zero |
| Decoded short-buffer planning estimate at 48 kHz | 4,068,481 B | — | 8 MiB |
| Actual decoded buffer cache | Checked after resampling by backend | — | 8 MiB |
| Active/pending short voices | At most 24 | — | 24 |
| Active/pending music streams | At most 2 | — | 2 |

Failed or unavailable assets produce bounded diagnostics and never block game
startup/actions. There is no production WAV music master or unused source pack.

## Real-browser matrix

Installed **Chrome 155.0.8059.82**, isolated headless contexts, software WebGL,
no autoplay override, no audio hardware requirement. The packaged build was
served from localhost. Trusted browser clicks/keys triggered the actual unlock
path; the test did not resume contexts through an autoplay workaround.

| View | Viewport / input profile | Result |
| --- | --- | --- |
| Classic Canvas | 1440×1000 desktop | Pass |
| Classic Canvas | 390×844 mobile/touch emulation | Pass |
| Three.js | 1440×1000 desktop | Pass |
| Three.js | 390×844 mobile/touch emulation | Pass |

Every case verified zero audio requests before a gesture, context running after
unlock, actual decoding of every production WAV, MP3 playback readiness, menu →
day → evening transitions, no more than two music elements, shower arrival/loop/
cancel, keyboard-adjusted volume, mute/unmute, labelled 44-pixel range controls,
preferences surviving reload, and clean disposal. Desktop cases also verified
real hidden-tab silence/resume, forced corrupt decode without gameplay failure,
and fallback when stereo panning is unavailable. A separate no-AudioContext
startup completed New Game successfully.

Screenshots of classic/3D settings in both viewport sizes were visually checked:
no clipped controls or labels, clear focusable inputs and readable percentage
values. Local screenshots: `/private/tmp/notsims-audio-qa/`.

Reproduce with the optional `scripts/audio-smoke.mjs` harness and a separately
installed Puppeteer/Chrome (not a production or CI dependency):

```sh
# Serve dist/ on 127.0.0.1:5174 using the existing serve script.
node scripts/audio-smoke.mjs --url http://127.0.0.1:5174 \
  --puppeteer-module /absolute/path/to/puppeteer-module.js \
  --chrome /absolute/path/to/chrome
```

The module argument accepts a module exporting `puppeteer` or a default
Puppeteer export. Tests need neither speakers nor waveform comparisons.

## Coverage limits and explicit decisions

The browser matrix is Chrome desktop and mobile/touch viewport emulation. No
claim is made for physical Android/iOS hardware, Safari or Firefox. Those remain
additional browser acceptance targets. Headless playback/decode tests do not
replace a subjective listening/mix audition. The shipped soundscape is intentionally
small and synthesized; richer recorded household foley can later replace local
asset IDs after provenance and size checks.

Important feedback remains visible through funds, activities, needs, story and
toasts; there is no audio-only gameplay information. Decorative chairs/lamps do
not acquire new interactions simply for sound. Music/ambience continue through
normal pause/dialogs, interaction sound pauses, hidden tabs are silent, and a
browser-interrupted context waits for a valid gesture to resume.
