# CI Evidence: Release Remediation 001

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / RR-002  
**Owners**: DevOps Engineer, QA Lead  
**Status**: In progress; first remote run failed on artifact-policy mismatch  

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
| Remote GitHub Actions run | FAIL | Run `26526358889` failed after first push because CI checkout did not include generated Windows export artifacts. |
| First pushed commit | `84808c33d7ba7e1f4593baae28456d67d7a66506` | Baseline release candidate source commit. |
| First pushed tag | `v0.1.0-rc.1` | Tag points to the baseline commit and is retained as failed CI evidence. |

---

## Remote Run History

| Run | Commit | Tag | Result | Evidence |
| --- | --- | --- | --- | --- |
| `26526358889` | `84808c33d7ba7e1f4593baae28456d67d7a66506` | `v0.1.0-rc.1` | FAIL | `https://github.com/Jimmy-xinhow/MMORPG/actions/runs/26526358889` |

### Run `26526358889` Failure Summary

- Workflow: `Tests`
- Job: `Project check`
- Step: `Run project gate`
- Command: `npm run check`
- Failing validator: `scripts/validate-goal-seven.mjs`
- Error: `GOAL-1 requires exported Windows executable`

Root cause: the remote repository intentionally excludes generated Windows export outputs under the 0.1.0 release artifact policy. The validator required `build/windows/LuckyPackMMORPG.exe` in all environments, so a clean GitHub Actions checkout could not satisfy the local-artifact assertion.

Correction path: keep the exported executable and launcher checks active for local validation, but allow GitHub Actions to validate that the release artifact policy and RR-002 evidence path exist when generated Windows artifacts are not committed.

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

- [ ] `main` is pushed to `https://github.com/Jimmy-xinhow/MMORPG.git`.
- [ ] `v0.1.0-rc.1` or successor RC tag is pushed.
- [ ] GitHub Actions run exists for the pushed commit.
- [ ] The workflow uses `.github/workflows/tests.yml`.
- [ ] The workflow runs `npm run check`.
- [ ] The remote run conclusion is `success`.
- [ ] The run URL and commit SHA are recorded in this file.
- [ ] QA Lead review is recorded.

---

## Current Verdict

**RR-002**: IN PROGRESS / PENDING REMOTE RUN.

Remote CI evidence cannot pass until the follow-up CI run completes successfully after the artifact-policy-aware validator change.
