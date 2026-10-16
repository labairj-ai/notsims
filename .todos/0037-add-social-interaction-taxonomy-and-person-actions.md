# Add Social Interaction Taxonomy And Person Actions

- **ID:** 0037
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0035, 0036

## Problem

Notsims needs this capability as part of the first persistent social-simulation ecosystem.

## Proposed approach

Create data-driven person interactions across Introduction, Friendly, Deepening, Conflict and Repair; add serializable `SOCIAL_INTERACT`; path the player to a conversation position; separate Social-need effects from relationship effects and memories.

## Implementation guardrails

No LLM dialogue; no tier assignment; no UI/audio imports; failures atomic; negative actions player-initiated initially.

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
