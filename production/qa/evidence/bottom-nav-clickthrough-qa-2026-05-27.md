# Bottom Navigation Click-Through QA Evidence

**Date**: 2026-05-27
**Scope**: Godot Client Engineering bottom navigation
**Build**: `build/windows/LuckyPackMMORPG.exe`
**Method**: Windows export GUI automation using `WM_LBUTTONDOWN/UP` at Godot client coordinates

---

## Evidence Summary

| Target Page | Click Coordinates | Evidence | Status |
| --- | --- | --- | --- |
| Home | `(37, 735)` | `nav-post-home-window-2026-05-27.png` | PASS |
| Role | `(97, 735)` | `nav-post-role-window-2026-05-27.png` | PASS |
| Packs | `(156, 735)` | `nav-post-packs-window-2026-05-27.png` | PASS |
| Market | `(216, 735)` | `nav-post-market-window-2026-05-27.png` | PASS |
| Challenge | `(276, 735)` | `nav-post-challenge-window-2026-05-27.png` | PASS |
| Guild | `(335, 735)` | `nav-post-guild-window-2026-05-27.png` | PASS |
| System | `(395, 735)` | `nav-post-system-window-2026-05-27.png` | PASS |

---

## Verification Notes

- The tested window reported a 432x768 client area, matching the Godot viewport.
- Click targets were derived from `Main.gd` `NAV_RECT` and the seven evenly distributed bottom navigation buttons.
- The valid pass used direct Windows mouse messages sent to the game window handle.
- Screenshots were captured from the same game window handle with Windows `PrintWindow`.
- Each supported bottom navigation target changed to the expected player-facing page.

---

## Excluded Attempt

An earlier OS cursor based attempt produced `nav-click-*` screenshots, but those are excluded from QA evidence. The first attempt did not reliably trigger page navigation and later reported abnormal screen coordinates under the active multi-window/multi-display desktop state.

---

## QA Verdict

**Bottom navigation click-through QA**: PASS

The rebuilt Windows export allows player navigation from the bottom navigation bar to home, role, packs, market, challenge, guild, and system.
