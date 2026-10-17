# Career, Away Activity, and Wealth Ecosystem Backlog

Imported from the [Review Game Architecture feedback](https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145) on 2026-10-17. The review proposes TODOs 0084–0103; each task is open and retains its detailed goal, constraints, dependencies, and acceptance criteria in `.todos/`.

## Design direction

Connect career progression to income, purchases and ownership, new experiences, and long-term wealth goals. Higher prices should add convenience, quality, capacity, unique interactions, transportation, property, income-producing assets, collections, luxury, and visible accomplishments. Expensive assets should be desirable without making entry-level play invalid; benefits should have diminishing returns and luxury should bring operating costs as well as benefits.

The current economy starts around $132/$210/$304 per Barista/Designer/Developer shift, with $6,500 for the furnished starter and $12,000 for the empty lot. Furniture currently costs roughly $55–$450. Suggested tiers are entry $25–$750, comfortable $800–$12,000, premium $15,000–$250,000, and ultra $300,000+.

## Initial purchase price map

| Category | Entry | Comfortable / middle class | Premium | Ultra |
| --- | ---: | ---: | ---: | ---: |
| Seating | Folding chair $35 | Sectional $1,800 | Designer set $40,000 | Collectible furniture $300,000+ |
| Bed | Starter bed $450 | Queen bed $1,200 | Luxury suite $15,000 | Bespoke suite $100,000+ |
| Kitchen | Stove $260 | Premium kitchen $7,500 | Chef kitchen $30,000 | Show kitchen $150,000+ |
| Entertainment | Small TV $380 | Gaming PC $2,500 | Home theater $25,000 | Screening room $200,000+ |
| Hobby | Basic laptop $700 | Upright piano $3,500 | Grand piano $18,000 | Museum-grade instrument $250,000+ |
| Wellness | Basic shower $300 | Hot tub $5,000 | Pool $60,000 | Resort spa $500,000+ |
| Transport | Bicycle $550 | Compact car $8,000–$12,000 | Sports car $160,000 | Supercar $450,000 |
| Art | Print/decor $50–$500 | Local art $1,000–$8,000 | Original work $50,000 | Museum-grade art $750,000+ |
| Property | Existing starter | Larger home $75,000+ | Vacation cabin $220,000 | Estate $2.5M / island $25M |
| Business | — | Micro-business $5,000–$15,000 | Rental/café $75,000–$250,000 | Commercial/hotel $1.5M–$7.5M |
| Travel asset | — | Car | Vacation property | Yacht $5M / jet $12M |

These figures are calibration targets, not player locks. Premium and ultra purchases should unlock experiences, ownership, collections, and wealth-building rather than simply multiplying need restoration. Derive net worth from owned assets; keep all purchases on the existing deterministic economy, event, and save architecture.

## Recommended work order

Career depth: **0084 → 0086 → 0087 → 0088 → 0089**. Physical acceptance **0085** can proceed independently when devices are available.

Away reuse: **0090 → 0091**, after 0084. Purchase contract and tiers: **0092 → 0093 → 0094 → 0095**. Vehicle, property, and business ownership: **0097 → 0098 → 0099**, with 0092 and 0091 prerequisites as specified. Upkeep: **0100** follows the ownership contract and asset tasks. Ultra-luxury **0096** follows premium assets and relevant ownership systems. Prestige and aspiration hooks **0101** build on the tiers; asset-management UX **0102** follows 0092–0101. Economy certification **0103** is the final gate after 0086–0102.

The key sequencing choice is to define the common purchase/ownership contract in 0092 before expanding the catalog. TODO 0085 remains a real iPhone/Android acceptance task; browser emulation does not count as physical acceptance.
