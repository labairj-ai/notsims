# Protect Main and Require CI Before Merge

- **ID:** 0073
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** none

## Problem

The project now has interconnected simulation, rendering, social, persistence, audio, and animation systems, but `main` remains unprotected.

The new PR workflow is substantially safer than direct pushes, but without branch protection it remains convention rather than enforcement.

## Proposed approach

Configure GitHub branch protection/rules for `main`.

Minimum requirements:

- require pull request before merge;
- require successful `Test Notsims` check;
- require branch to be up to date before merge if practical;
- prevent accidental force pushes;
- prevent branch deletion.

Optional:

- require one approval if additional collaborators are introduced later;
- permit repository owner emergency bypass only when explicitly necessary.

## Implementation guardrails

- Do not require unavailable checks.
- Do not block routine solo development with unnecessary approval requirements.
- CI remains the primary automated merge gate.
- Emergency bypass should remain exceptional and documented.

## Done when

- [ ] `main` reports protected/rules-enforced.
- [ ] `Test Notsims` is required.
- [ ] failed CI prevents normal merge.
- [ ] force push/delete protections are active.
- [ ] PR #1 remains mergeable once required checks pass.

## QA requirements

- [ ] confirm successful PR can merge.
- [ ] confirm failed required check blocks merge.
- [ ] record repository governance change in project docs if applicable.



## Repository review and integration notes

Read-only GitHub inspection confirmed `main.protected=false`. PR #1 is draft,
open, based on main and has a passing `build` check in workflow `Test Notsims`.
The required status must use the actual check context (currently `build`, with
its GitHub Actions app identity where supported), not assume the workflow title
is itself a status-check name. Verify current names/permissions/plan support at
execution time. Do not add a mandatory reviewer/approval count to this solo repo
without a need. Test merge protection using safe temporary/draft checks rather
than deliberately pushing failing changes or force-pushing main. Creating this
backlog item does not alter repository settings.

## Source

Imported from the [PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7), checked against `c43dae2b1e8beccd1896a7173e95dde32f30d9fa` on `codex/embodied-character-behavior` and read-only PR #1/main metadata.
Source scope retained; dependency, check-name and deployment clarifications are recorded above. All new tasks remain open.
