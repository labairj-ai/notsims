# 0099 — Add Businesses and Income-Producing Assets

- **ID:** 0099
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0086, 0092, 0098
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Problem

Ultra-luxury purchases need a path beyond endlessly repeating hourly Work.

## Goal

Add optional owned assets capable of producing bounded income.

## Initial progression

```text
Vending / micro-business      $5,000
Online shop                  $15,000
Small café                   $75,000
Rental property             $250,000
Commercial property       $1,500,000
Boutique hotel            $7,500,000
```

## Income design

Do not implement guaranteed infinite exponential returns.

Each asset has:

```js
{
  purchasePrice,
  grossIncome,
  operatingCost,
  payoutInterval,
  risk/variance policy,
  management requirement
}
```

Initial payouts should be deterministic or bounded.

## Example

Rental property:

```text
Gross rent
- maintenance
= net periodic income
```

## Active involvement

Some businesses may provide Away activities:

```text
Visit business
Manage business
Work a shift there
Meet employee
```

## Guardrails

- No uncontrolled compounding.
- Income must be visible/auditable.
- Ownership costs continue.
- Selling asset has explicit valuation.
- Do not replace careers; create another wealth path.

## Done when

- [x] at least one income asset works end to end.
- [x] gross/cost/net are visible.
- [x] payout deterministic.
- [x] save/load cannot duplicate payouts.
- [x] ownership ledger remains bounded.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
