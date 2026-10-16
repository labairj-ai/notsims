# Complete Physical Mobile, Standalone, Thermal, and Audio Acceptance

- **ID:** 0075
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0067 (implementation), 0074 (desktop review)
- **Acceptance targets:** 0052, 0067, 0068 physical/standalone/listening criteria

## Problem

Physical iPhone/Android usability, real mobile animation performance, standalone installation, and human audible-output acceptance remain outstanding.

Desktop emulation does not establish:

- touch comfort;
- actual mobile GPU performance;
- thermal stability;
- battery impact;
- real safe-area behavior;
- human audio quality;
- believable motion at phone viewing distance.

## Required devices

At minimum:

- current physical iPhone + Safari;
- current physical Android phone + Chrome.

Also test installed/standalone mode where supported.

## Core motion scenarios

Run:

- player walking;
- four visible actors;
- conversation;
- argument;
- apology;
- fridge;
- stove;
- sofa;
- shared cooking;
- shared TV;
- shared eating.

Test portrait and landscape.

## Mobile observations

Record:

- average/visible frame stability;
- sustained minimum frame rate where measurable;
- touch responsiveness;
- thermal behavior after extended play;
- battery drain observations if meaningful;
- gesture responsiveness while animation load is active;
- clipping/contact readability on small screen;
- whether gaze/micro-motion is visible but not distracting.

## Reduced motion

Enable OS/browser reduced-motion preference during play.

Verify:

- decorative sway/glances disappear or reduce;
- required action feedback remains;
- no reload required;
- no gameplay/save difference.

## Standalone

Verify:

- Add to Home Screen/install;
- `/notsims/` launch;
- saved game persistence;
- safe-area correctness;
- orientation behavior;
- animation and touch behavior.

## Audio listening

Human-confirm:

- music;
- existing UI sounds;
- footsteps;
- text notification;
- ringtone;
- knock/doorbell;
- fridge timing;
- stove timing;
- shower timing;
- social milestone;
- interaction/audio synchronization.

Specifically compare reach/contact movement with semantic sound timing.

## Completion artifact

Update:

`docs/reviews/mobile-social-human-acceptance.md`

and:

`docs/reviews/embodied-character-behavior-validation.md`

Record exact:

- device;
- OS;
- browser;
- implementation SHA;
- character asset hash;
- installed/browser mode;
- result.

## Done when

- [ ] iPhone Safari acceptance passes.
- [ ] Android Chrome acceptance passes.
- [ ] standalone mode passes where supported.
- [ ] reduced-motion behavior passes physically.
- [ ] four-character performance remains acceptable.
- [ ] no unacceptable thermal/performance regression observed.
- [ ] human audio matrix passes.
- [ ] outstanding 0052/0067/0068 physical criteria are satisfied or explicitly failed with follow-up TODOs.

## QA requirements

- [x] no inferred physical result.
- [x] automated suite rerun after any fixes.
- [x] CI green on final candidate SHA (software candidate; physical review remains pending).



## Implementation guardrails

- Preserve domain/render boundaries, deterministic replay and save compatibility.
- Record human/physical outcomes only from actual observed tests.
- Keep exact source/asset identities and open acceptance findings traceable.


## Repository review and integration notes

This owns the remaining physical/standalone/thermal/listening exercise,
consolidating 0052 and 0067/0068 physical criteria. Those are acceptance targets,
not tasks that must already be certified before this review can run. Preserve
row-by-row links to the existing human acceptance matrix and do not close earlier
tasks just because this umbrella exists. Require 0074 desktop review and a stable
candidate; record actual device, duration, conditions, OS/browser, source SHA and
asset hash. Choose measurable target thresholds before declaring performance or
thermal behavior acceptable, and label unsupported/unmeasured cases explicitly.

## Source

Imported from the [PR follow-up review](https://chatgpt.com/s/t_6ad2b66d40308191b0b3972664052ad7), checked against `c43dae2b1e8beccd1896a7173e95dde32f30d9fa` on `codex/embodied-character-behavior` and read-only PR #1/main metadata.
Source scope retained; dependency, check-name and deployment clarifications are recorded above. All new tasks remain open.

## Current acceptance state

Automated evidence and review preparation are in progress. Required human/
physical results remain pending. PR #1 remains draft; merge and production
activation are held by the explicit 0074/0075 acceptance criteria in 0076.
