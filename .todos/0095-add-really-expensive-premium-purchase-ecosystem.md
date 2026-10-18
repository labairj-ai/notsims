# 0095 — Add Really Expensive / Premium Purchase Ecosystem

- **ID:** 0095
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0092, 0094
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Target price

```text
$15,000–$250,000
```

## Initial assets

```text
Grand piano                  $18,000
Home theater                 $25,000
Professional chef kitchen    $30,000
Designer room collection     $40,000
Original artwork             $50,000
Swimming pool                $60,000
Luxury car                   $85,000
High-end EV                 $110,000
Sports car                  $160,000
Vacation cabin              $220,000
Rental duplex               $250,000
```

## Value

Premium items should increasingly provide:

- unique activity types;
- multiple-character interactions;
- convenience;
- property access;
- travel access;
- collection value;
- visible status;
- revenue opportunities where appropriate.

Do not give a $30,000 stove 100× the Hunger recovery of the starter stove.

## Examples

Pool:

```text
Swim
Relax
Hang out
Exercise
Pool party later
```

Grand piano:

```text
Practice
Perform
Listen
Play together
```

Sports car:

```text
reduced future travel time
unique outing interactions
prestige
```

Vacation cabin:

```text
secondary property
new Away destination
future overnight stay
```

## Done when

- [x] premium tier changes available experiences.
- [x] premium objects feel materially distinct.
- [x] raw need efficiency remains bounded.
- [x] high prices correspond to meaningful ownership value.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
