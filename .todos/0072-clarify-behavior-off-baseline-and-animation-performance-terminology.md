# Clarify Behavior-Off Baseline and Animation Performance Terminology

- **ID:** 0072
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** low
- **Depends:** 0065, 0067 (implementation/evidence available)
- **Evidence target:** 0068 (no need to await physical certification)

## Problem

`?body=off` is described in places as a legacy baseline.

It disables the new procedural behavior layers but still loads and uses the expanded character asset and current renderer stack.

It is therefore not a true pre-embodied asset/load/performance baseline.

## Proposed approach

Rename/document the mode consistently as:

**behavior-off baseline**

Clarify that it disables:

- gesture overlays;
- gaze;
- IK;
- affect/posture overlays;
- micro-motion;
- synchrony.

It does not revert:

- GLB asset size;
- clip vocabulary;
- renderer version;
- current character-loading behavior.

If a true old-release performance comparison is required, compare against the prior production SHA separately.

## Touches

- `docs/architecture/embodied-character-behavior.md`
- `docs/reviews/embodied-character-behavior-validation.md`
- comments/help text mentioning `?body=off`

## Implementation guardrails

- No runtime behavior change.
- Do not remove `?body=off`.
- Keep it available as a presentation-isolation/debug tool.

## Done when

- [ ] all documentation uses accurate terminology.
- [ ] performance evidence distinguishes behavior-off from old-release baseline.
- [ ] acceptance procedures specify which baseline to use.

## QA requirements

- [ ] documentation-only check.
- [ ] query parameter still disables procedural layers.



## Repository review and integration notes

Confirmed: the validation document calls `?body=off` a "legacy baseline".
The expanded GLB and renderer remain in use. Label it behavior-off baseline and
separately identify any exact old-release source/asset used for a load/performance
comparison. This is documentation/terminology work, not a blocker on completing
physical 0068 acceptance. Keep the existing disable parameter and state-parity
checks intact.

## Source

Imported from the [PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7), checked against `c43dae2b1e8beccd1896a7173e95dde32f30d9fa` on `codex/embodied-character-behavior` and read-only PR #1/main metadata.
Source scope retained; dependency, check-name and deployment clarifications are recorded above. All new tasks remain open.
