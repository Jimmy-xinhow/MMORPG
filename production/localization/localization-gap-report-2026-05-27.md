# Localization Gap Report

**Date**: 2026-05-27  
**Workflow**: CCGS `localize scan/status` adapted for RR-007  
**Owners**: Localization Owner + UI Programmer  
**Scope**: Godot internal client, public web UI, player API content, Windows internal package  
**Release Target**: 0.1.0 release remediation evidence, not public launch approval

---

## Verdict

**Localization readiness**: FAIL for clean release localization gate.

**Internal Windows test readiness**: PASS WITH WARNINGS if the owner explicitly accepts Traditional Chinese-only internal test scope.

The project currently behaves as a Traditional Chinese-first prototype with hardcoded player-facing and operator-facing strings. There is no string table, no source-locale policy, no translation coverage matrix, no string freeze, no translator brief, and no localization QA evidence.

---

## Method

Commands used:

```powershell
rg -l "[\p{Han}]" godot-client\scripts public src data -g "*.gd" -g "*.js" -g "*.json"
rg -c "[\p{Han}]" godot-client\scripts public src data -g "*.gd" -g "*.js" -g "*.json"
rg -n "tr\(|Translation|locale|localize|strings|layout_direction|Font|font|fallback_font|text_direction|TextServer" godot-client public src data docs production
Get-ChildItem -Recurse -File -Path godot-client -Include *.ttf,*.otf,*.woff,*.woff2,*.fnt,*.font,*.tres
Get-ChildItem -Recurse -File -Path godot-client\assets\production\ui -Filter *.png | Measure-Object
```

Scan summary:

| Check | Result |
| --- | --- |
| Files with CJK text under scanned source/data paths | 16 |
| CJK line hits under scanned source/data paths | 811 |
| `assets/data/strings` exists | No |
| `godot-client/assets/data/strings` exists | No |
| Godot font assets found (`.ttf`, `.otf`, `.woff`, `.fnt`, `.tres`) | 0 |
| Godot production UI PNG count | 115 |
| Godot translation/localization config detected | No |
| Godot RTL/layout direction config detected | No |

---

## Hardcoded Player-Facing Text Locations

These are not exhaustive string extractions. They are release-gate locations that must be externalized or explicitly scoped as Traditional Chinese-only internal-test content.

| Area | File | Evidence | Risk |
| --- | --- | --- | --- |
| Godot main UI state, tabs, tooltips, demo content, event log | `godot-client/scripts/Main.gd` | 403 CJK line hits; examples at lines 145, 151-246, 441, 584, 591-620, 1414-2017 | BLOCKING for any translated release. This is the largest source of hardcoded player-visible content. |
| Godot HUD labels and page titles | `godot-client/scripts/hud_presenter.gd` | 14 CJK line hits; examples at lines 29, 35, 53-68 | BLOCKING. HUD strings need stable keys and length limits. |
| Godot feature page titles | `godot-client/scripts/feature_page_renderer.gd` | 8 CJK line hits; examples at lines 6-13 | BLOCKING for translated feature navigation. |
| Godot quest/status copy | `godot-client/scripts/quest_status_presenter.gd` | 30 CJK line hits; examples at lines 24-89 | BLOCKING. Contains tutorial/status prose and long body copy. |
| Godot challenge/guild/system cards | `godot-client/scripts/challenge_guild_system_state_binder.gd` | 20 CJK line hits; examples at lines 7-70 | BLOCKING. Cards mix labels, dynamic text, and system settings copy. |
| Godot market card copy | `godot-client/scripts/market_page_state_binder.gd` | 4 CJK line hits; examples at lines 23-26 | BLOCKING for market screen localization. |
| Public web app UI | `public/app.js` | 260 CJK line hits; examples at lines 23-127, 359, 490-749, 781-963 | BLOCKING if web UI ships beyond internal/admin demo. Includes player, operator, legal-risk, payout, and status copy. |
| PWA metadata | `public/manifest.json` | 2 CJK line hits; app name and short name | BLOCKING for store/distribution metadata localization. |
| Player API gameplay state and combat log | `src/domain/services.js` | 57 CJK line hits; examples at lines 90-132, 257-340, 980-1019, 1080 | BLOCKING if API-provided gameplay strings are shown in any localized client. |
| Policy/regulatory/liveops terms | `src/domain/policies.js`, `src/domain/regulatory.js`, `src/domain/liveops.js` | Forbidden terms and policy messages | BLOCKING for legal/localization review if these strings surface to players or operators. |
| Stored demo data | `data/dev-store.json`, `src/storage.js`, `src/domain/store.js` | Demo player and reward copy | WARNING. Internal seed data must be either locale-specific or excluded from release builds. |

---

## Supported Language Assumptions

Current implementation assumptions:

- The implemented source language is Traditional Chinese (`zh-Hant` / `zh-TW` style), not English.
- CCGS `localize` assumes English (`en`) as the source locale. This project must either:
  - accept a project exception where `zh-Hant` is the source locale, or
  - create an English source table and treat Traditional Chinese as a translation.
- No locale selector, locale persistence, locale negotiation, or platform locale detection was found.
- No translation import path was found in `godot-client/project.godot`.
- No string freeze file exists under `production/localization/`.
- Public web UI and Godot client do not share a localization source.

Minimum supported locale that can be honestly claimed today:

| Locale | Status | Evidence |
| --- | --- | --- |
| `zh-Hant` / Traditional Chinese | Implemented directly in code/assets, not localized | Hardcoded strings render in the current prototype |
| `en` | Not supported | No string table or English source coverage |
| Other LTR locales | Not supported | No translation tables, length budgets, or QA |
| RTL locales | Not supported | No RTL layout direction, font, or mirroring evidence |

---

## Font Coverage Risks

| Risk | Severity | Evidence | Required Action |
| --- | --- | --- | --- |
| No bundled game font found | BLOCKING for clean release localization | No `.ttf`, `.otf`, `.woff`, `.fnt`, `.font`, or `.tres` font files found under `godot-client` | Choose and license a production font that covers source locale plus target locales; add import evidence. |
| Godot currently relies on fallback font behavior | BLOCKING for platform/distribution confidence | `ThemeDB.fallback_font` is used for draw paths in `godot-client/scripts/Main.gd` | Replace fallback dependency with explicit Theme/font resources and verify glyph coverage. |
| Composite UI PNGs may contain baked text | BLOCKING for translated release | 115 PNG files under `godot-client/assets/production/ui`; locked target composite screens are rendered as full-screen images | Keep only language-neutral art in composites or generate per-locale composite art variants. |
| 432x768 text-fit has no per-locale limits | BLOCKING for non-Chinese locales | No string table `context` fields or max character counts exist | Add max-length metadata for HUD, nav, button, tooltip, card, and event-log strings. |
| RTL scripts not supported | BLOCKING for Arabic/Hebrew/Persian/Urdu release | No `layout_direction`, RTL font, mirroring, or RTL QA evidence found | Exclude RTL locales from release or plan a dedicated RTL UI pass. |

---

## Text-In-Image Risk

The Godot client is currently driven by locked composite UI art:

- `home-target-composite.png`
- feature page composites such as `role-target-composite.png`, `packs-target-composite.png`, `market-target-composite.png`
- secondary composites such as `shop-main-target-composite.png`, `quests-main-target-composite.png`, `account-login-target-composite.png`, `liveops-detail-target-composite.png`

Release impact:

- If any composite contains readable UI text, that text cannot be localized through a string table.
- A translated build would need per-locale image variants or a UI refactor that moves text into Godot `Label` / `Button` nodes.
- The current validation scripts require locked composite PNGs, so localization work must preserve visual QA expectations while removing or variant-managing baked text.

---

## Minimum Path To Pass Release Localization Checks

### Internal Traditional Chinese test package

This is the smallest path if the release remains internal-only:

1. Declare `zh-Hant` / Traditional Chinese as the only supported test locale.
2. Add `production/localization/freeze-status.md` with status `NOT CALLED` or `DEFERRED FOR INTERNAL TEST`.
3. Add a release note that all strings are Traditional Chinese-only and not translation-ready.
4. Run a text-fit QA pass at 432x768 for all player-visible Godot screens.
5. Keep clean public release verdict as NO-GO.

### Clean release with localization readiness

This is the minimum path for a clean release gate:

1. Decide source locale policy: `en` per CCGS default, or project-approved `zh-Hant` exception.
2. Create a string table, for example `godot-client/assets/data/strings/strings-zh-Hant.json`, with:
   - stable keys,
   - source text,
   - translator context,
   - max length,
   - placeholder definitions.
3. Refactor Godot player-facing text out of `Main.gd` and presenter/binder scripts into keyed lookups.
4. Refactor public web UI strings into a shared or parallel string catalog if the web UI ships.
5. Move API-provided gameplay copy to content tables or return stable content IDs plus localized display strings.
6. Choose and document a licensed font with glyph coverage for each target locale.
7. Resolve text-in-image strategy for 115 Godot UI PNG assets:
   - remove baked text from composites, or
   - generate and validate per-locale variants.
8. Generate translator brief and glossary.
9. Call string freeze after planned UI/content copy is complete.
10. Run `/localize validate`, cultural review, and localization QA for every shipping locale.

---

## Release Gate Impact

| Gate Item | Current Status | Release Impact |
| --- | --- | --- |
| Hardcoded player-facing strings listed | COMPLETE for RR-007 gap report | Satisfies planning evidence, not localization readiness. |
| Supported language assumptions documented | COMPLETE | Shows Traditional Chinese-only implementation. |
| Font coverage risk documented | COMPLETE | Blocks clean release until resolved or scoped out. |
| Minimum path defined | COMPLETE | Provides actionable route to pass future localization checks. |
| String table exists | MISSING | Clean release blocker. |
| String freeze called | MISSING | Clean release blocker. |
| Translator brief exists | MISSING | Clean release blocker for external translation. |
| Localization QA evidence exists | MISSING | Clean release blocker. |

---

## RR-007 Acceptance Mapping

| Acceptance Criteria | Status | Evidence |
| --- | --- | --- |
| Report lists hardcoded player-facing text locations | COMPLETE | See "Hardcoded Player-Facing Text Locations". |
| Report states supported language assumptions | COMPLETE | See "Supported Language Assumptions". |
| Report states font coverage risks | COMPLETE | See "Font Coverage Risks". |
| Report defines minimum path to pass release localization checks | COMPLETE | See "Minimum Path To Pass Release Localization Checks". |

---

## Owner Decisions Required

1. Confirm whether the next release target remains internal Traditional Chinese-only or requires clean localization readiness.
2. Decide whether `zh-Hant` is allowed as project source locale despite the CCGS default of `en`.
3. Decide whether public web UI is in release scope or remains internal/admin demo only.
4. Choose the first translated locale, if any.
5. Approve font licensing and text-in-image strategy before string extraction begins.

---

## Recommended Next CCGS Step

Run RR-008 next: draft the launch operations package covering crash reporting, rollback, hotfix, support/on-call, known issues, and day-one communication workflow.

After RR-008, run RR-009 for store/legal/distribution checklist because localization findings directly affect store metadata, legal notices, privacy/EULA language, age-rating text, and screenshots.
