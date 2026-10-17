# 0104 — Run Business Economy Simulation Through Real Gameplay

- **ID:** 0104
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0099, 0100, 0103
- **Source:** https://github.com/labairj-ai/notsims/pull/7

## Problem

The economy simulator currently marks businesses managed by directly extending `managedUntil`.

That does not exercise the real gameplay path:

```text
MANAGE_BUSINESS
→ Away conflict checks
→ two-hour Away activity
→ elapsed game time
→ business management completion
→ managedUntil update
```

As a result, business progression simulations currently receive management without paying its real time, scheduling, conflict or opportunity cost.

The existing day-782 yacht result is useful directional evidence, but it is not sufficient final balance evidence until management uses canonical gameplay.

## Goal

Make the deterministic simulator use the same public commands and progression rules as ordinary gameplay for business management and other economically important player actions.

Simulation-only shortcuts must not change production state directly when a real command/system owns that behavior.

## Required implementation

### Canonical management flow

Replace direct mutation similar to:

```js
a.managedUntil = ...
```

with the real command/activity path.

At minimum:

1. identify when a business should be managed;
2. attempt `MANAGE_BUSINESS`;
3. process conflict behavior deterministically;
4. advance the resulting Away activity for its real duration;
5. allow canonical completion code to update `managedUntil`;
6. account for the consumed game minutes before later actions.

Do not duplicate the production management formula inside the simulator.

### Scheduling and opportunity cost

Business management must compete with:

- scheduled work;
- existing Away activities;
- planned social conflicts where production would expose them;
- finite game time.

A management visit must not occur simultaneously with a work shift.

If management causes a shift to be late, missed or shortened under canonical rules, the simulator must record the resulting economic consequence.

### Needs and care assumptions

The simulator may retain an explicit simplified care assumption, but that assumption must be documented and must not bypass activity duration.

If needs are restored between major activities for balance isolation, record that separately from the time consumed by those activities.

### Evidence

Regenerate economy evidence using the corrected simulator.

Include at least:

- Barista wage-only;
- Designer wage-only;
- Developer wage-only;
- Skilled Developer;
- Developer + café;
- zero-cash business ladder;
- property owner;
- heavy-luxury upkeep;
- work + one managed business;
- work + multiple managed businesses.

Run horizons of at least:

```text
180 days
365 days
1,095 days
```

where applicable.

## Metrics

Record:

- wages;
- business gross;
- operating costs;
- upkeep/bills;
- living costs;
- management hours;
- scheduled shifts completed;
- late shifts;
- missed shifts;
- cash;
- net worth;
- time to each business purchase;
- time to $1M / $5M / $25M goals where reachable.

## Guardrails

- Do not create a second business-management implementation for the simulator.
- Do not mutate payout cursors or management cursors directly except through canonical production code or controlled test setup.
- Do not make production gameplay depend on simulator code.
- Keep runs deterministic.
- Do not hide conflict failures by silently forcing management.
- Preserve the existing save/payout idempotency contract.
- Existing physical/browser acceptance gates remain separate.

## QA requirements

Add automated coverage proving:

- simulator management emits/uses the same completion behavior as normal play;
- a management visit consumes the full configured duration;
- management cannot overlap a work shift;
- save/load during simulated management does not duplicate payouts;
- multiple businesses cannot be managed for zero elapsed time;
- unmanaged businesses receive the production unmanaged-income treatment;
- changing management duration in content changes simulator results without a simulator-specific constant;
- two identical simulation inputs produce identical outputs.

Add a regression assertion that would fail if the simulator again directly sets `managedUntil`.

## Done when

- [x] business management uses the canonical command/Away/completion path.
- [x] management time is represented in simulation outputs.
- [x] work-management conflicts have deterministic economic consequences.
- [x] zero-cash business progression evidence is regenerated.
- [x] 180/365/1,095-day evidence is reproducible.
- [x] no simulator-only business reward path remains.
- [x] focused tests, full tests, source checks and build pass.
- [x] validation documentation clearly distinguishes simulation assumptions from real gameplay.

## Imported review

https://chatgpt.com/s/t_6ad2dc9f25b4819195a821f85bbe1c76

## Implementation evidence

See [follow-up validation](../docs/reviews/wealth-followup-validation.md), the [versioned contract](../docs/architecture/economy-balance-contract.md), and `tests/economy-followup.test.js`.
