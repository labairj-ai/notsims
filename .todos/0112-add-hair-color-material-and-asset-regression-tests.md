# 0112 — Add Hair Color Material and Asset Regression Tests

- **ID:** 0112
- **Status:** complete
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

- [x] all hairstyles have runtime color assertions.
- [x] asset neutrality is automatically tested.
- [x] cloned-character isolation is tested.
- [x] repeated recoloring works.
- [x] previous broken asset fails the new tests.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0107 is repository task 0112. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

The original import was planning-only. Implementation and evidence are recorded below; no human/device certification or deployment is inferred from automated checks.

## Implementation evidence

Implementation `769d4373b71967e0cc4edc5c925f98472d562236`; character GLB `a142f9433ce6c5e24510543fe245254b551665d74e28a06c9a35c1af5276d7a4`. See [appearance validation](../docs/reviews/character-appearance-validation.md), browser/asset evidence and [authoring contract](../docs/architecture/character-appearance.md). 186 tests, full build/source checks, wealth canary and economy gates pass. All 18 creator, 36 live day/night and six browser lifecycle cases captured. Human visual and physical/mobile feedback remain open, explicitly retained in 0113/0114. No deployment claimed.
