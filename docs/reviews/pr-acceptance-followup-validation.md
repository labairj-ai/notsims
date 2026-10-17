# PR acceptance follow-up validation

Corrected code candidate: `428b08b2192229bf42db71017d54b81ee5d47236`, subsequently
merged in `d894f59ef1e9d991da11ce9525973e9d5f063d13` through [PR #1](https://github.com/labairj-ai/notsims/pull/1).
Original embodied implementation: `c43dae2b1e8beccd1896a7173e95dde32f30d9fa`.
Character asset SHA256:
`27c2e49a1ef0097a01459df989d516ebef5acfdbcd3c2229ca62007ba027773d`.

## Completed corrections

- 0070: 0055/0065 are in progress, with unobserved perceptual transition criteria
  unchecked. Structural evidence is retained; 0074 owns desktop review, 0075 owns
  physical/standalone/thermal/listening review, and 0068 consolidates the results.
- 0071: each matching shared candidate prepares once within the current query;
  there is no cache across state changes. Order, cap, meal prices, disabled
  insufficient-funds options and authoritative start revalidation are preserved.
  The regression test instruments a funds read to catch duplicate preparation,
  proves query purity and rejects starting after funds change.
- 0072: behavior-off terminology explicitly retains the current expanded asset,
  clip library, renderer and loading path. A true old-release baseline is a
  separate source/asset checkout. Runtime disable semantics are unchanged.
- 0073: [main protection and controlled CI-gate evidence](branch-protection-validation.md).

## Automated candidate evidence

- [Candidate CI passed](https://github.com/labairj-ai/notsims/actions/runs/38983577325).
- A clean detached checkout at the code candidate passes offline npm ci, all
  142 tests, build and syntax checks.
- 142 tests pass, including the original shared-food tests and behavior-off
  simulation/save/RNG parity coverage.
- Build and source checks pass. The bundle verifies 105 JS modules, 26 clips,
  53 bones, pinned exporter and 6,801,368 character bytes.
- [52 browser cases](pr-acceptance-evidence/browser-results.json) pass in Classic
  and Three at desktop and phone-size viewports; live reduced motion, paid meal
  labels/disabled state, completion and exactly one charge pass with no page errors.
- Browser scenarios are representative automated fixtures and do not establish
  motion quality, actual phone performance, touch comfort or audible output.

- [Recording-tool CI passed](https://github.com/labairj-ai/notsims/actions/runs/38983810926).
- [Desktop motion review gallery](pr-acceptance-evidence/motion-review/index.html):
  16 verified four-second muted clips, generated from `fe599b5` in both renderers.
  These sampled recordings prepare human review; they do not certify smoothness.

## Pending human and release work

0074 remains in progress: a named human must review the desktop motion matrix
through time and record observations/pass/fail on the exact source and asset.
Representative muted review clips and the full interactive matrix are preparation,
not a claimed human result. Obvious fixes still require affected checks to rerun.

0075 remains in progress: actual iPhone/Android, installed mode, sustained thermal/
performance, reduced motion, and human audio observations remain pending in the
[human acceptance matrix](mobile-social-human-acceptance.md). No device or tester
identity has been inferred.

0076 is in progress. At the user's explicit direction, PR #1 was marked ready,
merged through protected main, and deployed atomically before human/device
acceptance was complete. This release event does not close 0074 or 0075 or record
those outcomes as passed. The exact deployed SHA and production checks are in the
[deployment validation record](embodied-production-deployment-validation.md).
