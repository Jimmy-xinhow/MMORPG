# 05 MVP Scope

## Purpose

This document defines the MVP delivery scope, release gates, schema/API contracts, and verification requirements. MVP must prove the core pack economy, ledger safety, risk holds, and export-only operator settlement workflow before any real payout integration.

## MVP Phases

| Phase | Scope | Exit Gate |
|---|---|---|
| 1 | Account, wallet, ledger foundation | Ledger replay equals cached balances |
| 2 | Pack issue/list/buy/open | State machine tests pass under concurrency |
| 3 | Content pool and snapshot generation | Old snapshots remain reproducible |
| 4 | Risk hold and admin review | Frozen assets cannot move |
| 5 | Reports and reconciliation | Daily reports match ledger |
| 6 | Operator settlement pilot export | Export-only payout files pass finance review |

## MVP Exclusions

- No real cash withdrawal integration before legal, tax, finance, and payment review.
- No player asset cash-out.
- No NFT/blockchain/external marketplace.
- No peer-to-peer fiat payment.
- No automated tax filing.
- No app store release before Phase 12 readiness.

## Required Schema Constraints

- `LuckyPack.status` enum must match `02-pack-state-machine.md`.
- `PackListing` must allow only one active listing per pack.
- `LedgerJournal.idempotencyKey` unique.
- `LedgerEntry.amount` positive integer minor unit.
- `WalletBalance` unique by `accountId + assetUnit + bucket`.
- `OperatorSettlement.periodId + operatorId` unique.
- `WithdrawalRequest` cannot exist without approved `OperatorSettlement`.
- `RiskCase` must reference target type and target id.

## API Contracts

| API | Request Guard | Success Response | Failure Cases |
|---|---|---|---|
| `POST /api/packs/issue` | admin/system role, approved template | pack id, status, snapshot | invalid template, duplicate idempotency |
| `POST /api/packs/list` | owner, `OWNED`, price valid | listing id, status | frozen, cooldown, active listing exists |
| `POST /api/packs/list/cancel` | owner/admin, active listing | cancelled listing | buy lock exists, already settled |
| `POST /api/packs/buy` | buyer balance, session open | trade id, pack status | insufficient funds, concurrent lock lost |
| `POST /api/packs/open` | owner/system, openable state | open log, reward summary | already opened, frozen, ledger failure |
| `GET /api/packs/:id/audit` | owner/admin/support | state and ledger timeline | unauthorized |
| `POST /api/risk/freeze` | risk/admin | risk case id | invalid target, already terminal |
| `POST /api/operator-settlements/run` | finance/admin | settlement draft | unapproved config, ledger mismatch |

## Phase 3 Asset Reallocation Tests

Content changes must prove:

- New pool version does not affect packs already issued.
- Reallocated weights still sum to the required total.
- Deprecated content cannot be selected in new snapshots.
- Replay from saved seed returns original result.
- Admin preview does not mint real assets.

## Phase 5 Report Fields

Minimum report/export fields:

- report id and cutoff time.
- account/user/operator id.
- asset unit and balance bucket.
- opening balance, debits, credits, closing balance.
- journal count and mismatch count.
- related pack/trade/open refs.
- risk hold count and amount.
- settlement period and config version.

## Phase 6 Operator Settlement Mode

Phase 6 is export-only.

Allowed:

- create settlement draft.
- risk and finance review.
- export accounting file.
- mark as simulated paid for QA environment only.

Not allowed:

- send real bank transfer.
- trigger payment provider payout.
- advertise automatic withdrawals.
- change user-facing copy to imply player income.

## Release Gates

MVP can be considered ready only when:

- All ledger invariant tests pass.
- All pack state machine race tests pass.
- Reconciliation report has zero unexplained mismatch for test dataset.
- Risk freeze blocks list/buy/open/settlement.
- Product copy scan confirms non-withdrawable wording.
- Operator settlement export is reviewed by finance owner.
- QA can reproduce pack issue -> list -> buy -> cooldown -> open -> burned.
