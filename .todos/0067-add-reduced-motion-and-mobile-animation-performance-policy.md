# Add Reduced-Motion and Mobile Animation Performance Policy

- **ID:** 0067
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0060, 0064, 0065, 0066

## Problem

Micro-motion, procedural gaze, IK, and multiple independently animated visitors add CPU/GPU cost and can also be uncomfortable for players who prefer reduced motion.

## Proposed approach

Honor:

```css
prefers-reduced-motion
```

Reduced-motion mode should preserve action readability while suppressing:

- excessive idle sway;
- frequent micro-glances;
- decorative fidgeting;
- large secondary motion.

Do **not** suppress:

- walking;
- sit/stand;
- object use;
- required social gesture feedback.

## Performance priorities

On mobile:

1. player;
2. currently interacted NPC;
3. nearby visitors;
4. distant characters.

Possible degradations:

- reduce gaze update rate;
- disable IK for distant actors;
- reduce micro-idle frequency;
- skip nonessential overlays.

## Budgets

Capture:

- frame timing with 1/3/8 characters;
- active animation mixer count;
- IK solve cost;
- allocations per frame;
- mobile 3D performance.

## Done when

- [ ] one player + three visitors remains responsive on target phones.
- [ ] reduced-motion mode removes decorative movement.
- [ ] essential action animations remain readable.
- [ ] no persistent per-frame garbage spike from IK/gaze code.

## QA requirements

- [ ] reduced-motion initial and live preference changes.
- [ ] 1/3/8 synthetic actor profiles and production-cap scenario.
- [ ] measured IK/gaze/mixer timing, allocation and degradation results.
- [ ] physical phone performance and full suite/build/check/CI.

## Implementation guardrails

- Presentation cannot mutate gameplay state, consume simulation RNG or delay completion.
- Preserve renderer-neutral intent, Classic fallback and safe interrupt cleanup.
- Record human review honestly and retain existing certification requirements.

## Repository review and integration notes

Production gameplay is bounded to one player plus three visitors. Treat the
source's eight-character case as a synthetic renderer stress fixture only; do
not enlarge the saved roster/presence cap for a benchmark. Profile representative
combined layers after 0064 and both renderers; distinguish headless desktop
measurements from physical-phone evidence. Define target devices, frame/IK/
allocation budgets and degradation thresholds before claiming a pass. Preference
changes during play must apply without a reload or altering saves/gameplay.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.

## Implementation evidence (2026-10-16)

Software implementation and automated coverage are available. See
[behavior contract](../docs/architecture/embodied-character-behavior.md) and
[validation record](../docs/reviews/embodied-character-behavior-validation.md).
Physical/mobile, human motion and any audible-output requirements remain pending;
automated results do not certify them.
