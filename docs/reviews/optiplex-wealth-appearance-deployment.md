# OptiPlex wealth and appearance deployment

**Deployed under the user's explicit request. Certification remains false.**

| Field | Recorded value |
| --- | --- |
| URL | https://optiplex.tailb97cdb.ts.net/notsims/ |
| Main implementation SHA | `aa541f5987240de896a2bd69ea219bf8e9432939` |
| Release ID | `20261018T012139Z-aa541f598724` |
| Activated UTC | 2026-10-18T01:21:48.358388+00:00 |
| Source clean | `true` |
| Certified | `false` |
| Save version | 5 |
| Exact merged-source CI | [https://github.com/labairj-ai/notsims/actions/runs/39086051773](https://github.com/labairj-ai/notsims/actions/runs/39086051773) — success |
| Required PR CI before merge | [39085944896](https://github.com/labairj-ai/notsims/actions/runs/39085944896) — success |
| Source PRs | [#7](https://github.com/labairj-ai/notsims/pull/7), [#8](https://github.com/labairj-ai/notsims/pull/8) — merged |
| Archive SHA-256 | `aad16b1e151092ffca9ba0744be6a47a280c894943980c019794078eddcad8a1` |
| Verified package files | 178 |
| Current | `/var/www/notsims/releases/20261018T012139Z-aa541f598724` |
| Previous / rollback | `/var/www/notsims/releases/20261017T014400Z-160e1f6` |

The user explicitly requested “deploy to optiplex” after implementation. This
supersedes the earlier wait-before-deployment instruction for this candidate;
it does not supply human visual, physical-phone, listening or motion acceptance.
No acceptance certificate was fabricated and no open human gate is closed.

## Build and activation

The exact merged source was clean before `npm ci`, 186 passing tests, complete
static build, source syntax checks and the disposable migration/ownership canary.
Exact-source CI also passed the version-2 economy contract (54 horizon cases).
Every packaged file was hashed. Archive hash, complete extracted file inventory
and every file hash were checked before activation in a new release directory.
Nginx configuration test passed; `current` switched atomically and `previous`
retains the prior release. A configuration backup is retained alongside releases.

The existing Notsims listener still uses `127.0.0.1:4601`, the full standard MIME
map, WAV and webmanifest types. GLB MIME was added on that listener only.
Nginx reloaded successfully. No Tailscale/Funnel path or other listener changed.

## Public verification

- 61 release/audio responses: HTTP 200, expected MIME and exact verified-build bytes.
- 14 character/gameplay/addon responses: exact package hashes and expected MIME,
  including the 6,143,660-byte neutral-hair GLB and its metadata.
- Home route: follows its existing redirect to HTTP 200.
- NotWWE build metadata: HTTP 200, unchanged source
  `dfcfe4cb8ee9df25db33e03a256b0d8aab51be7d`.

Raw records: [deployment](evidence/notsims-appearance-release/deployment.json),
[release/audio HTTP](evidence/notsims-appearance-release/http-release.json),
[gameplay/character HTTP](evidence/notsims-appearance-release/http-game.json),
[browser smoke](evidence/notsims-appearance-release/browser.json).

## Production browser smoke

Three isolated, disposable headless Chrome sessions passed: 3D at 1440×900,
3D at 390×844, Classic at 320×568. This is browser emulation, not physical hardware.
The actual public build reports the expected clean SHA and certified:false.
Both 3D sessions load WebGL, the GLB and creator preview. New characters retain
platinum hair/long style in save v5. Actual file-input import of the frozen v3
save migrates to v5 while preserving money, furniture, people, social state and
relationships. Funds remain $6,500 and 13 furniture items remain.

The production-imported canonical browser canary passes property switching and
furniture persistence, vehicle/Away lifecycle, one business payout per interval,
restart idempotency, management resume/completion, managed income, itemized bills
and finite net worth. It uses an explicitly funded disposable setup, never a
valued player's save. Actual panels also show valid developer Work/Away status,
Auto 24× after explicit resume/Auto selection, shopping and Assets without
horizontal document overflow. Zero JavaScript page errors were recorded.
The first smoke attempt expected Auto 24× while its fixture was still deliberately
paused; adding the missing resume/Auto test steps resolved that harness error.
No production code change or data-loss/duplicate-payout defect was required.

## Rollback and save compatibility

All earlier release directories are retained. To roll back, atomically point
`/var/www/notsims/current` to `/var/www/notsims/previous`'s target and verify public
identity afterward. Nginx still reads the same current path. Configuration backup:
`/var/www/notsims/notsims.conf.before-20261018T012139Z-aa541f598724`.

V3/v4 saves migrate to v5. Older releases cannot import v5 saves. Before rolling
back a player, export the current save and use an appropriate backed-up legacy
save; do not claim that reverting static files reverses save migration. Deployment
never opens or edits an existing player's browser storage.

## Open acceptance

0108 remains in progress: human desktop, physical iPhone/Android, earlier audio,
motion and standalone acceptance are still open where recorded. 0113 retains its
human visual gate and 0114 its mobile feedback requirement. The production
activation and headless results do not satisfy those questions.
