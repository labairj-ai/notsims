# Main branch protection and CI-gate verification

Configured for `labairj-ai/notsims/main` as part of task 0073.

| Rule | Verified configuration |
| --- | --- |
| Protected branch | `main.protected=true` |
| Pull request before merge | Required; review policy enabled |
| Required check | `build`, GitHub Actions app ID `15368` |
| Up-to-date branch | Required (`strict=true`) |
| Administrator enforcement | Enabled |
| Required reviewer count | 0; no code-owner or last-push approval requirement |
| Force pushes | Disabled |
| Branch deletion | Disabled |
| Main branch lock | Disabled; successful PRs can merge normally |

`Test Notsims` is the workflow title. Its actual check context is `build`; requiring
an unavailable workflow-title context would incorrectly block every merge.
Configuration was applied through the official branch-protection endpoint and
read back from GitHub. See [GitHub's protection API documentation](https://docs.github.com/en/rest/branches/branch-protection#update-branch-protection).

## Controlled failure/success verification

Disposable [PR #2](https://github.com/labairj-ai/notsims/pull/2) used an isolated
branch based on main. It was deliberately non-draft to distinguish the required
CI gate from a draft restriction. It never merged and never changed main or
production. The branch carried an explicit DO NOT MERGE title and README marker.

| Probe | Exact revision | Required `build` | GitHub merge state |
| --- | --- | --- | --- |
| Intentional isolated test failure | `32a6612c9a2b62c06329ff77f761d5e45f6e7962` | FAILURE | BLOCKED |
| Probe removed; benign README marker only | `bba3adccb6f809ed8a47e879f77b35dd80b03671` | SUCCESS | CLEAN |

[Failing CI evidence](https://github.com/labairj-ai/notsims/actions/runs/38983410212),
[passing CI evidence](https://github.com/labairj-ai/notsims/actions/runs/38983484179).
Force-push and deletion protection were checked from the effective configuration;
no destructive attempt against main was made. The temporary PR was closed and
its remote branch removed after recording both outcomes.

## Working policy

Use a feature branch and PR for changes. The existing `Test Notsims` workflow must
complete successfully on the current candidate before normal merge. Keep main
up to date and use normal merge methods. Do not bypass protection for routine
solo development or invent approval requirements that cannot be met. Required
human/physical release criteria remain separate from GitHub's automated gate.
No emergency bypass was used or configured during this verification.
