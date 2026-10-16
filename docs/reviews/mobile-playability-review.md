# Mobile baseline review

Source: 59befeaa3ea7ffa6c7f32f66600ab66b11746ab2, 2026-10-16.
Chrome screenshots at 320×568, 390×844 and 768×1024 are in
[mobile-evidence](mobile-evidence/). The complete geometry inventory by control,
mode and size is [baseline-target-audit.json](mobile-evidence/baseline-target-audit.json).
It records every rendered button/input/select below 44px in those baseline modes.

The baseline stacks a fixed-height world above needs and tools on phones. Page
scrolling separates controls from the world. Undersized targets include camera,
speed, cancel, menu, edit character, quick actions, tabs, floor swatches, catalog
filters, rotate and panel action controls (exact dimensions in inventory).
Creator color inputs and form controls are undersized in the phone stylesheet.

Core mouse/keyboard dependencies: right-button camera pan, wheel zoom, R furniture
rotation, Escape placement cancellation, Q/E camera rotation, Space pause and
1/2/3 speed shortcuts. Existing camera buttons partially duplicate shortcuts,
but require precise taps. Object menus open under the pointer and lack bounded
touch targeting. No pointer-ID arbitration exists; a second finger can complete
an edit. Help and placement copy assume click/R/Escape. Safe areas and software
keyboard viewport changes are not accounted for.

The implementation follows [the mobile contract](../architecture/mobile-ux.md).
Physical hand comfort, touch misses and finger occlusion remain human checks.
