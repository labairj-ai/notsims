# Embodied behavior production deployment validation

Deployment completed 2026-10-17 UTC at the user's direction.

- PR: [#1](https://github.com/labairj-ai/notsims/pull/1), merged
- Merge/deployed source SHA: `d894f59ef1e9d991da11ce9525973e9d5f063d13`
- Required CI: [build passed](https://github.com/labairj-ai/notsims/actions/runs/38983991284)
- Build: clean detached checkout; `npm test` (142 passed), `npm run build`,
  and `npm run check` all passed
- Release directory: `20261017T000000Z-d894f59`
- Archive SHA256: `e05a94c2252febe90a7f2106fea768d76db63673729ac783ccdbf5167189ab65`
- Previous release retained for rollback:
  `/var/www/notsims/releases/20261016T222751Z-69b09c6`
- Active target:
  `/var/www/notsims/releases/20261017T000000Z-d894f59`

The archive's 163 packaged files matched their SHA256 manifest before activation.
After activation, all 164 files listed in the active release manifest, including
deployment metadata, verified with no mismatches. Nginx and Funnel configuration
were left in place; the existing route table was unchanged.

## Production checks

- [Public HTTP byte/MIME results](pr-acceptance-evidence/production/http-bytes-and-mime.json)
- [Mobile viewport results](pr-acceptance-evidence/production/mobile-browser-results.json)
- [Embodied behavior results](pr-acceptance-evidence/production/embodied-browser-results.json)
- [Audio path results](pr-acceptance-evidence/production/audio-browser-results.json)

- Public release verifier: 61 responses returned HTTP 200 with expected MIME and
  byte-identical content to the verified build.
- Mobile browser smoke: 58 scenarios across Classic/3D and seven viewport sizes;
  zero overflow, runtime-error, or mobile-target failures. Pan, pinch, and tap
  gesture checks passed.
- Embodied browser smoke: 52 Classic/3D desktop and phone-size cases passed,
  including reduced motion, with no runtime errors.
- Audio browser diagnostics: Classic and 3D passed unlock, delivery/decode,
  nonzero music/UI playback-signal, interaction, and clean-diagnostics checks.
  This headless test does not establish that a person heard audio.
- Public Notsims path and existing Funnel route table verified. Root, port 10000,
  and port 8443 responded. Port 8016 timed out externally twice after a 20-second
  wait; its mapped local upstream on port 8015 returned HTTP 200. No Funnel or
  unrelated service changes were made to investigate or repair that separate route.

Automated checks do not satisfy physical-device or human-observation criteria.
Todos 0074 and 0075 remain in progress: named desktop motion review, actual iPhone
and Android use, standalone installation, sustained thermal/performance review,
and human listening are still pending. Todo 0076 remains in progress until those
acceptance results and physical post-deploy smoke are recorded. No human result
was inferred from browser automation.
