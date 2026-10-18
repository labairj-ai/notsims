# 0101 — Add Prestige, Collection, and Aspiration Hooks

- **ID:** 0101
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** medium
- **Depends:** 0092–0096
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Give expensive purchases value beyond need recovery.

## Derived concepts

### Prestige

Content metadata representing rarity/luxury.

Do not make Prestige a universal relationship score.

Prestige can support:

- UI;
- future aspirations;
- conversation topics;
- collection milestones;
- household summary.

### Collections

Examples:

```text
Art collection
Car collection
Music collection
Rare decor
Luxury property
```

### Aspirations

Future goals:

```text
Own a home worth $100,000
Own three properties
Own a sports car
Build a music room
Own $1M in assets
```

## Net worth

Add pure derived query:

```js
householdNetWorth(state)
```

Potential components:

```text
cash
+ furniture resale value
+ vehicles
+ properties
+ businesses
+ collections
```

Do not store duplicated net worth.

## Guardrails

- Prestige does not automatically make NPCs like the player.
- Net worth is derived.
- No social-class moral judgment.
- Entry-level play remains fully valid.

## Done when

- [x] net worth can be calculated.
- [x] assets expose prestige metadata where appropriate.
- [x] collection hooks exist.
- [x] no relationship system contamination.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
