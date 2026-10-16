# Add Social Network Introductions And Reputation Foundation

- **ID:** 0044
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** medium
- **Depends:** 0035, 0038, 0042, 0043

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Use NPC↔NPC edges for mutual-friend introductions and one-hop, source-attributed reputational priors/gossip. Direct experience must override weak priors. Do not add a global reputation XP number.

## Implementation guardrails

No propagation loops; one hop initially; gossip cannot instantly create Friend/Enemy; source and expiry required.

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
