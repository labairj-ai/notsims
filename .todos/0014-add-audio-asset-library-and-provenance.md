# Add Audio Asset Library and Provenance Contract

- **ID:** 0014
- **Status:** complete
- **Created:** 2026-10-16
- **Priority:** high
- **Depends:** 0013

## Problem

Music and sound effects will quickly become some of the largest and most licensing-sensitive files in the project. Notsims needs an explicit asset layout, source/provenance record and web-delivery budget before third-party audio is committed.

## Proposed approach

- Prefer CC0/public-domain audio for the first implementation.
- Add a canonical asset layout:
  - `assets/audio/music/`
  - `assets/audio/sfx/ui/`
  - `assets/audio/sfx/foley/`
  - `assets/audio/sfx/interactions/`
  - `assets/audio/sfx/build/`
  - `assets/audio/ambience/`
- Add `assets/audio/README.md` and `assets/audio/LICENSES.md`.
- For every imported file record original title, author/uploader, source URL, license, download date, original filename, local filename, modifications and optional attribution text.
- Keep original high-quality masters out of the production bundle when a smaller web-ready derivative is sufficient.
- Prefer OGG/MP3 for music and compact WAV/MP3 for short one-shots based on browser compatibility tests.
- Add a build-time asset manifest containing cue ID -> local source(s), duration/size when available, and license/source metadata.
- Establish an initial budget target for first-load and total audio payload.

## Initial candidate sources

- OpenGameArt CC0 music: Cozy Puzzle Title, Cozy Puzzle In-Game 1, Cozy Puzzle In-Game 3, Feel Good Slow Ambient, Sims Type-Beat.
- Kenney CC0: Interface Sounds, UI Audio, RPG Audio, Impact Sounds, Music Jingles.
- OpenGameArt CC0: General Household Sound Effects and 100 CC0 SFX.

## Implementation guardrails

- Do not hotlink third-party audio at runtime. Ship local copies with the game.
- Do not import assets whose license is unclear or whose page conflicts with the downloadable archive license.
- CC-BY/CC-BY-SA assets require an explicit decision and attribution flow; default to CC0 for this phase.
- Keep provenance even when attribution is optional.
- Do not commit a full multi-hundred-megabyte pack when only a few cues are used.
- Preserve the existing asset licensing discipline used for the character model.

## Done when

- [x] Audio directories and provenance documents exist.
- [x] Every committed third-party audio file has a provenance entry.
- [x] Initial music and SFX candidates are narrowed to a small production set.
- [x] Production bundle does not contain unused source-pack files.
- [x] Build can resolve every configured cue to a local asset.
- [x] Missing/invalid asset references fail CI with a useful message.

## QA requirements

- [x] CI validates referenced files exist and cue IDs are unique.
- [x] CI reports total audio bundle size.
- [x] Browser smoke tests verify chosen production formats load on supported desktop/mobile browsers.
- [x] `npm test` and `npm run build` pass.

## Source

Created from the 2026-10-16 post-architecture review for the Notsims audio expansion.

## Completion evidence

Implemented in `/Users/ai_lab/notsims`. See the [audio acceptance record](../docs/reviews/audio-validation.md)
for the test/browser matrix, budgets, provenance and coverage limits.
