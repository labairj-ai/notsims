# 0091 — Generalize Away Destinations for Errands, Appointments, and Travel

- **ID:** 0091
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0084, 0090
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Introduce an extensible destination/activity registry.

Examples:

```text
grocery errand
doctor appointment
salon appointment
restaurant
museum
day trip
vacation travel
hospital visit
```

Do not implement every destination deeply in one TODO.

## Destination contract

Example:

```js
{
  id,
  label,
  duration,
  cost,
  awayPolicy,
  requirements,
  effects,
  attentionPolicy
}
```

## First functional examples

Implement only:

```text
Errand
Appointment
Day Trip
```

as proof points.

## Guardrails

- No large second world/map simulation yet.
- No hidden teleport consequences.
- Every Away destination uses the same clock and attention rules.
- Effects are data-driven.

## Done when

- [x] registry exists.
- [x] three non-Work destinations run.
- [x] costs are atomic.
- [x] policies can differ.
- [x] future Travel/Hospital content requires data, not game-loop changes.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
