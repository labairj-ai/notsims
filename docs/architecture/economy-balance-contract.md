# Economy balance contract v2

The source of truth is `src/content/economy-balance.js`, separate from simulator
mechanics. `npm run check:economy` runs the contract in CI; `npm run simulate:economy`
regenerates review evidence. Intentional rebalances must update this version or
its configuration with a rationale. Prices are game dollars, durations game time.

The contract uses 18 scenarios at 180, 365 and 1,095 days. These include all careers,
Normal/Hard/Easy, skill/performance contrasts, lateness/missed shifts, zero/funded
starts, managed/unmanaged and multiple businesses, a purchased business ladder,
property ownership and unsupported luxury ownership. Reports include daily-sampled
wealth milestones, purchase times, actual business payback, wages at completed
shift milestones, negative-cash days, bills/income, upkeep/income and liquidation.

| Benchmark | Accepted range | Purpose |
| --- | --- | --- |
| $55 chair | 0–2 completed shifts | A representative entry purchase is quick |
| $1,200 bed | 3–25 shifts, zero cash | Comfortable ownership is attainable |
| $160k sports car | At least 90 days; Developer within 1,095 | Premium needs saving |
| $5M yacht, wage-only | Not within 1,095 days | Ultra stays a late-game objective |
| Yacht, zero-cash business ladder | 365–1,095 days | Businesses offer another path |
| Starter bills/income | At most 40% | No business is needed for solvency |
| Starter negative-cash days | 0 | Normal ownership avoids a debt spiral |
| Managed business simple payback | 35–200 days | Prevent trivial capital multiplication |
| Managed business actual payback | 35–220 days | Canonical visits and billing count |
| Unmanaged simple/actual payback | 100–4,000 / 100–4,500 days | Inattention materially slows advanced assets |
| Career multiplier | At most 4.5×, including Skill | Performance cannot compound wages forever |
| Unsupported jet+yacht burden | 10–100× income, 90+ debt days at day 180 | Deliberate stress case, not a solvent household target |
| Jet+yacht total bills, 180 days | $900k–$1M | Detect upkeep bypass or runaway content cost |

Ranges are deliberately asymmetric. Higher base-wage careers reach furniture
sooner; Skill and sustained performance unlock bounded career levels. Businesses
beginning already owned have explicitly supplied capital; they are not evidence
that a zero-cash player can buy them immediately. The separate business ladder
actually purchases its assets and pays every visit's time cost.

v1 established canonical simulation with the former shift-based raises. Its local
baseline is retained in `economy-canonical-v1.json`. v2 intentionally replaces
that wage model with promotion requirements. The unsupported-luxury ratio band
also changes: the same $966,060 bills are now divided by lower starter wages.
The absolute bill band is retained to prevent weakening upkeep to make the
stress case appear affordable. Advanced unmanaged hotel payback can exceed
3,000 days because its operating cost remains high without regular management;
that is an explicit attention tradeoff, not a starter progression requirement.

The simulator restores needs before major activities at zero care time and charges
an explicit daily care/living budget. That is a declared balance-isolation model;
it does not claim a measured human playtime or prove real-device comfort. Optional
practice uses real object commands and elapsed time. Business management always
uses production commands, conflict handling, elapsed time and completion. No
simulation code writes management or payout cursors. CI artifacts distinguish
these assumptions from the disposable-save canary and human release acceptance.
