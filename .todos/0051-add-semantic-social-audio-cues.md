# 0051 — Add Semantic Social Audio Cues

- **ID:** 0051
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0013, 0015, 0017, 0047, 0050

## Problem

Social events currently produce visual notifications but have no semantic audio mapping.

Phone calls, texts, visitors, and relationship milestones therefore lack sensory presence even though the audio architecture already supports event-driven cues.

## Proposed approach

Extend the existing audio event resolver.

Candidate mappings:

```text
SOCIAL_NOTIFICATION(type=text)
  → social.phone.text

SOCIAL_NOTIFICATION(type=phone_call)
  → social.phone.ring

VISIT_ARRIVED
  → social.door.knock

SOCIAL_EVENT_OFFERED(type=drop_by)
  → social.door.knock

RELATIONSHIP_STATUS_CHANGED
  → social.relationship.milestone
```

Optional:

```text
SOCIAL_PLAN_CREATED
  → ui.confirm
```

Avoid duplicating cues when one command emits both arrival and offered-event facts.

### Assets

Add a small coherent set:

- phone text tone;
- phone ring;
- knock/doorbell;
- subtle relationship milestone.

Use existing local/CC0 provenance rules.

### Playback rules

- ringtone must be bounded;
- incoming call cannot loop indefinitely;
- decline/answer stops ringtone;
- hidden-tab policy preserved;
- no voice acting.

## Implementation guardrails

- Social system must not import AudioManager.
- Events contain semantic data, never filenames.
- Relationship changes remain visually communicated.
- Audio failure cannot affect social gameplay.
- No repeated audio bursts during fast-forward/catch-up.

## Done when

- [x] text notification produces semantic cue;
- [x] call produces ringtone;
- [x] answering/declining stops ringtone;
- [x] visitor produces knock/doorbell;
- [x] no duplicate knock occurs;
- [x] social audio respects mute/bus settings;
- [x] audio-disabled gameplay remains identical.

## QA requirements

- [x] resolver tests;
- [x] ringtone lifecycle tests;
- [x] visitor audio deduplication test;
- [x] asset provenance/build checks;
- [ ] human listening acceptance;
- [ ] full suite and CI pass.



## Repository review and integration notes

Confirmed: social facts are emitted, but the audio cue resolver has no social
mappings. Correlate arrival/offered events by visit/event identity to deduplicate
knocks. Add enough semantic correlation to stop a ringtone on response, expiry,
state replacement or teardown. Respect existing bus, autoplay, mute, visibility
and fast-forward policies. Human listening is recorded under 0052 and the
existing 0021 record; automated signal checks do not establish audibility.

## Source

Reviewed and imported from the [shared social follow-up review](https://chatgpt.com/share/6ad2940c-5270-83ea-88e8-a8ec8f0f1dfe?ogimg=plain), against implementation `91008ba695c8359c894baa83488c4ea43467359e`.
Source scope and acceptance criteria retained; dependency clarifications are recorded above.

## Implementation evidence

See [follow-up validation](../docs/reviews/social-followup-validation.md) and
[human acceptance](../docs/reviews/mobile-social-human-acceptance.md).
Physical/mobile/listening acceptance remains pending where required; implementation evidence does not certify it.
