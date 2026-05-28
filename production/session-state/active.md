## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-001-extract-player-api-bridge.md` - Extract Player API Bridge
- Files changed: `godot-client/scripts/player_api_client.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`, `scripts/validate-goal-seven.mjs`
- Test written: Existing validation scripts updated to scan all Godot scripts for API integration strings.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: `/story-done production/epics/godot-client-engineering/story-001-extract-player-api-bridge.md` after approval to close the story.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-001-extract-player-api-bridge.md` - Extract Player API Bridge
- Tech debt logged: None
- Next recommended: `production/epics/godot-client-engineering/story-002-extract-page-flow-state.md`

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-002-extract-page-flow-state.md` - Extract Page Flow State
- Files changed: `godot-client/scripts/page_flow_state.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`
- Test written: Existing Godot prototype validation updated to scan all Godot scripts for sub-view support.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for HUD/view decomposition or live page UI binding.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-002-extract-page-flow-state.md` - Extract Page Flow State
- Tech debt logged: None
- Next recommended: HUD/view decomposition or live page UI binding story.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-003-extract-player-state-mapper.md` - Extract Player State Mapper
- Files changed: `godot-client/scripts/player_state_mapper.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`
- Test written: Existing Godot prototype validation updated to scan all Godot scripts for player-safe payload field consumption.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for HUD presenter extraction.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-003-extract-player-state-mapper.md` - Extract Player State Mapper
- Tech debt logged: None
- Next recommended: HUD presenter extraction, then live page UI binding.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-004-extract-hud-presenter.md` - Extract HUD Presenter
- Files changed: `godot-client/scripts/hud_presenter.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`
- Test written: Existing Godot prototype validation updated to accept HUD visibility rules outside `Main.gd`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for quest/status presenter extraction.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-004-extract-hud-presenter.md` - Extract HUD Presenter
- Tech debt logged: None
- Next recommended: Quest/status presenter extraction, then feature page renderer extraction.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-005-extract-quest-status-presenter.md` - Extract Quest Status Presenter
- Files changed: `godot-client/scripts/quest_status_presenter.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`
- Test written: Existing Godot prototype validation updated to require quest/status presenter delegation and home feed filtering outside `Main.gd`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for feature page renderer extraction.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-005-extract-quest-status-presenter.md` - Extract Quest Status Presenter
- Tech debt logged: None
- Next recommended: Feature page renderer extraction, then live page UI binding.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-006-extract-feature-page-renderer.md` - Extract Feature Page Renderer
- Files changed: `godot-client/scripts/feature_page_renderer.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`
- Test written: Existing Godot prototype validation updated to require feature page refresh delegation, title lookup, home skip, and renderer dispatch outside `Main.gd`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for pack page live state binding.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-006-extract-feature-page-renderer.md` - Extract Feature Page Renderer
- Tech debt logged: None
- Next recommended: Pack page live state binding, then market page live state binding.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-007-pack-page-live-state-binding.md` - Pack Page Live State Binding
- Files changed: `godot-client/scripts/pack_page_state_binder.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`
- Test written: Existing Godot prototype validation updated to require pack page live-state rendering and focus-card synchronization through `PackPageStateBinder`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for market page live state binding.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-007-pack-page-live-state-binding.md` - Pack Page Live State Binding
- Tech debt logged: None
- Next recommended: Market page live state binding, then role/equipment live binding.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-008-market-page-live-state-binding.md` - Market Page Live State Binding
- Files changed: `godot-client/scripts/market_page_state_binder.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`
- Test written: Existing Godot prototype validation updated to require market page live-state rendering and row synchronization through `MarketPageStateBinder`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for role/equipment live binding.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-008-market-page-live-state-binding.md` - Market Page Live State Binding
- Tech debt logged: None
- Next recommended: Role/equipment live binding, then inventory/skills live binding.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-009-role-equipment-live-binding.md` - Role/Equipment Live Binding
- Files changed: `godot-client/scripts/role_equipment_state_binder.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`, `production/epics/godot-client-engineering/EPIC.md`, `production/epics/godot-client-engineering/story-009-role-equipment-live-binding.md`
- Test written: Existing Godot prototype validation updated to require role/equipment live-state rendering and local/backend synchronization through `RoleEquipmentStateBinder`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for inventory/skills live binding.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-009-role-equipment-live-binding.md` - Role/Equipment Live Binding
- Tech debt logged: None
- Next recommended: Inventory/skills live binding, then challenge/guild/system page live binding.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-010-inventory-skills-live-binding.md` - Inventory/Skills Live Binding
- Files changed: `godot-client/scripts/inventory_skill_state_binder.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`, `production/epics/godot-client-engineering/EPIC.md`, `production/epics/godot-client-engineering/story-010-inventory-skills-live-binding.md`
- Test written: Existing Godot prototype validation updated to require inventory and skill live-state rendering plus local/backend synchronization through `InventorySkillStateBinder`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: create the next Godot client engineering story for challenge/guild/system page live binding.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-010-inventory-skills-live-binding.md` - Inventory/Skills Live Binding
- Tech debt logged: None
- Next recommended: Challenge/guild/system page live binding, then Godot runtime/editor validation once CLI is available.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-011-challenge-guild-system-live-binding.md` - Challenge/Guild/System Live Binding
- Files changed: `godot-client/scripts/challenge_guild_system_state_binder.gd`, `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`, `production/epics/godot-client-engineering/EPIC.md`, `production/epics/godot-client-engineering/story-011-challenge-guild-system-live-binding.md`
- Test written: Existing Godot prototype validation updated to require challenge, guild, and system live-state rendering plus local action synchronization through `ChallengeGuildSystemStateBinder`.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: run cleanup story for unreachable fallback render blocks, then Godot runtime/editor validation once CLI is available.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-011-challenge-guild-system-live-binding.md` - Challenge/Guild/System Live Binding
- Tech debt logged: None
- Next recommended: cleanup unreachable fallback render blocks, then Godot runtime/editor validation and sprint QA close-out.

## Session Extract - /dev-story 2026-05-27
- Story: `production/epics/godot-client-engineering/story-012-cleanup-unreachable-fallback-render-blocks.md` - Cleanup Unreachable Fallback Render Blocks
- Files changed: `godot-client/scripts/Main.gd`, `scripts/validate-godot-prototype.mjs`, `production/epics/godot-client-engineering/EPIC.md`, `production/epics/godot-client-engineering/story-012-cleanup-unreachable-fallback-render-blocks.md`
- Test written: Existing Godot prototype validation updated to reject unreachable fallback `_add_visual_grid` blocks after live render returns.
- Verification: `npm.cmd run check` passed.
- Blockers: Godot CLI is not available on PATH, so runtime/editor parse validation was not run in this shell.
- Next: install or expose Godot CLI for runtime/editor validation, then run sprint QA close-out.

## Session Extract - /story-done 2026-05-27
- Verdict: COMPLETE WITH NOTES
- Story: `production/epics/godot-client-engineering/story-012-cleanup-unreachable-fallback-render-blocks.md` - Cleanup Unreachable Fallback Render Blocks
- Tech debt logged: None
- Next recommended: Godot runtime/editor validation, Windows package smoke, then sprint QA close-out.

## Session Extract - Godot runtime/editor validation 2026-05-27
- Workflow: CCGS Godot validation with automated smoke-check subset.
- Godot CLI: `tools/godot-4.6.3/Godot_v4.6.3-stable_win64_console.exe`
- Engine observed: `4.6.3.stable.official.7d41c59c4`
- Verification:
  - `--check-only --script res://scripts/Main.gd` passed with exit code 0.
  - `--path godot-client --quit` passed with exit code 0.
  - `--path godot-client --quit-after 3` passed with exit code 0.
- Notes: the project target remains Godot 4.4 per technical preferences; this validation used the local bundled 4.6.3 console executable because `godot` is not on PATH.
- Next recommended: Windows internal package smoke, then sprint QA close-out or QA plan generation.

## Session Extract - Windows internal package smoke 2026-05-27
- Workflow: CCGS Godot export/package validation with automated smoke-check subset.
- Package command: `npm.cmd run godot:package:windows`
- Output directory: `build/windows`
- Artifacts verified:
  - `build/windows/LuckyPackMMORPG.exe`
  - `build/windows/LuckyPackMMORPG.console.exe`
  - `build/windows/Play-Lucky-Pack-Online.cmd`
  - `build/windows/README-INTERNAL-TEST.md`
- Runtime smoke: `build/windows/LuckyPackMMORPG.console.exe --headless --quit-after 3 -- --api-base=https://lucky-pack-api-production.up.railway.app` passed with exit code 0.
- Notes: this confirms export boot viability in headless mode; manual visual QA is still required for the player-facing windowed launcher.
- Next recommended: sprint QA close-out or QA plan generation, then formal smoke-check report after user approval.

## Session Extract - Sprint QA close-out scan 2026-05-27
- Scope: `production/epics/godot-client-engineering` stories 001-012.
- Story status: 12/12 stories marked Complete in `EPIC.md`.
- Traceability: all story files reference `design/gdd/godot-client-engineering.md` and ADR-0001.
- Evidence found: each story has a `Status`, `Test Evidence`, and `Residual Risk` section.
- Risk marker scan: no `TODO`, `FIXME`, `HACK`, `BLOCKED`, `NOT STARTED`, or `IN PROGRESS` markers found in the Godot client engineering epic, Godot scripts, or validation scripts.
- Test setup note: this project uses `test/` plus `npm.cmd run check`; the upstream smoke-check workflow expects `tests/`, so QA reports must record the project-local test convention explicitly.
- QA artifact gap: `production/qa` does not exist yet; formal QA plan and smoke-check report still require user approval before writing per CCGS QA workflow rules.
- Close-out recommendation: generate a Godot client engineering QA plan, then ask for approval to write the formal smoke-check report.

<!-- QA-PLAN: 2026-05-27 | System: godot-client-engineering | Plan written: production/qa/qa-plan-godot-client-engineering-2026-05-27.md -->

## Session Extract - Smoke check report 2026-05-27
- Workflow: CCGS smoke-check adapted to project-local test conventions.
- Scope: Godot Client Engineering epic stories 001-012.
- Report written: `production/qa/smoke-2026-05-27.md`
- Automated verdict: PASS.
- Overall verdict: PASS WITH WARNINGS.
- Evidence: `npm.cmd run check` passed with 47 tests passing, UI/API/production smoke passing, Godot script parse passing, and Windows export headless boot passing.
- Warnings: manual visible-window QA not run, no `.github/workflows` CI evidence found, target Godot 4.4 validated with local Godot 4.6.3, and `godot` is not on PATH.
- Next recommended: manual visible-window QA using `build/windows/Play-Lucky-Pack-Online.cmd`, then QA sign-off or next epic planning.

## Session Extract - Manual visible-window QA evidence 2026-05-27
- Workflow: CCGS smoke-check/test-evidence workflow with screenshot evidence.
- Build launched: `build/windows/LuckyPackMMORPG.exe`
- Evidence written:
  - `production/qa/evidence/godot-client-visible-window-2026-05-27.png`
  - `production/qa/evidence/godot-client-window-crop-2026-05-27.png`
  - `production/qa/evidence/manual-visible-window-qa-2026-05-27.md`
- Verified: visible Windows Godot window, portrait home layout, readable top HUD, character stage, enemy target, quest/status panel, bottom navigation, and no visible market rows/listing prices/settlement/withdrawal/tax/payout workflows on home.
- Still pending: manual clicking through pack, market, role, inventory, skills, challenge, guild, and system pages.
- Smoke report updated: visible-window warning reduced to partial home-screen verification; overall verdict remains PASS WITH WARNINGS.

## Session Extract - Feature-page visible QA evidence 2026-05-27
- Workflow: CCGS smoke-check/test-evidence workflow with screenshot evidence.
- Evidence written: `production/qa/evidence/feature-page-visible-qa-2026-05-27.md`
- Windows export evidence captured: home, role, packs, market, challenge.
- Local Godot runtime evidence captured: guild, system.
- QA finding: Windows export startup args and DPI-aware click retry did not produce guild/system page captures; local Godot runtime renders both pages correctly from current source.
- Scope note: `inventory` and `skills` renderers exist but are not in `PAGE_NAMES`, so they were not verified as direct bottom-navigation pages.
- Smoke report updated: feature-page visual QA is now PARTIAL with export warnings.
- Next recommended: rebuild Windows export from current `godot-client`, then re-run guild/system export visual QA.

## Session Extract - Rebuilt Windows export visual QA 2026-05-27
- Workflow: CCGS Godot export/package validation with smoke-check/test-evidence review.
- Export rebuilt: Godot 4.6.3 console `--headless --export-debug "Windows Desktop"` to `build/windows/LuckyPackMMORPG.exe`.
- Package command: `npm.cmd run godot:package:windows`.
- Runtime smoke: rebuilt `build/windows/LuckyPackMMORPG.console.exe --headless --quit-after 3 -- --api-base=https://lucky-pack-api-production.up.railway.app` passed with exit code 0.
- Evidence updated:
  - `production/qa/evidence/feature-guild-window-rebuilt-export-2026-05-27.png`
  - `production/qa/evidence/feature-system-window-rebuilt-export-2026-05-27.png`
  - `production/qa/evidence/feature-page-visible-qa-2026-05-27.md`
  - `production/qa/smoke-2026-05-27.md`
- Result: guild and system now render correctly in the rebuilt Windows export; the previous export freshness warning is resolved.
- Notes: normal screen-region capture was occluded by another foreground window, so validated evidence used Windows `PrintWindow` by the game window handle. The export log included a non-blocking Godot editor settings save warning.
- Next recommended: run full bottom-navigation click-through QA, then prepare QA sign-off or launch/release checklist.

## Session Extract - Bottom navigation click-through QA 2026-05-27
- Workflow: CCGS smoke-check/test-evidence workflow with Godot Windows export GUI validation.
- Build launched: `build/windows/LuckyPackMMORPG.exe`
- Evidence written: `production/qa/evidence/bottom-nav-clickthrough-qa-2026-05-27.md`
- Valid screenshot evidence:
  - `production/qa/evidence/nav-post-home-window-2026-05-27.png`
  - `production/qa/evidence/nav-post-role-window-2026-05-27.png`
  - `production/qa/evidence/nav-post-packs-window-2026-05-27.png`
  - `production/qa/evidence/nav-post-market-window-2026-05-27.png`
  - `production/qa/evidence/nav-post-challenge-window-2026-05-27.png`
  - `production/qa/evidence/nav-post-guild-window-2026-05-27.png`
  - `production/qa/evidence/nav-post-system-window-2026-05-27.png`
- Result: bottom navigation click-through passed for home, role, packs, market, challenge, guild, and system.
- Excluded evidence: first-round `nav-click-*` screenshots were not used because OS cursor automation did not reliably trigger navigation and reported abnormal screen coordinates.
- Smoke report updated: bottom navigation interaction changed from NOT RUN to PASS.
- Next recommended: final player-facing restricted-workflow review, then QA sign-off review or CI workflow setup.

## Session Extract - CI workflow evidence 2026-05-27
- Workflow: CCGS test-setup plus smoke-check adaptation for this project-local Node QA gate.
- CI workflow added: `.github/workflows/tests.yml`
- Evidence written: `production/qa/evidence/ci-evidence-2026-05-27.md`
- CI trigger: push and pull request to `main`.
- CI gate: Node.js 20, dependency install, then `npm run check`.
- Local validation: `npm.cmd run check` run after workflow creation.
- Result: CI configuration is present and aligned with the local QA gate.
- Limitation: remote GitHub Actions run evidence is not available from this workspace because it is not a Git repository and has no GitHub run metadata.
- Next recommended: run QA sign-off review, then capture remote CI evidence after committing and pushing to GitHub.

## Session Extract - QA sign-off review 2026-05-27
- Workflow: CCGS team-qa Phase 6 plus test-evidence-review.
- Scope: `production/epics/godot-client-engineering` stories 001-012.
- Report written: `production/qa/qa-signoff-godot-client-engineering-2026-05-27.md`
- Verdict: APPROVED WITH WARNINGS.
- Evidence reviewed: smoke report, QA plan, feature-page visual QA, bottom-navigation click-through QA, restricted-workflow review, CI configuration evidence, and story completion status.
- Blocking items: none for Godot Client Engineering QA closure.
- Accepted warnings: remote CI run evidence pending, Godot 4.4 target validated with local 4.6.3, `godot` not on PATH, non-blocking Godot editor settings save warning, and project-local `test/` convention differs from upstream CCGS `tests/`.
- Smoke report updated: QA sign-off is complete; remaining work is release checklist follow-up and remote CI run evidence after push.
- Next recommended: run release checklist preparation.

## Session Extract - Release checklist preparation 2026-05-27
- Workflow: CCGS release-checklist adapted for the current internal Windows/mobile portrait scope.
- Checklist written: `production/releases/release-checklist-0.1.0-internal-2026-05-27.md`
- Scope: Godot Client Engineering internal test package, Windows export, 432x768 mobile portrait client.
- Codebase health: no actionable TODO/FIXME/HACK markers found outside historical session-state wording; no QA bug reports were required.
- Build artifacts verified: `build/windows/LuckyPackMMORPG.exe`, console wrapper, internal launcher, and internal README exist.
- Decision: clean public release is NO-GO; internal test readiness is GO WITH WARNINGS.
- Blockers for clean release: remote CI evidence, reproducible build from commit/tag, Godot 4.4 vs 4.6.3 version decision, release artifact policy, soak/performance/memory evidence, store/legal/distribution package, crash reporting/rollback/support plan.
- Next recommended: launch checklist dry-run, then resolve release blockers by priority.

## Session Extract - Player-visible restricted-workflow review 2026-05-27
- Workflow: CCGS smoke-check/test-evidence review with security-audit data exposure lens.
- Evidence written: `production/qa/evidence/restricted-workflow-player-visible-review-2026-05-27.md`
- Scope reviewed: rebuilt Windows export screenshots for home, role, packs, market, challenge, guild, and system plus Godot player UI string scan.
- Result: PASS WITH NOTES.
- Findings: no player-facing withdrawable value, withdrawal request/status flow, operator settlement approval, tax workflow, payout/disbursement workflow, or admin/operator center was found in supported Godot player screens.
- Notes: `模擬付款` and `挑戰結算` appear in Godot player copy, but were classified as gameplay purchase simulation and Boss reward settlement copy, not operator-finance workflow exposure.
- Smoke report updated: restricted-workflow review is complete; remaining smoke warning is QA sign-off plus environment/CI issues.
- Next recommended: add CI workflow/evidence or run QA sign-off review.

<!-- QA-PLAN: 2026-05-27 | System: sprint-release-remediation-001 | Plan written: production/qa/qa-plan-sprint-release-remediation-001.md -->

## Session Extract - RR-001 source-control provenance plan 2026-05-27
- Workflow: CCGS release remediation sprint execution with Producer and Release Manager lens.
- Artifact written: `production/releases/source-control-provenance-0.1.0.md`
- Scope: source-control route options, branch/tag naming, generated output policy, build provenance fields, and minimum command sequence after owner approval.
- Current state confirmed: workspace is not a git repository; `.github/workflows/tests.yml` exists; `.gitignore` is minimal; Windows internal artifacts exist under `build/windows/`.
- Sprint status updated: RR-001 moved to review, awaiting owner decision on existing remote vs new repository.
- Next recommended: resolve repo route decision, then execute RR-002 remote CI evidence path.

## Session Extract - RR-003 Godot release version strategy 2026-05-27
- Workflow: CCGS architecture-decision adapted for Codex, with Godot specialist release-policy lens.
- Artifact written: `docs/architecture/adr-0002-godot-release-version-strategy.md`
- Status: Proposed, awaiting owner/Technical Director acceptance.
- Decision proposed: clean release validation remains pinned to Godot 4.4; Godot 4.6.3 evidence remains an internal-test exception unless superseded by an accepted upgrade ADR.
- Current state confirmed: `godot-client/project.godot` pins feature `4.4`; local available Godot executable is `tools/godot-4.6.3/Godot_v4.6.3-stable_win64_console.exe`, reporting `4.6.3.stable.official.7d41c59c4`.
- Sprint status updated: RR-003 moved to review.
- Next recommended: accept/supersede ADR-0002, then use it to drive RR-004 release artifact policy and RR-011 release candidate smoke standard.

## Session Extract - RR-004 release artifact policy 2026-05-27
- Workflow: CCGS release-checklist/release-manager guidance adapted for release remediation policy.
- Artifact written: `production/releases/release-artifact-policy-0.1.0.md`
- Status: Proposed, awaiting RR-001 source-control route decision and ADR-0002 acceptance or supersession.
- Policy proposed: generated Windows build artifacts are not committed to git by default; release candidates must be rebuilt or validated from a tagged source, stored externally or as release attachments, and recorded with SHA256 checksums and build provenance.
- Current artifact sample recorded: `build/windows/LuckyPackMMORPG.exe`, console wrapper, launcher, and README with SHA256 checksums.
- Risk recorded: export preset and package script reference `BraveLegend.exe`, while current internal artifacts are named `LuckyPackMMORPG.exe`; naming must be unified before any release candidate package.
- Sprint status updated: RR-004 moved to review.
- Next recommended: execute RR-006 performance/soak/memory protocol or RR-007 localization gap report while owner decisions remain pending.

## Session Extract - RR-006 performance/soak/memory protocol 2026-05-27
- Workflow: CCGS perf-profile plus soak-test adapted for release remediation protocol.
- Artifact written: `production/qa/performance-soak-memory-protocol-2026-05-27.md`
- Scope: Windows internal package and 432x768 Godot client evidence; physical mobile performance, battery, and thermal validation remain out of scope.
- Static profiling notes: `Main.gd` contains per-frame `_process`, multiple `_draw` paths, texture loading/cache paths, and production assets total about 112.7 MB across 505 files.
- Protocol defines 2-hour soak checkpoints, memory/object/FPS observations, pass/warning/fail criteria, evidence paths, and post-session summary format.
- Sprint status updated: RR-006 moved to review, awaiting QA Lead and Performance Analyst sign-off plus real soak execution.
- Next recommended: RR-007 localization gap report, or run the 2-hour soak manually when a tester is available.

## Session Extract - RR-007 localization gap report 2026-05-27
- Workflow: CCGS localize scan/status adapted for release remediation.
- Artifact written: `production/localization/localization-gap-report-2026-05-27.md`
- Scan summary: 16 source/data files with CJK text, 811 CJK line hits, no string table directories, no bundled Godot font assets, and 115 Godot production UI PNG files.
- Sprint status updated: RR-007 moved to review, awaiting owner decisions on source locale, internal-only Traditional Chinese scope, web UI release scope, target locales, font licensing, and text-in-image strategy.
- Result: Gap report complete for RR-007 planning evidence; clean release localization remains blocked until source-locale policy, string tables, fonts, text-in-image strategy, string freeze, and localization QA are resolved.
- Next recommended: RR-008 launch operations package.

## Session Extract - RR-008 launch operations package 2026-05-27
- Workflow: CCGS launch-checklist/release-checklist operations guidance plus hotfix workflow adapted for release remediation.
- Artifact written: `production/releases/launch-operations-package-0.1.0.md`
- Scope: crash reporting decision, rollback plan, hotfix path, support/on-call workflow, known issues publication path, and day-one communication workflow.
- Decision recorded: internal Windows testing may use manual crash reporting and role-based support coverage only with owner acceptance; clean public launch operations remain NO-GO.
- Sprint status updated: RR-008 moved to review, awaiting owner approval for crash/support/rollback decisions and source-control/CI setup for executable hotfix flow.
- Next recommended: RR-009 store/legal/distribution package checklist.

## Session Extract - RR-009 store/legal/distribution checklist 2026-05-28
- Workflow: CCGS release-checklist and launch-checklist adapted for store/legal/distribution readiness, with official platform docs checked for current policy context.
- Artifact written: `production/releases/store-legal-distribution-checklist-0.1.0.md`
- Official sources checked: Apple App Review Guidelines/App Privacy, Google Play Data Safety/User Data policy, and Steamworks release process.
- Scope: store metadata, privacy/EULA, third-party licenses, age rating, screenshots/media, distribution channels, and internal-test minimum package.
- Verdict recorded: clean public store/distribution readiness is NO-GO; private Windows internal distribution remains GO WITH WARNINGS if no public claims are made.
- Sprint status updated: RR-009 moved to review, awaiting distribution channel decision, Legal/Policy Owner review, product naming decision, license inventory, age-rating path, and store-safe screenshots from an accepted RC.
- Next recommended: RR-010 release remediation milestone plan.

## Session Extract - RR-010 release remediation milestone plan 2026-05-28
- Workflow: CCGS milestone-review structure plus sprint-plan release-remediation adaptation.
- Artifact written: `production/milestones/milestone-0.1.0-release-remediation.md`
- Scope: goals, exit criteria, non-goals, risks, decision queue, evidence map, and next actions for the 0.1.0 release remediation milestone.
- Target type recorded: private Windows internal test readiness plus clean release gate remediation; public launch remains deferred until owners choose a distribution channel and `/gate-check release` no longer returns FAIL.
- Sprint status updated: RR-010 moved to review, awaiting Producer confirmation of release target type and owner acceptance of milestone exit criteria.
- Next recommended: RR-011 release candidate smoke standard.

## Session Extract - RR-011 release candidate smoke standard 2026-05-28
- Workflow: CCGS smoke-check, release-checklist, and test-evidence-review adapted for release remediation.
- Artifact written: `production/qa/release-candidate-smoke-standard-0.1.0.md`
- Scope: defines separate smoke gates for internal debug packages, release candidate packages, and public launch candidate packages.
- Current verdict recorded: internal debug package remains GO WITH WARNINGS; release candidate package is NOT READY; public launch candidate package remains NO-GO.
- Sprint status updated: RR-011 moved to review, awaiting QA Lead/Release Manager acceptance and first RC execution after source-control, CI, Godot version, artifact policy, and naming decisions.
- Milestone evidence map updated to show the RC smoke standard as defined/review instead of missing.
- Next recommended: RR-012 playtest report templates.

## Session Extract - RR-012 playtest report templates 2026-05-28
- Workflow: CCGS playtest-report new mode adapted for release-remediation templates.
- Review mode: lean; CD-PLAYTEST gate skipped by workflow rule, with Creative Director owner review still required for template acceptance.
- Artifacts written: `production/playtests/RR-012-template-index.md`, `production/playtests/templates/new-player-experience-template.md`, `production/playtests/templates/mid-game-systems-template.md`, and `production/playtests/templates/difficulty-curve-template.md`.
- Scope: templates cover first-time comprehension, mid-game systems, difficulty curve, 432x768 usability, page navigation, action routing, verdicts, and product-boundary checks for cash-out/withdrawal/operator workflow leakage.
- Sprint status updated: RR-012 moved to review, awaiting QA Lead and Creative Director review; templates are not real playtest evidence until sessions are executed.
- Milestone evidence map updated to show playtest templates as defined/review instead of missing.
- Next recommended: RR-013 patch notes and changelog requirements.

## Session Extract - RR-013 patch notes and changelog requirements 2026-05-28
- Workflow: CCGS changelog and patch-notes requirements pass adapted for release remediation.
- Artifact written: `production/releases/patch-notes-changelog-requirements-0.1.0.md`
- Current state confirmed: workspace is not a git repository; `docs/CHANGELOG.md` and `production/releases/0.1.0/changelog.md` do not exist.
- Scope: requirements define source inputs for internal changelog, player-facing changelog, patch notes, and known issues; they also state what cannot be generated without git history.
- Current verdict recorded: internal changelog generation is blocked until source control exists; patch notes generation is blocked until a git-backed internal changelog source exists; draft private communication planning is ready with warnings.
- Sprint status updated: RR-013 moved to review, awaiting Producer and Release Manager review.
- Milestone evidence map updated to show patch notes/changelog requirements as defined/review instead of missing.
- Next recommended: reconcile RR-005 status metadata, then resolve RR-001/RR-002 source-control and remote CI evidence.

## Session Extract - RR-005 QA plan status reconciliation 2026-05-28
- Workflow: CCGS sprint-status/story-done adaptation for release-remediation metadata cleanup.
- Artifact already existed: `production/qa/qa-plan-sprint-release-remediation-001.md`
- Scope: reconciled sprint metadata so RR-005 reflects the existing QA plan artifact instead of remaining `ready-for-dev`.
- Sprint status updated: RR-005 moved to review, awaiting QA Lead sign-off.
- Milestone updated: RR-005 no longer lists metadata cleanup as pending; sprint QA plan evidence is now marked review.
- QA plan updated: removed stale milestone-missing QA gap and added a status reconciliation note.
- Next recommended: resolve RR-001 source-control owner decision, then execute RR-002 remote CI evidence path.

## Session Extract - RR-001/RR-002 existing remote setup 2026-05-28
- Workflow: CCGS source-control provenance plus GitHub orientation for existing remote route.
- User selected Option A with remote `https://github.com/Jimmy-xinhow/MMORPG.git`.
- Local git initialized, `origin` configured, safe-directory added for this workspace, and branch renamed to `main`.
- `git fetch origin` succeeded; no remote branches were returned, so no remote-history reconciliation conflict was detected.
- Local gate initially failed because `scripts/validate-godot-prototype.mjs` did not include four direct startup pages already present in `Main.gd`; validator was synchronized and `npm.cmd run check` passed.
- Source-control provenance updated at `production/releases/source-control-provenance-0.1.0.md`.
- RR-002 evidence path initialized at `production/qa/evidence/ci-evidence-release-remediation-001.md`.
- Sprint status updated: RR-001 remains review pending commit/tag/push/sign-off; RR-002 moved to in-progress pending first push and GitHub Actions success.
- Next recommended: create baseline commit/tag, push `main` and `v0.1.0-rc.1`, then capture GitHub Actions run evidence.

## Session Extract - RR-002 remote CI evidence captured 2026-05-28
- Workflow: CCGS source-control provenance plus GitHub Actions CI fix.
- Baseline commit pushed: `84808c33d7ba7e1f4593baae28456d67d7a66506`.
- Baseline tag pushed: `v0.1.0-rc.1`.
- First GitHub Actions run failed: `26526358889`, because `scripts/validate-goal-seven.mjs` required generated Windows export artifacts in a clean CI checkout while RR-004 policy excludes those artifacts from git by default.
- CI validator fix committed: `56d8c36a43f7099a3678cee4273c3313883dbdfe`, preserving local Windows artifact checks while allowing GitHub Actions to validate release artifact policy and RR-002 evidence.
- Successful GitHub Actions run captured: `26526574962`, workflow `Tests`, job `Project check`, command `npm run check`, conclusion `success`.
- Successor tag pushed: `v0.1.0-rc.2`, pointing to the CI-passing commit.
- Evidence updated: `production/qa/evidence/ci-evidence-release-remediation-001.md` and `production/releases/source-control-provenance-0.1.0.md`.
- Sprint status updated: RR-002 moved to review, awaiting QA Lead sign-off; RR-001 remains review, awaiting Producer/Release Manager sign-off.
- Next recommended: create full build provenance for `v0.1.0-rc.2`, then run release/gate checklist review against the updated CI evidence.

## Session Extract - v0.1.0-rc.2 build provenance and release gate review 2026-05-28
- Workflow: CCGS build provenance execution plus gate-check release review.
- Build provenance created: `production/releases/build-provenance-v0.1.0-rc.2.md`.
- Gate-check report created: `production/gate-checks/gate-check-release-2026-05-28.md`.
- Source/CI provenance result: PASS for `v0.1.0-rc.2` source tag and GitHub Actions run `26526574962`.
- Internal debug package provenance result: PASS WITH WARNINGS, using existing `build/windows` artifacts and recorded SHA256 checksums.
- Clean release candidate package result: NOT READY because ADR-0002 is still Proposed, Godot 4.4/4.6.3 mismatch remains, naming is inconsistent, artifact archive target is not selected, and RC smoke/soak/legal/operations/localization evidence is incomplete.
- Gate verdict: FAIL for clean Release; internal Windows test remains GO WITH WARNINGS.
- Milestone and sprint status updated to point to the new provenance and gate-check evidence.
- Next recommended: resolve ADR-0002 and final artifact naming/storage before producing the first clean RC package and running RC smoke.

## Session Extract - Clean RC decision package 2026-05-28
- Workflow: CCGS architecture-decision plus release-checklist/gate-check adaptation.
- Artifact created: `production/releases/clean-rc-decision-package-0.1.0.md`.
- Scope: owner decisions required before clean RC package work can begin.
- Recommended decision set:
  - Accept ADR-0002 and require Godot 4.4 for clean RC validation.
  - Use `勇者傳說 Brave Legend` as product/display name and `BraveLegend` as Windows executable stem.
  - Store clean RC packages as GitHub Release attachments, not committed build outputs.
  - Add generated output ignores for `godot-client/.godot/`, `**/__pycache__/`, `build/windows/`, `build/internal-test/`, and `release-archives/` after approval.
- No source code, ADR status, `.gitignore`, build artifacts, or release tags were changed in this step.
- Sprint status updated: RR-003 and RR-004 now point to the decision package and await owner selection/sign-off.
- Next recommended: owner selects/approves decisions, then implement naming/.gitignore/accepted-version changes and produce the first clean RC package.

## Session Extract - Clean RC source-policy application 2026-05-28
- Workflow: CCGS architecture-decision plus release artifact policy application.
- ADR-0002 updated to `Accepted`; clean release validation remains pinned to Godot 4.4.
- `.gitignore` updated to exclude generated outputs: `godot-client/.godot/`, `**/__pycache__/`, `build/windows/`, `build/internal-test/`, and `release-archives/`.
- Release artifact policy updated to accepted source/artifact policy with future clean RC naming set to Brave Legend / `BraveLegend` and storage set to GitHub Release attachment.
- Build provenance updated: `v0.1.0-rc.2` remains source/CI provenance only, not a clean RC package.
- No clean RC package was rebuilt and no release was published in this step.
- Sprint status updated: RR-003 and RR-004 remain review but now block on Godot 4.4 tooling, clean RC rebuild/archive, SHA256 evidence, and RC smoke execution rather than owner decision selection.
- Next recommended: provision Godot 4.4 tooling, then align clean RC artifact validators/package evidence and produce `v0.1.0-rc.3`.

## Session Extract - Godot 4.4 tooling and local RC3 package candidate 2026-05-28
- Workflow: CCGS `setup-engine`, `godot`, and release gate remediation adaptation.
- Godot 4.4 tooling provisioned locally under `tools/godot-4.4/` from official Godot 4.4 stable downloads.
- Workspace-local export templates installed under `tools/godot-4.4/appdata/Godot/export_templates/4.4.stable/`.
- Compatibility issue found and fixed: Godot 4.4 does not accept `draw_ellipse()` in `Main.gd`; replaced with `_draw_ellipse_compat()` polygon drawing in the affected drawing classes.
- Godot 4.4 validation passed: version `4.4.stable.official.4c311cbee`, `Main.gd` check-only parse, and project headless load.
- Project gate passed: `npm.cmd run check` with 47 tests and UI/API/production smoke.
- Local Godot 4.4 release export created `build/windows/BraveLegend.exe`; headless boot smoke passed.
- Local archive created: `release-archives/brave-legend-v0.1.0-rc.3-windows-internal.zip`.
- Evidence written:
  - `production/releases/godot-4.4-tooling-provisioning-2026-05-28.md`
  - `production/releases/build-provenance-v0.1.0-rc.3.md`
- Warnings: export completed with editor cache and missing `rcedit` warnings; current RC3 archive is local only and is not yet source-tag/remote-CI/GitHub-Release provenanced.
- Next recommended: commit/push source + required composite assets, capture remote CI, tag `v0.1.0-rc.3`, attach archive to GitHub prerelease, then run the RC smoke standard.

## Session Extract - RC3 source tag and remote CI evidence 2026-05-28
- Workflow: CCGS release remediation plus GitHub CI/source-provenance workflow.
- Commit created and pushed: `a9f5e126b948860cba1097f6471a7f99f9f7ecb2` (`Prepare Godot 4.4 RC3 candidate`).
- Remote GitHub Actions run passed: `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26530101562`, workflow `Tests`, conclusion `success`.
- Tag created and pushed: `v0.1.0-rc.3`, peeled commit `a9f5e126b948860cba1097f6471a7f99f9f7ecb2`.
- Note: `.github/workflows/tests.yml` currently triggers on `main` push and pull request only, so no separate tag-push CI run was expected.
- Build provenance updated: `production/releases/build-provenance-v0.1.0-rc.3.md`.
- Remaining clean RC blockers: GitHub Release attachment, full RC smoke-standard execution, `rcedit` metadata warning decision, and release gate re-check.

## Session Extract - RC3 draft release attachment and automated archive smoke 2026-05-28
- Workflow: CCGS release artifact policy plus smoke-check/test-evidence adaptation.
- Draft prerelease created for tag `v0.1.0-rc.3`.
- Attachment uploaded: `brave-legend-v0.1.0-rc.3-windows-internal.zip`.
- GitHub attachment digest: `sha256:403a7898258ff24f9724789b99312c6665b2b7bc2b268d0c7732908ff95d007e`.
- Archive extracted to `tmp/rc-smoke-v0.1.0-rc.3-20260528/`; extracted artifact hashes matched provenance.
- Automated archive boot smoke passed: extracted `BraveLegend.exe --headless --quit-after 3` exited 0, with a non-blocking Godot `user://logs` warning.
- Evidence written:
  - `production/qa/evidence/rc-smoke-v0.1.0-rc.3.md`
  - `production/releases/known-issues-0.1.0-internal.md`
- Remaining clean RC blockers: visible-window feature-page RC smoke, bottom-navigation RC click-through, restricted-workflow review from the RC archive, `rcedit` metadata warning decision, and release gate re-check.

## Session Extract - RC3 visible smoke and restricted workflow review 2026-05-28
- Workflow: CCGS `smoke-check`, `test-evidence-review`, and Godot archive-smoke adaptation.
- Package tested: extracted `v0.1.0-rc.3` Windows archive at `tmp/rc-smoke-v0.1.0-rc.3-20260528/BraveLegend.exe`.
- Temporary automation: `tmp/rc3-visible-smoke.ps1` launched the RC archive, calibrated the Windows client area to 432x768, captured feature-page screenshots, then clicked each bottom-navigation target and captured post-navigation screenshots.
- Evidence written:
  - `production/qa/evidence/rc3-feature-page-visible-qa-2026-05-28.md`
  - `production/qa/evidence/rc3-bottom-nav-clickthrough-qa-2026-05-28.md`
  - `production/qa/evidence/rc3-restricted-workflow-player-visible-review-2026-05-28.md`
  - `production/qa/evidence/rc3-visible-smoke-2026-05-28/`
- Results:
  - Feature-page visible QA: PASS WITH NOTES for home, role, packs, market, challenge, guild, and system.
  - Bottom-navigation click-through: PASS using accepted `rc3-nav-post-*` evidence.
  - Restricted-workflow review: PASS WITH NOTES; no player-visible withdrawal, tax, payout, disbursement, admin/operator center, or operator-settlement workflow found.
- Updated artifacts:
  - `production/qa/evidence/rc-smoke-v0.1.0-rc.3.md`
  - `production/releases/build-provenance-v0.1.0-rc.3.md`
  - `production/releases/known-issues-0.1.0-internal.md`
  - `production/releases/clean-rc-decision-package-0.1.0.md`
  - `production/sprint-status.yaml`
  - `production/milestones/milestone-0.1.0-release-remediation.md`
- Remaining clean release blockers: `rcedit` metadata decision, soak/performance/memory execution, store/legal/distribution, localization, crash reporting, rollback, support/on-call, owner sign-offs, and release gate re-check.
