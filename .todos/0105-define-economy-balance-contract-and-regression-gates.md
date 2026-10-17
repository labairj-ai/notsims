# 0105 — Define Economy Balance Contract and Regression Gates

- **ID:** 0105
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0104
- **Source:** https://github.com/labairj-ai/notsims/pull/7

## Problem

The current simulator proves that the economy runs and that broad tiers are reachable, but many acceptance statements remain qualitative.

Without explicit balance bands, future edits to wages, prices, upkeep, business income or resale values can silently turn the economy into either:

```text
money becomes irrelevant
```

or:

```text
progression becomes grind-only
```

A passing deterministic simulation is not enough if the target values themselves are not constrained.

## Goal

Create a versioned economy balance contract with measurable acceptance bands and automated regression gates.

The contract should protect progression shape, not freeze every exact number.

## Required balance dimensions

### Starter viability

Define acceptable ranges for:

- ordinary starter bill/income ratio;
- days of negative cash caused by normal starter ownership;
- entry-item affordability;
- comfortable-item affordability.

Starter ownership must not require luxury/business systems merely to remain solvent.

### Career progression

Track by career:

- wage after 0, 10, 25, 50 and 100 completed shifts;
- time to representative Entry and Comfortable goals;
- wage ceiling created by the capped shift multiplier.

Prevent accidental unbounded wage growth.

### Business progression

For every business define and report:

```text
purchase price
managed net income
unmanaged net income
upkeep
simple managed payback days
simple unmanaged payback days
```

Also measure actual progression payback using the canonical simulator, including management time and purchase sequencing.

Do not rely only on simple price/net-income division.

### Wealth velocity

Track representative milestones:

```text
$10k
$100k
$1M
$5M
$25M
```

for selected scenarios.

Ultra assets should remain late-game goals under ordinary wage-only play.

### Ownership burden

Track:

- upkeep / total income;
- bills / total income;
- negative-cash duration;
- liquidation value;
- cash-flow stability after premium/ultra purchases.

### Tier targets

Create explicit, documented bands for representative purchases.

Initial guidance from the existing design remains:

```text
Entry
roughly 0–2 shifts for representative items

Comfortable
roughly 3–25 shifts depending on item

Premium
meaningful deliberate saving and/or progression

Ultra
late-game wealth objective, normally using advanced income systems
```

Refine these into machine-checkable ranges for selected benchmark items rather than attempting to constrain every content item identically.

## Versioned contract

Add a versioned balance configuration or equivalent source-of-truth containing:

- scenario definitions;
- benchmark item IDs;
- accepted ranges;
- documented rationale.

Do not bury thresholds only inside tests.

A future intentional rebalance must change the contract version or configuration alongside the implementation.

## Regression gates

CI should fail for material violations such as:

- starter scenario enters an unintended debt spiral;
- a representative Ultra asset becomes wage-only early-game content;
- a representative Comfortable item exceeds its maximum intended effort;
- business payback falls below the approved lower bound;
- buy/sell arbitrage becomes profitable;
- upkeep can be bypassed;
- wage growth exceeds its designed ceiling;
- duplicate payouts materially change wealth velocity.

Prefer tolerances/ranges over exact snapshot equality.

## Guardrails

- Do not tune numbers only to make tests green.
- Do not require every career to progress at identical speed.
- Do not make businesses mandatory for ordinary home/furniture progression.
- Do not make wage-only play capable of trivializing the full Ultra catalog.
- Do not use real-world financial realism as the sole design target; gameplay pacing remains authoritative.
- Keep balance assertions deterministic and explainable.

## QA requirements

Automated tests must cover at least:

- all three careers;
- normal/hard/easy strategy scenarios where economically relevant;
- one managed-business path;
- one unmanaged-business path;
- multi-business ladder;
- starter household;
- premium-property owner;
- heavy-luxury owner;
- zero-cash start;
- funded standard new-game start.

Produce a compact machine-readable balance report suitable for CI artifacts and a human-readable validation summary.

## Done when

- [x] balance targets are versioned outside individual test assertions.
- [x] representative Entry/Comfortable/Premium/Ultra ranges are explicit.
- [x] business payback bands are explicit.
- [x] wealth milestone velocity is measured.
- [x] starter solvency and luxury-risk bands are measured.
- [x] CI fails on material balance regressions.
- [x] updated economy evidence passes the approved contract.
- [x] documentation explains any intentionally asymmetric career/business paths.

## Imported review

https://chatgpt.com/s/t_6ad2dc9f25b4819195a821f85bbe1c76

## Implementation evidence

See [follow-up validation](../docs/reviews/wealth-followup-validation.md), the [versioned contract](../docs/architecture/economy-balance-contract.md), and `tests/economy-followup.test.js`.
