export const CAMPAIGN_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  PRODUCT_REVIEW: "PRODUCT_REVIEW",
  RISK_REVIEW: "RISK_REVIEW",
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  ENDED: "ENDED",
  ARCHIVED: "ARCHIVED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  ROLLED_BACK: "ROLLED_BACK",
});

export const CAMPAIGN_TRANSITION = Object.freeze({
  SUBMIT_PRODUCT_REVIEW: "SUBMIT_PRODUCT_REVIEW",
  PRODUCT_APPROVE: "PRODUCT_APPROVE",
  RISK_APPROVE: "RISK_APPROVE",
  ACTIVATE: "ACTIVATE",
  PAUSE: "PAUSE",
  RESUME: "RESUME",
  END: "END",
  ARCHIVE: "ARCHIVE",
  CANCEL: "CANCEL",
  REJECT: "REJECT",
  ROLLBACK: "ROLLBACK",
});

const rules = new Map([
  [CAMPAIGN_TRANSITION.SUBMIT_PRODUCT_REVIEW, [[CAMPAIGN_STATUS.DRAFT], CAMPAIGN_STATUS.PRODUCT_REVIEW]],
  [CAMPAIGN_TRANSITION.PRODUCT_APPROVE, [[CAMPAIGN_STATUS.PRODUCT_REVIEW], CAMPAIGN_STATUS.RISK_REVIEW]],
  [CAMPAIGN_TRANSITION.RISK_APPROVE, [[CAMPAIGN_STATUS.RISK_REVIEW], CAMPAIGN_STATUS.SCHEDULED]],
  [CAMPAIGN_TRANSITION.ACTIVATE, [[CAMPAIGN_STATUS.SCHEDULED], CAMPAIGN_STATUS.ACTIVE]],
  [CAMPAIGN_TRANSITION.PAUSE, [[CAMPAIGN_STATUS.ACTIVE], CAMPAIGN_STATUS.PAUSED]],
  [CAMPAIGN_TRANSITION.RESUME, [[CAMPAIGN_STATUS.PAUSED], CAMPAIGN_STATUS.ACTIVE]],
  [CAMPAIGN_TRANSITION.END, [[CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.PAUSED], CAMPAIGN_STATUS.ENDED]],
  [CAMPAIGN_TRANSITION.ARCHIVE, [[CAMPAIGN_STATUS.ENDED], CAMPAIGN_STATUS.ARCHIVED]],
  [CAMPAIGN_TRANSITION.CANCEL, [[CAMPAIGN_STATUS.DRAFT, CAMPAIGN_STATUS.SCHEDULED], CAMPAIGN_STATUS.CANCELLED]],
  [CAMPAIGN_TRANSITION.REJECT, [[CAMPAIGN_STATUS.PRODUCT_REVIEW, CAMPAIGN_STATUS.RISK_REVIEW], CAMPAIGN_STATUS.REJECTED]],
  [CAMPAIGN_TRANSITION.ROLLBACK, [[CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.PAUSED], CAMPAIGN_STATUS.ROLLED_BACK]],
]);

export function createCampaign({ id, name, rewardCopy, configVersion, rollbackVersion, scheduledAt }) {
  requiredString(id, "id");
  requiredString(name, "name");
  requiredString(rewardCopy, "rewardCopy");
  requiredString(configVersion, "configVersion");
  requiredString(rollbackVersion, "rollbackVersion");
  assertSafeRewardCopy(rewardCopy);

  return {
    id,
    name,
    rewardCopy,
    configVersion,
    rollbackVersion,
    scheduledAt: scheduledAt ?? null,
    status: CAMPAIGN_STATUS.DRAFT,
    approvals: [],
    statusLog: [],
    createdAt: new Date().toISOString(),
  };
}

export function transitionCampaign(campaign, code, metadata = {}) {
  const rule = rules.get(code);
  if (!rule) {
    throw new Error(`Unknown campaign transition: ${code}`);
  }

  const [fromStatuses, toStatus] = rule;
  if (!fromStatuses.includes(campaign.status)) {
    throw new Error(`Illegal campaign transition ${code}: ${campaign.status} -> ${toStatus}`);
  }

  if (code === CAMPAIGN_TRANSITION.PRODUCT_APPROVE) {
    requireRole(metadata.role, "PRODUCT_REVIEWER");
    addApproval(campaign, "PRODUCT", metadata.actorId);
  }
  if (code === CAMPAIGN_TRANSITION.RISK_APPROVE) {
    requireRole(metadata.role, "RISK_REVIEWER");
    if (!campaign.approvals.some((approval) => approval.type === "PRODUCT")) {
      throw new Error("Risk approval requires product approval first");
    }
    addApproval(campaign, "RISK", metadata.actorId);
  }
  if (code === CAMPAIGN_TRANSITION.ACTIVATE && !campaign.approvals.some((approval) => approval.type === "RISK")) {
    throw new Error("Campaign requires risk approval before activation");
  }
  if (code === CAMPAIGN_TRANSITION.ROLLBACK) {
    requireRole(metadata.role, "ADMIN");
  }

  const fromStatus = campaign.status;
  campaign.status = toStatus;
  campaign.statusLog.push({
    fromStatus,
    toStatus,
    code,
    actorId: metadata.actorId ?? null,
    role: metadata.role ?? null,
    reason: metadata.reason ?? null,
    createdAt: new Date().toISOString(),
  });
  return campaign;
}

export function assertSafeRewardCopy(copy) {
  const forbidden = ["提現", "現金", "收益", "分潤", "保證賺", "賺錢"];
  const matched = forbidden.find((word) => copy.includes(word));
  if (matched) {
    throw new Error(`Campaign reward copy contains regulated wording: ${matched}`);
  }
}

function addApproval(campaign, type, actorId) {
  requiredString(actorId, "actorId");
  campaign.approvals.push({ type, actorId, createdAt: new Date().toISOString() });
}

function requireRole(actual, expected) {
  if (actual !== expected) {
    throw new Error(`${expected} role required`);
  }
}

function requiredString(value, name) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is required`);
  }
}
