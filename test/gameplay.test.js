import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateBossReward,
  calculateSkillUpgradeCost,
  consumeReservedTicket,
  createTicketBook,
  detectAutomatedFarmingRisk,
  detectGuildAbuseSignals,
  enforceDailyRewardCap,
  isContentEnabledForUser,
  purchaseTickets,
  reconcileTicketLiability,
  reserveTicket,
  resetSkill,
  rollbackContentFlag,
  settleBossRewards,
  submitRedemption,
  validateRpgClass,
  validateRpgClasses,
} from "../src/domain/gameplay.js";

test("ticket purchase is idempotent, creates liability, and cannot oversell inventory", () => {
  const product = { productId: "boss_ticket_pack", availableInventory: 2 };
  const ticketBook = createTicketBook({ ownerId: "player_1", ticketType: "BOSS" });

  const first = purchaseTickets({ product, ticketBook, quantity: 2, idempotencyKey: "buy_1" });
  assert.equal(first.product.availableInventory, 0);
  assert.equal(first.ticketBook.active, 2);
  assert.equal(first.ticketBook.liability, 2);

  const replay = purchaseTickets({
    product: first.product,
    ticketBook: first.ticketBook,
    quantity: 2,
    idempotencyKey: "buy_1",
  });
  assert.equal(replay.product.availableInventory, 0);
  assert.equal(replay.ticketBook.journals.length, 1);

  assert.throws(
    () => purchaseTickets({ product: first.product, ticketBook: first.ticketBook, quantity: 1, idempotencyKey: "buy_2" }),
    /oversell/i,
  );
});

test("ticket reservation and consumption reduce liability exactly once", () => {
  const product = { productId: "event_ticket", availableInventory: 5 };
  let state = purchaseTickets({
    product,
    ticketBook: createTicketBook({ ownerId: "player_1", ticketType: "EVENT" }),
    quantity: 1,
    idempotencyKey: "buy_1",
  });
  let ticketBook = state.ticketBook;

  ticketBook = reserveTicket({ ticketBook, quantity: 1, idempotencyKey: "reserve_1" }).ticketBook;
  assert.equal(ticketBook.active, 0);
  assert.equal(ticketBook.reserved, 1);
  assert.equal(ticketBook.liability, 1);

  ticketBook = consumeReservedTicket({ ticketBook, quantity: 1, idempotencyKey: "consume_1" }).ticketBook;
  assert.equal(ticketBook.reserved, 0);
  assert.equal(ticketBook.consumed, 1);
  assert.equal(ticketBook.liability, 0);
  assert.deepEqual(reconcileTicketLiability(ticketBook), {
    cachedLiability: 0,
    replayedLiability: 0,
    mismatch: 0,
  });

  const replayConsume = consumeReservedTicket({ ticketBook, quantity: 1, idempotencyKey: "consume_1" });
  assert.equal(replayConsume.ticketBook.journals.length, 3);
  assert.equal(replayConsume.ticketBook.liability, 0);
});

test("redemption submit prevents duplicate active ticket/ref pair", () => {
  const first = submitRedemption({
    redemptions: [],
    ticketId: "ticket_1",
    refId: "boss_entry_1",
    idempotencyKey: "submit_1",
  });
  assert.equal(first.redemption.status, "SUBMITTED");
  assert.equal(first.redemption.withdrawable, false);
  assert.equal(first.redemption.createsOperatorSettlement, false);

  const idempotent = submitRedemption({
    redemptions: first.redemptions,
    ticketId: "ticket_1",
    refId: "boss_entry_1",
    idempotencyKey: "submit_1",
  });
  assert.equal(idempotent.redemptions.length, 1);

  assert.throws(
    () =>
      submitRedemption({
        redemptions: first.redemptions,
        ticketId: "ticket_1",
        refId: "boss_entry_1",
        idempotencyKey: "submit_2",
      }),
    /one active redemption/i,
  );
});

test("boss reward formula applies cap and penalties without operator settlement path", () => {
  const reward = calculateBossReward({
    bossRewardPool: 10000,
    contribution: 80,
    totalContribution: 100,
    maxSingleUserShare: 0.2,
    guildAbusePenaltyRate: 0.25,
    riskPenaltyRate: 0.1,
  });

  assert.equal(reward.baseReward, 8000);
  assert.equal(reward.cappedReward, 2000);
  assert.equal(reward.guildPenalty, 500);
  assert.equal(reward.riskPenalty, 200);
  assert.equal(reward.finalReward, 1300);
  assert.equal(reward.withdrawable, false);
  assert.equal(reward.createsOperatorSettlement, false);
});

test("boss reward settlement replay is deterministic from contribution log", () => {
  const contributions = [
    { userId: "u1", guildId: "g1", amount: 5 },
    { userId: "u2", guildId: "g1", amount: 10 },
    { userId: "u1", guildId: "g1", amount: 5 },
  ];
  const first = settleBossRewards({
    bossRewardPool: 1000,
    contributions,
    config: { maxSingleUserShare: 0.25 },
    guildPenaltyRates: { g1: 0.1 },
  });
  const second = settleBossRewards({
    bossRewardPool: 1000,
    contributions,
    config: { maxSingleUserShare: 0.25 },
    guildPenaltyRates: { g1: 0.1 },
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first.map((reward) => reward.finalReward), [225, 225]);
  assert.ok(first.every((reward) => reward.createsOperatorSettlement === false));
});

test("guild abuse detection creates hold for same-device cluster", () => {
  const signals = detectGuildAbuseSignals({
    members: [
      { userId: "u1", active: true, deviceId: "device_a" },
      { userId: "u2", active: true, deviceId: "device_a" },
      { userId: "u3", active: true, deviceId: "device_a" },
      { userId: "u4", active: false, deviceId: "device_b" },
    ],
  });

  assert.ok(signals.some((signal) => signal.code === "SAME_DEVICE_GUILD_CLUSTER"));
  assert.ok(signals.some((signal) => signal.action === "HOLD_REWARD"));
});

test("guild abuse detection flags inactive shell guild and repeated low-risk farming", () => {
  const signals = detectGuildAbuseSignals({
    members: [
      { userId: "u1", active: false },
      { userId: "u2", active: false },
      { userId: "u3", active: false },
      { userId: "u4", active: true },
    ],
    contributions: [
      { userId: "u4", bossRisk: "LOW" },
      { userId: "u4", bossRisk: "LOW" },
      { userId: "u4", bossRisk: "LOW" },
    ],
  });

  assert.ok(signals.some((signal) => signal.code === "SHELL_GUILD_INACTIVE_MEMBERS"));
  assert.ok(signals.some((signal) => signal.code === "REPEATED_LOW_RISK_BOSS_FARMING" && signal.userId === "u4"));
});

test("rpg class creation validates first-release boundaries", () => {
  const classes = validateRpgClasses([
    { classKey: "WARRIOR", hpMultiplier: 1.2, damageMultiplier: 0.9 },
    { classKey: "RANGER", hpMultiplier: 0.9, damageMultiplier: 1.1 },
    { classKey: "MAGE", hpMultiplier: 0.8, damageMultiplier: 1.3, cooldownMultiplier: 1.4 },
    { classKey: "CLERIC", hpMultiplier: 1, damageMultiplier: 0.8, supportCap: 50 },
  ]);
  assert.equal(classes.length, 4);
  assert.ok(classes.every((rpgClass) => rpgClass.withdrawable === false));

  assert.throws(
    () => validateRpgClass({ classKey: "MAGE", hpMultiplier: 1, damageMultiplier: 1.3, cooldownMultiplier: 1.4 }),
    /hpMultiplier/i,
  );
  assert.throws(
    () =>
      validateRpgClasses([
        { classKey: "WARRIOR", hpMultiplier: 1.2, damageMultiplier: 0.9 },
        { classKey: "RANGER", hpMultiplier: 0.9, damageMultiplier: 1.1 },
        { classKey: "MAGE", hpMultiplier: 0.8, damageMultiplier: 1.3, cooldownMultiplier: 1.4 },
        { classKey: "CLERIC", hpMultiplier: 1, damageMultiplier: 0.8, supportCap: 50 },
        { classKey: "WARRIOR", hpMultiplier: 1.2, damageMultiplier: 0.9 },
      ]),
    /more than 4/i,
  );
});

test("skill upgrade cost curve and reset stay non-withdrawable", () => {
  assert.equal(calculateSkillUpgradeCost({ level: 1 }), 100);
  assert.equal(calculateSkillUpgradeCost({ level: 10 }), Math.floor(100 * 10 ** 1.35));
  assert.throws(() => calculateSkillUpgradeCost({ level: 11 }), /max level/i);

  const reset = resetSkill({
    skill: { skillKey: "fireball", level: 5 },
    resetCost: { unit: "GC", amount: 1000 },
  });
  assert.equal(reset.skill.level, 1);
  assert.equal(reset.returnedResources, 4);
  assert.equal(reset.withdrawable, false);
  assert.equal(reset.createsOperatorSettlement, false);
});

test("content flag rollout and rollback are deterministic", () => {
  const flag = {
    contentKey: "mage_tower",
    configVersion: "rpg_v2",
    enabledForPercent: 100,
    allowedCohorts: ["beta"],
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    rollbackVersion: "rpg_v1",
  };
  assert.equal(
    isContentEnabledForUser({
      flag,
      user: { userId: "player_1", cohort: "beta" },
      now: "2026-05-25T00:00:00.000Z",
    }),
    true,
  );
  assert.equal(
    isContentEnabledForUser({
      flag: { ...flag, enabledForPercent: 0 },
      user: { userId: "player_1", cohort: "beta" },
      now: "2026-05-25T00:00:00.000Z",
    }),
    false,
  );

  const rolledBack = rollbackContentFlag(flag);
  assert.equal(rolledBack.configVersion, "rpg_v1");
  assert.equal(rolledBack.enabledForPercent, 0);
  assert.equal(rolledBack.rolledBackFromVersion, "rpg_v2");
});

test("rpg reward cap and automated farming risk are enforced", () => {
  assert.deepEqual(enforceDailyRewardCap({ awardedToday: 90, rewardAmount: 25, dailyCap: 100 }), {
    requestedReward: 25,
    awardedReward: 10,
    capped: true,
    withdrawable: false,
    createsOperatorSettlement: false,
    assetBoundary: "GAMEPLAY_ONLY",
  });

  const actions = Array.from({ length: 4 }, (_, index) => ({
    createdAt: new Date(Date.UTC(2026, 4, 25, 0, 0, index * 5)).toISOString(),
  }));
  const risk = detectAutomatedFarmingRisk({ actions, windowSeconds: 20, maxActionsPerWindow: 3 });
  assert.equal(risk.code, "AUTOMATED_RPG_FARMING");
  assert.equal(risk.severity, "HIGH");
});
