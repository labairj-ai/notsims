# Add Mood and Need-Based Body Expressivity

- **ID:** 0059
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0054, 0055, 0065

## Problem

Characters look essentially the same whether energetic, exhausted, content, tense, lonely, or uncomfortable.

## Design approach

Derive a **presentation-only affect profile**, preferably from broad valence/arousal rather than adding dozens of simulation emotions.

Example:

```js
{
  valence: -0.4,
  arousal: 0.2,
  energy: 0.25,
  tension: 0.35
}
```

Research shows that body posture and movement speed carry affective information; higher-arousal states tend to use greater movement dynamicity, while low-arousal states can read through slower movement and less expansive posture. 

## Suggested body effects

**Content / positive**
- upright relaxed posture;
- slightly broader gesture range;
- normal/energetic stride.

**Low energy**
- slower movement;
- reduced arm swing;
- slight shoulder drop;
- longer transition into standing.

**Low mood / poor needs**
- smaller gesture envelope;
- less upright torso;
- reduced idle energy.

**High tension/conflict**
- firmer stance;
- faster/choppier gesture timing;
- reduced relaxed sway.

**High social connection**
- somewhat more partner-oriented posture and backchannels.

## Specific need flourishes

Use sparingly:

- hunger → occasional stomach-touch idle;
- energy → yawn/stretch;
- bladder → subtle weight shift;
- hygiene → restrained discomfort movement;
- fun/boredom → fidget/look-around;
- social → increased phone-check glance or environmental scanning.

These should be occasional presentation cues, not constant pantomime.

## Locomotion

Mood should affect:

- stride tempo;
- arm swing;
- torso pitch;
- start/stop energy.

Do not let presentation speed alter actual travel duration.

## Implementation guardrails

- Do not encode mental-health diagnoses.
- Avoid gendered emotional movement rules.
- Do not make one posture map rigidly to one emotion.
- Do not expose exact hidden need values through exaggerated animation.
- Simulation outcomes remain unchanged.

## Done when

- [ ] low/high energy are visually distinguishable.
- [ ] positive vs tense posture differs subtly.
- [ ] need flourishes occur occasionally.
- [ ] motion does not become repetitive or distracting.

## QA requirements

- [ ] affect resolver purity and bounded output tests.
- [ ] need-threshold smoothing and neutral NPC fallback tests.
- [ ] unchanged travel timing/positions at 1×/3×/8×.
- [ ] physical visual/readability review and full suite/build/check/CI.

## Repository review and integration notes

Use existing need/mood queries read-only. NPCs have availability/relationship
context but no full personal need vector; define an explicit neutral NPC fallback
rather than inventing hidden off-lot needs. "Slower movement" means apparent
stride/gesture style only: authoritative positions and travel duration stay
unchanged, with acceptable foot-slide limits recorded. Smooth threshold changes,
bound amplitude and provide reduced-motion hooks from the outset.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.

## Implementation evidence (2026-10-16)

Software implementation and automated coverage are available. See
[behavior contract](../docs/architecture/embodied-character-behavior.md) and
[validation record](../docs/reviews/embodied-character-behavior-validation.md).
Physical/mobile, human motion and any audible-output requirements remain pending;
automated results do not certify them.
