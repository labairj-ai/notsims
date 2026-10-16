# Add Social Proxemics and Conversation Staging

- **ID:** 0057
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0035, 0054, 0056

## Problem

In-person social actions currently mostly require adjacency. Relationship context does not meaningfully affect how characters position themselves.

## Proposed approach

Add presentation/simulation-neutral conversation staging rules.

Relationship/context can affect preferred interpersonal spacing:

```text
Stranger / formal      farther
Acquaintance           normal
Friend                 somewhat closer
Close friend           closer/relaxed
Conflict               more distance or rigid facing
Confide                closer/angled
Shared object activity object-driven positioning
```

Do **not** encode real-world centimeter measurements or treat one spacing model as culturally universal. Use tunable game-space bands.

## Facing

Conversation participants should normally:

- face each other approximately;
- avoid perfect military alignment;
- allow slight angular offset;
- orient more directly during conflict;
- sit side-by-side for TV;
- angle toward one another when chatting on a sofa.

Research consistently finds that interpersonal distance, gaze, and orientation jointly affect social perception. 

## Staging query

Add something like:

```js
socialPoseFor(state, actorId, targetId, interaction)
```

returning:

```js
{
  desiredDistance,
  orientation,
  lean,
  gazeWeight
}
```

## Implementation guardrails

- Do not move people through walls to satisfy preferred distance.
- Navigation safety beats ideal staging.
- Do not make relationship tier dependent on animation spacing.
- Always provide fallback to existing adjacent positioning.

## Done when

- [ ] strangers/friends/conflict have visibly distinct staging.
- [ ] seated shared activities use object-driven staging.
- [ ] characters do not overlap.
- [ ] conversation facing is visually coherent in both renderers.

## QA requirements

- narrow-room fallback;
- wall/object obstruction;
- multiple visitors;
- close/far relationship screenshots;
- deterministic staging query tests.

## Repository review and integration notes

The source's "presentation/simulation-neutral" wording needs an explicit
boundary. First implement a pure staging query and visual offsets constrained to
existing safe/reserved positions. It may not silently move grid actors, extend
interaction reach or teleport a rendered body through geometry. Any later change
to authoritative conversation destinations is a separate, intentional navigation
change with obstruction/occupancy and replay coverage. Existing adjacency is the
fallback, not a guarantee that every preferred distance is feasible.

## Source

Imported from the [shared embodied-behavior review](https://chatgpt.com/s/t_6ad2a99165108191bc4e362cee7f9ee9), reviewed against implementation `69b09c677b8ba1b6bc6eda5e21db8ce7e57132bb`.
Original design scope retained; dependency and integration clarifications are documented above. Research citations in the source are design rationale, not independently certified findings in this backlog import.

## Implementation evidence (2026-10-16)

Software implementation and automated coverage are available. See
[behavior contract](../docs/architecture/embodied-character-behavior.md) and
[validation record](../docs/reviews/embodied-character-behavior-validation.md).
Physical/mobile, human motion and any audible-output requirements remain pending;
automated results do not certify them.
