# Mobile playability validation

Date: 2026-10-16. Source baseline: 59befeaa3ea7ffa6c7f32f66600ab66b11746ab2.
Implementation: commit titled `Build mobile-first world shell and touch controls`;
exact deployed SHA and release evidence are appended after clean release checks.

## Implemented

Full viewport safe-area shell, VisualViewport resizing, compact HUD and time
controls, persistent four-mode navigation, internal scrolling sheets with three
sizes, contextual tool/placement trays, on-screen rotation/cancel, trusted pointer
arbitration, pinch/pan, authoritative cloned room estimates, renderer highlights,
bounded touch object selection, mobile creator/form/help, and standalone manifest
with 192/512px icons. Desktop shortcuts and renderer choice remain available.
No GameState, commands, replay fixtures, game balance or audio architecture changed.

## Automated evidence

macOS host; Google Chrome 155.0.8059.82, headless, touch/viewport emulation.
No physical phone was connected. [Results](mobile-evidence/automated-results.json)
cover Classic and Three at 320×568, 360×800, 390×844, 430×932, 844×390,
768×1024 and 1440×900. Four modes per combination: 56 layout checks.
There were zero document overflow failures, undersized rendered mobile controls,
or browser runtime errors. Browser-generated touch events in both renderers
confirmed pan and two-pointer edit navigation dispatch no game commands; a tap
dispatches at most one. Audio unlocked with a trusted interaction and reported
no diagnostic errors. This is not evidence of audible human playback.

81 Node tests pass, including existing deterministic replay and renderer tests,
gesture threshold/second-finger/cancel regressions, bounded/occlusion-aware object
selection and cloned room validation. Build and source checks pass. Audio bundle
remains 1,898,360 bytes with 51,816-byte essential preload and 4,068,481-byte
estimated decoded SFX, unchanged from the previous release. Build verifies the
manifest identity, scope of launch, standalone display and packaged icons.

[Baseline review](mobile-playability-review.md) includes original screenshots and
control inventory. Selected new screenshots are in [mobile-evidence](mobile-evidence/).
The repeatable browser harness is scripts/mobile-smoke.mjs; use external Chrome
and a module exporting Puppeteer as documented in deploy/README.md.

## Outstanding certification

**Do not label this release real-device certified.** Task 0031 remains in progress.
Required physical iPhone Safari and Android Chrome portrait/landscape scenarios
remain untested: notch/home-indicator behavior, browser chrome changes, software
keyboard, text scaling, comfortable one/two-thumb use, missed taps, accidental
actions, finger occlusion, hand repositioning, input latency and rendering speed.
Real device installation, cold launch, resume, origin/storage continuity and
physical audio listening also remain pending. No performance or comfort metrics
are fabricated. Tablet coverage is emulated only.

Automated coverage is strongest for layout, existing deterministic gameplay and
gesture arbitration. Exhaustive touch-only construction/furnishing/career,
import/export, all sheet drags, unavailable-audio, and cross-device lifecycle
scenarios still need the full human scenario pass. Recommendation: use portrait
mobile shell as implemented for evaluation; withhold mobile certification until
those checks pass and record device, OS/browser, SHA, outcomes and screenshots.
