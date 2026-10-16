# 0048 — Add Contextual Social Action Ranking and Progressive Disclosure

- **ID:** 0048
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0037, 0038, 0045, 0047

## Problem

The current social sheet proves that all interactions are available, but exposes too many choices at once.

A selected person can show nearly every interaction across several channels, creating a large mobile action list that feels like a debug/control surface rather than a natural conversation interface.

## Proposed approach

Add a pure domain/query helper:

```js
availableSocialActions(state, {
  actorId,
  targetId,
  channel,
  context
})
```

Return ranked actions with:

```js
{
  interactionId,
  label,
  eligible,
  disabledReason,
  rank,
  category,
  channel
}
```

Ranking inputs may include:

- relationship tier;
- recent memories;
- current dynamic;
- trust;
- familiarity;
- compatibility;
- visitor state;
- unresolved conflict;
- interaction cooldown;
- recent repetition;
- channel.

### Primary interaction surface

Show only 3–5 recommended actions initially.

Example stranger:

```text
Introduce Yourself
Ask About Interests
Chat

More…
```

Example friend:

```text
Chat
Tell a Joke
Ask About Their Day
Share Good News

More…
```

Example tense relationship:

```text
Apologize
Clear the Air
Give Space

More…
```

### More actions

Expanded action browser may group interactions:

- Friendly;
- Deep;
- Conflict;
- Repair.

Do not render every channel beside every action.

If interacting in-person, show in-person actions.

If viewing the phone, choose Call/Text first or expose channel in a concise secondary control.

## Mobile UX

Primary action list:

- large tap targets;
- no horizontal button clusters;
- selected person's name and relationship status visible;
- world remains visible behind the sheet.

## Implementation guardrails

- UI does not determine eligibility.
- Ranking must be deterministic.
- Do not hide actions permanently simply because they are low-ranked.
- Conflict actions remain reachable under More.
- No LLM-generated action list.
- Do not expose hidden relationship numbers by default.

## Done when

- [x] person sheet shows at most five primary actions;
- [x] action choices change with relationship context;
- [x] apology/repair actions surface after conflict;
- [x] stranger actions differ from close-friend actions;
- [x] ineligible actions cannot dispatch;
- [x] More exposes complete eligible interaction catalog;
- [x] phone and in-person contexts display appropriate channels.

## QA requirements

- [x] stranger ranking test;
- [x] friend ranking test;
- [x] enemy/rival ranking test;
- [x] recent-conflict ranking test;
- [x] cooldown filtering test;
- [x] mobile 320/390/430 layout checks;
- [ ] real-device acceptance;
- [ ] full suite and CI pass.



## Repository review and integration notes

Confirmed: `src/ui/social.js` renders the entire social catalog with multiple
channel buttons per action. Share eligibility logic between this pure query and
command preparation; validate again on dispatch/execution so stale sheets cannot
bypass rules. Ranking must be side-effect free: querying must not consume RNG,
create relationship edges, change history or advance cooldowns. Arrival choices
remain distinct from normal conversation actions. Consolidate physical-device
sign-off with 0052 while retaining this task's automated implementation evidence.

## Source

Reviewed and imported from the [shared social follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain), against implementation `91008ba695c8359c894baa83488c4ea43467359e`.
Source scope and acceptance criteria retained; dependency clarifications are recorded above.

## Implementation evidence

See [follow-up validation](../docs/reviews/social-followup-validation.md) and
[human acceptance](../docs/reviews/mobile-social-human-acceptance.md).
Physical/mobile/listening acceptance remains pending where required; implementation evidence does not certify it.
