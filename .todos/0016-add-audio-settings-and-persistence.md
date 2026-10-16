# Add Audio Settings and Device-Local Persistence

- **ID:** 0016
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0015

## Problem

Players need separate control over music and effects, and browser games must remember those preferences. Audio preferences are device/user settings, not world simulation state, so they should not be mixed into game save migrations.

## Proposed approach

- Add settings for Master, Music, Sound Effects, Ambience and UI volume plus Mute All.
- Store settings in a separate versioned local preference record, for example `notsims.settings.v1`.
- Do not include device audio settings in exported/imported game saves.
- Add an Audio/Settings section reachable from the current menu.
- Apply changes live through AudioManager gain nodes.
- Clamp values to safe ranges and recover defaults from malformed preference records.
- Preserve settings across new games, resumes and save imports.

## Touches

- `src/settings/settings.js`
- `src/ui/` settings/menu module
- `src/audio/audio-manager.js`
- `src/style.css`
- `tests/settings.test.js`
- `tests/interface.test.js`

## Implementation guardrails

- Do not add audio preferences to `GameState`.
- Save imports must never unexpectedly change local volume preferences.
- Mute must be reversible without losing the user's prior slider values.
- Controls require keyboard-accessible labels and touch-friendly targets.
- Avoid playing a loud test sound on every slider movement; use bounded preview behavior.

## Done when

- [x] Independent volume controls exist and update live.
- [x] Mute All works without destroying previous volumes.
- [x] Audio settings persist separately from game saves.
- [x] Malformed settings recover to documented defaults.
- [x] New game/resume/import workflows preserve device-local audio preferences.

## QA requirements

- [x] Unit tests cover settings validation/versioning.
- [x] Interface tests cover sliders, mute and persistence.
- [x] Imported v1/current game saves remain unaffected.
- [x] Desktop and mobile browser smoke checks pass.
- [x] `npm test` and `npm run build` pass.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
