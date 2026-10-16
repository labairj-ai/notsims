# Add Mobile First Social Ui And Notifications

- **ID:** 0045
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0037, 0039, 0040, 0041, 0042, 0032

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Make social gameplay mobile-first: tap person → bottom social sheet; Live-mode phone with notifications; relationship profile showing label/known interests/recent memories; incoming call/text/visitor as compact non-blocking card; large thumb targets.

## Implementation guardrails

No gameplay rules in UI; no hover-only actions; keep world visible; safe areas; do not expose every hidden number by default.

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
