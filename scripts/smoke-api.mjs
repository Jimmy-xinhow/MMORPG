import { createServer } from "../src/server.js";

const server = createServer();
const port = 3100;
const baseUrl = `http://127.0.0.1:${port}`;

function listen() {
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", resolve);
  });
}

function close() {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function request(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json", "x-demo-role": "ADMIN" } : { "x-demo-role": "ADMIN" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok || payload.ok === false) {
    throw new Error(`${path} failed: ${payload.error}`);
  }
  return payload;
}

async function expectFailure(path, body, pattern) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-demo-role": "ADMIN" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (payload.ok !== false || !pattern.test(payload.error)) {
    throw new Error(`${path} expected failure ${pattern}, got ${JSON.stringify(payload)}`);
  }
}

await listen();

try {
  await request("/api/health");
  const systemStatus = await request("/api/system/status");
  if (
    systemStatus.storeSchemaVersion !== 1 ||
    systemStatus.checks.reconciliation !== "PASS" ||
    systemStatus.checks.readiness !== "LOCAL_REVIEW_READY"
  ) {
    throw new Error("System status smoke check failed");
  }
  const apiContract = await request("/api/openapi.json");
  if (!apiContract.productBoundary.includes("non-withdrawable")) {
    throw new Error("API contract smoke check failed");
  }
  const readiness = await request("/api/launch-readiness");
  if (
    readiness.withdrawableSource !== "OperatorSettlement" ||
    !readiness.blockers.includes("正式權限") ||
    !readiness.nonWithdrawableAssets.includes("PACK")
  ) {
    throw new Error("Launch readiness smoke check failed");
  }
  const initialPlayerState = await request("/api/player/state");
  if (initialPlayerState.player.id !== "player_1" || "withdrawals" in initialPlayerState) {
    throw new Error("Player state smoke check failed");
  }
  if (
    initialPlayerState.character?.equipment?.weapon?.name !== "青銅長劍" ||
    !initialPlayerState.inventory?.some((item) => item.id === "star_charm") ||
    !initialPlayerState.skills?.some((skill) => skill.id === "power_slash") ||
    initialPlayerState.combat?.mode !== "AUTO_BATTLE"
  ) {
    throw new Error("Player RPG state smoke check failed");
  }
  const patrolAction = await request("/api/player/action", { ownerId: "player_1", action: "patrol" });
  if (patrolAction.result.action !== "patrol" || patrolAction.result.profile.balances.gc <= initialPlayerState.balances.gc) {
    throw new Error("Player action smoke check failed");
  }
  const unauthorized = await fetch(`${baseUrl}/api/operator/settlements`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-demo-role": "PLAYER" },
    body: JSON.stringify({ operatorId: "operator_1", amount: 1000 }),
  }).then((response) => response.json());
  if (unauthorized.ok !== false || !unauthorized.error.includes("Unauthorized")) {
    throw new Error("Authorization smoke check failed");
  }
  const issued = await request("/api/player/packs/issue", { ownerId: "player_1" });
  const packId = issued.result.id;
  const simulatedPayment = await request("/api/player/simulate-payment", {
    ownerId: "player_1",
    amount: 120,
    idempotencyKey: "smoke-sim-payment",
  });
  if (simulatedPayment.result.payment.status !== "SIMULATED_APPROVED") {
    throw new Error("Simulated payment smoke check failed");
  }
  const session = await request("/api/trading-sessions", {});
  await request("/api/trading-sessions/advance", { sessionId: session.result.id, status: "OPEN" });
  const listed = await request("/api/packs/list", { packId, ownerId: "player_1", price: 101 });
  await request("/api/packs/buy", { listingId: listed.result.id, buyerId: "operator_1" });
  await request("/api/packs/open", { packId, actorId: "operator_1" });

  const settlement = await request("/api/operator/settlements", { operatorId: "operator_1", amount: 5000 });
  const withdrawal = await request("/api/operator/withdrawals", {
    operatorId: "operator_1",
    settlementId: settlement.result.id,
    amount: 3000,
  });
  await request("/api/operator/withdrawals/advance", {
    withdrawalId: withdrawal.result.id,
    transition: "APPROVE",
  });
  await request("/api/operator/withdrawals/advance", {
    withdrawalId: withdrawal.result.id,
    transition: "MARK_TAX_READY",
  });
  await request("/api/operator/withdrawals/advance", {
    withdrawalId: withdrawal.result.id,
    transition: "SCHEDULE_PAYMENT",
  });
  await expectFailure(
    "/api/forbidden/gameplay-withdrawal",
    {},
    /gameplay assets|不可提現|cannot be withdrawn/i,
  );
  await request("/api/tickets/purchase", { quantity: 2, idempotencyKey: "smoke-ticket-buy" });
  await request("/api/tickets/reserve", { quantity: 1, idempotencyKey: "smoke-ticket-reserve" });
  await request("/api/tickets/consume", { quantity: 1, idempotencyKey: "smoke-ticket-consume" });
  await request("/api/redemptions/submit", {
    ticketId: "boss_ticket_1",
    refId: "boss_reward_1",
    idempotencyKey: "smoke-redemption",
  });
  await request("/api/boss/settle", { bossRewardPool: 1000 });
  await request("/api/guild/scan", {});
  const incident = await request("/api/operations/halt", {
    scopes: ["TRADING", "WITHDRAWAL"],
    reason: "smoke incident drill",
  });
  await request("/api/operations/resume", {
    incidentId: incident.result.incident.id,
    reason: "smoke incident resolved",
  });
  await request("/api/rpg/validate", {});
  const economyConfig = await request("/api/economy/configs", { maxGrowthRate: 1.1, forceOpenPrice: 999 });
  await request("/api/economy/configs/approve", { configId: economyConfig.result.id });
  await request("/api/economy/configs/activate", { configId: economyConfig.result.id });
  await request("/api/jobs/force-open", {});
  const campaign = await request("/api/liveops/campaigns", { rewardCopy: "遊戲道具獎勵" });
  await request("/api/liveops/campaigns/advance", {
    campaignId: campaign.result.id,
    transition: "SUBMIT_PRODUCT_REVIEW",
  });
  await request("/api/liveops/campaigns/advance", {
    campaignId: campaign.result.id,
    transition: "PRODUCT_APPROVE",
    actorId: "product_1",
    role: "PRODUCT_REVIEWER",
  });
  await request("/api/liveops/campaigns/advance", {
    campaignId: campaign.result.id,
    transition: "RISK_APPROVE",
    actorId: "risk_1",
    role: "RISK_REVIEWER",
  });
  const review = await request("/api/regulatory/reviews", {});
  await request("/api/regulatory/reviews/submit", { reviewId: review.result.id });
  for (const owner of ["PRODUCT", "ENGINEERING", "RISK", "LEGAL", "ACCOUNTING_TAX", "PAYMENT"]) {
    await request("/api/regulatory/reviews/opinion", {
      reviewId: review.result.id,
      owner,
      decision: "GO",
      opinionRef: `docs/regulatory-reviews/smoke/${owner}.md`,
    });
  }
  await request("/api/regulatory/reviews/finalize", { reviewId: review.result.id });
  await request("/api/regulatory/reviews/assert-allowed", { reviewId: review.result.id });

  const state = await request("/api/state");
  if (!state.boundaryCopy.includes("遊戲資產不可提現")) {
    throw new Error("Boundary copy missing from API state");
  }
  if (!state.readiness?.items?.some((item) => item.area === "經營收入")) {
    throw new Error("Readiness report missing from API state");
  }
  const healthResponse = await fetch(`${baseUrl}/api/health`);
  if (healthResponse.headers.get("x-content-type-options") !== "nosniff") {
    throw new Error("Security header smoke check failed");
  }
  if (state.gameplay.ticketBook.liability !== 1) {
    throw new Error("Ticket liability smoke check failed");
  }
  const reconciliation = await request("/api/reports/reconciliation");
  if (reconciliation.status !== "PASS") {
    throw new Error("Reconciliation report failed");
  }
  const boundary = await request("/api/reports/boundary");
  if (boundary.withdrawableSource !== "OperatorSettlement") {
    throw new Error("Boundary report missing OperatorSettlement rule");
  }
  await request("/api/reports/audit");
  const exportPayload = await request("/api/admin/export");
  if (exportPayload.reconciliation.status !== "PASS" || exportPayload.readiness.status !== "LOCAL_REVIEW_READY") {
    throw new Error("Admin export reconciliation check failed");
  }
  await request("/api/admin/save", {});
  const manifest = await fetch(`${baseUrl}/manifest.json`).then((response) => response.json());
  if (manifest.display !== "standalone") {
    throw new Error("PWA manifest smoke check failed");
  }
  const serviceWorker = await fetch(`${baseUrl}/sw.js`).then((response) => response.text());
  if (!serviceWorker.includes("CACHE_NAME")) {
    throw new Error("Service worker smoke check failed");
  }
  const home = await fetch(`${baseUrl}/`).then((response) => response.text());
  for (const text of [
    "幸運禮包世界",
    "手機放置冒險",
    "遊戲主畫面",
    "角色目前狀態",
    "玩家資產摘要",
    "玩家功能",
    "取得幸運禮包",
    "玩家背包",
    "交易場行情",
    "開包結果",
    "目前流程",
    "遊戲紀錄",
    "服務條款",
    "隱私權政策",
    "機率與內容揭露",
    "退款與客服",
  ]) {
    if (!home.includes(text)) {
      throw new Error(`Home page missing text: ${text}`);
    }
  }
  for (const text of ["經營者中心", "管理後台", "資料管理", "系統狀態", "API 契約", "風控", "審查"]) {
    if (home.includes(text)) {
      throw new Error(`Home page exposes non-player text: ${text}`);
    }
  }

  console.log("API smoke passed");
} finally {
  await close();
}
