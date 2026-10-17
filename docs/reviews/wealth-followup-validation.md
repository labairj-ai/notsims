# Wealth follow-up validation — 0104–0108

0104–0107 have software and automated acceptance. **0108 remains in progress and
release-blocked by actual browser/physical/human acceptance.** PR #7 stays draft;
no merge, deployment or production smoke is claimed for this candidate.

## Canonical simulator and balance gates

The review was imported verbatim into five numbered TODOs before implementation.
Business management now issues `MANAGE_BUSINESS`, obeys Away conflicts, advances
real game time, and receives `BUSINESS_MANAGED` from production completion code.
Durations live in content and affect the simulator automatically. Visits cannot
run during work. Explicit `defer` and `accept` conflict policies produce different
attendance and wage outcomes in tests; acceptance acknowledges the same conflicts
that ordinary gameplay exposes, rather than mutating a management cursor.

Needs resets and initial capital remain controlled balance fixtures. Every minute
after setup advances canonically; no time is teleported between shifts. Multiple
visits consume separate durations; a visit may overrun a nominal daily checkpoint
and its actual minute is retained. Mid-visit reloads use the normal validator and
runtime rebuild, preserving payout cursors and one completion.

The versioned contract is in [economy-balance-contract.md](../architecture/economy-balance-contract.md).
CI runs `npm run check:economy` and uploads `artifacts/economy-balance.json`.
The review evidence contains 54 runs: 18 scenarios × 180/365/1,095 days. It records
management hours, completed/late/missed shifts, wages, business gross/operating
costs, upkeep, living costs, purchase times, actual payback and daily-sampled
$10k/$100k/$1M/$5M/$25M cash/net-worth milestones. Some goals remain unreached.
Monthly cash samples keep the review artifact compact; calculations use all days.

## Career progression and migration

Five content-driven levels replace automatic raises. Promotion requires a completed
shift, experience, Skill, Performance and recovered attendance debt. Each global
shift can be reviewed once, and only one promotion may happen per workday.
Promotion blockers appear in Career. Pay uses a bounded level multiplier plus the
existing bounded Skill term, never current Performance as a cash multiplier.
Positive performance gains diminish with headroom and drift toward a level-specific
baseline. Normal work remains healthy; consistently Easy work preserves needs and
base wages but delays advancement. Hard adds need drain and earns promotions sooner.

Save v5 explicitly migrates v4 level/review fields, retaining already-earned pay as
a bounded wage floor. Paid management windows and in-progress older owned visits
remain readable. Existing v3 fixtures migrate through v4 to v5 once, preserving
money, furniture, people, relationships and social state. The frozen v4 active
shift keeps its quoted pay. Schemas bound levels, review cursors, attendance debt,
owned activities, lots and payout/management state.

## Existing premium assets differentiated

Cabin: compact wood interior and porch, woodland hike. Condo: narrow city interior
and gallery visit. Penthouse: terrace and skyline gathering. Estate: larger garden
layout and retreat. Island: compound/dock layout and expedition. Purchases use
content-driven templates; previously owned lots are preserved rather than rebuilt.

Bicycle, luxury car, EV, sports car, supercar and jet have distinct paid/free outing
choices beyond travel speed. Travel overhead consumes ordinary game minutes.
The yacht offers a harbor cruise; inviting a known available friend resolves one
shared outing through canonical relationship, repetition and memory functions.
Prestige itself still changes no relationship scores. Trips charge once at start
and resume once after save/load. Selling removes only the sold asset's costs and
activities. Collections include furnishings in inactive residences.

Micro-business management takes 45m every 5 days; online shop 90m weekly; café and
rental 120m weekly; commercial 180m weekly; hotel 240m every 3 days. Income remains
bounded and deterministic. UI displays management cadence and activity cost/time.

## Current measurements (conditional simulation)

| 180-day scenario | End cash | Bed shifts | Career level |
| --- | ---: | ---: | ---: |
| Zero-cash Barista, no extra practice | $12,070 | 19 | 1 |
| Zero-cash Designer, no extra practice | $25,430 | 9 | 1 |
| Zero-cash Developer, no extra practice | $41,330 | 5 | 1 |
| Developer, Normal + practice | $104,622 | 5 | 4 |
| Developer, Hard + practice | $126,970 | 5 | 4 |
| Developer, Easy + practice | $43,309 | 5 | 0 |

The zero-cash business ladder buys a yacht on day **955** in the v2 model, with
1,020.75 management hours over 1,095 days. It ends with about $2.60M cash/$6.71M
net worth; the island and $25M milestone remain later goals. The earlier day-782
result is historical v1 evidence, superseded by performance-gated advancement.
The multiple-business scenario consumes 116 management hours over 180 days.
Unsupported jet/yacht ownership produces 178 negative-cash days and $966,060 bills;
that deliberate stress case stays outside ordinary starter viability targets.

## Automated checks and limits

All 180 tests pass locally, along with source checks, production build, the v2 balance suite and disposable-save canary.
The full suite covers canonical management, conflict/defer/late/missed consequences,
content duration changes, unmanaged payouts, replay, versioned regression failures,
promotion inputs/idempotency/recovery, old-save preservation, three distinct lots
with globally unique furniture IDs, owned experiences, canonical social memories,
vehicle clock correctness and payout/reload idempotency. Source/build checks also
validate module imports, audio provenance/budgets, rig/clips, icons and manifest.

`npm run canary:wealth` runs the disposable-save migration/ownership restart canary
and writes exact Git SHA, source fingerprint, dirty-tree flag and results to the CI
artifact. It is **not** a browser or production canary. Valued player saves are never
edited. CI must pass on the final candidate before any later release decision.

Computer Use currently exposes no browser session; selecting the running Chrome
application returned `cgWindowNotFound`. Consequently DOM tests do not close 0102.
No physical iPhone/Android, listening, motion or standalone result is supplied.
See [wealth-release-validation.md](wealth-release-validation.md) for the open gate.
