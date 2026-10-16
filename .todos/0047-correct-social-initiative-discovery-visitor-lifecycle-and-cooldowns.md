# 0047 — Correct Social Initiative, Discovery, Visitor Lifecycle, and Cooldowns

- **ID:** 0047
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0039, 0040, 0041, 0042
- **Regression baseline:** 0046 automated scenarios (available; physical certification remains open)

## Problem

The social simulation foundation is working, but several correctness issues remain:

- incoming calls/texts answered by the player are currently counted as player-initiated contact;
- autonomous visitor check-ins bypass the canonical social interaction/effect pipeline;
- undiscovered NPCs such as coworkers may become eligible for spontaneous events before the player has legitimately met them;
- a waiting drop-in visitor can potentially be targeted before the arrival decision has been resolved;
- visitor frequency is controlled mainly by recent contact rather than explicit visit cooldowns.

These issues weaken reciprocity, discovery progression, and visit lifecycle integrity.

## Proposed approach

### Explicit interaction actors

Social actions must carry:

```js
{
  actorId,
  targetId,
  interactionId,
  channel,
  initiatedBy
}
```

For an incoming call:

```text
actorId = person_1
targetId = player
initiatedBy = person_1
```

Answering the call must not increment `initiations.player`.

### Canonical social effect pipeline

Create or extract one function responsible for resolving completed social exchanges:

```js
resolveSocialInteraction(state, {
  actorId,
  targetId,
  interactionId,
  channel,
  source
}, events)
```

Player-driven, incoming, and autonomous social interactions must all use it.

Do not directly mutate relationship dimensions or Social need from visitor autonomy.

### Discovery eligibility

Add:

```js
isSociallyDiscoverable(state, personId, context)
```

Initial rules:

- old friend: known immediately;
- neighbors: eligible for introductions/drop-ins;
- coworker: unavailable until a career has introduced them;
- introduced contacts: eligible after explicit introduction.

Unexpected-event candidate generation must only include discoverable NPCs.

### Pending visitor lifecycle

A visitor in `waiting` state must not expose normal in-person social actions until the player chooses:

- Invite in;
- Chat outside;
- Not now.

Person picking may show the arrival card, but cannot bypass `RESPOND_SOCIAL_EVENT`.

### Visit cooldowns

Persist bounded per-person visit cooldown state.

Candidate weighting must distinguish:

- time since last contact;
- time since last visit.

Suggested starting policy:

- first neighbor introduction: once;
- normal friendly drop-in: 2–5 days;
- socially warm/close relationships: shorter range;
- reserved NPCs: longer range.

All timing variation must use seeded RNG.

## Implementation guardrails

- No second social-effect implementation.
- No `Math.random()`.
- Do not remove asymmetric relationship dimensions.
- Discovery rules belong in domain/system code, not UI.
- Waiting visitors may not be socially interacted with through normal actions.
- One declined visit must not create a major penalty.
- Preserve existing save compatibility.
- Preserve deterministic replay.

## Done when

- [x] incoming contacts increment the correct initiator;
- [x] NPC autonomy uses the canonical interaction resolver;
- [x] undiscovered coworker cannot spontaneously visit/call;
- [x] neighbor introductions still work;
- [x] waiting visitor cannot bypass arrival decision;
- [x] visitor cooldown is stored and enforced;
- [x] contact cooldown and visit cooldown are separate concepts;
- [x] replay produces identical results with fixed seed.

## QA requirements

- [x] incoming call initiation ownership test;
- [x] incoming text initiation ownership test;
- [x] autonomous check-in produces canonical social events;
- [x] coworker discovery gate test;
- [x] pending visitor interaction rejection test;
- [x] visit cooldown boundary tests;
- [x] save/load cooldown test;
- [x] `npm test`, build, source checks and CI pass.



## Repository review and integration notes

Confirmed against `91008ba`: `completeSocial` always increments
`initiations.player`; the incoming-offer scheduler increments the NPC before an
exchange occurs; visitor autonomy mutates connection/need directly; the scheduler
includes the full roster; `prepareSocial` accepts waiting presences; there is no
persistent per-person visit cooldown. Define initiative as a completed exchange
initiated by that actor, and track unanswered offers separately if needed. Ensure
one answered incoming exchange increments its initiator exactly once. Route both
preparation and completion through actor-aware validation, preserving atomic
failure and command/event boundaries.

0046 automated scenarios already exist. Its outstanding physical acceptance is
not a prerequisite for this correctness fix. Add backward-compatible defaults or
an intentional pure migration for new cooldown/initiative fields; never reset
existing relationships or saves.

## Source

Reviewed and imported from the [shared social follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain), against implementation `91008ba695c8359c894baa83488c4ea43467359e`.
Source scope and acceptance criteria retained; dependency clarifications are recorded above.

## Implementation evidence

See [follow-up validation](../docs/reviews/social-followup-validation.md) and
[human acceptance](../docs/reviews/mobile-social-human-acceptance.md).

Implementation: `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`; [CI passed](https://github.com/labairj-ai/notsims/actions/runs/38975851836).
