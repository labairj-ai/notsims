# 0050 — Decompose Social System Into Focused Modules

- **ID:** 0050
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0047, 0048, 0049

## Problem

`src/systems/social/social.js` now owns:

- relationship math;
- memories;
- compatibility;
- communication;
- availability;
- visitors;
- event scheduling;
- plans;
- autonomy;
- relationship drift;
- introductions;
- social RNG behavior.

The module is becoming the same type of catch-all that the original architecture refactor removed from `engine.js`.

## Proposed approach

Extract behavior-preservingly into:

```text
src/systems/social/
  relationships.js
  memories.js
  compatibility.js
  interactions.js
  communication.js
  availability.js
  visitors.js
  scheduler.js
  plans.js
  autonomy.js
  discovery.js
  social.js
```

`social.js` becomes a thin public facade/orchestrator.

Recommended ownership:

### relationships.js
- relationship lookup;
- pair keys;
- dimensions;
- derived tiers;
- bond/dynamics.

### memories.js
- add memory;
- expiry;
- bounded memory rules.

### compatibility.js
- compatibility calculation.

### interactions.js
- canonical social interaction resolution;
- repetition effects.

### communication.js
- channel validation/effects;
- phone contact preparation.

### availability.js
- NPC availability profiles.

### visitors.js
- arrival;
- presence lifecycle;
- departure.

### scheduler.js
- next social opportunity;
- candidate weighting;
- deterministic event selection.

### plans.js
- invitations;
- scheduled hangouts.

### autonomy.js
- bounded NPC-initiated social actions.

### discovery.js
- person discovery eligibility;
- introductions.

## Implementation guardrails

- Behavior-preserving refactor.
- No balance changes bundled into extraction.
- No circular imports.
- Keep a stable facade where useful.
- Domain modules may not import UI/audio/rendering.
- Do not introduce DI container/ECS/framework.

## Done when

- [x] social monolith is decomposed;
- [x] no social file owns unrelated responsibilities;
- [x] public behavior remains unchanged;
- [x] all existing 101+ tests continue passing;
- [x] scenario replay outputs are unchanged;
- [x] module dependency scan remains cycle-free.

## QA requirements

- [x] before/after replay equality;
- [x] architecture dependency test;
- [x] source-cycle check;
- [x] full suite/build/check/CI pass.



## Repository review and integration notes

Confirmed: the current social facade owns relationships, effects, scheduling,
visits, plans, autonomy and discovery. Capture deterministic fixtures after
0047–0049, then compare extraction against that baseline. Preserve the existing
public exports and save/command compatibility; module names are an ownership
proposal rather than a requirement to create empty wrappers. Keep maintenance
and RNG ownership explicit, with a cycle-free graph.

## Source

Reviewed and imported from the [shared social follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain), against implementation `91008ba695c8359c894baa83488c4ea43467359e`.
Source scope and acceptance criteria retained; dependency clarifications are recorded above.

## Implementation evidence

See [follow-up validation](../docs/reviews/social-followup-validation.md) and
[human acceptance](../docs/reviews/mobile-social-human-acceptance.md).

Implementation: `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`; [CI passed](https://github.com/labairj-ai/notsims/actions/runs/38975851836).
