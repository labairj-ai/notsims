# Remove Duplicate Shared-Activity Eligibility Evaluation

- **ID:** 0071
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** medium
- **Depends:** 0053, 0069

## Problem

`availableSharedActivities()` currently invokes `prepareSharedActivity()` multiple times for the same candidate in order to derive:

- `disabledReason`;
- `eligible`.

`prepareSharedActivity()` can perform pathfinding and reservation/occupancy checks.

The duplicate evaluation is currently small, but it adds unnecessary work whenever the social UI queries shared activities and will scale poorly as homes and furniture counts grow.

## Proposed approach

Evaluate each candidate exactly once.

Example:

```js
const result = prepareSharedActivity(s, {
  personId,
  objectId: f.id,
  interactionId
});

return {
  interactionId,
  objectId: f.id,
  label: def.label,
  cost: sharedMealCost(interactionId),
  disabledReason: result.code ?? null,
  eligible: !result.code
};
```

Preserve the existing rule that insufficient-funds options may remain visible but disabled.

## Touches

- `src/systems/social/shared-activities.js`
- relevant unit tests

## Implementation guardrails

- Behavior-preserving optimization only.
- Do not cache results across state changes.
- Do not weaken authoritative command revalidation.
- Do not move pathfinding responsibility into UI.

## Done when

- [ ] every shared-activity candidate calls `prepareSharedActivity()` once per query.
- [ ] eligible/disabled results remain identical.
- [ ] paid meal cost labels remain unchanged.
- [ ] authoritative start still revalidates current state.

## QA requirements

- [ ] existing shared-activity tests pass unchanged.
- [ ] add a focused call-count/purity regression if useful.
- [ ] full suite/build/check/CI pass.



## Repository review and integration notes

Confirmed: `availableSharedActivities` calls `prepareSharedActivity` twice
for each matching furniture candidate to compute disabledReason and eligible.
Evaluate once locally per candidate, preserve ordering/filtering/eight-result
limit and `INSUFFICIENT_FUNDS` visibility. Preserve the cost helper and path/funds/reservation checks.
Use a focused behavioral or instrumentation check without introducing a service
container or persistent cache solely to count calls.

## Source

Imported from the [PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7), checked against `c43dae2b1e8beccd1896a7173e95dde32f30d9fa` on `codex/embodied-character-behavior` and read-only PR #1/main metadata.
Source scope retained; dependency, check-name and deployment clarifications are recorded above. All new tasks remain open.
