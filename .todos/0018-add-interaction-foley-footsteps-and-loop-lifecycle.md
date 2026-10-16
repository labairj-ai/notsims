# Add Interaction Foley, Footsteps and Loop Lifecycle

- **ID:** 0018
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0013, 0014, 0015, 0017

## Problem

Life-sim audio quality depends more on contextual foley than on generic confirmation sounds. Notsims needs data-driven audio for furniture interactions, movement and long-running activities without encoding audio branches inside the renderer or action engine.

## Proposed approach

- Extend interaction content with semantic audio cue references or resolver metadata for start/loop/complete/cancel phases.
- Initial interaction coverage:
  - bed/sofa/chair: fabric/chair movement
  - fridge: open/close
  - snack/eat: bite/crunch
  - stove: ignition/start plus low cooking loop
  - toilet: flush
  - shower: water start/loop/stop
  - TV: low TV/static/program ambience loop
  - desk: typing loop
  - bookcase/read: page turn
  - lamp: switch click
- Add footsteps using presentation movement progress rather than simulation-minute ticks.
- Support indoor/outdoor variants now and leave `surface` metadata extensible for future flooring materials.
- Start/stop interaction loops from semantic activity lifecycle events with unique playback handles.
- Stop loops immediately on action cancellation, object deletion, game reset, save load or renderer/game teardown.
- Add simple optional positional/spatial playback for world SFX in 3D while keeping classic mode behavior sensible.

## Touches

- `src/content/interactions.js`
- `src/audio/audio-cue-resolver.js`
- `src/audio/audio-manager.js`
- movement/presentation event adapter
- cue manifest and audio assets
- `tests/interaction-audio.test.js`
- Three/classic browser checks

## Implementation guardrails

- Interaction definitions may name semantic cue IDs, never raw file paths.
- Footstep cadence must follow visible movement and must not multiply with simulation speed.
- Loop playback must never outlive the action that owns it.
- Audio must not determine interaction duration or completion.
- Avoid voice acting/NPC speech in this phase.
- Spatial audio is enhancement only; it must not create different gameplay behavior between classic and 3D modes.

## Done when

- [x] Every currently interactive furniture type has either an intentional audio mapping or an explicit no-audio decision.
- [x] Long-running shower/stove/TV/typing loops start and stop cleanly.
- [x] Walking produces bounded footsteps independent of simulation tick count.
- [x] Cancel/reset/load/teardown leaves no orphaned loops.
- [x] Classic and 3D modes share the same semantic cue mapping.

## QA requirements

- [x] Tests cover loop ownership/cancellation and no orphan loops.
- [x] Fast-forward tests prove footstep/SFX count is bounded by presentation events rather than simulated minutes.
- [x] 3D positional playback falls back safely when spatial APIs are unavailable.
- [x] Mobile and desktop browser checks pass.
- [x] `npm test` and `npm run build` pass.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
