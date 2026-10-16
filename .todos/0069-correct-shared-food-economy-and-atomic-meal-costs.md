# Correct Shared Food Economy and Atomic Meal Costs

- **ID:** 0069
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0050, 0053 (implementation available)

## Problem

The embodied-behavior review says to preserve an earlier correction preventing
free shared food. That correction is absent from current implementation.
`advanceSharedActivity` restores hunger for shared eating/cooking, while
`prepareSharedActivity` and `startSharedActivity` do not check or deduct funds.
This creates an unintended free alternative to existing paid prepared meals.

The local `cost` field in shared approach options is path length, not currency.
It must not be reused as a meal price.

## Proposed approach

- Audit current solo meal prices, shared food definitions and economy events.
- Define centralized prices and an explicit participant/portion policy for shared
  eating and cooking. Preserve the intentionally free quick snack.
- Keep path-distance ranking and currency prices distinct in names and types.
- Decide when the food is purchased/consumed and when hunger restoration begins;
  document cancellation/refund behavior before implementation. Do not charge a
  failed or unreachable interaction, double-charge a resumed route, or give food
  benefits before the transaction succeeds.
- Validate participant availability, object, reservations, paths, funds and queue
  before committing a shared transaction. Use existing economy helpers/events.
- Apply the same eligibility/pricing query in contextual actions and authoritative
  commands, then revalidate if state changes before consumption.
- Preserve the existing safe transient cancellation policy for shared save/load;
  explicitly test how it interacts with any charged/consumed food. Add a pure
  migration only if new persistent transaction data is actually required.

## Implementation guardrails

- No economy effects in renderers, BodyIntent, clip callbacks or audio handlers.
- No duplicate relationship resolver or meal charge on animation phase changes.
- Existing solo meal prices, free snacks and building refunds remain unchanged
  unless a separate, explicit balance change is documented.
- Failure is atomic: no partial charge, lost reservation, phantom meal or reward.
- New transaction state and collection sizes are bounded; no wall-clock or
  presentation RNG dependency.

## Done when

- [ ] Shared eating and cooking use an explicit documented food-cost policy.
- [ ] Shared meals cannot produce unintended free hunger recovery.
- [ ] Insufficient funds and unreachable/occupied targets fail without mutation.
- [ ] Charges occur exactly once and emit canonical economy facts.
- [ ] Cancellation, timeout, departure, object change and save/load have defined,
      tested purchase/consumption/refund outcomes.
- [ ] Contextual UI shows relevant cost/disabled state without owning price rules.
- [ ] Free snacks and existing solo interactions retain their intended behavior.

## QA requirements

- [ ] Exact-funds, insufficient-funds and pricing/portion tests.
- [ ] Atomic reservation/path/funds failure tests.
- [ ] Cancel before/after consumption and departure/object-change tests.
- [ ] Export/import and save/load tests ensure no duplicate charge or free meal.
- [ ] Deterministic scenario and economy-event count checks.
- [ ] Classic/Three contextual UI and shared meal browser checks.
- [ ] Full unit suite, build, source checks and CI pass.

## Source

Added during review of the [embodied-behavior backlog](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), specifically 0064's instruction that shared eating must not create free food. Confirmed against `src/systems/social/shared-activities.js`, `src/content/shared-activities.js` and implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
This is a correctness prerequisite for 0064, not a claim that the earlier fix exists.
