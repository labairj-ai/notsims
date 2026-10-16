# Mobile playability contract

Portrait phones are the primary touch layout. At widths up to 1024 CSS pixels,
the world stays mounted in a full viewport shell. Desktop retains its three
columns, mouse wheel, right drag, Q/E, R, Escape and speed shortcuts. No user
agent detection, framework, simulation changes or additional saved game fields.

The top HUD exposes funds, lowest need/mood, and Menu. Time and day remain
visible with separate Play/Pause and 1/3/8× cycle buttons. Camera controls expose
only available capabilities. Activity/progress/queue and cancellation remain
above bottom navigation. Live, Build, Furnish and Work use persistent bottom
navigation. Needs opens Live's six bars and quick actions.

Panels have collapsed, half and expanded presentation states. Their content
scrolls internally. Selecting a construction tool or furniture collapses the
panel to a tray; Rotate and Cancel remain reachable without a keyboard. Expanded
sheets retain visible world space. Short landscape windows use a side drawer.
Desktop retains the original panel model. Panels do not capture world gestures.

Live/Work: a tap issues at most one command; movement beyond 10 CSS pixels pans.
Build/Furnish: a single pointer edits, including corner-to-corner room drawing;
two pointers pan and pinch. Once any second pointer appears, all releases in
that gesture are suppressed until every pointer leaves. Cancellation clears
room previews and active input. Pinch and wheel zoom clamp to 0.6–2.8. Camera
changes are presentation only; mutations still use the existing dispatcher.

Object taps select and highlight before showing a bottom action sheet. Renderer
hits take priority. Touch fallback is bounded to 24 screen pixels, sorted by
distance, depth and stable ID, and respects available renderer occlusion checks.
Selection clears on pan, mode change, action, close, object removal or new state.
Room estimates run existing validation against a clone; actual commands remain
authoritative. Placement previews never change game state.

All mobile interactive controls have effective dimensions of at least 44×44 CSS
pixels. Primary text uses 15–17px; form inputs use 16px. Safe area insets apply on
all four sides. VisualViewport height/offset bound the shell and dialogs when
browser chrome or the keyboard changes. Core play has no document scrolling;
dialog and sheet content can scroll. No orientation lock or forced fullscreen.

The manifest uses /notsims/ identity, scope and launch path, standalone display,
PNG icons, and existing colors. Installation is optional. No service worker or
cache policy is introduced. Real Safari/Chrome installation, keyboard, safe-area,
performance and comfort checks are release certification requirements; emulator
results cannot satisfy them.
