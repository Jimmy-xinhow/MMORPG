# RC3 Feature-Page Visible QA

**Date**: 2026-05-28  
**Package**: `v0.1.0-rc.3` Windows internal archive  
**Executable**: `tmp/rc-smoke-v0.1.0-rc.3-20260528/BraveLegend.exe`  
**Workflow**: CCGS `smoke-check` + `test-evidence-review` adaptation  
**Verdict**: PASS WITH NOTES  

---

## Scope

This pass reran the player-facing feature-page visibility check from the extracted RC3 archive, not from the working tree or a rebuilt local export.

Validated pages:

- `home`
- `role`
- `packs`
- `market`
- `challenge`
- `guild`
- `system`

All accepted screenshots are 432x768 client-area captures.

---

## Evidence Directory

`production/qa/evidence/rc3-visible-smoke-2026-05-28/`

Manifest:

`production/qa/evidence/rc3-visible-smoke-2026-05-28/manifest.json`

---

## Commands

```powershell
powershell.exe -ExecutionPolicy Bypass -File tmp\rc3-visible-smoke.ps1
```

The temporary capture script launches the extracted RC archive with:

```powershell
tmp\rc-smoke-v0.1.0-rc.3-20260528\BraveLegend.exe --rendering-driver opengl3 --windowed --resolution 432x768 --position 40,40 -- --api-base=https://lucky-pack-api-production.up.railway.app --page=<page>
```

The script then calibrates the Windows client area to 432x768 before capture.

---

## Page Results

| Page | Evidence | Dimensions | Result | Notes |
| --- | --- | --- | --- | --- |
| `home` | `rc3-visible-smoke-2026-05-28/rc3-feature-home-2026-05-28.png` | 432x768 | PASS | Home HUD, character stage, enemy target, quest panel, and bottom navigation are visible. |
| `role` | `rc3-visible-smoke-2026-05-28/rc3-feature-role-2026-05-28.png` | 432x768 | PASS | Character sheet, equipment slots, stats, and role actions are visible. |
| `packs` | `rc3-visible-smoke-2026-05-28/rc3-feature-packs-2026-05-28.png` | 432x768 | PASS | Pack page renders with player-safe purchase/opening presentation. |
| `market` | `rc3-visible-smoke-2026-05-28/rc3-feature-market-2026-05-28.png` | 432x768 | PASS | Trading page renders item listings and in-game GC pricing. |
| `challenge` | `rc3-visible-smoke-2026-05-28/rc3-feature-challenge-2026-05-28.png` | 432x768 | PASS | Challenge/boss page renders target, HP, rewards, and entry panels. |
| `guild` | `rc3-visible-smoke-2026-05-28/rc3-feature-guild-2026-05-28.png` | 432x768 | PASS | Guild page renders guild info, activity panels, and navigation. |
| `system` | `rc3-visible-smoke-2026-05-28/rc3-feature-system-2026-05-28.png` | 432x768 | PASS | Settings page renders controls and action buttons. |

---

## Notes

An earlier capture attempt produced invalid feature-page evidence because the Windows client area was 416x729 and foreground capture was unstable. Those files were overwritten by the corrected 432x768 rerun and are not cited as evidence.

This pass validates the RC archive visual rendering for the seven bottom-navigation pages. It does not replace soak, memory, legal/store, localization, crash-reporting, or owner sign-off requirements.
