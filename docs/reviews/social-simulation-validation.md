# Social simulation implementation and acceptance

The social architecture contract is `docs/architecture/social-simulation.md`.
Tasks 0032–0045 are implemented. Task 0046 has automated acceptance coverage;
physical iPhone Safari and Android Chrome acceptance remains open. Existing
human audio listening and standalone installation certification remain open.

## Implemented behavior

- Save schema v2 migrates v1 purely and deterministically, preserving the home,
  funds, needs, job, progress and clock. Canonical player ID, seven stable NPCs,
  old friend contact, directional graph and social RNG/scheduler are persisted.
- Bounded people, pair graph, directional affinity/trust/connection, familiarity,
  derived mutual/asymmetric positive and negative tiers, peak history, contextual
  seeded outcomes, compatibility, expiring memories and reciprocity.
- Semantic Introduction, Friendly, Deepening, Conflict and Repair actions share
  in-person, call and text channel definitions. Social need is separate from ties.
  Conversations use the existing action queue and revalidate presence, access,
  availability and cooldown at execution. A departing guest cannot award contact.
- Phone has Contacts, Recent, Invitations and Notifications. Live quick actions
  select real people; the old generic refill is rejected by command dispatch.
  The low-level legacy action remains for compatibility with frozen engine QA.
- Deterministic scheduled opportunities select eligible weighted people, favoring
  neighbors, warm styles and reconnecting friends; negative ties do not drop by
  arbitrarily. Incoming texts/calls can be answered, declined or expire.
- Visitors arrive on the lot; Invite in / Chat outside / Not now are voluntary.
  Plans support now/later/tomorrow, cancellation, departure and saved lifecycle.
  Blocked arrival/work conflicts produce no relationship penalty. Visitor movement
  avoids occupancy and abandons blocked paths; departures have a fixed time bound.
- Bounded idle/check-in autonomy respects player queues. Hourly connection drift
  preserves familiarity, affinity and trust; contacts restore connection with
  channel-dependent strength. Hidden/offline time still does not advance.
- Friend introductions follow NPC pair edges. Source-attributed one-hop priors
  expire, are weak and influence uncertainty only before direct contact. No global
  reputation score or propagation loop. Careers reveal a coworker contact.
- Classic uses the existing person drawing recipe; Three reuses the loaded human
  asset with independent appearances/material disposal. Both support visitor
  selection/highlighting. Renderers own no social rules.
- Mobile Phone shortcut and bottom social sheet use 44px controls; incoming cards
  remain nonmodal. Switching modes or Escape closes the sheet. Safe-area spacing
  and bounded scroll keep the world and bottom navigation accessible.
- Non-room Build/Furnish drags exceeding 10 CSS px never dispatch mutations,
  including movement that returns to the start and final-release displacement.
  Room drags remain eligible; multitouch and cancellation retain suppression.

## Automated evidence

- `npm test`: 101 tests pass, including frozen v1 migration, atomic invalid input,
  prototype-key rejection, relationship tiers, friendship/conflict/repair, memory
  bounds, remote channel availability, incoming offers, accepted/declined/expired
  visitors, occupancy, blocked arrival, planned visits/save/load, connection drift,
  introduction provenance and deterministic multi-day scheduler restoration.
- `tests/scenarios/social.test.js`: replayed social story produces identical state
  and emitted facts under chunked/minute advancement. Welcomed neighbor and saved
  relationship history are covered. Existing scenarios were intentionally migrated
  to specific-person calls; frozen economy/home/needs baseline still agrees.
- `npm run build` and `npm run check`: pass.
- `scripts/mobile-scenarios.mjs`: Classic and Three pass actual Chrome touch
  scenarios for zero Furnish/Floor/Wall/Door/Erase drag commands, one room command,
  valid taps/placement, rotation, sheets, creator, pause and object selection.
- `scripts/social-scenarios.mjs`: Classic and Three pass at 320px, 390px and 1440px.
  Checks phone, specific-person text, invitation, visitor model, person picking,
  target size, overflow, departure, incoming visitor response and browser errors.
  Screenshots were visually inspected. The harness corrected desktop canvas offset
  handling; production picking continues to use canvas-local input coordinates.

## Human acceptance still required

Run the task 0031 physical scenarios plus: meet a neighbor, call/text the old
friend, invite/decline a visitor, schedule tomorrow, save/reload, argue/apologize,
inspect relationship history and use the phone comfortably with a finger.
Record actual device, OS/browser, release SHA and outcomes. Browser viewport
emulation is not physical-device certification and headless audio is not proof
of audible playback. No human result has been inferred or fabricated.
