# Define Mobile-First Playability Contract

- **ID:** 0022
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0010, 0011, 0012

## Problem

Notsims currently adapts the desktop three-column interface into stacked mobile sections. On narrow phones, the world becomes a fixed-height block followed by character/needs content and then the Studio panel. This forces the player to scroll away from the world to manage the game.

The current mobile experience also retains several desktop interaction assumptions: right-mouse camera panning, wheel zoom, very small floating controls, keyboard-specific copy, and an object popup positioned around the pointer.

Mobile is now the primary play target. The interface needs an explicit mobile-first interaction and layout contract before implementation changes are made.

## Design target

Primary target:
- portrait phone
- touch input
- one- or two-thumb play
- world visible at all times during normal play
- no page scrolling during the core game loop

Secondary targets:
- landscape phone
- tablet
- desktop mouse/keyboard
- classic Canvas renderer
- Three.js renderer

## Proposed mobile shell

1. **Full-viewport world**
   - The world fills the available visual viewport.
   - Desktop sidebars do not stack below it on phones.
   - The brand/header becomes a compact in-game HUD rather than consuming 68px+ of permanent vertical space.

2. **Compact top HUD**
   - Day/time/status summary.
   - Funds.
   - Menu.
   - Optional character/needs status affordance.
   - Respect safe-area insets and Dynamic Island/notch regions.

3. **Bottom navigation**
   - Live
   - Build
   - Furnish
   - Work
   - Each target >= 44 CSS px high, preferably 48-56px.
   - Navigation remains reachable by thumb without covering the center of the world.

4. **Contextual bottom sheets**
   - Mode content appears over the world as a bottom sheet rather than below it.
   - Support collapsed, half-height and expanded states.
   - Build/Furnish selection collapses to a contextual placement/tool tray.

5. **Touch-native world input**
   - Live: tap move/interact; drag pan; pinch zoom.
   - Build/Furnish: one-finger editing; two-finger navigation/pinch to avoid accidental placement.
   - Camera rotation remains available through large explicit controls; optional two-finger twist may be added only if reliable.

6. **Contextual object interaction**
   - Tapping furniture opens a bottom action sheet with large actions.
   - Do not place small popups directly under the user's finger.

7. **Mobile typography and target policy**
   - Primary controls target >= 44x44 CSS px.
   - Primary action/body text should generally be 15-17px.
   - Secondary metadata may be smaller but must remain comfortably legible.
   - Do not solve overflow by shrinking controls/text.

## Mobile interaction principles

- World first.
- Tap, drag, pinch before dedicated camera buttons.
- Contextual controls instead of persistent clutter.
- Frequent controls low and thumb-reachable.
- Less-frequent controls near the top.
- Hide unavailable controls.
- Always provide visible pressed/selected feedback.
- No gameplay-critical action should require hover.
- No gameplay-critical action should require keyboard input.
- Audio may supplement touch feedback but never replace visual feedback.
- Preserve desktop keyboard/mouse as a secondary interaction path.

## Research basis

- Apple handheld game guidance: tap-to-move, direct camera pan, inertia and pinch zoom are appropriate for overhead/isometric games.
- Apple HIG: aim for at least 44x44 pt tap regions for comfortable touch input.
- WCAG 2.2: 24x24 CSS px is the minimum target baseline, not the desired game target.
- MDN Pointer Events: use a unified pointer model for mouse, touch and pen.
- MDN safe-area environment variables: protect controls from rounded corners, home indicators and display cutouts.

## Touches

- `docs/architecture/mobile-ux.md`
- `docs/reviews/mobile-playability-review.md`
- `src/ui/`
- `src/style.css`
- `src/ui/input.js`
- mobile browser QA

## Implementation guardrails

- Do not introduce a UI framework solely for this work.
- Do not change simulation rules, command semantics or GameState.
- Do not make renderer code authoritative for input semantics.
- Do not fork gameplay behavior between mobile and desktop.
- Do not hide gameplay information that has no alternative accessible path.
- Do not force device orientation.
- Do not use UA sniffing as the primary layout mechanism; prefer responsive capabilities/media queries and pointer characteristics.
- Keep Classic and Three modes functionally equivalent.

## Done when

- [x] Mobile layout contract is documented.
- [x] Touch gesture contract is documented by mode.
- [x] HUD, bottom-nav and bottom-sheet information architecture is documented.
- [x] Safe-area policy is documented.
- [x] Mobile target-size and typography policy is documented.
- [x] Portrait phone is explicitly the primary UX target.
- [x] Landscape/tablet/desktop adaptation rules are documented.
- [x] Existing desktop interaction paths are identified as preserved secondary controls.

## QA requirements

- [x] No game logic changes are required to satisfy this task.
- [x] Existing tests remain green.
- [x] Design review explicitly identifies every current mobile control under 44px.
- [x] Design review identifies every current mouse/keyboard-only core interaction.
- [x] Baseline screenshots are captured at representative phone/tablet sizes.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Contract and baseline review complete. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
