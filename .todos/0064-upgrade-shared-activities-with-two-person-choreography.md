# Upgrade Shared Activities With Two-Person Choreography

- **ID:** 0064
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0053 (implementation), 0058, 0061, 0063, 0069

## Problem

Shared activities currently coordinate navigation and static poses correctly, but participants mostly play the same simple activity animation.

## Sit and Chat

- both sit;
- turn heads toward each other;
- alternate speaker/listener gestures;
- occasional shared laugh/nod.

## Watch TV

- orient to TV;
- relaxed seated posture;
- occasional glance toward companion;
- brief synchronized reaction.

## Eat Together

- proper seated/meal posture;
- alternating eat/pause;
- glance toward partner during conversation.

**Also preserve the earlier economy correction:** shared eating must not create free food.

## Cook Together

Assign asymmetric roles:

```text
Actor A → stove/stir
Actor B → prep/watch/help
```

Occasionally swap micro-role.

Do not have both characters perform identical Stir animations in the same physical location.

## Read Together

- each oriented around book/bookcase context;
- reading posture;
- occasional discussion gaze/gesture.

## Implementation guardrails

- Shared effects still use canonical social resolver.
- Animation does not change activity success.
- Activity reservations stay authoritative.
- Leaving/cancellation releases all presentation constraints.

## Done when

- [ ] all five activities have distinct two-person motion.
- [ ] participants perform complementary rather than duplicate actions where appropriate.
- [ ] gaze/facing reflects shared object and partner.
- [ ] cancellation cleanly returns both to idle.

## QA requirements

- [ ] five-activity role/phase and four-rotation matrix.
- [ ] cancel/departure/object-change/save-load cleanup tests.
- [ ] no duplicate social, food-cost, memory or audio effects.
- [ ] Classic/Three browser checks, physical review and full suite/build/check/CI.

## Repository review and integration notes

Confirmed: shared activities coordinate approach/reservation, then mostly
use Sit/Eat/Idle. Preserve the current canonical effects and save/load transient
cancellation policy while adding complementary visual roles. The source refers
to an earlier food-economy fix, but current code restores hunger for shared meals
without any charge. That is an open correctness issue, captured separately as
0069 and a prerequisite here; it must not be silently treated as already fixed.
Use rotated neutral anchors and distinct participant slots; presentation cannot
create food, duplicate rewards or change interaction success.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
