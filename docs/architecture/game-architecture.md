# Game architecture

Baseline: `c457d6253fdccc322f18f15769d691194d8dc555` (main at implementation start).
This is an incremental extraction contract, not a rewrite. Plain ES modules and
plain state remain sufficient; no ECS, framework, DI container or event bus is required.

## Layers and dependency direction

| Layer | Responsibility | May depend on |
| --- | --- | --- |
| Content | Stable furniture, career, need and trait definitions | Other neutral content only |
| Core/domain | Grid keys, bounds, footprints, transforms, deterministic helpers | Content |
| Gameplay systems | Navigation, building, actions, needs, careers, economy, time | Core and content |
| Application/session | New game, system sequencing, commands and returned events | Systems, core, content |
| Persistence | Parse, migrate, validate and canonicalize saves | Core/content and explicit system validators |
| UI/input | DOM, input translation, dialogs, storage adapters, frame scheduling | Application and read-only queries |
| Renderers | Projection, picking, visual recipes, animation and cameras | Read-only state, core/content queries |

Currently engine.js contains content, core, systems, session and persistence.
main.js contains application orchestration and UI. Keep engine.js as a compatibility
facade as modules move out. Leaf modules must never import that facade: doing so
would introduce a cycle once the facade imports them. Systems should return data
or accept narrow callbacks for cross-system effects, rather than importing each
other mutually. Session sequencing resolves those effects. Do not introduce the
command/event boundary until task 0011; extraction alone must preserve behavior.

## Authority and state lifetime

The simulation owns GameState. Renderers never mutate it. UI currently changes
career and character fields directly; task 0010 must isolate those mutations and
0011 must route them through serializable commands. Building legitimately affects
both world and money: validate first, then apply the whole operation atomically.
See [field ownership](system-boundaries.md) for all existing fields.

Current saves serialize the whole state as version 1. Logical persistent data
includes the house, character, needs, progress, money, clock and log. Queue and
non-work activity are runtime data even though JSON currently includes them:
validateSave clears both. Valid work progress survives loading; its total, pay,
label and path are reconstructed. nextId is reconstructed from furniture IDs.
UI mode, dialogs, speed, selected object and camera are never save authority.
Task 0008 will separate parsing, version dispatch, migration, validation and
canonical output without silently changing legacy load semantics.

## Renderer compatibility

Canvas and Three.js consume the same state and public placement/navigation
queries, with identical coordinates, furniture IDs, rotations and save format.
Picking produces a tile or furniture ID for the controller; it does not perform
an action. canPlace is a read-only simulation query used for previews. Camera,
wall visibility, interpolation, meshes, caches and animation clocks are local
presentation state. Asset failure selects Canvas without creating a second
simulation. scene3d.js currently subclasses render.js for procedural furniture;
task 0009 replaces that coupling with neutral drawing recipes, not simulation rules.

## Incremental delivery

Follow the [README order](../../README.md#architecture-work-order). Each extraction
retains facade exports, error messages, timing, IDs and save behavior. No new
feature or balance change belongs in these tasks. Existing simulation, interface,
Canvas and Three.js checks are the regression boundary; add focused invariant
checks for new contracts. Replay and seeded randomness arrive only after commands
and versioned saves exist. No random gameplay is required.

## Implemented module map

The preceding baseline description explains the starting point. After tasks
0001–0012, engine.js is exclusively a compatibility facade. core contains grid,
math, navigation and RNG; content contains neutral definitions; systems contains
objects, building, actions, needs, traits, careers and economy. game/session.js
owns new-game construction and legacy tick ordering. game/dispatch.js owns player
commands and returned events. persistence owns the versioned load pipeline.
main.js composes ui/app.js; focused UI modules own panels, controls, input,
character creation, persistence, renderer bootstrap and the frame loop.

Read [commands](commands.md), [save schema](save-schema.md) and
[scenario/replay](scenario-replay.md) for the implemented public contracts.
The neutral geometry module remains under systems/objects for discoverability;
it contains no mutable system behavior and is permitted as a core/navigation
leaf dependency. Tests reject graph cycles and domain-to-presentation imports.
