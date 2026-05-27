# Build Provenance: v0.1.0-rc.3 Local Candidate

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / First Godot 4.4 Package Candidate  
**Owners**: Release Manager, Technical Director, QA Lead  
**Status**: SOURCE TAG AND REMOTE CI PASS; RELEASE ATTACHMENT AND FULL RC SMOKE PENDING  

---

## Purpose

Record the first Windows package candidate built with the accepted Godot 4.4 tooling path.

This is a meaningful improvement over `v0.1.0-rc.2`, which had source/CI provenance but no Godot 4.4 package. It is still not a clean public release because the archive has not yet been attached to a GitHub Release and the full release-candidate smoke standard has not been executed from that attachment.

---

## Source State

| Field | Value |
| --- | --- |
| Repository remote URL | `https://github.com/Jimmy-xinhow/MMORPG.git` |
| Branch | `main` |
| Source commit SHA | `a9f5e126b948860cba1097f6471a7f99f9f7ecb2` |
| Source tag | `v0.1.0-rc.3` |
| Remote tag peeled commit | `a9f5e126b948860cba1097f6471a7f99f9f7ecb2` |
| Current package source state | Committed and pushed |
| Remote CI for this candidate | PASS |
| GitHub Release attachment | PENDING |

The source includes Godot 4.4 compatibility changes and updated Godot prototype validation for newly wired direct-start pages.

---

## Remote CI Evidence

| Field | Value |
| --- | --- |
| Workflow file | `.github/workflows/tests.yml` |
| Workflow name | `Tests` |
| Job | `Project check` |
| Command | `npm run check` |
| Event | `push` to `main` |
| CI run URL | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26530101562` |
| CI run timestamp | `2026-05-27T18:18:01Z` |
| CI conclusion | `success` |

Note: the current workflow triggers on `main` pushes and pull requests. It does not run a separate tag-push workflow. The `v0.1.0-rc.3` tag points to the CI-passing commit above.

---

## Tooling

| Field | Value |
| --- | --- |
| Godot executable | `tools/godot-4.4/Godot_v4.4-stable_win64_console.exe` |
| Godot version | `4.4.stable.official.4c311cbee` |
| Export templates | `tools/godot-4.4/appdata/Godot/export_templates/4.4.stable/` |
| Export preset | `Windows Desktop` |
| Export mode | Release export |
| Export output | `build/windows/BraveLegend.exe` |

---

## Commands

```powershell
$env:APPDATA=(Resolve-Path 'tools\godot-4.4\appdata').Path
.\tools\godot-4.4\Godot_v4.4-stable_win64_console.exe --headless --path godot-client --export-release "Windows Desktop" ..\build\windows\BraveLegend.exe
npm.cmd run godot:package:windows
.\build\windows\BraveLegend.exe --headless --quit-after 3 -- --api-base=https://lucky-pack-api-production.up.railway.app
npm.cmd run check
```

---

## Artifact Inventory

| Artifact | Size | SHA256 |
| --- | ---: | --- |
| `build/windows/BraveLegend.exe` | 205185456 | `2C7F8F55665E6CD737B8B07DC40761780DD9BB7752EA14FFEFA864087850F6E9` |
| `build/windows/Play-Brave-Legend-Online.cmd` | 174 | `87784997DB1BF81A7E4577C6D5AF1ADB267A85DB0A6C4C02C187E40EB63BED47` |
| `build/windows/README-INTERNAL-TEST.md` | 318 | `EAACFBA3894FC2512BA4AE3B282453EE8851A13EFB2DCFAF5CFD69D75956AA4D` |
| `release-archives/brave-legend-v0.1.0-rc.3-windows-internal.zip` | 140754371 | `403A7898258FF24F9724789B99312C6665B2B268D0C7732908FF95D007E` |

The archive contains only:

1. `BraveLegend.exe`
2. `Play-Brave-Legend-Online.cmd`
3. `README-INTERNAL-TEST.md`

Legacy `LuckyPackMMORPG` build outputs remain in `build/windows/` as historical internal debug artifacts and are not part of the RC archive.

---

## Validation Results

| Check | Result | Notes |
| --- | --- | --- |
| Godot 4.4 version check | PASS | `4.4.stable.official.4c311cbee` |
| Godot 4.4 `Main.gd` parse | PASS | `--check-only --script res://scripts/Main.gd` exited 0 |
| Godot 4.4 project load | PASS | `--headless --path godot-client --quit` exited 0 |
| Godot 4.4 Windows release export | PASS WITH WARNINGS | Export completed and produced `BraveLegend.exe` |
| Package launcher generation | PASS | `Play-Brave-Legend-Online.cmd` and README created |
| Headless boot smoke | PASS | `BraveLegend.exe --headless --quit-after 3` exited 0 |
| Project gate | PASS | `npm.cmd run check` passed with 47 tests |

---

## Export Warnings

Godot 4.4 export completed with warnings:

1. Editor help cache could not be written to `C:/Users/User/AppData/Local/Godot/editor_doc_cache-4.4.res`.
2. `rcedit` was not configured, so Windows resource metadata modification was skipped.

The second warning means file/product version string stamping is not yet clean. Before public release, either configure `rcedit` or disable `application/modify_resources` in the export preset through an accepted release decision.

---

## Current Verdict

**Local Godot 4.4 package candidate**: PASS WITH WARNINGS.

**Source-provenanced clean RC**: PARTIAL: source tag and CI pass; release attachment and full RC smoke pending.

Remaining blockers before this can become an accepted clean RC:

1. Upload the archive as a GitHub prerelease attachment or record the approved local archive exception.
2. Resolve or accept the `rcedit` metadata stamping warning.
3. Run the RC smoke standard against the archive.
4. Re-run the release gate after attachment and RC smoke evidence exist.
