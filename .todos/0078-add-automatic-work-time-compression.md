# 0078 — Add Automatic Work Time Compression

- **ID:** 0078
- **Status:** completed
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0077

## Problem

A 6–8 hour rabbit-hole work shift contains very little player interaction but can currently require substantial real-world waiting unless the player manually selects 8× speed.

The Career UI currently instructs the player to manually speed up time.

This is unnecessary friction.

## Proposed behavior

When the player is actively at Work and automatic compression is eligible:

```text
effective speed = 24×
```

Target real durations:

```text
6-hour shift ≈ 15 seconds
7-hour shift ≈ 17.5 seconds
8-hour shift ≈ 20 seconds
```

Do not mutate the player's normal selected speed preference.

Use a derived concept such as:

```js
effectiveTimeScale({
  state,
  selectedSpeed,
  paused,
  attentionRequired
})
```

## Eligibility

Automatic compression activates when:

- active activity is a compressible Away Activity;
- player has no controllable on-lot actor requiring interaction;
- no modal/game pause is active;
- no attention-required away event is pending.

For today's single-player household:

```text
player at work
→ eligible
```

Future multi-character rule:

```text
compress only when every currently controllable household actor
is either away in a compressible activity or otherwise explicitly
eligible for time compression
```

Do not automatically accelerate while another household character remains playable at home.

## Player control

Pause must always override automatic compression.

Recommended initial behavior:

```text
Work starts
→ AUTO 24×
```

Speed HUD displays:

```text
WORK · 24×
```

The user's prior normal speed remains remembered.

When Work ends:

```text
restore normal selected speed
```

Optional manual override:

- pressing 1×/3×/8× during the current shift disables auto compression for that shift;
- pause always pauses;
- an Auto/Fast-Forward control may restore the away rate.

If avoiding new controls initially, automatic 24× plus Pause is acceptable.

## Simulation integrity

Do not jump directly:

```js
state.minutes += shiftRemaining
```

Instead continue through:

```js
advance(dt * effectiveSpeed)
```

and existing:

```js
tick()
```

which already divides advancement into bounded simulation steps.

This preserves:

- bills;
- need changes;
- relationship drift;
- social cooldowns;
- scheduled plan timing;
- career completion;
- deterministic events.

## Completion behavior

Immediately when Work completes:

- compression eligibility disappears;
- effective speed returns to normal;
- character becomes home/available;
- normal renderer behavior resumes;
- payday event occurs exactly once.

## Guardrails

- No special work-only world clock.
- No skipped simulation events.
- Pause must always work.
- Do not write auto-speed state into saves unless genuinely required.
- Work ending cannot leave the game stuck at 24×.
- Build/Furnish pause rules remain unchanged.

## Done when

- [ ] work automatically runs at 24× by default.
- [ ] 6/7/8-hour shifts complete in expected approximate real-time windows.
- [ ] normal user speed returns after work.
- [ ] pausing Work works.
- [ ] bills/events/needs remain identical to equivalent manually simulated game time.
- [ ] future multiple-household rule is documented.

## QA requirements

- [ ] 6-hour compression test.
- [ ] 7-hour compression test.
- [ ] 8-hour compression test.
- [ ] pause/resume test.
- [ ] shift completion restores speed test.
- [ ] compare 480 simulated work minutes at 1× vs 24× final GameState.
- [ ] frame-rate independence tests.
- [ ] browser/mobile HUD checks.

## Repository-specific integration notes

The Career panel currently tells players to speed up time manually. The selected 1×/3×/8× preference and pause controls are managed by the application UI/game loop; implement 24× as an effective, derived scale for eligible away activities. Do not overwrite the remembered speed, change the tick's simulation semantics, or leave the app at 24× after completion. Respect Build/Furnish pause behavior.

Land after 0079/0080 in the proposed sequence so compression does not magnify unsolved workplace care. Keep the multi-controllable-character rule explicit even though the current game has one player character.

## Source

Imported from the [Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a), checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3. Proposed behavior and acceptance criteria are retained; repository integration notes clarify current module ownership and sequencing.

## Current status

Completed in the away activity implementation. Work derives Auto 24× without changing the remembered normal speed; pause and manual overrides remain available.

