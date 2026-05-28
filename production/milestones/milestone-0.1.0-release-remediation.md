# Milestone Plan: 0.1.0 Release Remediation

**Created**: 2026-05-28  
**Workflow**: CCGS `milestone-review` structure + `sprint-plan` release-remediation adaptation  
**Owner**: Producer  
**Stage Context**: Production, blocked from clean Release by `/gate-check release`  
**Target Window**: 2026-05-27 to 2026-06-10  
**Current Sprint**: `release-remediation-001`  
**Status**: Planned / In Review  

---

## Milestone Purpose

Convert the current clean-release blockers into reviewed decisions, evidence packages, and executable release operations artifacts so a future `/gate-check release` produces a smaller, more precise blocker list.

This milestone is **not** a public launch milestone. It is a remediation milestone for release readiness evidence.

---

## Target Type

**Working target**: private Windows internal test readiness plus clean release gate remediation.

**Public launch target**: deferred until owners explicitly choose a distribution channel and `/gate-check release` no longer returns FAIL.

The current store/legal checklist keeps public PC, Steam, Apple App Store, and Google Play as **NOT READY** paths. This milestone should not produce store submissions, public launch copy, pricing, public marketing promises, or mobile store readiness claims.

---

## Goals

| Goal | Description | Evidence |
| --- | --- | --- |
| G1 Source provenance clarity | Decide how source, branch, tag, and build provenance will be captured. | `production/releases/source-control-provenance-0.1.0.md` plus RR-001 owner decision. |
| G2 CI evidence path | Convert local CI config into remote GitHub Actions evidence after source control exists. | `production/qa/evidence/ci-evidence-2026-05-27.md` or successor with remote run URL. |
| G3 Version and artifact policy | Resolve Godot release version strategy and artifact archival/checksum rules. | ADR-0002, artifact policy, `production/releases/build-provenance-v0.1.0-rc.2.md`. |
| G4 QA evidence readiness | Keep local gate green and define missing performance, soak, RC smoke, and playtest evidence. | QA plan, soak protocol, smoke standard, playtest templates. |
| G5 Localization readiness boundary | Document why clean localization is blocked and what minimum path clears it. | `production/localization/localization-gap-report-2026-05-27.md`. |
| G6 Operations readiness boundary | Document crash reporting, rollback, hotfix, support/on-call, known issues, and day-one communication flow. | `production/releases/launch-operations-package-0.1.0.md`. |
| G7 Store/legal/distribution boundary | Define store metadata, legal, privacy, EULA, license, age-rating, and screenshot requirements. | `production/releases/store-legal-distribution-checklist-0.1.0.md`. |
| G8 Re-run readiness gate | Re-run release gate after owner decisions and evidence artifacts are updated. | Future `/gate-check release` report. |

---

## Non-Goals

- Do not mark the project public-launch ready.
- Do not create a public release tag while `/gate-check release` returns FAIL.
- Do not publish to Steam, Apple App Store, Google Play, or public direct download.
- Do not claim mobile store readiness from Windows 432x768 evidence.
- Do not claim localization readiness without string tables, font coverage, string freeze, and localization QA.
- Do not claim crash telemetry readiness while crash reporting is manual only.
- Do not mutate git, create remotes, or push tags without owner approval.
- Do not treat current `build/windows/*` as clean release candidate provenance until artifact policy requirements are met.

---

## Scope

### In Scope

- Release evidence planning and review artifacts.
- Owner decision records.
- Internal Windows test package readiness boundary.
- Release candidate prerequisite standards.
- Store/legal/ops checklists.
- QA protocols and templates.
- Re-run preparation for `/gate-check release`.

### Out Of Scope

- Public launch execution.
- Store submission.
- Paid user acquisition or public marketing.
- Mobile build/store certification.
- New gameplay features.
- Large localization refactor.
- Crash reporting SDK integration, unless separately approved as implementation work.

---

## Current Sprint Mapping

| ID | Task | Current Status | Milestone Role |
| --- | --- | --- | --- |
| RR-001 | Establish source-control provenance plan | Review | Required decision artifact. |
| RR-002 | Capture remote CI evidence path | Review | Remote CI evidence is captured; QA Lead sign-off remains. |
| RR-003 | Resolve Godot version strategy | Review | Godot 4.4 tooling is provisioned; `v0.1.0-rc.3` source tag, remote CI, and RC archive smoke pass with warnings. |
| RR-004 | Define release artifact policy | Review | Local RC archive/checksum, source tag, draft GitHub Release attachment, and full RC archive smoke evidence exist. |
| RR-005 | Create release QA plan for remediation evidence | Review | QA plan artifact exists and sprint status metadata is reconciled; awaiting QA Lead sign-off. |
| RR-006 | Produce performance, soak, and memory profiling protocol | Review | Planning complete; execution still required. |
| RR-007 | Produce localization gap report | Review | Planning complete; owner decisions required. |
| RR-008 | Draft launch operations package | Review | Planning complete; owner decisions required. |
| RR-009 | Draft store/legal/distribution checklist | Review | Planning complete; owner/legal decisions required. |
| RR-010 | Create milestone plan | In progress for this artifact | This file. |
| RR-011 | Define release candidate smoke standard | Review | Standard defined; RC3 archive boot, feature-page, bottom-navigation, and restricted-workflow smoke passed with warnings. |
| RR-012 | Prepare three playtest report templates | Review | Templates exist for new player experience, mid-game systems, and difficulty curve; real sessions still required before clean release evidence. |
| RR-013 | Draft patch notes and changelog requirements | Review | Requirements defined; actual changelog and patch notes remain blocked until source control and changelog sources exist. |

---

## Exit Criteria

### Milestone Minimum Exit

The milestone can exit as "Release Remediation Planned" when:

- [ ] RR-001 through RR-010 have written artifacts or explicit owner deferrals.
- [ ] `npm.cmd run check` passes after all artifact/status changes.
- [ ] Every review-state artifact has an owner decision path.
- [ ] Remaining blockers are categorized as: owner decision, external account/access, implementation work, or manual QA execution.
- [ ] The release checklist is updated or superseded with current blocker state.
- [ ] `/gate-check release` is rerun and produces a more precise blocker list.

### Clean Release Gate Exit

The project cannot exit to clean release until:

- [ ] Source-control route accepted and implemented.
- [ ] Remote GitHub Actions run evidence captured.
- [ ] Godot release version strategy accepted or superseded.
- [ ] Release artifact naming, archive, checksum, and provenance are complete.
- [ ] Release candidate smoke standard exists and is passed.
- [ ] Soak/performance/memory execution evidence exists.
- [ ] Store/legal/distribution path is selected and legally reviewed.
- [ ] Crash/support/rollback/on-call decisions are accepted and operationalized.
- [ ] Localization scope is either cleanly implemented or explicitly scoped out for the selected release type.
- [ ] `/gate-check release` no longer returns FAIL.

### Internal Windows Test Exit

Internal Windows test can remain GO WITH WARNINGS when:

- [ ] Owners accept manual crash reporting and role-based support workflow.
- [ ] Known issues file is published to testers.
- [ ] Current build artifact path and SHA256 are shared.
- [ ] Testers are told the package is internal-only and Traditional Chinese-only.
- [ ] No public store metadata, pricing, or launch claims are made.

---

## Risks

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Source control remains unresolved | High | High | Keep RR-001 as top owner decision; block RC/tag claims until resolved. |
| Godot 4.4 vs 4.6.3 decision stalls | Medium | High | Accept ADR-0002 or create superseding upgrade ADR before RC export. |
| Artifact naming inconsistency leaks into RC | High | Medium | Resolve `BraveLegend` vs `LuckyPackMMORPG` before RR-011/RC packaging. |
| Planning artifacts are mistaken for readiness evidence | Medium | High | Every artifact must state whether it is protocol/checklist vs executed evidence. |
| Localization scope expands into large UI refactor | Medium | Medium | Keep milestone limited to gap report and owner decisions unless a separate localization sprint is approved. |
| Store/legal questions expand beyond internal scope | High | Medium | Public launch remains non-goal; RR-009 is checklist only. |
| Performance evidence requires hardware not available | Medium | Medium | Separate Windows internal evidence from mobile device claims. |
| Owner decisions accumulate and block progress | High | High | Convert all owner decisions into a prioritized decision queue. |

---

## Decision Queue

| Priority | Decision | Owner |
| --- | --- | --- |
| 1 | Existing GitHub remote vs new repository | Producer + Release Manager |
| 2 | Godot 4.4 release validation vs formal upgrade to 4.6.3 | Technical Director |
| 3 | Final product/artifact naming convention | Producer + Legal + Release Manager |
| 4 | Artifact archive target and `.gitignore` update | Release Manager + Technical Director |
| 5 | Release target type: private internal, public PC, Steam, Apple, Google Play, or deferred | Producer |
| 6 | Crash reporting strategy for internal and clean release | Operations Owner + Technical Director |
| 7 | Support intake channel and named on-call contacts | Operations Owner |
| 8 | Localization source locale and target locale scope | Localization Owner + Producer |
| 9 | Legal source of truth for privacy/EULA/refund/probability pages | Legal / Policy Owner |
| 10 | Third-party license inventory method | Legal / Policy Owner + Release Manager |

---

## Evidence Map

| Evidence | Current Status | Path |
| --- | --- | --- |
| Godot Client Engineering QA sign-off | Approved with warnings | `production/qa/qa-signoff-godot-client-engineering-2026-05-27.md` |
| Smoke report | Pass with warnings | `production/qa/smoke-2026-05-27.md` |
| Release checklist | NO-GO for clean release | `production/releases/release-checklist-0.1.0-internal-2026-05-27.md` |
| Source provenance plan | Review | `production/releases/source-control-provenance-0.1.0.md` |
| Godot version ADR | Accepted | `docs/architecture/adr-0002-godot-release-version-strategy.md` |
| Godot 4.4 tooling provisioning | Pass with warnings | `production/releases/godot-4.4-tooling-provisioning-2026-05-28.md` |
| Artifact policy | Accepted for source/artifact policy; clean RC execution pending | `production/releases/release-artifact-policy-0.1.0.md` |
| Sprint QA plan | Review | `production/qa/qa-plan-sprint-release-remediation-001.md` |
| Performance/soak protocol | Protocol only | `production/qa/performance-soak-memory-protocol-2026-05-27.md` |
| Localization gap report | Review | `production/localization/localization-gap-report-2026-05-27.md` |
| Launch operations package | Review | `production/releases/launch-operations-package-0.1.0.md` |
| Store/legal/distribution checklist | Review | `production/releases/store-legal-distribution-checklist-0.1.0.md` |
| Remote CI evidence | Pass / review | `production/qa/evidence/ci-evidence-release-remediation-001.md` |
| Build provenance | Source/CI pass; clean RC not ready | `production/releases/build-provenance-v0.1.0-rc.2.md` |
| Clean RC decision package | Local RC candidate produced; source tag/release attachment pending | `production/releases/clean-rc-decision-package-0.1.0.md` |
| RC3 package candidate | Source tag, remote CI, draft release attachment, and RC archive smoke pass with warnings | `production/releases/build-provenance-v0.1.0-rc.3.md` |
| RC3 smoke evidence | Pass with warnings: archive boot, feature-page, bottom-navigation, and restricted-workflow checks complete | `production/qa/evidence/rc-smoke-v0.1.0-rc.3.md` |
| Known issues | Draft / no open S1-S2 bug files | `production/releases/known-issues-0.1.0-internal.md` |
| RC smoke standard | Defined / review | `production/qa/release-candidate-smoke-standard-0.1.0.md` |
| Playtest templates | Defined / review | `production/playtests/RR-012-template-index.md` |
| Patch notes/changelog requirements | Defined / review | `production/releases/patch-notes-changelog-requirements-0.1.0.md` |
| Release gate re-check | FAIL | `production/gate-checks/gate-check-release-2026-05-28.md` |

---

## Go / No-Go Framing

**Milestone recommendation**: CONDITIONAL GO for release-remediation planning.

**Clean public release recommendation**: NO-GO.

**Internal Windows test recommendation**: GO WITH WARNINGS.

Rationale:

- The project has strong local QA evidence for the Godot Client Engineering slice.
- Release readiness is blocked mainly by provenance, owner decisions, long-duration execution evidence, operations/legal/localization gaps, and missing public distribution decisions.
- The milestone should continue only as remediation planning and evidence closure, not as public launch execution.

---

## Next Actions

| # | Action | Owner | Target |
| --- | --- | --- | --- |
| 1 | Get QA Lead sign-off for RR-005 release remediation QA plan. | QA Lead | Next owner review |
| 2 | Record QA Lead sign-off for RR-002 remote CI evidence. | DevOps Engineer + QA Lead | Next owner review |
| 3 | Get QA Lead and Release Manager acceptance for RR-011 release candidate smoke standard. | QA Lead + Release Manager | Next owner review |
| 4 | Get QA Lead and Creative Director review for RR-012 playtest templates. | QA Lead + Creative Director | Next owner review |
| 5 | Get Producer and Release Manager review for RR-013 patch notes/changelog requirements. | Producer + Release Manager | Next owner review |
| 6 | Run real soak/performance/memory execution. | QA Lead + Performance Analyst | Before release gate re-run |
| 7 | Decide the `rcedit` metadata-stamping warning: configure `rcedit`, disable metadata modification, or accept for internal-only RC. | Release Manager + Technical Director | Before clean RC sign-off |
| 8 | Re-run release gate after owner decisions and remaining execution evidence are updated. | Release Manager + QA Lead | After warning-level gaps are resolved or explicitly accepted |

---

## RR-010 Acceptance Mapping

| Acceptance Criteria | Status | Evidence |
| --- | --- | --- |
| `production/milestones/` contains a milestone artifact | COMPLETE | This file. |
| Goals are defined | COMPLETE | See "Goals". |
| Exit criteria are defined | COMPLETE | See "Exit Criteria". |
| Risks are defined | COMPLETE | See "Risks". |
| Non-goals are defined | COMPLETE | See "Non-Goals". |
| Clean public launch remains out of scope | COMPLETE | See "Target Type" and "Non-Goals". |
