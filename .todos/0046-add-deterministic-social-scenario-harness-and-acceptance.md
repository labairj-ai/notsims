# Add Deterministic Social Scenario Harness And Acceptance

- **ID:** 0046
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0034, 0035, 0036, 0037, 0038, 0039, 0040, 0041, 0042, 0043, 0045

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Extend replay/scenario QA with seeded stories: meet neighbor, become friends, drift/reconnect, conflict/repair, unexpected visit accept/decline, phone maintenance, scheduled visit across save/load, unavailable contact, visitor rendering and mobile social sheet.

## Implementation guardrails

No wall-clock/network/locale dependence; randomness explicit; assert invariants not prose; require migrated-save scenario and physical mobile acceptance.

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
Physical mobile acceptance remains open; automated scenarios do not close it.
Implementation SHA: `91008ba695c8359c894baa83488c4ea43467359e`. [CI passed](https://github.com/labairj-ai/notsims/actions/runs/38967199599).
