import { ASSET_UNITS, ACCOUNT_TYPES } from "./policies.js";
import { PACK_STATUS } from "./state-machine.js";
import { createDefaultLedger } from "./ledger.js";
import { RiskEngine } from "./risk.js";
import { createTicketBook } from "./gameplay.js";
import { STORE_SCHEMA_VERSION } from "../version.js";
import { createEconomyConfig, ECONOMY_CONFIG_STATUS } from "./economy.js";
import { createTradingSession, TRADING_SESSION_STATUS } from "./trading-session.js";

export function createStore() {
  const ledger = createDefaultLedger();
  const risk = new RiskEngine();

  const users = new Map([
    ["player_1", { id: "player_1", name: "艾爾文", role: "PLAYER" }],
    ["operator_1", { id: "operator_1", name: "Approved Operator", role: "OPERATOR" }],
  ]);

  ledger.createAccount({
    id: "player_1_gc",
    accountType: ACCOUNT_TYPES.PLAYER_ASSET,
    assetUnit: ASSET_UNITS.GC,
    ownerType: "USER",
    ownerId: "player_1",
  });
  ledger.createAccount({
    id: "operator_1_gc",
    accountType: ACCOUNT_TYPES.PLAYER_ASSET,
    assetUnit: ASSET_UNITS.GC,
    ownerType: "USER",
    ownerId: "operator_1",
  });
  ledger.createAccount({
    id: "operator_1_income",
    accountType: ACCOUNT_TYPES.OPERATOR_INCOME,
    assetUnit: ASSET_UNITS.FIAT_TWD,
    ownerType: "OPERATOR",
    ownerId: "operator_1",
    balanceBucket: "SETTLEMENT",
  });
  ledger.createAccount({
    id: "operator_1_payable",
    accountType: ACCOUNT_TYPES.WITHDRAWAL_PAYABLE,
    assetUnit: ASSET_UNITS.FIAT_TWD,
    ownerType: "OPERATOR",
    ownerId: "operator_1",
    balanceBucket: "PENDING",
  });

  ledger.postJournal({
    journalType: "SEED",
    refType: "Seed",
    refId: "initial_gc",
    idempotencyKey: "seed:gc",
    entries: [
      { accountId: "system_gc", direction: "DEBIT", amount: 2000, assetUnit: ASSET_UNITS.GC },
      { accountId: "player_1_gc", direction: "CREDIT", amount: 1000, assetUnit: ASSET_UNITS.GC },
      { accountId: "operator_1_gc", direction: "CREDIT", amount: 1000, assetUnit: ASSET_UNITS.GC },
    ],
  });

  const defaultEconomyConfig = createEconomyConfig({ id: "economy-v1", createdBy: "system" });
  defaultEconomyConfig.status = ECONOMY_CONFIG_STATUS.ACTIVE;
  defaultEconomyConfig.approvedAt = new Date().toISOString();
  defaultEconomyConfig.activatedAt = new Date().toISOString();
  const defaultTradingSession = createTradingSession({ id: "session_1" });
  defaultTradingSession.status = TRADING_SESSION_STATUS.OPEN;
  defaultTradingSession.statusLog.push({ fromStatus: "SCHEDULED", toStatus: "OPEN", actorId: "system", createdAt: new Date().toISOString() });

  return {
    users,
    packs: new Map(),
    listings: new Map(),
    trades: new Map(),
    openLogs: new Map(),
    operatorSettlements: new Map(),
    withdrawals: new Map(),
    auditLogs: [],
    gameplay: {
      ticketProduct: {
        id: "boss_ticket",
        ticketType: "BOSS_TICKET",
        availableInventory: 100,
      },
      ticketBook: createTicketBook({ ownerId: "player_1", ticketType: "BOSS_TICKET" }),
      redemptions: [],
      bossSettlements: [],
      guildSignals: [],
      rpgClasses: [],
      contentFlags: [],
    },
    liveOps: {
      campaigns: new Map(),
      nextCampaignId: 1,
    },
    regulatory: {
      reviews: new Map(),
      nextReviewId: 1,
    },
    operations: {
      mode: "ACTIVE",
      haltedScopes: [],
      incidents: [],
      nextIncidentId: 1,
    },
    economy: {
      configs: new Map([[defaultEconomyConfig.id, defaultEconomyConfig]]),
      activeConfigId: defaultEconomyConfig.id,
      nextConfigId: 2,
      forceOpenJobs: [],
    },
    tradingSessions: new Map([[defaultTradingSession.id, defaultTradingSession]]),
    activeTradingSessionId: defaultTradingSession.id,
    nextTradingSessionId: 2,
    ledger,
    risk,
    nextPackId: 1,
    nextListingId: 1,
    nextTradeId: 1,
    nextSettlementId: 1,
    nextWithdrawalId: 1,
    createPack(ownerId) {
      const pack = {
        id: `pack_${this.nextPackId++}`,
        ownerId,
        status: PACK_STATUS.ISSUED,
        version: 1,
        initialPrice: 100,
        currentPrice: 100,
        lastTradePrice: 100,
        tradeCount: 0,
        contentSnapshotVersion: "pack-pool-v1",
        statusLog: [],
        createdAt: new Date().toISOString(),
      };
      this.packs.set(pack.id, pack);
      return pack;
    },
  };
}

export function snapshotStore(store) {
  return {
    version: STORE_SCHEMA_VERSION,
    users: [...store.users.entries()],
    packs: [...store.packs.entries()],
    listings: [...store.listings.entries()],
    trades: [...store.trades.entries()],
    openLogs: [...store.openLogs.entries()],
    operatorSettlements: [...store.operatorSettlements.entries()],
    withdrawals: [...store.withdrawals.entries()],
    auditLogs: store.auditLogs,
    gameplay: store.gameplay,
    ledger: {
      accounts: [...store.ledger.accounts.entries()],
      journals: store.ledger.journals,
      idempotencyKeys: [...store.ledger.idempotencyKeys],
    },
    liveOps: {
      campaigns: [...store.liveOps.campaigns.entries()],
      nextCampaignId: store.liveOps.nextCampaignId,
    },
    regulatory: {
      reviews: [...store.regulatory.reviews.entries()],
      nextReviewId: store.regulatory.nextReviewId,
    },
    operations: store.operations,
    economy: {
      configs: [...store.economy.configs.entries()],
      activeConfigId: store.economy.activeConfigId,
      nextConfigId: store.economy.nextConfigId,
      forceOpenJobs: store.economy.forceOpenJobs,
    },
    tradingSessions: [...store.tradingSessions.entries()],
    activeTradingSessionId: store.activeTradingSessionId,
    nextTradingSessionId: store.nextTradingSessionId,
    risk: {
      cases: [...store.risk.cases.entries()],
    },
    counters: {
      nextPackId: store.nextPackId,
      nextListingId: store.nextListingId,
      nextTradeId: store.nextTradeId,
      nextSettlementId: store.nextSettlementId,
      nextWithdrawalId: store.nextWithdrawalId,
    },
  };
}

export function hydrateStore(snapshot) {
  if (!snapshot || snapshot.version !== STORE_SCHEMA_VERSION) {
    throw new Error("Unsupported store snapshot version");
  }

  const store = createStore();
  store.users = new Map(snapshot.users);
  store.packs = new Map(snapshot.packs);
  store.listings = new Map(snapshot.listings);
  store.trades = new Map(snapshot.trades);
  store.openLogs = new Map(snapshot.openLogs);
  store.operatorSettlements = new Map(snapshot.operatorSettlements);
  store.withdrawals = new Map(snapshot.withdrawals);
  store.auditLogs = snapshot.auditLogs ?? [];
  store.gameplay = snapshot.gameplay;
  store.liveOps = {
    campaigns: new Map(snapshot.liveOps?.campaigns ?? []),
    nextCampaignId: snapshot.liveOps?.nextCampaignId ?? 1,
  };
  store.regulatory = {
    reviews: new Map(snapshot.regulatory?.reviews ?? []),
    nextReviewId: snapshot.regulatory?.nextReviewId ?? 1,
  };
  store.operations = snapshot.operations ?? {
    mode: "ACTIVE",
    haltedScopes: [],
    incidents: [],
    nextIncidentId: 1,
  };
  store.economy = {
    configs: new Map(snapshot.economy?.configs ?? []),
    activeConfigId: snapshot.economy?.activeConfigId ?? "economy-v1",
    nextConfigId: snapshot.economy?.nextConfigId ?? 2,
    forceOpenJobs: snapshot.economy?.forceOpenJobs ?? [],
  };
  store.tradingSessions = new Map(snapshot.tradingSessions ?? []);
  store.activeTradingSessionId = snapshot.activeTradingSessionId ?? "session_1";
  store.nextTradingSessionId = snapshot.nextTradingSessionId ?? 2;
  store.ledger.accounts = new Map(snapshot.ledger.accounts);
  store.ledger.journals = snapshot.ledger.journals;
  store.ledger.idempotencyKeys = new Set(snapshot.ledger.idempotencyKeys);
  store.risk.cases = new Map(snapshot.risk.cases);
  store.nextPackId = snapshot.counters.nextPackId;
  store.nextListingId = snapshot.counters.nextListingId;
  store.nextTradeId = snapshot.counters.nextTradeId;
  store.nextSettlementId = snapshot.counters.nextSettlementId;
  store.nextWithdrawalId = snapshot.counters.nextWithdrawalId;
  return store;
}
