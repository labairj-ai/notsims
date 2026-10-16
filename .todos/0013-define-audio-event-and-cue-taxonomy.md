# Define Audio Event and Cue Taxonomy

- **ID:** 0013
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0011, 0012

## Problem

Notsims now has commands, domain events and deterministic replay, but audio does not yet have a semantic contract. Wiring sound files directly to UI handlers, renderer branches or action implementation details would recreate coupling that the architecture refactor just removed.

Audio needs a stable taxonomy that translates game and presentation events into sound cues without putting file paths or playback rules into domain logic.

## Proposed approach

- Define audio buses: `master`, `music`, `sfx`, `ambience`, and `ui`.
- Define cue IDs independent of filenames, such as:
  - `ui.select`, `ui.confirm`, `ui.cancel`, `ui.error`
  - `build.floor.place`, `build.wall.place`, `build.door.place`, `object.place`, `object.sell`
  - `economy.purchase`, `economy.bill`, `career.shift.complete`, `career.promotion`
  - `movement.footstep.indoor`, `movement.footstep.outdoor`
  - `interaction.fridge.open`, `interaction.eat`, `interaction.shower.loop`, `interaction.toilet.flush`, `interaction.stove.loop`, `interaction.tv.loop`, `interaction.desk.type`, `interaction.book.page`, `interaction.bed.rustle`
- Keep domain events semantic. Domain events may expose `interactionId`, `objectType`, `actorId`, `position`, `result`, and other gameplay facts, but must never contain audio filenames.
- Add an `AudioCueResolver` contract that maps domain/presentation events to zero or more cue IDs.
- Define cue metadata for playback mode, bus, gain, variations, pitch jitter, cooldown, max polyphony, loop behavior, spatial behavior and preload group.
- Distinguish domain events from presentation-only events. Footstep cadence should be driven by visible movement progress rather than simulation-minute events.
- Document pause, fast-forward and hidden-tab audio policy.

## Touches

- `src/audio/audio-events.js`
- `src/audio/audio-cues.js`
- `src/audio/audio-cue-resolver.js`
- `docs/architecture/audio.md`
- `tests/audio-taxonomy.test.js`

## Implementation guardrails

- Do not modify commands/events solely to accommodate a specific sound file.
- Do not store file paths in domain events.
- Do not make renderers authoritative for interaction completion.
- Do not play one sound per simulated minute during fast-forward/catch-up.
- Audio failure must never block gameplay.
- Keep taxonomy extensible for future relationships, NPCs, weather and multiple floor/material types without implementing those systems now.

## Done when

- [x] Audio buses and cue naming conventions are documented.
- [x] Current player-visible commands/events are mapped to candidate cue IDs.
- [x] Current object interactions have stable semantic `interactionId` values usable by the resolver.
- [x] Presentation-only footstep/movement events are explicitly separated from domain events.
- [x] Pause, speed-change and hidden-tab playback policies are defined.
- [x] Cue metadata schema supports one-shot, loop, variation, cooldown, polyphony and optional spatial playback.
- [x] No audio asset filenames are required by gameplay systems.

## QA requirements

- [x] Taxonomy tests reject duplicate cue IDs and unknown bus names.
- [x] Resolver tests prove unmapped events safely produce no cue.
- [x] Existing deterministic command/replay tests remain unchanged.
- [x] `npm test` and `npm run build` pass.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
