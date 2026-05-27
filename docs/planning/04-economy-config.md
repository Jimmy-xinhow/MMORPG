# 04 Economy Configuration

## Purpose

This document defines economy configuration, versioning, content generation, ticket budgets, operator income parameters, approval workflow, and tests. All economy behavior must be reproducible from saved config snapshots.

## Config Types

| Config | Controls | Version Scope |
|---|---|---|
| `PackTemplateConfig` | pack price, content pool, probability, limits | pack issue/open |
| `TradingConfig` | sessions, listing limits, price growth | listing/buy |
| `ForceOpenConfig` | max trades, max price, max hold duration | force-open job |
| `TicketConfig` | ticket price, usage, expiry | ticket issue/use |
| `BossRewardConfig` | contribution formula, cap, anti-abuse | boss settlement |
| `OperatorIncomeConfig` | KPI weights, caps, exclusions | settlement period |
| `RiskConfig` | thresholds, severity, freeze policy | risk case |

## Effective Version Rules

- Listing uses the config version active at listing creation.
- Buy settlement uses listing snapshot, not current config.
- Pack opening uses pack `contentSnapshotVersion`.
- Force-open uses the version stored on the force-open job.
- Operator settlement uses the config version stored on the settlement period.
- Risk rules can update immediately, but the rule version must be written to each risk case.

No transaction may read mutable config without saving `configVersion` or full snapshot.

## Content Generation Algorithm

Pack content generation must be deterministic and replayable:

```text
input = packId + contentSnapshotVersion + openNonce
seed = hash(input)
roll = deterministicRandom(seed)
select content by weighted pool
write PackOpenLog with seed, poolVersion, selectedItem, probability
```

Constraints:

- Probability weights must sum to `1000000` basis points.
- Zero-weight item cannot be selected.
- Deprecated item cannot appear in new snapshots.
- Same pack cannot generate content twice.
- Admin preview must use preview seed and must not write production logs.

## Ticket Budget Lifecycle

Ticket budget states:

```text
CONFIGURED -> ACTIVE -> RESERVED -> CONSUMED
ACTIVE -> EXPIRED
ACTIVE -> RISK_HELD -> ACTIVE/EXPIRED
```

Rules:

- Ticket cost is deducted at reservation if the activity needs capacity lock.
- Ticket is consumed only after activity starts or redemption succeeds.
- Cancelled activity releases reserved ticket unless abuse/risk policy says hold.
- Ticket shop inventory must not oversell.

## Operator Income Parameters

| Parameter | Unit | Default MVP Pilot | Cap |
|---|---:|---:|---:|
| `activeUserWeight` | percent | 25 | 40 |
| `retentionWeight` | percent | 20 | 35 |
| `contentQualityWeight` | percent | 20 | 35 |
| `supportQualityWeight` | percent | 15 | 25 |
| `riskPenaltyWeight` | percent | -20 | -100 |
| `periodMaxIncome` | minor fiat unit | set per pilot | finance-approved |
| `userMaxIncome` | minor fiat unit | set per pilot | finance-approved |

Weights must be stored in `OperatorIncomeConfig`. A settlement fails validation if positive weights exceed 100 before risk penalties.

## Approval Workflow

```text
DRAFT -> PRODUCT_REVIEW -> RISK_REVIEW -> FINANCE_REVIEW -> APPROVED -> ACTIVE
```

Rollback states:

```text
PRODUCT_REVIEW/RISK_REVIEW/FINANCE_REVIEW -> REJECTED
APPROVED/ACTIVE -> RETIRED
```

Approval requirements:

- Product reviewer checks player-facing impact.
- Risk reviewer checks abuse routes and thresholds.
- Finance reviewer checks settlement/accounting/tax implications.
- Each approval records reviewer, timestamp, diff summary, and effective date.

## Admin Change Rules

- No direct database edits for active economy values.
- All changes require a new config version.
- Active config cannot be modified in place.
- Scheduled config can be cancelled before effective time.
- Emergency rollback must point to the previous approved version.

## Required Test Cases

- Existing listing settles with old listing snapshot after new config is activated.
- Existing pack opens with stored content snapshot after pool changes.
- Force-open job retries with original rule version.
- Ticket inventory cannot oversell under concurrent purchase.
- Operator settlement cannot run with unapproved config.
- Rollback restores previous approved version without mutating historical records.
