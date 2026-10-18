# 0109 — Neutralize Hair Textures for Runtime Tinting

- **ID:** 0109
- **Status:** complete
- **Priority:** critical
- **Depends:** existing character export pipeline

## Problem

Hair color is stored and passed correctly through:

```text
Creator
→ person.hair
→ CHANGE_APPEARANCE
→ Human.customize()
→ material.color.set(person.hair)
```

but the 3D hair material also contains the original colored MakeHuman diffuse texture.

Three.js multiplies `MeshStandardMaterial.color` by the material texture.

The current hair rendering therefore behaves approximately like:

```text
selected hair color
×
original brown hair texture
×
lighting
```

This produces tinting rather than true recoloring.

Dark source pixels cannot become convincingly blonde, platinum, bright red, or other light colors.

## Goal

Convert every tintable hair texture into a neutral luminance/detail texture while preserving:

- UV detail;
- strand definition;
- alpha/cutout information.

Runtime `person.hair` should become the authoritative hair hue.

## Proposed exporter behavior

Update:

```text
scripts/export-character.py
```

For every hair texture:

1. load the source hair diffuse image;
2. preserve the original alpha channel;
3. convert source RGB to luminance;
4. normalize visible luminance into a light neutral range;
5. write neutral RGB;
6. restore original alpha;
7. save a generated neutral texture;
8. use that texture in the exported GLB.

Conceptually:

```python
rgb = pixels[:, :3]
alpha = pixels[:, 3]

luma = (
    rgb[:, 0] * 0.2126 +
    rgb[:, 1] * 0.7152 +
    rgb[:, 2] * 0.0722
)

visible = alpha > threshold

normalized = normalize(luma[visible])

detail = min_luminance + normalized * (1.0 - min_luminance)

pixels[visible, :3] = detail[:, None]
pixels[:, 3] = alpha
```

Initial target:

```text
visible luminance floor ≈ 0.55–0.65
```

The exact value should be selected through rendered acceptance.

## Exported material

Hair should use:

```text
base color = white / neutral
baseColorTexture = neutral-hair texture
```

Runtime Three.js material color supplies the selected hair color.

## Guardrails

- Do not remove the hair texture entirely.
- Preserve alpha exactly.
- Do not alter hair geometry or UVs.
- Do not introduce a custom shader.
- Do not modify skin or eye materials.
- Keep glTF PBR compatibility.
- Hair styles must continue using existing short/long/curly geometry.

## Done when

- [x] all three hair textures are generated as neutral tintable textures.
- [x] original alpha coverage is preserved.
- [x] source brown hue no longer dominates runtime hair color.
- [x] black, brown, red, blonde, and platinum colors are visibly distinct.
- [x] GLB exports reproducibly.
- [x] asset-size budget remains acceptable.

## QA

- [x] short hair export.
- [x] long hair export.
- [x] curly hair export.
- [x] alpha comparison against source.
- [x] texture luminance statistics.
- [x] production GLB structure validation.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0104 is repository task 0109. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

The original import was planning-only. Implementation and evidence are recorded below; no human/device certification or deployment is inferred from automated checks.

## Implementation evidence

Implementation `769d4373b71967e0cc4edc5c925f98472d562236`; character GLB `a142f9433ce6c5e24510543fe245254b551665d74e28a06c9a35c1af5276d7a4`. See [appearance validation](../docs/reviews/character-appearance-validation.md), browser/asset evidence and [authoring contract](../docs/architecture/character-appearance.md). 186 tests, full build/source checks, wealth canary and economy gates pass. All 18 creator, 36 live day/night and six browser lifecycle cases captured. Human visual and physical/mobile feedback remain open, explicitly retained in 0113/0114. No deployment claimed.
