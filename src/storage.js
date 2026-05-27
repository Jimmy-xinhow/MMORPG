import fs from "node:fs";
import path from "node:path";
import { createStore, hydrateStore, snapshotStore } from "./domain/store.js";
import { GameService } from "./domain/services.js";

export function loadStore(dataFile) {
  if (!dataFile || !fs.existsSync(dataFile)) {
    return createStore();
  }

  const snapshot = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  return hydrateStore(snapshot);
}

export function saveStore(store, dataFile) {
  if (!dataFile) return;

  const resolved = path.resolve(dataFile);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const tempFile = `${resolved}.tmp`;
  fs.writeFileSync(tempFile, `${JSON.stringify(snapshotStore(store), null, 2)}\n`, "utf8");
  fs.renameSync(tempFile, resolved);
}

export function backupStore(store, dataFile, now = new Date()) {
  if (!dataFile) {
    throw new Error("DATA_FILE is required for backup");
  }

  const resolved = path.resolve(dataFile);
  const backupDir = path.join(path.dirname(resolved), "backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = now.toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const backupFile = path.join(backupDir, `store-${stamp}.json`);
  fs.writeFileSync(backupFile, `${JSON.stringify(snapshotStore(store), null, 2)}\n`, "utf8");
  return backupFile;
}

export function resetStore(dataFile, { seed = false } = {}) {
  const store = createStore();
  if (seed) {
    seedDemoData(store);
  }
  saveStore(store, dataFile);
  return store;
}

export function seedDemoData(store) {
  const service = new GameService(store);
  const pack = service.issuePack({ ownerId: "player_1" });
  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 });
  service.buyPack({ listingId: listing.id, buyerId: "operator_1" });
  service.openPack({ packId: pack.id, actorId: "operator_1" });
  service.purchaseTicket({ quantity: 2, idempotencyKey: "seed-ticket-purchase" });
  service.reserveTicket({ quantity: 1, idempotencyKey: "seed-ticket-reserve" });
  service.consumeTicket({ quantity: 1, idempotencyKey: "seed-ticket-consume" });
  service.createOperatorSettlement({ operatorId: "operator_1", amount: 5000, evidence: "seed settlement" });
  service.createCampaign({ rewardCopy: "遊戲道具獎勵" });
  service.createRegulatoryReview({});
  return store;
}
