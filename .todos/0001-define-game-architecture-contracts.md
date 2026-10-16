# Define Game Architecture Contracts

- **ID:** 0001
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** none

## Problem

Notsims already separates simulation, UI orchestration, Canvas rendering and Three.js rendering, but the boundaries are implicit. As features expand, `src/engine.js` and `src/main.js` are at risk of becoming permanent catch-all modules and system ownership will become unclear.

The project needs explicit architecture and dependency contracts before behavior-preserving extraction work begins.

## Proposed approach

- Document the target layers: content, core/domain, gameplay systems, application/game session, persistence, UI/input, and renderers.
- Define which layer owns authoritative `GameState` fields and which layers may mutate them.
- Define dependency direction. Core/domain must not depend on UI or rendering. Gameplay systems may depend on core/content, but not presentation. Renderers consume state without becoming simulation authority.
- Define persistent state, runtime/transient state and UI-only state.
- Define compatibility rules for the classic and 3D renderers.
- Add a reusable gameplay-system review template covering player fantasy, state, inputs, outputs, invariants, dependencies, technical debt, UX opportunities, tests and next improvements.
- Record the current capability map for World, Navigation, Actions, Objects, Needs, Character, Skills, Careers, Economy, Building, Time, Persistence, Presentation and UX.

## Touches

- `docs/architecture/game-architecture.md`
- `docs/architecture/system-boundaries.md`
- `docs/reviews/TEMPLATE.md`
- `docs/reviews/current-capability-map.md`

## Implementation guardrails

- Documentation and contract definition only; do not change gameplay behavior or save format.
- Preserve the simulation as authority and both renderers as consumers of the same state.
- Do not introduce a framework, ECS, dependency-injection container or event bus.
- Prefer simple ES module boundaries and plain data contracts.
- Architecture rules must describe the current repo plus an incremental extraction path, not a rewrite.

## Done when

- [x] Architecture document defines layers, state ownership and dependency direction.
- [x] Persistent, transient and UI state are explicitly distinguished.
- [x] Current `GameState` fields are mapped to intended owning systems.
- [x] Classic and 3D renderer responsibilities are documented.
- [x] Gameplay-system review template exists.
- [x] Capability map identifies current implementation locations and major missing systems such as relationships and autonomy.
- [x] Follow-on TODOs 0002-0012 can be implemented without ambiguity about intended boundaries.

## QA requirements

- [x] Documentation accurately reflects `main` at the implementation starting SHA.
- [x] No runtime files are changed except documentation/index links if needed.
- [x] `npm test` and `npm run build` remain green if any non-doc file is touched.
- [x] Review architecture for circular dependency risks before closing.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
