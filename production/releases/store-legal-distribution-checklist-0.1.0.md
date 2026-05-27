# Store, Legal, and Distribution Checklist: 0.1.0

**Date**: 2026-05-28  
**Workflow**: CCGS `release-checklist` / `launch-checklist` adapted for RR-009  
**Owners**: Legal / Policy Owner + Release Manager  
**Scope**: Release remediation checklist for Windows internal package, PC distribution, and future mobile store paths  
**Status**: Draft checklist, not legal approval

---

## Verdict

**Clean public store/distribution readiness**: NO-GO.

**Internal Windows test distribution readiness**: GO WITH WARNINGS if the artifact remains private/internal, testers receive known issues, and no public store/listing claims are made.

This document satisfies the RR-009 planning artifact requirement. It does not replace legal counsel, platform review, age-rating submission, privacy review, license audit, or store partner approval.

---

## Official Sources Checked

Because store and privacy requirements change over time, this checklist was cross-checked against official platform documentation on 2026-05-28:

| Platform | Source | Relevant Requirement Area |
| --- | --- | --- |
| Apple App Store | https://developer.apple.com/app-store/review/guidelines/ | App Review metadata, privacy, final content, data handling. |
| Apple App Privacy | https://developer.apple.com/app-store/app-privacy-details/ | App privacy details and data collection disclosure. |
| Google Play Data Safety | https://support.google.com/googleplay/android-developer/answer/10787469 | Data Safety section, data collection/sharing disclosures, security practices. |
| Google Play User Data policy | https://support.google.com/googleplay/android-developer/answer/15402170 | Privacy policy link, in-app policy, accurate user data disclosure. |
| Steamworks release process | https://partner.steamgames.com/doc/store/releasing | Store Presence checklist and release process. |

Use these as starting points only. Owners must re-check official docs at submission time.

---

## Current Project Evidence

| Area | Current Evidence | Status |
| --- | --- | --- |
| Package version | `package.json` version `0.1.0` | PARTIAL |
| Windows internal artifact | `build/windows/LuckyPackMMORPG.exe` and wrappers | INTERNAL ONLY |
| Artifact policy | `production/releases/release-artifact-policy-0.1.0.md` | PROPOSED |
| Launch operations | `production/releases/launch-operations-package-0.1.0.md` | PROPOSED |
| Release checklist | `production/releases/release-checklist-0.1.0-internal-2026-05-27.md` | NO-GO for clean release |
| Localization | `production/localization/localization-gap-report-2026-05-27.md` | FAIL for clean localization gate |
| Legal web pages | `public/legal/privacy.html`, `terms.html`, `probability.html`, `refund.html` | PARTIAL, not legal-approved package |
| Store screenshots | QA screenshots under `production/qa/evidence/` | QA evidence only, not store-ready |
| Age rating | No ESRB/PEGI/IARC/regional evidence found | MISSING |
| Third-party license inventory | No release license inventory found | MISSING |
| Distribution channel | Not selected | MISSING |

---

## Distribution Channel Decision

Owners must choose the immediate distribution target before any release candidate can be packaged.

| Channel | Current Readiness | Required Before Use |
| --- | --- | --- |
| Private Windows internal test archive | PARTIAL | Artifact archive/provenance, known issues, tester terms, support intake. |
| Public PC direct download | NOT READY | Privacy/EULA, license audit, support channel, crash reporting decision, artifact provenance. |
| Steam | NOT READY | Steamworks account/app setup, Store Presence checklist, assets, build depot, pricing, tax/payment setup, release review. |
| Apple App Store | NOT READY | iOS build, App Store Connect metadata, privacy nutrition labels, privacy policy URL, age rating, device QA, guideline review. |
| Google Play | NOT READY | Android build, Play Console listing, Data Safety section, privacy policy in listing and app, content rating, device QA. |

Recommendation for 0.1.0 remediation: keep this as **private Windows internal test** until RR-001/RR-002/RR-004/RR-006/RR-008 are accepted and RR-011 defines release candidate smoke standards.

---

## Store Metadata Checklist

Required for any public or semi-public listing:

| Item | Status | Owner | Evidence Path / Notes |
| --- | --- | --- | --- |
| Final product display name | BLOCKED | Producer + Legal | Naming conflict exists: `BraveLegend` config/scripts vs `LuckyPackMMORPG` artifacts. |
| ASCII artifact/archive name | PARTIAL | Release Manager | Recommended by artifact policy, not owner-approved. |
| Short description | MISSING | Producer + Marketing | Must avoid cash-out, gambling, investment, payout, or misleading reward claims. |
| Long description | MISSING | Producer + Marketing + Legal | Must explain RPG gameplay and non-withdrawable assets clearly. |
| Feature list | MISSING | Producer | Must match implemented/QA-verified features only. |
| Genre/category | MISSING | Producer | MMORPG / RPG / internal test classification needs owner choice. |
| Supported languages | BLOCKED | Localization Owner | Current honest claim: Traditional Chinese-only internal prototype. |
| System requirements | MISSING | Release Manager | Windows minimum/recommended specs not measured. |
| Version string | PARTIAL | Release Manager | `0.1.0` exists; Godot/export metadata review pending. |
| Build/archive size | PARTIAL | Release Manager | Current exe about 144 MB; no budget or archive size target. |
| Support URL/email | MISSING | Operations Owner | RR-008 requires support intake channel decision. |
| Privacy policy URL | PARTIAL | Legal | `public/legal/privacy.html` exists locally; public URL and approval missing. |
| Terms/EULA URL | PARTIAL | Legal | `public/legal/terms.html` exists locally; EULA approval missing. |
| Refund/support policy URL | PARTIAL | Legal | `public/legal/refund.html` exists locally; approval missing. |
| Probability/random item disclosure | PARTIAL | Legal + Product | `public/legal/probability.html` and in-game odds page exist; final review missing. |

---

## Legal / Policy Checklist

| Item | Status | Required Action |
| --- | --- | --- |
| EULA | MISSING | Decide if `terms.html` is enough or create a formal EULA for each channel. |
| Privacy policy | PARTIAL | Review all data collection, logs, crash intake, analytics, support screenshots, and backend data handling. |
| In-app privacy access | MISSING | Ensure policy is reachable from the app/client, not only a web file. |
| Data safety / privacy nutrition | MISSING | Complete per-platform declarations after analytics/crash/support decisions. |
| Third-party license attribution | MISSING | Audit Node dependencies, Godot, generated/AI-assisted art, fonts, tools, and any SDKs. |
| Font license | MISSING | Required before bundled font/localization work. |
| Art rights / provenance | PARTIAL | Art docs state original/no copied assets; release needs asset provenance summary. |
| Music/audio licensing | MISSING | No audio package or license evidence found. |
| Trademark/product name clearance | MISSING | Required before public name, logo, and store metadata. |
| Age rating | MISSING | Choose ESRB/PEGI/IARC/regional path based on distribution channel. |
| Random item disclosure | PARTIAL | Current legal page and pack odds screen need legal/policy review. |
| Refund/chargeback policy | PARTIAL | Web page exists; must align with channel rules and actual payment model. |
| No-withdrawable-value disclosure | PARTIAL | Product boundary docs and player QA evidence exist; public copy must be approved. |
| Regulated feature review | BLOCKED | Any payout, withdrawal, tax, cash-equivalent redemption, external payment, or third-party redemption must pass planning phase 14 review. |

---

## Platform-Specific Checklists

### PC / Steam

| Item | Status | Required Action |
| --- | --- | --- |
| Steamworks app configured | MISSING | Create/confirm Steamworks app and app ID. |
| Store Presence checklist | MISSING | Complete Steam store page required items before coming-soon/release review. |
| Build depot/package | MISSING | Define depot layout and upload release candidate from tagged source. |
| Windows executable naming | BLOCKED | Resolve `BraveLegend` vs `LuckyPackMMORPG`. |
| Store capsule/key art | MISSING | Create platform-specific art assets. |
| Screenshots | MISSING | Produce store-safe screenshots from release candidate, not QA/debug captures. |
| Trailer | MISSING | Decide if required for channel/marketing plan. |
| Pricing/regions | MISSING | Owner decision required. |
| Achievements/cloud saves | NOT APPLICABLE YET | Only include if scoped and implemented. |
| Steam Deck/PC compatibility | NOT RUN | Not in current internal test scope. |

### Apple App Store

| Item | Status | Required Action |
| --- | --- | --- |
| iOS build | MISSING | No iOS/mobile store build exists. |
| App Store Connect metadata | MISSING | App name, subtitle, description, keywords, screenshots, support URL, privacy URL. |
| Privacy details | MISSING | Declare data collection/use after crash/support/analytics decisions. |
| App Review guideline pass | MISSING | Review final binary, metadata, links, random item disclosure, and no placeholder content. |
| Age rating | MISSING | Complete App Store Connect age rating questionnaire. |
| In-app purchase/payment review | BLOCKED | No public payment/IAP scope approved. |
| Device screenshots | MISSING | Need real per-device screenshots from mobile build. |
| Touch/performance/battery QA | NOT RUN | Desktop 432x768 evidence cannot claim mobile store readiness. |

### Google Play

| Item | Status | Required Action |
| --- | --- | --- |
| Android build | MISSING | No Android package exists. |
| Play Console listing | MISSING | App name, descriptions, icons, feature graphic, screenshots, category. |
| Data Safety section | MISSING | Declare collection/sharing/security practices accurately. |
| Privacy policy | PARTIAL | Must be linked in Play Console and available in app if mobile is targeted. |
| Content rating | MISSING | Complete rating questionnaire. |
| Target API/device requirements | MISSING | Define Android target once build exists. |
| App access/testing instructions | MISSING | Provide reviewer login/test instructions if needed. |
| Device QA | NOT RUN | Physical/mobile compatibility not tested. |

---

## Screenshot and Media Requirements

Current QA images are useful engineering evidence but not store assets.

Store-ready screenshots must:

- Come from a release candidate artifact, not debug/unstable builds.
- Avoid showing debug overlays, desktop chrome, internal paths, or QA cursor artifacts.
- Avoid unsupported claims such as cash-out, payout, investment, guaranteed rewards, or external redemption.
- Match supported language claims.
- Show only QA-verified player-facing pages.
- Include random item/probability disclosure where platform/product policy requires it.

Current usable source evidence:

- `production/qa/evidence/feature-page-visible-qa-2026-05-27.md`
- `production/qa/evidence/bottom-nav-clickthrough-qa-2026-05-27.md`
- `production/qa/evidence/restricted-workflow-player-visible-review-2026-05-27.md`

Current exclusions:

- `nav-click-*` images are excluded by prior QA evidence.
- Current QA screenshots are not store-safe until captured from an accepted release candidate.

---

## Third-Party License Inventory

Minimum inventory required before public distribution:

| Source | Status | Required Action |
| --- | --- | --- |
| Node runtime/dependencies | MISSING | Create dependency/license report from `package.json` and installed modules. |
| Godot engine | MISSING | Include Godot license/attribution appropriate to distributed build. |
| Fonts | MISSING | Choose licensed font and record redistribution rights. |
| Art assets | PARTIAL | Record generated/original art provenance and tool/source notes. |
| Audio assets | MISSING | No audio package/license evidence found. |
| External SDKs | NOT APPLICABLE YET | Reassess if crash analytics, store SDKs, ads, IAP, or social SDKs are added. |

Recommended evidence path:

```text
production/releases/third-party-license-inventory-0.1.0.md
```

---

## Privacy / Data Handling Checklist

Current app behavior and planned operations imply these review areas:

| Data / Event | Current Evidence | Required Policy Decision |
| --- | --- | --- |
| Player state and gameplay logs | `src/domain/services.js`, public player API | Define retention and disclosure. |
| Admin/operator data | Public web/admin routes exist with role checks | Ensure public release does not expose admin workflows to players. |
| Crash/support reports | RR-008 manual intake | Define what screenshots/logs may contain and how they are retained/deleted. |
| Analytics/telemetry | Not integrated | Decide none vs provider; update privacy policy accordingly. |
| Payments/external money | Simulated/internal only | Public metadata must not imply real withdrawable value or unapproved payment flow. |
| Random item/pack odds | Legal page and in-game odds page partial | Verify disclosure consistency across store, web, and client. |

---

## Internal Test Minimum Package

If the next release remains private/internal only, minimum distribution package is:

- [ ] Internal package archive or folder path.
- [ ] SHA256 checksums.
- [ ] `README-INTERNAL-TEST.md`.
- [ ] Known issues file from RR-008.
- [ ] Support intake template/channel.
- [ ] Traditional Chinese-only scope note.
- [ ] Manual crash reporting instructions.
- [ ] No public store metadata or public claims.
- [ ] Owner approval that legal/store/public launch remains NO-GO.

---

## Clean Release Exit Criteria

Clean release store/legal/distribution readiness requires:

- [ ] Distribution channel selected.
- [ ] Product/artifact naming resolved.
- [ ] Store metadata written, proofread, and legally reviewed.
- [ ] Privacy policy and EULA finalized and reachable from app/store.
- [ ] Third-party license inventory complete.
- [ ] Age rating path complete for selected regions/platforms.
- [ ] Store-safe screenshots/media captured from release candidate.
- [ ] Localization scope approved and reflected in metadata.
- [ ] Random item / odds / no-withdrawable-value disclosures reviewed.
- [ ] Crash/support/privacy data handling reviewed.
- [ ] Artifact provenance and checksums complete.
- [ ] Release candidate smoke standard passed.
- [ ] Legal / Policy Owner sign-off.
- [ ] Release Manager sign-off.

---

## RR-009 Acceptance Mapping

| Acceptance Criteria | Status | Evidence |
| --- | --- | --- |
| Store metadata requirements listed | COMPLETE | See "Store Metadata Checklist". |
| Privacy policy requirements listed | COMPLETE | See "Legal / Policy Checklist" and "Privacy / Data Handling Checklist". |
| EULA requirements listed | COMPLETE | See "Legal / Policy Checklist". |
| Third-party license requirements listed | COMPLETE | See "Third-Party License Inventory". |
| Age rating requirements listed | COMPLETE | See "Legal / Policy Checklist" and platform sections. |
| Screenshot requirements listed | COMPLETE | See "Screenshot and Media Requirements". |
| Distribution channel requirements listed | COMPLETE | See "Distribution Channel Decision" and platform sections. |

---

## Owner Decisions Required

1. Choose distribution channel for 0.1.0: private internal, public PC, Steam, Apple App Store, Google Play, or deferred.
2. Resolve final product display name and artifact naming.
3. Assign Legal / Policy Owner for EULA, privacy, refund, probability, random item, and no-withdrawable-value review.
4. Decide whether web legal pages are the legal source of truth or drafts only.
5. Approve a third-party license inventory method.
6. Decide whether store screenshots should be produced before or after RR-011 release candidate smoke standard.

---

## Recommended Next CCGS Step

Run RR-010: create the 0.1.0 release remediation milestone plan.

The milestone should convert the remaining review/blocker items into exit criteria and explicitly state that clean public launch remains out of scope until `/gate-check release` no longer fails.
