# 0079 — Add Generic Away Need Affordance Engine

- **ID:** 0079
- **Status:** completed
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0077

## Problem

Need decay currently assumes the active home lot is where needs are satisfied.

During a rabbit-hole activity, however, characters reasonably have access to some basic facilities.

Examples:

- employee restroom;
- school restroom;
- workplace lunch break;
- hospital facilities;
- food during a long scheduled event.

Simply allowing every need to decay continuously while the player has no control creates frustration.

Freezing every need would eliminate meaningful preparation.

## Goal

Introduce generic deterministic **Away Need Affordances**.

Example policy:

```js
{
  bladder: {
    mode: "auto-care",
    triggerBelow: 35,
    target: 80,
    duration: 5,
    cooldown: 90
  },

  hunger: {
    mode: "break",
    triggerBelow: 30,
    target: 65,
    duration: 20,
    maxUses: 1
  },

  energy: {
    mode: "decay"
  },

  hygiene: {
    mode: "decay"
  },

  fun: {
    mode: "decay"
  },

  social: {
    mode: "activity-effect"
  }
}
```

Exact tuning values should be centralized and tested.

## Away care model

Away need care must not replace the primary activity.

Do not turn:

```text
work
```

into:

```text
toilet action
```

Instead Work may contain bounded internal away-care state:

```js
awayCare: {
  need: "bladder",
  kind: "bathroom_break",
  elapsed: 0,
  total: 5
}
```

or equivalent deterministic internal policy.

The work shift clock continues while the character takes a bathroom/lunch break.

## Generic API

Suggested responsibilities:

```js
awayNeedPolicy(activity)
advanceAwayNeeds(state, activity, step, events)
eligibleAwayCare(state, activity)
```

Away Need behavior belongs in a reusable away subsystem, not directly in UI or renderer code.

## Event vocabulary

Emit semantic events when useful:

```text
AWAY_CARE_STARTED
AWAY_CARE_COMPLETED
```

Payload:

```js
{
  activity: "work",
  care: "bathroom_break",
  need: "bladder"
}
```

Avoid emitting every minute.

## Guardrails

- Away care is deterministic.
- No `Math.random()`.
- Home furniture is not required.
- Do not secretly maximize all needs.
- Need values remain 0–100.
- Trait need modifiers remain respected where applicable.
- Away care cannot create money or relationship effects unless explicitly defined.

## Done when

- [ ] generic away need policy exists.
- [ ] work uses it without career-specific direct need hacks.
- [ ] away-care state is bounded.
- [ ] policies can be reused by future school/appointment systems.
- [ ] save/load behavior is defined.
- [ ] rapid time compression does not duplicate away-care events.

## QA requirements

- [ ] threshold boundary tests.
- [ ] cooldown tests.
- [ ] large-step equivalence tests.
- [ ] save/load during active away care.
- [ ] deterministic replay.
- [ ] full suite/CI.

## Repository-specific integration notes

Need decay and trait modifiers already have simulation ownership. Add away affordance policy as a generic system called from authoritative simulation advancement, not from a renderer or UI. Store only bounded in-progress care data when it cannot be derived; do not persist a copy of static policy configuration. Keep event emission semantic and sparse so larger time steps cannot duplicate care episodes.

This task defines reusable behavior; 0080 supplies the initial Work-specific bladder and hunger policy.

## Source

Imported from the [Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a), checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3. Proposed behavior and acceptance criteria are retained; repository integration notes clarify current module ownership and sequencing.

## Current status

Completed in the away activity implementation. Away need affordances run as deterministic bounded simulation episodes and only active progress is serialized.

