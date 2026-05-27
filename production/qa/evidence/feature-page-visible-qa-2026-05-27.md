# Feature-Page Visible QA Evidence

**Date**: 2026-05-27
**Scope**: Godot Client Engineering feature pages
**Primary Build**: `build/windows/LuckyPackMMORPG.exe`
**Fallback Runtime**: `tools/godot-4.6.3/Godot_v4.6.3-stable_win64.exe --path godot-client`

---

## Evidence Summary

| Page | Evidence | Runtime | Status |
| --- | --- | --- | --- |
| Home | `feature-home-window-2026-05-27.png` | Windows export | PASS |
| Role | `feature-role-window-2026-05-27.png` | Windows export startup arg | PASS |
| Packs | `feature-packs-window-2026-05-27.png` | Windows export startup arg | PASS |
| Market | `feature-market-window-2026-05-27.png` | Windows export startup arg | PASS |
| Challenge | `feature-challenge-window-2026-05-27.png` | Windows export startup arg | PASS |
| Guild | `feature-guild-window-rebuilt-export-2026-05-27.png` | Rebuilt Windows export | PASS |
| System | `feature-system-window-rebuilt-export-2026-05-27.png` | Rebuilt Windows export | PASS |
| Inventory | N/A | N/A | NOT DIRECTLY NAVIGABLE |
| Skills | N/A | N/A | NOT DIRECTLY NAVIGABLE |

---

## Verified In Windows Export

- [x] Home page visible and readable.
- [x] Role page visible with role/paper-doll/equipment presentation.
- [x] Packs page visible with pack state and action area.
- [x] Market page visible with market/session/listing presentation.
- [x] Challenge page visible with challenge action cards and challenge record area.
- [x] Guild page visible with guild hall art, guild stats, guild donation, guild boss, guild shop, and guild task actions.
- [x] System page visible with system settings, graphics mode, quality, effects density, FPS mode, apply, and back actions.
- [x] No verified Windows-export feature-page screenshot exposes settlement approval, withdrawal, tax, payout, or operator-only workflows.

---

## Rebuilt Export Verification

The Windows export was rebuilt from the current `godot-client` source before re-verifying guild and system:

- Export command: Godot 4.6.3 console `--headless --export-debug "Windows Desktop"`.
- Package command: `npm.cmd run godot:package:windows`.
- Boot smoke: `build/windows/LuckyPackMMORPG.console.exe --headless --quit-after 3 -- --api-base=https://lucky-pack-api-production.up.railway.app` passed.
- Visible export evidence captured through the rebuilt `build/windows/LuckyPackMMORPG.exe` with `--page=guild` and `--page=system`.
- Window capture method: Windows `PrintWindow` by process window handle, used because normal screen-region capture was occluded by another foreground window.

---

## Notes

- The export freshness warning is resolved by the rebuilt Windows export evidence.
- Bottom navigation click-through passed in `bottom-nav-clickthrough-qa-2026-05-27.md`.
- The Godot export log emitted a non-blocking editor settings save warning for `C:/Users/User/AppData/Roaming/Godot/editor_settings-4.6.tres`; the export and boot smoke both completed successfully.

---

## Navigation Scope Note

`Main.gd` defines bottom navigation for:

- `home`
- `role`
- `packs`
- `market`
- `challenge`
- `guild`
- `system`

`inventory` and `skills` have render functions, but they are not present in `PAGE_NAMES` and were not directly reachable through supported startup args in this QA pass. They remain implementation surfaces, not verified bottom-navigation pages.

---

## QA Verdict

**Feature-page visible QA**: PASS WITH NOTES

The rebuilt Windows export renders all supported main pages verified in this pass: home, role, packs, market, challenge, guild, and system. Bottom navigation click-through is covered by the companion bottom-navigation QA evidence document.
