# RC Smoke Evidence: v0.1.0-rc.3

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / RR-011 RC Smoke Execution  
**CCGS Workflows**: `smoke-check`, `test-evidence-review`, `release-checklist` adaptation  
**Package Class**: Release Candidate package candidate  
**Verdict**: PASS WITH WARNINGS  

---

## Scope

This smoke pass validates the source-provenanced `v0.1.0-rc.3` archive attachment, automated boot path, visible-window feature pages, bottom-navigation click-through, and restricted-workflow player-visible review.

It is still not a clean public release approval because soak/performance/memory execution, `rcedit` metadata stamping, store/legal/distribution, localization, crash reporting, rollback, support, and owner sign-offs remain open.

---

## Source And CI

| Field | Value |
| --- | --- |
| Repository | `https://github.com/Jimmy-xinhow/MMORPG.git` |
| Branch | `main` |
| RC source commit | `a9f5e126b948860cba1097f6471a7f99f9f7ecb2` |
| RC source tag | `v0.1.0-rc.3` |
| Remote CI run | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26530101562` |
| CI conclusion | PASS |
| Main-tip evidence CI | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26530361343` |
| Main-tip evidence CI conclusion | PASS |

---

## Release Attachment

| Field | Value |
| --- | --- |
| Release type | Draft prerelease |
| Release URL | `https://github.com/Jimmy-xinhow/MMORPG/releases/tag/untagged-ed6fb1963ec1573bc99d` |
| Tag name | `v0.1.0-rc.3` |
| Attachment | `brave-legend-v0.1.0-rc.3-windows-internal.zip` |
| Attachment size | 140754371 |
| Attachment digest | `sha256:403a7898258ff24f9724789b99312c6665b2b7bc2b268d0c7732908ff95d007e` |

The release is a draft prerelease used for internal artifact storage only. It is not a public launch.

---

## Archive Extraction

| Field | Value |
| --- | --- |
| Local archive | `release-archives/brave-legend-v0.1.0-rc.3-windows-internal.zip` |
| Local archive SHA256 | `403A7898258FF24F9724789B99312C6665B2B7BC2B268D0C7732908FF95D007E` |
| Extraction path | `tmp/rc-smoke-v0.1.0-rc.3-20260528/` |

Extracted contents:

| Artifact | Size | SHA256 |
| --- | ---: | --- |
| `BraveLegend.exe` | 205185456 | `2C7F8F55665E6CD737B8B07DC40761780DD9BB7752EA14FFEFA864087850F6E9` |
| `Play-Brave-Legend-Online.cmd` | 174 | `87784997DB1BF81A7E4577C6D5AF1ADB267A85DB0A6C4C02C187E40EB63BED47` |
| `README-INTERNAL-TEST.md` | 318 | `EAACFBA3894FC2512BA4AE3B282453EE8851A13EFB2DCFAF5CFD69D75956AA4D` |

---

## Commands Run

```powershell
npm.cmd run check
Expand-Archive -LiteralPath release-archives\brave-legend-v0.1.0-rc.3-windows-internal.zip -DestinationPath tmp\rc-smoke-v0.1.0-rc.3-20260528 -Force
tmp\rc-smoke-v0.1.0-rc.3-20260528\BraveLegend.exe --headless --quit-after 3 -- --api-base=https://lucky-pack-api-production.up.railway.app
powershell.exe -ExecutionPolicy Bypass -File tmp\rc3-visible-smoke.ps1
```

---

## Check Results

| Check | Result | Notes |
| --- | --- | --- |
| Local primary gate | PASS | `npm.cmd run check` passed with 47 tests, UI smoke, API smoke, and production smoke. |
| Remote CI gate | PASS | CI run `26530101562` passed for the RC source commit. |
| Godot version alignment | PASS | Godot 4.4 tooling evidence exists in `production/releases/godot-4.4-tooling-provisioning-2026-05-28.md`. |
| Export provenance | PASS | `production/releases/build-provenance-v0.1.0-rc.3.md`. |
| Artifact checksum | PASS | Archive attachment digest and local SHA256 match. |
| Boot stability | PASS WITH NOTE | Extracted `BraveLegend.exe` exited 0 under headless `--quit-after 3`; Godot logged inability to open `user://logs/...`, but process did not fail. |
| Feature-page visibility | PASS WITH NOTES | `production/qa/evidence/rc3-feature-page-visible-qa-2026-05-28.md`; seven accepted 432x768 RC archive screenshots. |
| Navigation regression | PASS | `production/qa/evidence/rc3-bottom-nav-clickthrough-qa-2026-05-28.md`; seven accepted `rc3-nav-post-*` screenshots. |
| Restricted workflow exposure | PASS WITH NOTES | `production/qa/evidence/rc3-restricted-workflow-player-visible-review-2026-05-28.md`; no player-visible withdrawal, tax, payout, disbursement, admin/operator center, or operator-settlement workflow found. |
| Known issues review | PASS WITH WARNINGS | See `production/releases/known-issues-0.1.0-internal.md`. |
| Open bug threshold | PASS | No `production/qa/bugs/` directory exists; no open S1/S2 bug files found. |

---

## Known Warnings

1. Godot export still has a missing `rcedit` metadata-stamping warning.
2. The draft release URL uses GitHub's draft `untagged-*` URL while remaining associated with tag `v0.1.0-rc.3`.
3. Soak/performance/memory execution evidence is still pending.
4. Store/legal/distribution, localization, crash reporting, rollback, support, and on-call owner decisions remain pending.
5. This is still a draft prerelease for internal validation, not a public launch.

---

## Verdict

**RC package smoke**: PASS WITH WARNINGS.

This RC candidate is source-tagged, remote-CI backed, archived, attached to a draft prerelease, automated-boot verified, visually checked at 432x768, bottom-navigation checked, and restricted-workflow reviewed from the archive.

It remains internal-only until the open warning-level release readiness gaps are accepted or resolved.
