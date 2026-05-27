import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../src/domain/store.js";
import { GameService } from "../src/domain/services.js";
import { PACK_STATUS } from "../src/domain/state-machine.js";

test("economy config must be approved before activation and controls listing cap", () => {
  const service = new GameService(createStore());
  const config = service.createEconomyConfig({ maxGrowthRate: 1.2, forceOpenPrice: 999 });
  assert.throws(() => service.activateEconomyConfig({ configId: config.id }), /APPROVED/);
  service.approveEconomyConfig({ configId: config.id });
  service.activateEconomyConfig({ configId: config.id });

  const pack = service.issuePack({ ownerId: "player_1" });
  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 120 });
  assert.equal(listing.economyConfigId, config.id);
});

test("force-open job opens eligible cooldown pack by trade count", () => {
  const service = new GameService(createStore());
  const config = service.createEconomyConfig({ maxTradeCount: 1, forceOpenPrice: 999 });
  service.approveEconomyConfig({ configId: config.id });
  service.activateEconomyConfig({ configId: config.id });

  const pack = service.issuePack({ ownerId: "player_1" });
  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 });
  service.buyPack({ listingId: listing.id, buyerId: "operator_1" });

  const job = service.runForceOpenJob();
  assert.deepEqual(job.openedPackIds, [pack.id]);
  assert.equal(pack.status, PACK_STATUS.BURNED);
  assert.equal(service.snapshot().openLogs.length, 1);
});

test("force-open job skips risk-frozen eligible pack", () => {
  const service = new GameService(createStore());
  const config = service.createEconomyConfig({ maxTradeCount: 1, forceOpenPrice: 999 });
  service.approveEconomyConfig({ configId: config.id });
  service.activateEconomyConfig({ configId: config.id });

  const pack = service.issuePack({ ownerId: "player_1" });
  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 });
  service.buyPack({ listingId: listing.id, buyerId: "operator_1" });
  service.freezePack({ packId: pack.id, reason: "force-open risk skip" });

  const job = service.runForceOpenJob();
  assert.deepEqual(job.skippedPackIds, [pack.id]);
  assert.equal(pack.status, PACK_STATUS.FROZEN);
});
