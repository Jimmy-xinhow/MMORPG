# Build Provenance: v0.1.0-rc.2

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / Build Provenance  
**Owners**: Release Manager, Technical Director, QA Lead  
**Status**: Source and CI provenance captured; clean RC package not ready  

---

## Purpose

Record the source-control, CI, local validation, Godot version, artifact, and warning evidence for `v0.1.0-rc.2`.

This file does not claim that the current Windows files are a clean release candidate package. It records that `v0.1.0-rc.2` is the first source tag with passing remote CI, while the existing Windows files remain internal debug artifacts until the remaining release artifact policy requirements are resolved.

---

## Source Provenance

| Field | Value |
| --- | --- |
| Repository remote URL | `https://github.com/Jimmy-xinhow/MMORPG.git` |
| Branch | `main` |
| Source commit SHA | `56d8c36a43f7099a3678cee4273c3313883dbdfe` |
| Source tag | `v0.1.0-rc.2` |
| Commit timestamp | `2026-05-28T01:09:51+08:00` |
| Package version | `0.1.0` |
| Godot file version | `0.1.0.0` |
| Godot product version | `0.1.0.0` |
| Documentation commit after evidence capture | `d336f4d27ac53efee8356436578316cc4cb82bd9` |

`v0.1.0-rc.1` remains preserved as failed CI evidence and was not moved.

---

## Remote CI Evidence

| Field | Value |
| --- | --- |
| Workflow file | `.github/workflows/tests.yml` |
| Workflow name | `Tests` |
| Job | `Project check` |
| Command | `npm run check` |
| Node version | `20` |
| CI run URL | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526574962` |
| CI run timestamp | `2026-05-27T17:10:10Z` |
| CI conclusion | `success` |

Additional branch-tip verification after evidence documentation:

| Field | Value |
| --- | --- |
| Commit | `d336f4d27ac53efee8356436578316cc4cb82bd9` |
| Run URL | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526726173` |
| Conclusion | `success` |

---

## Local Validation Evidence

| Command | Result | Notes |
| --- | --- | --- |
| `npm.cmd run check` | PASS | 47 tests passed; UI, API, and production smoke passed. |
| `CI=true; GITHUB_ACTIONS=true; npm.cmd run check` | PASS | Local simulation confirmed the CI artifact-policy branch of `scripts/validate-goal-seven.mjs`. |
| Windows export boot smoke | PASS WITH WARNINGS | Recorded in `production/qa/smoke-2026-05-27.md`; used local Godot 4.6.3 internal-test exception. |

---

## Godot Version Evidence

| Field | Value |
| --- | --- |
| Target engine version | Godot 4.4 |
| Target source | `.claude/docs/technical-preferences.md`, `docs/engine-reference/godot/VERSION.md`, `godot-client/project.godot` |
| Local executable used for current internal artifacts | `tools/godot-4.6.3/Godot_v4.6.3-stable_win64_console.exe` |
| Local executable version | `4.6.3.stable.official.7d41c59c4` |
| Version strategy status | ADR-0002 is Accepted |
| Clean RC effect | BLOCKED until Godot 4.4 tooling is provisioned and clean RC evidence exists |

---

## Export And Package Evidence

| Field | Value |
| --- | --- |
| Export preset | `Windows Desktop` |
| Export preset path | `godot-client/export_presets.cfg` |
| Export preset output path | `../build/windows/BraveLegend.exe` |
| Current internal executable path | `build/windows/LuckyPackMMORPG.exe` |
| Current launcher path | `build/windows/Play-Lucky-Pack-Online.cmd` |
| Export mode currently evidenced | Debug/internal package |
| Release archive path or release URL | NOT SELECTED |
| Artifact storage policy | Generated Windows build outputs are not committed to git by default |

The export preset, package script, and current internal artifact names are inconsistent. This blocks clean RC package acceptance until owners choose and apply one naming convention.

---

## Current Artifact Inventory

These files are current internal debug package artifacts. They are useful for owner review and internal QA, but they are not yet a clean RC archive rebuilt or revalidated under an accepted release version strategy.

| Artifact | Size | Last Write Time | SHA256 |
| --- | ---: | --- | --- |
| `build/windows/LuckyPackMMORPG.exe` | 150822944 | 2026-05-27 13:49:49 | `E9BE81D56241FEF4C0246A2DF2AF4A7A933B6C1FC294078F144A586E5D891784` |
| `build/windows/LuckyPackMMORPG.console.exe` | 50176 | 2026-05-27 13:49:49 | `7D0BD8DC6A58114ADE78C3C7A842DCEA8BE16276BB9F59F5FD822A8159F17E65` |
| `build/windows/Play-Lucky-Pack-Online.cmd` | 178 | 2026-05-27 13:50:17 | `09693BB85BFC5C4723B74E2AF042C093B830344F2647E5E5234F5F5BC04C41ED` |
| `build/windows/README-INTERNAL-TEST.md` | 305 | 2026-05-27 13:50:17 | `802B0E21ECA40AAA1734807AE61740C7288A657310094DE685BC43EC97FFF854` |

---

## Known Warnings

1. `v0.1.0-rc.2` is a CI-passing source tag, not a clean package approval.
2. The local Windows artifacts were generated with Godot 4.6.3 while the accepted clean RC target remains Godot 4.4.
3. Godot 4.4 tooling has not yet been provisioned for clean RC validation.
4. Release artifact storage is selected as GitHub Release attachment, but no clean RC archive has been uploaded yet.
5. `BraveLegend` is selected for future clean RC artifacts, while current internal debug artifacts still use `LuckyPackMMORPG`.
6. The current artifacts are not committed to git by policy and are not tied to a clean RC archive.
7. Soak/performance/memory execution evidence is not yet available.
8. Store/legal/distribution, crash reporting, rollback, support/on-call, and localization decisions remain incomplete.

---

## Accepted Risks

No clean release risks are accepted by owners in this record.

For private internal Windows testing only, the existing QA sign-off accepts warning-bearing use of the current debug package. That acceptance does not extend to public distribution or clean RC approval.

---

## Current Verdict

**Source/CI provenance**: PASS.

**Internal debug package provenance**: PASS WITH WARNINGS.

**Clean release candidate package provenance**: NOT READY.

The next release evidence step is to provision Godot 4.4, apply clean RC artifact naming to generated package evidence, then rebuild or revalidate a package from the accepted tag under the release artifact policy.
