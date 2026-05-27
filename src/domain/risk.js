export class RiskEngine {
  constructor() {
    this.cases = new Map();
  }

  freeze({ targetType, targetId, severity = "HIGH", reason }) {
    const id = `risk_${this.cases.size + 1}`;
    const riskCase = {
      id,
      targetType,
      targetId,
      severity,
      reason,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };
    this.cases.set(id, riskCase);
    return riskCase;
  }

  resolve(caseId, resolution) {
    const riskCase = this.cases.get(caseId);
    if (!riskCase) {
      throw new Error(`Missing risk case: ${caseId}`);
    }
    riskCase.status = "RESOLVED";
    riskCase.resolution = resolution;
    riskCase.resolvedAt = new Date().toISOString();
    return riskCase;
  }

  isFrozen(targetType, targetId) {
    return [...this.cases.values()].some(
      (riskCase) =>
        riskCase.targetType === targetType &&
        riskCase.targetId === targetId &&
        riskCase.status === "OPEN" &&
        ["HIGH", "CRITICAL"].includes(riskCase.severity),
    );
  }
}
