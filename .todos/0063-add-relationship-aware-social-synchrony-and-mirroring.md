# Add Relationship-Aware Social Synchrony and Mirroring

- **ID:** 0063
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** medium
- **Depends:** 0035, 0058, 0060

## Problem

Two characters can interact but their motions remain independent.

Research suggests subtle motor synchrony/mimicry can contribute to perceived rapport and social closeness. 

## Proposed approach

Add subtle presentation-only coupling for positive relationships.

Examples:

- listener mirrors posture after a delay;
- reciprocal nod;
- both lean slightly toward one another;
- laughter timing overlaps;
- shared TV/eating movement occasionally synchronizes.

Strength may depend on:

```text
connection
affinity
relationship dynamic
interaction context
```

Example:

```text
Stranger       almost none
Friend         subtle
Close Friend   somewhat more
Tense          reduced
Enemy          deliberately asynchronous
```

## Critical rule

Never use perfect immediate mirroring.

Use delayed, partial similarity.

## Implementation guardrails

- Synchrony cannot change relationship score.
- It reflects relationship state; it does not create it.
- No synchronized repetitive bobbing.
- Keep amplitude subtle.

## Done when

- [ ] warm relationships appear more coordinated.
- [ ] tense relationships appear less synchronized.
- [ ] effect is visible but not cartoonish.
- [ ] simulation remains identical with feature enabled/disabled.

## QA requirements

- [ ] enabled/disabled simulation and replay equality.
- [ ] bounded delay/amplitude and no mutual-feedback loop tests.
- [ ] asymmetric/tense/missing-partner scenarios.
- [ ] browser comparison and full suite/build/check/CI.

## Repository review and integration notes

Keep coupling one-way/read-only from relationship state with a bounded delay
and amplitude. Avoid a feedback loop where each actor's procedural output feeds
the other indefinitely. Define a stable pair/role reference and presentation
clock; disabling mirroring cannot consume domain RNG or alter outcomes. Test
unavailable/departing partners, asymmetric relationships, tense states and rapid
target switches in addition to positive screenshots.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.

## Implementation evidence (2026-10-16)

Software implementation and automated coverage are available. See
[behavior contract](../docs/architecture/embodied-character-behavior.md) and
[validation record](../docs/reviews/embodied-character-behavior-validation.md).
Physical/mobile, human motion and any audible-output requirements remain pending;
automated results do not certify them.
