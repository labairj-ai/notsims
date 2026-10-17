# Wealth browser and property acceptance

**Not performed. This is a review protocol, not an acceptance result.**

Use the final candidate build and record its SHA, tester/date, browser/OS and
viewport. Repeat the affected checks if code changes. Test desktop keyboard/mouse,
then actual iPhone Safari and Android Chrome in portrait/landscape and installed
mode where supported. Existing audio, motion and standalone matrices still apply.

## Disposable setup

Export a backup of any valued save first. Use a separate browser profile/origin
or otherwise isolated storage. Through Menu → Import load
[evidence/wealth-acceptance-disposable-v5.json](evidence/wealth-acceptance-disposable-v5.json).
It is a clearly named test household, funded only for acceptance, with an intact
starter home, Developer career at Monday 09:00, empty cabin/condo/penthouse, café,
used car and yacht. No production/player save is edited by preparing this file.
The fixture was generated through the public purchase/job commands, validated,
and round-tripped; that is preparation evidence only.

## Three-property sequence — highest priority

1. At the starter home, note the bed, sofa and other existing furniture. Pause.
2. Furnish → Assets → Vacation cabin → Move here. Verify the cabin/porch layout
   replaces the starter lot and no previous furniture remains selected.
3. Place a folding chair on a clear cabin tile. Note its location and appearance.
4. Assets → City condo → Move here. Verify the different city layout. Place a
   basic lamp on a clear tile; use a different tile/location from the cabin chair.
5. Save, reload the page, and resume that save through the normal UI.
6. Move to Starter home and verify its original furnishings and layout visually.
7. Move to Cabin and verify only its added chair, in the original cabin position.
8. Move to Condo and verify only its added lamp, in the original condo position.
9. Repeat the switch cycle, rotate the view where supported, then reload again.
   Check picking, selection tray, scroll position, money, asset names and bills.
10. Attempt selling the primary home and a furnished secondary home. Verify clear
    rejection. Clear only the disposable property's furnishings before a sale;
    verify other homes, furniture and costs remain unchanged.

Repeat on desktop and at least one physical phone; 0085/0102 additionally require
both named phone platforms. Do not infer visual success from backend IDs/tests.

## Browser matrix

| Flow | Expected observation | Result / defects |
| --- | --- | --- |
| Furnish categories, tiers, Affordable, Need, Shared, Owned | Correct subset, clear empty state, usable controls | Pending |
| Select/compare furniture, rotate/cancel | Correct current/new names, price and upkeep; no stale selection after move | Pending |
| Assets categories and long lists | Readable cards, normal scrolling, no horizontal overflow | Pending |
| Wishlist add/remove and reload | Correct saved items and amounts | Pending |
| Career schedule and promotion blockers | Readable levels/requirements; correct job offer rate | Pending |
| Scheduled Work + strategies + choice | Auto/manual/pause controls visible; attention choice usable | Pending |
| Car selection + destination | Owned car selected; elapsed travel visible; money charged once | Pending |
| Cabin/condo/penthouse switching | Distinct visual lots and independent furnishings after reload | Pending |
| Café management and reload | Correct duration/cadence, one completion, no duplicate payout | Pending |
| Bill breakdown and net worth | Itemized, legible, consistent after purchase/sale | Pending |
| Yacht outing with available friend | Cost/time shown, completes once, one canonical social memory | Pending |
| Resize desktop and narrow viewport | Panels/modals remain reachable; no clipped controls or overflow | Pending |
| Keyboard and mouse | Tab/focus/select/activation work; game shortcuts do not hijack inputs | Pending |

## Actual physical-device observations

For each phone record device/model, OS/browser version, candidate SHA, tester/date,
portrait/landscape, browser/installed mode, touch comfort/missed taps, scrolling,
modals, comparisons, asset actions, property persistence, background/resume and
thermal/performance observations. Run the Work/Away scenarios in
[away-activity-work-validation.md](away-activity-work-validation.md), including
manual/Auto, bathroom/lunch, conflicts, early leave, second shift and save/reload.

Record actual human motion/audio/standalone observations in the existing
[human acceptance matrix](mobile-social-human-acceptance.md). Signal levels,
synthetic input, desktop phone-size viewports and successful DOM tests do not
supply those results.

## After acceptance

Record the accepted SHA and defects/resolutions. Run final exact-head CI and the
wealth canary. Only after every blocking gate passes, remove draft status, merge
through protected main, deploy the exact merge atomically and record production
smoke/rollback identity under [the release gate](wealth-release-validation.md).
