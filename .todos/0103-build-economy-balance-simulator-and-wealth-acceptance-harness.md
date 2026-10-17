# 0103 — Build Economy Balance Simulator and Wealth Acceptance Harness

- **ID:** 0103
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0086–0102
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Prevent the expanded economy from becoming either:

```text
everything affordable immediately
```

or:

```text
nothing worth saving for
```

## Simulator

Create a deterministic economy simulator.

Inputs:

```text
career
career performance
work strategy
skill
days played
owned assets
upkeep
purchase goals
business income
```

Outputs:

```text
cash over time
net worth
bills
time-to-afford
income sources
spending
```

## Target progression

Initial desired pacing:

```text
ENTRY
0–3 shifts

COMFORTABLE
several shifts to several in-game weeks

PREMIUM
longer-term goal

ULTRA
late-game wealth / advanced income systems
```

More concrete initial target:

```text
Entry item:
0–2 shifts

Comfortable item:
3–25 shifts depending on item

Premium asset:
meaningful saving / career progression / business income

Ultra asset:
late-game objective, normally requiring significant wealth generation
```

Do not balance Ultra assets around a new Barista buying a yacht.

## Scenarios

Simulate:

- Barista only.
- Designer only.
- Developer only.
- strong Career Performance.
- Work Hard.
- Take It Easy.
- business owner.
- property owner.
- heavy luxury upkeep.
- starter household.
- wealthy household.

## Metrics

Track:

```text
median shifts to purchase
bill/income ratio
cash-flow stability
net-worth growth
time spent at each purchase tier
```

## Safety checks

Flag:

- negative-price exploit;
- repeated payout exploit;
- duplicate property sale;
- sell/buy arbitrage;
- free vehicle ownership;
- upkeep bypass;
- save/load duplicate payouts;
- unbounded career income;
- impossible debt spiral from ordinary starter ownership.

## Completion artifact

Create:

`docs/reviews/economy-progression-validation.md`

## Done when

- [x] all four wealth tiers are economically reachable as intended.
- [x] starter experience remains viable.
- [x] Comfortable tier feels achievable.
- [x] Premium tier requires deliberate saving.
- [x] Ultra tier remains aspirational.
- [x] wealth systems cannot trivially duplicate money.
- [x] full tests/build/CI pass.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
