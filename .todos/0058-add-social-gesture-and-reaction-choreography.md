# Add Social Gesture and Reaction Choreography

- **ID:** 0058
- **Status:** open
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0037, 0048 (implementation), 0055, 0056, 0057, 0065

## Problem

Social action outcomes are mechanically distinct but visually similar.

## Proposed action mapping

**Introduction**
- Introduce Yourself → wave/open hand + eye contact.
- Ask Interests → conversational gesture + attentive listener nod.

**Friendly**
- Chat → alternate TalkA/TalkB.
- Ask About Day → open palm / slight head tilt.
- Joke → talk gesture → reaction pause → laugh or awkward response.
- Compliment → warm open gesture + direct gaze.
- Encourage → nod + open hand/forward posture.

**Deepening**
- Get to Know → calmer gesture pacing.
- Confide → lower gesture amplitude, slight lean-in, occasional gaze aversion.
- Ask Advice → thoughtful/listener posture.
- Share Good News → more expansive gesture, higher energy.

**Conflict**
- Disagree → head shake.
- Argue → larger/faster gestures, tense torso.
- Insult → sharp/closed gesture; avoid cartoonishly violent movement.
- Confront → firm upright posture and direct orientation.

**Repair**
- Apologize → reduced posture, head dip, then return gaze.
- Clear the Air → open hands + measured gesture.
- Make Amends → open posture + nod.

## Two-character phases

Each social exchange should distinguish:

```text
speaker gesture
listener reaction
response/acknowledgment
settle
```

Listener reactions should include:

- nod;
- head shake;
- laugh;
- shrug;
- slight lean;
- gaze aversion;
- neutral acknowledgment.

## Outcome-specific reactions

Uncertain action success should affect presentation.

Example:

```text
Joke success → laugh
Joke failure → weak shrug / look away

Apology accepted → nod / posture opens
Apology rejected → look away / lean back
```

Simulation result is determined first; animation reflects it afterward.

## Implementation guardrails

- Animation cannot determine action success.
- Avoid caricatured emotion stereotypes.
- Keep gestures subtle enough for repeated interactions.
- No physical aggression in the initial set.

## Done when

- [ ] all existing social interactions have defined movement intent.
- [ ] success/failure reactions differ where appropriate.
- [ ] speaker/listener roles are visually distinct.
- [ ] reactions transition cleanly to idle.

## QA requirements

- interaction-by-interaction scenario matrix;
- accepted/rejected apology;
- successful/failed joke;
- positive/conflict conversation videos/screenshots.

## Repository review and integration notes

Consume existing actorId/targetId/initiatedBy/source fields and completed
success facts from the canonical social pipeline. Both roles need consistent
intent, including NPC-initiated and phone contexts; phone gestures must not gaze
at an absent physical partner. Reactions after completion need a bounded
presentation event cache with deduplication/reset, not saved animation state.
Do not reroll joke/apology success, delay rewards, or generate gameplay events
from choreography. 0048 code is available despite pending human usability review.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.
