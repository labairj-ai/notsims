# Add Procedural Gaze, Head, and Torso Awareness

- **ID:** 0056
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0054, 0055, 0065 (controller foundation)

## Problem

Characters currently face a coarse action direction but do not visibly attend to people or objects.

During conversations, both characters can appear to stare past one another or remain unnaturally rigid.

## Proposed approach

Add a presentation-only awareness controller.

Possible targets:

```text
person
object
interaction point
arrival point
temporary glance target
none
```

Apply look behavior in layers:

```text
eyes/head
→ neck
→ upper torso
→ full-body facing only when necessary
```

## Social gaze

Speaker behavior:

- look toward partner;
- periodically avert gaze;
- return gaze around key action moments;
- avoid continuous staring.

Listener behavior:

- somewhat more sustained attention;
- occasional nod;
- gaze shift during long conversations.

Research suggests gaze behavior contributes to rapport and conversational turn-taking, but excessive mutual gaze can feel unnatural. 

## Object attention

Characters should look toward:

- fridge handle while opening;
- stove while cooking;
- book while reading;
- TV while watching;
- interaction partner while talking.

## Technical approach

After `AnimationMixer.update()`:

1. locate head/neck/spine bones;
2. compute target direction;
3. clamp rotation;
4. blend procedural rotation with authored animation.

Initial limits should prevent owl-like head movement.

## Implementation guardrails

- Do not use simulation RNG.
- Presentation variation must not alter replay.
- No continuous perfect target lock.
- Disable/attenuate head tracking while sleeping or during clips that require fixed orientation.
- Clamp angular velocity.

## Done when

- [ ] conversational partners visibly attend to each other.
- [ ] characters look toward used objects.
- [ ] gaze occasionally averts during conversation.
- [ ] head/torso movement remains anatomically plausible.
- [ ] no neck snapping during target changes.

## QA requirements

- target switching test;
- angular clamp tests;
- missing-bone graceful fallback;
- NPC/player parity;
- physical/mobile visual review.

## Repository review and integration notes

Implement against 0065's foundation so procedural rotations have a single
owner and do not accumulate on top of their previous frame. Reset from the base
pose before applying bounded offsets; define local/world transform conversion
and head/neck/spine weights explicitly. Player, visitor and creator clones must
not share mutable procedural state. Actor/time variation uses a presentation
clock/hash, never `state.social.rngState`; hold/clear targets safely on pause,
hide, departure, state replacement and feature disable.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.

## Implementation evidence (2026-10-16)

Software implementation and automated coverage are available. See
[behavior contract](../docs/architecture/embodied-character-behavior.md) and
[validation record](../docs/reviews/embodied-character-behavior-validation.md).
Physical/mobile, human motion and any audible-output requirements remain pending;
automated results do not certify them.
