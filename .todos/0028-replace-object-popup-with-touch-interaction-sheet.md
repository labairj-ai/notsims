# Replace Pointer Popup with Touch Interaction Sheet and Hit-Slop Selection

- **ID:** 0028
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0024, 0026

## Problem

Tapping furniture currently opens a small `.object-popup` positioned near the pointer. On a phone this can appear beneath the user's finger, collide with HUD controls, or force small targets near the edge of the display.

Object selection also relies on precise renderer/raycast/grid hits that are more forgiving with a mouse than a finger.

## Proposed approach

### Touch interaction sheet

On phone, furniture tap opens a compact bottom action sheet containing:
- object name
- primary interaction
- cost if applicable
- contextual secondary action(s)
- close/dismiss

Primary action should be visually dominant and >=44px high.

Do not float the action UI directly under the finger.

### Selection hit slop

Add presentation-only hit tolerance for touch pointers:
- first try canonical renderer/raycast hit
- if no hit, search nearby visible/interactable candidates inside a bounded screen-space radius
- deterministic preference for nearest/topmost candidate
- never alter physical collision or object geometry

Mouse behavior may retain more precise hit testing.

### Selection feedback

Immediately highlight selected furniture in the world so the player knows what was targeted before pressing an action.

Dismiss sheet on:
- world camera pan
- mode switch
- successful action
- explicit close
- object removal
- save/new-game teardown

## Touches

- `src/ui/input.js`
- object selection helper
- `src/style.css`
- optional `src/ui/object-sheet.js`
- renderer selection highlight
- tests

## Implementation guardrails

- Hit slop is presentation-only.
- Do not auto-interact just because the finger lands near an object.
- Do not choose through walls/occluded objects when the renderer can determine visibility.
- No interaction action bypasses the command dispatcher.
- Desktop popup may remain if useful, but behavior/result must match mobile.

## Done when

- [ ] Mobile object actions render in a bottom sheet.
- [ ] Primary action target >=44px.
- [ ] Selection is visibly highlighted.
- [ ] Reasonable near-miss taps still select the intended furniture.
- [ ] Nearby objects do not produce unstable/random selection.
- [ ] Sheet never renders under the bottom safe-area/home indicator.
- [ ] Sheet teardown leaves no stale selected object.

## QA requirements

- [ ] Unit tests cover nearest-candidate hit slop.
- [ ] Tests cover two nearby pieces of furniture.
- [ ] Tests cover cancellation/removal while sheet is open.
- [ ] Physical phone test confirms object selection while holding phone one-handed.
- [ ] Classic/Three parity checks pass.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
