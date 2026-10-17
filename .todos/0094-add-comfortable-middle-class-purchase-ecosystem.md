# 0094 — Add Comfortable / Middle-Class Purchase Ecosystem

- **ID:** 0094
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0092, 0093
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Target price

```text
$800–$12,000
```

## Initial items

```text
Espresso machine           $850
Dishwasher               $1,100
Queen bed                $1,200
65-inch TV               $1,500
Treadmill                $1,600
Sectional sofa           $1,800
Washer/dryer             $2,200
Gaming PC                $2,500
Upright piano            $3,500
Spa shower               $4,000
Hot tub                  $5,000
Premium kitchen package  $7,500
Used car                 $8,000
New compact car         $12,000
```

## Gameplay value

Examples:

```text
Better bed
→ slightly better Energy rate
→ shorter sleep required

Dishwasher
→ future cleanup convenience

Gaming PC
→ Fun + Skill interactions

Piano
→ Skill + Fun + social/shared activity

Hot tub
→ Fun + Social shared activity

Car
→ future travel-time/convenience
```

## Design principle

This tier should feel like:

```text
"I am doing well."
```

not:

```text
"I finished the game."
```

## Done when

- [x] comfortable tier introduces meaningful convenience.
- [x] unique interactions begin appearing.
- [x] shared/social object value increases.
- [x] player still has reasons to save for premium assets.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.
