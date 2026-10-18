# Character appearance validation — 0109–0114

**Software and automated rendering: passed. Human visual and physical-device acceptance: open.**

- Implementation tested in browser: `769d4373b71967e0cc4edc5c925f98472d562236`, clean working tree.
- GLB SHA-256: `a142f9433ce6c5e24510543fe245254b551665d74e28a06c9a35c1af5276d7a4`.
- Browser: Chrome/155.0.8059.82, headless desktop Chrome with SwiftShader allowed; not a physical phone.
- Automated suite: **186 passed**, zero failed; 18 tests in focused appearance/Three.js files.
- `npm run build`, `npm run check`, `npm run canary:wealth`, `npm run check:economy`: passed. Economy contract v2 passed unchanged.
- Exact branch CI/PR identity is recorded in the implementation PR after push. Existing wealth PR #7 stays draft until its own release gates pass; no main merge or deployment is inferred here.

## Asset verification

The exporter creates three neutral detail textures, with white hair material factors and the selected runtime color as hue authority. Two independent Blender 4.5.4 exports produced the same complete GLB SHA above. It is 6,143,660 bytes versus 6,801,368 previously (12,000,000 budget).

[Integrity evidence](character-appearance-integrity.json) compares the prior and current assets: meshes, UV/accessor data, nodes, skins, animation channels and non-image buffer bytes are identical. Skin/eye texture bytes and material definitions are identical. **Every alpha byte in all three hair textures matches the prior GLB**, in addition to the exporter's source-vs-saved alpha assertion. No custom shader, geometry change, animation change, save version or gameplay/RNG change is included.

| Style | Size | Visible pixels | RGB spread | 5th / 95th visible luminance |
| --- | --- | ---: | ---: | --- |
| Short | 1024² | 592,914 | 0 | .647 / .922 |
| Long | 1024² | 790,326 | 0 | .600 / .914 |
| Curly | 1024² | 530,589 | 0 | .604 / .851 |

[Independent embedded-image metrics](character-appearance-metrics.json) and the metadata pin PNG, source and alpha hashes. Build checks also enforce recognized roles, neutral skin, grayscale detail, white hair factors, non-flat visible detail and exporter fingerprint. The old brown short-hair texture is retained as a CC0 negative fixture and fails the new contract even with a white factor/correct runtime tint.

## Rendered matrix

All **18 creator** combinations and all **18 live** combinations at **both day and night** were captured: short/long/curly × black/brown/auburn/red/blonde/platinum. [Browser manifest](character-appearance-browser.json) records all 60 cases, including the six lifecycle cases. Zero JavaScript page errors were observed.

- [Creator matrix](media/appearance/matrix-creator.png)
- [Live day matrix](media/appearance/matrix-day.png)
- [Live night matrix](media/appearance/matrix-night.png)
- [Normal live-camera reference](media/appearance/live-normal-camera.png)

Live detail captures use an explicitly temporary inspection camera with the **actual live scene, materials and day/night lighting**. They do not pretend that the normal distant gameplay camera shows the same detail. Creator captures use the actual preview canvas. Full-resolution case images, downloadable save fixtures and an HTML gallery are generated at `/private/tmp/notsims-appearance-review/`; committed contact sheets retain every color/style combination. Regeneration command:

```sh
PUPPETEER_MODULE=/path/to/puppeteer-entry.mjs node scripts/capture-appearance-review.mjs
```

The optional module must export Puppeteer or its default. `CHROME_PATH`, `QA_BASE` and `QA_OUT` override defaults. No production dependency or telemetry is added. The local server used `http://127.0.0.1:5197`.

Agent inspection of the day matrix finds visibly distinct black, brown, red, blonde and platinum, with light hair no longer carrying the old brown hue. Strands remain visible; curly hair retains its denser card/scalp pattern. This is **agent observation**, not the required human judgment that all alpha edges, dark detail and creator/live differences are acceptable. Headless rendering also cannot establish sustained phone frame cost, thermal behavior, native color-picker comfort or full-rate perceived feedback. No new acceptance-blocking visual defect was confirmed by the automated checks; the subjective questions remain unanswered.

## Lifecycle, isolation and allocation evidence

At **320, 390 and 430 px**, both 3D and Classic follow actual creator input → create → open needs panel → edit → save from menu → reload/continue → download Blob → change appearance → import via file input/confirmation → reopen editor. Hair/style persist as platinum/curly. Each creator has no horizontal dialog overflow, a visible preview, and ≥44 px color input width. Examples: [320 px creator](media/appearance/3d-320-creator.png), [390 px restored](media/appearance/3d-390-restored.png), [Classic restored](media/appearance/classic-430-restored.png). Native picker interaction and physical reach remain untested.

Runtime tests cover all 18 styles/colors, repeated brown→blonde→red→black recoloring, independent player/NPC materials and style visibility, unchanged skin/shirt behavior, semantic-only save/export/import and Classic drawing/portrait colors. Recoloring is tested with model traversal disabled after construction and retains the same Human, model, mixer, material and preview renderer identities. Browser GLB requests are one for the matrix page, two per 3D lifecycle page (initial load plus intentional page reload), zero in Classic. Input events cause no extra GLB request. Shared cached textures remain read-only.

## Remaining acceptance sessions

| Session | Tested SHA / GLB hash | Actual device/browser and tester | Result |
| --- | --- | --- | --- |
| Human creator/live day/night visual review | Must record exact identities above | Not recorded | Not performed |
| Physical iPhone native picker/preview usability | Must record actual candidate | Not recorded | Not performed |
| Physical Android native picker/preview usability | Must record actual candidate | Not recorded | Not performed |

Record hue distinction, alpha/strand quality for every style, dark/light detail, preview/live agreement, immediate feedback, redraw lag, edit/reopen behavior and sustained device performance. Keep physical results separate from the six emulated browser viewport cases. TODO 0113 remains blocked on human visual acceptance; 0114 has automated lifecycle/parity evidence with human mobile feedback open. Existing wealth, motion, audio and mobile release gates are unchanged. This work does not authorize or claim deployment of the unaccepted wealth candidate.
