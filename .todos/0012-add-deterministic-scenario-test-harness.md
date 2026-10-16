# Add Deterministic Scenario and Replay Test Harness

- **ID:** 0012
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0008, 0011

## Problem

Current unit/integration tests cover many important invariants, but complex life-simulation regressions will increasingly occur across system boundaries. The project needs reusable scenario tests that execute realistic command sequences over game time and make future random/autonomous behavior reproducible.

## Proposed approach

- Add a scenario harness that can start from a canonical new game, fixture or migrated save.
- Execute a sequence of serializable commands plus explicit time advancement.
- Capture command results/events and final canonical state for assertions.
- Add representative scenarios for a morning routine, furniture use, a work shift, building/furnishing and multi-day bills.
- Add a deterministic RNG abstraction/seed contract for future simulation randomness, but do not add random gameplay merely to exercise it.
- Define a replay trace format that can be logged by tests/dev tooling without requiring production persistence yet.
- Make scenario failure output identify the command/time step that diverged.

## Touches

- `tests/helpers/scenario.js`
- `tests/scenarios/*.test.js`
- `src/core/rng.js` or equivalent deterministic RNG interface
- `docs/architecture/scenario-replay.md`
- command/event modules from 0011
- persistence fixtures from 0008

## Implementation guardrails

- Scenario tests must not depend on wall-clock time, browser locale, network access or render frame rate.
- Explicit game-time advancement remains deterministic and speed invariant.
- Do not snapshot giant opaque state blobs as the only assertion strategy; assert meaningful invariants and selected canonical state.
- RNG must be injectable/seeded before any future random simulation behavior relies on it.
- Do not persist replay history into normal saves in this task unless separately justified with a versioned migration.
- Scenarios must use public command/system interfaces rather than reaching into private implementation details to force outcomes.

## Done when

- [x] Scenario harness can run command -> advance time -> assert state/event sequences.
- [x] At least four realistic cross-system scenarios exist.
- [x] A scenario can be rerun from the same initial state/seed/commands with identical results.
- [x] Failures report the exact scenario step and relevant state/event difference.
- [x] Replay trace format is documented.
- [x] Future autonomy/random-event work has a deterministic RNG contract available before it is introduced.

## QA requirements

- [x] Existing unit/interface/render suites continue to pass.
- [x] Scenario suite includes normal-speed versus chunked-time equivalence where relevant.
- [x] Include one scenario beginning from the frozen legacy save fixture/migrated state.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] CI runs scenario tests by default with no environment-specific skip.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
