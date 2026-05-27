# ADR-0002: Godot Release Version Strategy

## Status

Proposed

## Date

2026-05-27

## Engine Compatibility

| Field | Value |
| --- | --- |
| **Engine** | Godot 4.4 target |
| **Domain** | Core / Build and Release |
| **Knowledge Risk** | MEDIUM |
| **References Consulted** | `docs/engine-reference/godot/VERSION.md`, `.claude/docs/technical-preferences.md`, `godot-client/project.godot`, `godot-client/export_presets.cfg`, `production/qa/smoke-2026-05-27.md`, `production/releases/release-checklist-0.1.0-internal-2026-05-27.md` |
| **Post-Cutoff APIs Used** | None introduced by this ADR |
| **Verification Required** | Clean release validation must use Godot 4.4 or a later accepted ADR must formally upgrade the target/runtime version. |

Engine reference gaps:

- `docs/engine-reference/godot/modules/core.md` is not present.
- `docs/engine-reference/godot/breaking-changes.md` is not present.
- `docs/engine-reference/godot/deprecated-apis.md` is not present.

Because these references are missing, this ADR avoids any new Godot API claims and only governs release-version policy.

## ADR Dependencies

| Field | Value |
| --- | --- |
| **Depends On** | ADR-0001 |
| **Enables** | RR-004 Release Artifact Policy, RR-011 Release Candidate Smoke Standard |
| **Blocks** | Clean release candidate packaging until Accepted or superseded |
| **Ordering Note** | Resolve this ADR before rebuilding or claiming a clean release candidate package. |

## Context

### Problem Statement

The project target is Godot 4.4, but the latest local validation and Windows export evidence used Godot 4.6.3 from `tools/godot-4.6.3/`. This is acceptable for internal test evidence only if explicitly documented, but it is not sufficient for clean release provenance because the release candidate would not be validated on the pinned engine version.

### Current Evidence

- `.claude/docs/technical-preferences.md` states the engine is Godot 4.4.
- `docs/engine-reference/godot/VERSION.md` states the pinned engine is Godot 4.4.
- `godot-client/project.godot` contains `config/features=PackedStringArray("4.4")`.
- Local Godot executable available in this workspace is `tools/godot-4.6.3/Godot_v4.6.3-stable_win64_console.exe`.
- That executable reports version `4.6.3.stable.official.7d41c59c4`.
- `production/qa/smoke-2026-05-27.md` records Godot 4.4 target validated locally with Godot 4.6.3.
- `production/releases/release-checklist-0.1.0-internal-2026-05-27.md` lists the version mismatch as a clean release blocker.

### Constraints

- Do not change `godot-client/project.godot` during this ADR.
- Do not install Godot 4.4 without owner approval.
- Do not claim clean release readiness from a runtime mismatch.
- Preserve current Windows internal test evidence as useful but warning-bearing.
- Keep the 432x768 mobile portrait client contract.
- Keep ADR-0001 boundaries: Godot remains the player-facing shell and Node remains authoritative for game rules.

### Requirements

- Release validation must identify the exact Godot executable and version used.
- Release artifact provenance must record the engine version used for export.
- Internal test packages may use documented exceptions.
- Clean release packages must either match the pinned engine or be backed by an accepted target-version upgrade decision.

## Decision

Clean release validation will remain pinned to **Godot 4.4**.

Godot 4.6.3 validation evidence may be retained as an **internal-test exception** only. It can support local engineering confidence and internal Windows testing, but it cannot by itself clear the clean release blocker.

Before a clean release candidate can pass `/gate-check release`, one of these must happen:

1. Godot 4.4 is made available locally or in CI, and the release candidate is validated/exported with Godot 4.4.
2. A later accepted ADR supersedes this one and formally upgrades the project target/runtime to Godot 4.6.3, including project reference updates and release regression evidence.

### Architecture Diagram

```text
Project pin: Godot 4.4
        |
        v
Clean release validation requires Godot 4.4 evidence
        |
        +-- Godot 4.4 available -> export/validate RC -> eligible for clean release gate
        |
        +-- only Godot 4.6.3 available -> internal-test evidence only -> release gate warning remains
        |
        +-- owner approves upgrade ADR -> update target references -> revalidate -> eligible after evidence
```

### Key Interfaces

This ADR creates release-process requirements rather than runtime code interfaces.

Required provenance fields for any Godot release candidate:

- `godot_target_version`
- `godot_executable_path`
- `godot_executable_version`
- `export_preset`
- `export_mode`
- `source_commit`
- `artifact_sha256`
- `validation_commands`
- `validation_result`
- `accepted_version_exception`, if applicable

## Alternatives Considered

### Alternative 1: Accept Godot 4.6.3 As Clean Release Runtime Immediately

- **Description**: Treat current 4.6.3 validation/export evidence as sufficient and update release blockers to resolved.
- **Pros**: Fastest path; no need to obtain Godot 4.4.
- **Cons**: Contradicts the pinned project version and current technical preferences; risks untracked behavior differences; weakens release provenance.
- **Rejection Reason**: This would silently convert a warning into release acceptance without a formal upgrade decision.

### Alternative 2: Require Godot 4.4 For Clean Release Validation

- **Description**: Keep Godot 4.4 as the release target and require 4.4 validation/export evidence before clean release readiness.
- **Pros**: Aligns with current project pin, technical preferences, and engine reference; preserves clear provenance.
- **Cons**: Requires obtaining or configuring Godot 4.4 before clean release; may delay release gate progress.
- **Rejection Reason**: Not rejected. This is the proposed decision.

### Alternative 3: Dual-Track Validation On Godot 4.4 And 4.6.3

- **Description**: Require both 4.4 and 4.6.3 validation for every release candidate.
- **Pros**: Strong compatibility signal and future upgrade confidence.
- **Cons**: More expensive and unnecessary for the current internal release scope; doubles export/runtime evidence requirements.
- **Rejection Reason**: Too heavy for the current remediation sprint. It can be added later if upgrade risk becomes central.

## Consequences

### Positive

- Keeps release provenance aligned with the documented engine target.
- Prevents accidental public release claims based on a mismatched runtime.
- Allows current 4.6.3 evidence to remain useful for internal testing without overstating it.
- Provides RR-004 and RR-011 with a concrete version policy.

### Negative

- Clean release cannot pass until Godot 4.4 evidence exists or an upgrade ADR is accepted.
- Build/export automation may need a Godot 4.4 executable path or CI setup.
- Current Windows export evidence remains warning-bearing.

### Risks

- **Godot 4.4 executable unavailable locally**: Mitigate by obtaining approved Godot 4.4 tooling or using CI with a pinned Godot 4.4 runtime.
- **Owner prefers upgrade to 4.6.3**: Mitigate by superseding this ADR with a formal upgrade ADR and full regression/export evidence.
- **Reference docs are incomplete**: Mitigate by avoiding new API claims in this ADR and verifying runtime behavior through local commands.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
| --- | --- | --- |
| `design/gdd/godot-client-engineering.md` | Godot preserves the 432x768 mobile portrait interface. | Requires release validation on the pinned Godot target before clean release claims. |
| `design/gdd/godot-client-engineering.md` | Godot uses the Node backend as the authoritative player-safe API layer. | Keeps engine version changes from silently changing client/backend release confidence without regression evidence. |
| `design/gdd/game-concept.md` | Godot runs a 432x768 portrait internal client. | Keeps internal-test evidence distinct from clean release validation. |

## Performance Implications

- **CPU**: No runtime impact. This ADR changes validation policy only.
- **Memory**: No runtime impact.
- **Load Time**: No runtime impact.
- **Network**: No runtime impact.
- **Release Process**: Adds a required version check to release candidate validation.

## Migration Plan

1. Keep current `godot-client/project.godot` target at Godot 4.4.
2. Locate or provision a Godot 4.4 executable for local or CI release validation.
3. Record the executable path and version in release candidate evidence.
4. Run:

```powershell
npm.cmd run check:godot
npm.cmd run check
```

5. Rebuild or validate the release candidate with the accepted Godot version.
6. Update the release checklist blocker from unresolved to resolved or accepted-risk only after evidence exists.

If the owner chooses to upgrade to 4.6.3 instead:

1. Write a superseding ADR.
2. Update `.claude/docs/technical-preferences.md`.
3. Update `docs/engine-reference/godot/VERSION.md`.
4. Review `godot-client/project.godot` target metadata.
5. Rebuild the export and rerun all smoke/QA evidence under the upgraded target.

## Validation Criteria

This ADR is ready to accept when:

- Owner confirms Godot 4.4 remains the clean release target, or explicitly requests an upgrade ADR instead.
- A Godot 4.4 validation/export path is identified.
- RR-004 release artifact policy references this version strategy.
- RR-011 release candidate smoke standard requires exact Godot version evidence.

Clean release validation passes this decision when:

- The release candidate evidence records a Godot 4.4 executable path and version, or an accepted superseding ADR records the 4.6.3 upgrade.
- `npm.cmd run check:godot` passes under the accepted version strategy.
- `npm.cmd run check` passes.
- The release checklist blocker for Godot target/runtime mismatch is updated with evidence.

## Related Decisions

- ADR-0001: Godot Client Modular UI Boundary
- `docs/engine-reference/godot/VERSION.md`
- `.claude/docs/technical-preferences.md`
- `production/releases/source-control-provenance-0.1.0.md`
- `production/qa/qa-plan-sprint-release-remediation-001.md`
