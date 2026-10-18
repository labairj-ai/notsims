# 0112 — Add Hair Color Material and Asset Regression Tests

- **ID:** 0112
- **Status:** open
- **Priority:** critical
- **Depends:** 0109, 0110, 0111

## Problem

Current automated appearance tests verify:

- shirt material color;
- independent material instances;
- hair-style visibility.

They do not verify that hair color actually changes.

Even a direct material-color assertion would not catch the current defect because the property changes correctly while the dark diffuse texture visually suppresses the result.

## Goal

Add both runtime-material and authored-asset tests.

## Runtime material tests

For each hairstyle:

```text
short
long
curly
```

apply several colors.

Example:

```text
#16120f black
#4a2c1b brown
#8a3324 auburn
#cc4b32 red
#d9b27c blonde
#eee3cf platinum
```

Verify:

```js
hairMaterial.color.getHexString()
```

matches the selected value.

## Asset-contract tests

Inspect exported hair textures.

For visible pixels assert:

```text
low saturation
sufficient luminance
valid alpha
finite pixel values
```

Potential metrics:

```text
mean saturation < threshold
5th percentile luminance > threshold
alpha coverage within tolerance of source
```

Thresholds should be established from the accepted exported asset.

## Material ownership test

Create two `Human` instances:

```text
A → blonde
B → black
```

Verify:

- A remains blonde after B customization;
- material references differ;
- style visibility stays independent.

## Re-customization test

Same character:

```text
brown
→ blonde
→ red
→ black
```

must update without recreating the `Human`.

## Guardrails

- Do not accept only material-property tests.
- Do not use screenshots as the only automated assertion.
- Asset test should fail if the old brown texture is accidentally restored.

## Done when

- [ ] all hairstyles have runtime color assertions.
- [ ] asset neutrality is automatically tested.
- [ ] cloned-character isolation is tested.
- [ ] repeated recoloring works.
- [ ] previous broken asset fails the new tests.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0107 is repository task 0112. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

This task is planning-only. Source defect descriptions are review findings to verify against the implementation before changing code. No asset regeneration, runtime fix, rendered review, human/device acceptance or deployment is claimed by this import.
