# 0113 — Add Rendered Hair Color and Style Acceptance Matrix

- **ID:** 0113
- **Status:** open
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

- [ ] all 18 preview combinations render.
- [ ] all 18 live combinations render or a justified representative matrix covers live parity.
- [ ] blonde and platinum are clearly distinguishable from brown.
- [ ] no style exhibits unacceptable alpha artifacts.
- [ ] human visual review passes.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0108 is repository task 0113. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

This task is planning-only. Source defect descriptions are review findings to verify against the implementation before changing code. No asset regeneration, runtime fix, rendered review, human/device acceptance or deployment is claimed by this import.

Automated asset checks and rendered captures are supporting evidence; the required human visual pass remains a separate open gate. Record exact source SHA, GLB hash, browser and observed defects for both creator and live rendering.
