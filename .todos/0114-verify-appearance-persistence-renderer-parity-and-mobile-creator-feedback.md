# 0114 — Verify Appearance Persistence, Renderer Parity, and Mobile Creator Feedback

- **ID:** 0114
- **Status:** in_progress
- **Priority:** high
- **Depends:** 0113

## Goal

Verify the fixed appearance system across the complete player lifecycle.

## Required lifecycle

Test:

```text
Open creator
→ choose hair style
→ choose hair color
→ preview changes immediately
→ create character
→ live character matches
→ edit character
→ change hair color
→ live character updates
→ save
→ reload
→ appearance remains
→ export save
→ import save
→ appearance remains
```

## Persistence

Verify saved state contains only semantic values such as:

```js
person: {
  hair: "#d9b27c",
  style: "long"
}
```

Do not persist material, texture, or renderer state.

## Renderer parity

Compare:

```text
Classic
3D
Creator preview
```

They do not need pixel-identical lighting.

They do need semantic parity.

Example:

```text
blonde should visibly read as blonde in all three
```

## Visitor/NPC isolation

Verify:

- player customization never recolors an NPC;
- one NPC appearance never recolors another;
- switching player hairstyle does not change visitor visibility.

## Mobile

Physical or browser-device testing should include:

```text
320 px
390 px
430 px
```

Check:

- color input is usable;
- changing color gives obvious feedback;
- preview remains visible;
- no redraw lag;
- style/color selection does not overflow the creator;
- closing/reopening creator preserves selected values.

A physical mobile check is strongly preferred because this is direct visual-feedback UI.

## Performance

Repeated color-input events must not:

- reload the GLB;
- recreate the skeleton;
- recreate the renderer;
- continuously allocate new materials.

Only existing material color state should update.

## Done when

- [x] creator preview updates live.
- [x] live 3D character matches persisted selection.
- [x] Classic remains semantically consistent.
- [x] save/reload works.
- [x] export/import works.
- [x] player/NPC material isolation passes.
- [x] repeated color changes do not reload the character asset.
- [ ] mobile creator feedback is acceptable.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0109 is repository task 0114. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

The original import was planning-only. Implementation and evidence are recorded below; no human/device certification or deployment is inferred from automated checks.

Keep browser viewport checks at 320/390/430 px separate from any actual physical-phone observations. Neither CI nor fixture tests establish physical usability or human visual acceptance.

## Implementation evidence

Implementation `769d4373b71967e0cc4edc5c925f98472d562236`; character GLB `a142f9433ce6c5e24510543fe245254b551665d74e28a06c9a35c1af5276d7a4`. See [appearance validation](../docs/reviews/character-appearance-validation.md), browser/asset evidence and [authoring contract](../docs/architecture/character-appearance.md). 186 tests, full build/source checks, wealth canary and economy gates pass. All 18 creator, 36 live day/night and six browser lifecycle cases captured. Human visual and physical/mobile feedback remain open, explicitly retained in 0113/0114. No deployment claimed.
