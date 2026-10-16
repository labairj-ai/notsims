# Social Simulation Architecture

## Goal

Turn the current generic Social-need refill into a persistent social ecosystem where specific people can be met, called, invited over, unexpectedly drop by, remember prior interactions, become friends or enemies, drift apart, reconnect, and eventually influence one another through a social network.

The first release should feel systemic rather than scripted: people have identity, availability, compatibility, memories and history; social opportunities are surprising but explainable; all randomness is seeded and replayable.

## Three separate concepts

**Social need** answers: “How much human contact does my character need right now?”

**Relationship** answers: “How does this character feel about this specific person?”

**Community reputation** answers: “What does the wider network think of this character?”

Do not combine these into one universal social score.

## Persistent people

Keep `state.person` as the controlled character for now and assign it canonical actor ID `player`.

Add a persistent NPC registry:

```js
state.people = {
  person_1: {
    id: 'person_1',
    name: 'Maya Hart',
    appearance: {skin:'#...',hair:'#...',shirt:'#...',style:'curly'},
    trait: 'creative',
    socialStyle: 'warm',
    interests: ['books','cooking'],
    role: 'neighbor',
    availabilityProfile: 'day_evening'
  }
}
```

Start with 6–8 authored people. Recommended archetypes: old friend, welcoming neighbor, reserved neighbor, playful neighbor, blunt/competitive neighbor, creative local, and coworker candidates. Avoid an infinite procedural population until the core loop is fun.

## Relationship graph

Use canonical pair keys so the model can support player↔NPC and NPC↔NPC relationships.

```js
{
  a:'player',
  b:'person_1',
  familiarity:22,
  toward:{
    player:{affinity:35,trust:18,connection:40},
    person_1:{affinity:28,trust:15,connection:32}
  },
  lastContactMinute:4100,
  contactCount:8,
  peakTier:'friend',
  memories:[]
}
```

### Dimensions

**Familiarity (0–100, shared):** accumulated history and how well the pair know each other. Changes slowly and should not rapidly disappear.

**Affinity (-100–100, directional):** how positively one person feels about the other.

**Trust (0–100, directional):** confidence/reliance. Changes more slowly than affinity and reacts strongly to meaningful positive acts or betrayal.

**Connection (0–100, directional):** current active closeness/maintenance. This is the dimension that meaningfully drifts without contact.

The UI may show a derived bond meter, but tiers should use multiple dimensions and mutuality.

Suggested positive tiers: Stranger → Acquaintance → Friendly → Friend → Close Friend → Best Friend.

Suggested negative tiers: Uneasy → Disliked → Rival → Enemy.

Use `Complicated` when directional views differ materially.

Example Friend gate: familiarity >=30, both affinity >=25, minimum trust >=15. Example Enemy gate: familiarity >=20, at least one affinity <=-65, low trust, and a recent serious negative memory. Exact thresholds belong in centralized tunable content.

## Compatibility

Compatibility is derived, not stored as relationship truth. Inputs can include interest overlap, trait pairing and social-style pairing. It modifies interaction acceptance and effect magnitude but never guarantees friendship or enmity.

## Memories

Keep a bounded history of meaningful social moments rather than every line of dialogue.

Candidate memories: first_met, great_conversation, shared_laugh, confided_secret, insulted, argument, apology_accepted, apology_rejected, visit_welcomed, visit_declined, repeated_decline, reconnected, introduced_by_friend.

Each memory has minute, actor, target, valence, intensity, tags and optional expiry. Short-lived negative memories can create tension; important events may persist indefinitely.

## Social interaction taxonomy

Interactions should be semantic content definitions, not UI strings.

Families:

- Introduction: Greet, Introduce yourself, Ask about interests.
- Friendly: Chat, Ask about day, Joke, Compliment, Share interest, Encourage.
- Deepening: Get to know, Confide, Ask advice, Share good news.
- Conflict: Disagree, Argue, Insult, Confront.
- Repair: Apologize, Clear the air, Make amends.

Each definition can declare `id`, label, allowed channels, duration, requirements, cooldown, tags, acceptance rule, Social-need effects, relationship effects, memory result and animation key.

## Communication channels

Use one social-interaction system with channel-specific strength.

**In person:** requires both people present, strongest relationship effect and Social recovery, widest action set.

**Phone call:** synchronous, target must be available, moderate relationship/Social effect, suitable for maintenance/deepening/repair.

**Text:** low-impact asynchronous/near-asynchronous contact, good for maintenance, invitations and brief check-ins.

Future computer/video chat should reuse this channel layer instead of creating a second social rules engine.

## Phone

The phone is a character-owned UI/device, not furniture. Put it under Live mode with a small notification badge rather than adding a fifth permanent bottom tab.

Initial views: Contacts, Recent, Invitations, Notifications.

Outgoing: Call, Text, Check in, Apologize when eligible, Invite over, Ask to hang out.

Incoming: Call, Text, Invite, Ask to drop by, Life update.

The current generic `Call a friend` quick action should eventually become a real contact-selection action.

## Unexpected visitors

Unexpected visits should be deterministic scheduled opportunities, not independent per-minute dice rolls.

1. Persist `nextSocialOpportunityMinute` plus social RNG state/event counter.
2. When due, evaluate global eligibility.
3. Build a weighted eligible event/candidate set.
4. Pick using seeded RNG.
5. Offer at most one event.
6. Schedule the next opportunity regardless of whether an event fires.

Eligibility can include: player at home, social-hour window, no conflicting visitor, candidate available, visit cooldown, and relationship/history fit.

First visit intents: neighbor introduction, friendly drop-by, check-in/reconnect.

Candidate weighting can consider relationship tier, connection, time since last contact, neighbor role, social style and unresolved memories.

Arrival UX: `Maya dropped by.` → Invite in / Chat outside / Not now. Ignoring the prompt times out and the guest leaves. One normal decline should be neutral or nearly neutral; repeated declines or broken explicit plans can create a small memory.

## Planned visits

Initial player-created plans: Invite over now, Schedule later today, Schedule tomorrow, Cancel plan. Store host, guest IDs, start minute, expected duration, home location, intent and status. Do not build a full calendar until multiple scheduled-event types justify it.

## Presence and navigation

The current world is single-character. Extend it narrowly rather than rewriting into an ECS.

```js
state.social.presences = [{personId,x,y,state:'arriving',visitId,activity:null}]
```

Presence states: arriving, waiting, visiting, leaving.

Add neutral `pathFrom(...)` navigation using an arbitrary start position; keep current `pathTo(...)` as the player compatibility wrapper. NPC visitors initially need only arrival, waiting/gathering, and departure movement. They do not need full furniture autonomy yet.

For a face-to-face interaction, the player can path to an adjacent conversation position while the guest remains available. Later autonomy may let visitors sit, watch TV, eat, etc.

## Rendering

Three.js: keep `Map<personId, Human>`, reuse the loaded humanoid asset, customize appearance per person, and support Idle/Walk/basic social animations.

Classic: draw visitors using the existing character recipe at their world coordinates.

Tap/click person should select that person before interpreting the action as a ground movement.

## Availability

NPCs need lightweight availability profiles instead of a full off-lot simulation. Profiles may include morning, daytime, evening, flexible, workday. Calls and invitations can fail naturally when unavailable.

## Bounded autonomy

Visitors may greet, idle, initiate a chat occasionally, respond, or leave. Later they may use furniture or interact with other NPCs.

Negative autonomous actions require contextual support such as low affinity, unresolved conflict, negative memory or a relevant social-style bias. No arbitrary hostility “for variety.”

## Maintenance and drift

Do not decay all relationship dimensions equally.

- familiarity: nearly permanent / very slow;
- affinity: mostly persistent;
- trust: persistent unless changed by behavior;
- connection: meaningful decay without contact;
- memories: individual expiry policy.

Text restores a little connection, calls more, in-person contact most. This allows an old friend who is still liked/trusted but no longer actively close.

## Network effects and reputation

Design the relationship graph for NPC↔NPC edges from the beginning. Later systems can support mutual-friend introductions, a friend bringing someone over, gossip, group invitations and weak reputational priors.

Do not add a global reputation XP bar in the first release. Reputational information should be source-attributed, weak, decaying, and overridden by direct experience.

## Discovery loop

A strong first-game social loop:

1. Start with one old friend already in Contacts.
2. A neighbor may introduce themselves or drop by.
3. Choosing a job can reveal coworker contacts.
4. Existing contacts can introduce mutual acquaintances later.
5. Calls, texts and visits deepen or damage those specific ties.
6. Relationship history changes what social events become likely.

## Commands

Likely additions: `SOCIAL_INTERACT`, `PHONE_CONTACT`, `INVITE_OVER`, `RESPOND_SOCIAL_EVENT`, `ASK_GUEST_TO_LEAVE`, `CANCEL_SOCIAL_PLAN`.

## Events

Likely additions: `PERSON_MET`, `CONTACT_ADDED`, `RELATIONSHIP_CHANGED`, `RELATIONSHIP_STATUS_CHANGED`, `SOCIAL_MEMORY_ADDED`, `SOCIAL_CONTACT_COMPLETED`, `SOCIAL_EVENT_OFFERED`, `SOCIAL_EVENT_RESPONDED`, `VISIT_ARRIVED`, `VISIT_STARTED`, `VISIT_ENDED`, `SOCIAL_PLAN_CREATED`, `SOCIAL_PLAN_CANCELLED`.

## Persistence and RNG

Social state requires an intentional save-version migration. Old saves must migrate cleanly. Bound all people, relationships, memories, pending events and presences in validation.

Use `core/rng.js`; persist social RNG state or deterministic seed/event counter. No gameplay `Math.random()`. Randomness may choose next opportunity time, candidate/event, uncertain response or bounded autonomous choice.

## Mobile UX

Mobile stays primary. Tap a person → bottom social action sheet with name, relationship label, recent context and large actions. Phone lives under Live mode. Incoming social events use compact non-blocking cards/sheets. Keep the world visible.

## First social epic scope

Include persistent people, friend/enemy progression, compatibility, memories, phone contacts, invitations, unexpected visitors, physical visitor presence, basic in-person actions, bounded autonomy, maintenance/drift, mobile UI and deterministic QA.

Defer romance, marriage, family tree, children, roommates, overnight guests, parties, clubs, full neighborhood simulation, infinite procedural population, AI/LLM dialogue, voice acting and full reputation propagation.
