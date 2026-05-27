# RR-012 Playtest Template Index

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / RR-012  
**CCGS Workflow**: `playtest-report new` adapted for three release-remediation templates  
**Review Mode**: `lean` - CD-PLAYTEST skipped by workflow rule  
**Owners**: QA Lead, Creative Director  
**Status**: Templates prepared, awaiting owner review and real playtest execution  

---

## Purpose

Prepare standard playtest report templates for the next release-readiness evidence phase.

These files are templates only. They are not completed playtest evidence, do not satisfy the clean Release gate by themselves, and must not be counted as real player sessions.

---

## Template Set

| Focus | Template | Primary Question |
| --- | --- | --- |
| New player experience | `production/playtests/templates/new-player-experience-template.md` | Does a first-time tester understand the fantasy, goal, controls, bottom navigation, and non-cash product boundary? |
| Mid-game systems | `production/playtests/templates/mid-game-systems-template.md` | Does a returning tester understand role progression, packs, market, challenge, guild, and system flows without restricted workflow leakage? |
| Difficulty curve | `production/playtests/templates/difficulty-curve-template.md` | Does the tester experience reasonable pacing, friction, challenge readability, and reward clarity across early-to-mid progression? |

---

## Shared Test Scope

All three templates are scoped to:

- Godot 4.4 target.
- Windows internal test package or equivalent internal client.
- 432x768 portrait UI.
- Touch-first flow with mouse fallback for Windows testing.
- Player-facing pages: home, role, packs, market, challenge, guild, system.
- Player-safe API and gameplay-only reward presentation.

All templates explicitly ask testers to flag any copy or workflow that implies:

- cash-out,
- withdrawable gameplay rewards,
- tax or payout processing,
- operator settlement approval,
- admin/operator center access,
- external marketplace value.

---

## When These Templates Become Evidence

A template becomes real playtest evidence only after:

1. A tester fills in session date, build, platform, input method, duration, and tester ID.
2. The session script is executed against a named build.
3. Bugs, confusion points, and observations are recorded.
4. Top priorities and action items are filled in.
5. QA Lead reviews the completed report.
6. Creative Director reviews player experience findings where needed.

Completed reports should be saved under:

```text
production/playtests/reports/
```

Recommended names:

```text
playtest-new-player-v0.1.0-rc.1-[tester-id].md
playtest-mid-game-systems-v0.1.0-rc.1-[tester-id].md
playtest-difficulty-curve-v0.1.0-rc.1-[tester-id].md
```

---

## Minimum Real Session Requirement Before Clean Release

The sprint QA plan currently requires zero real sessions for RR-012 itself. Before a clean release gate can use playtest evidence, run at least:

| Focus | Minimum Sessions | Target Tester |
| --- | ---: | --- |
| New player experience | 1 | First-time internal tester |
| Mid-game systems | 1 | Returning internal tester |
| Difficulty curve | 1 | QA or design tester performing a targeted progression run |

More sessions may be required if any High severity confusion, S1/S2 bug, or product-boundary issue appears.

---

## RR-012 Acceptance Mapping

| Acceptance Criteria | Status | Evidence |
| --- | --- | --- |
| New player experience template exists | COMPLETE | `production/playtests/templates/new-player-experience-template.md` |
| Mid-game systems template exists | COMPLETE | `production/playtests/templates/mid-game-systems-template.md` |
| Difficulty curve template exists | COMPLETE | `production/playtests/templates/difficulty-curve-template.md` |
| Templates include verdict and action item sections | COMPLETE | Each template includes verdict, top priorities, and action routing. |
| Templates are clearly marked as templates, not completed evidence | COMPLETE | Header and evidence rules in each template plus this index. |

---

## Next Recommended Workflow

Proceed to RR-013 using CCGS `patch-notes` and `changelog` workflow references to define patch-note and changelog source requirements.
