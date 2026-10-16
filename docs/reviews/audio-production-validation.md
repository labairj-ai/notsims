# Production audio validation — task 0021

Date: 2026-10-16. **In progress: corrective deployment and human listening pending.**

## Confirmed causes

1. **Deployment drift caused the initial silence.** GitHub main was
   d392f66581de3daa7c39d9a16e869655d3bb12be, but /var/www/notsims/current resolved
   to releases/c457d62 (2026-10-15). Its public HTML had no Audio settings menu,
   and that release had no audio asset tree. GitHub CI success did not deploy it.
2. The isolated Nginx listener had no WAV mapping: WAV responses were HTTP 200
   application/octet-stream. Its standard mime.types omitted wav. The listener
   now includes the full standard type map plus audio/wav. No route or Funnel
   mapping changed. nginx -t passed before reload; JS MIME delivery is preserved.
3. The stricter live-browser certification found a real implementation defect:
   music crossfades logged `{where: music, message: Illegal invocation}`. Default
   setTimeout/clearTimeout were stored then invoked as MusicDirector methods,
   passing the wrong receiver to browser globals. Receiver-safe wrappers correct
   this without changing architecture, simulation, saves, taxonomy or assets.
   A regression test reproduces receiver-checked globals; d392f66 fails it.

## Initial clean deployment

An isolated detached checkout at /private/tmp/notsims-production-0021 was clean
at d392f66581de3daa7c39d9a16e869655d3bb12be. npm ci succeeded; 75 tests, build and
syntax checks passed. Its existing GitHub CI run was successful:
https://github.com/labairj-ai/notsims/actions/runs/38937927303.

The entire dist was packaged, and 121 file checksums verified on OptiPlex before
atomic switch. Initial audio release: /var/www/notsims/releases/20261016T181217Z-d392f66.
Deployment timestamp: 2026-10-16T18:15:38.883233+00:00. Previous release c457d62
remains available. Nginx backup: releases/c457d62/nginx-before-0021.conf.

After correcting MIME delivery, 51 public requests (all 35 audio files, audio
modules, settings UI and metadata) were HTTP 200, correct MIME, and byte-identical
to the clean build. MP3 was audio/mpeg and WAV audio/wav. All four classic/3D,
desktop/mobile-emulated smoke cases passed actual unlock, decoding, music,
loop cancellation, mute/settings and teardown. Desktop hidden/resume and forced
failure tests passed. The stricter certification correctly withheld acceptance
because of the music timer diagnostic; a clean corrective release is required.

## Remaining certification

Record the corrective SHA, successful CI, clean-source build, final release path,
symlink and timestamp, exact production debug and signal reports, asset evidence,
and independent human listening/browser/device. Do not infer a human result from
headless tests. Real mobile testing is conditional on device availability; mobile
viewport emulation must be labelled as such.
