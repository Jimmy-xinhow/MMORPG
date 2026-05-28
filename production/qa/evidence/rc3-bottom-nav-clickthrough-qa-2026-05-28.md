# RC3 Bottom-Navigation Click-Through QA

**Date**: 2026-05-28  
**Package**: `v0.1.0-rc.3` Windows internal archive  
**Executable**: `tmp/rc-smoke-v0.1.0-rc.3-20260528/BraveLegend.exe`  
**Workflow**: CCGS `smoke-check` + `test-evidence-review` adaptation  
**Verdict**: PASS  

---

## Scope

This pass validates bottom-navigation click-through behavior from the extracted RC3 archive. The client was launched at the home page, then each bottom-navigation target was clicked and captured after navigation.

Accepted evidence uses `rc3-nav-post-*` screenshots only.

---

## Evidence Directory

`production/qa/evidence/rc3-visible-smoke-2026-05-28/`

Manifest:

`production/qa/evidence/rc3-visible-smoke-2026-05-28/manifest.json`

---

## Click Coordinates

The capture script calibrated the game client to 432x768 and clicked these client-area coordinates:

| Target | X | Y |
| --- | ---: | ---: |
| `home` | 37 | 735 |
| `role` | 97 | 735 |
| `packs` | 156 | 735 |
| `market` | 216 | 735 |
| `challenge` | 276 | 735 |
| `guild` | 335 | 735 |
| `system` | 395 | 735 |

---

## Results

| Target | Evidence | Dimensions | Result | Notes |
| --- | --- | --- | --- | --- |
| `home` | `rc3-visible-smoke-2026-05-28/rc3-nav-post-home-2026-05-28.png` | 432x768 | PASS | Home tab remains reachable. |
| `role` | `rc3-visible-smoke-2026-05-28/rc3-nav-post-role-2026-05-28.png` | 432x768 | PASS | Role tab opens the character page. |
| `packs` | `rc3-visible-smoke-2026-05-28/rc3-nav-post-packs-2026-05-28.png` | 432x768 | PASS | Pack tab opens the pack page. |
| `market` | `rc3-visible-smoke-2026-05-28/rc3-nav-post-market-2026-05-28.png` | 432x768 | PASS | Market tab opens the trading page. |
| `challenge` | `rc3-visible-smoke-2026-05-28/rc3-nav-post-challenge-2026-05-28.png` | 432x768 | PASS | Challenge tab opens the challenge page. |
| `guild` | `rc3-visible-smoke-2026-05-28/rc3-nav-post-guild-2026-05-28.png` | 432x768 | PASS | Guild tab opens the guild page. |
| `system` | `rc3-visible-smoke-2026-05-28/rc3-nav-post-system-2026-05-28.png` | 432x768 | PASS | System tab opens the settings page. |

---

## Notes

The first automation attempt used logical 432x768 coordinates against a 416x729 Windows client area, so bottom-nav clicks landed outside the client and stayed on home. That attempt was discarded. The accepted evidence comes from the rerun after client-area calibration to 432x768.

No crash, hang, or stuck navigation state was observed, and no `BraveLegend`, `Godot`, or `LuckyPack` process remained after the capture script exited.
