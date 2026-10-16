# Decouple Shared Furniture Render Recipes

- **ID:** 0009
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** medium
- **Depends:** 0002, 0003

## Problem

`scene3d.js` currently imports the classic Canvas `Renderer` and subclasses it through `GeometryPainter` in order to reuse furniture drawing recipes. This avoids duplication, but creates the wrong dependency direction: the Three.js renderer depends on the Canvas renderer implementation.

## Proposed approach

- Extract procedural furniture recipes into a renderer-neutral recipe module.
- Define the minimal painter contract currently implied by `box()`, `ellipse()` and `line()`.
- Let the Canvas renderer implement/use that contract.
- Let `GeometryPainter`/Three.js implement/use the same contract independently.
- Keep dimensions, colors and visual proportions identical unless a bug is proven.
- Preserve thumbnail rendering through the Canvas implementation.
- Keep scene/interaction geometry sourced from canonical gameplay geometry, not visual recipes.

## Touches

- `src/render/shared/furniture-recipes.js`
- `src/render.js` or `src/render/canvas/Renderer.js`
- `src/scene3d.js`
- `src/render3d.js` as needed
- `tests/render.test.js`
- `tests/three.test.js`

## Implementation guardrails

- Do not change simulation item dimensions or placement rules.
- No visual redesign is part of this task.
- Three.js code must no longer inherit from or import the Canvas `Renderer` class after completion.
- Shared recipe code must not import `CanvasRenderingContext2D` or Three.js.
- Material/resource disposal behavior must remain correct.
- Preserve all four furniture rotations and finite-coordinate guarantees.

## Done when

- [x] Furniture recipe ownership is renderer-neutral.
- [x] Canvas and Three implementations consume the same recipe definitions without renderer-to-renderer inheritance.
- [x] Existing catalog thumbnails render.
- [x] Every furniture type produces finite Canvas and 3D geometry in all rotations.
- [x] 3D furniture meshes retain `furnitureId` metadata used for raycast picking.
- [x] No circular imports are introduced.

## QA requirements

- [x] Existing `render.test.js` and `three.test.js` pass.
- [x] Add a structural test or import check preventing `scene3d` from importing the Canvas Renderer implementation.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Browser smoke test covers starter cottage in both view modes.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
