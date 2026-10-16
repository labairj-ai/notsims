# Add Embodied Behavior Validation and Human Animation Acceptance

- **ID:** 0068
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0054–0067 (implementation and automated evidence)
- **Certification target:** 0052 (existing human acceptance remains open)

## Problem

The layered body system spans clips, gaze, posture, contact, object use and shared
roles. Unit checks alone cannot establish motion readability, believable spacing,
interrupt safety or comfort on physical devices. A consolidated automated matrix
and recorded human review are required before certification.

## Automated scenario matrix

Capture representative states:

**Locomotion**
- normal;
- low energy;
- high tension.

**Object**
- bed;
- sofa;
- fridge;
- stove;
- shower;
- toilet;
- TV;
- desk;
- bookcase.

**Social**
- introduction;
- chat;
- joke success/fail;
- compliment;
- confide;
- argument;
- insult;
- apology accepted/rejected.

**Shared**
- sit/chat;
- watch;
- eat;
- cook;
- read.

**Relationship**
- stranger;
- friend;
- close friend;
- tense/enemy.

## Automated checks

- required clips exist;
- no missing bones;
- no NaN quaternion/position;
- IK weights bounded;
- head rotation bounded;
- no animation layer persists after activity;
- simulation state identical with body system disabled;
- deterministic replay unchanged;
- Classic/Three semantic pose parity.

## Human acceptance

On desktop and physical mobile evaluate:

- Does gaze feel natural?
- Do characters stare too much?
- Is personal spacing believable?
- Are gestures too large/repetitive?
- Does mood read without becoming cartoonish?
- Do hands visibly contact objects?
- Do characters clip through furniture?
- Are sit/stand transitions convincing?
- Are social interactions understandable without reading the action label?
- Do repeated conversations still look varied?
- Does 8× speed become visually absurd?
- Does Classic still communicate the same action?

## Completion artifact

Create:

```text
docs/reviews/embodied-character-behavior-validation.md
```

## Done when

- [ ] automated matrix passes;
- [ ] physical iPhone/Android checks pass;
- [ ] human animation review recorded;
- [ ] no critical clipping/staring/pose defects remain;
- [ ] feature can be disabled without simulation changes.

## QA requirements

- [ ] automated matrix, domain-state parity and deterministic replay.
- [ ] missing assets/bones, interruption and reduced-motion cases.
- [ ] physical iPhone/Android plus desktop human animation review.
- [ ] exact source/asset identity, observations and certification decision; full suite/build/check/CI.

## Implementation guardrails

- Presentation cannot mutate gameplay state, consume simulation RNG or delay completion.
- Preserve renderer-neutral intent, Classic fallback and safe interrupt cleanup.
- Record human review honestly and retain existing certification requirements.

## Repository review and integration notes

0052 is an open certification target, not a reason to block constructing this
automated matrix. Record implementation readiness separately from final physical
and human acceptance. The final certification must account for 0052's still-open
iPhone/Android, standalone and audible-output evidence; do not close prior tasks
merely by adding a new umbrella validation record.
Include all layers disabled/enabled, old-save migration, cancellation/visibility,
missing assets/bones, changed furniture, multiple visitors and reduced motion.
Use exact tested source/asset SHA, device/OS/browser, actual media evidence and
observed defects. No headless frame/decode result proves natural-looking motion
or human-perceived sound/touch comfort.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
