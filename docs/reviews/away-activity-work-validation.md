# Away activity and work validation

Implementation branch: `codex/away-activity-implementation`  
Implementation SHA: `a7bdec4`.  
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

The deterministic away suite covers no-plan and overlapping-plan starts, exact shift boundaries, 6/7/8-hour durations, pause and effective-speed policy, low/healthy need cases, care event counts, save/load during care, a bill and scheduled-plan boundary, absence of spontaneous visitors during work, and matching authoritative state, relationship records, social timers, and event order for equal elapsed time split into one-minute versus 24-minute advances. Shift start is immediate only when idle; busy and low-energy rejection leave state unchanged. Bathroom and lunch episodes only begin when enough shift time remains to finish them. Work speed overrides reset on every work exit and save/game replacement.

The interface suite checks Career and Live status, remaining time, Auto 24×, manual override, pause, Auto reset, and existing keyboard pause behavior. A real game-loop frame test confirms 6/7/8-hour shifts complete in 15/17.5/20 seconds at 24×. An attention-boundary integration test confirms normal selected speed while attention is required and Auto resumes after the boundary clears. The mobile UI keeps Work status visible when switching to Live.

Headless Chrome responsive checks passed at 320×568, 390×844, and 430×932 in both Live and Career, with Auto, manual 3×, bathroom care, and lunch care states. All 24 cases had no horizontal overflow or clipped status/control content; the Auto label fit at each viewport. No physical device test was performed, so no physical mobile result is claimed.

A local 8-hour game-loop measurement completed 480 simulated minutes in 20 wall-clock seconds over 80 frames, with 3 total events and at most 3 events in any frame. The measured tick CPU time was 1.054 ms on this host; this is an observed run, not a performance guarantee. UI refreshed once per frame (80 refreshes).

The full automated suite passed (155 tests), source checks passed, the production build passed, and `git diff --check` passed. The PR's required `Test Notsims` check must be rerun against the final feedback-hardening head before merge.
