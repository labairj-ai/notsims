# Add Social Save V2 And Starter People Roster

- **ID:** 0034
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0033, 0008

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Advance the save schema intentionally and add a stable player actor ID, 6–8 persistent starter NPCs, contacts, empty relationship graph, social scheduler/RNG state and bounded social collections. Migrate v1 saves without changing existing money/home/career/needs/time.

## Implementation guardrails

Stable IDs never derived from names; migration pure/deterministic; no infinite procedural population; no UI state in GameState.

## Done when

- [x] Domain behavior is implemented through existing command/event boundaries.
- [x] Save/replay behavior is deterministic where state is persistent.
- [x] Classic and Three remain behaviorally compatible where world presence is involved.
- [x] Mobile-primary interaction remains usable where UI is involved.
- [x] New state is validated and bounded.

## QA requirements

- [x] Focused unit/integration tests cover success and failure paths.
- [x] Existing deterministic scenarios remain valid or intentionally migrated.
- [x] `npm test`, `npm run build`, and `npm run check` pass.
- [x] GitHub CI passes before deployment.

## Source

Created from the 2026-10-16 Notsims social-simulation design review.

## Implementation evidence

Implemented; see [social validation](../docs/reviews/social-simulation-validation.md).
Implementation SHA: `91008ba695c8359c894baa83488c4ea43467359e`. [CI passed](https://github.com/labairj-ai/notsims/actions/runs/38967199599).
