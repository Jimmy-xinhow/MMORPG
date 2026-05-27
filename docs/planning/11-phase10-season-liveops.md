# 11 Phase 10: Season and LiveOps

## Purpose

Phase 10 adds seasons, rankings, scheduled campaigns, and LiveOps tools. These tools can affect economy perception, so permissions, approvals, preview, rollback, and audit logs are mandatory.

## Entry Gate

- Phase 9 exit gate approved.
- Settlement lock model exists.
- Admin roles and audit logging implemented.
- Product copy redlines are enforced in review.

## LiveOps Workflow

```text
DRAFT -> PRODUCT_REVIEW -> RISK_REVIEW -> SCHEDULED -> ACTIVE -> ENDED -> ARCHIVED
DRAFT -> CANCELLED
PRODUCT_REVIEW/RISK_REVIEW -> REJECTED
SCHEDULED -> CANCELLED
ACTIVE -> PAUSED -> ACTIVE/ENDED
ACTIVE -> ROLLED_BACK
```

## Permissions

| Action | Required Role | Second Approval |
|---|---|---:|
| create campaign | LiveOps editor | No |
| approve copy | Product reviewer | Yes if reward/income wording |
| approve risk | Risk reviewer | Yes for economy change |
| schedule campaign | LiveOps manager | Yes |
| pause active campaign | LiveOps manager | No |
| rollback campaign | Admin + risk reviewer | Yes |
| edit reward config | Economy admin | Yes |

## Season Settlement Lock

- Ranking snapshot locks at season cutoff.
- Risk exclusions run before final ranking publish.
- Once `SeasonSettlement.status = LOCKED`, source ranking data cannot mutate.
- Re-run must create a new settlement attempt with same input dataset hash.
- If a player is removed by risk, ranks are recalculated with audit note.

## Leaderboard UI QA

Test:

- 360 px mobile width.
- long nickname.
- long guild name.
- tied rank.
- risk-excluded player removed.
- localization text expansion.
- loading and empty states.
- season ended state.

Leaderboard must not imply cash rewards unless the reward has passed Phase 14 review.

## Audit Log Requirements

Every LiveOps change records:

- actor.
- role.
- before/after config hash.
- reason.
- approval chain.
- scheduled time.
- affected economy config version.
- rollback target.

## Exit Gate

- Campaign can preview, schedule, activate, pause, end, and rollback.
- Settlement lock replay produces same ranking from same dataset.
- Admin audit log is complete.
- Copy scan passes.
- Mobile leaderboard QA passes.

## Required Tests

- scheduled campaign activates once.
- cancelled campaign never activates.
- rollback restores previous config version.
- ranking re-run is deterministic.
- risk removal recalculates ranks with audit.
- reward wording does not imply withdrawal.
