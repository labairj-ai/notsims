# Certify Mobile Playability on Real Devices

- **ID:** 0031
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0024, 0025, 0026, 0027, 0028, 0029, 0030

## Problem

Viewport emulation and automated pointer tests cannot prove that a touch-first game feels comfortable. Mobile playability needs physical-device acceptance covering reachability, accidental taps, browser chrome, safe areas, pinch/pan behavior, sound unlock and long-session comfort.

## Proposed device matrix

At minimum:
- one modern iPhone running Safari
- one Android phone running Chrome
- one tablet-sized device or tablet emulation plus at least one real tablet if available
- portrait and landscape

Optional:
- Firefox Android
- installed standalone/PWA mode
- older/smaller phone

## Core play scenarios

### 1. Start/resume
- create character
- keyboard opens/closes
- begin/resume game
- audio unlock
- no clipped controls

### 2. Live play
- tap move
- select furniture
- perform interaction
- pan
- pinch zoom
- rotate/recenter camera
- pause/speed
- cancel activity
- inspect needs

### 3. Build
- open Build
- choose room
- draw valid/invalid room
- place floor/wall/door
- pan/zoom without accidental edit
- remove item/tile

### 4. Furnish
- browse categories
- choose furniture
- collapse sheet
- rotate
- place valid/invalid
- place near screen edges

### 5. Work
- choose/change career
- start shift
- use speed controls
- verify completion feedback

### 6. Menus/settings
- save
- audio controls
- help
- import/export where supported
- return without losing sheet/camera state unexpectedly

## UX acceptance metrics

Record:
- accidental action count
- missed-tap count
- controls requiring hand repositioning
- gestures that conflict
- controls hidden by fingers
- clipped safe-area content
- page scroll escapes
- text that requires zoom/squinting
- sheet/world interaction conflicts

A scenario should not pass merely because the command eventually succeeds.

## Automated support

Add browser tests for:
- target bounding boxes >=44px on mobile UI
- no page scroll during core play
- safe-area padding tokens/classes exist
- gesture dispatch counts
- bottom-sheet state changes
- mobile mode help copy
- visual viewport resize handling

## Performance

On physical phones record:
- frame responsiveness while panning/pinching
- input latency subjectively
- 3D performance vs Classic
- whether automatic Classic fallback is preferable on weaker devices

Do not automatically force Classic based solely on mobile detection.

## Completion artifact

Create:
- `docs/reviews/mobile-playability-validation.md`

Include:
- tested SHA
- device/browser/OS
- screenshots
- scenario results
- known limitations
- bugs found/fixed
- final recommendation for mobile default experience

## Implementation guardrails

- Do not waive usability issues because automated tests pass.
- Do not change simulation balance during mobile certification.
- Do not accept a workaround that requires desktop keyboard/mouse.
- Preserve accessibility and reduced-motion preferences where relevant.
- Keep production fallback paths intact.

## Done when

- [ ] iPhone Safari core scenarios pass.
- [ ] Android Chrome core scenarios pass.
- [ ] Portrait is comfortable as the primary mode.
- [ ] Landscape is functional and not broken.
- [ ] No core play flow requires page scrolling.
- [ ] No primary control is below 44x44 CSS px.
- [ ] Tap/pan/pinch classification is reliable.
- [ ] Build/Furnish can be completed without keyboard shortcuts.
- [ ] Object interaction is comfortable with a finger.
- [ ] Safe areas are respected.
- [ ] Audio still unlocks/plays after mobile UX changes.
- [x] Final mobile validation record is committed.

## QA requirements

- [x] Full existing test suite passes.
- [x] Focused mobile tests pass.
- [x] Build/source checks pass.
- [ ] Classic and Three pass.
- [x] GitHub CI passes.
- [x] Production/mobile smoke check passes after deployment.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
