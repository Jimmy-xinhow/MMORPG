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
| KI-001 | Warning | Closed | Release Manager + QA Lead | Full visible-window, bottom-navigation, and restricted-workflow RC smoke from the archive passed with notes on 2026-05-28. Evidence: `production/qa/evidence/rc-smoke-v0.1.0-rc.3.md`. |
| KI-002 | Warning | Closed | Release Manager + Technical Director | Internal RC `rcedit` warning closed in `v0.1.0-rc.4` by disabling Godot Windows metadata stamping. Evidence: `production/releases/windows-metadata-stamping-decision-2026-05-28.md` and `production/qa/evidence/rc-smoke-v0.1.0-rc.4.md`. |
| KI-003 | Warning | Open | QA Lead + Performance Analyst | Automated RC4 boot timing, 10-minute memory pilot, and short Godot 4.4 FPS/frame-time feasibility pass completed with limitations; full 2-hour human-observed soak, packaged executable FPS acceptance, and owner sign-offs remain pending. |
| KI-004 | Warning | Open | Producer + Operations Owner | Crash reporting, rollback, support intake, and on-call decisions remain pending for clean release. |
| KI-005 | Warning | Open | Legal / Policy Owner | Store/legal/distribution package remains checklist-only and is not accepted for public launch. |
| KI-006 | Warning | Open | Localization Owner | Localization readiness remains blocked by string table, font, text-in-image, string freeze, and localization QA decisions. |
| KI-007 | Warning | Open | Release Manager + Legal / Policy Owner | Public Windows file/product metadata and signing remain unresolved; RC4 only disables metadata stamping for internal packages. |

---

## Verdict

No open S1/S2 bug files are present. RC3 archive smoke passes with warnings, and RC4 closes the internal RC `rcedit` warning. Clean release remains blocked by the remaining warning-level release readiness gaps that require owner acceptance or execution evidence.
