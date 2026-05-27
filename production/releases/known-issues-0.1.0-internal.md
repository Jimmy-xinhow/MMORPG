# Known Issues: 0.1.0 Internal RC

**Date**: 2026-05-28  
**Package Scope**: `v0.1.0-rc.3` internal Windows release-candidate package  
**Status**: Draft known-issues record for RC smoke  

---

## Open Bug Threshold

| Check | Result |
| --- | --- |
| `production/qa/bugs/` exists | No |
| Open S1 bug files found | None |
| Open S2 bug files found | None |

No open S1/S2 bug tracker files were found in the workspace during RC smoke preparation.

---

## Known Warnings

| ID | Severity | Status | Owner | Notes |
| --- | --- | --- | --- | --- |
| KI-001 | Warning | Open | Release Manager + QA Lead | Full visible-window RC smoke from the archive has not been run yet. |
| KI-002 | Warning | Open | Release Manager + Technical Director | Godot 4.4 export completed with missing `rcedit` warning, so Windows file/product metadata stamping is not clean. |
| KI-003 | Warning | Open | QA Lead | Soak/performance/memory execution evidence is still pending. |
| KI-004 | Warning | Open | Producer + Operations Owner | Crash reporting, rollback, support intake, and on-call decisions remain pending for clean release. |
| KI-005 | Warning | Open | Legal / Policy Owner | Store/legal/distribution package remains checklist-only and is not accepted for public launch. |
| KI-006 | Warning | Open | Localization Owner | Localization readiness remains blocked by string table, font, text-in-image, string freeze, and localization QA decisions. |

---

## Verdict

No open S1/S2 bug files are present, but clean release remains blocked by warning-level release readiness gaps that require owner acceptance or execution evidence.
