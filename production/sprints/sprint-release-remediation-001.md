# Sprint Release Remediation 001 - 2026-05-27 to 2026-06-10

**Generated**: 2026-05-27
**Workflow**: CCGS `sprint-plan` adapted for Codex
**Review Mode**: lean
**Stage Context**: Production, blocked from clean Release by `/gate-check release`
**Release Target**: 0.1.0 clean release readiness, not public launch approval

---

## Sprint Goal

Convert the release gate blockers into decision records, evidence packages, and executable release operations artifacts so the next `/gate-check release` can distinguish resolved blockers from accepted risks.

---

## Capacity

- Total days: 10 working days
- Buffer: 2 days reserved for unplanned release blockers and review rework
- Available: 8 planned days
- Team model: solo / Codex-assisted owner review

---

## Context

This sprint follows:

- `production/qa/qa-signoff-godot-client-engineering-2026-05-27.md`
- `production/qa/smoke-2026-05-27.md`
- `production/releases/release-checklist-0.1.0-internal-2026-05-27.md`
- `/launch-checklist dry-run`
- `/gate-check release`

Current release verdict is **FAIL** for clean release. Windows internal test readiness remains **GO WITH WARNINGS**.

---

## Tasks

### Must Have (Critical Path)

| ID | Task | Agent/Owner | Est. Days | Dependencies | Acceptance Criteria |
| --- | --- | --- | ---: | --- | --- |
| RR-001 | Establish source-control provenance plan | Producer + Release Manager | 1.0 | User decision on new repo vs existing remote | A written plan identifies repo source, branch, commit/tag naming, ignored generated outputs, and how build provenance will be captured. No git mutation is required to close this planning task. |
| RR-002 | Capture remote CI evidence path | DevOps Engineer + QA Lead | 0.75 | RR-001 | `production/qa/evidence/ci-evidence-2026-05-27.md` is updated or supplemented with the exact GitHub Actions run evidence requirements and owner action list. |
| RR-003 | Resolve Godot version strategy | Technical Director + Godot Specialist | 1.0 | None | A decision record states whether release validation targets Godot 4.4 or formally upgrades to 4.6.3, with required verification commands and risk acceptance. |
| RR-004 | Define release artifact policy | Release Manager + Technical Director | 1.0 | RR-001, RR-003 | A release artifact policy states whether `build/windows/*` is committed, archived externally, regenerated per tag, or excluded, including checksum/evidence expectations. |
| RR-005 | Create release QA plan for remediation evidence | QA Lead | 1.0 | This sprint plan | `production/qa/qa-plan-sprint-release-remediation-001.md` exists and covers CI, version, artifact, performance, localization, legal, and operations evidence. |
| RR-006 | Produce performance, soak, and memory profiling protocol | Performance Analyst + QA Lead | 1.25 | RR-005 | A protocol defines duration, commands/tools, pass/fail thresholds, and evidence paths for 432x768 Windows internal package and mobile portrait scope. |
| RR-007 | Produce localization gap report | Localization Owner + UI Programmer | 1.0 | RR-005 | A report lists hardcoded player-facing text locations, supported language assumptions, font coverage risks, and the minimum path to pass release localization checks. |
| RR-008 | Draft launch operations package | Release Manager + Operations Owner | 1.0 | RR-004 | A launch ops artifact covers crash reporting decision, rollback plan, hotfix path, support/on-call rota, known issues, and day-one communication workflow. |

### Should Have

| ID | Task | Agent/Owner | Est. Days | Dependencies | Acceptance Criteria |
| --- | --- | --- | ---: | --- | --- |
| RR-009 | Draft store/legal/distribution package checklist | Legal / Policy Owner + Release Manager | 1.0 | RR-004 | A checklist defines store metadata, privacy policy, EULA, third-party licenses, age rating, screenshots, and distribution channel requirements. |
| RR-010 | Create milestone plan for 0.1.0 release remediation | Producer | 0.75 | User confirms launch target type | `production/milestones/` contains a milestone artifact with goals, exit criteria, risks, and non-goals. |
| RR-011 | Define release candidate smoke standard | QA Lead + Release Manager | 0.5 | RR-004, RR-005 | Smoke standards distinguish internal debug package, release candidate package, and public launch candidate package. |

### Nice to Have

| ID | Task | Agent/Owner | Est. Days | Dependencies | Acceptance Criteria |
| --- | --- | --- | ---: | --- | --- |
| RR-012 | Prepare three playtest report templates | QA Lead + Creative Director | 0.75 | RR-005 | Templates exist for new player experience, mid-game systems, and difficulty curve playtests. |
| RR-013 | Draft patch notes and changelog requirements | Producer + Release Manager | 0.5 | RR-001 | A short requirements note defines what commit/sprint data must exist before `/patch-notes` or `/changelog` can produce useful output. |

---

## Carryover from Previous Sprint

| Task | Reason | New Estimate |
| --- | --- | ---: |
| Remote GitHub Actions evidence | Workspace is not a git repository and has no remote run metadata. | 0.75 |
| Godot version decision | Target is Godot 4.4, but local validation/export used Godot 4.6.3. | 1.0 |
| Release artifact policy | Windows export artifacts exist but versioning/distribution policy is undefined. | 1.0 |
| Soak/performance/memory evidence | Not run in previous QA close-out. | 1.25 |
| Launch operations package | Crash reporting, rollback, support, and on-call plans do not exist. | 1.0 |

---

## Risks

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Scope expands into public launch preparation instead of release remediation. | High | High | Keep this sprint focused on evidence and decisions; clean public launch remains out of scope until gate passes. |
| Git/repo provenance requires user account or remote access not available in workspace. | High | High | Produce a provenance plan first; only mutate git after explicit user decision. |
| Godot 4.4 export may not be locally available. | Medium | High | Decide whether to install/use 4.4 or accept a documented upgrade to 4.6.3 before rebuilding release candidates. |
| Localization work may reveal large UI refactor needs. | Medium | Medium | Start with a gap report and minimum release criteria before externalizing all strings. |
| Performance/soak checks may require physical mobile devices. | Medium | Medium | Separate Windows internal evidence from mobile store evidence; do not claim mobile readiness from desktop-only results. |

---

## Dependencies on External Factors

- User decision: create new git repository or connect this workspace to an existing remote.
- User decision: Godot 4.4 alignment vs formal upgrade to 4.6.3.
- User decision: clean release target channel, internal-only archive, public PC, or mobile store.
- Availability of GitHub remote Actions after source-control setup.
- Availability of profiling/soak hardware or accepted desktop-only test scope.
- Legal/policy owner input for EULA, privacy policy, licensing, and age rating.

---

## QA Plan Status

QA Plan: `production/qa/qa-plan-sprint-release-remediation-001.md`

The QA plan defines evidence paths, automated checks, manual sign-off requirements, and known QA gaps for RR-001 through RR-013.

---

## Definition of Done for this Sprint

- [ ] All Must Have tasks completed or explicitly deferred with owner approval.
- [ ] `production/qa/qa-plan-sprint-release-remediation-001.md` exists.
- [ ] Every completed task has a written artifact or evidence path.
- [ ] `npm.cmd run check` passes after any project changes.
- [ ] No S1 or S2 release blockers are newly introduced.
- [ ] Release checklist blockers are updated with resolved / pending / accepted-risk status.
- [ ] `/gate-check release` is rerun and produces a strictly better verdict or a smaller blocker list.
- [ ] `/team-release` is not run until release gate no longer returns FAIL.

---

## Scope Check

This sprint includes release remediation work beyond the original Godot Client Engineering epic. Run `/scope-check godot-client-engineering` or create a dedicated release remediation epic before implementation if strict epic traceability is required.
