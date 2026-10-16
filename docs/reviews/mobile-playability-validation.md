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

## Additional interaction regressions

scripts/mobile-scenarios.mjs checks creator target sizes and a reduced viewport,
needs/half/expanded/collapsed sheets, pause/play, Play while Build is paused,
one-command touch room drawing (16 resulting floor tiles), four on-screen
rotations, touch furniture placement, object action sheet selection/close and
touch help. Classic and Three pass. The sheet test caught parent pointer capture
intercepting the expand button; capture now applies only to heading drags outside
buttons. This correction has a repeatable browser regression scenario.

Initial production release 929208b passed all 56 layout checks and 57 exact-byte
HTTP/MIME checks. Classic/Three desktop and phone-size audio tests passed unlock,
all WAV decoding, MP3 streams/crossfades, mute/settings/persistence, owned-loop
teardown; desktop hidden/resume and failure paths also passed. Audio-disabled
startup and New Game passed. Physical listening remains pending.

## Final production release

- Deployed source: `ef88e605cf6e5c943f214ba86cb90424f705a66f`.
- Release/current target: `/var/www/notsims/releases/20261016T192936Z-ef88e60`.
- Deployed: 2026-10-16T19:30:06.762122+00:00, atomic symlink update.
- Previous release retained: `/var/www/notsims/releases/20261016T191921Z-929208b`;
  prior audio release is also retained.
- Clean checkout: npm ci, 81 tests, build and source checks pass.
- [Corrective CI](https://github.com/labairj-ai/notsims/actions/runs/38954869948): passed.
- [Implementation CI](https://github.com/labairj-ai/notsims/actions/runs/38953999681): passed.
- Final production interaction scenarios: Classic and Three pass, including the
  sheet-button regression and actual one-command room drawing/placement.
- [Production layout evidence](mobile-evidence/production-layout-results.json):
  56 passing checks on the first mobile release; the corrective release changes
  only sheet drag capture and adds the scenario harness/documentation.
- [Final HTTP evidence](mobile-evidence/production-http-results.json): all 57
  responses HTTP 200, correct MIME and byte-identical to the verified build.
  Manifest and both PNG icons included. All 127 packaged file hashes were checked
  on OptiPlex before activation. Existing Nginx/Tailscale routes retained.
- Public game: https://optiplex.tailb97cdb.ts.net/notsims/

The audio harness completed successfully after a delayed Chrome shutdown. All
four desktop/phone renderer cases and unavailable-audio startup passed. This is
not a physical listening result. Real-device certification remains pending as
detailed above.

## Gesture correction and social release

Corrective implementation SHA: `91008ba695c8359c894baa83488c4ea43467359e`.
Task 0032 is complete: Floor, Wall, Door, Erase and Furnish single-pointer drags
over 10 CSS px dispatch zero edits; positive Room drag still dispatches one
BUILD_ROOM. Unit coverage includes return-to-start suppression and the exact
threshold. Actual Chrome touch scenarios pass locally and on production in
Classic and Three; Live pan and multitouch regressions also pass.

The Phone HUD addition passes all 56 existing renderer/viewport/mode layout
checks. Social phone, visitor picking, 44px controls and event response pass at
320px, 390px and desktop. See [social validation](social-simulation-validation.md)
for release and evidence. Physical-device certification is still pending.
