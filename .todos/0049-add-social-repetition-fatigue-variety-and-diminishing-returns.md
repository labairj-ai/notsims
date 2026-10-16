# 0049 — Add Social Repetition Fatigue, Variety, and Diminishing Returns

- **ID:** 0049
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0037, 0038, 0043, 0048

## Problem

Relationships can currently be progressed by repeatedly selecting the same positive interaction.

For example, repeating Encourage or another favorable action many times can produce high relationship tiers without varied shared experiences.

This turns relationships into button grinding.

## Proposed approach

Track recent social interaction history by pair.

Recommended inputs:

- interaction ID;
- interaction family;
- game minute;
- channel.

Calculate a repetition multiplier.

Starting policy example:

```text
1st same interaction in recent window: 1.00
2nd: 0.65
3rd: 0.35
4th+: 0.15
```

Also add lighter family repetition:

```text
Friendly → Friendly → Friendly → Friendly
```

should gradually produce less relationship growth than varied interactions.

Reward variety modestly:

- chat;
- joke;
- visit;
- confide;
- shared activity.

Do not create a visible combo mechanic.

### Memories

Do not create identical meaningful memories for every repeated action.

Example:

15 insults must not create 15 equally meaningful `insulted` memories.

Use:

- memory cooldown;
- intensity escalation where appropriate;
- memory coalescing/count where useful.

### Negative repetition

Repeated conflict may escalate consequences, but must remain bounded.

Repeated insults could:

- stop producing additional familiarity;
- increase tension;
- make apologies less likely to succeed temporarily.

## Implementation guardrails

- Do not make social actions useless after one use.
- Do not require perfect interaction variety.
- Different channels may partially reset novelty.
- No hidden permanent penalties.
- Same seed/state must remain deterministic.
- Keep tuning constants centralized.

## Done when

- [x] repeating one positive action produces sharply diminishing relationship gains;
- [x] varied interactions produce healthier progression;
- [x] repeated identical memories are bounded/coalesced;
- [x] conflict repetition behaves predictably;
- [x] normal casual repeated chat remains useful for maintenance;
- [x] relationship tiers cannot be trivially farmed in minutes.

## QA requirements

- [x] 1st/2nd/3rd/4th repetition multiplier tests;
- [x] varied-action comparison scenario;
- [x] memory coalescing tests;
- [x] relationship progression benchmark;
- [x] deterministic replay remains identical;
- [ ] full suite and CI pass.



## Repository review and integration notes

Confirmed: current repeat prevention is only a short per-action cooldown;
completed exchanges always apply full gains and append repeated memory kinds.
Persist bounded interaction history using migration/defaults, and centralize
window/multiplier tuning. Keep maintenance connection recovery useful while
reducing farmable affinity/trust/familiarity growth. Apply the same policy to
player, incoming and autonomous exchanges through 0047's canonical resolver.
Replace the existing repeated-Encourage progression test intentionally with
varied progression and explicit anti-grinding benchmarks; do not weaken tier
assertions merely to make the old test pass.

## Source

Reviewed and imported from the [shared social follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain), against implementation `91008ba695c8359c894baa83488c4ea43467359e`.
Source scope and acceptance criteria retained; dependency clarifications are recorded above.

## Implementation evidence

See [follow-up validation](../docs/reviews/social-followup-validation.md) and
[human acceptance](../docs/reviews/mobile-social-human-acceptance.md).
