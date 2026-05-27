export const WITHDRAWAL_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  TAX_READY: "TAX_READY",
  PAYMENT_SCHEDULED: "PAYMENT_SCHEDULED",
  PAID: "PAID",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  FROZEN: "FROZEN",
  PAYMENT_FAILED: "PAYMENT_FAILED",
});

export const WITHDRAWAL_TRANSITION = Object.freeze({
  SUBMIT: "SUBMIT",
  APPROVE: "APPROVE",
  MARK_TAX_READY: "MARK_TAX_READY",
  SCHEDULE_PAYMENT: "SCHEDULE_PAYMENT",
  MARK_PAID: "MARK_PAID",
  REJECT: "REJECT",
  CANCEL: "CANCEL",
  FREEZE: "FREEZE",
  PAYMENT_FAIL: "PAYMENT_FAIL",
  RETRY_REVIEW: "RETRY_REVIEW",
});

const transitionRules = new Map([
  [WITHDRAWAL_TRANSITION.SUBMIT, [[WITHDRAWAL_STATUS.DRAFT], WITHDRAWAL_STATUS.PENDING_REVIEW]],
  [WITHDRAWAL_TRANSITION.APPROVE, [[WITHDRAWAL_STATUS.PENDING_REVIEW], WITHDRAWAL_STATUS.APPROVED]],
  [WITHDRAWAL_TRANSITION.MARK_TAX_READY, [[WITHDRAWAL_STATUS.APPROVED], WITHDRAWAL_STATUS.TAX_READY]],
  [
    WITHDRAWAL_TRANSITION.SCHEDULE_PAYMENT,
    [[WITHDRAWAL_STATUS.TAX_READY], WITHDRAWAL_STATUS.PAYMENT_SCHEDULED],
  ],
  [WITHDRAWAL_TRANSITION.MARK_PAID, [[WITHDRAWAL_STATUS.PAYMENT_SCHEDULED], WITHDRAWAL_STATUS.PAID]],
  [WITHDRAWAL_TRANSITION.REJECT, [[WITHDRAWAL_STATUS.PENDING_REVIEW], WITHDRAWAL_STATUS.REJECTED]],
  [WITHDRAWAL_TRANSITION.CANCEL, [[WITHDRAWAL_STATUS.APPROVED, WITHDRAWAL_STATUS.TAX_READY], WITHDRAWAL_STATUS.CANCELLED]],
  [
    WITHDRAWAL_TRANSITION.FREEZE,
    [
      [
        WITHDRAWAL_STATUS.PENDING_REVIEW,
        WITHDRAWAL_STATUS.APPROVED,
        WITHDRAWAL_STATUS.TAX_READY,
        WITHDRAWAL_STATUS.PAYMENT_SCHEDULED,
      ],
      WITHDRAWAL_STATUS.FROZEN,
    ],
  ],
  [
    WITHDRAWAL_TRANSITION.PAYMENT_FAIL,
    [[WITHDRAWAL_STATUS.PAYMENT_SCHEDULED], WITHDRAWAL_STATUS.PAYMENT_FAILED],
  ],
  [
    WITHDRAWAL_TRANSITION.RETRY_REVIEW,
    [[WITHDRAWAL_STATUS.PAYMENT_FAILED], WITHDRAWAL_STATUS.PENDING_REVIEW],
  ],
]);

export function transitionWithdrawal(withdrawal, code, metadata = {}) {
  const rule = transitionRules.get(code);
  if (!rule) {
    throw new Error(`Unknown withdrawal transition: ${code}`);
  }

  const [fromStates, toStatus] = rule;
  if (!fromStates.includes(withdrawal.status)) {
    throw new Error(`Illegal withdrawal transition ${code}: ${withdrawal.status} -> ${toStatus}`);
  }

  if (code === WITHDRAWAL_TRANSITION.MARK_TAX_READY && withdrawal.taxStatus !== "VALID") {
    throw new Error("Withdrawal cannot become TAX_READY without valid tax profile");
  }

  if (code === WITHDRAWAL_TRANSITION.SCHEDULE_PAYMENT && withdrawal.paymentStatus !== "VALID") {
    throw new Error("Withdrawal cannot schedule payment without valid payment profile");
  }

  const fromStatus = withdrawal.status;
  withdrawal.status = toStatus;
  withdrawal.statusLog.push({
    fromStatus,
    toStatus,
    code,
    actorType: metadata.actorType ?? "system",
    actorId: metadata.actorId ?? null,
    reason: metadata.reason ?? null,
    createdAt: new Date().toISOString(),
  });
  return withdrawal;
}
