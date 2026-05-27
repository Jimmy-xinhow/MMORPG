import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../src/domain/store.js";
import { GameService } from "../src/domain/services.js";
import { PACK_STATUS } from "../src/domain/state-machine.js";
import { WITHDRAWAL_STATUS, WITHDRAWAL_TRANSITION } from "../src/domain/withdrawals.js";

function createService() {
  return new GameService(createStore());
}

test("pack can move through issue, list, buy, open, and burn", () => {
  const service = createService();
  const pack = service.issuePack({ ownerId: "player_1" });
  assert.equal(pack.status, PACK_STATUS.OWNED);

  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 });
  assert.equal(listing.status, "ACTIVE");

  const trade = service.buyPack({ listingId: listing.id, buyerId: "operator_1" });
  assert.equal(trade.price, 101);
  assert.equal(pack.ownerId, "operator_1");
  assert.equal(pack.status, PACK_STATUS.COOLDOWN);

  const openLog = service.openPack({ packId: pack.id, actorId: "operator_1" });
  assert.equal(openLog.packId, pack.id);
  assert.equal(pack.status, PACK_STATUS.BURNED);
});

test("gameplay assets cannot create withdrawal payable", () => {
  const service = createService();
  assert.throws(() => service.requestGameplayWithdrawal(), /cannot be withdrawn|OperatorSettlement/);
});

test("approved operator settlement can create pending withdrawal", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  const withdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: settlement.id,
    amount: 3000,
  });

  assert.equal(withdrawal.status, "PENDING_REVIEW");
  assert.equal(service.snapshot().balances.operatorIncome, 2000);
  assert.equal(service.snapshot().balances.operatorPayable, 3000);
});

test("partial settlement exclusion limits withdrawable income", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({
    operatorId: "operator_1",
    amount: 5000,
    approvedWithdrawableAmount: 3200,
    excludedAmount: 1800,
    excludedReasons: ["gameplay asset promotion expense", "unverified adjustment"],
  });

  assert.equal(settlement.grossAmount, 5000);
  assert.equal(settlement.approvedWithdrawableAmount, 3200);
  assert.equal(settlement.excludedAmount, 1800);
  assert.equal(service.snapshot().balances.operatorIncome, 3200);
  assert.throws(
    () =>
      service.requestWithdrawal({
        operatorId: "operator_1",
        settlementId: settlement.id,
        amount: 3201,
      }),
    /remaining approved settlement amount/,
  );
});

test("settlement cannot exclude amount without reasons", () => {
  const service = createService();
  assert.throws(
    () =>
      service.createOperatorSettlement({
        operatorId: "operator_1",
        amount: 5000,
        approvedWithdrawableAmount: 3000,
        excludedAmount: 2000,
      }),
    /exclusion reason/,
  );
});

test("withdrawal follows approval, tax, schedule, and paid state machine", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  const withdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: settlement.id,
    amount: 3000,
  });

  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.APPROVE });
  assert.equal(withdrawal.status, WITHDRAWAL_STATUS.APPROVED);
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.MARK_TAX_READY });
  assert.equal(withdrawal.status, WITHDRAWAL_STATUS.TAX_READY);
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.SCHEDULE_PAYMENT });
  assert.equal(withdrawal.status, WITHDRAWAL_STATUS.PAYMENT_SCHEDULED);
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.MARK_PAID });
  assert.equal(withdrawal.status, WITHDRAWAL_STATUS.PAID);
  assert.equal(service.snapshot().balances.operatorPayable, 0);
  assert.equal(service.snapshot().auditLogs.length, 4);
});

test("withdrawal cannot skip tax readiness", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  const withdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: settlement.id,
    amount: 3000,
  });

  assert.throws(
    () => service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.SCHEDULE_PAYMENT }),
    /Illegal withdrawal transition/,
  );
});

test("withdrawal rejects invalid tax or payment profile before payout", () => {
  const service = createService();
  const taxSettlement = service.createOperatorSettlement({
    operatorId: "operator_1",
    amount: 5000,
    taxStatus: "EXPIRED",
  });
  const taxBlockedWithdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: taxSettlement.id,
    amount: 1000,
  });
  service.advanceWithdrawal({ withdrawalId: taxBlockedWithdrawal.id, transition: WITHDRAWAL_TRANSITION.APPROVE });
  assert.throws(
    () =>
      service.advanceWithdrawal({
        withdrawalId: taxBlockedWithdrawal.id,
        transition: WITHDRAWAL_TRANSITION.MARK_TAX_READY,
      }),
    /valid tax profile/,
  );

  const paymentSettlement = service.createOperatorSettlement({
    operatorId: "operator_1",
    amount: 5000,
    paymentStatus: "INVALID",
  });
  const paymentBlockedWithdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: paymentSettlement.id,
    amount: 1000,
  });
  service.advanceWithdrawal({ withdrawalId: paymentBlockedWithdrawal.id, transition: WITHDRAWAL_TRANSITION.APPROVE });
  service.advanceWithdrawal({ withdrawalId: paymentBlockedWithdrawal.id, transition: WITHDRAWAL_TRANSITION.MARK_TAX_READY });
  assert.throws(
    () =>
      service.advanceWithdrawal({
        withdrawalId: paymentBlockedWithdrawal.id,
        transition: WITHDRAWAL_TRANSITION.SCHEDULE_PAYMENT,
      }),
    /valid payment profile/,
  );
});

test("withdrawal rejection releases reserved settlement income", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  const withdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: settlement.id,
    amount: 3000,
  });

  assert.equal(service.settlementWithdrawalAvailability(settlement.id).availableAmount, 2000);
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.REJECT });
  assert.equal(withdrawal.status, WITHDRAWAL_STATUS.REJECTED);
  assert.equal(service.settlementWithdrawalAvailability(settlement.id).availableAmount, 5000);
  assert.equal(service.snapshot().balances.operatorIncome, 5000);
  assert.equal(service.snapshot().balances.operatorPayable, 0);
});

test("payment failure can return to review without creating extra payable", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  const withdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: settlement.id,
    amount: 3000,
  });

  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.APPROVE });
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.MARK_TAX_READY });
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.SCHEDULE_PAYMENT });
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.PAYMENT_FAIL });
  assert.equal(withdrawal.status, WITHDRAWAL_STATUS.PAYMENT_FAILED);
  assert.equal(service.snapshot().balances.operatorPayable, 3000);
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.RETRY_REVIEW });
  assert.equal(withdrawal.status, WITHDRAWAL_STATUS.PENDING_REVIEW);
  assert.equal(service.snapshot().balances.operatorPayable, 3000);
});

test("risk-frozen pack cannot be listed or opened", () => {
  const service = createService();
  const pack = service.issuePack({ ownerId: "player_1" });
  service.freezePack({ packId: pack.id, reason: "same-device wash cluster" });

  assert.equal(pack.status, PACK_STATUS.FROZEN);
  assert.throws(() => service.listPack({ packId: pack.id, ownerId: "player_1", price: 100 }), /frozen/i);
  assert.throws(() => service.openPack({ packId: pack.id, actorId: "player_1" }), /frozen|terminal/i);
});

test("ledger replay matches cached balances", () => {
  const service = createService();
  const pack = service.issuePack({ ownerId: "player_1" });
  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 });
  service.buyPack({ listingId: listing.id, buyerId: "operator_1" });
  const replay = service.store.ledger.replay();

  for (const [accountId, replayedBalance] of replay.entries()) {
    assert.equal(service.store.ledger.balance(accountId), replayedBalance, accountId);
  }
});

test("operational reports expose reconciliation, boundary, and audit evidence", () => {
  const service = createService();
  const settlement = service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  const withdrawal = service.requestWithdrawal({
    operatorId: "operator_1",
    settlementId: settlement.id,
    amount: 3000,
  });
  service.advanceWithdrawal({ withdrawalId: withdrawal.id, transition: WITHDRAWAL_TRANSITION.APPROVE });

  assert.equal(service.reconcileLedger().status, "PASS");
  assert.equal(service.boundaryReport().withdrawableSource, "OperatorSettlement");
  assert.equal(service.launchReadinessReport().status, "LOCAL_REVIEW_READY");
  assert.deepEqual(service.launchReadinessReport().blockers, ["正式權限"]);
  assert.equal(service.auditReport().auditLogCount, 1);
  assert.equal(service.exportSystemSnapshot().reconciliation.status, "PASS");
  assert.equal(service.exportSystemSnapshot().readiness.withdrawableSource, "OperatorSettlement");
  assert.equal(service.systemStatus().storeSchemaVersion, 1);
  assert.equal(service.systemStatus().checks.readiness, "LOCAL_REVIEW_READY");
});
