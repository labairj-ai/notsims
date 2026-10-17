# 0080 — Add Workplace Bathroom and Meal-Break Self-Care

- **ID:** 0080
- **Status:** completed
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0079

## Problem

A character can currently start Work with poor Bladder or Hunger and has no way to satisfy those needs while the player is unable to control them.

Work already directly modifies Social and Energy, but basic workplace self-care is absent.

## Product goal

Characters should behave like adults at a normal workplace:

- use the bathroom when necessary;
- eat during a long shift when sufficiently hungry;
- interact socially to a modest degree;
- still return home tired enough that pre/post-work care matters.

Do not make Work a full-service need reset.

## Initial Work policy

### Bladder

When:

```text
Bladder < 35
```

and bathroom-care cooldown permits:

```text
take bathroom break
```

Target after completion:

```text
approximately 80
```

Duration:

```text
approximately 5 game minutes
```

Allow multiple bathroom uses during sufficiently long shifts, bounded by cooldown.

This is abstract off-lot care.

No toilet object is required.

### Hunger

For longer Work shifts, provide at most one normal meal break initially.

Eligibility:

```text
Hunger < approximately 30
AND sufficient shift time has elapsed
```

Suggested result:

```text
recover to approximately 60–70
```

rather than 100.

The meal break should not turn Work into a free infinite-food exploit.

Initial policy may abstract workplace-provided food as no household cost, but the decision must be documented explicitly.

Future policies can support:

- packed lunch;
- cafeteria cost;
- employer meal benefit;
- restaurant/errand cost.

Do not silently reuse home meal pricing.

### Energy

Energy should continue declining.

Do not allow ordinary Work to restore Energy significantly.

This preserves:

```text
sleep before work
→ work is tiring
→ recover after work
```

### Hygiene

Normal or moderately reduced decay is acceptable.

Do not automatically shower at Work.

### Fun

Continue decaying unless a future work strategy explicitly modifies it.

### Social

Current mild Social recovery at Work is conceptually reasonable but should migrate into the Work away policy instead of remaining a hardcoded special case in `advanceActions()`.

## Work activity result example

A character starting:

```text
Bladder 25
Hunger 45
Energy 70
```

during an eight-hour shift may:

```text
use workplace bathroom
→ Bladder recovers

later become hungry enough
→ take meal break

Energy still falls over the day
```

Result:

The player gets a believable after-work state without micromanaging an invisible location.

## Guardrails

- No instant every-frame threshold refill.
- Use explicit care episodes/cooldowns.
- No free full restoration.
- Work elapsed time continues during self-care.
- Payday is unaffected in initial implementation.
- Do not add career performance penalties until a performance system exists.

## Done when

- [ ] low Bladder automatically triggers workplace bathroom care.
- [ ] Bladder recovery is bounded and cooldown-controlled.
- [ ] sufficiently low Hunger can trigger one meal break.
- [ ] Energy still meaningfully decreases.
- [ ] Hygiene/Fun aren't magically restored.
- [ ] Social Work effect uses away-policy configuration.
- [ ] Work remains deterministic under 24× compression.

## QA requirements

Scenarios:

```text
Bladder 20 + 8h work → bathroom occurs
Bladder 80 + 8h work → unnecessary bathroom doesn't occur
Hunger 20 + long shift → meal break occurs
Hunger 80 + shift → meal doesn't occur
Energy 70 → ends lower
Hygiene/Fun → no hidden recovery
```

Also:

- [ ] one-minute vs high-speed result equivalence.
- [ ] exact threshold tests.
- [ ] save/load.
- [ ] event count checks.
- [ ] no duplicate care under 24×.

## Repository-specific integration notes

Work currently applies Energy and Social effects in the career/action advancement path. Move those effects into the Work away policy while preserving current wage, raise and completion rules. Use explicit thresholds, bounded bathroom cooldowns and one meal break per shift; document whether the initial abstract meal is employer-provided and free. Do not touch household money or shared-meal pricing for that decision.

Keep this task after generic 0079 so care episode timing is deterministic under both ordinary and compressed advancement.

## Source

Imported from the [Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a), checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3. Proposed behavior and acceptance criteria are retained; repository integration notes clarify current module ownership and sequencing.

## Current status

Completed in the away activity implementation. The initial abstract lunch is employer-provided and free; it does not use household funds or shared-meal pricing.

