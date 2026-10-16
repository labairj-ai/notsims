# Extract Action Queue and Interaction System

- **ID:** 0005
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0002, 0003

## Problem

The action queue and begin/tick lifecycle are the central gameplay execution path, but they are embedded inside `engine.js` and coupled to hard-coded action kinds and furniture fields. This will become the main bottleneck for richer object interactions, autonomy and additional characters.

## Proposed approach

- Extract queue ownership, enqueue limits, cancellation and current-activity lifecycle into an Actions system.
- Separate action definition from action execution.
- Preserve current action kinds: walk, use, snack, nap, chat, stretch and work.
- Introduce a neutral interaction definition shape for object actions without yet changing player-visible behavior.
- Convert current furniture need/rate/duration/verb/cost/skill metadata into a form the action system can resolve consistently.
- Keep reachability/path selection delegated to Navigation.
- Keep action effects delegated to owning systems where practical rather than making Actions own every domain rule.
- Preserve the rule that work blocks home actions and early cancellation forfeits pay.

## Touches

- `src/systems/actions/actions.js`
- `src/systems/actions/queue.js`
- `src/systems/actions/interactions.js`
- `src/content/interactions.js` or equivalent
- `src/engine.js`
- `tests/actions.test.js`
- `tests/engine.test.js`
- `tests/three.test.js`

## Implementation guardrails

- Behavior-preserving refactor first; do not add new furniture interactions in this TODO.
- Queue cap remains 5.
- Existing action labels, durations, meal costs, recovery rates and animations remain unchanged.
- Movement timing remains 2 game-minutes per tile and must remain speed-invariant.
- Path changes that invalidate the next step must still cancel safely.
- Object interaction reachability must use canonical interaction targets and never teleport the simulation character through blocked cells.
- Do not make Three.js animation state authoritative for action completion.

## Done when

- [x] `enqueue()`, `cancel()`, action begin and action advancement are no longer authored as a monolithic block in `engine.js`.
- [x] Action definitions and execution are separated enough that a future object can expose multiple interactions without adding a top-level engine conditional for each one.
- [x] Existing quick actions and object-use actions produce identical state changes.
- [x] Work lifecycle still integrates correctly with queue/cancel behavior.
- [x] Focused tests cover queue limits, unreachable objects, changed paths, cancellation, meal cost, need completion and speed invariance.
- [x] `engine.js` remains a compatibility facade while callers are migrated.

## QA requirements

- [x] Existing bed recovery, work completion/cancel and fast-forward equivalence tests pass.
- [x] Existing fractional frame walk test passes.
- [x] Existing interaction-pose tests remain valid.
- [x] `npm test` and `npm run build` pass.
- [x] No save-schema change is introduced in this task.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
