export const OPERATION_SCOPES = Object.freeze({
  TRADING: "TRADING",
  WITHDRAWAL: "WITHDRAWAL",
  LIVEOPS: "LIVEOPS",
});

export function haltOperations(operations, { scopes = [OPERATION_SCOPES.TRADING, OPERATION_SCOPES.WITHDRAWAL], reason, actorId = "risk_admin" } = {}) {
  if (!reason) {
    throw new Error("Operation halt requires a reason");
  }
  const normalizedScopes = normalizeScopes(scopes);
  const incident = {
    id: `incident_${operations.nextIncidentId++}`,
    status: "ACTIVE",
    scopes: normalizedScopes,
    reason,
    actorId,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    resolutionReason: null,
  };
  operations.incidents.push(incident);
  operations.haltedScopes = [...new Set([...operations.haltedScopes, ...normalizedScopes])];
  operations.mode = operations.haltedScopes.length > 0 ? "HALTED" : "ACTIVE";
  return incident;
}

export function resumeOperations(operations, { incidentId = null, scopes = null, reason, actorId = "risk_admin" } = {}) {
  if (!reason) {
    throw new Error("Operation resume requires a reason");
  }
  const incident = incidentId ? operations.incidents.find((item) => item.id === incidentId) : null;
  const targetScopes = normalizeScopes(scopes ?? incident?.scopes ?? operations.haltedScopes);
  operations.haltedScopes = operations.haltedScopes.filter((scope) => !targetScopes.includes(scope));
  operations.mode = operations.haltedScopes.length > 0 ? "HALTED" : "ACTIVE";

  if (incident && incident.status === "ACTIVE") {
    incident.status = "RESOLVED";
    incident.resolvedAt = new Date().toISOString();
    incident.resolutionReason = reason;
    incident.resolvedBy = actorId;
  }

  return {
    mode: operations.mode,
    resumedScopes: targetScopes,
    haltedScopes: operations.haltedScopes,
    incident,
  };
}

export function assertOperationAllowed(operations, scope) {
  if (operations.haltedScopes.includes(scope)) {
    throw new Error(`Operation scope is halted: ${scope}`);
  }
}

function normalizeScopes(scopes) {
  const allowed = Object.values(OPERATION_SCOPES);
  const normalized = [...new Set(scopes)];
  if (normalized.length === 0 || normalized.some((scope) => !allowed.includes(scope))) {
    throw new Error(`Operation scope must be one of: ${allowed.join(", ")}`);
  }
  return normalized;
}
