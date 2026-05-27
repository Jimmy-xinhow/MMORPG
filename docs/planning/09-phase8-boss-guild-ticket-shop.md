# 09 Phase 8: Boss, Guild, and Ticket Shop

## Purpose

Phase 8 adds boss gameplay, guild mechanics, and ticket shop while preserving the non-withdrawable product boundary and ledger integrity.

## Entry Gate

- Phase 7 exit gate approved.
- Ticket liability model implemented.
- Boss/guild rewards confirmed non-withdrawable.
- Risk rules include guild and same-cluster abuse cases.

## Boss Reward Formula

```text
baseReward = bossRewardPool * contributionShare
antiWhaleCap = min(baseReward, bossRewardPool * maxSingleUserShare)
guildPenalty = antiWhaleCap * guildAbusePenaltyRate
riskPenalty = antiWhaleCap * riskPenaltyRate
finalReward = floor(antiWhaleCap - guildPenalty - riskPenalty)
```

Default parameters:

| Parameter | Default | Range |
|---|---:|---:|
| `maxSingleUserShare` | 20% | 5%-25% |
| `guildAbusePenaltyRate` | 0%-100% | config-based |
| `riskPenaltyRate` | 0%-100% | risk-based |
| `minimumContribution` | 1 action | config-based |

Boss rewards are gameplay assets only. They cannot create `OperatorSettlement`.

## Guild Abuse Model

Detect and review:

- shell guild with many inactive members.
- same-device or same-payment cluster inside one guild.
- short-term join/leave to capture rewards.
- leader kicking members before settlement.
- guild-to-guild wash contribution.
- repeated same members farming low-risk bosses.

Guild controls:

- join cooldown.
- leave cooldown.
- role permissions.
- boss reward lock until settlement.
- manual risk freeze for guild reward period.

## Ticket Shop Rules

- Tickets are gameplay access assets.
- Tickets are non-withdrawable.
- Ticket purchase/grant must create liability ledger.
- Ticket consumption must reduce liability.
- Ticket refund or expiry requires config and accounting rule.

Ticket purchase must be idempotent and cannot oversell shop inventory.

## Redemption State Machine

```text
DRAFT -> SUBMITTED -> RISK_REVIEW -> APPROVED -> FULFILLING -> FULFILLED
SUBMITTED -> CANCELLED
RISK_REVIEW -> REJECTED
RISK_REVIEW -> RISK_HELD
FULFILLING -> FULFILLMENT_FAILED -> RISK_REVIEW
```

Constraints:

- One active redemption per ticket/ref pair.
- Redemption cannot convert to cash unless Phase 14 explicitly approves the feature.
- Fulfillment must write ledger and inventory changes in one transaction.
- Risk-held redemption cannot refund or fulfill without reviewer decision.

## Data Models

Minimum entities:

- `BossEvent`
- `BossContribution`
- `BossRewardSettlement`
- `Guild`
- `GuildMember`
- `GuildRole`
- `GuildActivityLog`
- `TicketProduct`
- `TicketBalance`
- `TicketLedger`
- `Redemption`

## Exit Gate

- Boss reward formula produces deterministic results from contribution log.
- Ticket liability reconciliation has zero mismatch.
- Guild abuse dataset creates expected risk cases.
- Mobile boss/guild/ticket screens show non-withdrawable wording.
- No boss/guild/ticket API can create withdrawal or operator income.

## Required Tests

- same-guild abuse penalty.
- same-device guild cluster hold.
- ticket oversell concurrency.
- redemption duplicate submit.
- reward settlement replay.
- boss reward does not create operator settlement.
