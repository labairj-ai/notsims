# 0093 — Expand Entry-Level Purchase Ecosystem

- **ID:** 0093
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0092
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Target

Useful from:

```text
new game → first several shifts
```

Price:

```text
$25–$750
```

## Initial catalog targets

```text
Folding chair             $35
Small side table          $50
Basic lamp                $75
Box fan                   $80
Simple rug                $95
Basic toilet             $150
Bookshelf                $170
Microwave                $180
Used desk                $225
Starter stove            $260
Thrift sofa              $280
Basic shower             $300
Everyday fridge          $320
Small TV                 $380
Starter bed              $450
Bicycle                  $550
Basic laptop             $700
```

Existing catalog objects should be reused or renamed where sensible.

## Gameplay character

Entry objects should:

- work reliably;
- satisfy normal needs;
- lack premium convenience;
- have limited shared capacity;
- remain viable indefinitely.

Do not make starter items deliberately miserable.

## New interaction opportunities

Possible:

```text
Microwave → quick meal
Laptop → practice skill / entertainment
Bicycle → future transportation
Fan → small comfort/fun interaction
```

## Done when

- [x] entry catalog is broad enough to furnish a complete basic home.
- [x] player can meaningfully choose between alternatives.
- [x] current starter home remains valid.
- [x] entry objects are not obsolete traps.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
