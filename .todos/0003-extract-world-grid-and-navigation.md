# Extract World Grid and Navigation

- **ID:** 0003
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0001, 0002

## Problem

Grid geometry, furniture footprint math, collision, wall-edge handling, interaction targets and pathfinding currently live inside `engine.js`. These rules are foundational and will be reused by building, object interactions, autonomy and future multi-character behavior.

## Proposed approach

- Extract `SIZE`, key/inside helpers and wall-edge geometry into a core grid module.
- Extract item footprint and rotated furniture-point calculations into an object geometry module.
- Extract collision/blocking and breadth-first pathfinding into a navigation module.
- Keep navigation pure: inputs are state/world plus target, outputs are path or `null`.
- Preserve wall/door semantics, furniture blocking, rug behavior and interaction-target orientation exactly.
- Re-export compatibility symbols from `engine.js` during the transition.

## Touches

- `src/core/grid.js`
- `src/core/navigation.js`
- `src/systems/objects/geometry.js`
- `src/engine.js`
- `tests/navigation.test.js`
- `tests/engine.test.js`
- `tests/three.test.js`

## Implementation guardrails

- No pathfinding algorithm change beyond moving code unless a defect is exposed by existing tests.
- Doors remain passable; solid walls and non-flat furniture remain blocking.
- Flat rugs remain non-blocking and may share occupied floor.
- Interaction targets must continue rotating with furniture and match 3D interaction poses.
- Navigation modules may depend on neutral state/content helpers but never on DOM, Canvas or Three.js.
- Preserve deterministic path results where existing tests or visible behavior depend on current neighbor ordering.

## Done when

- [x] Grid coordinate and edge helpers are isolated from `engine.js`.
- [x] Furniture rotation/footprint/interaction geometry is isolated.
- [x] `blocked()` and `pathTo()` are owned by navigation.
- [x] Existing engine callers continue to receive identical results.
- [x] Navigation has direct focused tests for boundaries, walls, doors, furniture, unreachable targets and rotated interaction targets.
- [x] Classic and 3D picking/interaction tests continue to agree with simulation coordinates.

## QA requirements

- [x] Existing starter-home accessibility test passes.
- [x] Existing wall/door movement tests pass.
- [x] Existing rotated furniture interaction tests pass.
- [x] Add direct navigation unit coverage rather than relying only on engine integration tests.
- [x] `npm test` and `npm run build` pass.
- [x] No renderer becomes authoritative for collision or path selection.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
