# 0108 — Certify Wealth Release and Deploy

- **ID:** 0108
- **Status:** in_progress
- **Created:** 2026-10-17
- **Priority:** critical
- **Depends:** 0085, 0102, 0104, 0105, 0106, 0107
- **Source:** https://github.com/labairj-ai/notsims/pull/7

## Problem

PR #7 has strong automated implementation evidence, but it is intentionally still a draft and several human/device gates remain open.

The release must not infer browser, touch, physical-device, motion, audio or standalone acceptance from DOM/unit/CI results.

The wealth changes also introduce save v4, new recurring payouts, multiple properties and substantially more purchase/sale state, so production verification needs an explicit migration and idempotency canary.

## Goal

Create one release-readiness gate for the Career/Away/Wealth candidate, complete the required human/device acceptance, merge only the accepted source, atomically deploy it, and verify production behavior without losing prior saves.

## Pre-merge requirements

### Required TODO state

Do not certify this release until:

- 0085 physical Work/Away mobile acceptance passes;
- 0102 real browser/mobile shopping acceptance passes;
- 0104 canonical economy simulation passes;
- 0105 economy balance contract passes;
- 0106 career progression integration passes;
- 0107 premium-asset identity pass passes.

Existing human gates from earlier epics remain authoritative where they are still required for release certification.

### Browser / desktop review

Record actual browser observations for:

- Furnish filters;
- tier filter;
- Affordable filter;
- comparison UI;
- Assets category switching;
- wishlist;
- Career panel;
- Away status;
- property switching;
- business management;
- bill breakdown;
- long lists at supported viewport widths.

Check keyboard/mouse behavior and overflow, not only DOM presence.

### Physical mobile review

On real iPhone Safari and Android Chrome record:

- device/model;
- OS;
- browser version;
- portrait;
- landscape where supported;
- standalone/PWA path where applicable;
- touch target comfort;
- scrolling;
- panels/modals;
- tier filters;
- asset cards;
- comparison UI;
- property/business actions;
- Work/Away compression controls;
- background/resume behavior;
- thermal/performance observations.

Do not substitute emulator-only evidence.

## Save migration canary

Use a real pre-v4 save fixture or production-compatible captured save.

Verify:

```text
load v3
→ migrate exactly once to v4
→ career default sane
→ starter property ownership created
→ existing furniture preserved
→ money preserved
→ relationships/social state preserved
→ serialize
→ reload
→ no second migration effects
```

Keep a reproducible fixture in tests if policy permits.

## Wealth/ownership production canary

Before broad release, verify on the candidate build:

1. purchase and sell one vehicle;
2. select vehicle and complete one destination;
3. buy second property;
4. switch residence;
5. place furniture;
6. switch away and back;
7. confirm furniture/state persistence;
8. buy one business;
9. advance to one payout;
10. restart/reload;
11. confirm no duplicate payout;
12. manage business;
13. verify next payout uses managed policy;
14. verify itemized bills;
15. verify net worth changes as expected.

Use a disposable/test save rather than corrupting a valued player save.

## Merge requirements

- PR must no longer be draft.
- Required GitHub Actions check must pass on the exact merge candidate SHA.
- Working tree/diff checks must be clean.
- Record candidate SHA.
- Merge must not bypass required branch protection.
- No unrelated changes may be added after final acceptance without rerunning the affected checks.

## Deployment requirements

Deploy the exact merged SHA using the existing atomic release process.

Record:

- merge SHA;
- release/build identifier;
- deployment target;
- deploy timestamp;
- service/static-host health;
- production source/version identity.

Do not claim deployment from a local build alone.

## Post-deploy smoke

Verify on production:

- app loads;
- existing save loads;
- new game loads;
- Work starts at valid schedule;
- Away compression works;
- shopping opens;
- Assets opens;
- property switch works;
- business payout does not duplicate;
- bill breakdown renders;
- mobile page remains usable.

If a destructive or payout-idempotency defect appears, stop the rollout and use the existing rollback process.

## Evidence artifact

Create or update a release validation record covering:

- automated checks;
- economy contract result;
- browser observations;
- physical-device observations;
- migration canary;
- ownership/payout canary;
- exact merge SHA;
- exact deployed SHA;
- post-deploy smoke;
- any explicitly deferred non-blocking observations.

## Guardrails

- No human/device result may be inferred from automated tests.
- No deployment before exact candidate CI passes.
- No manual editing of production saves to make the canary pass.
- No duplicate business payouts across restart/reload.
- No destructive property migration.
- Preserve rollback capability until post-deploy smoke is complete.
- A known open release-blocking gate keeps this TODO open.

## Done when

- [ ] 0085 and 0102 acceptance are complete.
- [ ] 0104–0107 are complete.
- [ ] exact merge candidate CI passes.
- [ ] real v3→v4 migration canary passes.
- [ ] ownership/payout restart canary passes.
- [ ] browser review passes.
- [ ] physical iPhone/Android review passes.
- [ ] PR is merged through protected main.
- [ ] exact merged SHA is deployed atomically.
- [ ] post-deploy production smoke passes.
- [ ] release evidence records exact source/deployment identity.

## Imported review

https://chatgpt.com/s/t_6ad2dc9f25b4819195a821f85bbe1c76

## Implementation evidence

See [follow-up validation](../docs/reviews/wealth-followup-validation.md), the [versioned contract](../docs/architecture/economy-balance-contract.md), and `tests/economy-followup.test.js`.

Migration/ownership canaries and the release procedure are prepared. Actual browser, physical-device and earlier human acceptance remain open. PR #7 remains draft; no merge/deployment is claimed. See [release gate](../docs/reviews/wealth-release-validation.md).
