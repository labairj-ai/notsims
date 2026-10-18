# 0107 — Give Premium Assets Distinct Gameplay Identity

- **ID:** 0107
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0095, 0096, 0097, 0098, 0099, 0101, 0106
- **Source:** https://github.com/labairj-ai/notsims/pull/7

## Problem

The shared purchase/ownership architecture is sound, but several expensive assets currently differ mainly by price, upkeep, quality metadata or a common lot shell.

That satisfies the ownership contract but does not fully satisfy the design goal that expensive purchases increasingly unlock different experiences.

A $220k cabin, $1.2M penthouse, $2.5M estate and $25M island should not feel like the same property with a different ledger entry.

## Goal

Deepen the identity of existing Premium and Ultra assets before expanding the catalog further.

Price should increasingly buy:

- different activities;
- different social capacity;
- distinct travel/residence behavior;
- unique ownership decisions;
- visible/structural differences;
- collection/aspiration hooks.

Do not solve this by materially increasing raw need-recovery multipliers.

## Property identity

Give each major property class a distinct content-driven template or affordance.

At minimum differentiate:

```text
Vacation cabin
City condo
Penthouse
Private estate
Island estate
```

Possible dimensions:

- lot footprint/template;
- default rooms or outdoor space;
- visitor/social capacity;
- property-specific Away activity;
- travel overhead;
- unique shared activity;
- maintenance/upkeep;
- furnishing capacity;
- aspiration/collection milestone.

Switching residences must continue to preserve independent lot state.

## Vehicle identity

Preserve the common travel contract while giving higher tiers more than a lower travel factor.

Potential bounded identity:

- bicycle: low-cost local travel;
- compact/used car: ordinary flexible transport;
- luxury car: comfort/social outing option;
- sports car/supercar: unique drive/outing interaction + collection prestige;
- jet: very low travel overhead + high operating cost + specific travel access.

Do not implement street-driving simulation.

## Yacht / travel identity

The yacht should behave as an owned experience platform, not only an expensive inventory item.

Support at least one distinctive owned activity, such as:

- yacht trip;
- host a small social outing;
- relax/travel activity.

Reuse Away and canonical social systems.

## Business identity

At least two business tiers should differ in more than payout size.

Potential dimensions:

- management duration;
- management frequency;
- one business-specific event or decision;
- visitor/employee interaction hook;
- capacity/risk policy later.

Keep income deterministic/bounded for this TODO unless a separate variance system is explicitly designed.

## Collection identity

Museum-grade art and vehicle/music collections should surface meaningful collection progress or milestones in the existing derived collection model.

Prestige must remain informational/aspirational and must not directly buy NPC affection.

## Guardrails

- Do not add a parallel social system.
- Do not add a parallel Away implementation.
- Do not add seamless neighborhoods/world streaming.
- Do not make Ultra ownership mandatory for core needs.
- Do not scale need recovery linearly with price.
- Preserve bounded asset counts and save validation.
- New templates/affordances must remain content-driven where practical.
- Avoid adding many new catalog entries until current expensive assets are differentiated.

## QA requirements

Add tests proving:

- each major property preserves its own lot/template state;
- switching among three or more properties does not cross-contaminate furniture IDs;
- distinctive property activity uses canonical Away rules;
- distinctive social activity uses canonical relationship/memory rules;
- selling an asset removes only its future costs/affordances;
- vehicle identity does not alter world-clock correctness;
- prestige/collections do not alter relationship scores;
- save/load during an owned premium activity resumes exactly once.

Add a content validation test that prevents named Premium/Ultra benchmark assets from accidentally losing their declared distinctive affordance.

## Done when

- [x] major Premium/Ultra properties have distinct gameplay identity.
- [x] top-tier vehicles offer bounded distinct interactions beyond speed.
- [x] yacht has at least one canonical owned experience.
- [x] at least two business tiers have distinct management/gameplay identity.
- [x] collection milestones are visible/derived.
- [x] raw need efficiency remains within the tier contract.
- [x] save/replay/social/Away invariants remain intact.
- [x] full tests, source checks and build pass.

## Imported review

https://chatgpt.com/s/t_6ad2dc9f25b4819195a821f85bbe1c76

## Implementation evidence

See [follow-up validation](../docs/reviews/wealth-followup-validation.md), the [versioned contract](../docs/architecture/economy-balance-contract.md), and `tests/economy-followup.test.js`.
