import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../src/domain/store.js";
import { GameService } from "../src/domain/services.js";
import { TRADING_SESSION_STATUS } from "../src/domain/trading-session.js";

test("listing and buying require an open trading session", () => {
  const service = new GameService(createStore());
  const pack = service.issuePack({ ownerId: "player_1" });
  const active = service.activeTradingSession();
  service.advanceTradingSession({ sessionId: active.id, status: TRADING_SESSION_STATUS.CLOSED });

  assert.throws(() => service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 }), /not open/);

  const nextSession = service.createTradingSession({});
  service.advanceTradingSession({ sessionId: nextSession.id, status: TRADING_SESSION_STATUS.OPEN });
  const listing = service.listPack({ packId: pack.id, ownerId: "player_1", price: 101 });
  assert.equal(listing.sessionId, nextSession.id);

  service.advanceTradingSession({ sessionId: nextSession.id, status: TRADING_SESSION_STATUS.CLOSED });
  assert.throws(() => service.buyPack({ listingId: listing.id, buyerId: "operator_1" }), /not open/);
});
