# Mobile, standalone and human audio acceptance

**Certification: pending — no physical device or human listening result is recorded.**
Task 0052 remains in progress. The implementation and automated evidence for
0048, 0051 and 0053 do not satisfy the human checks below. Shared activities were
implemented under the explicit request to build the entire backlog; their
physical smoke check remains part of release acceptance.

## Test record

| Field | iPhone | Android |
| --- | --- | --- |
| Physical device/model | Not tested | Not tested |
| OS version | Not tested | Not tested |
| Browser/version | Safari — version pending | Chrome — version pending |
| Source SHA / build-info.json | Pending | Pending |
| Browser-tab mode | Pending | Pending |
| Installed / standalone mode | Pending | Pending |
| Output device / headphones / Bluetooth | Pending | Pending |
| Tester and test date | Pending | Pending |

Use the production `build-info.json` to record the exact tested source SHA. Use
isolated test storage or back up the player's save before testing imports/new
games. A version 1/2 backup migrates to version 3; older releases cannot load v3.

## Device scenario matrix

Record Pass / Fail / Unsupported with an evidence link and an issue for failures.
Unsupported is not a pass. Run both Classic and Three where supported.

| Scenario | iPhone Safari | Android Chrome | Evidence / issue |
| --- | --- | --- | --- |
| Portrait, landscape, notch/home indicator and browser chrome | Pending | Pending | |
| Creator with keyboard; focus and VisualViewport recover | Pending | Pending | |
| Tap move, object/person picking, one-finger pan, pinch and rotate | Pending | Pending | |
| Pause/resume and speed controls without accidental commands | Pending | Pending | |
| Room drag commits once and shows valid cost/preview | Pending | Pending | |
| Floor/Wall/Door/Erase taps work; >10px drags do nothing | Pending | Pending | |
| Furnish placement/rotation/cancel; drags do nothing | Pending | Pending | |
| Two-finger navigation never edits the lot | Pending | Pending | |
| Phone, Call/Text choice, 3–5 recommendations, More and history | Pending | Pending | |
| Incoming call/text: answer, decline, ignore; correct initiative | Pending | Pending | |
| Unexpected visitor: arrival decision required; accept/decline/ignore | Pending | Pending | |
| Known friend call/text, conflict and apology | Pending | Pending | |
| Tomorrow's plan survives save/reload; visitor arrives/leaves | Pending | Pending | |
| One-handed comfort, missed taps, grip changes and scroll traps | Pending | Pending | |
| Shared sit/watch/eat/cook/read; both people move and act | Pending | Pending | |
| Shared cancellation, departure, blocked object and reload | Pending | Pending | |
| Background/resume: clock holds, audio stops and resumes safely | Pending | Pending | |
| Music, UI sounds, footsteps and interaction loops audible | Pending | Pending | |
| Text tone, bounded ringtone, knock and milestone audible | Pending | Pending | |
| Answer/decline/expiry stops ring; no duplicate visitor knock | Pending | Pending | |
| Master/bus/mute balance and Bluetooth/output switching | Pending | Pending | |
| Android install / iOS Add to Home Screen | Pending | Pending | |
| Standalone start URL `/notsims/`, safe areas and icons | Pending | Pending | |
| Browser/standalone save origin and persistence after relaunch | Pending | Pending | |

## Existing acceptance mapping

| Backlog | Criteria validated here | Closure rule |
| --- | --- | --- |
| 0021 | Human audible music/SFX and output/mute investigation | Record actual listening result in its original validation record |
| 0023–0029 | Physical shell, controls, navigation, placement, selection, creator/help | Map each original physical requirement to observed evidence |
| 0030 | Android/iOS install, cold launch, safe area and local save | Keep unsupported platforms explicitly documented |
| 0031 | Physical iPhone/Android core scenarios | Complete its original scenario matrix with device evidence |
| 0046 | Physical social scenarios | Add exact SHA and outcomes to social validation |
| 0048 | Contextual action usability on real hardware | Confirm recommendations/More/channel flow with a finger |
| 0051 | Human social audio listening | Confirm all four social cues and ring lifecycle |
| 0053 | Physical shared-activity smoke | Confirm approach, poses, actions, cancellation and comfort |

## Final decision

- Critical defects: not assessed on hardware.
- Usability findings: pending physical review.
- Installation certification: pending.
- Human listening certification: pending.
- Final mobile/social certification: **withheld until the evidence above exists**.

Automated evidence is documented in `social-followup-validation.md`. It verifies
layout, commands, state, assets and browser execution; it does not certify touch
comfort, installation behavior on hardware or sound heard by a human.
