# Add Npc Availability And Bounded Social Autonomy

- **ID:** 0042
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0036, 0038, 0040, 0041

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Add lightweight availability profiles and bounded visitor autonomy: greet, idle, occasional chat initiation, respond, leave. Autonomous choices use relationship, compatibility, memories, intent and seeded RNG.

## Implementation guardrails

No full off-lot simulation; cap initiation frequency; player actions take priority; negative autonomy requires traceable context.

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
