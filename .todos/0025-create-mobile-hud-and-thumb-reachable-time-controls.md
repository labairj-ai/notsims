# Create Mobile HUD and Thumb-Reachable Time Controls

- **ID:** 0025
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0023

## Problem

Current mobile HUD inherits desktop overlays and shrinks several controls below comfortable touch size. The speed buttons reach approximately 25x23px on <=540px screens, and camera controls are reduced to roughly 24px wide.

Frequent controls should be reachable and obvious without covering the center of the world.

## Proposed approach

Create a dedicated mobile HUD with three zones.

### Top status zone

Compact:
- day/time
- funds
- menu
- optional character/mood indicator

Do not retain the full desktop brand/address header during active mobile gameplay.

### Bottom-left contextual status

- current activity
- progress
- queue count
- cancel action

Collapse when idle.

### Bottom-right time controls

Use a compact thumb-reachable control with >=44px targets.

Preferred design:
- one Play/Pause control
- one Speed control that cycles 1x -> 3x -> 8x, with current value visible

Alternative accepted design:
- 44px segmented speed control if it fits without crowding.

Avoid four 24px buttons.

### Needs access

Do not permanently show all six full need bars over the world.
Use:
- compact status affordance in HUD
- tap opens Live/life sheet with all needs and quick actions
- optionally surface the lowest/critical need in the collapsed HUD

## Feedback

Every touch control must have:
- pressed state
- selected/active state where applicable
- disabled state
- visible result
- existing audio UI cue where appropriate

Optional vibration/haptics may be progressive enhancement only and cannot be required.

## Touches

- `index.html`
- `src/ui/views.js`
- `src/ui/controls.js`
- `src/style.css`
- mobile HUD module/tests

## Implementation guardrails

- Do not duplicate simulation state into HUD state.
- Derive HUD from existing GameState/application state.
- No essential status may be audio-only.
- Hide controls when irrelevant instead of disabling/cluttering where possible.
- Preserve desktop HUD behavior independently.

## Done when

- [ ] Mobile header no longer consumes desktop-style permanent space.
- [ ] Menu is >=44x44 and safe-area-aware.
- [ ] Time controls are >=44x44.
- [ ] Activity cancellation is >=44x44.
- [ ] Current speed is visually obvious.
- [ ] Critical needs can be discovered without leaving the world view.
- [ ] Idle HUD is visually quieter than active HUD.
- [ ] Center of game world remains unobstructed.

## QA requirements

- [ ] Browser geometry test asserts minimum target size.
- [ ] Pause/speed interaction tests remain command-safe.
- [ ] Touch screenshots at small/large phone sizes.
- [ ] Test low-need and queued-action states.
- [ ] Verify HUD works over both light/dark world scenes and day/night.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
