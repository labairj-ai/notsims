# Expand the Deterministic Character Animation Library

- **ID:** 0055
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0054

## Problem

The current generated GLB only contains enough motion to distinguish locomotion, sitting, eating, and sleeping.

## Proposed approach

Extend `scripts/export-character.py` so the CC0 character build generates a reusable animation vocabulary.

Add initial clips such as:

```text
Idle
Walk
Sit
Sleep
Eat

Wave
TalkA
TalkB
Nod
HeadShake
Laugh
Shrug
Point
LeanIn
LeanBack
Apologize
Argue
ReachHigh
ReachMid
ReachLow
UseHands
Type
Read
Stir
StandToSit
SitToStand
```

Do not create `ComplimentMaya`, `UseFridge`, etc. Clips should be reusable movement primitives.

## Clip categories

Looping:

```text
Idle
Walk
TalkA
TalkB
Type
Read
Stir
```

One-shot:

```text
Wave
Nod
HeadShake
Laugh
Shrug
Point
Apologize
Reach*
StandToSit
SitToStand
```

## Export requirements

- consistent 24fps;
- stable clip names;
- no unwanted root translation;
- loop clips return to compatible start/end pose;
- action clips have clean neutral boundaries;
- no joint discontinuities;
- preserve existing material/appearance support.

## Implementation guardrails

- Keep animation generation reproducible.
- Do not import proprietary/mystery animation packs.
- Do not inflate GLB size without a documented budget.
- Keep current five clip names backward compatible initially.

## Done when

- [ ] animation vocabulary exports reproducibly.
- [ ] every required clip exists in the GLB.
- [ ] clip duration/loop metadata validated.
- [ ] existing character customization works.
- [ ] animation transitions show no major pose snapping.

## QA requirements

- Script validates expected clip names.
- Duplicate/missing clip check.
- GLB size budget check.
- Headless Blender export produces identical structural metadata.
- Browser animation smoke test.

## Repository review and integration notes

Confirmed: `scripts/export-character.py` generates Idle/Walk/Sit/Eat/Sleep
and sets 24fps; `Human.play` uses a fixed crossfade. Extend this existing CC0
pipeline and preserve independent cloned skeleton/material behavior. Publish
explicit looping/one-shot metadata for every new primitive, including currently
uncategorized LeanIn/LeanBack/Argue/UseHands, and decide root/bone masks and axis
conventions with 0054. Test deterministic structural metadata separately from
binary GLB equality, which must not be assumed across Blender versions.
Use a pinned exporter/tool version and document asset bytes, load/decode time and
mobile budget. Missing optional new clips must fall back to legacy behavior.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
