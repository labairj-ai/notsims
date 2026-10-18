# 0111 — Define Tintable Material Authoring Contract

- **ID:** 0111
- **Status:** open
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

- [ ] character appearance contract documented.
- [ ] tintable roles explicitly identified.
- [ ] build validation covers current skin/hair assets.
- [ ] future textured clothing has a documented implementation path.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0106 is repository task 0111. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

This task is planning-only. Source defect descriptions are review findings to verify against the implementation before changing code. No asset regeneration, runtime fix, rendered review, human/device acceptance or deployment is claimed by this import.
