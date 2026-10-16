# Architecture refactor validation

Date: 2026-10-16. Starting main SHA:
`c457d6253fdccc322f18f15769d691194d8dc555`.
Tasks 0001–0012 are implemented in dependency order. No production deployment or remote CI run was performed during this local
validation.

## Automated checks

- `npm test`: **56 passed, zero failed or skipped**. Includes existing simulation,
  Canvas, Three.js and interface suites, focused system/command/persistence tests,
  module-cycle guards and five realistic cross-system scenarios.
- `npm run build`: passes; verifies 59 reachable packaged modules, character asset,
  import map and licenses in dist/.
- `npm run check`: passes for all source and test JavaScript modules.
- `git diff --check`: passes.
- Frozen-baseline differential test checks exact state equality for all nine
  trait/career combinations across quick actions, furniture skill use, work,
  time/bills, construction, purchases/sales, tile edits and save loading.
- Trace JSON round trip, repeated scenario execution and minute/chunked time
  equivalence pass. Scenario failure output identifies the exact step and diff.
- Synthetic ordered migration tests exercise version steps without changing the
  production v1 schema. Frozen legacy work resumes with canonical pay and IDs.
- Browser interface tests verify command paths, keyboard speed/pause, panel
  switching, import rejection without overwriting storage and exported JSON.

## Browser smoke and visual review

An isolated headless installed Chrome session exercised the local packaged build
at `http://127.0.0.1:5174`. Real WebGL used Chrome software rendering. Each case
created a starter cottage and opened Live, Build, Furnish and Career panels:

| View | Viewport | Result |
| --- | --- | --- |
| Classic Canvas | 1440×1000 | Pass, no runtime errors |
| Classic Canvas | 390×844 | Pass, no runtime errors |
| Three.js | 1440×1000 | Pass, no runtime errors |
| Three.js | 390×844 | Pass, no runtime errors |

Desktop checks uploaded the frozen v1 JSON fixture through the browser file input,
accepted the native confirmation, verified the imported resident and storage,
and invoked Download Save. The interface suite independently verifies exported
Blob content and filename. Screenshots of all four view/viewport combinations
were visually inspected: cottage, character, HUD, camera controls, needs and
responsive panel layout render. Screenshots are available locally under
`/private/tmp/notsims-browser-qa/`. Failed WebGL/asset startup is covered by the
interface fallback test. The default computer-use runtime was unavailable, so
browser smoke used installed Chrome through its cached Puppeteer tooling.

## Preserved contracts and limits

Save version/storage key remain 1/v1. IDs, prices, rates, movement timing, queue
cap, legacy work load behavior and both views remain compatible. No new gameplay
or economic tuning was added. No replay/event history is stored in player saves.

Chrome viewport smoke is not physical mobile-device or cross-browser coverage.
The RNG is an explicit future-system contract; current gameplay remains
nonrandom. Production tick keeps its legacy one-day per-call cap. Existing
validation behavior for harmless extra save fields is retained. This record describes validation completed before publication.
