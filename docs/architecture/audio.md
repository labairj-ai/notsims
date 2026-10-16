# Audio architecture and policy

Baseline: 6334607. Audio is presentation state. Domain modules never import the
audio implementation; command results and deterministic replay remain identical
whether audio is enabled, muted, unavailable or fails to decode.

## Contracts and ownership

| Module | Owns |
| --- | --- |
| audio-events | Presentation-only UI/FOOTSTEP event names and bus taxonomy |
| audio-cues | Stable cue IDs, mixer/mode/gain/variation/cooldown/polyphony/spatial/preload metadata |
| audio-cue-resolver | Pure fact → zero/more cue IDs; unknown facts safely map to [] |
| audio-event-subscriber | Live returned facts, duplicate coalescing, no historical queue |
| audio-manager | Gesture unlock, gains, limits, token-owned voices, diagnostics and teardown |
| web-audio-backend | Browser decoding, buffer sources, media streams and Web Audio graph |
| interaction-audio | Current visible activity phases and movement presentation |
| music-director | Context playlists, no-repeat selection and cancel-safe crossfades |
| settings/settings | Versioned device-local preferences, validation and defaults |
| ui/audio-settings | Labelled live controls; no simulation writes |
| audio-controller | Application wiring, visibility, reset/disposal and debug entry |

The buses are **master**, **music**, **sfx**, **ambience**, **ui**. Each child gain
connects to master and master to destination; per-voice gains precede bus gains.
WAV effects are cached as decoded buffers with an 8 MiB runtime cache limit
measured after browser resampling. MP3 music uses media elements/sources,
not decoded library-wide buffers. Position is an optional stereo pan enhancement
for world sounds in 3D, clamped around the plot center. Classic mode uses the same
cues without spatial panning; missing StereoPanner support falls back to center.

A cue has id, sources (asset IDs), bus, mode (oneShot/loop/stream), gain,
pitchJitter, cooldown in real seconds, maxPolyphony, spatial and preloadGroup.
The local library resolves asset IDs into files/provenance. Domain events and
commands contain no audio paths. Core content exposes stable interactionId
values: rest.sleep, rest.unwind, meal.prepare, meal.cook, care.toilet, care.shower,
leisure.watch, learning.practice and learning.read. The legacy public `use`
interaction selector remains compatible. No new furniture gameplay is added.

## Semantic routing

UI select/confirm/cancel/error/rotate are presentation events. Returned facts map
construction edits to build.floor/wall/door.place; object placement/sale to
object.place/sell; meal spending to economy.purchase; bills to economy.bill;
shift completion to career.shift.complete or career.promotion on every third
shift. Action rejection/cancellation produce restrained error/cancel feedback.
Money-received and action-queued facts intentionally have no redundant cue.
Rejected command results can only produce error feedback, never success cues.

Object phases resolve through semantic interaction IDs: fabric for bed/sofa,
fridge open/close plus eating, cooking ignition/loop, toilet completion flush,
shower start/loop/stop, TV loop, desk typing loop, and a page turn for reading.
Chair/table/lamp/plant/rug are decorative today: placement/sale feedback only.
The switch cue is reserved for a future lamp interaction. Garden breeze is a
subtle presentation loop, not a weather simulation. No speech is included.

Activity audio starts when the current simulation activity has reached its
interaction target; ACTION_STARTED itself includes walking time and must not
start a shower at the other side of the house. A loop token belongs to that
activity and is stopped on cancellation, completion, deletion, pause, reset,
load or teardown. No audio callback changes activity duration or completion.
Short-lived historical actions that finish within one advance do not spawn
orphan loops. Current-state reconciliation safely covers resumed/loaded state.

Footsteps use the same interpolated movement coordinates as presentation. Motion
accumulates over rendered positions; steps require >= .25 tile movement and
>= .4 real seconds since the last step. At most one step occurs per rendered
frame, with no catch-up burst. Indoor/outdoor variants depend on floor presence;
the surface string can later extend to floor materials. Simulation minutes and
speed do not directly emit footsteps.

## Lifecycle and resource policy

- Before a trusted pointerdown/keydown, no AudioContext, music or audio request is
  created. A valid user gesture creates/resumes the context. Browser denial is a
  diagnostic and does not block startup. No autoplay flags/workarounds are used.
- Pause, Build, Furnish and dialogs pause interaction/footstep sound along with
  simulation. Music and soft ambience continue. Track context is menu, home.day
  (06:00–18:00), or home.evening; switching panels does not restart a track.
- Hidden documents stop all voices/streams and zero master gain. They queue no
  historical audio. Returning restores preferences and current-context music.
  If the browser interrupted its context, the next trusted gesture resumes it;
  no background code calls AudioContext.resume to bypass gesture restrictions.
- Muting preserves all slider values, stops voices/streams, and sets master gain
  to zero. Unmute restores gains and current context. Slider movement has no
  test-sound preview and does not restart an otherwise eligible music track.
- Limits: 24 active/pending short voices globally, per-cue polyphony/cooldown,
  at most four resolved distinct cues per live result and build-family spacing
  >= .1 real seconds. Footsteps have their own >= .38-second cue cooldown.
- Music crossfades for 1.5 seconds, allows only two current/pending media elements,
  and avoids immediate repeats when multiple tracks qualify. One-track states
  loop without churn. Track changes use monotonic time, not frame count. Failed
  media attempts back off for 10 seconds or until a new user gesture.
- Cancelled asynchronous decodes are checked again before a source is started.
  Reset/load stop old handles before replacing state. Page hide/navigation
  disposes resources/listeners; bfcache pageshow installs a fresh locked service.

## Settings and diagnostics

`notsims.settings.v1` is independent of `notsims.save.v1`. Defaults are master .7,
music .35, sfx .65, ambience .4, ui .55, muted false. Finite values clamp to 0–1;
malformed/unknown versions recover defaults. Storage failures do not stop play.
New game, resume and JSON save import/export never replace audio preferences.
Mute is reversible and all information remains available visually in existing
labels, toasts, funds, needs and story feedback. Range controls are labelled,
keyboard accessible and have 44-pixel touch targets.

Open with `?audioDebug=1` (or append `&audioDebug=1`) and inspect
`notsimsAudio.debug()` in the console for bus settings, active voices/loops,
current/fading track and the most recent 12 diagnostics. It is presentation-only
and is removed on disposal. Tests use an injected fake backend, clocks and timers.
See [audio validation](../reviews/audio-validation.md) and the
[asset library](../../assets/audio/README.md) for evidence and explicit budgets.
