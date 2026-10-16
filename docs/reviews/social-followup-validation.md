# Social follow-up validation: 0047–0053

Implementation covers initiative attribution, canonical effects, discovery and
arrival gates, visit cooldowns, contextual recommendations, repetition/memories,
focused modules, social audio and five shared furniture activities.

0052 is in progress: the physical-device, installed-mode and human listening
results are pending in [human acceptance](mobile-social-human-acceptance.md).
The same human acceptance requirements remain open for 0048, 0051 and 0053.
No automated browser result is represented as physical or audible acceptance.

## Automated evidence

- Unit/integration suite covers incoming ownership, unanswered offers, discovery,
  waiting visitor rejection, cooldown boundary/save/load, canonical autonomy,
  query purity and ranking, fatigue/variety, memory coalescing and v2 migration.
- Shared-activity tests cover sit/watch/eat/cook/read, two-participant reservation,
  approach before effects, neutral pose queries, separate need/relationship
  effects, meaningful/awkward outcomes, cancellation, guest departure, changed
  paths, missing objects, atomic failure and safe save/load cancellation.
- Shared deterministic scenario replays identical facts and final state.
- Extraction fixtures were captured after correctness/variety changes and passed
  unchanged immediately after extraction. The permanent hash test compares all
  original state/facts/trace, excluding only later additive audio correlation
  fields (`eventKind`, offered-visit `visitId`). The cycle/dependency test passes.
- Audio tests cover all semantic mappings, visitor deduplication, bounded ring
  response/expiry/reset/hide/mute lifecycle, disabled-audio state parity, provenance
  and payload limits. Four original local CC0 WAVs are reproducible via
  `scripts/generate-social-audio.py`. The main generator restores the extension.
- Existing frozen economic/home/needs baseline, mobile gesture safety and
  migration tests remain in place. Friendship/conflict progression intentionally
  uses varied interactions over meaningful time instead of repeated grinding.

## Browser acceptance

`scripts/social-scenarios.mjs` covers Classic and Three at 320, 390, 430 and
1440px: concise primary actions, explicit channel choice, phone/text/invitation,
visitor selection, large controls, no document overflow and clean diagnostics.

`scripts/shared-scenarios.mjs` covers five activities in both renderers at phone
and desktop sizes. It starts activities through UI, checks visible coordination
and model clips, verifies completion and decodes all four social audio assets.
Screenshots are inspected for shared positions and the contextual sheet.

Two browser findings were corrected: asynchronous sheet refresh could detach
controls during clicks, so static header/navigation remain stable and explicit
renders synchronize the refresh signature; expanded history/catalog is collapsed
by default so conversation recommendations appear near the top of the sheet.

## Limits and certification

The full implementation was requested together. Shared activities are available
for evaluation; this does not claim the 0052 physical release-readiness gate has
passed. Record actual devices, exact deployed SHA, OS/browser and audio output
before certifying those tasks. Existing certification records remain traceable.

## Local verification results

- 122 tests pass; build and source checks pass.
- Audio bundle: 2,089,488 bytes, below the 2 MiB warning budget; essential
  preload remains 51,816 bytes; estimated decoded SFX 4,899,841 bytes.
- 97 bundled JS modules, character asset, manifest/icons and licenses verified.
- [Layout results](social-followup-evidence/layout-results.json): 56 clean
  renderer/viewport/mode cases plus retained touch gesture checks.
- Social UI scenarios: 8 passing renderer/viewport cases.
- [Shared results](social-followup-evidence/shared-results.json): 20 passing
  activity/renderer/viewport combinations, plus all four social WAVs decoded.
- Screenshots: [Classic phone](social-followup-evidence/classic-390.png),
  [Three phone](social-followup-evidence/3d-390.png),
  [Classic shared sit](social-followup-evidence/classic-390-shared_sit.png),
  [Three shared sit](social-followup-evidence/3d-390-shared_sit.png).
- Repeated QA game resets exposed an expected media-play cancellation being
  logged as failure. Intentional stopped/disposed media now resolves false; real
  playback failures still reject. A regression test covers both cases.
