# Clean RC Decision Package: 0.1.0

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / Clean RC Package Preconditions  
**CCGS Workflows**: `architecture-decision`, `release-checklist`, `gate-check` adaptation  
**Owners**: Producer, Technical Director, Release Manager, QA Lead  
**Status**: Recommended decisions applied for source policy; clean package execution pending  

---

## Purpose

Resolve the remaining owner decisions that block producing the first clean release candidate package after `v0.1.0-rc.2` source and remote CI provenance passed.

This document records the selected decision path applied on 2026-05-28. It accepts the Godot 4.4 release strategy, selects Brave Legend / `BraveLegend` for future clean RC artifacts, selects GitHub Release attachments for clean RC storage, and applies the generated-output `.gitignore` policy.

It does not rebuild artifacts, publish a release, or claim clean RC readiness. The current `build/windows/*` files remain legacy internal debug artifacts until a clean RC package is rebuilt or validated under the accepted Godot 4.4 strategy.

---

## Current Evidence Baseline

| Evidence | Status | Path |
| --- | --- | --- |
| Source tag | PASS | `v0.1.0-rc.2` -> `56d8c36a43f7099a3678cee4273c3313883dbdfe` |
| Remote CI | PASS | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526574962` |
| Build provenance | SOURCE/CI PASS, CLEAN RC NOT READY | `production/releases/build-provenance-v0.1.0-rc.2.md` |
| Release gate re-check | FAIL | `production/gate-checks/gate-check-release-2026-05-28.md` |
| Artifact policy | ACCEPTED FOR SOURCE POLICY | `production/releases/release-artifact-policy-0.1.0.md` |
| Godot version strategy | ACCEPTED | `docs/architecture/adr-0002-godot-release-version-strategy.md` |

---

## Decision 1: Godot Release Version Strategy

### Selected

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

### Applied / Remaining Changes

Applied:

1. `docs/architecture/adr-0002-godot-release-version-strategy.md` status changed from `Proposed` to `Accepted`.
2. This decision package records the selection date and remaining execution requirements.

Remaining:

1. Provision Godot 4.4 locally or in CI.
2. Rebuild or validate the clean RC package with the Godot 4.4 executable.

If owners choose upgrade instead:

1. Write a superseding ADR for Godot 4.6.3.
2. Update `.claude/docs/technical-preferences.md`.
3. Update `docs/engine-reference/godot/VERSION.md`.
4. Review and update `godot-client/project.godot` target metadata.
5. Rerun Godot/runtime/export smoke evidence.

---

## Decision 2: Product And Artifact Naming

### Selected

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

### Applied / Remaining Files To Update

Applied:

| File | Change |
| --- | --- |
| `production/releases/release-artifact-policy-0.1.0.md` | Records Brave Legend / `BraveLegend` as the selected clean RC naming convention. |

Remaining for the clean RC package implementation:

| File | Expected Change |
| --- | --- |
| `scripts/validate-goal-seven.mjs` | Switch local clean RC artifact checks to `build/windows/BraveLegend.exe` and `Play-Brave-Legend-Online.cmd` after the clean RC artifact exists |
| `production/qa/release-candidate-smoke-standard-0.1.0.md` | Future RC examples use `BraveLegend` artifact names |
| `production/qa/qa-plan-sprint-release-remediation-001.md` | Future hash commands and package names use `BraveLegend` |
| `production/releases/build-provenance-v0.1.0-rc.3.md` | Record the selected naming and produced archive |

Historical evidence files may retain `LuckyPackMMORPG` references because they describe already-captured internal debug artifacts.

---

## Decision 3: Artifact Storage

### Selected

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

### Applied / Remaining Changes

Applied:

1. Release artifact policy records GitHub Release attachment as the selected clean RC storage target.
2. `.gitignore` includes `release-archives/` for temporary local staging if needed.

Remaining:

1. Create a release archive from the accepted clean RC build output.
2. Record SHA256 for the archive and each included artifact.
3. Attach the archive to a GitHub prerelease or record the local archive path.
4. Update build provenance with the final release URL or archive path.

---

## Decision 4: `.gitignore` Generated Output Policy

### Selected

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

### Applied Files

| File | Expected Change |
| --- | --- |
| `.gitignore` | Added generated output ignores listed above |
| `production/releases/release-artifact-policy-0.1.0.md` | Marked `.gitignore` update approved/applied |

---

## Selected Decision Set

| Decision | Selected Path | Owner |
| --- | --- | --- |
| Godot version strategy | Accept ADR-0002: clean RC requires Godot 4.4 | Technical Director |
| Product/artifact naming | `勇者傳說 Brave Legend` / `BraveLegend` | Producer + Legal/Policy + Release Manager |
| Artifact storage | GitHub Release attachment on successor RC tag | Release Manager |
| `.gitignore` generated output policy | Exclude generated outputs and local archives | Release Manager + Technical Director |

---

## Implementation Stage After Source-Policy Application

After this source-policy application, the next implementation stage is:

1. Provision accepted Godot 4.4 tooling.
2. Align clean RC artifact naming in validators, package docs, smoke standard, and future provenance.
3. Rebuild a clean RC package from the accepted tag.
4. Create and checksum the release archive.
5. Push a successor tag, expected `v0.1.0-rc.3`.
6. Run remote CI and local RC smoke.
7. Update build provenance and release gate report.

---

## Acceptance Criteria

This decision package is ready for owner review when:

- [x] Godot version options and recommendation are documented.
- [x] Naming options and recommendation are documented.
- [x] Artifact storage options and recommendation are documented.
- [x] `.gitignore` generated output policy is documented.
- [x] Post-approval file changes are listed.
- [x] Owners select or revise each decision.
- [x] Approved source-policy decisions are applied in source.
- [ ] Accepted Godot 4.4 tooling is provisioned.
- [ ] Clean RC artifact naming is applied to generated package evidence.
- [ ] Clean RC package is rebuilt or validated.

---

## Current Verdict

**Decision readiness**: APPLIED FOR SOURCE POLICY.

**Clean RC package readiness**: BLOCKED until Godot 4.4 tooling is provisioned and a clean package is rebuilt or validated.
