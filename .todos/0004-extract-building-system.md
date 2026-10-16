# Extract Building and Placement System

- **ID:** 0004
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0002, 0003

## Problem

Room construction, tile construction, object placement, selling/refunds and build-time validation are mixed with unrelated simulation behavior inside `engine.js`. Build/Furnish is a major player-facing capability and needs an independent boundary before it becomes more sophisticated.

## Proposed approach

- Create a Building system that owns room construction, floor/wall/door edits and construction costs.
- Create or align an object placement module that owns `canPlace()`, buy/place and sell/refund rules.
- Keep atomic construction behavior: validation and affordability must complete before persistent mutation.
- Centralize current build prices and refund rules as named policy constants or content, without changing values.
- Preserve free room entrance behavior and the rule preventing walls from bisecting existing furniture.
- Keep public compatibility exports until UI decomposition is complete.

## Touches

- `src/systems/building/building.js`
- `src/systems/building/placement.js`
- `src/systems/objects/objects.js`
- `src/engine.js`
- `tests/building.test.js`
- `tests/engine.test.js`

## Implementation guardrails

- No balance changes: floor $12/tile, wall $18/edge, door $35, furniture sell refund 65%, current wall/floor removal refunds unchanged.
- Failed build/buy operations must not partially mutate money or world state.
- Build operations remain blocked while an activity or queue is active, matching current behavior.
- No renderer-specific placement rules.
- Preserve the current save representation for floors, walls and furniture.
- Do not combine this refactor with new room types, roofs, multi-floor buildings or expanded catalog content.

## Done when

- [x] `room()`, `buildTile()`, `canPlace()` and buy/place/sell responsibilities are no longer authored in `engine.js`.
- [x] Costs and refund policy have one authoritative definition.
- [x] Invalid or unaffordable room creation is atomic and leaves state unchanged.
- [x] Existing starter house and empty-lot behavior remain unchanged.
- [x] Focused tests cover room cost, free entrance, wall-through-furniture protection, object overlap, rugs, selling and out-of-bounds edits.
- [x] `engine.js` is reduced to orchestration/facade responsibilities for these behaviors.

## QA requirements

- [x] Existing room-building and selling tests pass.
- [x] Add explicit before/after deep-state assertions for rejected operations.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Classic and 3D placement previews still use the same canonical `canPlace` result.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
