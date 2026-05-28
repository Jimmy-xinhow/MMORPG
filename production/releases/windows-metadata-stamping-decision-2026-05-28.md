# Windows Metadata Stamping Decision

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / `rcedit` warning closure  
**CCGS Workflows**: Godot export workflow + release artifact policy adaptation  
**Owners**: Release Manager, Technical Director  
**Status**: Accepted for internal RC packages  

---

## Decision

For internal Windows RC packages, disable Godot Windows resource metadata modification:

```text
godot-client/export_presets.cfg
application/modify_resources=false
```

This removes the `rcedit` dependency from internal RC exports. The package remains an internal prerelease/test artifact and does not claim public Windows metadata, signing, store, or legal readiness.

---

## Context

The RC3 Godot 4.4 export completed with a warning because `application/modify_resources=true` required `rcedit`, but `rcedit` was not installed in the local release toolchain.

The warning did not affect boot stability, but it left the RC package with an avoidable export warning. For the internal release track, the safer short-term decision is to stop attempting metadata stamping until the public distribution path is selected.

---

## Alternatives Considered

| Alternative | Result | Reason |
| --- | --- | --- |
| Install/configure `rcedit` now | Deferred | Adds a new release tool dependency and still requires final product/legal metadata decisions before public distribution. |
| Keep `modify_resources=true` and accept the warning | Rejected for RC4 | Leaves every internal export with a known avoidable warning. |
| Disable `modify_resources` for internal RC | Accepted | Produces warning-free internal exports while keeping public metadata/signing as a separate release gate. |

---

## Validation

| Check | Result | Evidence |
| --- | --- | --- |
| Source change committed | PASS | Commit `9528dcaaef37bc6e48cb1c35bd7cb71ff41a294b` |
| Remote CI | PASS | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26551524332` |
| Clean worktree export | PASS | `C:\tmp\mmorpg-rc4`, tag `v0.1.0-rc.4` |
| `rcedit` warning absent | PASS | RC4 clean worktree export completed without the previous `rcedit` warning. |
| Archive boot smoke | PASS | `production/qa/evidence/rc-smoke-v0.1.0-rc.4.md` |

---

## Consequences

Positive:

- Internal RC exports no longer require `rcedit`.
- The previous warning-level blocker is closed for internal RC package validation.
- RC4 artifact provenance is tied to a clean CI-passing commit and draft prerelease attachment.

Negative / remaining limits:

- Windows file/product metadata is not stamped by Godot for internal RC packages.
- Public release still needs a final product metadata, code-signing, and distribution decision.
- If public Windows metadata is required later, owners must either configure `rcedit` or replace this decision with a public-launch metadata/signing policy.
