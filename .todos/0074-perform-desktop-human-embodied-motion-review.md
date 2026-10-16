# Perform Desktop Human Embodied-Motion Review

- **ID:** 0074
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0055–0066 (implementation readiness; human review is this task’s output)

## Problem

Automated validation establishes structural and behavioral safety but cannot determine whether character movement looks natural.

Before physical mobile testing, obvious perceptual problems should be found and corrected on desktop where inspection is easier.

## Required review matrix

### Locomotion

Observe at 1×, 3× and 8×:

- normal energy;
- low energy;
- tense affect.

Check:

- foot sliding;
- arm swing;
- torso posture;
- start/stop transitions;
- speed scaling.

### Social

Review:

- introduction;
- chat;
- joke success;
- joke failure;
- compliment;
- confide;
- argument;
- insult;
- apology accepted;
- apology rejected.

Check:

- gesture amplitude;
- speaker/listener distinction;
- gaze;
- staring;
- gaze aversion;
- personal distance;
- mirroring;
- repetitive movement.

### Objects

Review:

- fridge;
- stove;
- sofa;
- bed;
- shower;
- toilet;
- desk;
- bookcase;
- TV.

Check:

- hand/contact accuracy;
- clipping;
- reach;
- sit/stand;
- lie-down transition;
- object orientation;
- cancellation.

### Shared activities

Review:

- sit/chat;
- watch TV;
- eat together;
- cook together;
- read together.

Check:

- complementary participant roles;
- overlapping characters;
- duplicated motion;
- partner/object gaze;
- synchrony.

### Mood/need expressivity

Without looking at debug values, determine whether the following are reasonably readable:

- tired;
- content;
- tense;
- hungry;
- bored;
- socially disconnected.

Record if existing reused gestures are semantically unclear.

## Specific decisions

If low-energy walking creates obvious foot sliding:

- reduce walk time-scale modulation;
- retain exhaustion through posture/arm swing instead.

If need flourishes are unclear, add dedicated reusable primitives such as:

- `StomachTouch`;
- `Yawn`;
- `Fidget`;
- `LookAround`;
- `PhoneCheck`.

Do not add clips unless human review establishes the need.

## Completion artifact

Update:

`docs/reviews/embodied-character-behavior-validation.md`

Include:

- tester;
- browser;
- tested SHA;
- observed scenarios;
- defects;
- fixes;
- pass/fail.

## Done when

- [ ] no critical pose snapping remains.
- [ ] no obvious persistent foot sliding remains.
- [ ] gaze does not feel unnaturally fixed.
- [ ] IK/contact is visually acceptable.
- [ ] social actions are readable.
- [ ] shared activities look coordinated.
- [ ] major clipping defects fixed or explicitly documented.
- [ ] human results recorded.

## QA requirements

- [x] rerun 141+ automated tests after fixes.
- [x] rerun 52 browser cases.
- [x] CI passes on final reviewed SHA (software candidate; human review remains pending).



## Implementation guardrails

- Preserve domain/render boundaries, deterministic replay and save compatibility.
- Record human/physical outcomes only from actual observed tests.
- Keep exact source/asset identities and open acceptance findings traceable.


## Repository review and integration notes

The implementation is available on draft PR #1 (`c43dae2`); human acceptance
is the output of this task, not an input completion gate for its implementation
prerequisites. The validation record reports 141 automated tests; treat that as
the starting floor and retain/expand the actual browser scenario inventory
instead of treating a stale count as proof. A named human must observe motion
through time; screenshots, headless runs and clip metadata alone cannot close
this item. Any fixes invalidate affected prior evidence and need a reviewed final
source/asset identity. Add new primitives only for observed readability defects.

## Source

Imported from the [PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7), checked against `c43dae2b1e8beccd1896a7173e95dde32f30d9fa` on `codex/embodied-character-behavior` and read-only PR #1/main metadata.
Source scope retained; dependency, check-name and deployment clarifications are recorded above. All new tasks remain open.

## Current acceptance state

Automated evidence and review preparation are in progress. Required human/
physical results remain pending. PR #1 remains draft; merge and production
activation are held by the explicit 0074/0075 acceptance criteria in 0076.
