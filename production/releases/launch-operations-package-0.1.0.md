# Launch Operations Package: 0.1.0

**Date**: 2026-05-27  
**Workflow**: CCGS release operations package adapted from `launch-checklist`, `release-checklist`, and `hotfix` guidance  
**Sprint Task**: RR-008  
**Owners**: Release Manager + Operations Owner  
**Scope**: Windows internal test package and release-remediation planning  
**Status**: Proposed, not launch-approved

---

## Verdict

**Clean public launch operations readiness**: NO-GO.

**Internal Windows test operations readiness**: GO WITH WARNINGS if owners accept manual crash intake, manual rollback, and role-based on-call coverage.

This package closes the RR-008 planning artifact requirement. It does not provide working crash telemetry, a tested rollback deployment, a staffed rota, a remote release branch, or support tooling evidence.

---

## Operating Assumptions

| Area | Current State | Operational Impact |
| --- | --- | --- |
| Source control | Workspace is not a git repository | Release rollback and hotfix branch procedures cannot be executed yet. |
| CI | Workflow exists locally, no remote run evidence | Hotfix verification can use local `npm.cmd run check`; remote CI is still blocked. |
| Build artifact | Current Windows package is internal/debug evidence | Public rollback cannot depend on it until provenance and artifact policy are accepted. |
| Godot version | Target 4.4, local validation/export used 4.6.3 | Any incident analysis must record runtime version used by the affected artifact. |
| Crash reporting | No third-party or in-app crash reporter found | Internal testing must collect manual crash logs until integration is selected. |
| Support channel | No ticketing or public support package exists | Internal testers need a lightweight issue intake template. |
| Localization | Traditional Chinese-only hardcoded prototype | External player support/localized issue handling is not ready. |
| Soak/performance | Protocol exists, execution not run | Stability incidents should be expected during internal testing. |

---

## Crash Reporting Decision

### Current Decision

For the current 0.1.0 internal Windows test package, use **manual crash reporting**.

No automated crash reporting SDK or telemetry endpoint is approved or integrated yet. This is acceptable only for internal testing and remains a clean-release blocker.

### Manual Crash Intake

When a tester reports a crash or unrecoverable hang, collect:

| Field | Required |
| --- | --- |
| Tester name / contact | Yes |
| Build artifact path or archive name | Yes |
| Artifact SHA256 if available | Yes |
| Godot runtime/version evidence | Yes |
| Backend URL / online or fallback mode | Yes |
| Exact page/action before crash | Yes |
| Reproduction steps | Yes |
| Screenshot/video if available | Yes |
| Windows Event Viewer application error, if present | Yes |
| Console output from `LuckyPackMMORPG.console.exe`, if available | Yes |
| Whether crash reproduces after restart | Yes |

Recommended bug path:

```text
production/qa/bugs/CRASH-YYYYMMDD-NNN.md
```

### Clean Release Requirement

Before clean release, owners must choose one:

1. Integrate a crash reporting provider and verify dashboard access.
2. Build a project-owned crash/log upload path with privacy/legal approval.
3. Explicitly scope crash telemetry out of the release with Producer + Technical Director + Legal approval.

Option 3 is not recommended for public or store distribution.

---

## Rollback Plan

### Rollback Classes

| Class | Applies To | Current Mechanism | Clean Release Status |
| --- | --- | --- | --- |
| Client artifact rollback | Broken Windows Godot build | Re-distribute previous known-good internal artifact | BLOCKED until artifact archive/provenance exists. |
| Backend process rollback | Broken Node server behavior | Revert to previous source state or redeploy previous environment | BLOCKED until git remote/deployment history exists. |
| LiveOps/content rollback | Bad campaign/content config | Existing domain supports campaign/content rollback concepts | PARTIAL; tests exist, operations runbook not exercised. |
| Data rollback | Corrupted local demo data | `scripts/reset-dev-data.mjs` and seed/reset flows exist | INTERNAL ONLY; not a production data rollback plan. |

### Internal Test Rollback Procedure

Use this only for internal Windows package testing:

1. Stop current test session.
2. Preserve the broken artifact and logs under an incident folder or attach them to the QA bug.
3. Re-issue the last known-good package identified in the release checklist or artifact policy.
4. Ask testers to delete or isolate local test data if the incident involves state corruption.
5. Run `npm.cmd run check` on source before continuing development.
6. Record rollback in the incident/bug file with artifact path, reason, and tester impact.

### Release Candidate Rollback Requirement

Before any release candidate can claim rollback readiness:

- A previous known-good artifact archive must exist.
- The current and previous artifacts must have SHA256 checksums.
- A tagged source commit must exist for both current and previous artifacts.
- CI result links must exist for both tags.
- A rollback drill must be run and recorded under `production/qa/evidence/`.

Recommended drill evidence path:

```text
production/qa/evidence/rollback-drill-v0.1.0-rc.1.md
```

---

## Hotfix Path

### Severity Routing

| Severity | Criteria | Response |
| --- | --- | --- |
| S1 Critical | Game unplayable, data loss, security/privacy issue, restricted finance workflow exposed to player pages | Stop distribution, create hotfix record, run smoke gate before re-release. |
| S2 Major | Significant feature broken, page unreachable, payment/economy boundary unclear, workaround exists | Create hotfix record, run targeted checks and full `npm.cmd run check`. |
| S3 Minor | Cosmetic issue, typo, minor text/readability issue | Normal backlog unless it blocks current QA evidence. |

### Hotfix Record Template

Create:

```text
production/hotfixes/hotfix-YYYYMMDD-short-name.md
```

Required fields:

```markdown
# Hotfix: short-name

**Date**:
**Severity**:
**Reporter**:
**Affected build/artifact**:
**Status**: IN PROGRESS

## Problem

## Player / Tester Impact

## Root Cause

## Fix

## Validation
- [ ] Targeted check:
- [ ] `npm.cmd run check`:
- [ ] Godot boot/export check if client artifact changed:
- [ ] Manual smoke evidence:

## Approvals
- [ ] Lead Programmer / Technical Director
- [ ] QA Lead
- [ ] Producer / Release Manager

## Rollback Plan

## Post-Deploy Verification
```

### Expected Turnaround

| Release State | S1 Target | S2 Target | Notes |
| --- | ---: | ---: | --- |
| Internal debug package | Same day | 1 working day | Local rebuild and manual redistribution acceptable. |
| Release candidate | 4 hours after root cause known | 1 working day | Requires tag/provenance and smoke standard. |
| Public launch candidate | Do not ship until `/gate-check release` no longer fails | Do not ship until release sign-off | Public hotfix flow is not ready yet. |

### Current Blockers

- Cannot create hotfix branch until source-control route is accepted.
- Cannot attach hotfix build to GitHub Release until remote repository exists.
- Cannot verify remote CI until RR-002 is resolved.
- Cannot claim 4-hour public hotfix capability until release candidate smoke standard and artifact archive exist.

---

## Support / On-Call Plan

### Internal Test Rota

Until named humans are assigned, coverage is role-based:

| Role | Primary Responsibility | First Response Target |
| --- | --- | --- |
| Release Manager | Triage incoming internal-test issues, decide stop/go for artifact distribution | Same business day |
| QA Lead | Reproduce issue, classify severity, attach evidence | Same business day for S1/S2 |
| Technical Director / Lead Programmer | Root-cause S1/S2 technical issues, approve hotfix scope | Same business day for S1 |
| Operations Owner | Track support queue, known issues, tester communications | Same business day |
| Producer | Approve risk acceptance, deferral, or release pause | Before any re-distribution |

### First 72 Hours Internal-Test Coverage

| Window | Coverage Requirement |
| --- | --- |
| T+0 to T+24 | Release Manager + QA Lead monitor all new reports. |
| T+24 to T+48 | QA Lead verifies fixes or workarounds; Operations Owner updates known issues. |
| T+48 to T+72 | Producer reviews remaining S1/S2 and decides continue/pause. |

### Support Intake Template

```markdown
# Internal Test Issue

**Reporter**:
**Build / artifact**:
**Page / flow**:
**Severity guess**:
**What happened**:
**Expected result**:
**Steps to reproduce**:
**Screenshot/video/logs**:
**Reproduces after restart**: Yes / No / Unknown
```

### Clean Release Requirement

Before clean release:

- Assign named people and contact methods for each role.
- Choose support channel: ticketing system, email inbox, Discord/forum, or private QA tracker.
- Create public-facing FAQ and known issues page if any external testers are involved.
- Define privacy policy for logs/screenshots before collecting player data.

---

## Known Issues Publication Path

### Internal Known Issues File

Recommended path:

```text
production/releases/known-issues-0.1.0-internal.md
```

Required sections:

- Build/artifact covered.
- Active S1/S2 issues.
- Accepted warnings.
- Workarounds.
- Fixed since last package.
- Do-not-report duplicates.

### Current Known Warnings To Publish Internally

| ID | Warning | Source |
| --- | --- | --- |
| KI-001 | Remote CI run evidence is missing because workspace is not a git repository. | Release checklist / RR-001 |
| KI-002 | Godot target is 4.4 but local validation/export used 4.6.3. | ADR-0002 / smoke report |
| KI-003 | Current Windows artifact is internal/debug evidence, not clean RC provenance. | Artifact policy |
| KI-004 | Soak/performance/memory execution has not run. | RR-006 |
| KI-005 | Localization is Traditional Chinese-only hardcoded prototype, not release-localized. | RR-007 |
| KI-006 | Store/legal/distribution package is not prepared. | Release checklist |
| KI-007 | Crash reporting is manual only. | This package |
| KI-008 | Artifact naming is inconsistent between `BraveLegend` config/scripts and `LuckyPackMMORPG` current files. | Artifact policy |

---

## Day-One Communication Workflow

### Internal Test Communication

Trigger this workflow when a new internal package is shared:

1. Release Manager posts package location, artifact SHA256, and known issues.
2. QA Lead posts required smoke paths and reporting template.
3. Operations Owner tracks incoming issues and updates known issues daily.
4. Technical Director posts stop-test notice if any S1 appears.
5. Producer posts continue/pause decision after the first test window.

### S1 Incident Communication

Within the internal test group:

| Time | Action |
| --- | --- |
| T+0 | Reporter files issue with crash/support template. |
| T+30 minutes | QA Lead confirms severity or asks for more evidence. |
| T+60 minutes | Release Manager decides continue testing, pause affected flow, or stop distribution. |
| T+120 minutes | Technical owner posts root-cause status or rollback recommendation. |
| Same day | Producer approves hotfix, rollback, or deferral. |

### External/Public Communication

Not ready. Before public launch, prepare:

- Public known issues page.
- Support FAQ.
- Patch notes template.
- Incident statement template.
- Channel list and owner for each channel.
- Approval chain for legal/policy-sensitive issues.

---

## Launch Monitoring Checklist

Use for internal test only until telemetry exists:

- [ ] Package path and SHA256 posted.
- [ ] Backend URL and environment posted.
- [ ] `npm.cmd run check` result posted for the source state.
- [ ] Smoke evidence path posted.
- [ ] Known issues file posted.
- [ ] Support intake template posted.
- [ ] Stop-test criteria posted.
- [ ] Owner roles and response windows posted.

Stop-test criteria:

- Any crash/hang that reproduces on launch or supported main pages.
- Any restricted operator/admin/withdrawal/tax/payout workflow visible on Godot player pages.
- Any data-loss or state-corruption issue.
- Any inability to navigate home, role, packs, market, challenge, guild, or system.
- Any security/privacy issue.

---

## RR-008 Acceptance Mapping

| Acceptance Criteria | Status | Evidence |
| --- | --- | --- |
| Package covers crash reporting decision | COMPLETE | Manual internal crash reporting selected; clean release blocker recorded. |
| Package covers rollback plan | COMPLETE | Internal rollback and RC rollback requirements documented. |
| Package covers hotfix path and expected turnaround | COMPLETE | Severity routing, record template, and turnaround table documented. |
| Package covers support/on-call owner and first response workflow | COMPLETE | Role-based rota and 72-hour internal coverage documented. |
| Package includes known issues publication path | COMPLETE | `known-issues-0.1.0-internal.md` path and starter warnings documented. |
| Package covers day-one communication workflow | COMPLETE | Internal package communication and S1 incident flow documented. |

---

## Owner Decisions Required

1. Assign named Release Manager, QA Lead, Technical Director, Operations Owner, and Producer contacts.
2. Approve manual crash reporting for internal test only, or select a crash reporting integration.
3. Approve known issues publication path and support intake channel.
4. Accept or revise the internal rollback procedure.
5. Resolve RR-001/RR-002 so hotfix branches, tags, CI evidence, and artifact attachments can be used.

---

## Next Recommended CCGS Step

Run RR-009: draft the store/legal/distribution package checklist.

RR-009 should use this operations package plus the localization gap report to define required public metadata, legal notices, privacy/EULA, age rating, screenshots, third-party license attribution, and distribution channel requirements.
