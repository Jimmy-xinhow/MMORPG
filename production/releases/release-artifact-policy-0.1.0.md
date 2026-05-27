# Release Artifact Policy: 0.1.0

**Date**: 2026-05-27
**Workflow Context**: Release Remediation Sprint 001 / RR-004
**Owners**: Release Manager, Technical Director
**Status**: Proposed, pending RR-001 and ADR-0002 acceptance

---

## Purpose

Define how Windows release artifacts are produced, named, checksummed, archived, and tied back to source-control provenance for 0.1.0.

This policy does not rebuild, delete, rename, commit, or publish any artifact. It defines the rules that must be satisfied before a release candidate can be treated as reproducible evidence.

---

## Policy Summary

For 0.1.0, generated Windows build outputs are **not committed to git by default**.

Release artifacts must be:

1. Rebuilt from a tagged source commit.
2. Validated with the accepted Godot version strategy.
3. Stored as a versioned external archive or release attachment.
4. Recorded with SHA256 checksums.
5. Linked to CI/local validation evidence.

Current `build/windows/*` files remain valid internal-test artifacts, but they are not clean release candidate artifacts until rebuilt or revalidated from a tagged commit under this policy.

---

## Governing Inputs

| Input | Status | Notes |
| --- | --- | --- |
| RR-001 source-control provenance plan | Review | `production/releases/source-control-provenance-0.1.0.md` |
| ADR-0002 Godot release version strategy | Proposed | `docs/architecture/adr-0002-godot-release-version-strategy.md` |
| Existing release checklist | NO-GO for clean release | `production/releases/release-checklist-0.1.0-internal-2026-05-27.md` |
| Current smoke report | PASS WITH WARNINGS | `production/qa/smoke-2026-05-27.md` |
| Export preset | Present | `godot-client/export_presets.cfg`, preset `Windows Desktop` |

---

## Artifact Classes

### Internal Debug Package

Purpose:

- Internal QA and owner review.
- Local smoke testing.
- Feature-page visual QA.

Allowed evidence state:

- May be exported with debug settings.
- May include console wrapper.
- May use a documented internal-test version exception.
- May have `PASS WITH WARNINGS`.

Current example:

- `build/windows/LuckyPackMMORPG.exe`
- `build/windows/LuckyPackMMORPG.console.exe`
- `build/windows/Play-Lucky-Pack-Online.cmd`
- `build/windows/README-INTERNAL-TEST.md`

### Release Candidate Package

Purpose:

- Candidate for clean internal release gate.
- Must be reproducible from source-control tag.

Required evidence state:

- Source commit and tag recorded.
- Remote CI evidence recorded.
- Godot executable version recorded.
- Export preset and mode recorded.
- Artifact SHA256 checksums recorded.
- Smoke standard from RR-011 satisfied.
- Version/name consistency reviewed.

### Public Launch Candidate Package

Purpose:

- Candidate for public distribution.

Required evidence state:

- All release candidate requirements.
- Store/legal/distribution checklist complete.
- Launch operations package complete.
- Performance/soak/memory evidence complete.
- Localization release requirements complete or formally scoped out.
- `/gate-check release` no longer returns FAIL.
- `/team-release` sign-offs complete.

---

## Source-Control Policy

### Commit To Git

Commit source and reproducibility inputs:

- `src/`
- `scripts/`
- `test/`
- `godot-client/project.godot`
- `godot-client/export_presets.cfg`
- `godot-client/scenes/`
- `godot-client/scripts/`
- `godot-client/assets/production/` and other source assets required to rebuild the client
- `.github/workflows/tests.yml`
- `.claude/docs/`
- `design/`
- `docs/`
- `production/` planning, QA, release, and evidence documents
- `package.json`
- Lockfile, once one is generated and approved

### Exclude From Git By Default

Do not commit generated outputs by default:

- `node_modules/`
- `tmp/`
- `*.log`
- `godot-client/.godot/`
- `**/__pycache__/`
- `build/windows/`
- `build/internal-test/`

If owners decide to version generated build artifacts, that must be recorded as a specific exception in this policy or a superseding policy.

### Required `.gitignore` Update Before First Release Candidate Commit

After owner approval, update `.gitignore` to include:

```text
godot-client/.godot/
**/__pycache__/
build/windows/
build/internal-test/
```

Do not apply this change until the source-control route and artifact storage decision are approved.

---

## Naming Policy

### Required Naming Consistency Review

Current files and config are inconsistent:

| Source | Name |
| --- | --- |
| `godot-client/export_presets.cfg` export path | `../build/windows/BraveLegend.exe` |
| `scripts/package-windows-internal-test.ps1` expected executable | `BraveLegend.exe` |
| Current build artifact | `LuckyPackMMORPG.exe` |
| Current launcher | `Play-Lucky-Pack-Online.cmd` |
| Current package README title | `Lucky Pack MMORPG Windows Internal Test` |
| Godot product name | `勇者傳說 Brave Legend` |

Before any release candidate package is produced, owners must choose one product/artifact naming convention and apply it consistently to:

- Godot export path.
- Package script.
- Launcher script.
- README title.
- Release archive name.
- Build provenance record.

### Recommended Archive Naming

Use ASCII archive names for release files:

```text
lucky-pack-mmorpg-v0.1.0-rc.1-windows-internal.zip
lucky-pack-mmorpg-v0.1.0-internal.1-windows.zip
```

If the product-facing display name remains localized, keep localized naming inside product metadata, not release archive filenames.

---

## Version Policy

Current version fields:

| File | Field | Value |
| --- | --- | --- |
| `package.json` | `version` | `0.1.0` |
| `godot-client/export_presets.cfg` | `application/file_version` | `0.1.0.0` |
| `godot-client/export_presets.cfg` | `application/product_version` | `0.1.0.0` |

Release candidate evidence must record:

- Package version.
- Godot file/product version.
- Git tag.
- Artifact archive version.

Version mismatch is a blocker unless explicitly documented and approved.

---

## Build And Export Policy

Release candidate exports must use the accepted version strategy from ADR-0002 or a superseding ADR.

Current proposed rule:

- Clean release validation targets Godot 4.4.
- Godot 4.6.3 artifacts are internal-test exceptions unless an upgrade ADR is accepted.

Required export evidence:

- Godot executable path.
- Godot executable version.
- Export preset name: `Windows Desktop`.
- Export mode: debug/internal or release candidate.
- Export command.
- Output directory.
- Build timestamp.
- Build machine/environment note.

Debug/internal export evidence may continue to use:

```powershell
tools\godot-4.6.3\Godot_v4.6.3-stable_win64_console.exe --headless --export-debug "Windows Desktop"
```

Clean release candidate export command must be finalized after ADR-0002 is accepted or superseded.

---

## Checksum Policy

Every archived artifact must have SHA256 checksums recorded.

Minimum command:

```powershell
Get-FileHash -Algorithm SHA256 <artifact-path>
```

Current internal-test artifact sample:

| Artifact | SHA256 |
| --- | --- |
| `build/windows/LuckyPackMMORPG.exe` | `E9BE81D56241FEF4C0246A2DF2AF4A7A933B6C1FC294078F144A586E5D891784` |
| `build/windows/LuckyPackMMORPG.console.exe` | `7D0BD8DC6A58114ADE78C3C7A842DCEA8BE16276BB9F59F5FD822A8159F17E65` |
| `build/windows/Play-Lucky-Pack-Online.cmd` | `09693BB85BFC5C4723B74E2AF042C093B830344F2647E5E5234F5F5BC04C41ED` |
| `build/windows/README-INTERNAL-TEST.md` | `802B0E21ECA40AAA1734807AE61740C7288A657310094DE685BC43EC97FFF854` |

These checksums document the current internal-test artifact state only. They do not create clean release provenance because there is no source commit/tag yet.

---

## Build Provenance Record

Every release candidate must have a provenance file under `production/releases/`.

Recommended path:

```text
production/releases/build-provenance-v0.1.0-rc.1.md
```

Required fields:

| Field | Required |
| --- | --- |
| Repository remote URL | Yes |
| Branch | Yes |
| Commit SHA | Yes |
| Tag | Yes |
| CI workflow run URL | Yes |
| CI conclusion | Yes |
| Local validation command and result | Yes |
| Godot target version | Yes |
| Godot executable path | Yes |
| Godot executable version | Yes |
| Export preset | Yes |
| Export mode | Yes |
| Export command | Yes |
| Artifact archive path or release URL | Yes |
| Artifact file list | Yes |
| Artifact SHA256 checksums | Yes |
| Known warnings | Yes |
| Accepted risks | Yes |

---

## Storage Policy

Preferred storage for 0.1.0 release candidates:

1. GitHub Release attachment, once a remote repository exists.
2. If no remote repository exists yet, a local archive path under a non-source-controlled release archive directory.

Recommended local archive path while remote is pending:

```text
release-archives/v0.1.0-rc.1/
```

If this local path is used, add it to `.gitignore` unless owners explicitly choose to version archives.

---

## Acceptance Checklist

RR-004 is ready for owner sign-off when:

- [x] Policy states generated Windows artifacts are not committed by default.
- [x] Policy defines artifact classes: internal debug, release candidate, public launch candidate.
- [x] Policy defines checksum requirements.
- [x] Policy defines build provenance fields.
- [x] Policy records current internal-test artifact inventory and checksums.
- [x] Policy identifies naming inconsistency between `BraveLegend` config/scripts and `LuckyPackMMORPG` current artifacts.
- [ ] RR-001 source-control route is accepted.
- [ ] ADR-0002 is accepted or superseded.
- [ ] Owners choose final product/artifact naming convention.
- [ ] `.gitignore` update is approved.
- [ ] Release candidate storage target is approved.

---

## Impact On Release Blockers

This policy reduces the artifact-policy blocker to concrete owner decisions and evidence tasks.

It does not fully resolve the clean release blocker until:

1. Source control route and tag exist.
2. Godot version strategy is accepted.
3. Naming is consistent.
4. A release candidate is rebuilt or validated from the tagged source.
5. SHA256 checksums and provenance record are captured.
6. Remote CI evidence exists.
