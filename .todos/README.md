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

Tasks 0047–0053 have implementation and automated coverage, reviewed against implementation `91008ba` and
imported from the [shared follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain).
The original import was planning-only; implementation is now deployed at `69b09c6`.

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

Tasks 0047, 0049 and 0050 are complete with CI and production verification;
0048, 0051 and 0053 retain their required human acceptance, consolidated in 0052.
See [follow-up validation](../docs/reviews/social-followup-validation.md) and
[physical/audio acceptance matrix](../docs/reviews/mobile-social-human-acceptance.md).
The explicit request to build everything included shared-activity implementation;
0052 remains the human certification gate and has not been declared passed.

## Embodied character behavior and food-economy correction

Tasks **0054–0068** were imported from the
[replacement embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9)
and checked against implementation `69b09c6`. **0069** is a separate critical
correctness task identified while reviewing its claim of an earlier food fix.
Software implementation and automated evidence are now available; see the
[body validation record](../docs/reviews/embodied-character-behavior-validation.md).
0054, 0055, 0065 and 0069 are complete. Other items retain their human/physical
acceptance requirements; 0052/0068 are not certified.

| ID | Priority | Work |
| --- | --- | --- |
| 0054 | Critical | Define renderer-neutral BodyIntent, layering, timing and behavior mappings |
| 0055 | Critical | Expand reproducible CC0 animation primitives and clip metadata |
| 0056 | Critical | Add bounded head/neck/torso attention and gaze |
| 0057 | High | Add safe relationship/context-aware conversation staging |
| 0058 | Critical | Choreograph social speaker/listener gestures and outcome reactions |
| 0059 | High | Derive subtle mood/need presentation without changing travel or outcomes |
| 0060 | High | Add irregular micro-idle and social backchannels |
| 0061 | Critical | Add rotated neutral furniture anchors and bounded hand IK |
| 0062 | Critical | Choreograph object use and align semantic audio phases |
| 0063 | Medium | Add delayed, partial relationship-aware synchrony |
| 0064 | High | Give all five shared activities complementary two-person choreography |
| 0065 | Critical | Build the layered animation controller and interrupt-safe ownership |
| 0066 | High | Render equivalent semantic gestures and postures in Classic |
| 0067 | High | Add reduced motion, degradation policy and measured mobile budgets |
| 0068 | Critical | Validate the full matrix and record real human animation acceptance |
| 0069 | Critical | Correct shared-food charges, consumption and atomic cancellation policy |

Suggested execution: **0069 → 0054 → 0055 → 0065 → 0056 → 0057 → 0058 →
0059 → 0060 → 0061 → 0062 → 0063 → 0064 → 0066 → 0067 → 0068**.
0069 can also run independently alongside the presentation foundation; it must
land before 0064. Numeric order alone is not a valid execution order here.

Dependency corrections from the source:

- 0065 originally depended on 0055–0064 while the recommendation put it first.
  Its foundation now follows 0054/0055; procedural consumers depend on that API.
  Combined-layer integration is validated by 0067/0068 without a dependency cycle.
- 0060 requires 0059; it cannot precede affect support as the prose suggested.
- 0053/0048 implementation is available; their outstanding human acceptance
  does not prevent building this presentation layer.
- 0068 can prepare automated evidence before 0052 closes. Final human/mobile
  certification still accounts for 0052 and never infers a physical result.
- The source's eight-character performance case is synthetic stress testing;
  production remains capped at one player plus three visitors.
- The missing food-economy correction is implemented under 0069: shared meals
  purchase two portions once at coordinated arrival. See the validation record.

Each item retains its proposed behavior and guardrails, plus repository-specific
integration notes and QA. Presentation must remain separate from gameplay truth,
consume no simulation RNG, preserve saves/replay and share intent across renderers.

## Embodied PR acceptance and release follow-ups

Tasks **0070–0076** are open, imported from the
[PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7)
and checked against draft [PR #1](https://github.com/labairj-ai/notsims/pull/1),
implementation `c43dae2`. This import is backlog-only: no runtime, status
reconciliation, branch-protection, merge or deployment changes are performed.

| ID | Priority | Work |
| --- | --- | --- |
| 0070 | High | Reconcile embodied completion claims with pending perceptual acceptance |
| 0071 | Medium | Evaluate shared-activity eligibility once per candidate |
| 0072 | Low | Distinguish behavior-off from an actual old-release performance baseline |
| 0073 | High | Protect main and require the actual GitHub Actions check before merge |
| 0074 | Critical | Perform and record desktop human motion review |
| 0075 | Critical | Complete physical mobile, standalone, thermal and audible-output acceptance |
| 0076 | Critical | Merge the accepted candidate, atomically deploy and verify production |

Suggested sequence: **0070 → 0071 → 0072 → 0073 → 0074 → 0075 → 0076**.
0071/0072 are independent pre-merge corrections; 0073 can run alongside them.
0070 reviews evidence/status now rather than waiting on 0068 human acceptance.
0074 needs implementation readiness, not completed human acceptance of the same
features. 0075 validates 0052/0067/0068 physical criteria instead of depending on
them already being certified. 0076 keeps those actual human/physical release gates.

Read-only review found main unprotected and PR #1 draft with successful `build`
check under workflow `Test Notsims`; require the actual check context when 0073
is executed. Existing static hosting and clean-build/hash/atomic-release contracts
remain authoritative. Each task records source and repository-specific notes.
