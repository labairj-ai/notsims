# Extract Static Game Content from the Simulation Engine

- **ID:** 0002
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0001

## Problem

`src/engine.js` currently mixes immutable game content with simulation rules. `CATALOG`, `JOBS` and `NEEDS` definitions sit beside navigation, construction, actions, economy and save validation. This makes content additions look like engine changes and encourages future feature data to accumulate in one module.

## Proposed approach

- Extract furniture/catalog definitions to a content module.
- Extract career/job definitions to a content module.
- Extract need metadata and trait definitions to content modules.
- Preserve stable IDs, prices, dimensions, rates, durations, labels, colors and current behavior exactly.
- Keep lookup helpers thin and deterministic.
- Re-export existing public symbols from `src/engine.js` temporarily so current callers remain compatible.
- Add validation tests proving content IDs are unique and referenced interactions/needs/traits exist.

## Touches

- `src/content/furniture.js`
- `src/content/careers.js`
- `src/content/needs.js`
- `src/content/traits.js`
- `src/engine.js`
- `tests/content.test.js`
- existing engine/render tests as required

## Implementation guardrails

- No changes to gameplay balance, prices, job pay, need rates, durations, dimensions or labels.
- Do not change save IDs or object type IDs.
- Do not duplicate the same canonical content in multiple modules.
- `engine.js` may remain a compatibility facade during the extraction.
- Renderers may import neutral content/lookups but content modules must not import rendering code.
- Do not introduce JSON configuration solely for the sake of externalizing data; plain ES modules are sufficient.

## Done when

- [x] `CATALOG` is no longer authored in `engine.js`.
- [x] `JOBS` is no longer authored in `engine.js`.
- [x] `NEEDS` metadata and trait definitions are outside `engine.js`.
- [x] Existing imports through `engine.js` continue to work or are migrated atomically.
- [x] Unique IDs and valid cross-references are enforced by tests.
- [x] Starter home, jobs, needs, furniture behavior and save round trips are unchanged.

## QA requirements

- [x] Existing engine, render, interface and Three.js tests pass unchanged unless import paths require mechanical updates.
- [x] Add focused content integrity tests.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] `node --check` passes for every touched JavaScript module.
- [x] Production-facing catalog counts and job counts remain 14 furniture types and 3 jobs unless `main` changed before implementation and the baseline is updated explicitly.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
