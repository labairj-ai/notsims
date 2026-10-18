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

Tasks **0070–0076** were imported from the
[PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7)
and checked against draft [PR #1](https://github.com/labairj-ai/notsims/pull/1),
implementation `c43dae2`. The initial import was backlog-only; subsequent work
implemented 0070–0073 and deployed the merged release under the user's explicit
request. Human/device acceptance remains separate and pending.

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
them already being certified. Those acceptance gates remain open after the user
requested deployment; 0076 records both the release and the pending acceptance.

Read-only review found main unprotected and PR #1 draft with successful `build`
check under workflow `Test Notsims`; require the actual check context when 0073
is executed. Existing static hosting and clean-build/hash/atomic-release contracts
remain authoritative. Each task records source and repository-specific notes.

0070–0073 are complete: status ownership and baseline terminology corrected,
eligibility evaluated once, and main protection verified with a disposable failing/
passing PR. 0074/0075 remain in progress for actual human/device observations.
0076 remains in progress: the merged build is deployed, but required human/device
acceptance and physical post-deploy smoke remain open. See [follow-up evidence](../docs/reviews/pr-acceptance-followup-validation.md)
and [production validation](../docs/reviews/embodied-production-deployment-validation.md).


## Away Activity and Work time compression

Tasks **0077–0083** were imported from the
[Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a)
and checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3.
They define reusable off-lot activity policy, then apply it to rabbit-hole Work.

| ID | Priority | Work |
| --- | --- | --- |
| 0077 | Critical | Define generic Away Activity and time-compression contract |
| 0078 | Critical | Add automatic 24× Work time compression |
| 0079 | Critical | Add generic Away Need Affordance engine |
| 0080 | Critical | Add workplace bathroom and meal-break self-care |
| 0081 | High | Add attention boundaries and scheduled-plan conflict handling |
| 0082 | High | Add away status UI and future strategy hooks |
| 0083 | Critical | Add deterministic away-time and Work acceptance harness |

Recommended implementation order: **0077 → 0079 → 0080 → 0078 → 0081 → 0082 → 0083**.
Numeric order alone does not express the dependencies. Define the generic away
contract and care semantics before enabling 24×; otherwise fast-forward magnifies
the current absence of workplace self-care. These tasks are proposed work and do
not claim the pending human/device acceptance from 0074–0076.

## Career, Away Activity, and Wealth Ecosystem

TODOs **0084–0103** were imported from the [Review Game Architecture feedback](https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145). Software is implemented for 0084 and 0086–0103. Physical acceptance 0085 and browser/mobile acceptance for 0102 remain open; full criteria and evidence are in their individual files. Shared economy assumptions, purchase tiers, and the cross-task price map are in the [ecosystem backlog plan](../docs/reviews/career-away-wealth-ecosystem-backlog.md).

| ID | Priority | Work |
| --- | --- | --- |
| 0084 | High | Harden optional Away-policy affordances |
| 0085 | Medium | Complete physical Work/Away mobile acceptance |
| 0086 | Critical | Add Career Performance foundation |
| 0087 | Critical | Add Work strategies |
| 0088 | Critical | Add scheduled Work shifts and attendance |
| 0089 | High | Add coworker experiences and Work events |
| 0090 | Critical | Add paid skill classes as the second real Away consumer |
| 0091 | High | Generalize Away destinations for errands, appointments, and travel |
| 0092 | Critical | Define tiered purchase and ownership contract |
| 0093 | High | Expand entry-level purchase ecosystem |
| 0094 | High | Add comfortable/middle-class purchase ecosystem |
| 0095 | High | Add really expensive/premium purchase ecosystem |
| 0096 | Medium | Add ultra-luxury assets |
| 0097 | High | Add vehicle and transportation ownership |
| 0098 | Critical | Add property and residence progression |
| 0099 | High | Add businesses and income-producing assets |
| 0100 | Critical | Add ownership upkeep, maintenance, and operating costs |
| 0101 | Medium | Add prestige, collection, and aspiration hooks |
| 0102 | High | Upgrade shopping and asset-management UX |
| 0103 | Critical | Build economy balance simulator and wealth acceptance harness |

Recommended order: career depth **0084 → 0086 → 0087 → 0088 → 0089**; Away reuse **0090 → 0091**; purchase contract and tiers **0092 → 0093 → 0094 → 0095**; ownership **0097 → 0098 → 0099 → 0100**; then luxury meaning and UX **0096 → 0101 → 0102**; finish with economy certification **0103**. Physical acceptance **0085** can run independently when iPhone and Android devices are available. Task 0092 intentionally precedes expansion of the catalog so all purchase types share one ownership/economy contract.

Validation and measured economy progression: [career/wealth report](../docs/reviews/economy-progression-validation.md). Save version 4 explicitly migrates existing careers and starter-property ownership. Run `npm run simulate:economy` to regenerate the deterministic evidence.

## Wealth follow-up implementation

Imported from [the wealth follow-up review](https://chatgpt.com/s/t_6ad2dc9f25b4819195a821f85bbe1c76). Execute **0104 → 0105 → 0106 → 0107 → 0108**. Simulator fidelity and balance policy are separate tasks. 0108 retains explicit human/device release gates.

| ID | Work |
| --- | --- |
| 0104 | Run business economy simulation through canonical gameplay |
| 0105 | Define versioned economy balance targets and CI regression gates |
| 0106 | Make Career Performance drive bounded career progression |
| 0107 | Give existing Premium/Ultra assets distinct gameplay identities |
| 0108 | Certify the accepted wealth release and deploy its exact merged source |

0104–0107 are implemented with canonical simulation, balance v2, performance-gated levels and premium identities. 0108 remains in progress for the explicit browser/physical/human gate; [validation](../docs/reviews/wealth-followup-validation.md) and [release gate](../docs/reviews/wealth-release-validation.md).

## Character appearance and hair rendering

Six tasks imported from the [shared appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f). **0109–0112 are complete**; **0113 has automated matrix evidence and is blocked on human visual acceptance**; **0114 has automated lifecycle/parity coverage with human mobile feedback open**. The source's 0104–0109 IDs overlap existing wealth work; they map to **0109–0114** without renumbering existing tasks.

| Repository ID | Source ID | Work |
| --- | --- | --- |
| 0109 | 0104 | [Neutralize Hair Textures for Runtime Tinting](0109-neutralize-hair-textures-for-runtime-tinting.md) |
| 0110 | 0105 | [Add Explicit Character Appearance Material Bindings](0110-add-explicit-character-appearance-material-bindings.md) |
| 0111 | 0106 | [Define Tintable Material Authoring Contract](0111-define-tintable-material-authoring-contract.md) |
| 0112 | 0107 | [Add Hair Color Material and Asset Regression Tests](0112-add-hair-color-material-and-asset-regression-tests.md) |
| 0113 | 0108 | [Add Rendered Hair Color and Style Acceptance Matrix](0113-add-rendered-hair-color-and-style-acceptance-matrix.md) |
| 0114 | 0109 | [Verify Appearance Persistence, Renderer Parity, and Mobile Creator Feedback](0114-verify-appearance-persistence-renderer-parity-and-mobile-creator-feedback.md) |

Execution order: **0109 → 0110 → 0111 → 0112 → 0113 → 0114**. First neutralize all three exported hair textures without changing alpha/geometry/UVs, bind cloned appearance materials explicitly, define and measure the tintable material contract, then add runtime and authored-texture regressions. Validate the 18 color/style combinations in creator/live rendering, day/night cases, and persistence/Classic/mobile parity.

GameState keeps semantic hair color and hairstyle; neutral authored detail plus per-character runtime tint produces the rendered appearance. Keep the original brown asset as a negative regression case. Material-property assertions alone cannot establish visible hair-color correctness. See [appearance validation](../docs/reviews/character-appearance-validation.md) for 186 tests, reproducible asset/alpha checks and the rendered matrix. Existing wealth release and human/mobile/audio gates remain open; no certification or deployment is claimed.
