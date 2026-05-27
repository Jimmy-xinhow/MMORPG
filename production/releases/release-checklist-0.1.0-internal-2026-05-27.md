# Release Checklist: 0.1.0 Internal Test - Windows / Mobile Portrait

**Generated**: 2026-05-27
**Workflow**: CCGS `release-checklist` adapted for Codex
**Scope**: Godot Client Engineering internal release readiness
**Target Platforms**: Windows internal test package, mobile portrait client scope
**Primary Build**: `build/windows/LuckyPackMMORPG.exe`
**Go / No-Go**: NOT READY FOR CLEAN RELEASE

---

## Summary

Godot Client Engineering has QA sign-off with warnings and may proceed into release preparation. It is not clean release-ready because remote CI run evidence, target/runtime Godot version alignment, release artifact policy, and launch/support materials are still incomplete.

---

## Codebase Health

| Check | Result | Notes |
| --- | --- | --- |
| TODO count | 0 actionable | Scan found only historical wording inside `production/session-state/active.md`. |
| FIXME count | 0 | No actionable `FIXME` markers found outside ignored build/tool/temp outputs. |
| HACK count | 0 actionable | Scan found only historical wording inside `production/session-state/active.md`. |
| Open QA bugs | 0 | `production/qa/bugs/` does not exist; no formal bug reports were required. |
| Primary local gate | PASS | `npm.cmd run check` passed after QA sign-off. |
| CI workflow | CONFIGURED | `.github/workflows/tests.yml` runs `npm run check`. |
| Remote CI run | PENDING | No GitHub Actions run evidence is available from this non-git workspace. |

---

## Build Verification

| Item | Status | Evidence |
| --- | --- | --- |
| Windows export executable exists | PASS | `build/windows/LuckyPackMMORPG.exe`, 150822944 bytes. |
| Windows console wrapper exists | PASS | `build/windows/LuckyPackMMORPG.console.exe`. |
| Internal launcher exists | PASS | `build/windows/Play-Lucky-Pack-Online.cmd`. |
| Internal package README exists | PASS | `build/windows/README-INTERNAL-TEST.md`. |
| Windows export rebuilt from current Godot source | PASS | Recorded in `production/qa/smoke-2026-05-27.md`. |
| Rebuilt export boot smoke | PASS | Console wrapper headless `--quit-after 3` passed. |
| Build reproducible from tagged commit | BLOCKED | This workspace is not a Git repository, so no commit/tag evidence exists. |
| Build version number correctly set | WARNING | Package version is `0.1.0`; Godot/export version metadata has not been separately reviewed. |
| Build size budget | WARNING | Windows executable is about 144 MB; no formal budget is defined. |

---

## Quality Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| QA sign-off | PASS WITH WARNINGS | `production/qa/qa-signoff-godot-client-engineering-2026-05-27.md`. |
| Smoke check | PASS WITH WARNINGS | `production/qa/smoke-2026-05-27.md`. |
| Feature-page visible QA | PASS WITH NOTES | `production/qa/evidence/feature-page-visible-qa-2026-05-27.md`. |
| Bottom navigation click-through | PASS | `production/qa/evidence/bottom-nav-clickthrough-qa-2026-05-27.md`. |
| Restricted player-facing workflows hidden | PASS WITH NOTES | `production/qa/evidence/restricted-workflow-player-visible-review-2026-05-27.md`. |
| Zero S1/S2 QA bugs | PASS | No QA bug reports were created in this cycle. |
| Soak test | NOT RUN | No 4+ hour or 8+ hour soak protocol evidence exists. |
| Performance on minimum spec hardware | NOT RUN | No hardware performance profiling evidence exists. |
| Memory/leak check | NOT RUN | No extended runtime profiling evidence exists. |

---

## Platform Requirements: Windows Internal Test

| Requirement | Status | Notes |
| --- | --- | --- |
| Windowed launch works | PASS | Visible-window QA and bottom-nav evidence captured. |
| Mouse fallback works | PASS | Bottom navigation click-through validated via Windows export. |
| 432x768 portrait layout usable | PASS | Visible-window QA evidence exists. |
| Keyboard controls | NOT APPLICABLE | Current internal scope is touch-first with mouse fallback; gamepad support is out of scope. |
| Fullscreen/borderless/ultrawide | NOT APPLICABLE | Internal Windows package targets portrait windowed testing. |
| Graphics settings save/load | PARTIAL | System screen renders and apply action exists; persistence was not release-tested. |

---

## Platform Requirements: Mobile Portrait Scope

| Requirement | Status | Notes |
| --- | --- | --- |
| Touch-first UI shape | PASS WITH NOTES | 432x768 UI verified visually; actual physical mobile device touch testing not run. |
| Multiple mobile screen sizes | NOT RUN | Current evidence is fixed 432x768 logical viewport. |
| App Store / Play Store compliance | NOT APPLICABLE YET | No mobile store build is in scope for this internal package. |
| Permissions / privacy labels | NOT APPLICABLE YET | No mobile app package submission is in scope. |
| Battery/thermal behavior | NOT RUN | No mobile device soak or profiling evidence exists. |

---

## Content and Player-Facing Readiness

| Item | Status | Notes |
| --- | --- | --- |
| Production art visible in main pages | PASS | Feature-page screenshots show production composite art. |
| Placeholder replacement complete | PASS WITH NOTES | Validation scripts pass production art checks; release-wide content audit has not been run. |
| Player-facing restricted finance workflows hidden | PASS WITH NOTES | Gameplay purchase simulation and Boss reward settlement copy are allowed notes. |
| Text overlap/readability | PASS WITH NOTES | No severe overlap observed in current 432x768 evidence. |
| Localization readiness | NOT RUN | No localization scan or string externalization pass was performed. |
| Audio mix | NOT RUN | No audio QA evidence exists. |
| Credits/legal/store text | NOT READY | Store/distribution metadata and credits were not prepared in this cycle. |

---

## Store / Distribution

| Item | Status | Notes |
| --- | --- | --- |
| Distribution channel selected | PENDING | Current artifact is an internal Windows test package. |
| Store page metadata | NOT READY | No store metadata package exists. |
| Screenshots for store | NOT READY | QA screenshots exist, but store-specific image requirements are not prepared. |
| Trailer/key art/capsules | NOT READY | Not prepared in this cycle. |
| Age rating | NOT READY | No ESRB/PEGI/regional rating evidence exists. |
| Legal notices/EULA/privacy policy | PARTIAL | Web legal pages are smoke-tested; release legal package is not assembled. |
| Third-party license attributions | PENDING | No dependency/license audit evidence included in this checklist. |

---

## Launch Readiness

| Item | Status | Notes |
| --- | --- | --- |
| Analytics/telemetry | NOT READY | No telemetry verification evidence exists. |
| Crash reporting | NOT READY | No crash reporting integration evidence exists. |
| Day-one patch plan | NOT READY | No day-one patch scope exists. |
| First 72-hour on-call plan | NOT READY | No support rota exists. |
| Support FAQ / known issues | NOT READY | No support package exists. |
| Rollback plan | NOT READY | No release rollback procedure exists. |

---

## Blockers For Clean Release

1. No remote GitHub Actions run evidence after CI workflow creation.
2. No reproducible build evidence from a commit/tag because this workspace is not a Git repository.
3. Godot target version is 4.4, but local validation/export used 4.6.3; this must be aligned or explicitly accepted.
4. No release artifact policy for whether `build/windows/*` is versioned, archived, or distributed outside source control.
5. No soak/performance/memory profiling evidence.
6. No store/distribution/legal launch package.
7. No crash reporting, rollback, support, or launch operations plan.

---

## Accepted Internal-Test Risks

| Risk | Rationale |
| --- | --- |
| Fixed 432x768 viewport only | Matches current internal client scope and QA evidence. |
| Mouse fallback tested instead of physical mobile touch | Acceptable for Windows internal package; not acceptable for mobile store release. |
| Project-local `test/` convention instead of CCGS `tests/` | `npm.cmd run check` is documented as the primary gate and passes. |
| No remote CI run yet | Acceptable for local release checklist preparation, not for clean release sign-off. |

---

## Go / No-Go

**Decision**: NO-GO for clean public release.

**Internal Test Readiness**: GO WITH WARNINGS.

**Rationale**: The Godot client engineering slice has strong QA evidence and a working Windows internal package, but release operations, distribution, versioning, CI run evidence, and long-duration validation are incomplete.

---

## Sign-Offs Required Before Clean Release

- [ ] QA Lead
- [ ] Technical Director
- [ ] Producer
- [ ] Release Manager
- [ ] Legal / Policy Owner
- [ ] Operations / Support Owner

---

## Next Recommended Workflow

Run launch checklist dry-run after this release checklist, then resolve blockers in priority order:

1. Remote CI evidence.
2. Godot version strategy.
3. Release artifact policy.
4. Soak/performance validation.
5. Launch/support/legal package.
