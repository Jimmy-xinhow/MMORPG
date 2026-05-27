# 06 Risk Control

## Purpose

This document defines risk signals, severity, freezes, privacy controls, settlement review output, compliance monitoring, and regression datasets. Risk control protects users, the game economy, operator settlements, and regulatory posture.

## Risk Severity

| Severity | Meaning | Default Action |
|---|---|---|
| `LOW` | unusual but explainable | log and monitor |
| `MEDIUM` | needs review before settlement | hold affected rewards/settlement |
| `HIGH` | likely abuse or financial risk | freeze target and require reviewer |
| `CRITICAL` | legal/payment/platform risk | freeze account/settlement and escalate |

## Default Rules

| Rule | Threshold | Severity | Action |
|---|---:|---|---|
| Same device trading loop | >= 3 trades among same device cluster in 24h | HIGH | freeze listed packs and settlement refs |
| Same bank payout cluster | >= 2 operators using same bank account | HIGH | hold withdrawals |
| Price growth abuse | > 6 percent growth for 3 sequential trades | MEDIUM | block next listing |
| Rapid buy/cancel loop | >= 10 actions in 10 minutes | MEDIUM | temporary trading cooldown |
| Chargeback linked account | any active chargeback | CRITICAL | freeze withdrawal and related assets |
| Duplicate identity | same KYC/KYB fingerprint | HIGH | manual review |
| Bot-like session | impossible action timing or automation signature | MEDIUM | challenge and monitor |
| Admin override anomaly | high-value manual adjustment | HIGH | second approval |

Thresholds must be config-versioned in `RiskConfig`.

## Freeze Semantics

Freeze target types:

- user account.
- pack.
- listing.
- wallet account.
- ticket balance.
- operator settlement.
- withdrawal request.

Frozen target rules:

- Pack: cannot list, buy, open, or force-open.
- Listing: cannot be bought; owner cannot cancel if investigation requires lock.
- Wallet: affected bucket cannot debit.
- Settlement: cannot approve, export, or withdraw.
- Withdrawal: cannot move to payment schedule.

Unfreeze requires `RiskCaseResolution` with reviewer, reason, evidence, and affected target list.

## Privacy and Security Controls

PII/device/bank signals must be stored safely:

- Store device, payment, and identity fingerprints as salted hashes.
- Keep raw PII only in the approved identity/payment provider or encrypted vault.
- Limit risk dashboard access by role.
- Audit every view of sensitive risk details.
- Do not expose bank/device cluster details to normal support agents.
- Use retention windows and deletion policies aligned with legal requirements.

## Settlement Review Output

Every settlement review must produce:

- operator id and settlement period.
- gross calculated amount.
- exclusion amount by rule.
- approved withdrawable amount.
- risk case ids.
- reviewer decision and timestamp.
- tax profile status.
- payment profile status.
- final status: `APPROVED`, `REJECTED`, `PARTIAL_APPROVED`, `FROZEN`, `NEEDS_DOCUMENT`.

## Compliance Copy Monitoring

Monitor these sources before release and after copy changes:

- homepage.
- pack purchase/opening.
- trading market.
- boss/guild reward.
- ticket shop.
- operator center.
- withdrawal page.
- push notification.
- email.
- app store listing.
- ads and landing pages.

Flag wording that implies:

- ordinary gameplay can earn cash.
- pack/item/ticket has guaranteed resale value.
- boss/guild reward can be cashed out.
- withdrawal is automatic or guaranteed.
- tax reporting is optional.

## Regression Dataset

Maintain a deterministic dataset with:

- normal player trade.
- high-frequency trader.
- same-device trade loop.
- same-bank operator cluster.
- chargeback account.
- frozen pack.
- partially approved settlement.
- tax-expired withdrawal.
- admin adjustment needing second approval.

Risk tests must run against this dataset before each release involving economy, settlement, or copy changes.

## Required Test Cases

- Frozen pack cannot list, buy, open, or force-open.
- Frozen settlement cannot create withdrawal.
- Same-device trade loop creates risk case.
- Same-bank payout cluster blocks withdrawal approval.
- Product copy scan catches forbidden wording.
- Risk case resolution writes immutable audit log.
- Sensitive fingerprint data is not returned by normal user/support APIs.
