# 0102 — Upgrade Shopping and Asset Management UX

- **ID:** 0102
- **Status:** in_progress
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0092–0101
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Problem

A catalog of dozens of objects and assets will overwhelm the existing flat Furnish list.

## Furnish filters

Add:

```text
Category
Price tier
Affordable
Need
Shared activity
Owned
```

Tier labels:

```text
Starter
Comfortable
Premium
Ultra
```

User-facing fun copy may describe Ultra as:

```text
"Stupid expensive"
```

without using that phrase as the internal schema value.

## Item card

Show useful differences:

```text
Cloud+ Sectional
$1,800

Comfortable
Fun ★★★
Seats 4
Low upkeep
```

Do not expose irrelevant internal numeric formulas.

## Compare

Allow basic comparison:

```text
Current bed
vs
New bed
```

Example:

```text
Energy recovery       +12%
Sleep duration        -8%
Upkeep                +$3
```

## Asset screen

Separate large assets from furniture:

```text
Home
Vehicles
Properties
Businesses
Collections
```

## Wishlist

Optional device/game-persistent wishlist:

```text
Sports car
$160,000
You have $42,650
```

No notifications required initially.

## Mobile

Primary flows must remain thumb-friendly.

## Done when

- [ ] large catalogs remain usable.
- [ ] price-tier filtering works.
- [ ] comparison exists.
- [ ] vehicles/properties/businesses do not clutter furniture placement.
- [ ] mobile browser acceptance passes.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Software and DOM flow coverage are implemented. Actual browser/mobile layout and touch acceptance remain open.
