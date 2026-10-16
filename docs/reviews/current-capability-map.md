# Current capability map

Baseline: `c457d625`. Module references describe the starting implementation;
task 0002 moves canonical content into src/content without changing capabilities.

| System | Current implementation | Capability and main gap |
| --- | --- | --- |
| World | engine.js newGame, floors/walls/furniture | One 18×18 lot; no neighborhoods or multiple households |
| Navigation | engine.js blocked/pathTo/interactionTargets | Cardinal BFS and accessible object sides; no multi-agent avoidance |
| Actions | engine.js enqueue/begin/cancel/tick | Five queued actions, walking/use/quick actions/work; no autonomy |
| Objects | engine.js CATALOG/itemDef/dimensions | 14 types, needs/skills, rotation; no durability or ownership model |
| Needs | engine.js tick/mood/NEEDS | Six needs, clamped recovery, four mood labels; no moodlets |
| Character | engine.js person; main.js creator; character3d.js Human | Appearance and three traits, one body; no age or household roster |
| Skills | engine.js tick | One learning score affects pay; no separate skill tracks |
| Careers | engine.js JOBS/begin/tick; main.js job handler | Three jobs, anytime shifts, raises; no schedules or career branches |
| Economy | engine.js buy/room/buildTile/begin/tick | Purchases, refunds, meals, wages, bills; no inventory or budget ledger |
| Building | engine.js canPlace/buy/room/buildTile | Floors, rooms, walls, doors, sale; no roofs, levels or undo |
| Time | engine.js tick; main.js frame/paused | Deterministic minute steps, speeds, hidden-tab pause; no offline progress |
| Persistence | engine.js validateSave; main.js save/import/export | Version 1 local and JSON saves; no migration pipeline or cloud sync |
| Presentation | render.js, render3d.js, scene3d.js, character3d.js | Canvas fallback and shared 3D simulation; recipe inheritance couples renderers |
| UX | main.js, index.html, style.css | Creator, build/shop/career, dialogs, touch controls; controller is monolithic |
| Relationships | Quick chat in engine.js begin | Social recovery only; no other people, relationship graph or conversations |
| Autonomy | None | Player-directed queue only; future decisions require deterministic RNG |

Follow-on extraction tasks must preserve these limits. Relationships, autonomy,
aging, inventory and new skill tracks are feature work, not implicit requirements
of the architecture refactor.
