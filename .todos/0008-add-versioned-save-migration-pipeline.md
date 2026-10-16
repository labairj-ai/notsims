# Add Versioned Save Migration Pipeline

- **ID:** 0008
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0002, 0003, 0004, 0005, 0006, 0007

## Problem

Notsims validates `version: 1` saves robustly, but it has no ordered migration path. Future gameplay systems will add or reshape persistent state. Without migrations, normal product evolution will either break existing players or force validation code to carry indefinite legacy branches.

## Proposed approach

- Separate parsing, migration, canonical validation and transient-state reconstruction.
- Introduce `CURRENT_SAVE_VERSION` and an ordered migration registry.
- Treat each migration as a pure function from one persisted version to the next.
- Keep a frozen representative v1 fixture from the current game and prove it loads into the canonical current state.
- Preserve the current rule that non-work transient activities/queues are cleared on load and valid in-progress work can resume.
- Reject unknown future versions safely rather than guessing.
- Keep import file-size protection and user-facing error behavior compatible.
- Document schema ownership and migration rules.

## Touches

- `src/persistence/save.js`
- `src/persistence/schema.js`
- `src/persistence/migrations/`
- `src/engine.js`
- `src/main.js`
- `tests/persistence.test.js`
- `tests/fixtures/save-v1.json`
- `docs/architecture/save-schema.md`

## Implementation guardrails

- Do not rewrite user saves in `localStorage` until they have successfully parsed, migrated and validated.
- Migration functions must not depend on DOM, renderer, local time or random values.
- Never silently accept a future unsupported save version.
- Preserve stable IDs and world coordinates.
- If `CURRENT_SAVE_VERSION` remains 1 after refactoring, the migration framework must still be exercised by synthetic version-step tests or a deliberately minimal v1->v2 schema migration must be specified and tested.
- Any schema bump must include backward migration coverage before merge.

## Done when

- [x] Save loading is parse -> migrate -> validate -> rebuild transient runtime state.
- [x] Ordered migration registry and `CURRENT_SAVE_VERSION` exist.
- [x] Frozen current v1 fixture loads successfully.
- [x] Corrupt, oversized, unsupported-future and invalid migrated saves fail safely.
- [x] In-progress valid work resumes with canonical recalculated pay/total; other transient actions and queues are cleared.
- [x] `nextId` is rebuilt safely from canonical furniture IDs.
- [x] Save schema/migration contract is documented.

## QA requirements

- [x] Existing save round-trip and bad-save tests pass.
- [x] Add fixture-based migration tests.
- [x] Add idempotence/canonicalization test for loading then saving a migrated save.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Manual browser import/export smoke test is documented before closing.

## Source

Created from the 2026-10-16 architectural review of `labairj-ai/notsims` at `c457d625`.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [validation record](../docs/reviews/architecture-refactor-validation.md)
for tests, browser checks and compatibility evidence.
