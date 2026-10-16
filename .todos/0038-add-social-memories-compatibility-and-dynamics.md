# Add Social Memories Compatibility And Dynamics

- **ID:** 0038
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0035, 0037

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Add bounded meaningful memories, deterministic compatibility from interests/traits/social styles, and a small set of derived dynamics such as Warm, Distant, Tense or Volatile. Let context influence uncertain interaction outcomes through seeded RNG.

## Implementation guardrails

Direct experience outranks compatibility; no single failed joke causes a permanent penalty; no arbitrary hostility; bounded memory count.

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
