# 0085 — Complete Physical Work/Away Mobile Acceptance

- **ID:** 0085
- **Status:** in_progress
- **Created:** 2026-10-17
- **Priority:** medium
- **Depends:** 0083
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Close the intentionally separate physical-device acceptance for the deployed Away/Work system.

## Required devices

At minimum:

- physical iPhone Safari;
- physical Android Chrome.

## Scenarios

Verify:

- Start Shift.
- Auto 24×.
- Pause.
- Resume.
- manual 1×/3×/8×.
- Return to Auto.
- bathroom break.
- lunch break.
- Career → Live transition.
- schedule-conflict dialog.
- early leave.
- second shift returns to Auto.
- save/reload during Work.

## Observe

- touch target comfort;
- status visibility;
- actual perceived shift duration;
- accidental speed changes;
- thermal behavior;
- browser background/foreground recovery;
- portrait;
- landscape;
- standalone mode if installed.

## Evidence

Record:

```text
device
OS
browser
SHA
result
issues
```

in:

`docs/reviews/away-activity-work-validation.md`

## Done when

- [ ] iPhone passes.
- [ ] Android passes.
- [ ] no serious usability defect remains.
- [ ] no fabricated/inferred physical result.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Physical iPhone/Android results remain required; no device result is claimed.
