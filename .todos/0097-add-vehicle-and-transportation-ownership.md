# 0097 — Add Vehicle and Transportation Ownership

- **ID:** 0097
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0091, 0092
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Initial vehicle ladder

```text
Bicycle                $550
Used car             $8,000
Compact car         $12,000
Luxury car          $85,000
High-end EV        $110,000
Sports car         $160,000
Supercar           $450,000
```

## Initial gameplay

Vehicles modify Away travel characteristics.

Example:

```text
Bicycle
cheap
slow

Used car
normal

Luxury car
comfortable

Sports car
faster

Supercar
fast + prestige
```

Do not simulate street driving initially.

Vehicle is an owned asset referenced by Away travel.

## Future interactions

- drive somewhere;
- go for a drive;
- travel with friend;
- maintain vehicle;
- admire/show vehicle.

## Costs

Future recurring costs:

- maintenance;
- insurance abstraction;
- charging/fuel abstraction.

Keep these simple.

## Done when

- [x] vehicle ownership persists.
- [x] one active/default vehicle can be chosen.
- [x] travel policy can query vehicle.
- [x] vehicle affects Away travel without modifying world clock incorrectly.
- [x] selling works.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
