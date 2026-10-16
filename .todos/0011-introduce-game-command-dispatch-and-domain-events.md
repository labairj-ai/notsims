# Introduce Game Command Dispatch and Domain Events

- **ID:** 0011
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0004, 0005, 0006, 0007, 0008, 0010

## Problem

The UI currently calls domain mutation functions directly. As gameplay expands, this will couple presentation to implementation details and make replay, automation, structured failure handling and cross-system observability difficult.

## Proposed approach

- Introduce a lightweight command dispatcher representing player/system intent.
- Define initial commands for `MOVE_TO`, `INTERACT`, `CANCEL_ACTION`, `BUILD_ROOM`, tile/edge editing, `PLACE_OBJECT`, sell/erase, `CHANGE_JOB`, `START_SHIFT` and `CHANGE_APPEARANCE` where appropriate.
- Return a structured command result with success/failure code plus emitted domain events.
- Define stable event shapes for meaningful outcomes such as money spent/received, furniture placed/sold, action started/completed/cancelled, shift completed and bill charged.
- Keep systems authoritative for validation and mutation; dispatcher only routes/orchestrates.
- Migrate UI/controller callers incrementally behind a compatibility layer if needed.
- Keep human-readable toast copy in UI/presentation, mapped from stable failure/event codes rather than embedded deep in simulation where practical.

## Touches

- `src/game/commands.js`
- `src/game/dispatch.js`
- `src/game/events.js`
- relevant systems from 0004-0007
- `src/ui/` controllers
- `tests/commands.test.js`
- `tests/interface.test.js`

## Implementation guardrails

- Do not introduce Redux, a framework event bus or asynchronous messaging infrastructure.
- Commands must be plain serializable data where feasible.
- Domain events describe facts that occurred; they must not be used as an alternate hidden source of game state.
- Preserve current synchronous deterministic simulation.
- Do not change save schema solely to persist an event log in this task.
- Failed commands must not partially mutate authoritative state.
- UI must not regain direct mutation paths for commands already migrated.

## Done when

- [x] Major player mutations flow through a single documented dispatch contract.
- [x] Structured failures replace ad-hoc string coupling at the system boundary, with UI copy mapped separately where feasible.
- [x] Domain events are emitted for key state changes.
- [x] Same command against the same canonical state produces the same deterministic result.
- [x] Existing gameplay behavior remains unchanged.
- [x] Commands are serializable enough to support the scenario/replay harness in 0012.

## QA requirements

- [x] Unit tests cover successful and rejected commands and verify atomicity.
- [x] Tests verify event payloads for money, build/object and action/career outcomes.
- [x] Interface tests prove UI uses dispatcher paths for migrated actions.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] No new save incompatibility is introduced without the 0008 migration pipeline.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
