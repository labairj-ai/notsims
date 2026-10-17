# 0100 — Add Ownership Upkeep, Maintenance, and Operating Costs

- **ID:** 0100
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0092, 0097–0099
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Problem

Current bills are:

```text
$75 + $2 per furniture item
```

That cannot support an economy containing:

- cars;
- pools;
- vacation homes;
- yachts;
- businesses;
- private jets.

## Goal

Extend bills with content-defined ownership costs.

## Suggested structure

```js
upkeepFor(state)
```

derived from owned assets.

Example starting bands:

```text
Entry furniture
$0–$2 / bill cycle

Comfortable
$1–$10

Premium objects
$10–$100

Vehicle
asset-specific

Property
asset-specific

Ultra asset
hundreds or thousands
```

## Example

```text
Pool
$150 per billing cycle

Luxury car
$120

Vacation cabin
$450

Yacht
$4,000

Private jet
$12,000
```

Numbers must be balanced later.

## Billing UI

Show breakdown:

```text
Household bills       $125
Vehicle upkeep         $80
Pool maintenance      $150
Property costs        $450
---------------------------
Total                 $805
```

## Guardrails

- Ownership costs derived from content.
- No hidden bills.
- No negative money exploit.
- Bills must remain deterministic.
- Starter players should not be punished by the luxury system.

## Done when

- [x] bills have itemized breakdown.
- [x] major assets contribute upkeep.
- [x] low-tier bills remain reasonable.
- [x] selling asset removes future upkeep.
- [x] save/load cannot duplicate billing.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
