import { ACCOUNT_TYPES, ASSET_UNITS, assertWithdrawalSource } from "./policies.js";

export class Ledger {
  constructor() {
    this.accounts = new Map();
    this.journals = [];
    this.idempotencyKeys = new Set();
  }

  createAccount({ id, accountType, assetUnit, ownerType, ownerId, balanceBucket = "AVAILABLE" }) {
    if (this.accounts.has(id)) {
      return this.accounts.get(id);
    }

    const account = {
      id,
      accountType,
      assetUnit,
      ownerType,
      ownerId,
      balanceBucket,
      balance: 0,
    };
    this.accounts.set(id, account);
    return account;
  }

  getAccount(id) {
    const account = this.accounts.get(id);
    if (!account) {
      throw new Error(`Missing ledger account: ${id}`);
    }
    return account;
  }

  postJournal({ journalType, refType, refId, idempotencyKey, entries }) {
    if (this.idempotencyKeys.has(idempotencyKey)) {
      return this.journals.find((journal) => journal.idempotencyKey === idempotencyKey);
    }

    if (!entries || entries.length < 2) {
      throw new Error("Ledger journal requires at least two entries");
    }

    const totals = new Map();
    for (const entry of entries) {
      const account = this.getAccount(entry.accountId);
      if (account.assetUnit !== entry.assetUnit) {
        throw new Error(`Asset unit mismatch for account ${entry.accountId}`);
      }
      if (!Number.isInteger(entry.amount) || entry.amount <= 0) {
        throw new Error("Ledger amount must be a positive integer minor unit");
      }
      if (!["DEBIT", "CREDIT"].includes(entry.direction)) {
        throw new Error("Ledger entry direction must be DEBIT or CREDIT");
      }

      const current = totals.get(entry.assetUnit) ?? 0;
      totals.set(entry.assetUnit, current + (entry.direction === "DEBIT" ? entry.amount : -entry.amount));
    }

    for (const [assetUnit, total] of totals) {
      if (total !== 0) {
        throw new Error(`Unbalanced journal for ${assetUnit}`);
      }
    }

    if (journalType === "WITHDRAWAL") {
      for (const entry of entries) {
        const account = this.getAccount(entry.accountId);
        if (account.accountType === ACCOUNT_TYPES.WITHDRAWAL_PAYABLE) {
          assertWithdrawalSource({ refType, assetUnit: entry.assetUnit });
        }
      }
    }

    for (const entry of entries) {
      const account = this.getAccount(entry.accountId);
      account.balance += entry.direction === "CREDIT" ? entry.amount : -entry.amount;
      if (account.accountType !== ACCOUNT_TYPES.SYSTEM_CLEARING && account.balance < 0) {
        throw new Error(`Negative balance for account ${account.id}`);
      }
    }

    const journal = {
      id: `journal_${this.journals.length + 1}`,
      journalType,
      refType,
      refId,
      idempotencyKey,
      entries,
      createdAt: new Date().toISOString(),
    };
    this.idempotencyKeys.add(idempotencyKey);
    this.journals.push(journal);
    return journal;
  }

  balance(accountId) {
    return this.getAccount(accountId).balance;
  }

  replay() {
    const balances = new Map([...this.accounts.keys()].map((id) => [id, 0]));
    for (const journal of this.journals) {
      for (const entry of journal.entries) {
        balances.set(
          entry.accountId,
          (balances.get(entry.accountId) ?? 0) + (entry.direction === "CREDIT" ? entry.amount : -entry.amount),
        );
      }
    }
    return balances;
  }
}

export function createDefaultLedger() {
  const ledger = new Ledger();
  ledger.createAccount({
    id: "system_gc",
    accountType: ACCOUNT_TYPES.SYSTEM_CLEARING,
    assetUnit: ASSET_UNITS.GC,
    ownerType: "SYSTEM",
    ownerId: null,
  });
  ledger.createAccount({
    id: "platform_operator_income",
    accountType: ACCOUNT_TYPES.SYSTEM_CLEARING,
    assetUnit: ASSET_UNITS.FIAT_TWD,
    ownerType: "PLATFORM",
    ownerId: "platform",
  });
  ledger.createAccount({
    id: "platform_disbursement",
    accountType: ACCOUNT_TYPES.SYSTEM_CLEARING,
    assetUnit: ASSET_UNITS.FIAT_TWD,
    ownerType: "PLATFORM",
    ownerId: "platform",
  });
  return ledger;
}
