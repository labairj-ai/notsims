# 0082 — Add Away Activity Status UI and Future Strategy Hooks

- **ID:** 0082
- **Status:** completed
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0078, 0079, 0080

## Problem

Once Work is compressed and self-care occurs invisibly, the player needs enough feedback to understand what the character is doing without turning Work into another fully playable lot.

## Career/Live UI

While working, show:

```text
WORKING · DEVELOPER
3h 12m remaining

Auto fast-forward · 24×
```

If Away Care occurs:

```text
Taking a bathroom break
```

or:

```text
Having lunch
```

briefly in the activity/status area.

Do not stop compression for ordinary self-care.

## Need indicators

Need bars continue updating during Work.

This gives clear feedback that:

- Bladder improves after a bathroom break;
- Hunger may recover at lunch;
- Energy still falls.

## Future strategy hooks

Design UI/domain contract so later Work modes can be added without rebuilding the system.

Potential future strategies:

```text
Work Normally
Work Hard
Take It Easy
Socialize
```

This pattern is common in rabbit-hole life-sim careers, where the player retains limited strategic control while the character is away. 

Do **not** implement their balance effects yet unless a real career-performance model exists.

For now the away policy may expose:

```js
strategy: "normal"
```

as a forward-compatible field/query without adding fake depth.

## Future strategy concepts

### Work Hard

Eventually:

- stronger career performance;
- greater Energy/Fun cost;
- reduced self-care willingness.

### Take It Easy

Eventually:

- better need maintenance;
- lower performance.

### Socialize

Eventually:

- coworker relationship gains;
- lower productivity.

These should wait for corresponding systems rather than becoming arbitrary hidden modifiers.

## Guardrails

- UI reads away state; it does not own it.
- Do not add strategy effects before measurable career performance exists.
- Ordinary self-care notification should not spam.
- 24× status should be obvious.
- Mobile layout remains primary.

## Done when

- [ ] work compression is visibly communicated.
- [ ] remaining work duration is shown.
- [ ] bathroom/lunch state can be understood.
- [ ] need changes are visible at compressed speed.
- [ ] future away strategy extension point exists.
- [ ] mobile UI remains usable at 320/390/430 widths.

## QA requirements

- [ ] Career tab while working.
- [ ] Live tab while working.
- [ ] bathroom status.
- [ ] meal-break status.
- [ ] pause/auto-speed states.
- [ ] portrait/landscape mobile browser checks.

## Repository-specific integration notes

Career and Live panels are projections of authoritative activity state. Keep remaining-time and care labels readable in the existing compact/mobile layouts, including 320/390/430 pixel widths. Use ordinary notifications only for informational care events and avoid pausing on routine bathroom/lunch behavior. Add no strategy bonuses or penalties until career performance exists.

## Source

Imported from the [Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a), checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3. Proposed behavior and acceptance criteria are retained; repository integration notes clarify current module ownership and sequencing.

## Current status

Completed in the away activity implementation. Career and Live show work progress and speed/care status; the strategy hook exposes `normal` without gameplay modifiers.

