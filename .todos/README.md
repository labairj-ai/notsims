# Architecture implementation order

Tasks 0001–0012 are complete. Their numeric order satisfies all prerequisites.
See the [project README](../README.md#architecture-work-order) for the ordered
list and [validation record](../docs/reviews/architecture-refactor-validation.md).

Tasks 0004, 0005 and 0009 are independently ready after 0003. Task 0008 follows
0004–0007; 0010 follows 0008 and 0009; 0011 follows 0010; 0012 follows 0008 and
0011. Original task descriptions and source SHA are retained in each file.

## Audio expansion

Tasks 0013–0020 are complete. Order: 0013, 0014/0015, 0016/0017, 0018/0019,
then 0020. Numeric order satisfies all dependencies. See the
[audio acceptance record](../docs/reviews/audio-validation.md).

## Production audio certification

0021 is deployed and passes automated production checks. It remains in progress
pending the required human listening result. See the
[production acceptance record](../docs/reviews/audio-production-validation.md).

## Mobile playability

Tasks 0022–0031 imported from the supplied mobile UX backlog. Work order:
0022 → 0023 → 0024/0025 → 0026 → 0027/0028 → 0029/0030 → 0031.
Numeric order satisfies dependencies. Implementation and automated evidence are
recorded in [mobile validation](../docs/reviews/mobile-playability-validation.md).
Real iPhone/Android usability and standalone installation certification remain
open; emulated Chrome is not a substitute for those checks.

## Gesture safety and social simulation

Tasks 0032–0045 are implemented; 0046 has automated coverage with physical mobile acceptance pending. See [social validation](../docs/reviews/social-simulation-validation.md).
0032 is the completed critical Build/Furnish drag-safety correction.
Tasks 0032–0045 passed CI and are deployed at source `91008ba`.

Social work order: 0033 → 0034 → 0035 → 0036 → 0037 → 0038 → 0039 →
0040 → 0041 → 0042 → 0043 → 0045 → 0046. Task 0044 (network introductions
and reputation foundation) is medium priority and can follow the first playable
milestone; it is not a prerequisite for 0046. Numeric order also satisfies dependencies.

See the [social epic overview](../SOCIAL-EPIC-README.md) and
[social architecture](../docs/architecture/social-simulation.md). Existing mobile
and production audio certification requirements remain open as recorded above.

## Social correctness, usability and shared activities

Tasks 0047–0053 are **open**, reviewed against implementation `91008ba` and
imported from the [shared follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain).
This is backlog planning; no gameplay changes are included in this import.

| ID | Priority | Work |
| --- | --- | --- |
| 0047 | Critical | Correct initiative ownership, canonical effects, discovery gates, waiting visitor decisions and visit cooldowns |
| 0048 | Critical | Rank contextual actions; show 3–5 recommendations with More and a concise channel choice |
| 0049 | High | Add bounded repetition fatigue, variety and memory coalescing |
| 0050 | High | Extract focused social modules with unchanged replay behavior |
| 0051 | High | Add semantic text/ring/knock/milestone audio and lifecycle handling |
| 0052 | Critical | Consolidate real iPhone/Android, standalone and human audio acceptance |
| 0053 | High | Add at least four coordinated shared furniture activities |

Recommended sequence: **0047 → 0048 → 0049 → 0050 → 0051 → 0052 → 0053**.
0046's automated baseline is already available; its physical acceptance does not
block starting 0047. Task 0052 validates existing certification requirements
rather than depending on their prior completion. UI/audio implementation and
automated evidence can finish before their human sign-off under 0052. Keep
0052 as the release-readiness gate for the shared-activity feature in 0053.

Review findings are confirmed in current source: unconditional player initiative,
direct autonomy effects, ungated roster candidates, normal actions for waiting
guests, full catalog/channel clusters and full repeat gains. Each task records
its repository-specific integration notes, save compatibility and QA obligations.
