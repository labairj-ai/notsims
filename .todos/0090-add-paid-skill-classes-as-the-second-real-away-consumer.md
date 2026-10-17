# 0090 — Add Paid Skill Classes as the Second Real Away Consumer

- **ID:** 0090
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0084
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Prove the Away architecture works for something other than Work.

Use paid Skill Classes.

This also becomes an early purchasable service.

## Initial classes

```text
Creative Workshop     $250   2 hours
Coding Bootcamp       $400   3 hours
Fitness Class         $150   1 hour
Cooking Class         $200   2 hours
```

Initial classes may map to the current generic Skill system.

Future domain-specific skills can replace this.

## Flow

```text
Purchase class
→ choose available time
→ class begins
→ Away Activity
→ Auto compression
→ basic need policy
→ class completes
→ Skill gain
```

## Class Away policy

Suggested:

- bathroom available;
- no automatic meal for short classes;
- Energy decays normally;
- Social mild gain for group class;
- 24× eligible.

## Economy

Charge atomically when attendance begins, not merely when previewing.

If cancellation is allowed before start:

```text
full refund
```

After start:

```text
no refund
```

initially.

## Done when

- [x] class is a genuine second Away consumer.
- [x] Away engine requires no Work-specific modification.
- [x] classes cost money.
- [x] classes grant bounded Skill.
- [x] save/load works during class.
- [x] compression works.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
