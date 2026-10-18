# 0113 — Add Rendered Hair Color and Style Acceptance Matrix

- **ID:** 0113
- **Status:** blocked
- **Priority:** critical
- **Depends:** 0109–0112

## Problem

Hair-color correctness is ultimately visual.

A technically neutral texture can still produce:

- muddy highlights;
- poor blonde rendering;
- overly dark curls;
- washed-out red;
- excessive lighting dependence.

## Acceptance matrix

Test six representative colors:

```text
Black
Dark Brown
Auburn
Red
Blonde
Platinum
```

against:

```text
Short
Long
Curly
```

Total:

```text
18 combinations
```

## Surfaces

Capture each combination in:

```text
Character Creator preview
Live 3D renderer
```

Also spot-check Classic.

## Required conditions

Each chosen color should be visually distinguishable from adjacent test colors.

Specifically verify:

### Black
Should remain dark without becoming featureless.

### Brown
Should retain visible strand/detail information.

### Auburn/Red
Should visibly read as warm/red rather than dark brown.

### Blonde
Must appear clearly light/blonde.

### Platinum
Must be substantially lighter than blonde and must not become brown.

## Lighting conditions

Test at least:

```text
day
night
```

for representative colors.

Do not tune the asset so it only works under the creator's bright studio lighting.

## Acceptance questions

- Does changing the picker visibly change the preview immediately?
- Does each style receive the same selected hue?
- Does hair retain texture/detail?
- Are alpha edges clean?
- Are dark colors still distinguishable?
- Are light colors genuinely light?
- Does the live character match the preview closely enough?

## Evidence

Create:

```text
docs/reviews/character-appearance-validation.md
```

Include:

- implementation SHA;
- character asset hash;
- rendered matrix;
- browser;
- observed defects;
- pass/fail.

## Done when

- [x] all 18 preview combinations render.
- [x] all 18 live combinations render or a justified representative matrix covers live parity.
- [ ] blonde and platinum are clearly distinguishable from brown.
- [ ] no style exhibits unacceptable alpha artifacts.
- [ ] human visual review passes.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0108 is repository task 0113. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

The original import was planning-only. Implementation and evidence are recorded below; no human/device certification or deployment is inferred from automated checks.

Automated asset checks and rendered captures are supporting evidence; the required human visual pass remains a separate open gate. Record exact source SHA, GLB hash, browser and observed defects for both creator and live rendering.

## Implementation evidence

Implementation `769d4373b71967e0cc4edc5c925f98472d562236`; character GLB `a142f9433ce6c5e24510543fe245254b551665d74e28a06c9a35c1af5276d7a4`. See [appearance validation](../docs/reviews/character-appearance-validation.md), browser/asset evidence and [authoring contract](../docs/architecture/character-appearance.md). 186 tests, full build/source checks, wealth canary and economy gates pass. All 18 creator, 36 live day/night and six browser lifecycle cases captured. Human visual and physical/mobile feedback remain open, explicitly retained in 0113/0114. No deployment claimed.
