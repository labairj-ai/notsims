# 0106 — Make Career Performance Drive Career Progression

- **ID:** 0106
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0086, 0087, 0088, 0089, 0105
- **Source:** https://github.com/labairj-ai/notsims/pull/7

## Problem

Career Performance is visible, persistent and affected by attendance, strategy and work events, but its economic/gameplay consequence is currently limited.

The current wage multiplier is driven primarily by completed shifts and Skill.

Normal successful work also drives Performance toward 100 relatively quickly, after which much of the meter's decision value disappears.

Work Hard and Take It Easy can therefore feel different moment to moment while producing nearly identical long-term career outcomes.

## Goal

Make Career Performance materially affect career progression without turning it into a direct unlimited wage multiplier.

Performance should influence opportunities and advancement, while Skill, attendance and completed experience remain distinct inputs.

## Recommended progression model

Introduce explicit career levels or promotion milestones.

A promotion may require a combination such as:

```text
minimum completed shifts
minimum Skill
minimum Career Performance
recent attendance / no unresolved at-risk state
```

Exact thresholds must be content-driven per career or career tier.

Possible outcomes:

- promotion to a higher career level;
- bounded base-pay increase;
- new work event pool;
- new work strategy option;
- new schedule/responsibility;
- eligibility for advanced careers later.

Do not simply multiply every paycheck by current Performance.

## Performance dynamics

Review the current accumulation curve so that:

- ordinary reliable work can maintain a healthy score;
- excellent performance requires sustained positive behavior;
- missed work and poor strategies matter;
- the score can recover;
- the score does not automatically sit at 100 forever.

Acceptable approaches include:

- soft decay toward a career-specific baseline;
- promotion consuming/rebasing some progression state;
- diminishing positive gains at high Performance;
- periodic review windows.

Any change must remain deterministic.

## Career states

At minimum preserve or improve the visible labels:

```text
At Risk
Struggling
Steady
Doing Well
Excellent
```

Use them for UI explanation, not as hidden magic thresholds.

If promotion is blocked, the UI should explain why in player terms:

```text
Needs Skill 25
Needs Performance 70
Needs 3 more completed shifts
```

## Guardrails

- Performance is not Mood.
- Performance must not directly alter relationships.
- No unbounded pay multiplier.
- Work Hard must carry a real tradeoff; it cannot be the universally dominant strategy.
- Take It Easy must remain a viable situational choice rather than a trap.
- Attendance remains independently meaningful.
- Existing save v4 data must migrate forward explicitly if persistent fields change.
- Do not break deterministic replay.

## QA requirements

Add tests proving:

- promotion eligibility requires the declared inputs;
- promotion cannot be spammed repeatedly in one shift/day;
- high Performance alone is insufficient when Skill/experience requirements are unmet;
- low Performance can block or delay advancement;
- recovery from low Performance is possible;
- changing strategy only near shift completion cannot claim full-shift progression credit;
- save/load preserves promotion eligibility and review state;
- wage progression remains bounded by the balance contract;
- normal play does not trivially park at maximum Performance indefinitely under the chosen model.

Add simulator scenarios for:

- reliable Normal worker;
- sustained Work Hard worker;
- sustained Take It Easy worker;
- frequent lateness;
- missed shifts;
- high Skill / low Performance;
- low Skill / high Performance.

## Done when

- [x] Career Performance changes meaningful advancement outcomes.
- [x] promotion/advancement rules are explicit and content-driven.
- [x] the player can see advancement requirements.
- [x] Performance remains dynamic over long runs.
- [x] no direct runaway Performance→wage compounding exists.
- [x] balance simulations distinguish materially different career behaviors.
- [x] migration/replay/save tests pass.
- [x] full tests, source checks and build pass.

## Imported review

https://chatgpt.com/s/t_6ad2dc9f25b4819195a821f85bbe1c76

## Implementation evidence

See [follow-up validation](../docs/reviews/wealth-followup-validation.md), the [versioned contract](../docs/architecture/economy-balance-contract.md), and `tests/economy-followup.test.js`.
