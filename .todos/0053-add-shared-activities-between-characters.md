# 0053 — Add Shared Activities Between Characters

- **ID:** 0053
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0036, 0037, 0043, 0050, 0052

## Problem

Characters can now communicate and maintain relationships, but most social gameplay consists of selecting conversation actions.

Relationships will feel substantially more alive when characters can **do things together** in the environment.

## Product goal

Support social activities such as:

- sit and chat;
- watch TV together;
- eat together;
- cook together;
- read together;
- hang out on the sofa.

These should use existing furniture and systems rather than becoming bespoke social minigames.

## Proposed architecture

Extend object interaction definitions with optional group/social interaction metadata.

Example:

```js
{
  id: "watch_together",
  objectType: "tv",
  participants: {
    min: 2,
    max: 3
  },
  duration: 60,
  effects: {
    fun: 1.0,
    social: 0.8
  },
  relationshipTags: ["shared_activity"]
}
```

Add shared activity state:

```js
{
  activityId,
  interactionId,
  objectId,
  participants,
  elapsed,
  total
}
```

### Initial shared activities

#### Sofa/chairs
- Sit and chat.

#### TV
- Watch together.

#### Table/food
- Eat together.

#### Stove
- Cook together.

#### Bookcase
- Read together / discuss books.

## Participant coordination

- player chooses activity and target NPC;
- validate both can reach appropriate interaction positions;
- reserve required positions;
- both characters navigate;
- activity starts once all required participants arrive;
- cancellation cleans both participants safely.

NPC visitor remains bounded; do not give them a full player queue.

## Relationship effects

Shared activities may:

- restore Social need;
- add connection;
- increase familiarity;
- create meaningful memories;
- interact with compatibility/interests.

Example:

Watching TV with someone who enjoys games/media may be slightly more effective than with someone uninterested.

Do not make every shared activity automatically positive.

## Memories

Potential memories:

- shared_meal;
- cooked_together;
- relaxed_together;
- watched_show_together;
- good_hangout;
- awkward_hangout.

Memory outcome may depend on:

- compatibility;
- current relationship;
- unresolved tension;
- activity completion.

## Rendering

Three/Classic should show both characters at appropriate object poses.

Reuse existing:

- Sit;
- Eat;
- Idle;
- interaction pose concepts.

Do not require new animation assets for the first implementation.

## Mobile UX

When an eligible visitor is present and furniture supports a shared action, person/object sheets may expose:

```text
Watch TV with Maya
Sit and chat
Have dinner together
```

Contextual ranking from 0048 should determine prominence.

## Implementation guardrails

- Reuse existing object/content interaction architecture.
- Do not hard-code shared social behavior in renderers.
- Do not create a parallel relationship-effect path.
- Shared activity effects go through canonical social interaction/effect services.
- Reservation/path failures must be atomic.
- No multi-household control.
- No parties yet.

## Done when

- [ ] at least four shared activities work;
- [ ] both participants visibly navigate to/use the object;
- [ ] activity affects needs and relationship separately;
- [ ] memories may result;
- [ ] cancellation cleans both participants;
- [ ] unreachable/occupied objects fail safely;
- [ ] Classic and Three render equivalent social activity state;
- [ ] mobile contextual action UI exposes shared activities naturally.

## QA requirements

- [ ] two-participant reservation tests;
- [ ] path failure tests;
- [ ] cancel-mid-activity tests;
- [ ] need/relationship effect tests;
- [ ] save/load policy documented for active shared activity;
- [ ] deterministic replay scenario;
- [ ] Classic/Three browser checks;
- [ ] physical mobile smoke check;
- [ ] full suite/build/check/CI pass.

## Repository review and integration notes

Keep 0052 as the requested release-readiness gate before this next major
feature. Implement at least four shared activities as a staged subset of the
listed candidates; document which ones ship. Reservation, participant validation
and costs must commit atomically, and interruption/departure/object deletion must
release every reservation. Explicitly choose a safe active-activity save/load
policy before implementation and test it. Shared relationship effects must use
the actor-aware resolver from 0047/0050 and repetition policy from 0049.
Physical smoke evidence for these new activities is additional to 0052's baseline
certification.

## Source

Reviewed and imported from the [shared social follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain), against implementation `91008ba695c8359c894baa83488c4ea43467359e`.
Source scope and acceptance criteria retained; dependency clarifications are recorded above.
