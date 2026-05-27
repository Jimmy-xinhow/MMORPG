# Patch Notes and Changelog Requirements: 0.1.0

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / RR-013  
**CCGS Workflows**: `changelog`, `patch-notes`  
**Owners**: Producer, Release Manager  
**Status**: Requirements defined, blocked from execution until RR-001 source-control route is implemented  

---

## Purpose

Define the minimum source inputs required before CCGS `/changelog` or `/patch-notes` can produce useful 0.1.0 release communication.

This document does not generate a changelog, player patch notes, or public announcement. It records what must exist first.

---

## Current State

| Check | Result | Impact |
| --- | --- | --- |
| Git repository | Not present | `/changelog` must abort gracefully because `git rev-parse --is-inside-work-tree` fails. |
| Git tags | Not available | Version range cannot be derived. |
| Commit history | Not available | Commit count, file change metrics, task references, and change provenance cannot be generated. |
| `docs/CHANGELOG.md` | Not present | `/patch-notes` has no existing changelog source. |
| `production/releases/0.1.0/changelog.md` | Not present | `/patch-notes 0.1.0` has no internal release changelog source. |
| Sprint data | Present | Can provide context, but cannot replace commit/tag provenance for a release changelog. |
| QA/release artifacts | Present | Can provide known warnings, scope boundaries, and readiness notes. |

---

## Required Source Inputs

### Required Before `/changelog 0.1.0`

| Input | Required | Source |
| --- | --- | --- |
| Git repository initialized or connected | Yes | RR-001 owner decision and implementation |
| Default branch | Yes | `main` unless owner chooses otherwise |
| Release candidate commit SHA | Yes | Git |
| Release candidate tag | Yes | Recommended `v0.1.0-rc.1` |
| Previous release tag or baseline rule | Yes | Git tag or explicit "initial release baseline" decision |
| Sprint context | Yes | `production/sprints/sprint-release-remediation-001.md` plus completed epic/sprint records |
| Design context | Yes | `design/gdd/`, `docs/planning/`, and relevant ADRs |
| QA known issues | Yes | Smoke, sign-off, known issue, and release checklist artifacts |
| Release target | Yes | Private internal, public PC, Steam, Apple, Google Play, or deferred |

Minimum command availability after RR-001:

```powershell
git rev-parse --is-inside-work-tree
git log --oneline
git tag
```

### Required Before `/patch-notes 0.1.0`

`/patch-notes` must not be run as a final output until one of these source changelog inputs exists:

- `production/releases/0.1.0/changelog.md`
- `docs/CHANGELOG.md` containing a 0.1.0 entry
- a git history and tag range that can generate an internal changelog first

If none exists, the CCGS `patch-notes` workflow should report:

```text
No changelog data found for 0.1.0. Run /changelog 0.1.0 first to generate the internal changelog, then re-run /patch-notes 0.1.0.
```

---

## Output Types

### Internal Changelog

Purpose:

- Release management.
- QA and owner traceability.
- Build provenance review.

Recommended path:

```text
production/releases/0.1.0/changelog.md
```

Required sections:

- release version and date,
- sprint(s) covered,
- commit range or initial baseline note,
- commit count,
- files changed and metrics where available,
- new features,
- improvements,
- bug fixes,
- balance changes,
- technical debt/refactoring,
- known issues,
- source evidence links,
- commits without task reference count.

Internal changelog may reference:

- file paths,
- sprint/story IDs,
- ADRs,
- QA artifacts,
- release blockers,
- owner decisions.

### Player-Facing Changelog

Purpose:

- Explain what changed in player-understandable terms.
- Avoid internal implementation details.

Recommended path:

```text
docs/CHANGELOG.md
```

Allowed content:

- player-visible feature summaries,
- gameplay changes,
- UI/quality-of-life improvements,
- player-visible bug fixes,
- known issues and workarounds.

Forbidden content:

- internal file paths,
- source-control internals,
- admin/operator workflow details,
- payout/tax/withdrawal workflow details,
- claims of public availability while clean release remains NO-GO,
- claims of mobile store readiness from Windows internal evidence.

### Patch Notes

Purpose:

- Shorter player-facing release communication.
- Suitable for internal tester distribution or public community posting after owner approval.

Recommended paths:

```text
docs/patch-notes/0.1.0.md
production/releases/0.1.0/patch-notes.md
```

Patch notes must be generated from the internal changelog, not directly from memory or informal summaries.

Tone guidance:

- player-friendly,
- clear,
- not hyperbolic,
- no public launch promises,
- describe player experience rather than technical implementation,
- keep gameplay rewards framed as in-game entertainment assets only.

### Known Issues

Purpose:

- Transparent tester communication.
- Support and rollback planning.

Recommended path:

```text
production/releases/known-issues-0.1.0-internal.md
```

Required fields:

- issue ID,
- player-visible symptom,
- severity,
- affected package,
- workaround,
- owner,
- target resolution,
- whether the issue blocks RC or public launch.

Known issues may be referenced by patch notes, but internal-only risks must not be published externally unless the Release Manager approves the wording.

---

## Initial 0.1.0 Release Communication Scope

Until clean release gates pass, all release communication is limited to:

- private Windows internal testing,
- Traditional Chinese internal scope unless localization owner approves another scope,
- 432x768 internal client evidence,
- local QA evidence and warnings,
- no store or public launch claims.

The current safe message frame is:

```text
0.1.0 is an internal Windows test package for the Godot client and release-readiness remediation. It is not a public launch build.
```

---

## Draftable Before Git Exists

The team may draft non-final notes before source control exists, but they must be labeled `DRAFT - NOT RELEASE NOTES` and must not be published.

Allowed draft sources:

- `production/epics/godot-client-engineering/EPIC.md`,
- `production/qa/smoke-2026-05-27.md`,
- `production/qa/qa-signoff-godot-client-engineering-2026-05-27.md`,
- `production/releases/release-checklist-0.1.0-internal-2026-05-27.md`,
- `production/milestones/milestone-0.1.0-release-remediation.md`.

Drafts may summarize:

- Godot client main pages are visible in the internal package,
- bottom navigation reaches supported player pages,
- player-facing restricted workflows were reviewed,
- release readiness remains blocked by source control, CI, version, artifact, operations, localization, legal, and performance evidence.

Drafts must not:

- claim reproducible build provenance,
- claim remote CI success,
- claim public launch readiness,
- imply store approval,
- imply gameplay rewards can be withdrawn or converted to cash.

---

## Generation Order

Follow this order after RR-001 is implemented:

1. Confirm source-control state.
2. Capture RR-002 remote CI evidence.
3. Create or confirm RC commit and tag.
4. Generate internal changelog from git history plus sprint/release context.
5. Review internal changelog with Producer and Release Manager.
6. Generate player-facing patch notes from the reviewed changelog.
7. Review player-facing wording for product-boundary safety.
8. Attach patch notes to the selected internal or public distribution package only after release target approval.

---

## Acceptance Checks

RR-013 is ready for owner review when:

- [x] Requirements define source inputs for `/changelog`.
- [x] Requirements define source inputs for `/patch-notes`.
- [x] Requirements state what cannot be generated without git history.
- [x] Requirements distinguish internal changelog from player-facing changelog.
- [x] Requirements distinguish patch notes from known issues.
- [x] Requirements forbid public launch claims while clean release remains NO-GO.
- [ ] Producer and Release Manager review is recorded.
- [ ] RR-001 source-control route is implemented before actual changelog generation.

---

## Current Verdict

**Internal changelog generation**: BLOCKED until source control exists.

**Patch notes generation**: BLOCKED until an internal changelog or git-backed changelog source exists.

**Draft communication planning**: READY WITH WARNINGS for private internal use only.

---

## Next Recommended Workflow

Resolve the remaining sprint metadata and evidence gaps:

1. Update RR-005 sprint status metadata to reflect the existing QA plan artifact.
2. Resolve RR-001 source-control owner decision.
3. Execute RR-002 remote CI evidence after repository setup.
4. Re-run release checklist or gate-check once owner decisions and critical evidence are updated.
