# 0083 — Add Deterministic Away-Time and Work Acceptance Harness

- **ID:** 0083
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0077–0082

## Problem

High-speed Away Activity simulation affects several systems simultaneously:

- world time;
- careers;
- needs;
- economy;
- social schedules;
- cooldowns;
- bills;
- future off-lot activities.

A dedicated acceptance harness is needed to prove that 24× affects real-time presentation only and not simulation outcomes.

## Canonical scenarios

### Work compression

1. Barista 6-hour shift at 24×.
2. Designer 7-hour shift at 24×.
3. Developer 8-hour shift at 24×.
4. Pause mid-shift.
5. Resume.
6. Shift completes and normal speed returns.

### Needs

7. Low Bladder triggers workplace bathroom.
8. Healthy Bladder does not.
9. Low Hunger triggers one meal break.
10. Healthy Hunger does not.
11. Energy declines normally.
12. No automatic Hygiene/Fun reset.

### Events

13. Bill boundary occurs during work.
14. Relationship drift boundary occurs during work.
15. Scheduled hangout overlaps Work.
16. Attention-required event pauses compression.
17. No spontaneous home visitor appears while player is at Work.

### Persistence

18. Save during compressed Work.
19. Reload.
20. Finish shift.
21. No duplicated self-care/pay/events.

## Equivalence test

For the same starting state:

```text
A = simulate work at ordinary advancement
B = simulate work through 24× application clock
```

Final authoritative state must match for:

```text
minutes
money
needs
shift progress
relationship state
social timers
bill state
away-care usage
```

excluding presentation-only data.

## Future-proof scenarios

Add policy fixtures for:

```text
school
appointment
travel
```

without implementing those gameplay features.

The test should prove that the Away Activity engine accepts multiple policy definitions rather than containing Work-specific branches throughout the codebase.

## Performance

Verify high-speed work does not create pathological CPU load from one-minute subdivision.

Measure:

- tick cost;
- event counts;
- UI refresh;
- mobile responsiveness.

Do not optimize by skipping simulation correctness.

## Completion artifact

Create:

```text
docs/reviews/away-activity-work-validation.md
```

Record:

- implementation SHA;
- test counts;
- browser scenarios;
- simulated equivalence result;
- physical mobile result if applicable.

## Done when

- [ ] all canonical scenarios pass.
- [ ] 1×/24× authoritative state equivalence passes.
- [ ] save/load cannot duplicate events.
- [ ] Work returns to normal time correctly.
- [ ] no important event is silently skipped.
- [ ] architecture can accept another Away policy without game-loop changes.
- [ ] full test/build/check/CI pass.

## Repository-specific integration notes

Extend the existing deterministic scenario and save/load coverage rather than adding a second simulation harness. Compare authoritative state after equal simulated minutes at normal and compressed effective speeds, excluding presentation-only state. Include all existing jobs (6/7/8-hour shifts), bill/social-plan boundaries and reload during care. Measure work per bounded tick and event/UI counts; do not skip authoritative ticks to meet the target real-time duration. Physical-device evidence, if collected, must name the actual device and tester.

## Source

Imported from the [Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a), checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3. Proposed behavior and acceptance criteria are retained; repository integration notes clarify current module ownership and sequencing.

## Current status

Open. No implementation or acceptance criteria are claimed complete.

