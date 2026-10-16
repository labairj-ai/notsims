# OptiPlex deployment

Run tests and `npm run build`. Package only `dist/` and copy it to a new timestamped directory in `/var/www/notsims/releases/` on `optiplex`. Atomically update `/var/www/notsims/current` to that release. Keep prior releases for rollback. Nginx serves static files; no database, Node service, or game secrets are needed on the server.

Install `notsims.conf` at `/etc/nginx/conf.d/notsims.conf`, then run `sudo nginx -t` before reloading Nginx. This adds an isolated loopback listener at port 4601.

Register the new path on the existing public HTTPS Funnel:

```sh
sudo tailscale funnel --bg --https=443 --set-path=/notsims http://127.0.0.1:4601
```

Do not reset Tailscale Funnel or replace existing root routes. Verify `https://optiplex.tailb97cdb.ts.net/notsims/` and its `src/main.js`, `src/render.js`, `src/engine.js`, and `src/style.css` return successful responses. A redirect from `/notsims` to `/notsims/` ensures relative asset URLs work. Confirm existing public routes still respond.

To roll back, atomically point `current` to the previous release; reload the page. Removing the game requires only removing this path from Funnel and removing this isolated Nginx configuration after verification.

## Release identity and audio certification

A GitHub push does not deploy the OptiPlex. Use a **clean checkout of the exact
committed revision** (an isolated detached worktree is suitable). Record its
full SHA before running `npm ci`, `npm test`, `npm run build`, and `npm run check`.
Do not package a dirty checkout or a failed build.

Package the whole dist tree, including assets/audio, src/audio, src/settings,
src/ui/audio-settings.js and the build-generated assets/audio/manifest.json.
Add build-info.json to the package with sourceSha, release, builtAt, sourceClean
and check results; generate SHA256SUMS.json for every packaged file. These are
release metadata, not GameState or device preferences. Verify the archive digest
in transit and every file digest after extraction before switching current.
Extract into a new nonexisting versioned release. Use a temporary symlink in
/var/www/notsims and atomic rename over current. Keep all previous release trees;
never overwrite the existing release or copy only changed modules. Record the
old/new targets and deployedAt in deployment-info.json.

The isolated Notsims server must retain the standard /etc/nginx/mime.types map
and add audio/wav for wav. Defining only the WAV type at server scope would drop
inherited JavaScript/CSS MIME mappings; the config includes the complete standard
map first. Validate with `sudo nginx -t` before reload. This changes MIME delivery,
not the Nginx/Tailscale route layout. Preserve the prior configuration for rollback.

Run the permanent production regression check from a machine with public access:

```sh
python3 deploy/verify-release.py \
  --base https://optiplex.tailb97cdb.ts.net/notsims/ \
  --dist /absolute/path/to/verified/dist \
  --report /absolute/path/to/http-evidence.json
```

It checks all audio files and modules for HTTP 200, correct MIME and exact bytes,
including build identity. It rejects the observed application/octet-stream WAV
regression and HTML/stale module responses. `npm test` exercises those failures.

Run scripts/audio-smoke.mjs against the production base for desktop/mobile
viewport unlock, decoding, mute/settings, hidden-tab and graceful-failure checks.
Run deploy/certify-audio.mjs with an external Puppeteer module and Chrome:

```sh
node deploy/certify-audio.mjs \
  --puppeteer-module /absolute/path/to/module-exporting-puppeteer.js \
  --chrome /absolute/path/to/chrome \
  --url https://optiplex.tailb97cdb.ts.net/notsims \
  --report /absolute/path/to/browser-evidence.json
```

The stricter check exercises all interactive furniture families, indoor/outdoor
walking, placement/sale/error, direct confirmation tokens, nonzero Web Audio bus
signals, music states and clean diagnostics. It caught the browser timer receiver
failure missed by the earlier smoke test. It uses isolated device storage and
never changes an existing player's settings or world save.

**A nonzero audio graph, successful decode or headless playback is not proof that
a human heard sound.** Record a separate human listening result with browser and
device before closing task 0021. On that device, reload the production debug URL,
use a trusted gesture and inspect Menu → Audio settings. Restore mute/zero levels
through the UI. Check browser/site/OS output configuration if its graph is healthy
but the listener still hears nothing. Never bypass autoplay or modify world saves.

## Mobile shell and standalone assets

The complete release includes manifest.webmanifest and assets/icons/icon-{192,512}.png.
Serve the manifest as application/manifest+json and icons as image/png. The
Notsims listener's types block adds webmanifest alongside WAV without changing
routes. The release verifier checks those files, mobile CSS, and input modules.
There is no service worker. Installation never replaces normal browser-tab play.

Run the optional external-browser QA harness (no production dependencies added):

```sh
node scripts/mobile-smoke.mjs --puppeteer-module /path/to/puppeteer-export.js \
  --chrome /path/to/chrome --url https://optiplex.tailb97cdb.ts.net/notsims/ \
  --out /tmp/mobile-evidence
```

It checks both renderers, seven viewport sizes, four modes, target geometry,
document overflow, browser errors and trusted touch pan/pinch suppression. Real
hardware, software keyboards, safe areas, installation, listening and comfort
still require the scenarios in task 0031 and the mobile validation record.
