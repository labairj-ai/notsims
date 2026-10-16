# State and system boundaries

Baseline: `c457d625`. Owners below are intended boundaries; today all simulation
functions live in engine.js unless explicitly stated. Ownership is about writes;
all consumers may read plain data through stable public interfaces.

| GameState field | Intended owner / current writes | Lifetime |
| --- | --- | --- |
| version | Persistence / newGame, validateSave | Persistent schema marker |
| money | Economy; building debits/refunds, action meal costs, shift pay, bills | Persistent |
| minutes | Session time / tick | Persistent game minutes |
| person.name, skin, hair, shirt, style, trait | Character / newGame, main.js creator, validateSave | Persistent |
| person.x, y | Navigation/action movement / tick | Persistent tile position |
| needs | Needs / tick decay and action recovery | Persistent, 0–100 |
| floors, walls | World data owned by Building / room, buildTile, newGame | Persistent |
| furniture | Building / buy, buildTile, newGame | Persistent instances with stable IDs |
| job | Careers / main.js job handler | Persistent career ID or null |
| shifts | Careers / completed work in tick | Persistent completed shift count |
| skill | Progression / completed skill actions in tick | Persistent, 0–100 |
| queue | Actions / enqueue, tick, cancel | Runtime, cleared on load; maximum 5 |
| activity | Actions / begin, tick, cancel | Runtime except valid work elapsed progress |
| log | Session feedback / log, validateSave | Persistent bounded recent messages |
| nextId | Building allocator / buy, newGame, validateSave | Serialized today, derived on load |
| billsDay | Economy / tick | Persistent last observed day, prevents repeat bills |

Activity contains kind, label, elapsed, total and a path; use actions also carry
need/rate/skill and target id; walking may carry walkClock; work carries pay.
These are plain runtime records, not renderer animation state. A work load
recomputes pay from current career/progression under legacy rules.

## System interfaces and invariants

- World/navigation owns bounds, edge keys, occupancy, footprints, transforms,
  interaction targets and BFS. It reads world data and returns paths; it does not
  charge money, draw objects or decide UI behavior. Rugs do not block walking.
- Building owns canPlace, buy, room and buildTile. Preserve validation before
  mutation, action lockout, perimeter/furniture checks, refunds and free room door.
- Actions owns enqueue/cancel/begin, reachability selection, path traversal and
  activity completion. Preserve walking at two minutes per tile and early work
  cancellation without pay. tick currently orders decay, bills, begin, movement,
  recovery and completion in steps of at most one minute, capped at 1440 per call.
- Needs owns decay, trait modifiers, recovery clamps and mood. Actions supply
  recovery context; neither module should import the other to create a cycle.
- Careers/progression owns work eligibility, duration, pay and raises; economy
  owns transactions and three-day bills. Session applies effects in legacy order.
- Persistence accepts untrusted plain data, validates and returns a separate state.
  It must not use the browser, renderer, live session or UI to repair a save.
- Application owns operation order and, later, command dispatch and returned event
  lists. Domain events describe completed effects; DOM toasts remain UI concerns.

## State outside GameState

main.js owns started/editing, saved snapshot, speed/lastNonzero, wall-clock frame
and UI refresh timestamps, toast timers, DOM caches, pointer drag data, and ui:
tab/tool/floor/selected/rotation/category/hover/roomStart/edge. Renderers own
zoom/pan/fullWalls, camera rotations, geometry/material caches, loaded assets,
interpolation and poses. Storage keys and autosave timers are browser adapters.
None may become simulation authority or determine replay results.

## Dependency review

Content imports no engine or presentation. Extracted core imports no systems.
Building and Actions share read-only geometry/navigation helpers. Needs and
Careers expose calculations/effects to session orchestration, avoiding reciprocal
imports. Persistence imports leaf validators, never main.js. Shared furniture
recipes import no Canvas Renderer or Three.js. Renderer fallback stays in the
application/UI layer. These directions remove the known scene3d-to-Canvas coupling
without adding a path back into gameplay.
