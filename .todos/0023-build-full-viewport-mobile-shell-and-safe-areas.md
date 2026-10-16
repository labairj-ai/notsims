# Build Full-Viewport Mobile Shell and Safe-Area Layout

- **ID:** 0023
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0022

## Problem

At <=540px, Notsims currently renders the world as a fixed 480px row, then character/needs content, then a Studio panel. Core play therefore becomes a vertically scrolling page instead of a game surface.

The top header also consumes significant permanent vertical space, and current mobile layout does not use `viewport-fit=cover` or safe-area inset variables.

## Proposed approach

- Convert mobile gameplay to a full-viewport application shell.
- Keep the world canvas mounted and visible throughout Live/Build/Furnish/Work.
- Remove page-level scrolling from the normal game loop.
- Replace the large mobile header with a compact HUD overlay.
- Add `viewport-fit=cover`.
- Apply:
  - `env(safe-area-inset-top)`
  - `env(safe-area-inset-right)`
  - `env(safe-area-inset-bottom)`
  - `env(safe-area-inset-left)`
- Use `100dvh`/VisualViewport-aware sizing rather than fixed 480px world height.
- Keep modal/creator scrolling local to the modal instead of the page.
- Add responsive layout modes:
  - phone portrait
  - phone landscape
  - tablet
  - desktop
- Do not simply scale the desktop interface down.

## Target mobile geometry

Portrait:
- world: full viewport background/surface
- top HUD: safe-area-aware floating strip
- bottom nav: fixed/safe-area-aware
- contextual sheet/tray: overlays world from bottom

Landscape:
- world remains full-screen
- compact bottom or side navigation may be used
- sheet may become a side drawer when enough horizontal room exists

## Typography and controls

On mobile:
- primary buttons/control regions >= 44x44 CSS px
- preferred frequently-used controls >= 48px
- primary body/action text 15-17px where practical
- secondary labels should not be reduced merely to fit
- form controls should remain comfortably sized for touch

## Touches

- `index.html`
- `src/style.css`
- `src/ui/app.js`
- optional `src/ui/mobile-layout.js`
- layout/browser tests

## Implementation guardrails

- Preserve desktop three-column layout at desktop widths.
- No hard-coded device model dimensions.
- No orientation lock.
- Avoid fixed heights that break when browser chrome or the software keyboard changes the visual viewport.
- Do not cover game controls with unsafe-area/home-indicator regions.
- World content may extend edge-to-edge, but interactive HUD controls must remain inside safe regions.

## Done when

- [ ] Portrait phone gameplay has no page scroll during normal play.
- [ ] World remains visible while switching modes.
- [ ] Top HUD and bottom controls honor safe-area insets.
- [ ] Dynamic browser chrome does not leave large dead zones or clip controls.
- [ ] Landscape phone remains playable.
- [ ] Desktop layout is unchanged or intentionally improved.
- [ ] Creator/menu/settings dialogs remain independently scrollable when needed.
- [ ] No primary mobile control is smaller than 44x44 CSS px.

## QA requirements

- [ ] Browser layout tests at 320x568, 360x800, 390x844, 430x932, 844x390 and tablet sizes.
- [ ] Real-device check on at least one iOS Safari and one Android Chrome device.
- [ ] Verify notch/Dynamic Island/home indicator safe areas.
- [ ] Verify keyboard opening/closing does not permanently corrupt layout.
- [ ] Classic and 3D layouts both pass.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
