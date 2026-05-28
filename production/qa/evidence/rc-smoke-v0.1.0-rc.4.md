# RC Smoke Evidence: v0.1.0-rc.4

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / `rcedit` warning closure  
**CCGS Workflows**: `smoke-check`, Godot export workflow, release artifact policy adaptation  
**Package Class**: Internal Windows release-candidate package  
**Verdict**: PASS WITH WARNINGS  

---

## Scope

This smoke pass validates the RC4 package built from clean source commit `9528dcaaef37bc6e48cb1c35bd7cb71ff41a294b`.

RC4 exists to close the internal RC `rcedit` warning by disabling Godot Windows resource metadata modification. It does not rerun the full visible-window RC smoke from RC3; the latest full visual/navigation/restricted-workflow evidence remains:

- `production/qa/evidence/rc-smoke-v0.1.0-rc.3.md`
- `production/qa/evidence/rc3-feature-page-visible-qa-2026-05-28.md`
- `production/qa/evidence/rc3-bottom-nav-clickthrough-qa-2026-05-28.md`
- `production/qa/evidence/rc3-restricted-workflow-player-visible-review-2026-05-28.md`

---

## Source And CI

| Field | Value |
| --- | --- |
| Repository | `https://github.com/Jimmy-xinhow/MMORPG.git` |
| Branch | `main` |
| RC source commit | `9528dcaaef37bc6e48cb1c35bd7cb71ff41a294b` |
| RC source tag | `v0.1.0-rc.4` |
| Remote CI run | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26551524332` |
| CI conclusion | PASS |

---

## Release Attachment

| Field | Value |
| --- | --- |
| Release type | Draft prerelease |
| Release URL | `https://github.com/Jimmy-xinhow/MMORPG/releases/tag/untagged-96711e61e29cb79b5637` |
| Tag name | `v0.1.0-rc.4` |
| Attachment | `brave-legend-v0.1.0-rc.4-windows-internal.zip` |
| Attachment size | 140767579 |
| Attachment digest | `sha256:fc7b40d6a37b52896fec4989e253e8485845798308f98d640f21795abe9ffbab` |

---

## Archive Extraction

| Field | Value |
| --- | --- |
| Local archive | `release-archives/brave-legend-v0.1.0-rc.4-windows-internal.zip` |
| Local archive SHA256 | `FC7B40D6A37B52896FEC4989E253E8485845798308F98D640F21795ABE9FFBAB` |
| Extraction path | `tmp/rc-smoke-v0.1.0-rc.4-20260528/` |

Extracted contents:

| Artifact | Size | SHA256 |
| --- | ---: | --- |
| `BraveLegend.exe` | 205197792 | `7F01965B9B7BFEC5DF6764E26EC2DB47AEDF981BCE8D2E5A4AF3E193C4BE1FAE` |
| `Play-Brave-Legend-Online.cmd` | 176 | `BF67B3CCF713A07C73F45830381D31022B12B754B489AB2575B738D24AEB0E63` |
| `README-INTERNAL-TEST.md` | 325 | `7136538AB0BAE49A12E2C2DE6001B9913F98EA45F9556B3FC02FC17826A09ABE` |

---

## Commands Run

```powershell
git worktree add C:\tmp\mmorpg-rc4 9528dcaaef37bc6e48cb1c35bd7cb71ff41a294b
.\tools\godot-4.4\Godot_v4.4-stable_win64_console.exe --headless --path C:\tmp\mmorpg-rc4\godot-client --export-release "Windows Desktop" C:/tmp/mmorpg-rc4/build/windows/BraveLegend.exe
powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\tmp\mmorpg-rc4\scripts\package-windows-internal-test.ps1
Expand-Archive -LiteralPath release-archives\brave-legend-v0.1.0-rc.4-windows-internal.zip -DestinationPath tmp\rc-smoke-v0.1.0-rc.4-20260528 -Force
tmp\rc-smoke-v0.1.0-rc.4-20260528\BraveLegend.exe --headless --quit-after 3 -- --api-base=https://lucky-pack-api-production.up.railway.app
```

---

## Check Results

| Check | Result | Notes |
| --- | --- | --- |
| Remote CI gate | PASS | CI run `26551524332` passed for the RC4 source commit. |
| Clean worktree export | PASS | Export ran from `C:\tmp\mmorpg-rc4`, not from the dirty primary workspace. |
| `rcedit` warning | PASS | `application/modify_resources=false`; RC4 export did not emit the prior `rcedit` warning. |
| Archive checksum | PASS | GitHub asset digest and local SHA256 match. |
| Boot stability | PASS | Extracted `BraveLegend.exe` exited 0 under headless `--quit-after 3`. |

---

## Known Warnings

1. RC4 did not rerun visible-window feature-page and bottom-navigation screenshots; RC3 remains the latest full visual RC smoke evidence.
2. Windows file/product metadata is not stamped for internal RC exports.
3. Public release metadata/signing remains unresolved.
4. Soak/performance/memory execution evidence is still pending.
5. Store/legal/distribution, localization, crash reporting, rollback, support, and on-call owner decisions remain pending.

---

## Verdict

**RC4 metadata-warning closure**: PASS.

**Overall release readiness**: PASS WITH WARNINGS for internal RC package validation; clean public release remains NO-GO until remaining release readiness gates are resolved.
