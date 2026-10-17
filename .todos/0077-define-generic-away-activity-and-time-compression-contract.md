# 0077 — Define Generic Away Activity and Time-Compression Contract

- **ID:** 0077
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0076

## Problem

Work is currently represented as a special `activity.kind === 'work'` action.

While working:

- the player remains unavailable for normal world actions;
- time continues at the manually selected 1×/3×/8× rate;
- general need decay continues;
- Work directly modifies Energy and Social;
- no generic concept exists for a character being somewhere other than the active home lot.

Future systems will need the same abstraction for:

- school;
- errands;
- appointments;
- hospital visits;
- travel;
- off-lot dates;
- classes;
- future active/inactive careers;
- other scheduled activities.

Implementing work-specific fast-forward and need recovery directly in the career code would create another special-case architecture.

## Goal

Introduce a renderer-neutral, deterministic **Away Activity** contract that Work consumes first.

An away activity describes:

```js
{
  location: "away",
  awayPolicy: "work",
  compressible: true,
  attentionPolicy: "interruptible"
}
```

The activity itself remains authoritative simulation state.

Time compression remains application/presentation policy.

## Proposed architecture

```text
Activity
    ↓
AwayActivityPolicy
    ├── time-compression eligibility
    ├── away need affordances
    ├── attention boundaries
    ├── player-control restrictions
    └── future away strategies

Application clock
    ↓
EffectiveTimeScalePolicy
    ↓
existing advance()/tick()
```

Do not create a second simulation clock.

## Initial policies

Define at minimum:

```js
AWAY_POLICIES = {
  work: { ... }
}
```

Design so future policies can be added for:

```text
school
appointment
errand
travel
hospital
event
```

without modifying the game loop.

## Core invariants

- `state.minutes` remains the single authoritative world clock.
- Existing `tick()` remains responsible for simulation advancement.
- High-speed away time still runs deterministic simulation increments.
- Bills, need decay, social maintenance, visitor cooldowns and plans continue normally.
- Rendering never advances simulation.
- Away activities cannot require world furniture on the home lot.
- Player position on the home lot remains a return/spawn concept while away.

## Save policy

Decide explicitly whether away metadata is derived from activity type or serialized.

Prefer deriving stable configuration:

```text
kind = work
→ awayPolicy = work
```

rather than persisting duplicated policy configuration.

Only persistent progress such as elapsed shift time belongs in GameState.

## Done when

- [ ] generic Away Activity contract is documented.
- [ ] Work is defined as an Away Activity consumer.
- [ ] time-compression policy is separated from simulation progression.
- [ ] away need behavior has a generic extension point.
- [ ] future school/appointments/travel can reuse the architecture.
- [ ] no second world clock is introduced.

## QA requirements

- [ ] architecture dependency tests.
- [ ] same simulation result at different presentation speeds.
- [ ] save/load during work remains deterministic.
- [ ] replay result unaffected by real-time frame rate.
- [ ] full suite/build/check/CI passes.

## Repository-specific integration notes

The existing work activity is stored as simulation state and advances through the current authoritative tick path. Keep state.minutes as the only world clock and keep renderer/frame-loop code out of simulation policy. The career system owns work eligibility, duration, pay and raises; application-level speed selection belongs to the game loop/UI boundary. Prefer deriving the stable away policy from the activity kind so saves do not duplicate configuration. Maintain save/replay compatibility and deterministic results.

The contract is a prerequisite for the work-specific time compression and self-care tasks. It should allow future policies without adding school, travel or appointment gameplay now.

## Source

Imported from the [Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a), checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3. Proposed behavior and acceptance criteria are retained; repository integration notes clarify current module ownership and sequencing.

## Current status

Open. No implementation or acceptance criteria are claimed complete.

