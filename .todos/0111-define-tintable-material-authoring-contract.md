# 0111 — Define Tintable Material Authoring Contract

- **ID:** 0111
- **Status:** complete
- **Priority:** high
- **Depends:** 0109, 0110

## Problem

Hair exposed an architectural inconsistency:

```text
asset authored as colored surface
runtime treats surface as tintable
```

The same defect can recur when textured clothing or accessories are introduced.

## Goal

Document and enforce a reusable asset contract for color-customizable surfaces.

## Tintable material contract

A runtime-tintable surface must use:

```text
neutral/white authored RGB
+
optional neutral grayscale texture for detail
+
runtime material.color for hue
```

Examples:

```text
skin
hair
future shirts
pants
jackets
hats
accessories
```

## Non-tintable materials

Examples:

```text
eyes
logos
printed patterns
multi-color authored art
```

must not automatically receive runtime tint.

## Documentation

Create or update:

```text
docs/architecture/character-appearance.md
```

Document:

- appearance state contract;
- tintable vs authored materials;
- expected material names/roles;
- texture color-space expectations;
- alpha handling;
- cloned-material ownership;
- preview/live rendering parity;
- future asset extension rules.

## Asset validation

Add a small validation helper or build check that identifies tintable materials and verifies:

- expected texture exists if required;
- texture RGB is sufficiently neutral;
- alpha is valid;
- base color is neutral;
- material role is recognized.

## Guardrails

- Do not inspect arbitrary visual appearance manually during build.
- Validation should use measurable asset properties.
- Allow reasonable variation in grayscale detail.
- Do not falsely reject shadows/detail variation.

## Done when

- [x] character appearance contract documented.
- [x] tintable roles explicitly identified.
- [x] build validation covers current skin/hair assets.
- [x] future textured clothing has a documented implementation path.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0106 is repository task 0111. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

The original import was planning-only. Implementation and evidence are recorded below; no human/device certification or deployment is inferred from automated checks.

## Implementation evidence

Implementation `769d4373b71967e0cc4edc5c925f98472d562236`; character GLB `a142f9433ce6c5e24510543fe245254b551665d74e28a06c9a35c1af5276d7a4`. See [appearance validation](../docs/reviews/character-appearance-validation.md), browser/asset evidence and [authoring contract](../docs/architecture/character-appearance.md). 186 tests, full build/source checks, wealth canary and economy gates pass. All 18 creator, 36 live day/night and six browser lifecycle cases captured. Human visual and physical/mobile feedback remain open, explicitly retained in 0113/0114. No deployment claimed.
