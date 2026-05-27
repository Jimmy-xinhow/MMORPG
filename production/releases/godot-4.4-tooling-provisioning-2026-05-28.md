# Godot 4.4 Tooling Provisioning Evidence

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / Godot 4.4 Clean RC Prerequisite  
**CCGS Workflows**: `setup-engine`, `godot`, `gate-check` adaptation  
**Owners**: Technical Director, Release Manager, QA Lead  
**Status**: PROVISIONED WITH WARNINGS

---

## Purpose

Provision the accepted Godot 4.4 release tooling needed by ADR-0002 before producing a clean release candidate package.

This replaces the previous clean-RC blocker where only `tools/godot-4.6.3` was available locally while the project target remained Godot 4.4.

---

## Official Source

| Item | Source |
| --- | --- |
| Godot 4.4 stable archive | `https://godotengine.org/download/archive/4.4-stable/` |
| Editor binary downloaded from | `https://github.com/godotengine/godot-builds/releases/download/4.4-stable/Godot_v4.4-stable_win64.exe.zip` |
| Export templates downloaded from | `https://github.com/godotengine/godot-builds/releases/download/4.4-stable/Godot_v4.4-stable_export_templates.tpz` |

---

## Local Tooling

| Field | Value |
| --- | --- |
| Tool root | `tools/godot-4.4/` |
| Console executable | `tools/godot-4.4/Godot_v4.4-stable_win64_console.exe` |
| Editor executable | `tools/godot-4.4/Godot_v4.4-stable_win64.exe` |
| Workspace-local export templates | `tools/godot-4.4/appdata/Godot/export_templates/4.4.stable/` |
| Global Godot settings modified | No intentional modification; validation used workspace-local `APPDATA` |

`tools/godot-4.4/` is local tooling and should not be committed as source.

---

## Verification Commands

```powershell
$env:APPDATA=(Resolve-Path 'tools\godot-4.4\appdata').Path
.\tools\godot-4.4\Godot_v4.4-stable_win64_console.exe --version
.\tools\godot-4.4\Godot_v4.4-stable_win64_console.exe --headless --path godot-client --check-only --script res://scripts/Main.gd
.\tools\godot-4.4\Godot_v4.4-stable_win64_console.exe --headless --path godot-client --quit
```

---

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Godot 4.4 executable present | PASS | `Godot_v4.4-stable_win64_console.exe` exists |
| Version output | PASS | `4.4.stable.official.4c311cbee` |
| Windows export templates present | PASS | `windows_debug_x86_64.exe`, `windows_release_x86_64.exe`, and console wrappers exist under `4.4.stable` |
| `Main.gd` parse check with Godot 4.4 | PASS after fix | Replaced `draw_ellipse()` calls with `_draw_ellipse_compat()` polygon drawing |
| Godot project headless load with Godot 4.4 | PASS | `--headless --path godot-client --quit` exited 0 |
| Project primary gate | PASS | `npm.cmd run check` passed with 47 tests |

---

## Compatibility Fix

Godot 4.4 rejected `draw_ellipse()` calls in `godot-client/scripts/Main.gd`.

Resolution:

- Added `_draw_ellipse_compat()` to the local drawing classes that need ellipse fills.
- Replaced direct `draw_ellipse()` calls with polygon-based ellipse drawing.
- Re-ran Godot 4.4 parse and project load checks successfully.

This is a Godot 4.4 compatibility fix and does not change gameplay state, API routing, or release policy.

---

## Warnings

1. The Godot 4.4 export template download required resumable transfer after earlier `Invoke-WebRequest` attempts timed out.
2. `tools/godot-4.4/` remains local tooling, not source provenance.
3. This evidence proves local tooling readiness, not remote CI provisioning.
4. A later CI/release workflow still needs a documented way to provision Godot 4.4 outside this workspace.

---

## Verdict

**Godot 4.4 tooling prerequisite**: PASS WITH WARNINGS.

The next release evidence step is to tie a Godot 4.4-built RC package to a source commit/tag, then run remote CI and RC smoke.
