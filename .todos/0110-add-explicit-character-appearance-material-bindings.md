# 0110 — Add Explicit Character Appearance Material Bindings

- **ID:** 0110
- **Status:** complete
- **Priority:** high
- **Depends:** 0109

## Problem

`Human.customize()` currently scans generic cloned materials and determines semantic purpose using material-name checks such as:

```js
m.name === 'Notsims_Skin'
m.name === 'Notsims_Shirt'
m.name.startsWith('Notsims_Hair_')
```

This works today but becomes fragile as customization expands to:

- pants;
- shoes;
- jackets;
- hats;
- accessories;
- future textured clothing.

## Goal

Create explicit appearance bindings once when a `Human` instance is created.

Example:

```js
this.appearanceMaterials = {
  skin: null,
  shirt: null,
  hair: [],
  trousers: null,
  shoes: null
};
```

Populate the bindings during initial mesh/material traversal.

## Proposed pattern

During constructor setup:

```js
for (const material of this.materials) {
  if (material.name === 'Notsims_Skin') {
    this.appearanceMaterials.skin = material;
  }

  if (material.name === 'Notsims_Shirt') {
    this.appearanceMaterials.shirt = material;
  }

  if (material.name.startsWith('Notsims_Hair_')) {
    this.appearanceMaterials.hair.push(material);
  }
}
```

Then:

```js
customize(person) {
  this.appearanceMaterials.skin?.color.set(person.skin);
  this.appearanceMaterials.shirt?.color.set(person.shirt);

  for (const material of this.appearanceMaterials.hair) {
    material.color.set(person.hair);
  }

  ...
}
```

## Guardrails

- Preserve per-character cloned materials.
- Do not share writable material instances between characters.
- Do not re-scan the entire model every time a color changes.
- Material binding belongs in rendering/presentation code only.
- GameState remains simple appearance values.

## Done when

- [x] semantic material bindings are created once.
- [x] `customize()` no longer depends on repeated generic material scans.
- [x] player and visitor colors remain isolated.
- [x] existing shirt/skin behavior remains unchanged.
- [x] future appearance channels can be added without redesign.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0105 is repository task 0110. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

The original import was planning-only. Implementation and evidence are recorded below; no human/device certification or deployment is inferred from automated checks.

## Implementation evidence

Implementation `769d4373b71967e0cc4edc5c925f98472d562236`; character GLB `a142f9433ce6c5e24510543fe245254b551665d74e28a06c9a35c1af5276d7a4`. See [appearance validation](../docs/reviews/character-appearance-validation.md), browser/asset evidence and [authoring contract](../docs/architecture/character-appearance.md). 186 tests, full build/source checks, wealth canary and economy gates pass. All 18 creator, 36 live day/night and six browser lifecycle cases captured. Human visual and physical/mobile feedback remain open, explicitly retained in 0113/0114. No deployment claimed.
