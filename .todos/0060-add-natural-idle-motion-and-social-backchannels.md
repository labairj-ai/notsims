# Add Natural Idle Motion and Social Backchannels

- **ID:** 0060
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0055, 0056, 0059, 0065

## Problem

Static or perfectly repeating characters read as artificial, particularly while waiting, listening, or standing near another person.

Natural postural oscillation has been shown to improve perception of virtual-character realism and emotional presence. 

## Add micro-behaviors

Neutral idle:

- breathing;
- small weight shifts;
- subtle torso sway;
- infrequent head movement;
- occasional glance.

Listening:

- slight nod;
- posture adjustment;
- gaze return;
- brief gaze aversion.

Waiting:

- look around;
- weight shift;
- subtle phone/glance behavior later.

## Timing

Use long irregular presentation intervals.

Avoid:

```text
nod every 4 seconds
glance every 6 seconds
```

which becomes visibly robotic.

Use deterministic presentation noise or actor/time hashing rather than simulation RNG.

## Suppression

Micro-idle should reduce or stop during:

- walking;
- strong action clips;
- sleeping;
- object reach;
- active argument gestures.

## Implementation guardrails

- No gameplay events generated.
- Reduced-motion preference should suppress unnecessary micro-motion.
- Keep movement low amplitude.

## Done when

- [ ] idle characters no longer appear frozen.
- [ ] listeners visibly acknowledge conversation.
- [ ] idle behavior does not repeat on an obvious short loop.
- [ ] reduced-motion mode remains comfortable.

## QA requirements

- [ ] presentation timing determinism without social RNG changes.
- [ ] suppression/interrupt/target-change tests for player and visitors.
- [ ] reduced-motion live preference changes and pause/hide tests.
- [ ] browser motion-loop review and full suite/build/check/CI.

## Repository review and integration notes

0059 is a real prerequisite, so this item cannot precede affect support in
the source's suggested order. Use low-amplitude per-actor presentation variation,
with deterministic tests around timing windows instead of wall-clock sleeps.
Keep breathing/weight shifts, listener backchannels and strong action overlays
under a shared priority/suppression policy. No persistent fields, domain RNG
consumption or extra social effects are allowed.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
