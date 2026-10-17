# Embodied character behavior validation — 2026-10-16

Software implementation is available for 0054–0069. Final human and physical
certification is **pending**, including the existing 0052 audio/standalone gate.
This record does not close physical-device requirements in prior tasks.

## Scope and identity

Architecture: [body behavior contract](../architecture/embodied-character-behavior.md).
The implementation replaces no simulation authority. Save v3, navigation,
relationships, social RNG and completion rules remain authoritative. The only
intentional economy change is the previously missing shared-food transaction.

Asset: `assets/notsims-human.glb`, 6,801,368 bytes, SHA256
`27c2e49a1ef0097a01459df989d516ebef5acfdbcd3c2229ca62007ba027773d`.
Exporter SHA256: `4e6062b93452f0d0ca483eea64668f0e11b60ef71399e7956453f009668cfbef`.
Pinned Blender 4.5.4 LTS and MPFB source/provenance remain as in assets/README.md.
Two separate headless exports produced identical structural metadata. Binary
identity across Blender versions is not assumed. Export metadata is checked in.
Exact code identity is the implementation commit containing this record; CI
reports must be associated with that commit, not the earlier 69b09c6 baseline.

## Automated evidence

- Unit/interface/scenario suite includes pure action/affect/staging queries,
  all social mappings and both roles/channels, all object rotations and phases,
  all five shared activities, directionally asymmetric relationships, missing or
  departing partners, enabled/disabled simulation equality, bounded reactions,
  live motion policy, pause/hide/reset and safe seat offsets.
- Actual GLB parsing verifies 26 unique required clips, finite tracks, constant
  bone translations, compatible loop endpoints, 53 bones, independent cloned
  materials/skeletons, upper-body masks, IK reachability/error reduction without
  stretching, missing chain/clip fallback, gaze bounds and interrupt cleanup.
- Source architecture test prohibits domain imports of presentation, Three or UI
  through presentation paths. Build verifies asset bytes, pinned metadata,
  complete clip vocabulary and packaged module graph.
- Browser harness: `scripts/qa-embodied.mjs`; Chrome headless on macOS, software
  WebGL, Classic and Three at 1440×1000 and 390×844. 52 scenario screenshots:
  all five shared activities, fridge/bed/shower/toilet/desk and introduction,
  argument/apology. Live reduced-motion change and no page errors were checked.
  It also checks $16-for-two labels, disabled/reenabled meal choice, actual
  authoritative approach/completion and exactly one charge in both renderers.
  Screenshots/results live at `/private/tmp/notsims-embodied-browser` in the
  authoring workspace; this is desktop emulation, not physical acceptance.
- Close-view image inspection covered sofa seating, fridge use, cooking and
  Classic argument. This is agent visual QA, not human motion review.

Final local verification: 141 tests passed; build, source checks and diff checks
passed. The bundle verifies 105 packaged JS modules and all 26 clips. Remote CI
results should be read from the implementation PR.
Do not interpret an unchecked human requirement below as a software test pass.

## Shared food policy and evidence

One shared purchase covers **two portions**, paid by the household:
prepared/table meal $16 (2 × the unchanged $8 solo meal), cooked/stove meal $24
(2 × unchanged $12 solo cooking). Quick snack stays free. Prices are centralized
in `src/content/meals.js`; path distance is explicitly named `pathDistance`.

Eligibility checks participants, queue/reservations, paths/object and money.
No money changes during approach. At coordinated arrival, funds are revalidated
and a single canonical MONEY_SPENT fact (`reason: shared_meal`) precedes active
hunger recovery. Insufficient funds cancels without food benefits. Cancellation,
timeout, departure or object change before active consumption costs nothing;
after consumption, portions are purchased and no refund is issued. This also
applies to save/export/load: transient activity is cleared, money/received needs
are retained, with no resumption/recharge/refund. No migration is needed.

Tests cover exact/insufficient funds, one charge, late funds loss, unreachable
paths, reservations, before/after cancellation/departure/object changes/timeout,
save/load, deterministic scenarios and unchanged solo/free-snack contracts.

## Performance and accessibility

Reproduce CPU profile: `node scripts/profile-animation.mjs`. Node 26 on the
macOS authoring host, geometry-only GLTF parse (texture/GPU excluded): 14.41 ms.
1000 measured frames after 200 warm-up frames:

| Actors/mixers | Controller p95 ms | Two-arm-chain fixture IK p95 ms |
| --- | ---: | ---: |
| 1 | 0.023 | 0.009 |
| 3 | 0.063 | 0.027 |
| 4 (production cap) | 0.068 | 0.034 |
| 8 (synthetic only) | 0.141 | 0.067 |

These are headless desktop CPU measurements, not end-to-end frame timings.
The IK fixture solves one reachable hand per actor. Solvers reuse vector and
quaternion scratch storage; intents are bounded short-lived objects. Actual
browser allocation/frame, GPU, phone frame timing and battery/thermal behavior
remain unmeasured. Local policy targets 60 fps (minimum sustained 30), controller
p95 <8 ms and IK <2 ms at the four-actor production cap. Sustained controller
cost >8 ms removes optional visitor IK/micro-idle before player/partner detail.

Live `prefers-reduced-motion` suppresses decorative sway/glances/flourishes,
retaining essential social/action feedback at reduced amplitude. `?body=off`
provides the **behavior-off baseline** without simulation/save changes. It keeps
the expanded GLB, clip vocabulary, current renderer and loading path. It disables
gesture, gaze, IK, affect/posture, micro-motion and synchrony layers. It is not an
old-asset or pre-embodied load/performance baseline. For that comparison, use the
separate exact prior release `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`
and its asset hash; never attribute the current asset load cost to behavior-off.

## Required human/physical acceptance — pending

| Surface | Required observation | Evidence/result |
| --- | --- | --- |
| Desktop Chrome/Safari | Natural gaze, repetition, gestures, clipping, sit/stand, 1×/3×/8× | Pending human motion review |
| Physical iPhone Safari | Same, touch readability, portrait/landscape, four actors, motion comfort | Pending |
| Physical Android Chrome | Same, thermal/frame stability and contact accuracy | Pending |
| Installed standalone | Existing 0052 launch/safe-area/touch matrix and new motion | Pending |
| Audible output | Existing 0052 human audio matrix plus reach/contact correlation | Pending |
| Classic on physical phones | Gesture/posture readability and picking at all rotations | Pending |

Record tester/date, device/OS/browser, exact implementation/asset identities,
actual video/audio evidence, observations and pass/fail before certification.
Static snapshots do not establish convincing motion. Known scope limits: no
physics/animated furniture doors; IK falls back when a safe approach cannot
reach a visual anchor; standing shared TV/table/book/desk slots do not invent
chairs. Sit/lie transitions, clipped contacts and gaze comfort require the human
matrix above. No physical or listening result is inferred here.

## Evidence and acceptance ownership (0070/0072)

0054 and 0069 retain their completed software evidence. 0055 and 0065 are in
progress: their structural tests passed, while perceptual transition criteria
remain unchecked. 0056–0064 and 0066–0068 retain their pending human/device status.
0074 owns the desktop motion review and 0075 owns the physical/standalone/thermal/
listening matrix. 0068 consolidates that evidence without duplicating or inventing
a pass. The original `c43dae2` implementation evidence remains traceable through
PR #1; later corrective checks identify their own source SHA.

Use behavior-off to isolate procedural presentation effects on the same asset.
Use a separately checked-out old release for asset/load/performance comparisons.
Neither comparison establishes human motion quality or physical phone comfort.

## PR correction pass

See [0070–0076 evidence](pr-acceptance-followup-validation.md) for corrected status
ownership, single shared-candidate evaluation, behavior-off terminology and
verified branch protection. Candidate tests: 142 passing; browser matrix: 52
passing. Human/physical acceptance remains pending. PR #1 has since merged and
deployed; see the deployment record.

## Desktop review form — 0074 (pending)

Available corrected code: `428b08b2192229bf42db71017d54b81ee5d47236`;
review-preparation tools/documentation: `fe599b5b075b8ff5c63f2eb3ec5836a0663b6e70`.
The character asset identity above is unchanged. Record the actual final tested
revision, tester, date, OS/browser and observations; these are currently **pending**.

| Desktop observation | Speeds / contexts | Human result |
| --- | --- | --- |
| Walking: normal, tired, tense; feet/arms/torso/start-stop | 1× / 3× / 8× | Pending |
| Introduction/chat/compliment/confide | Both roles, Classic and Three | Pending |
| Joke success/failure, apology accepted/rejected | Both outcomes | Pending |
| Argument/insult, spacing, gaze/aversion, repetition/synchrony | Stranger/friend/tense | Pending |
| Fridge/stove/sofa/bed/shower/toilet/desk/bookcase/TV | Contact, clipping, all rotations, cancel | Pending |
| Sit/chat, TV, eating, cooking, reading together | Complementary roles and cancellation | Pending |
| Tired/content/tense/hungry/bored/disconnected readability | Without reading debug values | Pending |

Representative muted motion recordings are review preparation, sampled at up to
15 fps; use live interactive play to judge full-rate smoothness and all required
scenarios. No dedicated new need-flourish clips are added without observed human
readability defects. Record defects and source/asset identity, fix them, rerun
affected automated cases and repeat human review before closing 0074.


## Production deployment — 2026-10-17

PR #1 merged and exact merge SHA deployed to OptiPlex at the user's direction.
Automated production verification passed; human/device acceptance remains open.
See the [deployment validation record](embodied-production-deployment-validation.md).
