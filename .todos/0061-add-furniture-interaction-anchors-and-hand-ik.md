# Add Furniture Interaction Anchors and Hand IK

- **ID:** 0061
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0054, 0055, 0056, 0065

## Problem

Characters currently stand/sit near furniture and play a generic clip. Hands do not actually meet handles, books, work surfaces, controls, etc.

## Proposed approach

Extend renderer-neutral furniture recipes with interaction anchors.

Example:

```js
interactionAnchors: {
  fridgeHandle: {
    position: [...],
    facing: ...,
    hand: "right",
    lookAt: [...]
  }
}
```

Possible anchor types:

```text
approach
seat
look
leftHand
rightHand
bothHands
objectHold
foot
```

## Initial furniture anchors

- fridge handle;
- stove controls/cooking surface;
- bookcase shelf/book position;
- desk/keyboard area;
- shower control;
- bed sit/lie positions;
- sofa seats;
- toilet seat;
- TV viewing direction.

## IK

For Three.js:

- inspect MPFB skeleton chains;
- add/resolve arm effectors;
- use a lightweight two-bone solution or Three.js IK where appropriate;
- blend IK weight in/out rather than snapping.

Three.js provides an IK solver for skinned meshes, but the rig must be validated before adopting it wholesale. 

## Blend sequence

```text
authored Reach clip
        +
IK weight 0 → 1
        ↓
contact
        ↓
IK hold
        ↓
IK 1 → 0
        +
release animation
```

## Implementation guardrails

- IK may not alter simulation geometry.
- Never stretch limbs arbitrarily to unreachable targets.
- Fall back to authored animation if solver fails.
- No per-frame allocations that hurt mobile performance.
- Anchor metadata must rotate with furniture.

## Done when

- [ ] hand reaches fridge handle.
- [ ] cook hand aligns to work surface.
- [ ] reader reaches toward bookcase/book position.
- [ ] IK blends smoothly.
- [ ] rotated furniture preserves targets.
- [ ] invalid/unreachable target falls back safely.

## QA requirements

- all four furniture rotations;
- short/long approach angles;
- IK NaN/limit tests;
- mobile performance;
- skeleton clone/visitor parity.

## Repository review and integration notes

Existing furniture geometry uses `furniturePoint` and oriented interaction
approaches. Define one local-space anchor schema and shared transform helper;
anchors belong in neutral content/recipe metadata, never Three-only gameplay
rules. Verify actual MPFB bone chains and the installed Three version before
choosing an IK implementation. Treat failure/missing bones as graceful fallback,
with no shared skeleton mutation, accumulating offsets, NaNs or limb stretching.
Interaction anchors are visual contact targets, not new collision/placement cells.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.

## Implementation evidence (2026-10-16)

Software implementation and automated coverage are available. See
[behavior contract](../docs/architecture/embodied-character-behavior.md) and
[validation record](../docs/reviews/embodied-character-behavior-validation.md).
Physical/mobile, human motion and any audible-output requirements remain pending;
automated results do not certify them.
