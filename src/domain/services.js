import crypto from "node:crypto";
import { ASSET_UNITS, REQUIRED_BOUNDARY_COPY } from "./policies.js";
import { PACK_STATUS, PACK_TRANSITION, assertPackActionAllowed, transitionPack } from "./state-machine.js";
import { WITHDRAWAL_STATUS, WITHDRAWAL_TRANSITION, transitionWithdrawal } from "./withdrawals.js";
import {
  consumeReservedTicket,
  detectGuildAbuseSignals,
  isContentEnabledForUser,
  purchaseTickets,
  reserveTicket,
  settleBossRewards,
  submitRedemption,
  validateRpgClasses,
} from "./gameplay.js";
import { CAMPAIGN_TRANSITION, createCampaign, transitionCampaign } from "./liveops.js";
import {
  assertReviewAllowsImplementation,
  createRegulatoryReview,
  finalizeReview,
  recordOpinion,
  runNoGoCircumventionCheck,
  submitReview,
} from "./regulatory.js";
import { APP_VERSION, MIGRATIONS, STORE_SCHEMA_VERSION } from "../version.js";
import { activateEconomyConfig, approveEconomyConfig, createEconomyConfig, shouldForceOpen } from "./economy.js";
import { createTradingSession, TRADING_SESSION_STATUS, transitionTradingSession } from "./trading-session.js";
import { assertOperationAllowed, haltOperations, OPERATION_SCOPES, resumeOperations } from "./operations.js";

function pickContent(pack) {
  const digest = crypto
    .createHash("sha256")
    .update(`${pack.id}:${pack.contentSnapshotVersion}`)
    .digest("hex");
  const roll = Number.parseInt(digest.slice(0, 8), 16) % 100;
  if (roll < 60) return { itemKey: "iron_ore", name: "Iron Ore", rarity: "COMMON" };
  if (roll < 90) return { itemKey: "moon_crystal", name: "Moon Crystal", rarity: "RARE" };
  return { itemKey: "ancient_core", name: "Ancient Core", rarity: "EPIC" };
}

export class GameService {
  constructor(store) {
    this.store = store;
  }

  snapshot() {
    return {
      boundaryCopy: REQUIRED_BOUNDARY_COPY,
      users: [...this.store.users.values()],
      packs: [...this.store.packs.values()],
      listings: [...this.store.listings.values()],
      trades: [...this.store.trades.values()],
      openLogs: [...this.store.openLogs.values()],
      settlements: [...this.store.operatorSettlements.values()],
      withdrawals: [...this.store.withdrawals.values()],
      auditLogs: this.store.auditLogs,
      gameplay: this.store.gameplay,
      liveOps: {
        campaigns: [...this.store.liveOps.campaigns.values()],
      },
      regulatory: {
        reviews: [...this.store.regulatory.reviews.values()],
      },
      economy: {
        activeConfigId: this.store.economy.activeConfigId,
        configs: [...this.store.economy.configs.values()],
        forceOpenJobs: this.store.economy.forceOpenJobs,
      },
      operations: this.store.operations,
      tradingSessions: [...this.store.tradingSessions.values()],
      activeTradingSessionId: this.store.activeTradingSessionId,
      balances: {
        playerGc: this.store.ledger.balance("player_1_gc"),
        operatorGc: this.store.ledger.balance("operator_1_gc"),
        operatorIncome: this.store.ledger.balance("operator_1_income"),
        operatorPayable: this.store.ledger.balance("operator_1_payable"),
      },
      riskCases: [...this.store.risk.cases.values()],
      readiness: this.launchReadinessReport(),
    };
  }

  playerProfile({ ownerId = "player_1", user = null } = {}) {
    this.store.gameplay.playerProfiles ??= {};
    if (!this.store.gameplay.playerProfiles[ownerId]) {
      this.store.gameplay.playerProfiles[ownerId] = {
        actionSeq: 0,
        player: {
          level: 12,
          exp: 64,
          region: "普隆丘陵",
          partyPower: 2160,
        },
        character: {
          gender: "male",
          classId: "swordsman",
          className: "劍士",
          hp: 923,
          maxHp: 923,
          paperDoll: {
            body: "adventurer_male_base",
            palette: "sunlit_adventurer",
            styleTarget: "original_ro_like_2_5d",
          },
          equipment: {
            weapon: { id: "bronze_sword", name: "青銅長劍", rarity: "COMMON", slot: "weapon", visualKey: "sword" },
            armor: { id: "field_tunic", name: "冒險者外套", rarity: "COMMON", slot: "armor", visualKey: "tunic" },
            head: { id: "sky_ribbon", name: "天空髮帶", rarity: "COMMON", slot: "head", visualKey: "ribbon" },
            accessory: { id: "star_charm", name: "星塵護符", rarity: "RARE", slot: "accessory", visualKey: "charm" },
          },
        },
        inventory: [
          { id: "bronze_sword", name: "青銅長劍", type: "weapon", rarity: "COMMON", quantity: 1, visualKey: "sword" },
          { id: "field_tunic", name: "冒險者外套", type: "armor", rarity: "COMMON", quantity: 1, visualKey: "tunic" },
          { id: "star_charm", name: "星塵護符", type: "accessory", rarity: "RARE", quantity: 1, visualKey: "charm" },
          { id: "moon_crystal", name: "月光結晶", type: "material", rarity: "RARE", quantity: 3, visualKey: "crystal" },
        ],
        skills: [
          { id: "power_slash", name: "強襲斬", level: 4, classId: "swordsman", visualKey: "warrior", nextCostGc: 660 },
          { id: "wind_step", name: "疾風步", level: 3, classId: "ranger", visualKey: "ranger", nextCostGc: 440 },
          { id: "arcane_bolt", name: "奧術彈", level: 2, classId: "mage", visualKey: "mage", nextCostGc: 520 },
          { id: "warm_light", name: "暖光術", level: 2, classId: "cleric", visualKey: "cleric", nextCostGc: 480 },
        ],
        combat: {
          mode: "AUTO_BATTLE",
          areaId: "pron_hills",
          areaName: "普隆丘陵",
          target: { id: "green_slime", name: "丘陵史萊姆", hp: 110, maxHp: 283, visualKey: "slime" },
          statusText: "角色正在普隆丘陵自動巡邏，戰鬥結果會寫入下方文字流。",
          log: [
            "艾爾文使用強襲斬造成 173 點傷害。",
            "丘陵史萊姆掉落 18 GC 與月光結晶碎片。",
            "隊伍戰力提升，下一輪自動巡邏已排入。",
          ],
        },
      };
    }
    if (user?.name) {
      this.store.gameplay.playerProfiles[ownerId].playerName = user.name;
    }
    return this.store.gameplay.playerProfiles[ownerId];
  }

  playerState({ ownerId = "player_1" } = {}) {
    const user = this.store.users.get(ownerId) ?? { id: ownerId, name: "Adventurer", role: "PLAYER" };
    const profile = this.playerProfile({ ownerId, user });
    const packs = [...this.store.packs.values()].filter((pack) => pack.ownerId === ownerId || pack.status === PACK_STATUS.LISTED);
    const listings = [...this.store.listings.values()].filter((listing) => listing.status === "ACTIVE");
    const openLogs = [...this.store.openLogs.values()].filter((log) => log.ownerId === ownerId);
    const activeSession = this.activeTradingSession();
    return {
      player: {
        id: user.id,
        name: user.name,
        level: profile.player.level,
        exp: profile.player.exp,
        region: profile.player.region,
        partyPower: profile.player.partyPower,
      },
      character: profile.character,
      inventory: profile.inventory,
      skills: profile.skills,
      combat: profile.combat,
      balances: {
        gc: this.store.ledger.balance(`${ownerId}_gc`),
      },
      tickets: {
        active: this.store.gameplay.ticketBook?.active ?? 0,
        reserved: this.store.gameplay.ticketBook?.reserved ?? 0,
        consumed: this.store.gameplay.ticketBook?.consumed ?? 0,
      },
      packs: packs.map((pack) => ({
        id: pack.id,
        ownerId: pack.ownerId,
        status: pack.status,
        currentPrice: pack.currentPrice,
        tradeCount: pack.tradeCount,
        contentSnapshotVersion: pack.contentSnapshotVersion,
      })),
      listings: listings.map((listing) => ({
        id: listing.id,
        packId: listing.packId,
        sellerId: listing.sellerId,
        price: listing.price,
        status: listing.status,
      })),
      openLogs: openLogs.map((log) => ({
        id: log.id,
        packId: log.packId,
        content: log.content,
        createdAt: log.createdAt,
      })),
      tradingSession: {
        id: activeSession.id,
        status: activeSession.status,
      },
      simulatedPayments: this.store.gameplay.simulatedPayments ?? [],
    };
  }

  simulatePlayerPayment({ ownerId = "player_1", provider = "SIMULATED_EXTERNAL", amount = 100, idempotencyKey = `sim-pay-${Date.now()}` } = {}) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Simulated payment amount must be a positive integer");
    }
    this.store.gameplay.simulatedPayments ??= [];
    const existing = this.store.gameplay.simulatedPayments.find((payment) => payment.idempotencyKey === idempotencyKey);
    if (existing) {
      return { payment: existing, pack: this.requirePack(existing.packId) };
    }
    const pack = this.issuePack({ ownerId });
    const payment = {
      id: `sim_payment_${this.store.gameplay.simulatedPayments.length + 1}`,
      ownerId,
      provider,
      amount,
      status: "SIMULATED_APPROVED",
      packId: pack.id,
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };
    this.store.gameplay.simulatedPayments.push(payment);
    return { payment, pack };
  }

  runPlayerAction({ ownerId = "player_1", action = "patrol" } = {}) {
    const user = this.store.users.get(ownerId) ?? { id: ownerId, name: "Adventurer", role: "PLAYER" };
    const profile = this.playerProfile({ ownerId, user });
    profile.actionSeq = (profile.actionSeq ?? 0) + 1;
    const actionSeq = profile.actionSeq;

    if (action === "patrol") {
      return this.runPlayerPatrol({ ownerId, profile, actionSeq });
    }
    if (action === "open_pack") {
      return this.runPlayerOpenPack({ ownerId, profile, actionSeq });
    }
    if (action === "list_pack") {
      return this.runPlayerListPack({ ownerId, profile, actionSeq });
    }
    if (action === "challenge") {
      return this.runPlayerChallenge({ ownerId, profile, actionSeq });
    }
    if (action === "toggle_equipment") {
      return this.runPlayerToggleEquipment({ profile });
    }
    throw new Error(`Unsupported player action: ${action}`);
  }

  runPlayerPatrol({ ownerId, profile, actionSeq }) {
    const target = profile.combat.target;
    const damage = 37 + (profile.player.level % 5) * 4;
    target.hp = Math.max(0, target.hp - damage);
    profile.player.exp += 5;
    profile.player.partyPower += 8;
    if (profile.player.exp >= 100) {
      profile.player.level += 1;
      profile.player.exp -= 100;
      profile.combat.log.unshift(`${profile.playerName ?? "艾爾文"} 升到 Lv.${profile.player.level}。`);
    }
    this.creditPlayerGc({ ownerId, amount: 18, refId: `patrol_${actionSeq}` });
    profile.combat.log.unshift(`${profile.playerName ?? "艾爾文"} 自動巡邏造成 ${damage} 點傷害，獲得 18 GC。`);
    if (target.hp <= 0) {
      profile.inventory = this.addInventoryItem(profile.inventory, {
        id: "slime_jelly",
        name: "史萊姆凝膠",
        type: "material",
        rarity: "COMMON",
        quantity: 1,
        visualKey: "material",
      });
      target.hp = target.maxHp;
      profile.combat.log.unshift(`${target.name} 被擊退，掉落史萊姆凝膠。`);
    }
    profile.combat.log = profile.combat.log.slice(0, 8);
    return { action: "patrol", profile: this.playerState({ ownerId }) };
  }

  runPlayerOpenPack({ ownerId, profile, actionSeq }) {
    const pack = [...this.store.packs.values()].find((candidate) => candidate.ownerId === ownerId && candidate.status === PACK_STATUS.OWNED);
    if (!pack) {
      profile.combat.log.unshift("目前沒有可開啟的禮包，請先到禮包頁執行模擬付款。");
      return { action: "open_pack", skipped: true, reason: "NO_OWNED_PACK", profile: this.playerState({ ownerId }) };
    }
    const openLog = this.openPack({ packId: pack.id, actorId: ownerId });
    profile.inventory = this.addInventoryItem(profile.inventory, {
      id: openLog.content.itemKey,
      name: openLog.content.name,
      type: "material",
      rarity: openLog.content.rarity,
      quantity: 1,
      visualKey: "crystal",
    });
    profile.combat.log.unshift(`${pack.id} 已開啟，取得 ${openLog.content.name}。`);
    profile.combat.log = profile.combat.log.slice(0, 8);
    return { action: "open_pack", openLog, profile: this.playerState({ ownerId }) };
  }

  runPlayerListPack({ ownerId, profile, actionSeq }) {
    const pack = [...this.store.packs.values()].find((candidate) => candidate.ownerId === ownerId && candidate.status === PACK_STATUS.OWNED);
    if (!pack) {
      profile.combat.log.unshift("目前沒有可上架的玩家禮包。");
      return { action: "list_pack", skipped: true, reason: "NO_OWNED_PACK", profile: this.playerState({ ownerId }) };
    }
    const listing = this.listPack({ packId: pack.id, ownerId, price: Math.min(pack.currentPrice + 1, 120) });
    profile.combat.log.unshift(`${pack.id} 已移到交易頁上架，價格 ${listing.price} GC。`);
    profile.combat.log = profile.combat.log.slice(0, 8);
    return { action: "list_pack", listing, profile: this.playerState({ ownerId }) };
  }

  runPlayerChallenge({ ownerId, profile, actionSeq }) {
    if ((this.store.gameplay.ticketBook?.active ?? 0) <= 0) {
      this.purchaseTicket({ quantity: 1, idempotencyKey: `player-action-ticket-${ownerId}-${actionSeq}` });
    }
    this.reserveTicket({ quantity: 1, idempotencyKey: `player-action-reserve-${ownerId}-${actionSeq}` });
    this.consumeTicket({ quantity: 1, idempotencyKey: `player-action-consume-${ownerId}-${actionSeq}` });
    this.creditPlayerGc({ ownerId, amount: 42, refId: `challenge_${actionSeq}` });
    profile.player.partyPower += 24;
    profile.combat.log.unshift("挑戰首領完成，消耗 1 張票券並取得 42 GC。");
    profile.combat.log = profile.combat.log.slice(0, 8);
    return { action: "challenge", profile: this.playerState({ ownerId }) };
  }

  runPlayerToggleEquipment({ profile }) {
    const currentWeapon = profile.character.equipment.weapon.id;
    if (currentWeapon === "bronze_sword") {
      profile.character.gender = "female";
      profile.character.classId = "mage";
      profile.character.className = "法師";
      profile.character.equipment.weapon = { id: "arcane_staff", name: "星紋法杖", rarity: "RARE", slot: "weapon", visualKey: "staff" };
      profile.character.equipment.armor = { id: "violet_robe", name: "紫晶長袍", rarity: "RARE", slot: "armor", visualKey: "robe" };
      profile.character.equipment.head = { id: "moon_tiara", name: "月紋冠飾", rarity: "RARE", slot: "head", visualKey: "tiara" };
    } else {
      profile.character.gender = "male";
      profile.character.classId = "swordsman";
      profile.character.className = "劍士";
      profile.character.equipment.weapon = { id: "bronze_sword", name: "青銅長劍", rarity: "COMMON", slot: "weapon", visualKey: "sword" };
      profile.character.equipment.armor = { id: "field_tunic", name: "冒險者外套", rarity: "COMMON", slot: "armor", visualKey: "tunic" };
      profile.character.equipment.head = { id: "sky_ribbon", name: "天空髮帶", rarity: "COMMON", slot: "head", visualKey: "ribbon" };
    }
    profile.player.partyPower += 12;
    profile.combat.log.unshift(`角色切換為 ${profile.character.className} 裝備外觀。`);
    profile.combat.log = profile.combat.log.slice(0, 8);
    return { action: "toggle_equipment", profile };
  }

  addInventoryItem(inventory, item) {
    const next = [...inventory];
    const existing = next.find((entry) => entry.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
      return next;
    }
    next.push(item);
    return next;
  }

  creditPlayerGc({ ownerId, amount, refId }) {
    this.store.ledger.postJournal({
      journalType: "GAMEPLAY_REWARD",
      refType: "PlayerAction",
      refId,
      idempotencyKey: `player-action:${ownerId}:${refId}`,
      entries: [
        { accountId: "system_gc", direction: "DEBIT", amount, assetUnit: ASSET_UNITS.GC },
        { accountId: `${ownerId}_gc`, direction: "CREDIT", amount, assetUnit: ASSET_UNITS.GC },
      ],
    });
  }

  issuePack({ ownerId = "player_1" } = {}) {
    const pack = this.store.createPack(ownerId);
    pack.economyConfigId = this.activeEconomyConfig().id;
    transitionPack(pack, PACK_TRANSITION.ISSUE_TO_OWNER, { actorType: "system" });
    return pack;
  }

  listPack({ packId, ownerId, price }) {
    assertOperationAllowed(this.store.operations, OPERATION_SCOPES.TRADING);
    const pack = this.requirePack(packId);
    assertPackActionAllowed(pack, "list");
    if (this.store.risk.isFrozen("PACK", packId)) {
      throw new Error("Pack is frozen by risk control");
    }
    if (pack.ownerId !== ownerId) {
      throw new Error("Only owner can list pack");
    }
    if (pack.status !== PACK_STATUS.OWNED) {
      throw new Error("Only OWNED pack can be listed");
    }
    const session = this.activeTradingSession();
    if (session.status !== TRADING_SESSION_STATUS.OPEN) {
      throw new Error("Trading session is not open");
    }
    const config = this.activeEconomyConfig();
    if (!Number.isInteger(price) || price < config.minListPrice || price > Math.floor(pack.lastTradePrice * config.maxGrowthRate)) {
      throw new Error("Listing price violates MVP price cap");
    }

    transitionPack(pack, PACK_TRANSITION.LIST_PACK, { actorType: "user", actorId: ownerId });
    const listing = {
      id: `listing_${this.store.nextListingId++}`,
      packId,
      sellerId: ownerId,
      price,
      status: "ACTIVE",
      economyConfigId: config.id,
      sessionId: session.id,
      createdAt: new Date().toISOString(),
    };
    this.store.listings.set(listing.id, listing);
    return listing;
  }

  createEconomyConfig(input = {}) {
    const config = createEconomyConfig({
      id: `economy-v${this.store.economy.nextConfigId++}`,
      ...input,
    });
    this.store.economy.configs.set(config.id, config);
    return config;
  }

  approveEconomyConfig({ configId, actorId = "economy_admin" }) {
    const config = this.requireEconomyConfig(configId);
    return approveEconomyConfig(config, { actorId });
  }

  activateEconomyConfig({ configId }) {
    const config = this.requireEconomyConfig(configId);
    const active = this.activeEconomyConfig();
    activateEconomyConfig(config, active);
    this.store.economy.activeConfigId = config.id;
    return config;
  }

  runForceOpenJob({ now = new Date().toISOString() } = {}) {
    const config = this.activeEconomyConfig();
    const job = {
      id: `force_open_job_${this.store.economy.forceOpenJobs.length + 1}`,
      configId: config.id,
      scannedAt: new Date(now).toISOString(),
      openedPackIds: [],
      skippedPackIds: [],
    };

    for (const pack of this.store.packs.values()) {
      const forceOpenEligible =
        pack.tradeCount >= config.maxTradeCount ||
        pack.currentPrice >= config.forceOpenPrice ||
        (pack.holdExpireAt && new Date(pack.holdExpireAt).getTime() <= new Date(now).getTime());
      if (pack.status === PACK_STATUS.FROZEN && forceOpenEligible) {
        job.skippedPackIds.push(pack.id);
        continue;
      }
      if (!shouldForceOpen(pack, config, now)) {
        continue;
      }
      if (this.store.risk.isFrozen("PACK", pack.id)) {
        job.skippedPackIds.push(pack.id);
        continue;
      }
      transitionPack(pack, PACK_TRANSITION.FORCE_OPEN_MARK, { actorType: "system", reason: "force-open job" });
      this.openPack({ packId: pack.id, actorId: pack.ownerId });
      job.openedPackIds.push(pack.id);
    }

    this.store.economy.forceOpenJobs.push(job);
    return job;
  }

  activeEconomyConfig() {
    return this.requireEconomyConfig(this.store.economy.activeConfigId);
  }

  requireEconomyConfig(configId) {
    const config = this.store.economy.configs.get(configId);
    if (!config) {
      throw new Error(`Missing economy config: ${configId}`);
    }
    return config;
  }

  buyPack({ listingId, buyerId }) {
    assertOperationAllowed(this.store.operations, OPERATION_SCOPES.TRADING);
    const listing = this.requireListing(listingId);
    if (listing.status !== "ACTIVE") {
      throw new Error("Listing is not active");
    }
    const session = this.requireTradingSession(listing.sessionId);
    if (session.status !== TRADING_SESSION_STATUS.OPEN) {
      throw new Error("Trading session is not open");
    }
    const pack = this.requirePack(listing.packId);
    assertPackActionAllowed(pack, "buy");
    if (this.store.risk.isFrozen("PACK", pack.id)) {
      throw new Error("Pack is frozen by risk control");
    }

    transitionPack(pack, PACK_TRANSITION.LOCK_FOR_TRADE, { actorType: "user", actorId: buyerId });
    this.store.ledger.postJournal({
      journalType: "PACK_TRADE",
      refType: "PackTrade",
      refId: listing.id,
      idempotencyKey: `trade:${listing.id}:${buyerId}`,
      entries: [
        { accountId: `${buyerId}_gc`, direction: "DEBIT", amount: listing.price, assetUnit: ASSET_UNITS.GC },
        { accountId: `${listing.sellerId}_gc`, direction: "CREDIT", amount: listing.price, assetUnit: ASSET_UNITS.GC },
      ],
    });

    transitionPack(pack, PACK_TRANSITION.SETTLE_TRADE, { actorType: "system" });
    pack.ownerId = buyerId;
    pack.tradeCount += 1;
    pack.lastTradePrice = listing.price;
    pack.currentPrice = listing.price;
    listing.status = "COMPLETED";
    const trade = {
      id: `trade_${this.store.nextTradeId++}`,
      listingId,
      packId: pack.id,
      buyerId,
      sellerId: listing.sellerId,
      price: listing.price,
      createdAt: new Date().toISOString(),
    };
    this.store.trades.set(trade.id, trade);
    transitionPack(pack, PACK_TRANSITION.ENTER_COOLDOWN, { actorType: "system" });
    return trade;
  }

  createTradingSession({ startsAt = null, endsAt = null } = {}) {
    const session = createTradingSession({ id: `session_${this.store.nextTradingSessionId++}`, startsAt, endsAt });
    this.store.tradingSessions.set(session.id, session);
    return session;
  }

  advanceTradingSession({ sessionId, status, actorId = "ops_admin" }) {
    const session = this.requireTradingSession(sessionId);
    transitionTradingSession(session, status, actorId);
    if (status === TRADING_SESSION_STATUS.OPEN) {
      this.store.activeTradingSessionId = session.id;
    }
    return session;
  }

  activeTradingSession() {
    return this.requireTradingSession(this.store.activeTradingSessionId);
  }

  requireTradingSession(sessionId) {
    const session = this.store.tradingSessions.get(sessionId);
    if (!session) {
      throw new Error(`Missing trading session: ${sessionId}`);
    }
    return session;
  }

  openPack({ packId, actorId }) {
    const pack = this.requirePack(packId);
    assertPackActionAllowed(pack, "open");
    if (this.store.risk.isFrozen("PACK", packId)) {
      throw new Error("Pack is frozen by risk control");
    }
    if (pack.ownerId !== actorId) {
      throw new Error("Only owner can open pack");
    }

    transitionPack(pack, PACK_TRANSITION.REQUEST_OPEN, { actorType: "user", actorId });
    const content = pickContent(pack);
    const openLog = {
      id: `open_${this.store.openLogs.size + 1}`,
      packId,
      ownerId: actorId,
      content,
      contentSnapshotVersion: pack.contentSnapshotVersion,
      createdAt: new Date().toISOString(),
    };
    this.store.openLogs.set(openLog.id, openLog);
    transitionPack(pack, PACK_TRANSITION.OPEN_SUCCESS, { actorType: "system" });
    transitionPack(pack, PACK_TRANSITION.BURN_AFTER_OPEN, { actorType: "system" });
    return openLog;
  }

  freezePack({ packId, reason }) {
    const pack = this.requirePack(packId);
    const riskCase = this.store.risk.freeze({ targetType: "PACK", targetId: packId, reason });
    transitionPack(pack, PACK_TRANSITION.FREEZE_PACK, { actorType: "risk", reason });
    return riskCase;
  }

  createOperatorSettlement({
    operatorId = "operator_1",
    amount,
    approvedWithdrawableAmount = amount,
    excludedAmount = amount - approvedWithdrawableAmount,
    excludedReasons = [],
    evidence = "manual pilot evidence",
    taxStatus = "VALID",
    paymentStatus = "VALID",
  }) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Settlement amount must be a positive integer minor unit");
    }
    if (
      !Number.isInteger(approvedWithdrawableAmount) ||
      approvedWithdrawableAmount < 0 ||
      approvedWithdrawableAmount > amount
    ) {
      throw new Error("Approved withdrawable amount must be between zero and settlement amount");
    }
    if (!Number.isInteger(excludedAmount) || excludedAmount < 0 || excludedAmount !== amount - approvedWithdrawableAmount) {
      throw new Error("Excluded amount must equal amount minus approved withdrawable amount");
    }
    if (excludedAmount > 0 && excludedReasons.length === 0) {
      throw new Error("Excluded settlement amount requires at least one exclusion reason");
    }
    const settlement = {
      id: `settlement_${this.store.nextSettlementId++}`,
      operatorId,
      amount,
      grossAmount: amount,
      approvedWithdrawableAmount,
      excludedAmount,
      excludedReasons,
      evidence,
      status: "APPROVED",
      taxStatus,
      paymentStatus,
      createdAt: new Date().toISOString(),
    };
    this.store.operatorSettlements.set(settlement.id, settlement);
    if (approvedWithdrawableAmount > 0) {
      this.store.ledger.postJournal({
        journalType: "OPERATOR_SETTLEMENT",
        refType: "OperatorSettlement",
        refId: settlement.id,
        idempotencyKey: `settlement:${settlement.id}`,
        entries: [
          {
            accountId: "platform_operator_income",
            direction: "DEBIT",
            amount: approvedWithdrawableAmount,
            assetUnit: ASSET_UNITS.FIAT_TWD,
          },
          {
            accountId: `${operatorId}_income`,
            direction: "CREDIT",
            amount: approvedWithdrawableAmount,
            assetUnit: ASSET_UNITS.FIAT_TWD,
          },
        ],
      });
    }
    return settlement;
  }

  requestWithdrawal({ operatorId = "operator_1", settlementId, amount, assetUnit = ASSET_UNITS.FIAT_TWD }) {
    assertOperationAllowed(this.store.operations, OPERATION_SCOPES.WITHDRAWAL);
    const settlement = this.store.operatorSettlements.get(settlementId);
    if (!settlement || settlement.status !== "APPROVED") {
      throw new Error("Withdrawal requires an approved OperatorSettlement");
    }
    if (settlement.operatorId !== operatorId) {
      throw new Error("Settlement does not belong to operator");
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Withdrawal amount must be a positive integer minor unit");
    }
    if (assetUnit !== ASSET_UNITS.FIAT_TWD) {
      throw new Error("Withdrawals are limited to approved fiat TWD settlement income");
    }
    const availability = this.settlementWithdrawalAvailability(settlementId);
    if (amount > availability.availableAmount) {
      throw new Error("Withdrawal exceeds remaining approved settlement amount");
    }

    const withdrawal = {
      id: `withdrawal_${this.store.nextWithdrawalId++}`,
      operatorId,
      settlementId,
      amount,
      sourceApprovedAmount: settlement.approvedWithdrawableAmount,
      status: WITHDRAWAL_STATUS.DRAFT,
      taxStatus: settlement.taxStatus,
      paymentStatus: settlement.paymentStatus,
      statusLog: [],
      createdAt: new Date().toISOString(),
    };
    transitionWithdrawal(withdrawal, WITHDRAWAL_TRANSITION.SUBMIT, {
      actorType: "operator",
      actorId: operatorId,
    });
    this.store.withdrawals.set(withdrawal.id, withdrawal);
    this.store.ledger.postJournal({
      journalType: "WITHDRAWAL",
      refType: "OperatorSettlement",
      refId: settlementId,
      idempotencyKey: `withdrawal:${withdrawal.id}`,
      entries: [
        { accountId: `${operatorId}_income`, direction: "DEBIT", amount, assetUnit },
        { accountId: `${operatorId}_payable`, direction: "CREDIT", amount, assetUnit },
      ],
    });
    return withdrawal;
  }

  advanceWithdrawal({ withdrawalId, transition, actorId = "finance_admin", reason = null }) {
    const withdrawal = this.store.withdrawals.get(withdrawalId);
    if (!withdrawal) {
      throw new Error(`Missing withdrawal: ${withdrawalId}`);
    }

    const beforeStatus = withdrawal.status;
    transitionWithdrawal(withdrawal, transition, {
      actorType: "admin",
      actorId,
      reason,
    });
    if (
      [WITHDRAWAL_TRANSITION.REJECT, WITHDRAWAL_TRANSITION.CANCEL].includes(transition) &&
      !withdrawal.releasedAt
    ) {
      this.releaseWithdrawalAllocation(withdrawal, transition);
    }
    if (transition === WITHDRAWAL_TRANSITION.MARK_PAID && !withdrawal.paidAt) {
      this.payWithdrawal(withdrawal);
    }
    this.store.auditLogs.push({
      id: `audit_${this.store.auditLogs.length + 1}`,
      targetType: "WithdrawalRequest",
      targetId: withdrawalId,
      action: transition,
      actorId,
      reason: reason ?? `status ${beforeStatus} -> ${withdrawal.status}`,
      createdAt: new Date().toISOString(),
    });
    return withdrawal;
  }

  settlementWithdrawalAvailability(settlementId) {
    const settlement = this.store.operatorSettlements.get(settlementId);
    if (!settlement) {
      throw new Error(`Missing settlement: ${settlementId}`);
    }
    const reservedAmount = [...this.store.withdrawals.values()]
      .filter((withdrawal) => withdrawal.settlementId === settlementId && !withdrawal.releasedAt)
      .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    return {
      settlementId,
      approvedWithdrawableAmount: settlement.approvedWithdrawableAmount,
      excludedAmount: settlement.excludedAmount,
      reservedAmount,
      availableAmount: settlement.approvedWithdrawableAmount - reservedAmount,
    };
  }

  releaseWithdrawalAllocation(withdrawal, transition) {
    this.store.ledger.postJournal({
      journalType: "WITHDRAWAL_RELEASE",
      refType: "OperatorSettlement",
      refId: withdrawal.settlementId,
      idempotencyKey: `withdrawal-release:${withdrawal.id}`,
      entries: [
        {
          accountId: `${withdrawal.operatorId}_payable`,
          direction: "DEBIT",
          amount: withdrawal.amount,
          assetUnit: ASSET_UNITS.FIAT_TWD,
        },
        {
          accountId: `${withdrawal.operatorId}_income`,
          direction: "CREDIT",
          amount: withdrawal.amount,
          assetUnit: ASSET_UNITS.FIAT_TWD,
        },
      ],
    });
    withdrawal.releasedAt = new Date().toISOString();
    withdrawal.releaseReason = transition;
  }

  payWithdrawal(withdrawal) {
    this.store.ledger.postJournal({
      journalType: "WITHDRAWAL_DISBURSEMENT",
      refType: "OperatorSettlement",
      refId: withdrawal.settlementId,
      idempotencyKey: `withdrawal-paid:${withdrawal.id}`,
      entries: [
        {
          accountId: `${withdrawal.operatorId}_payable`,
          direction: "DEBIT",
          amount: withdrawal.amount,
          assetUnit: ASSET_UNITS.FIAT_TWD,
        },
        {
          accountId: "platform_disbursement",
          direction: "CREDIT",
          amount: withdrawal.amount,
          assetUnit: ASSET_UNITS.FIAT_TWD,
        },
      ],
    });
    withdrawal.paidAt = new Date().toISOString();
  }

  requestGameplayWithdrawal() {
    throw new Error("GC, packs, items, tickets, boss rewards, and trade profit are gameplay assets and cannot be withdrawn");
  }

  haltOperations(input = {}) {
    const incident = haltOperations(this.store.operations, input);
    this.store.auditLogs.push({
      id: `audit_${this.store.auditLogs.length + 1}`,
      targetType: "OperationalIncident",
      targetId: incident.id,
      action: "HALT",
      actorId: incident.actorId,
      reason: incident.reason,
      createdAt: new Date().toISOString(),
    });
    return { mode: this.store.operations.mode, incident, haltedScopes: this.store.operations.haltedScopes };
  }

  resumeOperations(input = {}) {
    const result = resumeOperations(this.store.operations, input);
    this.store.auditLogs.push({
      id: `audit_${this.store.auditLogs.length + 1}`,
      targetType: "OperationalIncident",
      targetId: result.incident?.id ?? "scope-resume",
      action: "RESUME",
      actorId: input.actorId ?? "risk_admin",
      reason: input.reason,
      createdAt: new Date().toISOString(),
    });
    return result;
  }

  purchaseTicket({ quantity = 1, idempotencyKey = `ticket-purchase-${Date.now()}` } = {}) {
    const result = purchaseTickets({
      product: this.store.gameplay.ticketProduct,
      ticketBook: this.store.gameplay.ticketBook,
      quantity,
      idempotencyKey,
    });
    this.store.gameplay.ticketProduct = result.product;
    this.store.gameplay.ticketBook = result.ticketBook;
    return result;
  }

  reserveTicket({ quantity = 1, idempotencyKey = `ticket-reserve-${Date.now()}` } = {}) {
    const result = reserveTicket({
      ticketBook: this.store.gameplay.ticketBook,
      quantity,
      idempotencyKey,
    });
    this.store.gameplay.ticketBook = result.ticketBook;
    return result;
  }

  consumeTicket({ quantity = 1, idempotencyKey = `ticket-consume-${Date.now()}` } = {}) {
    const result = consumeReservedTicket({
      ticketBook: this.store.gameplay.ticketBook,
      quantity,
      idempotencyKey,
    });
    this.store.gameplay.ticketBook = result.ticketBook;
    return result;
  }

  submitRedemption({ ticketId = "boss_ticket_1", refId = "boss_reward_1", idempotencyKey = `redemption-${Date.now()}` } = {}) {
    const result = submitRedemption({
      redemptions: this.store.gameplay.redemptions,
      ticketId,
      refId,
      idempotencyKey,
    });
    this.store.gameplay.redemptions = result.redemptions;
    return result.redemption;
  }

  settleBoss({ bossRewardPool = 1000 } = {}) {
    const settlement = settleBossRewards({
      bossRewardPool,
      contributions: [
        { userId: "player_1", guildId: "guild_alpha", amount: 80 },
        { userId: "operator_1", guildId: "guild_alpha", amount: 20 },
      ],
      guildPenaltyRates: { guild_alpha: 0.1 },
    });
    this.store.gameplay.bossSettlements.push({
      id: `boss_settlement_${this.store.gameplay.bossSettlements.length + 1}`,
      rewards: settlement,
      createdAt: new Date().toISOString(),
    });
    return this.store.gameplay.bossSettlements.at(-1);
  }

  scanGuildAbuse() {
    const signals = detectGuildAbuseSignals({
      members: [
        { userId: "player_1", active: true, deviceId: "device_a", paymentClusterId: "bank_a" },
        { userId: "operator_1", active: false, deviceId: "device_a", paymentClusterId: "bank_a" },
        { userId: "member_3", active: false, deviceId: "device_a", paymentClusterId: "bank_a" },
      ],
      contributions: [
        { userId: "player_1", bossRisk: "LOW" },
        { userId: "player_1", bossRisk: "LOW" },
        { userId: "player_1", bossRisk: "LOW" },
      ],
    });
    this.store.gameplay.guildSignals = signals;
    return signals;
  }

  validateRpg() {
    const classes = validateRpgClasses([
      { classKey: "WARRIOR", hpMultiplier: 1.2, damageMultiplier: 0.9 },
      { classKey: "RANGER", hpMultiplier: 0.9, damageMultiplier: 1.1 },
      { classKey: "MAGE", hpMultiplier: 0.8, damageMultiplier: 1.2, cooldownMultiplier: 1.2 },
      { classKey: "CLERIC", hpMultiplier: 1, damageMultiplier: 0.7, supportCap: 100 },
    ]);
    const flag = {
      contentKey: "rpg_phase_11_demo",
      configVersion: "rpg-v1",
      enabledForPercent: 100,
      allowedCohorts: ["beta"],
      rollbackVersion: "rpg-v0",
    };
    this.store.gameplay.rpgClasses = classes;
    this.store.gameplay.contentFlags = [
      {
        ...flag,
        enabledForPlayer: isContentEnabledForUser({ flag, user: { userId: "player_1", cohort: "beta" } }),
      },
    ];
    return { classes, contentFlags: this.store.gameplay.contentFlags };
  }

  reconcileLedger() {
    const replay = this.store.ledger.replay();
    const accounts = [...this.store.ledger.accounts.values()].map((account) => {
      const replayedBalance = replay.get(account.id) ?? 0;
      return {
        accountId: account.id,
        accountType: account.accountType,
        assetUnit: account.assetUnit,
        cachedBalance: account.balance,
        replayedBalance,
        mismatch: account.balance - replayedBalance,
      };
    });
    const mismatches = accounts.filter((account) => account.mismatch !== 0);
    return {
      status: mismatches.length === 0 ? "PASS" : "FAIL",
      checkedAt: new Date().toISOString(),
      accountCount: accounts.length,
      journalCount: this.store.ledger.journals.length,
      mismatches,
      accounts,
    };
  }

  boundaryReport() {
    return {
      status: "ENFORCED",
      boundaryCopy: REQUIRED_BOUNDARY_COPY,
      nonWithdrawableAssets: ["GC", "PACK", "ITEM", "TICKET", "BOSS_REWARD", "GUILD_REWARD", "TRADE_PROFIT"],
      withdrawableSource: "OperatorSettlement",
      activeWithdrawalCount: [...this.store.withdrawals.values()].filter((withdrawal) =>
        ["PENDING_REVIEW", "APPROVED", "TAX_READY", "PAYMENT_SCHEDULED"].includes(withdrawal.status),
      ).length,
      forbiddenGameplayWithdrawalEndpoint: "/api/forbidden/gameplay-withdrawal",
    };
  }

  launchReadinessReport() {
    const boundary = this.boundaryReport();
    const productionGuardEnabled = process.env.ALLOW_DEMO_ROLE === "false" && Boolean(process.env.ADMIN_TOKEN);
    const items = [
      {
        area: "玩家入口",
        status: "DONE",
        title: "可取得、交易、開包",
        blocker: false,
        detail: "玩家入口已涵蓋背包、交易場、開包結果、遊戲圖像與不可提現揭露。",
      },
      {
        area: "經營收入",
        status: "DONE",
        title: "OperatorSettlement 是唯一撥款來源",
        blocker: false,
        detail: "只有核准後的經營收入可申請撥款；玩家 GC、禮包、票券、掉落物、交易差額都不可提現。",
      },
      {
        area: "營運後台",
        status: "DONE",
        title: "風控、活動、審查、資料工具已接上",
        blocker: false,
        detail: "管理者能暫停交易/撥款、審核活動與法規流程、匯出資料，並保留帳本與審計紀錄。",
      },
      {
        area: "用戶文件",
        status: "DONE",
        title: "服務條款、隱私、機率、退款已提供",
        blocker: false,
        detail: "首頁已提供服務條款、隱私權政策、機率與內容揭露、退款與客服入口。",
      },
      {
        area: "正式權限",
        status: productionGuardEnabled ? "DONE" : "REQUIRES_ENV",
        title: productionGuardEnabled ? "已使用管理 Token 並關閉 Demo Role" : "部署時需設定 ADMIN_TOKEN 並關閉 Demo Role",
        blocker: !productionGuardEnabled,
        detail: "正式部署需設定 ADMIN_TOKEN 且 ALLOW_DEMO_ROLE=false，避免公開環境接受測試角色標頭。",
      },
      {
        area: "公開索引",
        status: "DONE",
        title: "robots、sitemap、PWA 與健康檢查已提供",
        blocker: false,
        detail: "公開靜態頁、健康檢查、robots.txt、sitemap.xml、manifest 與 service worker 都可被部署環境檢查。",
      },
    ];
    return {
      status: items.some((item) => item.blocker) ? "LOCAL_REVIEW_READY" : "PUBLIC_BETA_READY",
      generatedAt: new Date().toISOString(),
      withdrawableSource: boundary.withdrawableSource,
      nonWithdrawableAssets: boundary.nonWithdrawableAssets,
      blockers: items.filter((item) => item.blocker).map((item) => item.area),
      items,
    };
  }

  auditReport() {
    return {
      status: "AVAILABLE",
      auditLogCount: this.store.auditLogs.length,
      packStatusLogCount: [...this.store.packs.values()].reduce((sum, pack) => sum + pack.statusLog.length, 0),
      withdrawalStatusLogCount: [...this.store.withdrawals.values()].reduce(
        (sum, withdrawal) => sum + withdrawal.statusLog.length,
        0,
      ),
      riskCaseCount: this.store.risk.cases.size,
      latestAuditLogs: this.store.auditLogs.slice(-10),
    };
  }

  exportSystemSnapshot() {
    return {
      exportedAt: new Date().toISOString(),
      boundary: this.boundaryReport(),
      readiness: this.launchReadinessReport(),
      reconciliation: this.reconcileLedger(),
      audit: this.auditReport(),
      state: this.snapshot(),
    };
  }

  systemStatus() {
    return {
      appVersion: APP_VERSION,
      storeSchemaVersion: STORE_SCHEMA_VERSION,
      migrations: MIGRATIONS,
      checks: {
        reconciliation: this.reconcileLedger().status,
        boundary: this.boundaryReport().status,
        readiness: this.launchReadinessReport().status,
        audit: this.auditReport().status,
        operations: this.store.operations.mode,
      },
      counts: {
        packs: this.store.packs.size,
        journals: this.store.ledger.journals.length,
        riskCases: this.store.risk.cases.size,
        campaigns: this.store.liveOps.campaigns.size,
        regulatoryReviews: this.store.regulatory.reviews.size,
        operationalIncidents: this.store.operations.incidents.length,
      },
    };
  }

  createCampaign({ name = "Beta Season", rewardCopy = "遊戲道具獎勵", configVersion = "liveops-v1", rollbackVersion = "liveops-v0", scheduledAt = null } = {}) {
    const campaign = createCampaign({
      id: `campaign_${this.store.liveOps.nextCampaignId++}`,
      name,
      rewardCopy,
      configVersion,
      rollbackVersion,
      scheduledAt,
    });
    this.store.liveOps.campaigns.set(campaign.id, campaign);
    this.store.auditLogs.push({
      id: `audit_${this.store.auditLogs.length + 1}`,
      targetType: "LiveOpsCampaign",
      targetId: campaign.id,
      action: "CREATE",
      actorId: "liveops_editor",
      reason: null,
      createdAt: new Date().toISOString(),
    });
    return campaign;
  }

  advanceCampaign({ campaignId, transition, actorId = "admin", role = "ADMIN", reason = null }) {
    const campaign = this.store.liveOps.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Missing campaign: ${campaignId}`);
    }

    transitionCampaign(campaign, transition, { actorId, role, reason });
    this.store.auditLogs.push({
      id: `audit_${this.store.auditLogs.length + 1}`,
      targetType: "LiveOpsCampaign",
      targetId: campaignId,
      action: transition,
      actorId,
      reason,
      createdAt: new Date().toISOString(),
    });
    return campaign;
  }

  createRegulatoryReview({
    featureName = "cash-equivalent-redemption-review",
    userStory = "Review whether a feature can affect withdrawal, payment, tax, or external redemption.",
    jurisdictions = ["TW"],
    productFlow = "User proposes regulated feature -> review owners decide -> implementation allowed only after GO.",
    assetFlow = "Gameplay assets remain non-withdrawable unless written decision changes scope.",
    moneyFlow = "No money movement before legal/accounting/payment approval.",
  } = {}) {
    const review = createRegulatoryReview({
      id: `review_${this.store.regulatory.nextReviewId++}`,
      featureName,
      userStory,
      jurisdictions,
      productFlow,
      assetFlow,
      moneyFlow,
    });
    this.store.regulatory.reviews.set(review.id, review);
    this.store.auditLogs.push({
      id: `audit_${this.store.auditLogs.length + 1}`,
      targetType: "RegulatoryReview",
      targetId: review.id,
      action: "CREATE",
      actorId: "product_owner",
      reason: null,
      createdAt: new Date().toISOString(),
    });
    return review;
  }

  submitRegulatoryReview({ reviewId }) {
    const review = this.requireReview(reviewId);
    submitReview(review);
    return review;
  }

  recordRegulatoryOpinion({ reviewId, owner, decision, opinionRef, constraints = [] }) {
    const review = this.requireReview(reviewId);
    recordOpinion(review, { owner, decision, opinionRef, constraints });
    return review;
  }

  finalizeRegulatoryReview({ reviewId }) {
    const review = this.requireReview(reviewId);
    finalizeReview(review);
    return review;
  }

  checkRegulatoryCircumvention({ reviewId, proposedText }) {
    const review = this.requireReview(reviewId);
    return runNoGoCircumventionCheck(review, proposedText);
  }

  assertRegulatoryImplementationAllowed({ reviewId }) {
    const review = this.requireReview(reviewId);
    assertReviewAllowsImplementation(review);
    return { allowed: true, status: review.status };
  }

  requireReview(reviewId) {
    const review = this.store.regulatory.reviews.get(reviewId);
    if (!review) {
      throw new Error(`Missing regulatory review: ${reviewId}`);
    }
    return review;
  }

  requirePack(packId) {
    const pack = this.store.packs.get(packId);
    if (!pack) {
      throw new Error(`Missing pack: ${packId}`);
    }
    return pack;
  }

  requireListing(listingId) {
    const listing = this.store.listings.get(listingId);
    if (!listing) {
      throw new Error(`Missing listing: ${listingId}`);
    }
    return listing;
  }
}
