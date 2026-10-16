# Decompose UI Controller and Game Loop

- **ID:** 0010
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0004, 0005, 0006, 0007, 0008, 0009

## Problem

`src/main.js` currently owns startup, save loading, renderer selection, speed/pause state, all studio panel rendering, character creation, input mapping, camera controls, save/import/export, object popups, autosave and the animation loop. This concentration will make every new gameplay feature harder to add and test.

## Proposed approach

- Keep one small application bootstrap entry point.
- Extract simulation clock/game-loop ownership.
- Extract persistence controller for local autosave/import/export orchestration.
- Extract keyboard/pointer input mapping from gameplay/UI rendering.
- Extract panel modules for Live, Build, Furnish and Career.
- Extract character-creator controller.
- Keep renderer selection/fallback in a focused presentation/bootstrap module.
- Preserve current DOM markup and visual behavior as much as possible; this is not a redesign.
- Prefer simple functions/classes and ES modules over a UI framework migration.

## Touches

- `src/main.js`
- `src/ui/game-loop.js`
- `src/ui/input.js`
- `src/ui/persistence-controller.js`
- `src/ui/panels/live.js`
- `src/ui/panels/build.js`
- `src/ui/panels/furnish.js`
- `src/ui/panels/career.js`
- `src/ui/character-creator.js`
- `src/ui/renderer-bootstrap.js` or equivalent
- `tests/interface.test.js`
- additional focused UI tests

## Implementation guardrails

- No React/Vue/Svelte/framework migration.
- Keep state authority in simulation modules; UI state remains separate.
- Do not duplicate game rules in panel rendering. Wage, placement, mood and other calculations must call canonical domain helpers/selectors.
- Preserve classic fallback behavior when WebGL or assets fail.
- Preserve all keyboard shortcuts, touch/button alternatives, pause semantics and autosave triggers.
- Keep accessibility labels and dialog behavior intact or improve them without changing game mechanics.

## Done when

- [x] `main.js` is primarily bootstrap/composition rather than feature implementation.
- [x] Each major panel can be changed without editing unrelated panel code.
- [x] Input handling is independently testable.
- [x] Save/import/export lifecycle is independently testable.
- [x] Game loop owns frame delta, pause state integration and renderer draw calls through a narrow interface.
- [x] Existing interface behavior and fallback startup remain compatible.

## QA requirements

- [x] Existing interface tests pass.
- [x] Add focused tests for keyboard speed/pause, Build/Furnish switching, import/export controller behavior and renderer fallback.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Manual desktop and narrow/mobile smoke tests cover both classic and 3D modes.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
