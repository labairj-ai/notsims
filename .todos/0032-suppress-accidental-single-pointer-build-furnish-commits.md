# Suppress Accidental Single-Pointer Build and Furnish Commits

- **ID:** 0032
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0024, 0027

## Problem

The mobile gesture model correctly treats a one-finger drag as camera navigation in Live/Work and as room drawing when the Build Room tool is active. However, current `src/ui/input.js` passes `navigate:false` for the remaining Build/Furnish interactions. Because `WorldGesture` does not mark those one-pointer gestures as panning, a large one-finger movement can still return an eligible release and dispatch a gameplay mutation.

This creates an accidental-commit risk for Furnish placement, Floor, Wall, Door, and Erase. Room drawing is the only Build/Furnish operation where a one-pointer drag should remain a valid mutation gesture.

## Proposed approach

Classify single-pointer editing gestures explicitly as `ROOM_DRAG`, `TAP_EDIT`, `TAP_PLACE`, `MULTITOUCH_NAVIGATION`, or `CANCELLED`.

Use the existing 10 CSS px movement threshold initially.

- **Build + Room:** single-pointer movement may exceed the threshold and release may dispatch exactly one `BUILD_ROOM`.
- **Build + Floor/Wall/Door/Erase:** release is eligible only if total displacement remains within the tap threshold. Movement beyond threshold suppresses the edit.
- **Furnish:** release is eligible only if total displacement remains within the tap threshold. Movement beyond threshold suppresses `PLACE_OBJECT`.
- **Live/Work:** preserve current one-finger pan behavior.
- **Multi-touch:** preserve the invariant that once a second pointer participates, no edit/place command may escape until all participating pointers are released.

## Touches

- `src/ui/gestures.js`
- `src/ui/input.js`
- `tests/mobile.test.js`
- `scripts/mobile-scenarios.mjs`
- `docs/reviews/mobile-playability-validation.md`

## Implementation guardrails

- Do not change the 10px threshold without physical-device evidence.
- Do not change room-drawing semantics.
- Do not change building costs, refunds, placement rules or command contracts.
- Do not make renderer code authoritative for gesture classification.
- Do not introduce separate touch and mouse gameplay logic.
- Do not allow suppressed gestures to enqueue commands later.
- Preserve pointer-cancel cleanup and two-finger Build/Furnish navigation.
- Preserve deterministic replay.

## Done when

- [x] Furnish + single-finger drag > threshold dispatches zero `PLACE_OBJECT`.
- [x] Floor + single-finger drag > threshold dispatches zero `EDIT_TILE`.
- [x] Wall + single-finger drag > threshold dispatches zero `EDIT_TILE`.
- [x] Door + single-finger drag > threshold dispatches zero `EDIT_TILE`.
- [x] Erase + single-finger drag > threshold dispatches zero mutation commands.
- [x] Room + single-finger drag still dispatches exactly one `BUILD_ROOM`.
- [x] Build/Furnish taps under threshold still work.
- [x] Two-finger pan/pinch never dispatches an edit.
- [x] Live one-finger camera pan remains unchanged.
- [x] Classic and Three renderers behave identically.

## QA requirements

- [x] Add unit coverage for displacement suppression in every non-room edit mode.
- [x] Add browser touch scenarios for Furnish, Floor, Wall, Door and Erase drags.
- [x] Add one positive Room drag regression.
- [x] Run the existing mobile gesture scenario in both renderers.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] `npm run check` passes.
- [ ] GitHub CI passes.
- [ ] Record the corrective SHA in mobile validation.

## Source

Created from the 2026-10-16 implementation review of the mobile UX at `e37f5c75bc96a6799ee5a419129eae3394de5ff7`.

## Implementation evidence

Implemented; see [social validation](../docs/reviews/social-simulation-validation.md).
