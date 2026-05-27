# 02 Pack State Machine

## Purpose

This document defines lucky pack lifecycle states, legal transitions, locking rules, idempotency, and test cases. It is the implementation contract for pack trading, opening, cancellation, forced opening, and risk freeze behavior.

## Pack States

| State | Meaning | Tradable | Openable | Terminal |
|---|---|---:|---:|---:|
| `ISSUED` | Pack created by system but not yet assigned | No | No | No |
| `OWNED` | Pack owned by a user and available | Yes | Yes | No |
| `LISTED` | Pack listed for sale in a trading session | No direct open | No | No |
| `TRADE_LOCKED` | Buyer flow has locked the listing | No | No | No |
| `TRADED` | Ownership has changed, content reroll is pending | No | No | No |
| `COOLDOWN` | Traded pack is waiting for next tradable/openable window | No | Yes if policy allows | No |
| `FORCE_OPEN_PENDING` | System marked pack for forced opening | No | System only | No |
| `OPENING` | Pack opening transaction in progress | No | No | No |
| `OPENED` | Pack content has been revealed and ledgered | No | No | Yes |
| `BURNED` | Pack container is consumed after opening | No | No | Yes |
| `FROZEN` | Pack is held by risk control | No | No | No |

`OPENED` records the reveal event and immutable content result. `BURNED` records that the original container can no longer be transferred or opened. A pack may have both `openedAt` and `burnedAt`, but the active status after successful open must be `BURNED`.

## Transition Enum Contract

Each transition must be represented by `PackTransitionCode`.

| Code | From | To | Actor | Guard | Side Effects |
|---|---|---|---|---|---|
| `ISSUE_TO_OWNER` | `ISSUED` | `OWNED` | system/admin | valid pack template | `PackStatusLog`, issue ledger |
| `LIST_PACK` | `OWNED` | `LISTED` | owner | listing price valid, not frozen | create `PackListing` |
| `CANCEL_LISTING` | `LISTED` | `OWNED` | owner/system | no active buy lock | cancel listing |
| `LOCK_FOR_TRADE` | `LISTED` | `TRADE_LOCKED` | buyer | session open, balance sufficient | lock listing and wallets |
| `SETTLE_TRADE` | `TRADE_LOCKED` | `TRADED` | system | payment debited, seller credited | `PackTrade`, ledger entries |
| `ENTER_COOLDOWN` | `TRADED` | `COOLDOWN` | system | content history written | set cooldown/session |
| `COOLDOWN_RELEASE` | `COOLDOWN` | `OWNED` | system | cooldown expired | status log |
| `REQUEST_OPEN` | `OWNED/COOLDOWN/FORCE_OPEN_PENDING` | `OPENING` | owner/system | open allowed, no listing | lock pack |
| `OPEN_SUCCESS` | `OPENING` | `OPENED` | system | content snapshot valid | reward ledger, inventory |
| `BURN_AFTER_OPEN` | `OPENED` | `BURNED` | system | open log exists | consume container |
| `FORCE_OPEN_MARK` | `OWNED/COOLDOWN` | `FORCE_OPEN_PENDING` | system | force-open rule matched | job log |
| `FREEZE_PACK` | any non-terminal | `FROZEN` | risk/admin | risk case exists | risk log |
| `UNFREEZE_TO_OWNER` | `FROZEN` | `OWNED` | risk/admin | risk case resolved | resolution log |
| `UNFREEZE_TO_FORCE_OPEN` | `FROZEN` | `FORCE_OPEN_PENDING` | risk/admin | force-open still required | resolution log |

Illegal transitions must fail with a typed error and must not create partial ledger entries.

## Database Locking and Constraints

Required transaction order for trade:

1. Lock `TradingSession`.
2. Lock `PackListing`.
3. Lock `LuckyPack`.
4. Lock buyer wallet.
5. Lock seller wallet.
6. Validate state and balances.
7. Write trade, ledger, content history, and status updates.

Implementation requirements:

- Use row-level lock such as `SELECT ... FOR UPDATE` or ORM equivalent.
- Use unique active listing constraint: one active listing per pack.
- Use unique idempotency key for buy/open/force-open requests.
- Use optimistic version field `pack.version` to detect stale writes.
- Ledger and pack status updates must commit or rollback together.

## Listing Price Rules

```text
minListPrice <= listingPrice
listingPrice <= lastTradePrice * maxGrowthRate
```

MVP defaults:

```text
minListPrice = 1
maxGrowthRate = 1.06
```

## Force-Open Rules

A pack becomes force-open eligible when any rule matches:

- `tradeCount >= maxTradeCount`
- `currentPrice >= forceOpenPrice`
- `holdExpireAt <= now`
- manual risk/admin force-open decision

Force-open job requirements:

- Job key: `force-open:{packId}:{ruleVersion}`.
- Re-running the same job must be idempotent.
- If user opens first, force-open job exits as no-op.
- If risk freeze appears first, job moves to blocked state and retries after resolution.
- Failed ledger write rolls the pack back from `OPENING` to previous locked state inside the same transaction.

## Required Test Cases

- Concurrent buyers: exactly one succeeds, other receives listing unavailable.
- Owner cancels while buyer buys: one transaction wins, no partial locks remain.
- User open vs force-open race: exactly one open log and one reward ledger set.
- Frozen pack cannot list, buy, open, or force-open.
- Ledger failure during trade rolls back owner, listing, wallet, and status.
- Ledger failure during open rolls back reward and inventory.
- Duplicate idempotency key returns original result.
- `OPENED` pack cannot be listed or opened again.
