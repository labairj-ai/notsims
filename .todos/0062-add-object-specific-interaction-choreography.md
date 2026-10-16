# Add Object-Specific Interaction Choreography

- **ID:** 0062
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0061, 0065

## Problem

Generic `Idle/Eat/Sit/Sleep` visual states undersell the existing object interaction system.

## Choreography phases

Every complex use action can expose:

```text
approach
orient
prepare
contact
active
release
settle
```

## Bed

```text
walk to side
turn
sit on edge
lie down
sleep
sit up
stand
```

## Sofa

```text
approach
turn
sit
settle/recline
unwind
stand
```

## Fridge

```text
face fridge
look at handle
reach
open
lean/look inside
retrieve food
close
eat
```

## Stove

```text
face stove
reach control
start
stir/tend
plate/eat
settle
```

## Bookcase

```text
look at shelf
reach
retrieve book
hold/read
return/settle
```

## Desk

```text
sit/position
orient to desk
type/work
occasional pause/stretch
finish
```

## Shower

```text
approach
reach control
enter/orient
shower posture
turn off
exit
```

## Toilet

```text
turn
sit
idle
stand
```

Keep bathroom behavior tasteful and abstract.

## Audio synchronization

Animation phase should align with existing semantic audio:

```text
fridge reach/contact → fridge.open
finish → fridge.close
stove contact → ignite
shower start → water-start
shower finish → water-stop
```

Audio remains event-driven; animation does not directly play sounds.

## Done when

- [ ] each active furniture type has intentional choreography.
- [ ] semantic audio occurs near appropriate motion phase.
- [ ] cancellation leaves character in valid pose.
- [ ] no object penetration beyond acceptable limits.

## QA requirements

- [ ] object-by-object phase and interrupt scenario matrix.
- [ ] audio phase correlation without duplicate cues or gameplay effects.
- [ ] Classic/Three rotation and cancellation checks.
- [ ] full suite/build/check/CI and human visual acceptance.

## Implementation guardrails

- Presentation cannot mutate gameplay state, consume simulation RNG or delay completion.
- Preserve renderer-neutral intent, Classic fallback and safe interrupt cleanup.
- Record human review honestly and retain existing certification requirements.

## Repository review and integration notes

Audit existing semantic action/audio phases before assigning timings. Visual
phases must align to existing facts and clocks without emitting extra gameplay
facts or moving money/need/action-completion authority into animation. If richer
phase facts are needed, specify a separate semantic contract and deduplicate
existing audio rather than playing sounds directly from mixer callbacks. Define
compressed-phase behavior for short/cancelled actions and 8× speed. Bathroom
choreography remains abstract and uses the existing clothed character.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
