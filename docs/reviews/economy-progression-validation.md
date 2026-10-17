# Career, Away and wealth implementation validation

**Historical initial PR #7 baseline.** Current v5 implementation and balance results supersede the figures below; see [0104–0108 validation](wealth-followup-validation.md).

Software implementation for 0084 and 0086–0103 is present. Physical acceptance
0085 and the browser/device acceptance portion of 0102 remain open. Existing
human motion, audible-output and standalone gates are unchanged. No physical
or human result is inferred from automated tests.

## Implemented behavior

- Career performance starts at 50, persists in v4 saves, stays in 0–100, and has
  visible labels and a shift summary. Normal completion adds 2; critical Energy,
  late attendance, time-weighted strategies and one bounded work event adjust it.
  Wages retain their existing formula, with promotion growth capped at 20 raises.
- Four strategies apply per minute; changing at the end of a shift cannot earn
  an entire shift's bonus. Care remains available under every strategy.
- Careers work Monday–Friday, Barista 07:00–13:00, Designer 09:00–16:00, Developer
  09:00–17:00. Attendance is deliberate, within 60 minutes of start. Late starts
  end at the scheduled time and receive proportional pay. Missed days cost 5
  performance once; a deliberate day off costs 2, as does leaving early.
- One informational event per ordinary shift; every third shift offers a team
  deadline choice. Choices suspend Auto compression; canonical relationships and
  bounded memories record collaboration. No second coworker relationship model.
- Four paid classes and Errand/Appointment/Day Trip use the generic Away engine.
  Costs occur on attendance, completion effects occur once, and cancellation after
  attendance has no refund. Classes provide bathroom care, with no automatic meal.
  Social plans and upcoming work are checked before destination attendance.
- 38 furniture definitions and 23 large-asset definitions share tier, quality,
  prestige and upkeep metadata. Existing starter IDs/prices remain valid. Furniture
  stays in Furnish; vehicles, properties, businesses and collections use Assets.
  New music and poolside shared activities reuse the canonical social engine.
- Vehicle selection affects travel overhead only. Properties preserve independent
  lot snapshots; furniture IDs remain unique across lots. Only empty, non-primary
  properties can be sold, avoiding ambiguous loss/refund of furnishings.
- Businesses pay deterministic daily gross minus operating cost. Manage weekly
  through a two-hour Away visit; unmanaged gross falls to half. Payout cursors
  persist; malformed/stale cursors fail validation. There is no auto-reinvestment.
- Bills itemize household, furniture and ownership costs every three game days.
  Inactive properties' furnishings also contribute. The ledger retains 60 entries.
  Luxury ownership can create negative cash, consistent with existing bill debt;
  starter ownership remains viable. Selling removes subsequent asset costs.
- Net worth and collections are derived queries; prestige never changes NPC
  relationship scores. Asset resale is 60%; furniture retains its existing 65%.
  No asset can be sold twice, and primary-property sale is rejected.
- Shopping provides category/tier/affordable/need/shared/owned filters, current-item
  recovery/upkeep comparison, an asset category picker, and a bounded wishlist.

## Reproducible checks

`npm test`, `npm run check`, `npm run build`, `npm run simulate:economy`.

All 168 tests pass, as do source checks, production build and `git diff --check`.
The test suite covers ordered v1→v4 migration, invalid state rejection, bounded
ownership, independent property preservation, atomic failures, late/missed shifts,
strategy weighting, work choices, all seven paid destinations, Away controls,
round trips during care/classes/work, event replay, business payout cursors,
resale/upkeep removal, and UI filter/asset/class flows. Existing frozen social
trace checks project away the new v4 fields; legacy non-work behavior remains
compared against its original baseline. Work schedule behavior has dedicated
new assertions rather than retaining the obsolete anytime-shift expectation.

Production builds validate module imports, audio provenance/budgets, character
rig/clips, licenses, standalone manifest and icons. Generated economy evidence is
in [economy-simulation.json](evidence/economy-simulation.json).

## Economy measurements

The simulator uses real career completion, strategy, ownership payout and billing
code. It explicitly assumes needs are restored between shifts, $24/day living
costs and weekly business management. Results are conditional on those assumptions;
they do not measure real play duration, perceived grind or physical-device comfort.
Purchase goals are savings benchmarks unless `buyGoals` is enabled.

180 game days, starting with zero spendable cash:

| Scenario | End cash | $1,200 bed: completed shifts | $160k sports car |
| --- | ---: | ---: | --- |
| Barista | $45,786 | 13 | Not yet |
| Designer | $78,981 | 8 | Not yet |
| Developer | $118,972 | 5 | Not yet |
| Skilled Developer | $134,808 | 4 | Not yet |
| Developer with a café | $297,972 | 2 | 75 shifts |

Business-owner scenarios begin with the specified asset already funded; their
initial capital is not earned in those runs. A separate zero-cash Developer
business ladder actually purchases micro-business → online shop → café → duplex
→ commercial building → hotel → yacht when affordable. It buys the yacht on day
782, and ends day 1,095 with approximately $5.97M cash/$10.07M net worth. The
$25M island remains a later objective. This proves an optional business wealth
path reaches Ultra without making a yacht a starter wage purchase.

Starting with café-level income accelerates comfortable purchases deliberately.
Work Hard/Take It Easy change performance and needs, not wages; their wage-only
cash trajectories therefore match Normal. Heavy jet/yacht upkeep with only
Barista income reaches about −$914k cash over 180 days: buying luxury without
supporting income is unsustainable, and upkeep is visible before purchase.
Starter funds remain the existing $6,500; the zero-cash pacing runs isolate earned
income and do not pretend all comfortable items require savings in a funded save.

## Outstanding acceptance

0085 requires an actual iPhone Safari and Android Chrome with source identity,
OS/browser, touch comfort, orientation/standalone, thermal and background recovery
observations. Record them in `away-activity-work-validation.md`.

0102 still requires actual browser viewport and touch review for the expanded
shopping/asset screen. DOM tests pass, but no new browser layout result is claimed:
the available Computer Use service exposed no browser session, and selecting the
running Chrome application returned `cgWindowNotFound`. Human perception, audio,
physical phones and release certification remain open independently of CI.
