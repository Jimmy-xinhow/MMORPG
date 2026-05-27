export const TRADING_SESSION_STATUS = Object.freeze({
  SCHEDULED: "SCHEDULED",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  SETTLED: "SETTLED",
  CANCELLED: "CANCELLED",
});

export function createTradingSession({ id, startsAt = null, endsAt = null }) {
  requiredString(id, "id");
  return {
    id,
    status: TRADING_SESSION_STATUS.SCHEDULED,
    startsAt,
    endsAt,
    statusLog: [],
    createdAt: new Date().toISOString(),
  };
}

export function transitionTradingSession(session, toStatus, actorId = "system") {
  const allowed = {
    [TRADING_SESSION_STATUS.OPEN]: [TRADING_SESSION_STATUS.SCHEDULED],
    [TRADING_SESSION_STATUS.CLOSED]: [TRADING_SESSION_STATUS.OPEN],
    [TRADING_SESSION_STATUS.SETTLED]: [TRADING_SESSION_STATUS.CLOSED],
    [TRADING_SESSION_STATUS.CANCELLED]: [TRADING_SESSION_STATUS.SCHEDULED, TRADING_SESSION_STATUS.OPEN],
  };
  if (!allowed[toStatus]?.includes(session.status)) {
    throw new Error(`Illegal trading session transition: ${session.status} -> ${toStatus}`);
  }
  const fromStatus = session.status;
  session.status = toStatus;
  session.statusLog.push({ fromStatus, toStatus, actorId, createdAt: new Date().toISOString() });
  return session;
}

function requiredString(value, name) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is required`);
  }
}
