# Extract Needs, Traits and Mood System

- **ID:** 0006
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0002, 0005

## Problem

Need decay, trait modifiers, need recovery and mood calculation are embedded in the global simulation tick. This makes it difficult to deepen needs later with thresholds, moodlets, contextual modifiers or autonomy inputs without expanding one central function.

## Proposed approach

- Create a Needs system that owns need initialization, decay, clamping and recovery helpers.
- Create a Mood module that owns the current aggregate mood label calculation.
- Move trait effects affecting needs into explicit trait modifier helpers.
- Keep current need IDs and values unchanged.
- Have the action system request/apply need effects through Needs-owned helpers where practical.
- Keep future extension points documented for thresholds/moodlets without implementing new gameplay in this TODO.

## Touches

- `src/systems/needs/needs.js`
- `src/systems/needs/mood.js`
- `src/systems/character/traits.js`
- `src/engine.js`
- `tests/needs.test.js`
- `tests/engine.test.js`

## Implementation guardrails

- Preserve current decay rates exactly.
- Preserve creative skill-action multiplier and active/social trait effects exactly, including current semantics.
- Values remain clamped to 0-100.
- Mood labels and thresholds remain unchanged.
- Do not introduce moodlets, failure states, death, autonomy or new traits in this extraction.
- Needs code must be simulation-only and independent of progress-bar colors or DOM text.

## Done when

- [x] Need initialization and decay no longer live in the central engine implementation.
- [x] Mood calculation is isolated and directly unit tested.
- [x] Trait need modifiers have one authoritative implementation.
- [x] Actions recover needs through stable Needs-system helpers or contracts.
- [x] Existing saves remain valid without migration.
- [x] Focused tests cover each trait modifier, clamping, decay equivalence and mood thresholds.

## QA requirements

- [x] Existing need recovery and fast-forward equivalence tests pass.
- [x] Compare representative 1x versus chunked/fast tick results for exact equivalence.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] No player-visible balance or copy changes.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
