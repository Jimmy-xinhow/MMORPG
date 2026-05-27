import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../src/domain/store.js";
import { GameService } from "../src/domain/services.js";

function createService() {
  return new GameService(createStore());
}

test("operational halt blocks trading until resumed", () => {
  const service = createService();
  const pack = service.issuePack({ ownerId: "player_1" });
  const incident = service.haltOperations({ scopes: ["TRADING"], reason: "wash-trading incident" });

  assert.equal(incident.mode, "HALTED");
  assert.throws(() => service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 }), /halted: TRADING/);

  service.resumeOperations({ incidentId: incident.incident.id, reason: "risk review complete" });
  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 });
  assert.equal(listing.status, "ACTIVE");
});

test("operational halt blocks withdrawal creation without blocking settlement evidence", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  service.haltOperations({ scopes: ["WITHDRAWAL"], reason: "same-bank payout cluster" });

  assert.throws(
    () =>
      service.requestWithdrawal({
        operatorId: "operator_1",
        settlementId: settlement.id,
        amount: 3000,
      }),
    /halted: WITHDRAWAL/,
  );
  assert.equal(service.snapshot().balances.operatorIncome, 5000);
});
