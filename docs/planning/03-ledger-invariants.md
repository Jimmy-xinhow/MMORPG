# 03 Ledger Invariants

## Purpose

This document defines the accounting model for all game assets, tickets, liabilities, operator settlements, and withdrawals. The ledger is the source of truth; cached balances are derived and must be reconcilable.

## Account Dimensions

Every ledger account must include:

| Field | Required Values |
|---|---|
| `accountType` | `PLAYER_ASSET`, `PLAYER_TICKET`, `PLATFORM_REVENUE`, `OPERATOR_INCOME`, `WITHDRAWAL_PAYABLE`, `RISK_HOLD`, `PROMO_GRANT`, `SYSTEM_CLEARING` |
| `assetUnit` | `GC`, `PACK`, `ITEM`, `TICKET`, `OPERATOR_CURRENCY`, `FIAT_TWD`, `FIAT_USD` |
| `ownerType` | `USER`, `OPERATOR`, `PLATFORM`, `SYSTEM` |
| `ownerId` | nullable only for `SYSTEM` |
| `balanceBucket` | `AVAILABLE`, `PENDING`, `FROZEN`, `SETTLEMENT`, `PAID_OUT` |

Cached balance fields:

- `availableBalance`
- `pendingBalance`
- `frozenBalance`
- `settlementBalance`

## Journal Model

Use double-entry `LedgerJournal` and `LedgerEntry`.

`LedgerJournal` fields:

- `id`
- `journalType`
- `refType`
- `refId`
- `idempotencyKey`
- `configVersion`
- `createdAt`
- `createdBy`

`LedgerEntry` fields:

- `journalId`
- `accountId`
- `direction` = `DEBIT | CREDIT`
- `amount`
- `assetUnit`
- `metadata`

Invariant:

```text
For each journal and assetUnit:
sum(DEBIT.amount) == sum(CREDIT.amount)
```

## Asset-Specific Rules

| Asset | Ledger Rule |
|---|---|
| GC | Internal game currency only; no route to withdrawal payable |
| Pack | Recorded as inventory ownership; pack transfer must reference `PackTrade` |
| Item/resource | Minted only by open, boss, shop, admin grant, or event journal |
| Ticket | Treated as liability until consumed, expired, or redeemed |
| Operator income | Created only from approved `OperatorSettlement` |
| Fiat payable | Created only from approved withdrawal |

## Database Enforcement

Required constraints:

- `LedgerJournal.idempotencyKey` unique.
- `OPERATOR_INCOME` journal requires `refType = 'OperatorSettlement'`.
- `WithdrawalRequest.settlementId` must reference an approved settlement.
- `WithdrawalRequest.amount <= OperatorSettlement.approvedWithdrawableAmount - paidAmount - pendingAmount`.
- Non-withdrawable assets cannot appear in `WITHDRAWAL_PAYABLE`.
- Frozen accounts cannot debit without risk/admin resolution reference.

## Ticket Liability

Ticket lifecycle:

```text
ISSUED -> AVAILABLE -> RESERVED -> CONSUMED
ISSUED -> AVAILABLE -> EXPIRED
ISSUED -> AVAILABLE -> RISK_HELD -> AVAILABLE/EXPIRED
```

Ledger handling:

- Ticket sale/grant credits `PLAYER_TICKET` and debits `TICKET_LIABILITY`.
- Ticket consumption reverses liability into the relevant gameplay service account.
- Expiry moves remaining liability to platform breakage account only if legal/accounting review approves the policy.

## Operator Settlement Ledger

Settlement creation:

1. Collect approved KPI and campaign evidence.
2. Apply exclusion priority from `01-product-boundary.md`.
3. Create `OperatorSettlement` in `PENDING_REVIEW`.
4. After approval, create `OPERATOR_INCOME` journal.
5. Withdrawal request moves approved amount into `WITHDRAWAL_PAYABLE`.
6. Payment success moves payable into `PAID_OUT`.

No journal may convert `PLAYER_ASSET`, `PLAYER_TICKET`, `PACK`, or `ITEM` into `OPERATOR_INCOME`.

## Reconciliation Algorithm

Daily reconciliation must:

1. Select cutoff in platform accounting timezone.
2. Replay journals by `createdAt <= cutoff`.
3. Group by `accountId`, `assetUnit`, and `balanceBucket`.
4. Compare replayed totals with cached `WalletBalance`.
5. Report missing journals, unbalanced journals, negative balances, stale config versions, and orphan refs.
6. Block settlement export if any affected operator account has unresolved mismatch.

Tolerance:

- Integer assets: exact match only.
- Fiat: exact minor-unit match only.

## Required Reports

- Daily ledger health summary.
- Per-user balance statement.
- Per-pack trade/open ledger trail.
- Ticket liability summary.
- Operator settlement statement.
- Withdrawal payable aging report.

## Required Test Cases

- Every journal balances by asset unit.
- Cached balance can be rebuilt from journals.
- Withdrawal from GC/pack/item/ticket fails.
- Operator income without settlement reference fails.
- Duplicate idempotency key does not double-credit.
- Frozen balance cannot be debited by normal gameplay.
- Ticket consumption reduces liability exactly once.
