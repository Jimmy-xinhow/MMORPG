# Source-Control Provenance Plan: 0.1.0

**Date**: 2026-05-27
**Workflow Context**: Release Remediation Sprint 001 / RR-001
**Owners**: Producer, Release Manager
**Status**: Existing remote route selected; local repo initialized

---

## Purpose

Define how the 0.1.0 release candidate will be tied to source control, CI evidence, and build provenance before any clean release gate can pass.

This plan does not initialize git, create commits, create tags, or connect a remote. Those actions require explicit owner approval because this workspace currently is not a git repository.

---

## Current State

| Check | Result | Evidence |
| --- | --- | --- |
| Git repository | Present | `git rev-parse --is-inside-work-tree` returns `true` after 2026-05-28 initialization |
| Selected route | Existing remote | User selected Option A on 2026-05-28 |
| Remote URL | Set | `origin` points to `https://github.com/Jimmy-xinhow/MMORPG.git` |
| Remote history | Empty after fetch | `git fetch origin` succeeded; `git branch -r` returned no remote branches |
| Local branch | `main` | `git branch -M main` completed after safe-directory setup |
| CI workflow file | Present | `.github/workflows/tests.yml` |
| Primary local gate | Present | `npm.cmd run check` |
| Lockfile | Not present | No `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lockb` found |
| Windows internal artifacts | Present | `build/windows/LuckyPackMMORPG.exe`, console wrapper, launcher, README |
| Existing `.gitignore` | Minimal | Ignores `node_modules/`, `tmp/`, and `*.log` |

---

## Required Owner Decision

The source-control route has been selected. RR-002 remote CI evidence can proceed after the baseline commit/tag is pushed and a GitHub Actions run is available.

### Option A - Connect to Existing Remote

Use this if the project already has an intended GitHub repository.

**Selected**: 2026-05-28.

Remote:

```text
https://github.com/Jimmy-xinhow/MMORPG.git
```

Fetch result:

- `origin` configured for fetch and push.
- `git fetch origin` succeeded.
- No remote branches were returned by `git branch -r`, so no remote-history reconciliation conflict was detected.
- The local branch was renamed to `main`.

Required owner inputs:

- Remote URL.
- Default branch name.
- Whether current workspace should be committed as-is or reconciled against existing remote history first.
- Whether generated build artifacts should be excluded before first commit.

Recommended when:

- There is already a project repository, issue tracker, or GitHub Actions history.
- Release provenance must connect to an existing product/project identity.

Risk:

- Existing remote history may conflict with local files and requires careful reconciliation.

### Option B - Initialize New Repository For This Workspace

Use this if this local workspace is the source of truth.

Recommended defaults:

- Default branch: `main`
- Initial commit message: `chore: establish 0.1.0 release candidate baseline`
- First release candidate tag: `v0.1.0-rc.1`
- Clean internal release tag after gate pass: `v0.1.0-internal.1`

Recommended when:

- No remote repository exists.
- The current workspace is the only reliable project state.

Risk:

- Later migration to a different remote will need explicit mapping of tags and release evidence.

---

## Branch And Tag Policy

Recommended policy:

| Purpose | Name |
| --- | --- |
| Default branch | `main` |
| Release remediation work branch, if branch workflow is used | `release/0.1.0-remediation` |
| First release candidate tag | `v0.1.0-rc.1` |
| Subsequent release candidates | `v0.1.0-rc.2`, `v0.1.0-rc.3`, ... |
| Internal test package tag after release gate approval | `v0.1.0-internal.1` |

Rules:

- Every release candidate package must reference exactly one commit SHA.
- Every remote CI evidence record must reference the same commit SHA as the release candidate.
- Tags should be created only after `npm.cmd run check` passes locally.
- A clean public release tag must not be created while `/gate-check release` returns FAIL.

---

## Generated Output Policy - Initial Recommendation

This is a source-control provenance plan only. RR-004 will define the full release artifact policy. Until RR-004 is complete, use the conservative source-control default below.

### Commit To Source Control

- Source code under `src/`, `scripts/`, `test/`, `godot-client/scripts/`, `godot-client/scenes/`, and project configs.
- Design, architecture, QA, release, and sprint documents.
- Production art source assets required to reproduce the Godot client.
- `.github/workflows/tests.yml`.
- `.claude/docs/` project execution and technical preference documents.

### Do Not Commit By Default

- `node_modules/`
- `tmp/`
- `*.log`
- `godot-client/.godot/`
- Python `__pycache__/`
- Generated Windows build artifacts under `build/windows/` until RR-004 decides whether they are versioned or archived externally.
- Generated internal build copies under `build/internal-test/` until RR-004 decides artifact storage.

### `.gitignore` Gaps To Resolve Before First Commit

Current `.gitignore` only covers:

```text
node_modules/
tmp/
*.log
```

Before the first release candidate commit, review whether to add:

```text
godot-client/.godot/
**/__pycache__/
build/windows/
build/internal-test/
```

Do not change `.gitignore` until the owner approves the artifact policy, because build artifacts may intentionally be archived or versioned for internal distribution.

---

## Build Provenance Record Fields

Each release candidate evidence record must include:

- Repository remote URL.
- Branch name.
- Commit SHA.
- Tag name.
- CI workflow name and run URL.
- CI conclusion.
- Local validation command and result.
- Godot executable path and version used for export/validation.
- Export preset name.
- Build command.
- Output artifact paths.
- Output artifact SHA256 checksums.
- Release checklist version reviewed.
- Known warnings and accepted risks.

Recommended evidence file:

`production/releases/build-provenance-v0.1.0-rc.1.md`

---

## Minimum Command Sequence After Owner Approval

### New Repository Path

```powershell
git init
git branch -M main
git status --short
npm.cmd run check
git add .
git commit -m "chore: establish 0.1.0 release candidate baseline"
git tag v0.1.0-rc.1
```

Then add the remote, push branch and tag, and capture GitHub Actions evidence.

### Existing Remote Path

```powershell
git init
git remote add origin <remote-url>
git fetch origin
git status --short
```

Then reconcile local files against the remote branch before committing. Do not push until the owner approves the reconciliation result.

---

## QA Acceptance Mapping

This plan satisfies RR-001 when:

- [x] It names current source-control state.
- [x] It defines repo-source options.
- [x] It defines branch and tag naming.
- [x] It identifies generated outputs that need ignore/archive decisions.
- [x] It defines build provenance fields.
- [x] Owner selects existing remote or new repository path.
- [ ] Producer and Release Manager sign-off is recorded.

---

## Impact On Release Blockers

This plan partially resolves the release blocker: "No reproducible build evidence from commit/tag."

The source-control route is now selected and initialized locally. Remaining actions:

1. Create baseline commit and tag.
2. Push `main` and `v0.1.0-rc.1` to the selected remote.
3. Capture RR-002 GitHub Actions evidence.
4. Record final commit/tag/CI evidence in a build provenance record.
