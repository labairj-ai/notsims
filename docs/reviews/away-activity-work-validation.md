# Away activity and work validation

Implementation branch: `codex/away-activity-implementation`  
Implementation SHA: recorded after the implementation commit.  
Validation date: 2026-10-16.

## Behavior covered

- Work resolves to the renderer-neutral `work` away policy; stable policy metadata is derived and is not stored as duplicate save configuration.
- The application derives 24× for eligible work, honors pause and manual speed, and preserves the normal speed preference after the shift.
- All three careers (6, 7, and 8 hours) complete and pay once. Tick remains the only simulation clock and continues bounded one-minute updates.
- Workplace bathroom care triggers below 35, recovers toward 80, takes five game minutes, and observes a 90-minute cooldown. One 20-minute lunch is available below 30 hunger after two hours, recovering toward 65. The abstract meal is employer-provided and free; no household food transaction occurs.
- Energy and hygiene continue to decline, Social gets the existing mild work benefit, and Fun receives no automatic recovery.
- Plan overlap is queried and revalidated by the domain command; cancellation or deliberate Work anyway leaves the plan unscheduled for no longer and does not rewrite its outcome.
- Attention state suspends compression to the selected normal rate. Background simulation, including bills, need decay, social maintenance, plans and visitor scheduling, continues through `tick()`.
- Active bathroom/lunch progress survives save/load without duplicating care or payday events.
- Fixtures for school, appointment, and travel exercise the policy extension point without adding those gameplay systems.

## Automated results

The deterministic away suite covers no-plan and overlapping-plan starts, exact shift boundaries, 6/7/8-hour durations, pause and effective-speed policy, low/healthy need cases, care event counts, save/load during care, a bill and scheduled-plan boundary, absence of spontaneous visitors during work, and matching authoritative state for equal elapsed time split into one-minute versus 24-minute advances.

The interface suite checks Career and Live status, remaining time, Auto 24×, manual override, pause, Auto reset, and existing keyboard pause behavior. Existing renderer tests exercise mobile and desktop viewport dimensions; CSS retains the existing responsive panel layout and the new status card wraps within it.

The production build, source checks, and full automated suite are run for this branch. No physical device test was performed, so no physical mobile result is claimed.
