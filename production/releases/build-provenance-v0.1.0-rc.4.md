# Build Provenance: v0.1.0-rc.4

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / Internal RC metadata-stamping warning closure  
**Owners**: Release Manager, Technical Director, QA Lead  
**Status**: SOURCE TAG, REMOTE CI, DRAFT RELEASE ATTACHMENT, AND ARCHIVE BOOT SMOKE PASS  

---

## Purpose

Record the RC4 Windows internal package rebuilt after disabling Godot Windows resource metadata modification for internal RC exports.

This package supersedes RC3 for the `rcedit` warning track. It does not supersede the need for soak/performance/memory, store/legal/distribution, localization, crash reporting, rollback, support/on-call, owner sign-offs, or a future release-gate re-check.

---

## Source State

| Field | Value |
| --- | --- |
| Repository remote URL | `https://github.com/Jimmy-xinhow/MMORPG.git` |
| Branch | `main` |
| Source commit SHA | `9528dcaaef37bc6e48cb1c35bd7cb71ff41a294b` |
| Source tag | `v0.1.0-rc.4` |
| Source change | `godot-client/export_presets.cfg` changed `application/modify_resources=false` |
| Remote CI run | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26551524332` |
| CI conclusion | `success` |

---

## Tooling

| Field | Value |
| --- | --- |
| Clean worktree | `C:\tmp\mmorpg-rc4` |
| Godot executable | `tools/godot-4.4/Godot_v4.4-stable_win64_console.exe` |
| Godot version | `4.4.stable.official.4c311cbee` |
| Export templates | `tools/godot-4.4/appdata/Godot/export_templates/4.4.stable/` |
| Export preset | `Windows Desktop` |
| Export mode | Release export |
| Export output | `C:\tmp\mmorpg-rc4\build\windows\BraveLegend.exe` |

---

## Commands

```powershell
git tag v0.1.0-rc.4 9528dcaaef37bc6e48cb1c35bd7cb71ff41a294b
git push origin v0.1.0-rc.4
git worktree add C:\tmp\mmorpg-rc4 9528dcaaef37bc6e48cb1c35bd7cb71ff41a294b
$env:APPDATA=(Resolve-Path 'tools\godot-4.4\appdata').Path
.\tools\godot-4.4\Godot_v4.4-stable_win64_console.exe --headless --path C:\tmp\mmorpg-rc4\godot-client --export-release "Windows Desktop" C:/tmp/mmorpg-rc4/build/windows/BraveLegend.exe
powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\tmp\mmorpg-rc4\scripts\package-windows-internal-test.ps1
Compress-Archive -LiteralPath C:\tmp\mmorpg-rc4\build\windows\BraveLegend.exe,C:\tmp\mmorpg-rc4\build\windows\Play-Brave-Legend-Online.cmd,C:\tmp\mmorpg-rc4\build\windows\README-INTERNAL-TEST.md -DestinationPath release-archives\brave-legend-v0.1.0-rc.4-windows-internal.zip -Force
tmp\rc-smoke-v0.1.0-rc.4-20260528\BraveLegend.exe --headless --quit-after 3 -- --api-base=https://lucky-pack-api-production.up.railway.app
```

---

## Artifact Inventory

| Artifact | Size | SHA256 |
| --- | ---: | --- |
| `BraveLegend.exe` | 205197792 | `7F01965B9B7BFEC5DF6764E26EC2DB47AEDF981BCE8D2E5A4AF3E193C4BE1FAE` |
| `Play-Brave-Legend-Online.cmd` | 176 | `BF67B3CCF713A07C73F45830381D31022B12B754B489AB2575B738D24AEB0E63` |
| `README-INTERNAL-TEST.md` | 325 | `7136538AB0BAE49A12E2C2DE6001B9913F98EA45F9556B3FC02FC17826A09ABE` |
| `release-archives/brave-legend-v0.1.0-rc.4-windows-internal.zip` | 140767579 | `FC7B40D6A37B52896FEC4989E253E8485845798308F98D640F21795ABE9FFBAB` |

---

## Draft Release Attachment

| Field | Value |
| --- | --- |
| Release type | Draft prerelease |
| Release URL | `https://github.com/Jimmy-xinhow/MMORPG/releases/tag/untagged-96711e61e29cb79b5637` |
| Tag name | `v0.1.0-rc.4` |
| Attachment name | `brave-legend-v0.1.0-rc.4-windows-internal.zip` |
| Attachment size | 140767579 |
| Attachment digest | `sha256:fc7b40d6a37b52896fec4989e253e8485845798308f98d640f21795abe9ffbab` |

---

## Validation Results

| Check | Result | Notes |
| --- | --- | --- |
| Remote CI | PASS | GitHub Actions run `26551524332` passed. |
| Godot 4.4 Windows release export | PASS | Clean worktree export completed from commit `9528dca`. |
| `rcedit` warning | RESOLVED FOR INTERNAL RC | `application/modify_resources=false`; no `rcedit` warning appeared in RC4 export output. |
| Package launcher generation | PASS | Launcher and README generated in `C:\tmp\mmorpg-rc4\build\windows`. |
| Archive checksum | PASS | Local SHA256 matches GitHub asset digest. |
| Archive boot smoke | PASS | Extracted archive `BraveLegend.exe --headless --quit-after 3` exited 0. |

---

## Current Verdict

**Internal RC package metadata-warning track**: PASS.

RC4 closes the previous `rcedit` warning for internal RC packages by disabling Windows metadata stamping. Public launch metadata/signing remains a separate release gate and is not complete.
