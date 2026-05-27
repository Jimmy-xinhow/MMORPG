import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { GameService } from "../src/domain/services.js";
import { createStore } from "../src/domain/store.js";
import { backupStore, loadStore, resetStore, saveStore, seedDemoData } from "../src/storage.js";

test("store snapshot persists pack, ledger, risk, and gameplay state", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lucky-pack-store-"));
  const dataFile = path.join(dir, "store.json");

  const service = new GameService(createStore());
  const pack = service.issuePack({ ownerId: "player_1" });
  service.freezePack({ packId: pack.id, reason: "persistence risk check" });
  service.purchaseTicket({ quantity: 2, idempotencyKey: "persist-ticket" });
  service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000 });
  saveStore(service.store, dataFile);

  const restored = new GameService(loadStore(dataFile));
  assert.equal(restored.snapshot().packs.length, 1);
  assert.equal(restored.snapshot().riskCases.length, 1);
  assert.equal(restored.snapshot().gameplay.ticketBook.active, 2);
  assert.equal(restored.reconcileLedger().status, "PASS");
});

test("seed, backup, and reset manage local data file", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lucky-pack-admin-data-"));
  const dataFile = path.join(dir, "store.json");

  const seededStore = resetStore(dataFile, { seed: true });
  assert.equal(new GameService(seededStore).snapshot().packs.length, 1);

  const backupFile = backupStore(seededStore, dataFile, new Date("2026-01-01T00:00:00Z"));
  assert.equal(fs.existsSync(backupFile), true);

  const reset = resetStore(dataFile);
  assert.equal(new GameService(reset).snapshot().packs.length, 0);
});

test("seedDemoData is deterministic enough for smoke workflows", () => {
  const store = createStore();
  seedDemoData(store);
  const service = new GameService(store);
  const state = service.snapshot();

  assert.equal(state.packs.length, 1);
  assert.equal(state.gameplay.ticketBook.consumed, 1);
  assert.equal(state.settlements.length, 1);
  assert.equal(service.reconcileLedger().status, "PASS");
});
