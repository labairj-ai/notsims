# Add Background Music Director

- **ID:** 0019
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0014, 0015, 0016

## Problem

Background music should support the life-sim atmosphere without becoming a hard-coded single loop. A small music director can select tracks by game context, handle clean transitions and remain independent of simulation authority.

## Proposed approach

- Add a `MusicDirector` that requests semantic music states from presentation/application context.
- Initial states:
  - `menu`
  - `home.day`
  - `home.evening`
  - optional `build` only if auditioning proves it improves the experience
- Start with a small playlist rather than a large soundtrack.
- Crossfade between tracks/states; do not abruptly restart music on panel changes.
- Avoid immediate repeats when several tracks are eligible for the same state.
- Keep random track choice outside authoritative simulation/replay. Use presentation randomness or a deterministic presentation-only seed if tests need repeatability.
- Continue music during normal pause/menu overlays unless user mutes it; stop/suspend appropriately when the document is hidden.
- Use track metadata for title, source, loopability, allowed states and gain normalization.

## Recommended initial audition set

- Menu: OpenGameArt `Cozy Puzzle Title` (CC0).
- Day/home: OpenGameArt `Cozy Puzzle In-Game 1` (CC0).
- Day/home alternate: OpenGameArt `Cozy Puzzle In-Game 3` (CC0).
- Evening alternate: OpenGameArt `Feel good slow ambient track with a beat` (CC0).
- Optional stylistic test: OpenGameArt `Sims Type-Beat` (CC0).

## Implementation guardrails

- Music selection is presentation behavior and must not modify GameState.
- Do not advance/change tracks because of render-frame count.
- Do not load the entire music library into decoded memory.
- Respect autoplay unlock rules.
- Crossfades must be cancel-safe when the user rapidly starts/new-loads games.
- Keep shipped playlist small enough for reasonable browser/mobile download size.

## Done when

- [x] Menu and in-game music states are implemented.
- [x] Tracks loop or transition without obvious gaps under supported browsers.
- [x] Music crossfades and avoids immediate repeats.
- [x] Changing tabs/panels does not unnecessarily restart music.
- [x] Pause, hidden-tab, mute and resume behavior match the documented audio policy.
- [x] Game behavior/replay is unchanged when music is enabled or disabled.

## QA requirements

- [x] Music director unit tests use fake timing/audio backends.
- [x] Browser checks cover unlock, crossfade, mute and resume.
- [x] Audio bundle-size report remains within the budget from 0014.
- [x] `npm test` and `npm run build` pass.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
