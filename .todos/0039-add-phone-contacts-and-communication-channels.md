# Add Phone Contacts And Communication Channels

- **ID:** 0039
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0035, 0037, 0038

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Add reusable `in_person`, `phone_call` and `text` channels; character-owned phone UI with Contacts/Recent/Invitations; specific-person calls/texts/check-ins/apologies; availability-aware synchronous calls; retire generic invisible `Call a friend` behavior.

## Implementation guardrails

No real network dependency; phone UI owns no relationship rules; contacts reference valid IDs; channel effects centralized.

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
