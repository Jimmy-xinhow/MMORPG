export const ECONOMY_CONFIG_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  APPROVED: "APPROVED",
  ACTIVE: "ACTIVE",
  RETIRED: "RETIRED",
});

export function createEconomyConfig({
  id,
  maxGrowthRate = 1.06,
  minListPrice = 1,
  maxTradeCount = 3,
  forceOpenPrice = 130,
  maxHoldHours = 72,
  createdBy = "system",
}) {
  requiredString(id, "id");
  assertRate(maxGrowthRate, "maxGrowthRate", 1, 2);
  assertPositiveInteger(minListPrice, "minListPrice");
  assertPositiveInteger(maxTradeCount, "maxTradeCount");
  assertPositiveInteger(forceOpenPrice, "forceOpenPrice");
  assertPositiveInteger(maxHoldHours, "maxHoldHours");

  return {
    id,
    status: ECONOMY_CONFIG_STATUS.DRAFT,
    maxGrowthRate,
    minListPrice,
    maxTradeCount,
    forceOpenPrice,
    maxHoldHours,
    createdBy,
    createdAt: new Date().toISOString(),
    approvedAt: null,
    activatedAt: null,
    retiredAt: null,
  };
}

export function approveEconomyConfig(config, { actorId = "economy_admin" } = {}) {
  if (config.status !== ECONOMY_CONFIG_STATUS.DRAFT) {
    throw new Error("Only DRAFT economy config can be approved");
  }
  config.status = ECONOMY_CONFIG_STATUS.APPROVED;
  config.approvedBy = actorId;
  config.approvedAt = new Date().toISOString();
  return config;
}

export function activateEconomyConfig(config, activeConfig) {
  if (config.status !== ECONOMY_CONFIG_STATUS.APPROVED) {
    throw new Error("Only APPROVED economy config can be activated");
  }
  if (activeConfig) {
    activeConfig.status = ECONOMY_CONFIG_STATUS.RETIRED;
    activeConfig.retiredAt = new Date().toISOString();
  }
  config.status = ECONOMY_CONFIG_STATUS.ACTIVE;
  config.activatedAt = new Date().toISOString();
  return config;
}

export function shouldForceOpen(pack, config, now = new Date()) {
  if (!["OWNED", "COOLDOWN"].includes(pack.status)) return false;
  if (pack.tradeCount >= config.maxTradeCount) return true;
  if (pack.currentPrice >= config.forceOpenPrice) return true;
  if (pack.holdExpireAt && new Date(pack.holdExpireAt).getTime() <= new Date(now).getTime()) return true;
  return false;
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

function assertRate(value, name, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }
}
