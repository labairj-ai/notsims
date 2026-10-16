# Production audio validation — task 0021

Date: 2026-10-16. **Deployment and automated certification pass. Human listening
confirmation is pending; task 0021 is not yet closed.**

## Root causes and corrections

1. **Stale deployment caused the original silence.** GitHub main was d392f66,
   but /var/www/notsims/current pointed to releases/c457d62 from 2026-10-15.
   Its public HTML lacked Audio settings and it had no audio assets. A successful
   GitHub push/CI run had not deployed the OptiPlex.
2. **Missing WAV MIME mapping.** After the complete audio release was installed,
   WAVs returned HTTP 200 with application/octet-stream. The server's standard
   mime.types file omitted wav. The isolated Notsims listener now includes the
   full standard MIME map plus audio/wav. nginx -t passed before reload. No route,
   port, root mapping or Tailscale/Funnel configuration was changed.
3. **Browser crossfade timer binding.** Strict production diagnostics found
   `{where: "music", message: "Illegal invocation"}`. MusicDirector stored native
   setTimeout/clearTimeout and called them as methods with the wrong receiver.
   Receiver-safe default wrappers fix this. A regression test recreates the
   receiver check: d392f66 fails, the correction passes. Audio architecture,
   taxonomy, assets, autoplay policy and hidden-tab policy are unchanged.

A permanent public-release verifier rejects wrong WAV/JS MIME, stale/HTML bytes
and unsuccessful delivery. Its regression test reproduces the MIME failure.
The stricter browser certificate requires empty diagnostics, which the previous
smoke suite did not; it caught the real timer defect.

## Exact production identity

| Field | Value |
| --- | --- |
| Deployed source / corrective commit | `0d43f2cff03f821ae302c7d6dac7eb443b945cb1` |
| Source ancestry | Direct descendant of `d392f66581de3daa7c39d9a16e869655d3bb12be` |
| Release | `/var/www/notsims/releases/20261016T182801Z-0d43f2c` |
| Current symlink | `/var/www/notsims/current` → that release |
| Build time UTC | `2026-10-16T18:28:01.775759+00:00` |
| Deployment time UTC | `2026-10-16T18:28:16.444299+00:00` |
| Archive SHA256 | `54eafcdba07306d8ebeaf0e204263b12b320409fc364fc37f72d98eb0ea8fce4` |
| Files verified before switch | 121 |
| Immediately previous release | `/var/www/notsims/releases/20261016T181217Z-d392f66` |
| Original pre-audio rollback | `/var/www/notsims/releases/c457d62` |
| Nginx backup | `/var/www/notsims/releases/c457d62/nginx-before-0021.conf` |

The source was built in a clean isolated checkout at
/private/tmp/notsims-production-0021. `git status --porcelain` was empty before
packaging; full SHA and d392f66 ancestry were verified. npm ci succeeded; all
**77 tests**, build and source checks passed. Full dist, not changed-file copies,
was archived and checksum-verified before atomic symlink replacement. All prior
releases are retained. Public [build metadata](https://optiplex.tailb97cdb.ts.net/notsims/build-info.json)
and deployment-info.json identify the release independently of GitHub.

Corrective CI: [successful run 38947499176](https://github.com/labairj-ai/notsims/actions/runs/38947499176).
No application code changed after that deployed commit; later evidence/harness
updates do not change the production runtime.

## Public delivery

51 public responses covering **all 35 audio files**, all audio subsystem modules,
settings/UI modules, main, HTML and metadata were HTTP 200, correct MIME and
byte-identical to the verified release. Representative full GETs:

| Path under /notsims/ | HTTP | MIME | Bytes |
| --- | --- | --- | --- |
| assets/audio/music/little-morning.mp3 | 200 | audio/mpeg | 320826 |
| assets/audio/music/clover-walk.mp3 | 200 | audio/mpeg | 320826 |
| assets/audio/music/porch-light.mp3 | 200 | audio/mpeg | 320826 |
| assets/audio/sfx/ui/confirm.wav | 200 | audio/wav | 19888 |
| assets/audio/sfx/interactions/shower.wav | 200 | audio/wav | 88244 |

Browser media streaming also used valid HTTP **206** byte-range responses with
Content-Range and audio MIME; these are successful partial deliveries, not
404/403 or HTML. The full-file regression GETs require HTTP 200 and exact hashes.
All local Nginx/standard JavaScript MIME checks pass. Loopback root still returns
200. The existing Nginx/Tailscale route layout is preserved.

## Browser certification

Chrome 155.0.8059.82, isolated profiles, actual public HTTPS URL, software WebGL,
no autoplay override. Browser settings tested here are fresh or changed through
the Audio settings UI; an existing player's private browser storage was not altered.

| Case | Result |
| --- | --- |
| Classic, 1440×1000 desktop | Pass |
| 3D, 1440×1000 desktop | Pass |
| Classic, 390×844 mobile/touch emulation | Pass |
| 3D, 390×844 mobile/touch emulation | Pass |
| No AudioContext | New Game succeeds; audio remains unavailable safely |
| Hidden tab / return | No voices/streams while hidden; clean recovery |
| Deliberately corrupt WAV | Expected decode diagnostic; gameplay continues |
| Missing spatial API | Safe centered playback |

Before input: zero audio requests, unlocked false, no AudioContext. A trusted
click unlocked the real production context. Direct playCue('ui.confirm') returned
a token and produced a nonzero UI-bus signal. Menu/little-morning,
home.day/clover-walk and home.evening/porch-light all produced nonzero music-bus
signals. Streams settled at 1 and never exceeded 2 during crossfades.

The strict certificate exercised shower, stove, TV, desk/typing, fridge/eating,
toilet, indoor and outdoor walking, object placement/sale and UI confirmation/error.
Loops were absent during approach, active on arrival, and absent immediately
after cancellation. Final diagnostics were **[]** in both view modes. The separate
forced-failure smoke tests intentionally generated a known decode error; that is
not an unexplained production diagnostic.

Representative clean final debug result (both modes):

```json
{
  "unlocked": true,
  "suspended": false,
  "muted": false,
  "buses": {"master":0.7,"music":0.35,"sfx":0.65,"ambience":0.4,"ui":0.55},
  "streams": 1,
  "decodedBytes": 4068440,
  "loops": ["ambience.garden.loop"],
  "diagnostics": [],
  "music": {"state":"home.evening","track":"porch-light","fadingTrack":null}
}
```

Audio settings validation, mute/unmute, keyboard volume changes and separate
settings persistence passed. Malformed/blocked-storage defaults are covered by
tests. GameState, save version and deterministic replay are unchanged. Audio
payload remains 1,898,360 B, unlock preload 51,816 B, decoded planning estimate
4,068,481 B, within the existing 3 MiB / 128 KiB / 8 MiB limits.

Reproduction instructions are in [deploy/README.md](../../deploy/README.md).
Evidence JSON: [HTTP/hash report](evidence/audio-production-http.json) and
[browser/debug report](evidence/audio-production-browser.json). Complete
local browser/HTTP reports are also in /private/tmp/notsims-production-0021-*.json
and /private/tmp/notsims-production-0021-browser/.

## Human listening — required, not yet claimed

A human has been asked to reload the production debug URL, perform a trusted
gesture, check nonzero/unmuted settings in the UI, and report whether music and
UI/furniture effects are heard, including browser/device. **No human reply has
yet been recorded.** Nonzero graph samples and headless playback are not a claim
that sound reached a person's speakers/headphones.

Real mobile hardware is not available to this automation session. The mobile
results above are emulation. A human mobile result can satisfy the optional real
device check if such a device is available. If a listener still hears nothing,
inspect their site/tab mute, OS output/device and actual persisted settings before
changing assets or simulation. Task 0021 stays in progress until its explicit
human listening criterion is satisfied.
