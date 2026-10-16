# Extract Career, Progression and Economy Systems

- **ID:** 0007
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0002, 0005, 0006

## Problem

Jobs, wages, shift completion, raises, skill pay modifiers, bills and household funds are coupled inside engine tick/action logic and career UI assumptions. These systems will need independent evolution for meaningful long-term progression.

## Proposed approach

- Create a Career system that owns job selection validation, shift setup, shift completion and promotion/raise calculations.
- Create an Economy system that owns funds mutations, affordability helpers and periodic household bills.
- Make wage calculation a deterministic function of job definition, completed shifts and skill.
- Keep bill scheduling based on game day and preserve once-only charging semantics.
- Keep Actions responsible for activity lifecycle while Career owns career-specific rules/results.
- Centralize money mutations enough to make future event/replay auditing possible without introducing a full ledger yet.

## Touches

- `src/systems/careers/careers.js`
- `src/systems/careers/progression.js`
- `src/systems/economy/economy.js`
- `src/systems/economy/bills.js`
- `src/engine.js`
- `src/main.js` only for mechanical imports if necessary
- `tests/careers.test.js`
- `tests/economy.test.js`
- `tests/engine.test.js`

## Implementation guardrails

- Preserve all three current jobs, hours and base pay.
- Preserve 15% raise per three completed shifts and current skill wage modifier.
- Preserve energy >= 15 requirement to start work.
- Preserve early-leave no-pay behavior.
- Preserve household bill formula and every-third-day cadence.
- Negative household funds remain allowed if bills drive the balance below zero, matching current behavior.
- Do not add career levels, schedules, coworkers, taxes or new jobs in this task.

## Done when

- [x] Job/shift/wage rules are outside `engine.js`.
- [x] Bill cadence and bill amount calculation are outside `engine.js`.
- [x] Money mutation helpers are explicit enough to identify reason/source in future command-event work.
- [x] Career panel can still display the exact effective wage produced by the same canonical calculation used for work pay.
- [x] Focused tests cover all jobs, promotions, skill modifier, insufficient energy, early cancellation and bill idempotence.
- [x] Save representation for job, shifts, skill, money and `billsDay` remains unchanged.

## QA requirements

- [x] Existing advertised-wage, raise, cancellation and bills tests pass.
- [x] Add parity test proving UI wage calculation and simulation wage calculation use one source of truth.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] No economic tuning changes are mixed into the extraction.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
