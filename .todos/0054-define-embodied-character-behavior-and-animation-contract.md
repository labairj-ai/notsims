# Define Embodied Character Behavior and Animation Contract

- **ID:** 0054
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0050, 0053 (implementation available)

## Problem

Character movement is currently represented primarily by five full-body animation clips:

`Idle · Walk · Sit · Eat · Sleep`

Social interactions, mood, attention, object use, and relationship context therefore produce little or no distinct body behavior.

Adding a unique full animation for every gameplay action would become difficult to maintain and would prevent reuse across objects, characters, moods, and social contexts.

## Proposed architecture

Define a layered presentation model:

```text
Simulation action/state
        ↓
EmbodiedBehaviorResolver
        ↓
BodyIntent
        ↓
CharacterAnimationController
        ├─ Base clip
        ├─ Action/gesture overlay
        ├─ Affect/posture overlay
        ├─ Gaze/head/torso target
        ├─ IK/contact targets
        └─ Micro-idle
```

Example:

```js
{
  base: "Stand",
  gesture: "TalkOpen",
  affect: {
    valence: 0.6,
    arousal: 0.4
  },
  lookAt: {
    type: "person",
    id: "person_1"
  },
  facing: "target",
  hands: [],
  posture: "open"
}
```

## Core rule

Animation is **presentation**, never gameplay authority.

Relationship effects, need changes, object use, action completion, pathing, money, memories, etc. remain controlled by simulation systems.

## Vocabulary

Document semantic movement categories:

**Locomotion**
- stand;
- walk;
- turn;
- arrive;
- stop.

**Posture**
- upright;
- relaxed;
- slouched;
- tense;
- leaning;
- seated;
- sleeping.

**Social gestures**
- wave;
- nod;
- shake head;
- open-hand gesture;
- conversational gesture;
- laugh;
- shrug;
- point;
- head dip;
- lean in;
- lean away.

**Object actions**
- reach;
- grab;
- release;
- push/pull;
- turn knob;
- stir;
- type;
- read;
- sit;
- lie down.

## Implementation guardrails

- No animation state in GameState unless it represents an actual gameplay action.
- No domain imports of Three.js.
- No animation name strings scattered through gameplay code.
- Body behavior must be renderer-neutral.
- Classic and Three consume the same semantic intent.
- Mood/body language must not change gameplay outcomes unless an existing gameplay system explicitly does so.

## Done when

- [x] `BodyIntent` contract documented.
- [x] animation layering order documented.
- [x] existing actions mapped to intended body behavior.
- [x] social actions mapped to intended gestures.
- [x] object actions mapped to intended interaction phases.
- [x] affect/mood overlay contract documented.
- [x] Classic fallback semantics documented.

## QA requirements

- Architecture dependency test.
- Resolver purity test.
- Existing replay output unchanged.
- Existing game tests pass.

## Repository review and integration notes

Confirmed at `69b09c6`: the character has a single active clip, while
`interactionPose` and `sharedActivityPose` provide limited neutral object poses.
Keep the new resolver in a renderer-neutral presentation layer, outside domain
systems. Document target coordinate spaces, actor IDs, intent lifetimes,
priorities, feature-disable behavior, pause/visibility clocks, and how completion
facts become short-lived reactions after an activity clears. Reuse the existing
shared-pose contract rather than maintaining competing pose authorities.

0053's implementation is available; its pending physical acceptance does not
block design work here. Define the controller interface now so 0065 can precede
procedural layers. Existing five clip names and save v3 remain supported.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.

## Implementation evidence (2026-10-16)

Software implementation and automated coverage are available. See
[behavior contract](../docs/architecture/embodied-character-behavior.md) and
[validation record](../docs/reviews/embodied-character-behavior-validation.md).
