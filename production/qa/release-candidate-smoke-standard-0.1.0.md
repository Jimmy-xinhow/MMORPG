# Release Candidate Smoke Standard: 0.1.0

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / RR-011  
**CCGS Workflows**: `smoke-check`, `release-checklist`, `test-evidence-review`  
**Owners**: QA Lead, Release Manager  
**Status**: Defined, pending RR-004/RR-005 owner acceptance and first RC execution  

---

## Purpose

Define the minimum smoke evidence required before a 0.1.0 package can be called an internal debug package, release candidate package, or public launch candidate package.

This standard does not execute a new smoke run and does not make the project clean-release ready. It defines the gate that future smoke evidence must satisfy.

---

## Governing Inputs

| Input | Current Status | Path |
| --- | --- | --- |
| Release QA plan | Exists, sprint status metadata still needs cleanup | `production/qa/qa-plan-sprint-release-remediation-001.md` |
| Current smoke report | PASS WITH WARNINGS | `production/qa/smoke-2026-05-27.md` |
| Release artifact policy | Proposed / review | `production/releases/release-artifact-policy-0.1.0.md` |
| Source-control provenance plan | Review | `production/releases/source-control-provenance-0.1.0.md` |
| Godot version ADR | Proposed | `docs/architecture/adr-0002-godot-release-version-strategy.md` |
| Launch operations package | Review | `production/releases/launch-operations-package-0.1.0.md` |
| Store/legal/distribution checklist | Review | `production/releases/store-legal-distribution-checklist-0.1.0.md` |
| Performance/soak/memory protocol | Protocol only | `production/qa/performance-soak-memory-protocol-2026-05-27.md` |

---

## Package Classes

### 1. Internal Debug Package

Purpose:

- Internal QA.
- Owner review.
- Local Windows smoke testing.
- Feature-page and navigation evidence capture.

Allowed conditions:

- May use a debug export.
- May use the console wrapper.
- May use the documented Godot 4.6.3 internal-test exception while ADR-0002 is pending.
- May receive `PASS WITH WARNINGS`.
- May use local-only smoke evidence when no remote repository exists.

Current accepted example:

- `build/windows/LuckyPackMMORPG.exe`
- `build/windows/LuckyPackMMORPG.console.exe`
- `build/windows/Play-Lucky-Pack-Online.cmd`

Minimum smoke checks:

| Check | Required Result | Evidence |
| --- | --- | --- |
| Primary project gate | PASS | `npm.cmd run check` output recorded in smoke or session evidence |
| Godot static/prototype validation | PASS | Covered by `npm.cmd run check` and `npm.cmd run check:godot` where applicable |
| Windows boot smoke | PASS | Console wrapper or Godot headless boot exits successfully |
| 432x768 visible UI | PASS | Screenshot or visible QA evidence for home and supported feature pages |
| Bottom navigation | PASS | Click-through evidence for home, role, packs, market, challenge, guild, system |
| Restricted workflow exposure | PASS or PASS WITH NOTES | Player-visible review shows no admin/operator/payout/tax/withdrawal workflows |
| Known warnings | RECORDED | Smoke report lists CI/version/provenance limitations |

Internal debug `PASS WITH WARNINGS` is acceptable when warnings are about release infrastructure, provenance, or unexecuted public-launch evidence, and no S1/S2 runtime issue is present.

### 2. Release Candidate Package

Purpose:

- Candidate for clean internal release gate review.
- Reproducible package from source-control provenance.
- Basis for owner sign-off before any public channel is considered.

Prerequisites before RC smoke can start:

- RR-001 source-control route accepted.
- Git commit SHA and tag exist for the candidate.
- Remote CI evidence path from RR-002 is available.
- ADR-0002 is accepted or superseded.
- RR-004 release artifact policy is accepted.
- Product/artifact naming is resolved across export preset, package script, launcher, README, archive, and provenance record.
- Release archive or release attachment target is selected.

Minimum smoke checks:

| Check | Required Result | Evidence |
| --- | --- | --- |
| Local primary gate | PASS | `npm.cmd run check` |
| Remote CI gate | PASS | GitHub Actions run URL tied to the RC commit SHA |
| Godot version alignment | PASS | Accepted Godot executable path/version recorded |
| Export provenance | PASS | Build provenance record includes command, preset, mode, source SHA, tag, timestamp |
| Artifact checksum | PASS | SHA256 for every executable, launcher, README, and archive |
| Boot stability | PASS | RC executable boots through the agreed command without crash/hang |
| Feature-page visibility | PASS | Home, role, packs, market, challenge, guild, system visible at 432x768 |
| Navigation regression | PASS | Bottom navigation reaches every supported page from a clean boot |
| Restricted workflow exposure | PASS | No player-visible admin/operator/payout/tax/withdrawal workflows |
| Known issues review | PASS | Known issues file exists or explicit "none found" evidence is recorded |
| Open bug threshold | PASS | Zero open S1; zero open S2 unless Producer and QA Lead accept a documented exception |

Recommended evidence paths:

```text
production/qa/evidence/rc-smoke-v0.1.0-rc.1.md
production/releases/build-provenance-v0.1.0-rc.1.md
production/releases/known-issues-0.1.0-internal.md
```

RC verdict rules:

- `PASS` is required for a clean RC.
- `PASS WITH CONDITIONS` may be used only when the Release Manager, QA Lead, and Producer explicitly accept the listed warnings in the RC smoke evidence.
- `PASS WITH WARNINGS` from an internal debug package cannot be copied forward as RC evidence without rerunning the RC package checks.

### 3. Public Launch Candidate Package

Purpose:

- Candidate for public distribution.
- May be considered only after the clean release gate is no longer failing.

Prerequisites before public launch candidate smoke can start:

- All RC prerequisites are complete.
- Store/legal/distribution checklist is accepted for the selected channel.
- Launch operations package is accepted and operationalized.
- Crash reporting, rollback, support intake, and on-call coverage are accepted.
- Soak/performance/memory execution evidence exists.
- Localization readiness is implemented or explicitly scoped out for the selected release type.
- `/gate-check release` no longer returns FAIL.
- `/team-release` or equivalent owner sign-offs are complete.

Minimum additional checks:

| Check | Required Result | Evidence |
| --- | --- | --- |
| Soak/performance/memory execution | PASS | Completed run evidence from the RR-006 protocol |
| Store/legal package | PASS | Channel-specific checklist signed by Legal / Policy Owner |
| Operations readiness | PASS | Crash/support/rollback/on-call decisions accepted and tested where applicable |
| Public known issues | PASS | Player-facing known issues and support route prepared |
| Public metadata consistency | PASS | Product name, version, screenshots, descriptions, and legal pages match selected channel |
| Final release gate | PASS | Fresh gate-check report does not return FAIL |

Public launch candidate smoke cannot pass with unowned release blockers. Any unresolved blocker must be explicitly classified as out of scope for the selected release type and accepted by the named owner.

---

## Required RC Smoke Evidence Template

Each RC smoke report must include:

| Field | Required |
| --- | --- |
| Package class | Internal Debug, Release Candidate, or Public Launch Candidate |
| Package version | Yes |
| Artifact names | Yes |
| Artifact SHA256 hashes | Yes |
| Source branch | RC and Public only |
| Commit SHA | RC and Public only |
| Tag | RC and Public only |
| Remote CI run URL | RC and Public only |
| Godot target version | Yes |
| Godot executable path/version | Yes |
| Export preset and mode | Yes |
| Build/export command | RC and Public only |
| Smoke commands run | Yes |
| Manual visual evidence paths | Yes |
| Known warnings | Yes |
| Known issues path | RC and Public only |
| Owner sign-offs | RC and Public only |

---

## Failure Rules

A smoke run is `FAIL` if any of the following are true:

- `npm.cmd run check` fails.
- Remote CI fails or is missing for an RC/public package.
- The executable fails to boot, crashes, or hangs during the required boot window.
- A supported page cannot be reached from bottom navigation.
- Supported pages show severe text overlap that blocks interaction at 432x768.
- Player-visible screens expose admin/operator center, payout/disbursement, tax processing, withdrawal, or operator settlement approval workflows.
- RC/public provenance is missing commit SHA, tag, artifact checksum, or Godot executable version.
- Artifact SHA256 does not match the recorded package.
- Any open S1 bug exists.
- Any open S2 bug exists without documented Producer and QA Lead exception.

---

## Warning Rules

Warnings may be accepted for internal debug packages when:

- Remote CI is unavailable because the workspace is not yet in source control.
- Godot 4.6.3 is used only as the documented internal-test exception.
- Soak/performance/memory execution is not yet run.
- Store/legal/distribution package is not yet required for private internal Windows testing.
- Crash reporting is manual-only and accepted for private internal testing.

Warnings are not acceptable for a clean public launch candidate unless each warning has a named owner, an explicit release-type scope decision, and sign-off in the public launch evidence.

---

## RR-011 Acceptance Mapping

| Acceptance Criteria | Status | Evidence |
| --- | --- | --- |
| Standard distinguishes internal debug package | COMPLETE | See "Internal Debug Package". |
| Standard distinguishes release candidate package | COMPLETE | See "Release Candidate Package". |
| Standard distinguishes public launch candidate package | COMPLETE | See "Public Launch Candidate Package". |
| Standard defines required smoke evidence | COMPLETE | See "Required RC Smoke Evidence Template". |
| Standard defines pass/warning/fail behavior | COMPLETE | See "Failure Rules" and "Warning Rules". |
| Standard avoids claiming clean release readiness | COMPLETE | Purpose and package-class gating state this explicitly. |

---

## Current Readiness Verdict

**Internal Debug Package**: GO WITH WARNINGS, based on existing smoke and QA evidence.

**Release Candidate Package**: NOT READY. Source control, remote CI evidence, accepted Godot version strategy, accepted artifact policy, naming consistency, and RC provenance are still missing.

**Public Launch Candidate Package**: NO-GO. Public launch requires RC pass, real soak/performance/memory execution, store/legal/distribution approval, operations readiness, localization scope resolution, and a non-failing release gate.

---

## Next Recommended Workflow

Proceed to RR-012 using the CCGS `playtest-report` workflow to prepare templates for:

1. New player experience.
2. Mid-game systems.
3. Difficulty curve.
