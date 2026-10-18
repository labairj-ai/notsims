# Character appearance contract

GameState stores semantic `person.skin`, `person.hair`, `person.shirt` colors and
`person.style` (`short`, `long`, `curly`). People/NPCs use the same values.
Commands own changes. Saves contain no renderer, texture, material or skeleton
objects. This correction changes no save schema, gameplay, balance or RNG.

## Roles and authoring

| Material | Role | Texture / runtime policy |
| --- | --- | --- |
| Notsims_Skin | tintable skin | Existing neutral detail PNG; white base; selected skin hue |
| Notsims_Shirt | tintable shirt | Currently untextured; selected color replaces its factor |
| Notsims_Hair_short / long / curly | tintable hair | Neutral detail RGBA PNG; white base; selected hair hue |
| Notsims_Trousers / Notsims_Shoes | authored clothing | Retain authored color; no automatic tint |
| Notsims_Eyes | authored eyes | Retain iris texture/color; no automatic tint |

Tintable **textured** materials must use white base factors and neutral/grayscale
RGB detail. Texture color multiplies runtime tint, so a colored source diffuse
must not be treated as neutral. Non-textured role colors are replaced directly,
not multiplied by a retained source color. Future textured shirts, trousers,
jackets, hats or accessories require an explicit role, neutral detail texture,
white factor, isolated binding, build metrics and rendered acceptance before
becoming tintable. Logos, eyes, printed patterns and multi-color art stay authored;
never recolor arbitrary materials based on traversal order.

Color inputs are sRGB hex values; Three.js `Color.set()` converts them to its
linear working space. Base-color PNGs use glTF's sRGB sampling; alpha is linear
coverage. Keep glTF PBR materials and stock Three.js shaders. Do not add another
color transform or recolor shared texture pixels at runtime.

## Hair preprocessing and provenance

The pinned Blender 4.5.4 / MPFB exporter loads the original CC0 hair textures,
retains the existing maximum-1024 resize, derives luminance using
0.2126/0.7152/0.0722, normalizes between visible 1st/99th percentiles, and maps
detail into 0.60–1.0 neutral RGB. Visible means encoded alpha >102/255, consistently
in export and validation. Values outside those percentiles clip rather than
amplify outliers. A constant source uses a safe nonzero denominator. All alpha
values, including transparent pixels, remain unchanged. Geometry and UVs remain
unchanged. Skin and eyes are not processed by this hair correction.

Generated `hair-neutral-{style}.png` files stay in the authoring output; the game
loads the GLB's embedded images. Metadata records original source PNG hashes,
neutral PNG hashes, dimensions, visible counts, exact 8-bit alpha-plane hashes,
luminance floor and exporter SHA. Alpha hashes use Blender's bottom-up scan order.
Exporter assertions compare source and saved alpha after the existing resize.
Build validation independently decodes the **embedded** PNG scanlines and verifies
those hashes, all three styles, white factors, recognized roles, grayscale RGB
(channel spread ≤1/255), visible 5th-percentile brightness ≥0.59, non-flat detail,
neutral skin and the existing 12 MB GLB budget. The shipped asset is 6,143,660 bytes.
Thresholds are measurable safeguards; visual acceptance may require a later
candidate and renewed evidence, rather than declaring a human pass from metrics.

## Instance ownership and feedback

`loadHuman()` caches one read-only GLTF template per page. Each `Human` clones the
skeleton and writable materials. Geometry and textures may be shared read-only.
Construction binds skin/shirt/hair material arrays once and caches hairstyle
nodes. `customize()` updates only existing bound colors/visibility, with an
appearance signature to skip unchanged values; it never traverses/reloads the
GLB or recreates materials, skeletons, mixers or renderers. Disposal owns only
that instance's cloned materials and animation state.

Creator preview and live 3D use the same `Human.customize()` and asset. Classic
uses the same semantic colors/styles with its own geometry; lighting need not be
pixel-identical. Browser evidence must inspect actual creator output and actual
live lighting, including day/night, rather than certifying only a property value.

## Validation and extension

`npm run build` invokes `check-character.mjs`, which runs the appearance validator.
`node scripts/character-appearance.mjs` prints independent embedded-texture metrics.
Tests cover all 18 color/style selections, repeated recoloring, per-instance
isolation, Classic semantic parity and save/export/import. A frozen pre-fix brown
PNG must fail even when its material factor/runtime tint is correct.

`scripts/capture-appearance-review.mjs` prepares an 18-case creator matrix, 36 live
day/night cases, a normal live-camera reference, and 3D/Classic lifecycle checks
at 320/390/430 px. It uses optional external Puppeteer tooling; production adds
no dependency or telemetry. Live detail uses a temporary inspection camera while
retaining the actual scene/lighting. This is explicitly identified in evidence.
Physical picker usability, sustained phone performance and human judgments about
hue, strand detail, alpha edges and creator/live agreement remain separate gates.
