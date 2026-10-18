# 0096 — Add Ultra-Luxury / "Stupid Expensive" Assets

- **ID:** 0096
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** medium
- **Depends:** 0092, 0095, 0097–0100 where applicable
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Create long-term aspirational wealth sinks.

Target:

```text
$300,000+
```

## Initial aspirational catalog

```text
Supercar                    $450,000
Museum-grade art            $750,000
Luxury penthouse          $1,200,000
Commercial building       $1,500,000
Private estate            $2,500,000
Yacht                     $5,000,000
Boutique hotel            $7,500,000
Private jet              $12,000,000
Island estate            $25,000,000
```

## Rule

These should not simply be giant decorative furniture items.

Each should represent a different type of ownership.

Examples:

Supercar:
- transport;
- collection;
- prestige.

Penthouse:
- primary/secondary residence.

Commercial building:
- income-producing property.

Yacht:
- travel destination;
- social events;
- vacation activity.

Private jet:
- premium travel convenience.

Island estate:
- endgame property/experience platform.

## "Stupid expensive" design principle

A player should look at these early and think:

```text
"How would I ever afford that?"
```

Later systems should make the answer possible through:

- advanced careers;
- business ownership;
- property income;
- long-term wealth accumulation.

They should not be realistically reachable by spamming one entry-level job for two hours.

## Done when

- [x] ultra tier contains meaningful trophy assets.
- [x] each major asset has a gameplay identity.
- [x] ultra ownership is optional.
- [x] no core need requires ultra ownership.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
