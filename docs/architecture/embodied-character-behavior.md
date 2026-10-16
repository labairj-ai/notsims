# Embodied character behavior contract

Body behavior is presentation. The simulation owns navigation, money, needs,
social outcomes, memories and activity completion. No animation callbacks write
GameState, emit domain events, or consume social RNG. Save version 3 is unchanged.

## BodyIntent and coordinates

`src/presentation/body-intent.js` resolves a fresh intent from read-only state.
Both renderers consume it. Fields:

| Field | Meaning |
| --- | --- |
| `actorId`, `key` | Actor identity and bounded activity/layer ownership key |
| `base`, `gesture` | Vocabulary from `clips.js`; missing overlays fall back to base |
| `position` | World `[plot x, height in metres, plot y]`; simulation cells unchanged |
| `facing` | Yaw radians, model forward +Z; null retains current facing |
| `phase` | approach, orient, prepare, contact, active, response, release, settle |
| `seatOffset` | Visual root correction for authored MPFB seated leg pose |
| `lookAt` | World position or null; head targets use visible partner positions |
| `hands` | At most two `{hand, target, weight}` visual contact targets |
| `affect` | Bounded valence, arousal, energy and tension; NPC fallback is neutral |
| `posture`, `lean` | Neutral semantic posture and bounded torso inclination |
| `micro` | Small breathing, sway and glance offsets from actor/time hashing |
| `role`, `synchrony`, `syncPhase` | Speaker/listener or cook/helper; delayed partial coupling |
| `enabled`, `reducedMotion`, `quality` | Local presentation policies, never saved |

Furniture anchors use local `[x,height,y]` coordinates and `furniturePoint` for
all four rotations. They are contact targets, not navigation or placement cells.
Reserved shared seats use the same rotated sofa coordinates as solo poses.
Conversation staging offsets stay within 0.08 of existing cell centers. Adjacent
navigation remains authoritative; no staging operation moves an actor through
walls or extends conversation reach. Shared positions remain object-driven.

## Clock, ownership and layer order

`BodyPresentation` owns a disposable clock, per-actor reactions and preference.
It freezes on pause and hidden tabs, and resets on state replacement or time
rewind. Presentation rate is 1/1.5/2 at simulation speed 1/3/8. Authoritative
position interpolation still follows the full simulation clock. The creator
preview owns its own independent skeleton and clock.

`CharacterAnimationController` restores last frame's authored bone pose first,
then applies:

1. Full-body AnimationMixer base, with 0.22 second crossfades.
2. Upper-body additive gesture, relative to Idle frame zero. Masks include
   spine/neck/head/clavicles/arms/hands; they exclude root, pelvis and legs.
3. Smoothed affect/posture; subtle stride and arm-swing modulation.
4. Head/neck/spine attention at 60/25/15 percent yaw contribution. Yaw is clamped
   to ±0.65 radians, pitch to ±0.28, velocity to 1.5 radians/second. Social gaze
   periodically averts; sleep suppresses gaze/contact.
5. Two-joint arm CCD, three iterations, at most 0.28 radians per correction.
   It never edits bone translations or lengths. Missing chains, nonfinite or
   unreachable targets fall back to the authored pose. Contact weight ramps
   during approach to contact and release.
6. Quaternion validity/normalization checks.

One-shot clips clamp at their neutral endpoint, except intentional sit/stand
endpoint changes. A new owner clears old overlays and contacts. Cancel, changed
path/object, departure, load, disable and hide cannot retain old IK ownership.
Restoring authored poses before procedural work prevents cumulative rotation.
Each Human clone owns materials, bones, mixer, solver and controller state.

## Behavior mappings

`SOCIAL_GESTURES` exhaustively maps the existing social catalog: wave for greeting;
TalkA/B for friendly/deepening talk; nod for encouragement; LeanIn for confiding;
shrug for advice; head shake for disagreement; Argue/Point for conflict; head dip
Apologize and measured talk/nod for repair. Speaker, listener, response and settle
phases follow the existing activity clock. Remote calls/texts use talk/type but
never look at an absent partner.

Canonical `SOCIAL_CONTACT_COMPLETED` facts produce deduplicated reactions for
2.5 presentation seconds, at most eight actors: successful jokes laugh, failed
jokes shrug/lean away; accepted apologies nod, rejected apologies lean away.
No outcome is inferred or rerolled. Reactions clear on state replacement/hide.

Object choreography uses approach → orient → prepare/reach → contact → active
→ release/settle. Sofa/toilet/bed use authored StandToSit/SitToStand before steady
Sit/Sleep, with smoothed visual height/bed tilt. Fridge reaches then eats; stove
reaches controls then stirs; bookcase reaches high then reads; desk types; shower
reaches controls then uses hands; TV attends to screen. Cancellation can compress
phases because animation must never hold the simulation open. Bathroom actions
remain abstract and clothed. Furniture meshes are static; doors/props are not
independent physics objects.

Audio continues to observe semantic activity facts and authoritative elapsed
phase. Fridge eating detail waits until after initial reach/contact (elapsed 2),
once per interaction; start/complete and loops keep their existing lifecycle.
AnimationMixer callbacks do not play sounds or create duplicate domain facts.

All five shared activities retain the canonical resolver/reservations. Sofa chat
alternates talk/nod and partner gaze. TV uses screen attention and occasional
companion reaction; eating alternates bites/talk; cooking alternates cook/helper
with distinct hands; reading alternates read/discuss. TV, table, desk and bookcase
approach slots remain standing where no actual reserved chair exists. No phantom
seat is added or unreserved furniture occupied. Sofa is the seated shared activity.

Affect is derived from existing player needs, with smoothed bounded application.
NPCs do not acquire invented hidden needs. Rare flourishes, irregular idle and
backchannels use actor/time hashes. Mirroring reads the weaker directional
relationship; tension disables it. Delay is 0.45–0.95 seconds, strength ≤0.25,
with one stable pair clock and no feedback between actor outputs.

Classic approximates the same intent with projected hands/head/posture and
meal/book/keyboard/pan shapes. It does not maintain separate action mappings.

## Accessibility, disable and budgets

Live `prefers-reduced-motion` removes micro-motion, glances and need flourishes;
required gestures retain reduced amplitude. `?body=off` disables new overlays,
gaze, IK, affect/posture, micro-motion and synchrony without changing saves or
simulation. This is the **behavior-off baseline**: the expanded GLB, clip
vocabulary, current renderer and loading path remain. A true pre-embodied
asset/load/performance baseline requires a separate old-release checkout. Production remains one
player plus three visitors; eight actors are a synthetic stress case only.

Target devices for outstanding acceptance: current iPhone Safari and Android
Chrome, portrait/landscape and standalone. Target 60 fps; acceptable sustained
minimum 30 fps. Body/controller budget: p95 <8 ms for four actors, IK <2 ms;
nonessential visitor layers degrade after sustained measured body cost >8 ms.
Player/current partner retain priority. Low quality removes IK and micro-idle;
essential base/action semantics remain. Solver vectors/quaternions are reused;
resolver results are short-lived bounded allocations. Real allocation/frame and
phone GPU budgets still require physical profiling, not Node timings.
