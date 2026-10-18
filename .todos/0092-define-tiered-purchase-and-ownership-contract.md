# 0092 — Define Tiered Purchase and Ownership Contract

- **ID:** 0092
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** existing Economy and Furnish systems
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Create one content-driven contract for purchasable things.

Suggested common metadata:

```js
{
  id,
  name,
  category,
  price,

  tier: "entry" | "comfortable" | "premium" | "ultra",

  quality: 1,
  prestige: 0,

  upkeep: 0,

  tags: [],

  effects: {},
  interactions: []
}
```

Not all purchases need every field.

## Tier semantics

```text
entry
basic utility

comfortable
better experience / convenience

premium
meaningfully distinctive luxury

ultra
aspirational trophy asset
```

## Benefit rule

Do not make price scale linearly with raw need efficiency.

Recommended maximum general need-performance curve:

```text
Entry        ~1.00×
Comfortable  ~1.10–1.20×
Premium      ~1.20–1.35×
Ultra        ~1.25–1.40×
```

The real value of expensive assets should increasingly come from:

- unique interactions;
- social capacity;
- visual impact;
- convenience;
- prestige;
- transportation;
- property;
- collections;
- ownership opportunities.

## Guardrails

- Tier is not a hard unlock.
- If you have the cash, you can buy it unless another logical requirement applies.
- Ultra items are never mandatory.
- No direct relationship score from owning expensive objects.
- Purchase definitions stay content-driven.

## Done when

- [x] unified tier metadata exists.
- [x] current catalog maps cleanly.
- [x] price tier helpers exist.
- [x] purchase UI can use tier.
- [x] save stores owned asset IDs/state, not duplicated definitions.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
