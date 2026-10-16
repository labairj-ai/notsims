# Implement Browser Audio Engine and Mixer Buses

- **ID:** 0015
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0013

## Problem

Notsims needs one presentation-layer audio service that handles browser autoplay restrictions, mixer buses, one-shots, loops, crossfades and graceful failure. Playback scattered across UI/rendering modules would be difficult to test and control.

## Proposed approach

- Implement a single `AudioManager` or equivalent presentation service.
- Use Web Audio API gain nodes for `master`, `music`, `sfx`, `ambience`, and `ui`.
- Use decoded buffers for short one-shot SFX.
- Use an `HTMLAudioElement`/media source or another memory-efficient path for longer music tracks.
- Require an explicit `unlock()`/resume call from the first valid user gesture, such as New Game or Resume.
- Implement `playCue`, `startLoop`, `stopLoop`, `setBusGain`, `mute`, `suspend`, and `resume`.
- Support cue variation, bounded pitch variation, cooldown and max-polyphony.
- Use handles/tokens for loops so an interaction can stop only the loop it started.
- Suspend or appropriately mute non-UI playback when the document is hidden; recover cleanly on return.
- Fail silently to gameplay with diagnostics if Web Audio is unavailable or an asset cannot decode.

## Touches

- `src/audio/audio-manager.js`
- `src/audio/web-audio-backend.js`
- `src/audio/audio-cues.js`
- application/bootstrap integration
- `tests/audio-manager.test.js`
- browser smoke tests

## Implementation guardrails

- Audio is presentation state, not authoritative game state.
- Playback must not affect deterministic replay or command results.
- Do not preload every music track into decoded memory.
- Do not create unbounded overlapping sounds.
- Muting a bus must not stop domain actions.
- `AudioContext` must be resumed only from allowed user gestures; no autoplay workarounds.
- Game startup must succeed even if every audio asset fails.

## Done when

- [x] Audio engine has independent master/music/SFX/ambience/UI gain control.
- [x] First user gesture reliably unlocks playback.
- [x] One-shots, loops and loop cancellation work.
- [x] Cooldown/polyphony prevent sound spam.
- [x] Hidden-tab and resume behavior is deterministic from the presentation perspective.
- [x] Missing audio does not crash or block the game.

## QA requirements

- [x] Unit tests use a fake/mock backend rather than requiring browser audio in Node.
- [x] Browser tests cover unlock, mute, loop start/stop and failed decode.
- [x] Existing simulation/replay outputs are byte-for-byte/structurally unchanged by enabling audio.
- [x] `npm test` and `npm run build` pass.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
