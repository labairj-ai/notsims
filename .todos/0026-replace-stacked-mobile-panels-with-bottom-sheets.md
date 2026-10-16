# Replace Stacked Mobile Panels with Bottom Navigation and Contextual Sheets

- **ID:** 0026
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0023, 0025

## Problem

Live/Build/Furnish/Work currently live in a desktop Studio panel that becomes a separate stacked section on phones. This requires scrolling away from the world and consumes more screen area than necessary.

## Proposed approach

### Persistent bottom navigation

Four mobile destinations:
- Live
- Build
- Furnish
- Work

Requirements:
- safe-area-aware
- >=44px target height
- clear icon + short label
- selected state
- no hover dependency

### Bottom sheet states

Support:
- collapsed/tray
- half
- expanded

The sheet overlays the world rather than pushing it off-screen.

### Mode behavior

Live:
- collapsed by default
- expand for all needs, quick actions and story

Build:
- open half-height when entering
- selecting a tool may collapse to tool tray

Furnish:
- open half/expanded for browsing
- selecting an item collapses to placement tray

Work:
- half/expanded for careers
- collapse after selecting/starting relevant actions

### Sheet interaction

- drag handle
- scroll inside sheet content
- dragging sheet must not also pan the game world
- world stays mounted behind it
- sheet height adapts to VisualViewport/keyboard changes

### Desktop/tablet

- desktop may retain current side panel
- tablet can choose bottom sheet or side sheet based on available width

## Touches

- `src/ui/views.js`
- `src/ui/panels/*`
- `src/style.css`
- optional `src/ui/mobile-sheet.js`
- interface/browser tests

## Implementation guardrails

- Panel render functions remain reusable; do not duplicate mobile-only game logic.
- Mode selection remains `ui.tab`.
- Build/Furnish pause semantics remain exactly as today.
- Sheet state is presentation-only and must not enter saves.
- Avoid a complex third-party sheet dependency; implement only needed states/gestures.
- Native dialog behavior remains for destructive/settings flows.

## Done when

- [ ] Mobile mode navigation does not require page scrolling.
- [ ] World remains visible behind all four modes.
- [ ] Sheet can collapse/expand predictably.
- [ ] Build and Furnish use contextual collapsed trays after selection.
- [ ] Internal sheet content scrolls without moving the world.
- [ ] Mode switching preserves current pause semantics.
- [ ] Desktop panel remains supported.
- [ ] Sheet respects bottom safe-area inset.

## QA requirements

- [ ] Tests cover Live/Build/Furnish/Work switching.
- [ ] Tests cover collapsed/half/expanded presentation states.
- [ ] Tests verify sheet gesture does not dispatch world commands.
- [ ] Screenshots at portrait and landscape phone sizes.
- [ ] Long catalog/work content remains reachable without tiny controls.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
