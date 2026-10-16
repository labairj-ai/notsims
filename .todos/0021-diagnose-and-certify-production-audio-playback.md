# Diagnose and Certify Production Audio Playback

- **ID:** 0021
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** critical
- **Depends:** 0013, 0014, 0015, 0016, 0017, 0018, 0019, 0020

## Problem

Audio implementation in commit `d392f66` passes automated tests and GitHub CI,
but no audio is currently heard when using the hosted Notsims game. Production
is served independently from GitHub through Nginx on the OptiPlex. A successful
push does not itself deploy the new `dist/` build.

Isolate stale/incomplete deployment, browser AudioContext unlock, persisted mute/
volume settings, missing assets/production paths, music/SFX playback, and browser/
site/OS audio configuration. Do not change architecture or replace assets until
the production playback path is proven.

## Target environment

- Production: https://optiplex.tailb97cdb.ts.net/notsims/
- Debug: https://optiplex.tailb97cdb.ts.net/notsims/?audioDebug=1
- Expected revision: `d392f66581de3daa7c39d9a16e869655d3bb12be`
- Nginx root: `/var/www/notsims/current`
- Full `dist/` in `/var/www/notsims/releases/<release>/`; `current` changes atomically.

## Proposed approach

1. Verify Menu → Audio settings exists. If absent, diagnose deployment drift
   before Web Audio. Record deployed SHA, release directory, current symlink,
   timestamp.
2. Rebuild clean current main: `git status`, `git rev-parse HEAD`, `npm ci`,
   `npm test`, `npm run build`, `npm run check`. Expected SHA is above or a direct
   descendant containing the full audio implementation. Do not deploy failed checks.
3. Copy the whole dist tree to a new release; verify assets/audio, music, sfx,
   src/audio, src/settings, src/ui/audio-settings.js. Atomically update current.
   Keep prior releases and existing Nginx/Tailscale routes intact.
4. Verify HTTP 200 and actual audio MIME/content for music/little-morning.mp3,
   music/clover-walk.mp3, music/porch-light.mp3, sfx/ui/confirm.wav and
   sfx/interactions/shower.wav under /notsims/assets/audio/. Fetch production audio
   JS as well. No audio asset may return 404/403/HTML/failed decode.
5. On the debug URL verify locked before input, then trusted pointer/keyboard
   interaction yields unlocked true, suspended false, muted false and nonzero
   master/music/sfx. Do not bypass autoplay protections.
6. Inspect manager.settings and localStorage `notsims.settings.v1`. Malformed
   records must recover defaults. Restore intentional mute/zero values through
   Menu → Audio settings, never through GameState/save changes.
7. After unlock call `notsimsAudio.manager.playCue('ui.confirm')`; record returned
   token, diagnostics and audible output. Investigate any fetch/decode/play error.
8. Verify menu/little-morning, home.day/day track, home.evening/porch-light music.
   musicVoices normally 1 and never >2 during crossfade. Confirm audible output.
9. Inspect network: zero audio requests before gesture; successful current-track
   MP3 and triggered WAV requests afterwards; no HTTP/content/decode errors.
10. Exercise indoor/outdoor walking, shower, stove, TV, desk/typing,
    fridge/eating, toilet, placement, sale and UI confirmation/error. Loops start
    only on arrival and cancel immediately. Confirm audible output.
11. Switch tabs: audio stops/suspends; return and use a gesture if necessary;
    verify clean recovery without orphan loops/duplicate music streams.
12. Verify unavailable audio never blocks New Game, Resume, commands, simulation,
    save/load or deterministic replay. Audio stays presentation-only.

## Touches

Deployment procedure, deploy/README.md, docs/reviews/audio-production-validation.md,
optional build metadata. Existing diagnostics only if evidence proves a real defect.

## Implementation guardrails

- Do not change simulation, GameState/save schema, cue taxonomy or existing assets.
- No audio state in GameState, production URLs in cues, or remote audio hotlinks.
- No autoplay bypass, automatic untrusted AudioContext resume or removal of hidden
  suspension.
- Do not silently deploy a dirty checkout or partial changed-file tree.
- Preserve prior releases for rollback. Do not change Nginx routing unless proven wrong.

## Done when

- [ ] Production serves d392f66 or a direct descendant with the complete audio implementation.
- [ ] current points to the intended release.
- [ ] Menu → Audio settings is visible in production.
- [ ] Representative MP3/WAV assets return HTTP 200.
- [ ] Zero audio requests occur before a trusted user gesture.
- [ ] Trusted pointer/keyboard input results in unlocked true.
- [ ] Production settings are unmuted with nonzero Master/Music/SFX.
- [ ] playCue('ui.confirm') produces audible output.
- [ ] Menu/day/evening music produces audible output.
- [ ] Interaction loops and footsteps are audible.
- [ ] Action cancellation stops audio correctly.
- [ ] Hidden-tab suspension/resume behaves correctly.
- [ ] Diagnostics contain no unexplained playback errors.
- [ ] Unavailable audio leaves gameplay operational.
- [ ] Final root cause is documented.
- [ ] Any corrective code change has a regression test (or deployment-only correction is recorded).
- [ ] Production audio playback is manually confirmed by a human listener.

## QA requirements

- [ ] npm test passes.
- [ ] npm run build passes.
- [ ] npm run check passes.
- [ ] GitHub CI passes on corrective code, if required.
- [ ] Classic desktop playback passes.
- [ ] 3D desktop playback passes.
- [ ] A real mobile/touch browser passes if available.
- [ ] Deterministic replay output is unchanged.
- [ ] No GameState/save schema change.
- [ ] Audio budgets remain within limits.
- [ ] Evidence is recorded in docs/reviews/audio-production-validation.md.

## Completion evidence

Record root cause, source SHA, release path/symlink, deployment timestamp,
browser/device, debug result, successful assets, diagnostics, corrective SHA/CI
if applicable, and human manual listening result. Do not mark human listening
complete based on headless playback/decode tests.

## Source

User-provided production certification task, after d392f66 was silent on the hosted site.
