# Add Classic Renderer Expressive Pose Parity

- **ID:** 0066
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0054, 0058, 0059, 0062

## Problem

Classic mode cannot use skeletal animation or IK, but should not lose the meaning of the new body behavior system.

## Proposed approach

Expand the 2D character recipe to accept semantic presentation fields:

```js
{
  posture,
  facing,
  gesture,
  gazeDirection,
  lean,
  armPose,
  activityPose
}
```

Add visual approximations for:

- wave;
- talk;
- nod;
- head shake;
- laugh;
- lean;
- argument;
- apology;
- reach;
- read;
- cook;
- type.

Classic does not need frame-perfect equivalence.

It needs **semantic equivalence**.

## Implementation guardrails

- Same BodyIntent feeds both renderers.
- Do not maintain separate gameplay mappings.
- Keep Classic cheap enough for lower-powered mobile devices.

## Done when

- [ ] major social gestures readable in Classic.
- [ ] major object actions readable in Classic.
- [ ] mood/posture states distinguishable.
- [ ] shared activities remain understandable.

## QA requirements

- [ ] same-intent Classic/Three semantic comparison matrix.
- [ ] person picking and all four object rotations.
- [ ] reduced-motion and bounded render cost.
- [ ] browser and physical readability review; full suite/build/check/CI.

## Repository review and integration notes

The current Classic recipe has a simple seated approximation and meal prop.
Extend the same BodyIntent contract rather than another action→pose switch.
Resolve gestures/mood in shared presentation queries and let Classic draw cheap
approximations. Include facing, readable hands/head orientation and shared roles;
exact skeletal/IK fidelity is not required. Missing detail must still preserve
actor identity, person picking, safe object positioning and motion preferences.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
