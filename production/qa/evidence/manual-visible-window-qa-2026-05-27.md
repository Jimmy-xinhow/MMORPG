# Manual Visible-Window QA Evidence

**Date**: 2026-05-27
**Scope**: Godot Client Engineering visible-window smoke
**Build**: `build/windows/LuckyPackMMORPG.exe`
**Launcher Args**: `--rendering-driver opengl3 --resolution 432x768 --windowed -- --api-base=https://lucky-pack-api-production.up.railway.app`
**Evidence Images**:

- Full desktop capture: `production/qa/evidence/godot-client-visible-window-2026-05-27.png`
- Cropped game window: `production/qa/evidence/godot-client-window-crop-2026-05-27.png`

---

## Verified

- [x] Windows build launches into a visible Godot window.
- [x] Window title is visible as `Lucky Pack Idle RPG`.
- [x] The visible client uses the intended portrait game layout.
- [x] Top HUD is visible and readable at first glance.
- [x] Character stage and background scene are visible.
- [x] Enemy target is visible.
- [x] Quest/status panel is visible.
- [x] Bottom navigation is visible.
- [x] Home screen does not visibly show market rows, listing prices, settlement, withdrawal, tax, or payout workflows.

---

## Not Yet Verified

- [ ] Manual clicking through bottom navigation.
- [ ] Pack page visual state.
- [ ] Market page visual state.
- [ ] Role/equipment page visual state.
- [ ] Inventory page visual state.
- [ ] Skill page visual state.
- [ ] Challenge page visual state.
- [ ] Guild page visual state.
- [ ] System page visual state.
- [ ] Text overlap/readability across every feature page.

---

## QA Notes

This evidence reduces the prior smoke-check warning from "visible-window QA not run" to "visible-window home screen partially verified." Full manual page-by-page QA is still required before clean QA sign-off.

**Developer sign-off**: Codex, automated/visual inspection of captured home screen evidence.
**QA lead sign-off**: Pending.

