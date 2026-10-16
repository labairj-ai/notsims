# Redesign Mobile Creator, Help and Onboarding for Touch-First Play

- **ID:** 0029
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0023, 0026

## Problem

The mobile creator is responsive but still compresses a desktop composition. Help text continues to teach mouse/keyboard controls such as click, R, Esc, Q/E, wheel zoom and right-drag pan.

A mobile-primary game should teach touch behavior first and desktop shortcuts second.

## Proposed approach

### Creator

- Keep character preview visible but compact.
- Make fields comfortable for thumbs.
- Use large row controls and native/select controls where appropriate.
- Allow creator fields to scroll within the dialog.
- Ensure software keyboard does not cover the active field or primary CTA.
- Keep primary `Let's make a life` action reachable.
- Test safe areas and VisualViewport changes.

### First-run touch onboarding

Replace long desktop-first instructions with short contextual tips:
- Tap ground to walk.
- Tap furniture to see actions.
- Drag the world to pan.
- Pinch to zoom.
- Use Build/Furnish from the bottom bar.
- Drag room corners in Build.

Show only a small number of contextual hints; do not create a mandatory tutorial funnel unless later evidence supports it.

### Help copy

- Mobile/touch instructions first when coarse pointer/mobile layout is active.
- Keyboard/mouse shortcuts remain in a secondary desktop section.
- Update mode hints: use "Tap" rather than "Click" on mobile.
- Furnish instructions should name the on-screen Rotate/Cancel controls rather than R/Esc.

## Touches

- `index.html`
- `src/ui/character-creator.js`
- `src/ui/views.js`
- help/onboarding UI module
- `src/style.css`
- tests

## Implementation guardrails

- No device-specific copy based solely on UA sniffing.
- Use capability/layout state to choose input wording.
- Do not make onboarding state part of GameState.
- If onboarding dismissal is persisted, store it as device-local settings/preferences.
- No tutorial action may mutate gameplay automatically.

## Done when

- [ ] Creator is comfortable on portrait phones with keyboard open.
- [ ] Mobile help contains no required keyboard-only instructions.
- [ ] Touch controls are taught contextually.
- [ ] Desktop help still documents shortcuts.
- [ ] Mode hints use touch-appropriate language on mobile.
- [ ] Primary creator CTA remains visible/reachable.

## QA requirements

- [ ] Test creator at small phone height with keyboard/VisualViewport simulation.
- [ ] Test long character name and accessibility text scaling.
- [ ] Screenshot help in mobile and desktop modes.
- [ ] Existing save/resume/edit-character workflows pass.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
