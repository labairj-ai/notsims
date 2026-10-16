# Align Embodied TODO Status With Human Acceptance

- **ID:** 0070
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** none
- **Review targets:** 0055, 0065, 0068 (existing implementation/evidence)

## Problem

0055 and 0065 are currently marked complete even though their acceptance criteria include perceptual requirements such as:

- animation transitions show no major pose snapping;
- transitions remain smooth at 1×/3×/8×.

Automated clip, quaternion, browser, and controller tests can establish structural correctness, but they cannot establish convincing human-perceived motion.

The existing validation record correctly states that human motion acceptance remains pending.

## Proposed approach

Normalize backlog status so automated completion and perceptual acceptance do not contradict each other.

Preferred policy:

- keep 0054 complete;
- keep 0055 `in progress` until human transition review;
- keep 0065 `in progress` until human transition/interrupt review;
- keep 0056–0064 and 0066–0068 `in progress` where human/mobile criteria remain;
- keep 0069 complete.

Alternatively, explicitly move all perceptual acceptance criteria from 0055/0065 into 0068 and document that those TODOs represent software implementation only.

Do not silently treat automated browser screenshots as human motion certification.

## Touches

- `.todos/0055-expand-deterministic-character-animation-library.md`
- `.todos/0065-add-animation-controller-layering-transitions-and-interrupt-safety.md`
- `.todos/0068-add-embodied-behavior-validation-and-human-animation-acceptance.md`
- `docs/reviews/embodied-character-behavior-validation.md`

## Implementation guardrails

- No gameplay or animation code changes.
- Do not fabricate human acceptance.
- Preserve exact implementation evidence and SHAs.
- Keep automated and human evidence clearly distinguishable.

## Done when

- [ ] TODO statuses no longer contradict outstanding human acceptance.
- [ ] perceptual criteria have one clear owner.
- [ ] validation document explains the distinction.
- [ ] no unfinished physical/human criterion is marked complete.

## QA requirements

- [ ] backlog dependency/status review.
- [ ] documentation links resolve.
- [ ] no source/build behavior changes.



## Repository review and integration notes

Confirmed on `c43dae2`: 0055/0065 are marked complete while the embodied
validation record withholds human motion acceptance. This is an evidence/status
reconciliation task, not a new physical test gate. Review those tasks now; do not
require 0068 human certification to finish before correcting the contradictory
status. Choose one documented owner for perceptual criteria and retain all
original implementation/CI evidence. Adding this TODO does not itself change
existing completion claims or satisfy them.

## Source

Imported from the [PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7), checked against `c43dae2b1e8beccd1896a7173e95dde32f30d9fa` on `codex/embodied-character-behavior` and read-only PR #1/main metadata.
Source scope retained; dependency, check-name and deployment clarifications are recorded above. All new tasks remain open.

## Current implementation

Corrective work is implemented. See the updated embodied validation record;
final candidate CI and governance evidence are recorded separately.
