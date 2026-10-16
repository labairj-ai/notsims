# Add Animation Controller, Layering, Transitions, and Interrupt Safety

- **ID:** 0065
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0054, 0055

## Problem

`Human.play()` currently selects a single clip and performs a fixed `.22s` crossfade.

That is insufficient once characters have:

- base movement;
- gesture overlays;
- mood offsets;
- gaze;
- IK;
- action phases.

## Proposed controller

Create:

```text
CharacterAnimationController
```

with separate concepts:

```text
base locomotion/action
one-shot gesture
procedural posture
gaze
IK
micro-motion
```

Possible update order:

```text
1. AnimationMixer base clip
2. overlay/one-shot clip
3. authored pose blending
4. affect posture adjustment
5. gaze/head/torso
6. IK/contact correction
7. final safety clamps
```

Three.js animation actions already support independent weights, time scales, fades, and crossfades. 

## Interrupt behavior

Define transitions for:

- cancel;
- visitor leaves;
- object removed;
- path changes;
- relationship interaction interrupted;
- save/load transient cancellation;
- tab/page hidden;
- game pause.

Never leave a hand stuck at an old IK target.

## Playback rates

Define explicit policy for 1×/3×/8× simulation.

Do not blindly run a social gesture at eight times human speed.

Suggested:

```text
simulation positional progression → game speed
presentation clip speed → clamped curve
```

Example:

```text
1× → 1.0
3× → ~1.5
8× → ~2.0
```

with activity state still completing according to simulation time.

## Implementation guardrails

- Animation timing cannot delay simulation completion.
- Presentation state is not serialized.
- Reset returns all bones to valid base animation.

## Done when

- [ ] base + gesture + gaze + IK can coexist.
- [ ] interruptions cleanly reset all layers.
- [ ] no stuck bones after cancellation.
- [ ] transitions remain smooth at 1×/3×/8×.

## QA requirements

- [ ] layer masks/order/weights and simultaneous base/gesture/gaze/IK tests.
- [ ] interrupt/reset/missing-clip and actor-clone isolation tests.
- [ ] 1×/3×/8× plus pause/hidden/frame-rate timing matrix.
- [ ] no animation persistence or gameplay changes; full suite/build/check/CI.

## Repository review and integration notes

Dependency correction: the source lists 0055–0064 as prerequisites but also
recommends this controller before gaze/gestures/IK. Build the controller foundation
after 0054/0055, with extension points and no-op optional layers. Subsequent
0056/0058/0059/0061 use that API; final combined-layer integration is checked in
0067/0068. Do not make this controller depend back on its consumers.
Specify skeletal masks/additive-vs-override math, one-shot completion/cleanup,
layer priority, missing-clip fallbacks and ownership/disposal. Separate simulation
position interpolation from bounded presentation rate, with pause freezing and
visibility/reset rules. Both update order and parameter limits need tests.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
