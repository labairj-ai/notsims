# Add Audio Regression, Performance and Accessibility QA

- **ID:** 0020
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0016, 0017, 0018, 0019

## Problem

Audio can create regressions that normal simulation tests do not catch: autoplay failures, orphaned loops, excessive overlap, mobile decode problems, large downloads, hidden-tab playback and inaccessible volume controls.

## Proposed approach

- Add a focused audio health/QA suite using a fake audio backend plus browser smoke tests.
- Validate:
  - cue manifest integrity
  - file existence and supported formats
  - provenance/license entry for every third-party file
  - bounded polyphony and cooldown
  - no orphan loops after cancel/reset/load/navigation
  - autoplay unlock path
  - mute/volume persistence
  - hidden-tab suspend/resume
  - music transition/crossfade cancellation
  - audio-disabled graceful degradation
- Add audio bundle-size reporting to CI with a warning/failure threshold.
- Add a developer debug view or console diagnostic that shows active loops/bus gains/current music track when debug mode is enabled.
- Verify controls remain keyboard accessible and that the game communicates important state visually rather than relying on sound alone.

## Touches

- `tests/audio-*.test.js`
- browser smoke checks
- CI/build asset validation
- optional `src/audio/audio-debug.js`
- `docs/reviews/audio-validation.md`

## Implementation guardrails

- No test should require speakers, microphone access or real audio hardware.
- Important gameplay information must never be audio-only.
- CI must not rely on external asset URLs.
- Avoid brittle waveform-level tests; test routing, lifecycle, state and timing contracts.
- Performance thresholds must be explicit and documented rather than silently changed.

## Done when

- [x] All audio assets have verified provenance and resolve from the local build.
- [x] No orphan loops remain after every teardown/cancel path.
- [x] Polyphony and cooldown limits are proven by tests.
- [x] Supported desktop/mobile browser matrix passes audio unlock and playback smoke checks.
- [x] Audio-disabled mode and decode failures leave gameplay fully functional.
- [x] CI reports audio bundle size.
- [x] `docs/reviews/audio-validation.md` records final acceptance evidence.

## QA requirements

- [x] Full existing test suite passes.
- [x] All focused audio tests pass.
- [x] Build and syntax checks pass.
- [x] Classic and 3D browser checks pass at desktop and mobile sizes.
- [x] No deterministic replay output changes solely because audio is enabled.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
