# Social follow-up contracts

The existing social architecture remains authoritative. These extensions retain
one controlled player, stable NPC IDs, directional relationships, commands and
returned facts; there is no second social-effect engine.

## Ownership

`systems/social/social.js` is the stable facade and tick orchestrator. Focused
modules own relationships, memories, compatibility, availability, communication,
discovery, visits, plans, scheduler, autonomy, maintenance, queries and shared
activities. `support.js` owns the social RNG adapter, bounds and notifications;
`state.js` owns the starter state. None imports UI, renderers or audio.

`resolveSocialInteraction` applies all completed social relationship effects,
initiative counts, contact history and meaningful memories. Normal actions,
answered incoming contacts, autonomous check-ins and shared activities all use
it. Exchanges carry actorId, targetId, interactionId, channel, initiatedBy and
source; answering an NPC call does not change who initiated it. Unanswered offers
are not completed interactions. Public player commands cannot forge NPC actors.

`availableSocialActions` is pure and uses authoritative preparation rules. UI
ranking does not mutate state or consume RNG. Commands and queued execution
revalidate eligibility. Waiting visitors require an arrival decision first;
normal in-person actions require visiting state. Coworkers require career
introduction. Per-person seeded visit cooldowns are distinct from contact and
interaction cooldowns. An ignored first neighbor introduction does not repeat
indefinitely; known contacts can return when their visit cooldown expires.

## Repetition and memories

Bound recent pair interaction history to 48 records. Central tuning defines a
240-minute window and repeat multipliers 1/.65/.35/.15 plus a lighter family
penalty. Channel changes allow novelty, but do not bypass normal cooldowns.
Affinity, trust and familiarity gains diminish; connection maintenance remains
useful. Repeated conflict cannot continually farm familiarity. Coalesce identical
meaningful memories within a bounded window, with bounded counts/intensity and
expiry. This is simulation context, not a visible combo mechanic.

## Persistence

Save schema v3 adds visit cooldown metadata, recent pair interactions and a
nullable shared activity. The pure v2→v3 migration adds bounded defaults without
changing money, house, needs, careers, old memories or relationships. v1 follows
the existing v1→v2 migration first. Persist scheduler/RNG and cooldowns, never UI.

Shared activities reserve exactly two approach tiles in one bounded coordination
record. Both paths and all participants validate before any state mutation; no
currency is charged. Player actions retain the existing queue; a guest receives
one bounded route, not a second player queue. Both must arrive before elapsed
time or activity effects start. Obstruction, departure, timeout, object deletion
or cancellation releases both reservations without completion rewards.

Shared progress and approach routes are transient. Serializing/loading cancels
shared coordination, clears the player's activity and the participant's route,
retains current coordinates and relationship history, and awards no completion.
Normal scheduled visits and their lifecycle remain persistent. Exported v3 saves
are not backwards-compatible with pre-v3 releases.

## Rendering and audio

A presentation-neutral shared pose query supports Classic and Three. Renderers
read the same object, participants, approach positions and phase; they cannot
advance activity or apply needs/relationship effects. Current Sit/Eat/Idle clips
are reused; no new humanoid asset is required.

Social events carry semantic notification/event kind and correlation IDs.
Presentation maps these to four local CC0 synthesized cues. Ringtones are bounded
to 2.5 seconds and their owned voice can be stopped on answer, decline, expiry,
state replacement, hiding, mute or teardown. Arrival/offered facts deduplicate
knocks by visit identity and sound bursts are throttled during catch-up. Audio
failure and mute never affect gameplay.
