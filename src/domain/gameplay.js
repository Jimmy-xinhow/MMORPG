export const TICKET_STATUS = Object.freeze({
  CONFIGURED: "CONFIGURED",
  ACTIVE: "ACTIVE",
  RESERVED: "RESERVED",
  CONSUMED: "CONSUMED",
  EXPIRED: "EXPIRED",
  RISK_HELD: "RISK_HELD",
});

export const REDEMPTION_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  RISK_REVIEW: "RISK_REVIEW",
  APPROVED: "APPROVED",
  FULFILLING: "FULFILLING",
  FULFILLED: "FULFILLED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  RISK_HELD: "RISK_HELD",
  FULFILLMENT_FAILED: "FULFILLMENT_FAILED",
});

export const RPG_CLASS_BOUNDARIES = Object.freeze({
  WARRIOR: Object.freeze({ hpMin: 1.1, hpMax: 1.3, damageMin: 0.8, damageMax: 1 }),
  RANGER: Object.freeze({ hpMin: 0.8, hpMax: 1, damageMin: 1, damageMax: 1.2 }),
  MAGE: Object.freeze({ hpMin: 0.7, hpMax: 0.9, damageMin: 1.1, damageMax: 1.4, cooldown: "HIGHER" }),
  CLERIC: Object.freeze({ hpMin: 0.9, hpMax: 1.1, damageMin: 0, damageMax: 1.1, supportCapRequired: true }),
});

export const GAMEPLAY_ONLY_REWARD = Object.freeze({
  withdrawable: false,
  createsOperatorSettlement: false,
  assetBoundary: "GAMEPLAY_ONLY",
});

const ACTIVE_REDEMPTION_STATUSES = new Set([
  REDEMPTION_STATUS.DRAFT,
  REDEMPTION_STATUS.SUBMITTED,
  REDEMPTION_STATUS.RISK_REVIEW,
  REDEMPTION_STATUS.APPROVED,
  REDEMPTION_STATUS.FULFILLING,
  REDEMPTION_STATUS.RISK_HELD,
  REDEMPTION_STATUS.FULFILLMENT_FAILED,
]);

const REDEMPTION_TRANSITIONS = new Map([
  [REDEMPTION_STATUS.SUBMITTED, new Set([REDEMPTION_STATUS.DRAFT])],
  [REDEMPTION_STATUS.RISK_REVIEW, new Set([REDEMPTION_STATUS.SUBMITTED, REDEMPTION_STATUS.FULFILLMENT_FAILED])],
  [REDEMPTION_STATUS.APPROVED, new Set([REDEMPTION_STATUS.RISK_REVIEW])],
  [REDEMPTION_STATUS.FULFILLING, new Set([REDEMPTION_STATUS.APPROVED])],
  [REDEMPTION_STATUS.FULFILLED, new Set([REDEMPTION_STATUS.FULFILLING])],
  [REDEMPTION_STATUS.CANCELLED, new Set([REDEMPTION_STATUS.SUBMITTED])],
  [REDEMPTION_STATUS.REJECTED, new Set([REDEMPTION_STATUS.RISK_REVIEW])],
  [REDEMPTION_STATUS.RISK_HELD, new Set([REDEMPTION_STATUS.RISK_REVIEW])],
  [REDEMPTION_STATUS.FULFILLMENT_FAILED, new Set([REDEMPTION_STATUS.FULFILLING])],
]);

export function createTicketBook({ ownerId, ticketType }) {
  requiredString(ownerId, "ownerId");
  requiredString(ticketType, "ticketType");
  return {
    ownerId,
    ticketType,
    active: 0,
    reserved: 0,
    consumed: 0,
    expired: 0,
    riskHeld: 0,
    liability: 0,
    journals: [],
    idempotencyKeys: [],
  };
}

export function purchaseTickets({ product, ticketBook, quantity = 1, idempotencyKey }) {
  assertPositiveInteger(quantity, "quantity");
  requiredString(idempotencyKey, "idempotencyKey");
  if (ticketBook.idempotencyKeys.includes(idempotencyKey)) {
    return { product: clone(product), ticketBook: clone(ticketBook), journal: existingJournal(ticketBook, idempotencyKey) };
  }
  if (!Number.isInteger(product.availableInventory) || product.availableInventory < quantity) {
    throw new Error("Ticket purchase would oversell shop inventory");
  }

  const nextProduct = { ...product, availableInventory: product.availableInventory - quantity };
  const nextBook = appendTicketJournal(ticketBook, {
    idempotencyKey,
    transition: "PURCHASE_TO_ACTIVE",
    quantity,
    fromStatus: TICKET_STATUS.CONFIGURED,
    toStatus: TICKET_STATUS.ACTIVE,
    liabilityDelta: quantity,
  });
  nextBook.active += quantity;
  nextBook.liability += quantity;
  return { product: nextProduct, ticketBook: nextBook, journal: nextBook.journals.at(-1) };
}

export function reserveTicket({ ticketBook, quantity = 1, idempotencyKey }) {
  assertPositiveInteger(quantity, "quantity");
  requiredString(idempotencyKey, "idempotencyKey");
  if (ticketBook.idempotencyKeys.includes(idempotencyKey)) {
    return { ticketBook: clone(ticketBook), journal: existingJournal(ticketBook, idempotencyKey) };
  }
  if (ticketBook.active < quantity) {
    throw new Error("Not enough active tickets to reserve");
  }

  const nextBook = appendTicketJournal(ticketBook, {
    idempotencyKey,
    transition: "ACTIVE_TO_RESERVED",
    quantity,
    fromStatus: TICKET_STATUS.ACTIVE,
    toStatus: TICKET_STATUS.RESERVED,
    liabilityDelta: 0,
  });
  nextBook.active -= quantity;
  nextBook.reserved += quantity;
  return { ticketBook: nextBook, journal: nextBook.journals.at(-1) };
}

export function consumeReservedTicket({ ticketBook, quantity = 1, idempotencyKey }) {
  assertPositiveInteger(quantity, "quantity");
  requiredString(idempotencyKey, "idempotencyKey");
  if (ticketBook.idempotencyKeys.includes(idempotencyKey)) {
    return { ticketBook: clone(ticketBook), journal: existingJournal(ticketBook, idempotencyKey) };
  }
  if (ticketBook.reserved < quantity) {
    throw new Error("Not enough reserved tickets to consume");
  }

  const nextBook = appendTicketJournal(ticketBook, {
    idempotencyKey,
    transition: "RESERVED_TO_CONSUMED",
    quantity,
    fromStatus: TICKET_STATUS.RESERVED,
    toStatus: TICKET_STATUS.CONSUMED,
    liabilityDelta: -quantity,
  });
  nextBook.reserved -= quantity;
  nextBook.consumed += quantity;
  nextBook.liability -= quantity;
  return { ticketBook: nextBook, journal: nextBook.journals.at(-1) };
}

export function reconcileTicketLiability(ticketBook) {
  const replayedLiability = ticketBook.journals.reduce((total, journal) => total + journal.liabilityDelta, 0);
  return {
    cachedLiability: ticketBook.liability,
    replayedLiability,
    mismatch: ticketBook.liability - replayedLiability,
  };
}

export function submitRedemption({ redemptions, ticketId, refId, idempotencyKey }) {
  requiredString(ticketId, "ticketId");
  requiredString(refId, "refId");
  requiredString(idempotencyKey, "idempotencyKey");
  const previous = redemptions.find((redemption) => redemption.idempotencyKey === idempotencyKey);
  if (previous) {
    return { redemptions: clone(redemptions), redemption: clone(previous) };
  }

  const activeDuplicate = redemptions.find(
    (redemption) =>
      redemption.ticketId === ticketId &&
      redemption.refId === refId &&
      ACTIVE_REDEMPTION_STATUSES.has(redemption.status),
  );
  if (activeDuplicate) {
    throw new Error("One active redemption is allowed per ticket/ref pair");
  }

  const redemption = {
    id: `redemption_${redemptions.length + 1}`,
    ticketId,
    refId,
    idempotencyKey,
    status: REDEMPTION_STATUS.SUBMITTED,
    withdrawable: false,
    createsOperatorSettlement: false,
    statusLog: [{ fromStatus: null, toStatus: REDEMPTION_STATUS.SUBMITTED, code: "SUBMIT" }],
  };
  return { redemptions: [...clone(redemptions), redemption], redemption };
}

export function transitionRedemption(redemption, toStatus, code = toStatus) {
  const allowedFrom = REDEMPTION_TRANSITIONS.get(toStatus);
  if (!allowedFrom || !allowedFrom.has(redemption.status)) {
    throw new Error(`Illegal redemption transition: ${redemption.status} -> ${toStatus}`);
  }
  return {
    ...clone(redemption),
    status: toStatus,
    statusLog: [
      ...redemption.statusLog,
      { fromStatus: redemption.status, toStatus, code },
    ],
  };
}

export function calculateBossReward({
  bossRewardPool,
  contribution,
  totalContribution,
  maxSingleUserShare = 0.2,
  guildAbusePenaltyRate = 0,
  riskPenaltyRate = 0,
  minimumContribution = 1,
}) {
  assertPositiveInteger(bossRewardPool, "bossRewardPool");
  assertNonNegativeNumber(contribution, "contribution");
  assertPositiveNumber(totalContribution, "totalContribution");
  assertRate(maxSingleUserShare, "maxSingleUserShare", 0.05, 0.25);
  assertRate(guildAbusePenaltyRate, "guildAbusePenaltyRate", 0, 1);
  assertRate(riskPenaltyRate, "riskPenaltyRate", 0, 1);
  assertPositiveNumber(minimumContribution, "minimumContribution");

  if (contribution < minimumContribution) {
    return { ...GAMEPLAY_ONLY_REWARD, baseReward: 0, cappedReward: 0, guildPenalty: 0, riskPenalty: 0, finalReward: 0 };
  }

  const contributionShare = contribution / totalContribution;
  const baseReward = bossRewardPool * contributionShare;
  const cappedReward = Math.min(baseReward, bossRewardPool * maxSingleUserShare);
  const guildPenalty = cappedReward * guildAbusePenaltyRate;
  const riskPenalty = cappedReward * riskPenaltyRate;
  const finalReward = Math.max(0, Math.floor(cappedReward - guildPenalty - riskPenalty));
  return {
    ...GAMEPLAY_ONLY_REWARD,
    contributionShare,
    baseReward,
    cappedReward,
    guildPenalty,
    riskPenalty,
    finalReward,
  };
}

export function settleBossRewards({ bossRewardPool, contributions, config = {}, guildPenaltyRates = {}, riskPenaltyRates = {} }) {
  assertPositiveInteger(bossRewardPool, "bossRewardPool");
  if (!Array.isArray(contributions) || contributions.length === 0) {
    throw new Error("Boss settlement requires contribution log");
  }

  const totalsByUser = new Map();
  const guildByUser = new Map();
  for (const contribution of contributions) {
    requiredString(contribution.userId, "contribution.userId");
    assertNonNegativeNumber(contribution.amount, "contribution.amount");
    totalsByUser.set(contribution.userId, (totalsByUser.get(contribution.userId) ?? 0) + contribution.amount);
    if (contribution.guildId) {
      guildByUser.set(contribution.userId, contribution.guildId);
    }
  }
  const totalContribution = [...totalsByUser.values()].reduce((sum, amount) => sum + amount, 0);
  if (totalContribution <= 0) {
    throw new Error("Boss settlement requires positive contribution");
  }

  return [...totalsByUser.entries()].map(([userId, contribution]) => {
    const guildId = guildByUser.get(userId) ?? null;
    const reward = calculateBossReward({
      bossRewardPool,
      contribution,
      totalContribution,
      ...config,
      guildAbusePenaltyRate: guildId ? guildPenaltyRates[guildId] ?? config.guildAbusePenaltyRate ?? 0 : 0,
      riskPenaltyRate: riskPenaltyRates[userId] ?? config.riskPenaltyRate ?? 0,
    });
    return { userId, guildId, contribution, ...reward };
  });
}

export function detectGuildAbuseSignals({
  members,
  contributions = [],
  activityLogs = [],
  thresholds = {},
}) {
  if (!Array.isArray(members)) {
    throw new Error("Guild abuse detection requires members");
  }
  const config = {
    inactiveMemberRate: thresholds.inactiveMemberRate ?? 0.6,
    sameClusterMemberCount: thresholds.sameClusterMemberCount ?? 3,
    shortMembershipHours: thresholds.shortMembershipHours ?? 24,
    lowRiskBossRepeatCount: thresholds.lowRiskBossRepeatCount ?? 3,
  };
  const signals = [];

  const inactiveCount = members.filter((member) => !member.active).length;
  if (members.length > 0 && inactiveCount / members.length >= config.inactiveMemberRate) {
    signals.push({ code: "SHELL_GUILD_INACTIVE_MEMBERS", severity: "MEDIUM", action: "REVIEW" });
  }

  for (const field of ["deviceId", "paymentClusterId"]) {
    const clusters = countBy(members, field);
    for (const [clusterId, count] of clusters.entries()) {
      if (clusterId && count >= config.sameClusterMemberCount) {
        signals.push({ code: `SAME_${field === "deviceId" ? "DEVICE" : "PAYMENT"}_GUILD_CLUSTER`, severity: "HIGH", action: "HOLD_REWARD" });
      }
    }
  }

  const shortMemberships = members.filter((member) => {
    if (!member.joinedAt || !member.leftAt) return false;
    return hoursBetween(member.joinedAt, member.leftAt) <= config.shortMembershipHours;
  });
  if (shortMemberships.length > 0) {
    signals.push({ code: "SHORT_TERM_REWARD_MEMBERSHIP", severity: "MEDIUM", action: "REVIEW" });
  }

  if (activityLogs.some((log) => log.action === "KICK_MEMBER" && log.actorRole === "LEADER" && log.beforeSettlement)) {
    signals.push({ code: "LEADER_KICK_BEFORE_SETTLEMENT", severity: "HIGH", action: "FREEZE_PERIOD" });
  }

  const lowRiskBossCounts = countBy(
    contributions.filter((entry) => entry.bossRisk === "LOW"),
    "userId",
  );
  for (const [userId, count] of lowRiskBossCounts.entries()) {
    if (count >= config.lowRiskBossRepeatCount) {
      signals.push({ code: "REPEATED_LOW_RISK_BOSS_FARMING", severity: "MEDIUM", action: "REVIEW", userId });
    }
  }

  return signals;
}

export function validateRpgClasses(classes) {
  if (!Array.isArray(classes) || classes.length === 0) {
    throw new Error("RPG class config requires at least one class");
  }
  if (classes.length > 4) {
    throw new Error("First RPG expansion cannot launch more than 4 classes");
  }
  return classes.map((rpgClass) => validateRpgClass(rpgClass));
}

export function validateRpgClass(rpgClass) {
  requiredString(rpgClass.classKey, "classKey");
  const boundary = RPG_CLASS_BOUNDARIES[rpgClass.classKey];
  if (!boundary) {
    throw new Error(`Unknown first-release RPG class: ${rpgClass.classKey}`);
  }
  assertWithin(rpgClass.hpMultiplier, boundary.hpMin, boundary.hpMax, `${rpgClass.classKey} hpMultiplier`);
  assertWithin(rpgClass.damageMultiplier, boundary.damageMin, boundary.damageMax, `${rpgClass.classKey} damageMultiplier`);
  if (boundary.cooldown === "HIGHER" && rpgClass.cooldownMultiplier <= 1) {
    throw new Error("MAGE cooldownMultiplier must be higher than baseline");
  }
  if (boundary.supportCapRequired && !Number.isFinite(rpgClass.supportCap)) {
    throw new Error("CLERIC requires healing/support cap");
  }
  return { ...clone(rpgClass), withdrawable: false, createsOperatorSettlement: false };
}

export function calculateSkillUpgradeCost({ level, baseCost = 100, growthExponent = 1.35, maxLevel = 10 }) {
  assertPositiveInteger(level, "level");
  assertPositiveNumber(baseCost, "baseCost");
  assertPositiveNumber(growthExponent, "growthExponent");
  assertPositiveInteger(maxLevel, "maxLevel");
  if (level > maxLevel) {
    throw new Error("Skill level exceeds first-release max level");
  }
  return Math.floor(baseCost * level ** growthExponent);
}

export function resetSkill({ skill, resetCost }) {
  requiredString(skill.skillKey, "skill.skillKey");
  assertPositiveInteger(skill.level, "skill.level");
  assertPositiveInteger(resetCost.amount, "resetCost.amount");
  if (!["TICKET", "GC"].includes(resetCost.unit)) {
    throw new Error("Skill reset cost must be ticket or GC");
  }
  return {
    skill: { ...clone(skill), level: 1 },
    resetCost: { ...clone(resetCost), withdrawable: false },
    returnedResources: Math.max(0, skill.level - 1),
    auditAction: "SKILL_RESET",
    withdrawable: false,
    createsOperatorSettlement: false,
  };
}

export function isContentEnabledForUser({ flag, user, now = new Date() }) {
  validateContentFlag(flag);
  const current = new Date(now).getTime();
  if (flag.startsAt && current < new Date(flag.startsAt).getTime()) return false;
  if (flag.endsAt && current > new Date(flag.endsAt).getTime()) return false;
  if (flag.allowedCohorts.length > 0 && !flag.allowedCohorts.includes(user.cohort)) return false;
  return bucket(`${flag.contentKey}:${user.userId}`) < flag.enabledForPercent;
}

export function rollbackContentFlag(flag) {
  validateContentFlag(flag);
  return {
    ...clone(flag),
    configVersion: flag.rollbackVersion,
    enabledForPercent: 0,
    rolledBackFromVersion: flag.configVersion,
  };
}

export function enforceDailyRewardCap({ awardedToday, rewardAmount, dailyCap }) {
  assertNonNegativeNumber(awardedToday, "awardedToday");
  assertNonNegativeNumber(rewardAmount, "rewardAmount");
  assertNonNegativeNumber(dailyCap, "dailyCap");
  const remaining = Math.max(0, dailyCap - awardedToday);
  return {
    ...GAMEPLAY_ONLY_REWARD,
    requestedReward: rewardAmount,
    awardedReward: Math.min(rewardAmount, remaining),
    capped: rewardAmount > remaining,
  };
}

export function detectAutomatedFarmingRisk({ actions, windowSeconds = 60, maxActionsPerWindow = 20 }) {
  if (!Array.isArray(actions)) {
    throw new Error("Automated farming detection requires actions");
  }
  assertPositiveNumber(windowSeconds, "windowSeconds");
  assertPositiveInteger(maxActionsPerWindow, "maxActionsPerWindow");
  const sorted = [...actions].map((action) => new Date(action.createdAt).getTime()).sort((a, b) => a - b);
  for (let start = 0; start < sorted.length; start += 1) {
    let end = start;
    while (end < sorted.length && sorted[end] - sorted[start] <= windowSeconds * 1000) {
      end += 1;
    }
    if (end - start > maxActionsPerWindow) {
      return { code: "AUTOMATED_RPG_FARMING", severity: "HIGH", action: "FREEZE_REVIEW" };
    }
  }
  return null;
}

function appendTicketJournal(ticketBook, journal) {
  return {
    ...clone(ticketBook),
    journals: [...ticketBook.journals, journal],
    idempotencyKeys: [...ticketBook.idempotencyKeys, journal.idempotencyKey],
  };
}

function existingJournal(ticketBook, idempotencyKey) {
  return clone(ticketBook.journals.find((journal) => journal.idempotencyKey === idempotencyKey));
}

function validateContentFlag(flag) {
  for (const key of ["contentKey", "configVersion", "rollbackVersion"]) {
    requiredString(flag[key], key);
  }
  assertRate(flag.enabledForPercent / 100, "enabledForPercent", 0, 1);
  if (!Array.isArray(flag.allowedCohorts)) {
    throw new Error("allowedCohorts must be an array");
  }
}

function countBy(records, field) {
  const counts = new Map();
  for (const record of records) {
    const key = record[field] ?? null;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function hoursBetween(start, end) {
  return (new Date(end).getTime() - new Date(start).getTime()) / 36e5;
}

function bucket(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash % 100;
}

function requiredString(value, name) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is required`);
  }
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

function assertPositiveNumber(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be positive`);
  }
}

function assertNonNegativeNumber(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be non-negative`);
  }
}

function assertRate(value, name, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }
}

function assertWithin(value, min, max, name) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }
}

function clone(value) {
  return structuredClone(value);
}
