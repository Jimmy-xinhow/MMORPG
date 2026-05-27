# Clean RC Decision Package: 0.1.0

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / Clean RC Package Preconditions  
**CCGS Workflows**: `architecture-decision`, `release-checklist`, `gate-check` adaptation  
**Owners**: Producer, Technical Director, Release Manager, QA Lead  
**Status**: Proposed decision package; awaiting owner selections  

---

## Purpose

Resolve the remaining owner decisions that block producing the first clean release candidate package after `v0.1.0-rc.2` source and remote CI provenance passed.

This document does not accept ADR-0002, rename files, rebuild artifacts, publish a release, or modify `.gitignore`. It defines the exact decisions, recommended path, files to change after approval, and pass criteria for the next implementation stage.

---

## Current Evidence Baseline

| Evidence | Status | Path |
| --- | --- | --- |
| Source tag | PASS | `v0.1.0-rc.2` -> `56d8c36a43f7099a3678cee4273c3313883dbdfe` |
| Remote CI | PASS | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526574962` |
| Build provenance | SOURCE/CI PASS, CLEAN RC NOT READY | `production/releases/build-provenance-v0.1.0-rc.2.md` |
| Release gate re-check | FAIL | `production/gate-checks/gate-check-release-2026-05-28.md` |
| Artifact policy | PROPOSED | `production/releases/release-artifact-policy-0.1.0.md` |
| Godot version strategy | PROPOSED | `docs/architecture/adr-0002-godot-release-version-strategy.md` |

---

## Decision 1: Godot Release Version Strategy

### Recommended Selection

Accept ADR-0002 and keep clean release validation pinned to **Godot 4.4**.

### Rationale

- `.claude/docs/technical-preferences.md`, `docs/engine-reference/godot/VERSION.md`, and `godot-client/project.godot` already identify Godot 4.4 as the target.
- Current Godot 4.6.3 evidence is useful for internal testing but should remain a documented exception until an upgrade ADR exists.
- This is the lowest-risk provenance choice because it preserves the declared target instead of changing target/runtime during release remediation.

### Alternatives

| Option | Result | Cost / Risk |
| --- | --- | --- |
| Accept ADR-0002, require Godot 4.4 for clean RC | Strongest provenance alignment | Requires locating/provisioning Godot 4.4 before clean RC package |
| Supersede ADR-0002 with Godot 4.6.3 upgrade ADR | Faster local packaging with existing tool | Requires changing target docs/config and rerunning regression/export evidence |
| Keep ADR-0002 Proposed | No immediate decision | Clean RC remains blocked |

### Post-Approval Changes

If owners accept ADR-0002:

1. Change `docs/architecture/adr-0002-godot-release-version-strategy.md` status from `Proposed` to `Accepted`.
2. Record the owner/date/sign-off in this decision package or a superseding sign-off record.
3. Provision Godot 4.4 locally or in CI.
4. Rebuild or validate the clean RC package with the Godot 4.4 executable.

If owners choose upgrade instead:

1. Write a superseding ADR for Godot 4.6.3.
2. Update `.claude/docs/technical-preferences.md`.
3. Update `docs/engine-reference/godot/VERSION.md`.
4. Review and update `godot-client/project.godot` target metadata.
5. Rerun Godot/runtime/export smoke evidence.

---

## Decision 2: Product And Artifact Naming

### Recommended Selection

Use **勇者傳說 Brave Legend** as the product/display name and **BraveLegend** as the Windows executable stem.

Use ASCII release archive names:

```text
brave-legend-v0.1.0-rc.3-windows-internal.zip
brave-legend-v0.1.0-internal.1-windows.zip
```

### Rationale

- `godot-client/project.godot`, `godot-client/export_presets.cfg`, `godot-client/README.md`, and the production UI prompt library already use `勇者傳說 Brave Legend`.
- `scripts/package-windows-internal-test.ps1` and the export preset already expect `BraveLegend.exe`.
- The `LuckyPackMMORPG` artifact names can be treated as previous internal debug package names rather than the clean RC naming target.
- The backend/API infrastructure may continue using `lucky-pack` naming where it is already deployed; this decision only governs player-facing product metadata and release artifacts.

### Alternatives

| Option | Result | Cost / Risk |
| --- | --- | --- |
| Use `勇者傳說 Brave Legend` / `BraveLegend` | Aligns Godot project, export preset, package script, and UI prompts | Requires updating historical QA/release references for future evidence |
| Use `Lucky Pack MMORPG` / `LuckyPackMMORPG` | Aligns current internal debug artifacts and package metadata | Requires changing Godot project metadata, export preset, package scripts, and validators |
| Keep both names | No immediate file changes | Clean RC remains blocked by naming inconsistency |

### Post-Approval Files To Update

If owners choose the recommended naming:

| File | Expected Change |
| --- | --- |
| `scripts/validate-goal-seven.mjs` | Expect `build/windows/BraveLegend.exe` and `Play-Brave-Legend-Online.cmd` for local artifact checks |
| `production/qa/release-candidate-smoke-standard-0.1.0.md` | Future RC examples use `BraveLegend` artifact names |
| `production/qa/qa-plan-sprint-release-remediation-001.md` | Future hash commands and package names use `BraveLegend` |
| `production/releases/release-artifact-policy-0.1.0.md` | Mark naming convention selected and update recommended archive examples |
| `production/releases/build-provenance-v0.1.0-rc.3.md` | Record the selected naming and produced archive |

Historical evidence files may retain `LuckyPackMMORPG` references because they describe already-captured internal debug artifacts.

---

## Decision 3: Artifact Storage

### Recommended Selection

Use a GitHub Release attachment for clean release candidate packages.

Recommended release:

```text
v0.1.0-rc.3
```

Recommended attachment:

```text
brave-legend-v0.1.0-rc.3-windows-internal.zip
```

### Rationale

- The GitHub remote now exists and GitHub Actions is passing.
- GitHub Releases keep source tag, release notes, artifact archive, and SHA256 evidence in one discoverable location.
- Generated Windows build outputs remain out of git, consistent with the release artifact policy.

### Alternatives

| Option | Result | Cost / Risk |
| --- | --- | --- |
| GitHub Release attachment | Best traceability from tag to artifact | Requires owner approval to publish a draft/prerelease asset |
| Local `release-archives/` path | Works without publishing to GitHub Releases | Easy to lose or fail to share; must be ignored from git |
| Commit generated artifacts to git | Simplifies checkout-only distribution | Bloats source history and conflicts with current artifact policy |

### Post-Approval Changes

1. Add `release-archives/` to `.gitignore` only if local archive staging is used.
2. Create a release archive from the accepted clean RC build output.
3. Record SHA256 for the archive and each included artifact.
4. Attach the archive to a GitHub prerelease or record the local archive path.
5. Update build provenance with the final release URL or archive path.

---

## Decision 4: `.gitignore` Generated Output Policy

### Recommended Selection

Approve the release artifact policy default: generated outputs are not committed to git.

Add:

```text
godot-client/.godot/
**/__pycache__/
build/windows/
build/internal-test/
release-archives/
```

### Rationale

- The repository already excludes `node_modules/`, `tmp/`, and `*.log`.
- The current working tree repeatedly shows generated Godot cache, Python cache, and Windows build outputs as untracked.
- Excluding generated outputs keeps source provenance clean and supports external artifact storage.

### Post-Approval Files To Update

| File | Expected Change |
| --- | --- |
| `.gitignore` | Add generated output ignores listed above |
| `production/releases/release-artifact-policy-0.1.0.md` | Mark `.gitignore` update approved/applied |

---

## Recommended Decision Set

| Decision | Recommended Selection | Owner |
| --- | --- | --- |
| Godot version strategy | Accept ADR-0002: clean RC requires Godot 4.4 | Technical Director |
| Product/artifact naming | `勇者傳說 Brave Legend` / `BraveLegend` | Producer + Legal/Policy + Release Manager |
| Artifact storage | GitHub Release attachment on successor RC tag | Release Manager |
| `.gitignore` generated output policy | Exclude generated outputs and local archives | Release Manager + Technical Director |

---

## Implementation Stage After Approval

After owners approve the recommended set, the next implementation stage is:

1. Update ADR-0002 status/sign-off or create a superseding ADR.
2. Update `.gitignore`.
3. Align release artifact naming in validators, package docs, smoke standard, and future provenance.
4. Provision accepted Godot version.
5. Rebuild a clean RC package from the accepted tag.
6. Create and checksum the release archive.
7. Push a successor tag, expected `v0.1.0-rc.3`.
8. Run remote CI and local RC smoke.
9. Update build provenance and release gate report.

---

## Acceptance Criteria

This decision package is ready for owner review when:

- [x] Godot version options and recommendation are documented.
- [x] Naming options and recommendation are documented.
- [x] Artifact storage options and recommendation are documented.
- [x] `.gitignore` generated output policy is documented.
- [x] Post-approval file changes are listed.
- [ ] Owners select or revise each decision.
- [ ] Approved decisions are applied in source.

---

## Current Verdict

**Decision readiness**: READY FOR OWNER REVIEW.

**Clean RC package readiness**: BLOCKED until these decisions are selected and applied.
