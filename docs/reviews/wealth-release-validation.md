# Wealth release gate — 0108

**Status: DEPLOYED, NOT CERTIFIED.** User explicitly requested deployment after implementation. PRs #7/#8 are merged; clean main source `aa541f5987240de896a2bd69ea219bf8e9432939` is live. Human/device acceptance remains open. See [deployment evidence](optiplex-wealth-appearance-deployment.md). The earlier preparation and gate records below are historical and do not override this observed activation.

Candidate source is the final PR head, verified by GitHub's required `build` job.
The exact SHA and code fingerprint are recorded by the uploaded wealth-canary
artifact; a dirty local result is explicitly labelled as such. This record does
not identify an uncommitted local test as an accepted release candidate.

| Requirement | Evidence/status |
| --- | --- |
| 0104 canonical simulator | Implemented; production command/Away completion tests |
| 0105 versioned balance gates | v2 contract and 54 deterministic horizon runs |
| 0106 performance progression | Content levels, bounded wages, explicit v4→v5 migration |
| 0107 premium identity | Distinct templates, trips, social outing and management cadence |
| Required exact-head CI | GitHub `build`; check final PR head before release |
| v3→v4→v5 and v4→v5 migration canaries | Automated fixtures preserve state and earned wages; repeated v5 reload is idempotent. Candidate-browser execution remains required |
| Ownership/payout restart canary | Automated disposable save; one payout per interval |
| Browser/desktop visual acceptance | Pending; Computer Use has no browser/Chrome window |
| 0102 mobile shopping acceptance | Pending real browser/touch observations |
| 0085 physical Work/Away acceptance | Pending iPhone Safari and Android Chrome |
| Earlier motion/audio/standalone gates | Still open where recorded in existing matrices |
| Accepted candidate SHA and tester sign-off | Pending human/device acceptance |
| Protected merge SHA | `aa541f5987240de896a2bd69ea219bf8e9432939` |
| Exact deployed SHA/release ID/target/timestamp | Recorded in deployment evidence; `20261018T012139Z-aa541f598724` |
| Production post-deploy browser/device smoke | Three automated browser sessions passed; physical-device smoke remains open |

## Human evidence to record

For each source revision: tester/date, device/model, OS/browser version, browser
and installed mode, portrait/landscape, keyboard/mouse or touch. Record filters,
affordability/comparison, Assets categories, wishlist, career promotion blockers,
Away controls, property switches, business management, bills, long-list scrolling,
overflow, background/resume and thermal/performance observations. Preserve the
existing human motion/audio/standalone requirements, with actual observations.
A new code revision affecting reviewed behavior requires the affected checks again.

## Automated candidate canary

Run `npm run canary:wealth` against the final clean checkout. It loads the frozen
production-compatible v3 fixture, migrates through v4 to v5 once, preserves funds,
furnishings and social state, and checks repeated v5 serialize/reload. The full
automated suite also loads the frozen v4 active-work fixture directly into v5,
preserving its quoted wage and checking repeated v5 reload idempotency. A separate
funded disposable save buys/selects/sells transport, completes a destination,
switches a second residence with furniture, receives a payout, reloads, resumes
management, checks the next managed payout, bills and net worth.

This prepares the production sequence, but actual candidate-browser and post-deploy
observations must be recorded separately. Do not manually edit a production save.

## Release procedure after all gates pass

Record the accepted head SHA, remove draft status, require the actual protected
`build` check on that exact candidate, and merge without bypassing branch
protection. Build/test the exact merged SHA in a clean checkout, then use the
existing atomic-release procedure in `deploy/README.md`. Record release ID,
target, timestamp and content/source hashes. Preserve the rollback release.

Verify production load/new game/existing save, valid scheduled Work, Away controls,
shopping/Assets, property persistence, one business payout across reload, bills
and mobile usability. If save loss, destructive property behavior or duplicate
payout occurs, stop rollout and use the documented rollback process. 0108 remains
open until actual deployment and all required observations are recorded.

## Acceptance-only review update

The [latest review](https://chatgpt.com/s/t_6ad2e0fe8c6481918f279ce5497e12e4) confirms 0104–0107 complete and requests no new economy features. TODO 0108 now explicitly requires both migration paths and idempotent v5 reloads. Implementation head `f2e47fc505e550a8d87781110d9d4468a7e7bfc0` passed [CI 38995760858](https://github.com/labairj-ai/notsims/actions/runs/38995760858); this is historical software validation, not human sign-off.

A fresh Computer Use check still found no browser sessions. Selecting both Chrome and Safari returned `cgWindowNotFound`. Desktop acceptance cannot be recorded from that environment. Physical iPhone/Android, motion, audible-output and standalone observations remain absent.

The [acceptance walkthrough](wealth-browser-acceptance.md) includes a disposable v5 save and the required three-property sequence. It prepares review; it does not claim that anyone performed it. Preserve the prior acceptance matrix and deployment/rollback procedure.
