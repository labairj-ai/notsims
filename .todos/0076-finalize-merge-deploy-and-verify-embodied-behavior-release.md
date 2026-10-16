# Finalize, Merge, Deploy, and Verify Embodied Behavior Release

- **ID:** 0076
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0070, 0071, 0072, 0073, 0074, 0075

## Problem

PR #1 contains the software implementation but should not be treated as a production release until the remaining human/physical acceptance and repository controls are complete.

## Proposed release sequence

1. Resolve all required PR review findings.
2. Ensure TODO status/evidence is accurate.
3. Ensure required CI is green.
4. Mark PR #1 ready for review.
5. Merge through protected `main`.
6. Record exact merge SHA.
7. Pull merged SHA to OptiPlex.
8. Build from clean merged source.
9. Deploy using existing atomic release process.
10. Verify production package hashes.
11. Run production browser smoke.
12. Run concise physical-device production smoke.
13. Preserve previous release for rollback.

## Production checks

Verify:

- home loads;
- Classic loads;
- 3D loads;
- character asset loads;
- all 26 clips packaged;
- Build/Furnish still work;
- social interactions work;
- visitor rendering works;
- shared paid meals charge once;
- shared activity choreography works;
- reduced-motion responds;
- audio works after user gesture;
- no browser console errors.

## Rollback criteria

Rollback immediately for:

- broken load/asset;
- unusable touch controls;
- severe animation corruption;
- persistent NaN/pose explosion;
- severe mobile performance regression;
- duplicated meal charges;
- save corruption;
- audio loop that cannot stop.

Minor gesture tuning or cosmetic clipping may be recorded for follow-up without rollback if gameplay remains sound.

## Completion artifacts

Update:

- `docs/reviews/embodied-character-behavior-validation.md`
- production/deployment validation record
- relevant TODO statuses

Record:

- PR number;
- implementation SHA;
- merge SHA;
- deployed SHA;
- CI run;
- production evidence;
- rollback release identifier.

## Done when

- [ ] PR #1 merged through protected main.
- [ ] merged SHA is deployed.
- [ ] production package matches verified build.
- [ ] Classic/3D production smoke passes.
- [ ] physical production smoke passes.
- [ ] no release-blocking defects remain.
- [ ] previous release remains available for rollback.
- [ ] remaining embodied TODOs are closed only where all acceptance criteria have evidence.

## QA requirements

- [ ] required GitHub CI passes.
- [ ] clean production build.
- [ ] hash/package verification.
- [ ] production browser smoke.
- [ ] physical post-deploy smoke.
- [ ] validation docs updated with exact identities.

## Implementation guardrails

- Preserve domain/render boundaries, deterministic replay and save compatibility.
- Record human/physical outcomes only from actual observed tests.
- Keep exact source/asset identities and open acceptance findings traceable.


## Repository review and integration notes

PR #1 is currently draft/open, not merged or deployed; base main is
`c93f7d6`. Use the actual PR state/merge SHA at execution time. This release item
is gated by the required human/physical reviews; automated success cannot stand
in for them. Branch protection must use the real status context from 0073.

Preserve the existing deployment contract: build the exact clean merged revision
in a verified environment, package the complete dist and identity/hash metadata,
stage on OptiPlex, verify hashes, then atomically switch current and retain the
old target. A clean local/release worktree build is valid; this task must not
require installing a new build runtime on the static host merely because the
source prose says "pull/build on OptiPlex". Verify the canonical clip manifest
(current source expects 26), migrations/save compatibility and rollback policy,
plus exact public bytes/MIME and both renderer workflows. Do not merge or deploy
as part of creating these TODOs.

## Source

Imported from the [PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7), checked against `c43dae2b1e8beccd1896a7173e95dde32f30d9fa` on `codex/embodied-character-behavior` and read-only PR #1/main metadata.
Source scope retained; dependency, check-name and deployment clarifications are recorded above. All new tasks remain open.

## Current acceptance state

Automated evidence and review preparation are in progress. Required human/
physical results remain pending. PR #1 remains draft; merge and production
activation are held by the explicit 0074/0075 acceptance criteria in 0076.
