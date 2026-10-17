# 0081 — Add Away Attention Boundaries and Schedule Conflict Handling

- **ID:** 0081
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0077, 0078

## Problem

Automatic 24× Work compression makes scheduled simulation events arrive much faster in real-world time.

Existing social plans already behave such that a scheduled home visit occurring during Work becomes missed.

That result may be correct, but accelerating through it without adequate warning can feel unfair.

Future away systems may also include:

- work chance cards;
- school events;
- appointments;
- travel decisions;
- emergencies;
- promotion choices.

## Goal

Introduce an **attention boundary** concept.

Timed systems may classify events as:

```text
background
informational
attention_required
```

### Background

Continue compression.

Examples:

- need decay;
- bills charged;
- relationship drift;
- ordinary away bathroom break.

### Informational

Continue compression but show notification.

Examples:

- workplace meal break;
- skill gain;
- ordinary coworker contact.

### Attention required

Pause automatic compression.

Examples:

- future work choice/chance card;
- schedule conflict requiring a decision;
- critical future event.

## Social-plan conflicts

Before Work begins, query scheduled plans that overlap the proposed shift window.

Example UI:

```text
This shift runs until 5:00 PM.
Maya is scheduled to visit at 3:00 PM.
Starting work will cause you to miss the visit.
```

Options:

```text
Work anyway
Cancel
```

Do not automatically cancel or move the social plan.

## API direction

Add pure query:

```js
awayConflicts(state, proposedActivity)
```

Potential result:

```js
[
  {
    type: "social_plan",
    id: 17,
    minute: 900,
    label: "Hangout with Maya"
  }
]
```

## Guardrails

- High speed cannot silently hide required player decisions.
- Background simulation must not repeatedly pause compression.
- Existing plan outcome rules remain authoritative.
- No relationship penalty should be introduced merely because compression exists.
- UI does not calculate conflicts independently.

## Done when

- [ ] shift overlap with scheduled hangout is detected before start.
- [ ] user can deliberately work anyway.
- [ ] required-attention event can suspend away compression.
- [ ] background events continue through compressed time.
- [ ] architecture supports future work/school chance events.

## QA requirements

- [ ] no-plan Work start.
- [ ] overlapping-plan Work start.
- [ ] boundary exactly at shift start/end.
- [ ] attention interruption restores selected speed correctly.
- [ ] deterministic event ordering at 24×.

## Repository-specific integration notes

Scheduled social plans and work start are owned by simulation/domain systems; expose a pure conflict query and let the command/action validation remain authoritative. UI may present the query result and the player's Work anyway/Cancel choice, but must not compute or silently reschedule plans itself. Attention-required events must suspend effective compression without altering the saved normal speed or changing existing plan outcomes.

## Source

Imported from the [Away Activity and Work Time Compression review](https://chatgpt.com/s/t_6ad2cd72e224819181f479ab0232b55a), checked against main at 7bbcade5ef8ad1c5f1f712c82cd18b89fe6c09b3. Proposed behavior and acceptance criteria are retained; repository integration notes clarify current module ownership and sequencing.

## Current status

Open. No implementation or acceptance criteria are claimed complete.

