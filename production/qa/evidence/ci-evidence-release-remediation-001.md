# CI Evidence: Release Remediation 001

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / RR-002  
**Owners**: DevOps Engineer, QA Lead  
**Status**: Review; remote CI success captured, awaiting QA Lead sign-off  

---

## Purpose

Capture the remote GitHub Actions evidence required before 0.1.0 can claim remote CI coverage.

This file is initialized before the first push so RR-002 has a stable evidence path. It must be updated after GitHub Actions runs on the pushed commit.

---

## Current State

| Check | Result | Evidence |
| --- | --- | --- |
| Local git repository | PRESENT | `git rev-parse --is-inside-work-tree` returns `true`. |
| Remote URL | CONFIGURED | `origin` is `https://github.com/Jimmy-xinhow/MMORPG.git`. |
| Remote fetch | PASS | `git fetch origin` completed successfully. |
| Remote branches | NONE FOUND | `git branch -r` returned no branches after fetch. |
| Local branch | `main` | Branch renamed from initial default to `main`. |
| Local gate before baseline | PASS | `npm.cmd run check` passed on 2026-05-28 after validator synchronization. |
| Remote GitHub Actions run | PASS | Run `26526574962` passed after artifact-policy-aware validator correction. |
| First pushed commit | `84808c33d7ba7e1f4593baae28456d67d7a66506` | Baseline release candidate source commit. |
| First pushed tag | `v0.1.0-rc.1` | Tag points to the baseline commit and is retained as failed CI evidence. |
| CI-passing commit | `56d8c36a43f7099a3678cee4273c3313883dbdfe` | Contains the validator correction for CI/source checkout compatibility. |
| CI-passing tag | `v0.1.0-rc.2` | Successor release-candidate tag pushed after the successful run; `v0.1.0-rc.1` was not moved. |

---

## Remote Run History

| Run | Commit | Tag | Result | Evidence |
| --- | --- | --- | --- | --- |
| `26526358889` | `84808c33d7ba7e1f4593baae28456d67d7a66506` | `v0.1.0-rc.1` | FAIL | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526358889` |
| `26526574962` | `56d8c36a43f7099a3678cee4273c3313883dbdfe` | `v0.1.0-rc.2` | PASS | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526574962` |

### Run `26526358889` Failure Summary

- Workflow: `Tests`
- Job: `Project check`
- Step: `Run project gate`
- Command: `npm run check`
- Failing validator: `scripts/validate-goal-seven.mjs`
- Error: `GOAL-1 requires exported Windows executable`

Root cause: the remote repository intentionally excludes generated Windows export outputs under the 0.1.0 release artifact policy. The validator required `build/windows/LuckyPackMMORPG.exe` in all environments, so a clean GitHub Actions checkout could not satisfy the local-artifact assertion.

Correction path: keep the exported executable and launcher checks active for local validation, but allow GitHub Actions to validate that the release artifact policy and RR-002 evidence path exist when generated Windows artifacts are not committed.

### Run `26526574962` Success Summary

- Workflow: `Tests`
- Job: `Project check`
- Step: `Run project gate`
- Command: `npm run check`
- Commit: `56d8c36a43f7099a3678cee4273c3313883dbdfe`
- Run timestamp: `2026-05-27T17:10:10Z`
- Conclusion: `success`
- Run URL: `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526574962`

The successful run validates `.github/workflows/tests.yml` on `main` with Node.js 20 and the project gate `npm run check`.

---

## Required Remote Evidence Fields

Update this file after push with:

| Field | Required |
| --- | --- |
| Repository URL | Yes |
| Branch | Yes |
| Commit SHA | Yes |
| Tag | Yes, for release candidate evidence |
| Workflow file | Yes |
| Workflow name | Yes |
| Run URL | Yes |
| Run timestamp | Yes |
| Run conclusion | Yes |
| Command executed | Yes, expected `npm run check` |
| Failing jobs or warnings | Required if not success |

---

## Pass Criteria

RR-002 is ready for review when:

- [x] `main` is pushed to `https://github.com/Jimmy-xinhow/MMORPG.git`.
- [x] `v0.1.0-rc.1` or successor RC tag is pushed.
- [x] GitHub Actions run exists for the pushed commit.
- [x] The workflow uses `.github/workflows/tests.yml`.
- [x] The workflow runs `npm run check`.
- [x] The remote run conclusion is `success`.
- [x] The run URL and commit SHA are recorded in this file.
- [ ] QA Lead review is recorded.

---

## Current Verdict

**RR-002**: REVIEW / REMOTE CI PASS.

Remote CI evidence is captured for the selected GitHub remote and successor release-candidate tag. Remaining work is QA Lead review/sign-off.
