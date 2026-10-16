# Define Social Simulation Contract

- **ID:** 0033
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0011, 0012

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Define the social architecture contract before gameplay code: people identity, directional relationship graph, compatibility, memories, phone/channels, visitors, plans, availability, autonomy, drift, RNG, persistence, rendering and mobile UX. Adopt `docs/architecture/social-simulation.md` as the contract.

## Implementation guardrails

No gameplay changes; no ECS/framework; no romance in this epic; preserve commands/events and deterministic replay.

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
