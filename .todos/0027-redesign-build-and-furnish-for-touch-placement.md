# Redesign Build and Furnish Workflows for Touch Placement

- **ID:** 0027
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0024, 0026

## Problem

Build and Furnish currently assume a desktop side panel plus precise pointer interactions. Mobile needs a workflow where the player can select a tool/item, return focus to the world, place accurately, rotate/cancel easily, and recover from mistakes without fighting the UI.

## Proposed approach

### Build tray

After tool selection, collapse Build sheet into a contextual tray showing:
- selected tool
- cost
- floor finish when relevant
- cancel/exit

Controls >=44px.

### Room drawing

- first touch/drag begins room rectangle
- visible start point and live room footprint preview
- live size display, e.g. `4 x 5`
- live estimated cost
- invalid footprint shown clearly before release
- second-finger camera navigation must cancel/suspend preview safely

### Floor/wall/door

- enlarge effective touch hit regions without changing world geometry
- visible hovered/selected tile/edge preview under finger
- do not require pixel-perfect edge taps
- show cost before commit where practical

### Furnish tray

After choosing furniture:
- selected item thumbnail/name/price
- Rotate button >=44px
- Cancel button >=44px
- clear placement-valid/invalid world preview

### Placement ergonomics

- avoid placing directly under bottom sheet/tray
- clear confirmation/error feedback
- retain semantic commands (`BUILD_ROOM`, `EDIT_TILE`, `PLACE_OBJECT`)

## Touches

- `src/ui/input.js`
- `src/ui/panels/build.js`
- `src/ui/panels/furnish.js`
- `src/ui/views.js`
- renderer preview/highlight adapters
- CSS/tests

## Implementation guardrails

- Do not change building economics or validation rules.
- Preview is non-authoritative; command result remains authoritative.
- Do not add optimistic mutations to GameState.
- Classic/Three placement coordinates must remain equivalent.
- Avoid long-press as the only way to access a required action.
- Do not require keyboard R/Esc on mobile.

## Done when

- [ ] Room preview is visible throughout touch drag.
- [ ] Room size/cost/validity are visible before commit.
- [ ] Wall/door edge targeting is comfortable on phone.
- [ ] Furniture rotation/cancel are directly tappable.
- [ ] Placement validity is obvious.
- [ ] Build/Furnish sheets collapse enough to expose the world.
- [ ] No keyboard is required for mobile building/furnishing.
- [ ] Existing costs/refunds/validation remain unchanged.

## QA requirements

- [ ] Tests verify previews do not mutate state.
- [ ] Tests verify one completed gesture dispatches one mutation.
- [ ] Touch tests cover valid/invalid room drag.
- [ ] Touch tests cover edge placement near adjacent edges.
- [ ] Furniture rotation/placement checks in all four rotations.
- [ ] Classic and 3D mobile browser checks pass.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
