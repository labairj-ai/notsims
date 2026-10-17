# 0087 — Add Work Strategies

- **ID:** 0087
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0086
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Strategies

Add:

```text
Work Normally
Work Hard
Take It Easy
Socialize
```

### Work Normally

Baseline.

```text
Performance      normal
Energy drain     normal
Fun drain        normal
Social gain      current baseline
```

### Work Hard

```text
Performance      higher
Energy drain     higher
Fun drain        higher
```

Suggested starting balance:

```text
Performance delta  +4 beyond baseline
Energy cost        +25%
Fun cost           +15%
```

### Take It Easy

```text
Performance      lower
Energy drain     reduced
Fun decay        reduced
```

Suggested:

```text
Performance delta  -2
Energy cost        -35%
Fun cost           -25%
```

### Socialize

```text
Performance      slightly lower
Social gain      significantly higher
Coworker event chance higher
```

Suggested:

```text
Performance delta  -1
Social gain         2–3× baseline
```

## Runtime model

Strategy belongs to the active Away Work state.

Example:

```js
awayState.strategy = "normal"
```

It survives save/load during an active shift.

## Changing strategy

Allow changing strategy while working.

Do not allow rapid strategy exploitation.

Recommended:

```text
strategy change cooldown = 60 game minutes
```

or apply strategy effects proportionally to minutes spent in each strategy.

The second approach is preferred.

## UI

Work status:

```text
Working · Developer

Strategy
[ Normal ▼ ]

Auto 24×
```

## Guardrails

- No hidden random outcomes.
- Strategy effects must be visible in UI/help.
- Work Hard cannot suppress bathroom care.
- Strategies do not modify wages directly.
- Performance system remains authoritative.

## Done when

- [x] four strategies exist.
- [x] strategy changes persist during save/load.
- [x] effects are proportional to time used.
- [x] no switch-spam exploit.
- [x] Career panel summarizes shift result.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
