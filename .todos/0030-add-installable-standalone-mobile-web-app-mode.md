# Add Installable Standalone Mobile Web App Mode

- **ID:** 0030
- **Status:** in progress
- **Created:** 2026-10-16
- **Priority:** medium
- **Depends:** 0023

## Problem

On phones, browser chrome consumes valuable vertical space. Notsims is well suited to an installed/standalone web-app experience, but currently has no web app manifest or install-oriented presentation mode.

This is not required for gameplay, but it can materially improve available screen real estate for frequent mobile play.

## Proposed approach

- Add a web app manifest.
- Use a stable app `id` and `start_url` under `/notsims/`.
- Request `display: standalone`.
- Provide appropriate app icons and theme/background colors.
- Keep orientation flexible; do not lock portrait/landscape.
- Add display-mode-specific CSS only where it improves layout.
- Preserve normal browser-tab play with no feature loss.
- Consider an unobtrusive install education prompt only after the user has played, and only when the platform provides a supported install path.
- On iOS where install prompting differs, provide optional instructions rather than pretending a programmatic install is available.

## Offline/service worker

Do not add offline caching automatically as part of this task unless explicitly accepted.
A manifest/standalone presentation improvement is valuable independently of a service worker.

If a service worker is later introduced, it needs its own version/update/deployment strategy to avoid stale game builds.

## Touches

- `manifest.webmanifest`
- `index.html`
- icons/assets
- `src/style.css`
- build/deploy packaging
- documentation/tests

## Implementation guardrails

- No service worker without a separate explicit cache/update design.
- Do not force fullscreen.
- Do not force orientation.
- Do not block browser-tab users with installation prompts.
- Manifest paths must work under the `/notsims/` subpath and Tailscale/Nginx deployment.
- Installation state must not enter GameState.

## Done when

- [ ] Manifest is packaged and served with correct MIME type.
- [ ] Installed app launches at `/notsims/`.
- [ ] Standalone mode removes normal browser chrome where supported.
- [ ] Safe-area layout remains correct in standalone mode.
- [ ] Browser-tab play remains fully supported.
- [ ] Icons/theme colors render correctly on supported platforms.

## QA requirements

- [ ] Android/Chrome install test.
- [ ] iOS Add to Home Screen test if device is available.
- [ ] Standalone cold-launch and resume test.
- [ ] Save/localStorage remains on expected origin and survives standalone relaunch.
- [ ] Deployment verifier checks manifest/icon HTTP responses.
- [ ] `npm test`, `npm run build`, and `npm run check` pass.

## Source

Created from the 2026-10-16 mobile-playability review of Notsims at `59befeaa3ea7ffa6c7f32f66600ab66b11746ab2`.

## Implementation record (2026-10-16)

Implementation is present; acceptance remains in progress where real-device or scenario certification is required. See [mobile validation](../docs/reviews/mobile-playability-validation.md) for measured results and explicit outstanding checks. Unchecked requirements are not claimed as passed.
