# 0084 — Harden Optional Away-Policy Affordances

- **ID:** 0084
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0077–0083
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Problem

The Away Activity architecture supports future policy names such as:

- school;
- appointment;
- travel.

Those placeholder policies do not yet define Bladder/Hunger affordances.

`advanceAwayNeeds()` currently assumes those configurations exist when an Away Activity is actively simulated.

Work is safe, but a future Away consumer could crash if introduced without duplicating Work's complete policy structure.

## Goal

Make Away policies safely composable.

Policies may explicitly omit a need affordance.

Example:

```js
{
  kind: "appointment",
  affordances: {
    bladder: null,
    hunger: null
  }
}
```

or:

```js
{
  affordances: {}
}
```

must remain valid.

## Proposed behavior

An omitted affordance means:

```text
no special Away self-care for that need
```

Normal need decay still happens through the existing Needs system.

## Implementation

Make queries conditional:

```js
const bladder = policy.affordances?.bladder;
const hunger = policy.affordances?.hunger;

if (bladder && ...)
```

Add policy validation so malformed policy definitions fail during development rather than during gameplay.

Suggested:

```js
validateAwayPolicies(AWAY_POLICIES)
```

## Guardrails

- Do not add Work-specific branching.
- No default magical need restoration.
- Missing affordance must not mean frozen need.
- Existing Work behavior must remain byte-for-byte equivalent where practical.

## Done when

- [x] Work remains unchanged.
- [x] empty-affordance Away policy can advance safely.
- [x] partial policy can advance safely.
- [x] malformed policy fails validation.
- [x] synthetic School/Appointment/Travel ticks do not throw.

## QA

- [x] Work regression.
- [x] empty policy.
- [x] partial policy.
- [x] save/load.
- [x] deterministic replay.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
