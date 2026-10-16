# Wire Domain Events to Gameplay Sound Effects

- **ID:** 0017
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0013, 0014, 0015

## Problem

Core game feedback should gain sound without coupling gameplay systems to the audio backend. Commands/events now provide the correct integration seam.

## Proposed approach

- Add an audio event subscriber/projection that receives emitted domain events and resolves them through `AudioCueResolver`.
- Cover first-wave one-shot feedback:
  - UI select/confirm/cancel/error
  - floor/wall/door construction
  - object placement/rotation/sell/invalid placement
  - purchase success/failure where appropriate
  - bill charged
  - shift complete/paycheck
  - promotion
  - action cancellation where useful
- Keep user-facing audio restrained; not every domain event requires a sound.
- Apply cooldown/coalescing to bursty build interactions.
- Allow event metadata such as position to be passed to the audio layer without embedding playback policy in the event.

## Touches

- `src/audio/audio-event-subscriber.js`
- `src/audio/audio-cue-resolver.js`
- command/event application wiring
- cue manifest
- `tests/audio-events.test.js`

## Implementation guardrails

- Domain systems must not import `AudioManager`.
- Do not add sound-file paths to commands or events.
- Failed commands must not emit success sounds.
- Replaying a deterministic trace in headless tests must not require audio.
- Do not queue delayed sounds for historical events after a long hidden-tab catch-up.
- UI error sounds require rate limiting.

## Done when

- [x] First-wave gameplay events produce the correct semantic cues.
- [x] Rejected operations never produce success cues.
- [x] Domain modules remain independent of audio implementation.
- [x] Audio can be disabled entirely without changing game behavior.
- [x] Burst/coalescing policy prevents build-mode sound spam.

## QA requirements

- [x] Resolver/subscriber tests cover each supported event family.
- [x] Atomic failure tests prove no success audio is resolved for failed commands.
- [x] Deterministic replay tests remain unchanged.
- [x] `npm test` and `npm run build` pass.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
