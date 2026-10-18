# 0086 — Add Career Performance Foundation

- **ID:** 0086
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0083
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Problem

Careers currently reward:

- completed shifts;
- generic Skill;
- automatic wage growth.

There is no explicit measurement of how well the character is performing at work.

Without Career Performance, future choices such as Work Hard or Take It Easy would only manipulate hidden arbitrary numbers.

## Goal

Create a visible persistent:

```text
Career Performance: 0–100
```

Initial new-job value:

```text
50
```

## Performance inputs

Initial bounded factors may include:

- completed shift;
- attendance;
- career Skill;
- Work strategy;
- critical needs;
- future work events.

Do not heavily penalize routine bathroom/lunch care.

## Example baseline

Normal completed shift:

```text
+2 performance
```

Additional strategy/event adjustments happen separately.

## UI

Career panel displays:

```text
PERFORMANCE
██████░░░░ 62

Doing well
```

Suggested labels:

```text
0–19    At Risk
20–39   Struggling
40–59   Steady
60–79   Doing Well
80–100  Excellent
```

## Persistence

This is persistent gameplay state.

If adding a new persistent field requires a save-version change:

- create an explicit migration;
- preserve existing saves;
- initialize migrated careers deterministically.

Do not silently rely on undefined fields.

## Guardrails

- Performance is not character Mood.
- Performance does not directly change relationships.
- No random performance changes.
- One shift cannot swing the entire meter dramatically.
- Existing wage system remains intact during this TODO unless explicitly migrated.

## Done when

- [x] performance persists.
- [x] completed shifts change it deterministically.
- [x] Career UI displays it.
- [x] migrated saves receive a sane default.
- [x] bounds remain 0–100.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
