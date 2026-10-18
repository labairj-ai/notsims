# 0114 — Verify Appearance Persistence, Renderer Parity, and Mobile Creator Feedback

- **ID:** 0114
- **Status:** open
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

- [ ] creator preview updates live.
- [ ] live 3D character matches persisted selection.
- [ ] Classic remains semantically consistent.
- [ ] save/reload works.
- [ ] export/import works.
- [ ] player/NPC material isolation passes.
- [ ] repeated color changes do not reload the character asset.
- [ ] mobile creator feedback is acceptable.

## Imported source and repository mapping

Imported from the [shared character appearance plan](https://chatgpt.com/s/t_6ad4192ee5948191bde12dc7f5b1660f) on 2026-10-17. Source task 0109 is repository task 0114. Source IDs 0104–0108 already belong to the wealth follow-up; all six appearance tasks are shifted by five and internal dependencies are remapped consistently. Existing tasks and acceptance gates are unchanged.

This task is planning-only. Source defect descriptions are review findings to verify against the implementation before changing code. No asset regeneration, runtime fix, rendered review, human/device acceptance or deployment is claimed by this import.

Keep browser viewport checks at 320/390/430 px separate from any actual physical-phone observations. Neither CI nor fixture tests establish physical usability or human visual acceptance.
