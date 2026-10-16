# 0052 — Complete Physical Mobile, Standalone, and Human Audio Acceptance

- **ID:** 0052
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0048, 0051 (implementation and automated checks)
- **Acceptance targets:** 0021, 0023–0031, 0046, plus new social UI/audio

## Problem

Automated browser checks and emulation pass, but the mobile/social release has not yet been accepted on physical iPhone/Android hardware.

Audio has also not been human-listened, and standalone installation remains uncertified.

These are the remaining acceptance gaps for the current platform baseline.

## Device matrix

Required:

- physical iPhone + Safari;
- physical Android + Chrome.

Recommended:

- standalone/Add to Home Screen mode on both where supported;
- Bluetooth/headphones test;
- portrait and landscape.

## Mobile gameplay scenarios

### Core movement

- tap to move;
- one-finger Live pan;
- pinch zoom;
- camera rotation;
- speed controls.

### Build/Furnish

- Room drag;
- Floor/Wall/Door/Erase tap;
- verify accidental one-finger drag dispatches nothing;
- Furnish placement/rotation/cancel;
- two-finger navigation.

### Social

- open Phone;
- call old friend;
- text contact;
- select physical visitor;
- invite visitor;
- decline visitor;
- respond to unexpected drop-in;
- schedule tomorrow;
- save/reload before scheduled visit;
- argue;
- apologize;
- inspect relationship history.

### Ergonomic observations

Record:

- missed taps;
- accidental commands;
- sheet obstruction;
- finger covering selected NPC/object;
- controls requiring grip changes;
- scroll traps;
- safe-area collisions;
- browser chrome jumps;
- keyboard/VisualViewport issues;
- social sheet overload.

## Audio acceptance

Human-confirm:

- background music;
- UI sounds;
- footsteps;
- interaction loops;
- phone text;
- ringtone;
- knock/doorbell;
- volume balance;
- mute controls;
- Bluetooth/output switching.

## Installation

Verify:

- Android install/standalone launch;
- iOS Add to Home Screen;
- correct `/notsims/` start URL;
- saves persist after relaunch;
- safe areas remain correct.

## Implementation guardrails

- Use actual hardware and human listening evidence; emulation cannot certify this task.
- Verify the tested production SHA and keep prior acceptance records traceable.
- Record failures and unsupported scenarios explicitly; do not infer a pass.
- Keep game saves and device audio preferences separate during acceptance.

## Done when

- [ ] iPhone Safari core scenarios pass;
- [ ] Android Chrome core scenarios pass;
- [ ] social interactions are comfortable one-handed;
- [ ] no critical accidental Build/Furnish commands;
- [ ] standalone launch works where supported;
- [ ] human confirms audible music/SFX/social cues;
- [ ] known usability findings are documented;
- [ ] 0031 and 0046 physical acceptance criteria are satisfied or explicitly superseded by this validation.

## Completion artifact

Update/create:

```text
docs/reviews/mobile-social-human-acceptance.md
```

Record:

- device;
- OS;
- browser;
- tested SHA;
- installation mode;
- scenario results;
- screenshots;
- bugs/fixes;
- audio result;
- final certification decision.

## QA requirements

- [ ] full automated suite still passes;
- [ ] production SHA verified;
- [ ] GitHub CI green;
- [ ] physical evidence recorded;
- [ ] no inferred/fabricated human result.



## Repository review and integration notes

This consolidates existing acceptance work; it does not replace unfinished
implementation or erase open findings. Tasks 0021, 0023–0031 and 0046 retain their
original evidence and status until a row-by-row mapping shows the applicable
criteria passed on real hardware. They are validation targets, not completion
prerequisites for this task. Record untested/unsupported scenarios explicitly;
never close a parent certification solely because this umbrella item exists.

Separate implementation readiness for 0048/0051 from final human sign-off here,
so accepting the UI/audio does not create a circular dependency. Include both
Classic and Three, background/resume, and origin-specific save persistence in
browser and standalone mode.

## Source

Reviewed and imported from the [shared social follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain), against implementation `91008ba695c8359c894baa83488c4ea43467359e`.
Source scope and acceptance criteria retained; dependency clarifications are recorded above.
