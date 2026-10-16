# Add Directional Relationship Graph And Derived Tiers

- **ID:** 0035
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0034

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Implement canonical pair keys, shared familiarity, directional affinity/trust/connection, contact metadata, peak tier and pure derived status/bond helpers. Support positive, negative and asymmetric relationships plus NPC↔NPC edges.

## Implementation guardrails

No UI/audio imports; tiers derived, not assigned; thresholds centralized; all values bounded.

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
