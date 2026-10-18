# 0110 — Add Explicit Character Appearance Material Bindings

- **ID:** 0110
- **Status:** open
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

- [ ] semantic material bindings are created once.
- [ ] `customize()` no longer depends on repeated generic material scans.
- [ ] player and visitor colors remain isolated.
- [ ] existing shirt/skin behavior remains unchanged.
- [ ] future appearance channels can be added without redesign.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0105 is repository task 0110. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

This task is planning-only. Source defect descriptions are review findings to verify against the implementation before changing code. No asset regeneration, runtime fix, rendered review, human/device acceptance or deployment is claimed by this import.
