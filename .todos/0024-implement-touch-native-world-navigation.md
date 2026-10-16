# Implement Touch-Native World Navigation

- **ID:** 0024
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0022, 0023

## Problem

Current mobile input inherits desktop assumptions:
- camera pan requires right-mouse drag;
- zoom requires mouse wheel or small +/- buttons;
- pointer input does not distinguish tap from drag for mobile camera manipulation;
- multi-touch is not used.

This makes basic world navigation cumbersome on phones.

## Proposed approach

Use Pointer Events as the single input model and add explicit gesture classification.

### Live mode

- single tap:
  - furniture -> select/show interaction actions
  - ground -> move
- single-finger drag after movement threshold -> pan camera
- pinch -> camera zoom
- optional inertial pan after release
- explicit camera rotate controls remain available as accessible fallback
- prevent a drag from becoming an accidental MOVE_TO

### Build/Furnish mode

- single tap -> edit/place/select according to current tool
- Room tool single-finger drag -> room rectangle
- two-finger drag -> camera pan
- pinch -> zoom
- camera navigation must not create/edit/place objects
- optional rotation gesture is deferred unless it can be implemented without ambiguity

### Gesture classifier

Track active pointer IDs and classify:
- tap
- drag/pan
- room-drag
- pinch
- cancel

Use explicit thresholds in CSS pixels and document them.

Recommended starting values:
- tap movement threshold: 8-12 CSS px
- no movement command after a classified pan
- no build edit after a classified pinch/two-finger pan

## Touch-action policy

- Keep custom touch behavior scoped to the world surface.
- Do not disable browser touch behavior globally.
- Preserve standard scrolling within dialogs/sheets.
- Ensure pointercancel resets every gesture state safely.

## Touches

- `src/ui/input.js`
- optional `src/ui/gestures.js`
- renderer camera adapters
- `src/style.css`
- input tests
- browser gesture smoke harness

## Implementation guardrails

- Gesture code may manipulate presentation camera state but not simulation state directly.
- Gameplay mutations must continue through commands.
- Do not duplicate separate touch and mouse business logic.
- Mouse behavior remains supported.
- Pointer cancellation must never leave `roomStart`, selected drag state or captured pointers orphaned.
- Pinch zoom must be bounded by the same canonical camera zoom limits used elsewhere.
- Fast gestures must not enqueue multiple MOVE_TO commands.

## Done when

- [ ] Live tap-to-move works reliably.
- [ ] Live object taps do not become camera pans.
- [ ] One-finger Live drag pans the camera.
- [ ] Pinch zoom works in Classic and Three.
- [ ] Build/Furnish two-finger pan works without editing the world.
- [ ] Room draw still works with one-finger drag.
- [ ] Pointercancel/second-pointer transitions clean up safely.
- [ ] Mouse/keyboard navigation remains supported.
- [ ] Zoom +/- controls can be hidden on small mobile layouts without losing functionality.

## QA requirements

- [ ] Unit tests cover tap vs pan threshold.
- [ ] Tests cover second-pointer entering/leaving mid-gesture.
- [ ] Tests prove pan/pinch never dispatch gameplay commands.
- [ ] Tests prove a Live tap dispatches at most one MOVE_TO/interaction.
- [ ] Tests prove room drag dispatches one BUILD_ROOM.
- [ ] Physical iOS/Android pinch and pan smoke checks pass.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
