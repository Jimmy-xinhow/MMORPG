export const PACK_STATUS = Object.freeze({
  ISSUED: "ISSUED",
  OWNED: "OWNED",
  LISTED: "LISTED",
  TRADE_LOCKED: "TRADE_LOCKED",
  TRADED: "TRADED",
  COOLDOWN: "COOLDOWN",
  FORCE_OPEN_PENDING: "FORCE_OPEN_PENDING",
  OPENING: "OPENING",
  OPENED: "OPENED",
  BURNED: "BURNED",
  FROZEN: "FROZEN",
});

export const PACK_TRANSITION = Object.freeze({
  ISSUE_TO_OWNER: "ISSUE_TO_OWNER",
  LIST_PACK: "LIST_PACK",
  CANCEL_LISTING: "CANCEL_LISTING",
  LOCK_FOR_TRADE: "LOCK_FOR_TRADE",
  SETTLE_TRADE: "SETTLE_TRADE",
  ENTER_COOLDOWN: "ENTER_COOLDOWN",
  COOLDOWN_RELEASE: "COOLDOWN_RELEASE",
  REQUEST_OPEN: "REQUEST_OPEN",
  OPEN_SUCCESS: "OPEN_SUCCESS",
  BURN_AFTER_OPEN: "BURN_AFTER_OPEN",
  FORCE_OPEN_MARK: "FORCE_OPEN_MARK",
  FREEZE_PACK: "FREEZE_PACK",
  UNFREEZE_TO_OWNER: "UNFREEZE_TO_OWNER",
  UNFREEZE_TO_FORCE_OPEN: "UNFREEZE_TO_FORCE_OPEN",
});

const legalTransitions = new Map([
  [PACK_TRANSITION.ISSUE_TO_OWNER, [[PACK_STATUS.ISSUED], PACK_STATUS.OWNED]],
  [PACK_TRANSITION.LIST_PACK, [[PACK_STATUS.OWNED], PACK_STATUS.LISTED]],
  [PACK_TRANSITION.CANCEL_LISTING, [[PACK_STATUS.LISTED], PACK_STATUS.OWNED]],
  [PACK_TRANSITION.LOCK_FOR_TRADE, [[PACK_STATUS.LISTED], PACK_STATUS.TRADE_LOCKED]],
  [PACK_TRANSITION.SETTLE_TRADE, [[PACK_STATUS.TRADE_LOCKED], PACK_STATUS.TRADED]],
  [PACK_TRANSITION.ENTER_COOLDOWN, [[PACK_STATUS.TRADED], PACK_STATUS.COOLDOWN]],
  [PACK_TRANSITION.COOLDOWN_RELEASE, [[PACK_STATUS.COOLDOWN], PACK_STATUS.OWNED]],
  [
    PACK_TRANSITION.REQUEST_OPEN,
    [[PACK_STATUS.OWNED, PACK_STATUS.COOLDOWN, PACK_STATUS.FORCE_OPEN_PENDING], PACK_STATUS.OPENING],
  ],
  [PACK_TRANSITION.OPEN_SUCCESS, [[PACK_STATUS.OPENING], PACK_STATUS.OPENED]],
  [PACK_TRANSITION.BURN_AFTER_OPEN, [[PACK_STATUS.OPENED], PACK_STATUS.BURNED]],
  [
    PACK_TRANSITION.FORCE_OPEN_MARK,
    [[PACK_STATUS.OWNED, PACK_STATUS.COOLDOWN], PACK_STATUS.FORCE_OPEN_PENDING],
  ],
  [
    PACK_TRANSITION.FREEZE_PACK,
    [
      [
        PACK_STATUS.ISSUED,
        PACK_STATUS.OWNED,
        PACK_STATUS.LISTED,
        PACK_STATUS.TRADE_LOCKED,
        PACK_STATUS.TRADED,
        PACK_STATUS.COOLDOWN,
        PACK_STATUS.FORCE_OPEN_PENDING,
      ],
      PACK_STATUS.FROZEN,
    ],
  ],
  [PACK_TRANSITION.UNFREEZE_TO_OWNER, [[PACK_STATUS.FROZEN], PACK_STATUS.OWNED]],
  [PACK_TRANSITION.UNFREEZE_TO_FORCE_OPEN, [[PACK_STATUS.FROZEN], PACK_STATUS.FORCE_OPEN_PENDING]],
]);

export function transitionPack(pack, code, metadata = {}) {
  const rule = legalTransitions.get(code);
  if (!rule) {
    throw new Error(`Unknown pack transition: ${code}`);
  }

  const [fromStates, toStatus] = rule;
  if (!fromStates.includes(pack.status)) {
    throw new Error(`Illegal transition ${code}: ${pack.status} -> ${toStatus}`);
  }

  const fromStatus = pack.status;
  pack.status = toStatus;
  pack.version += 1;
  pack.statusLog.push({
    fromStatus,
    toStatus,
    code,
    actorType: metadata.actorType ?? "system",
    actorId: metadata.actorId ?? null,
    reason: metadata.reason ?? null,
    createdAt: new Date().toISOString(),
  });

  return pack;
}

export function assertPackActionAllowed(pack, action) {
  if (pack.status === PACK_STATUS.FROZEN) {
    throw new Error(`Pack is frozen and cannot ${action}`);
  }
  if ([PACK_STATUS.OPENED, PACK_STATUS.BURNED].includes(pack.status)) {
    throw new Error(`Pack is terminal and cannot ${action}`);
  }
}
