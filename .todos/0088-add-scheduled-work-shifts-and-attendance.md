# 0088 — Add Scheduled Work Shifts and Attendance

- **ID:** 0088
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0086, 0087
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Problem

Characters can currently work at any time.

That is convenient for early development but weakens daily-life structure.

## Goal

Give each career an authored weekly schedule.

Initial example:

```text
Barista
Mon–Fri
7:00 AM–1:00 PM

Designer
Mon–Fri
9:00 AM–4:00 PM

Developer
Mon–Fri
9:00 AM–5:00 PM
```

Exact balance may change.

## Career definition

Extend:

```js
{
  workDays: [0,1,2,3,4],
  startMinute: ...,
  hours: ...
}
```

## Pre-shift state

Before scheduled work:

```text
Work starts in 1h 15m
```

At start:

```text
Time for work
```

Player choices:

```text
Go to Work
Take Day Off
```

Future PTO can be added later.

## Late start

Allow a bounded grace window.

Example:

```text
up to 60 game minutes late
```

Shift still ends at scheduled end.

Performance may decline modestly.

## Missed shift

If the player never attends:

```text
SHIFT_MISSED
```

with deterministic performance impact.

No automatic job loss in first implementation.

## Schedule conflicts

Reuse:

```js
awayConflicts()
```

for:

- hangouts;
- future appointments;
- classes.

## Guardrails

- Do not run Work automatically without player choice initially.
- Do not silently cancel social plans.
- Schedule comes from career content.
- Avoid real-world calendar/time APIs; this is game time.

## Done when

- [x] each job has schedule.
- [x] upcoming shift appears in UI.
- [x] attendance is recorded.
- [x] late/missed shifts work.
- [x] conflicts use Away infrastructure.
- [x] 24× still works after attendance begins.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
