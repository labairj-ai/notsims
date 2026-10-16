# Notsims

**A little plot. A lot of possibility.** An original, independent browser life simulation with a cozy isometric dollhouse view.

## Play

Public game, hosted on the OptiPlex: **https://optiplex.tailb97cdb.ts.net/notsims/**

- Create a character: name, skin tone, hair color/style, outfit, and personality. The 3D view uses a free CC0 MPFB-derived human with a 53-bone skeleton, three hair options, and animation clips for walking, idle/standing, sitting, eating gestures, and a lying-down sleep pose.
- Move into a furnished cottage or start from an empty lot.
- Build rooms from the ground up, paint floors, add walls and doors, and sell items.
- Buy 14 kinds of furniture, with rotation and placement validation.
- Walk around your home; use furniture to eat, sleep, shower, use the bathroom, relax, and learn.
- Manage hunger, energy, hygiene, bladder, fun, and social needs.
- Take a job as a barista, designer, or developer; finish shifts to get paid and earn raises.
- Pause or run time at 1×, 3×, or 8×. Building and dialogs pause the simulation.
- Autosave locally; download and import JSON saves to back up or continue on another device.

## Controls

Click ground to walk; click furniture to interact. Select **Build** to construct rooms and **Furnish** to shop. Drag corner to corner with the room tool (minimum 3 × 3). New rooms get a free entrance. Doors connect rooms; furniture and solid walls block paths. Leave space beside objects so your character can reach them.

Press **Space** to pause/resume, **1 / 2 / 3** for time speeds, **R** to rotate furniture, **Q / E** to rotate the 3D camera, **Esc** to cancel placement, and **arrow keys** to pan. Scroll to zoom; right-drag pans the camera. Buttons provide touch alternatives for camera rotation, zoom and time controls.

The game automatically uses the classic Canvas view if WebGL or 3D asset loading fails. You can also choose **Switch to classic view** in the menu or open the game with `?view=classic`. Both views use the same simulation and saves. This version includes one human base body; expanded body and facial customization are future work.

Buildings cost money; floors cost $12 per tile, walls $18 per edge, doors $35. Furniture sells for 65% of its purchase price. Household bills arrive every three game days. Jobs pay on completing a shift, with a raise every three completed shifts. Leaving work early forfeits the shift’s pay. Character needs never cause death.

## Sound

Original music, subtle building feedback, interaction sounds, footsteps and garden
ambience start after your first click or keypress. Open **Menu → Audio settings**
for separate Master, Music, Sound Effects, Ambience and Interface volume controls,
plus Mute All. Preferences stay on this device and are separate from game saves.
Music continues while paused; activity sounds pause with simulation. Hidden tabs
are silent. See [audio architecture](docs/architecture/audio.md) and
[asset provenance](assets/audio/LICENSES.md).

## Saves

Saves use this browser’s local storage and are specific to this origin/device. The game autosaves every 20 seconds and when the page is hidden or left. Use the game menu to download a save and import it elsewhere. No account or cloud service is required; there is no cloud save synchronization. The game does not advance while closed or in a hidden tab. In-progress jobs resume after loading; other current actions and queued paths are cleared safely.

## Develop

Node.js 22+ and Python 3 (for the deployment regression verifier). Install the free dependencies once with `npm ci`.

```sh
npm run dev     # http://127.0.0.1:5173
npm test        # unit, interface, render and deterministic scenario checks
npm run build  # static files in dist/
npm run check  # syntax checks for all source and tests
```

`src/content/` owns static furniture, career, need and trait definitions.
`src/engine.js` is a compatibility facade over `src/core/`, `src/systems/`,
`src/game/` and `src/persistence/`. `src/render3d.js` and `src/scene3d.js` render the 3D world with Three.js; `src/character3d.js` loads and animates the CC0 humanoid. `src/render.js` provides the classic Canvas fallback; `src/render/shared/furniture-recipes.js` owns neutral recipes. `src/main.js` starts the focused controllers in `src/ui/`. The build self-hosts Three.js and character assets on the OptiPlex. See `assets/README.md` for asset provenance, licensing, and regeneration. Fonts are optional Google Fonts; system fonts work offline.

## Architecture work order

The supplied tasks are in `.todos/`. Their numbered order satisfies every
prerequisite. Use this sequence for reviewable, behavior-preserving changes:

| Order | Task | Status |
| --- | --- | --- |
| 0001 | Architecture contracts and capability review | Complete |
| 0002 | Extract static furniture, careers, needs and traits | Complete |
| 0003 | Extract world grid and navigation | Complete |
| 0004 | Extract building and placement | Complete |
| 0005 | Extract actions and interactions | Complete |
| 0006 | Extract needs and mood | Complete |
| 0007 | Extract careers, progression and economy | Complete |
| 0008 | Versioned save migrations | Complete |
| 0009 | Shared furniture render recipes | Complete |
| 0010 | Decompose UI controller and game loop | Complete |
| 0011 | Command dispatch and domain events | Complete |
| 0012 | Deterministic scenario and replay harness | Complete |

After 0003, tasks 0004, 0005 and 0009 are independently ready. Keep 0008 after
0004–0007, 0010 after 0008/0009, 0011 after 0010, and 0012 after 0008/0011.
The numbering is a valid linear order; no dependency changes are needed.

See [architecture](docs/architecture/game-architecture.md),
[state ownership](docs/architecture/system-boundaries.md),
[capability map](docs/reviews/current-capability-map.md), and the
[system review template](docs/reviews/TEMPLATE.md).
See the [validation record](docs/reviews/architecture-refactor-validation.md) for
test results and browser checks.

## Audio work order

Tasks 0013–0020 are complete. Dependency order is 0013, then
0014/0015, 0016/0017, 0018/0019, and 0020 for final QA. The numeric order is valid.
See [audio validation](docs/reviews/audio-validation.md) for acceptance evidence.

Task 0021 deployed the audio release and corrected production MIME/crossfade
issues. Automated checks pass; human listening confirmation remains pending. See
[production audio evidence](docs/reviews/audio-production-validation.md).

## Hosting

GitHub stores the source and runs test/build checks; **GitHub Pages is not used**. Production static assets are hosted by Nginx on the OptiPlex at `127.0.0.1:4601`, published under `/notsims/` through its existing public Tailscale Funnel HTTPS endpoint. Deployment files and instructions are in `deploy/`.

This is a first playable single-character sandbox, with one 18 × 18 plot, original art, and simplified life simulation mechanics. It is not affiliated with Electronic Arts or The Sims and uses none of their code or assets.
