# Add Invitations Planned Hangouts And Visit Lifecycle

- **ID:** 0041
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0039, 0040

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Add Invite over now, schedule later/tomorrow, cancellation, ask guest to leave, persistent visit-plan lifecycle and phone display of upcoming plans.

## Implementation guardrails

Home-lot only; no parties/overnights; inaccessible-lot failure cannot unfairly damage relationship; plans survive save/load.

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
- [ ] GitHub CI passes before deployment.

## Source

Created from the 2026-10-16 Notsims social-simulation design review.

## Implementation evidence

Implemented; see [social validation](../docs/reviews/social-simulation-validation.md).
