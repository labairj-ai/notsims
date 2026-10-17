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

- [x] PR #1 merged through protected main.
- [x] merged SHA is deployed: `d894f59ef1e9d991da11ce9525973e9d5f063d13`.
- [x] production package matches verified build (61 public byte/MIME responses; 164 active-release hashes).
- [x] Classic/3D production smoke passes (52 embodied and 58 responsive/mobile-browser scenarios).
- [ ] physical production smoke passes.
- [ ] no release-blocking defects remain.
- [x] previous release remains available for rollback: `20261016T222751Z-69b09c6`.
- [ ] remaining embodied TODOs are closed only where all acceptance criteria have evidence.

## QA requirements

- [x] required GitHub CI passes: [run 38983991284](https://github.com/labairj-ai/notsims/actions/runs/38983991284).
- [x] clean production build, 142 tests and source checks pass.
- [x] archive and active release hashes verified.
- [x] production browser smoke; see deployment validation record.
- [ ] physical post-deploy smoke.
- [x] validation docs record exact source, package, release and test identities.

## Implementation guardrails

- Preserve domain/render boundaries, deterministic replay and save compatibility.
- Record human/physical outcomes only from actual observed tests.
- Keep exact source/asset identities and open acceptance findings traceable.


## Repository review and integration notes

At execution, PR #1 was open/draft with base `c93f7d6`; it was marked ready and
merged through protected main at user direction. The required human/physical
reviews remain incomplete; automated success does not stand in for them.

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
Source scope retained; dependency, check-name and deployment clarifications are recorded above. At import time all new tasks remained open; 0070–0073 are now complete and 0074–0076 remain in progress.

## Current acceptance state

The merged release is deployed and automated production checks passed. Required
human/physical results and physical post-deploy smoke remain pending; 0074/0075
are not closed. See the production validation record.


## Deployment record

At the user's explicit request, the release was merged and deployed before the
0074/0075 human and physical acceptance criteria were complete. They remain open,
and this TODO is still in progress pending named human review and physical
post-deploy smoke. See [production validation](../docs/reviews/embodied-production-deployment-validation.md).
