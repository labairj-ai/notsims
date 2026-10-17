# 0098 — Add Property and Residence Progression

- **ID:** 0098
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0092, 0095
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Money should eventually buy more than objects inside one starter plot.

Create Property ownership.

## Property classes

```text
Starter home
Upgraded home
Vacation cabin
Condo
Penthouse
Estate
Island estate
```

## Suggested prices

```text
Starter property      existing
Larger home          $75,000+
Vacation cabin      $220,000
City condo          $350,000
Penthouse         $1,200,000
Estate            $2,500,000
Island estate    $25,000,000
```

Exact prices require balance simulation.

## First implementation

Do not attempt seamless multiple neighborhoods.

Property can initially be:

```js
{
  propertyId,
  type,
  purchasePrice,
  primary,
  layout/template,
  furnishings
}
```

Switching residence loads that property's persisted lot state.

## Future

- visit second home;
- invite friends;
- vacation;
- rent property;
- sell property.

## Guardrails

- Property state must be independently bounded.
- No shared furniture IDs across properties.
- Current starter saves migrate safely.
- Owning a second property must not destroy the first.

## Done when

- [x] at least two properties can be owned.
- [x] primary residence can change.
- [x] each property preserves its state.
- [x] buy/sell works.
- [x] save/load works.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
