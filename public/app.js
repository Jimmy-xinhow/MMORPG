let latestState;
let lastMessage = "載入中...";
let lastMessageType = "ok";
let nonce = 1;
let activeView = "player";
let activePlayerTab = "inventory";

const packStatuses = [
  "ISSUED",
  "OWNED",
  "LISTED",
  "TRADE_LOCKED",
  "TRADED",
  "COOLDOWN",
  "FORCE_OPEN_PENDING",
  "OPENING",
  "OPENED",
  "BURNED",
  "FROZEN",
];

const packStatusLabels = {
  ISSUED: "已建立",
  OWNED: "玩家持有",
  LISTED: "交易中",
  TRADE_LOCKED: "交易鎖定",
  TRADED: "交易完成",
  COOLDOWN: "冷卻期",
  FORCE_OPEN_PENDING: "待強制開包",
  OPENING: "開包中",
  OPENED: "已開包",
  BURNED: "已銷毀",
  FROZEN: "已凍結",
};

const balanceLabels = {
  playerGc: "玩家 GC",
  operatorGc: "經營者 GC",
  operatorIncome: "經營收入",
  operatorPayable: "待撥款",
};

const actionLabels = {
  playerNext: "玩家流程下一步",
  operatorNext: "經營者流程下一步",
  issue: "發行禮包",
  list: "掛單",
  buy: "購買",
  open: "開包",
  freeze: "凍結禮包",
  operationsHalt: "暫停交易與撥款",
  operationsResume: "恢復營運",
  settlement: "建立結算",
  withdrawal: "申請撥款",
  approveWithdrawal: "核准撥款",
  taxReady: "稅務完成",
  schedulePayment: "排程付款",
  markPaid: "標記已付款",
  rejectWithdrawal: "拒絕撥款",
  paymentFail: "付款失敗",
  retryWithdrawal: "退回重審",
  forbidden: "不可提現測試",
  ticketPurchase: "購買票券",
  ticketReserve: "保留票券",
  ticketConsume: "消耗票券",
  redemption: "提交兌換",
  bossSettle: "Boss 結算",
  guildScan: "掃描公會濫用",
  rpgValidate: "驗證 RPG 內容",
  economyCreate: "建立經濟設定",
  economyApprove: "核准經濟設定",
  economyActivate: "啟用經濟設定",
  forceOpenJob: "執行強制開包",
  sessionCreate: "建立交易場",
  sessionOpen: "開啟交易場",
  sessionClose: "關閉交易場",
  campaignCreate: "建立活動",
  campaignSubmit: "送產品審查",
  campaignProductApprove: "產品核准",
  campaignRiskApprove: "風控核准",
  campaignActivate: "啟動活動",
  campaignRollback: "回滾活動",
  reviewCreate: "建立審查",
  reviewSubmit: "送出審查",
  reviewOpinions: "補齊 GO 意見",
  reviewFinalize: "定稿決策",
  reviewAssert: "確認可實作",
  reviewCircumvention: "防繞過檢查",
  adminSave: "手動保存",
  adminBackup: "建立備份",
  adminExport: "匯出快照",
  adminSeed: "匯入範例資料",
  adminReset: "重置資料",
  systemStatus: "刷新系統狀態",
  apiContract: "讀取 API 契約",
};

async function api(path, body, label = "操作") {
  const headers = {};
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    headers["x-admin-token"] = adminToken;
  } else {
    headers["x-demo-role"] = selectedDemoRole();
  }
  if (body) headers["content-type"] = "application/json";
  const response = await fetch(path, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  latestState = payload.state ?? latestState ?? payload;

  if (!response.ok || payload.ok === false) {
    setMessage(`${label}失敗：${payload.error ?? "未知錯誤"}`, "error");
    render(payload.error);
    return payload;
  }

  if (!payload.state) {
    if (path === "/api/system/status") latestState.systemStatus = payload;
    if (path === "/api/openapi.json") latestState.apiContract = payload;
    if (path === "/api/admin/export") latestState.adminExport = payload;
  }

  setMessage(body ? `${label}完成` : "狀態已更新", "ok");
  render();
  return payload;
}

function latestPack() {
  return latestState?.packs?.at(-1);
}

function latestListing() {
  return [...(latestState?.listings ?? [])].reverse().find((listing) => listing.status === "ACTIVE");
}

function latestSettlement() {
  return latestState?.settlements?.at(-1);
}

function latestWithdrawal() {
  return latestState?.withdrawals?.at(-1);
}

function latestCampaign() {
  return latestState?.liveOps?.campaigns?.at(-1);
}

function latestReview() {
  return latestState?.regulatory?.reviews?.at(-1);
}

function latestDraftEconomyConfig() {
  return [...(latestState?.economy?.configs ?? [])].reverse().find((config) => config.status === "DRAFT");
}

function latestApprovedEconomyConfig() {
  return [...(latestState?.economy?.configs ?? [])].reverse().find((config) => config.status === "APPROVED");
}

function latestTradingSession() {
  return latestState?.tradingSessions?.at(-1);
}

function activeOpenTradingSession() {
  return (latestState?.tradingSessions ?? []).find(
    (session) => session.id === latestState.activeTradingSessionId && session.status === "OPEN",
  );
}

async function runAction(action) {
  const label = actionLabels[action] ?? "操作";

  if (action === "playerNext") {
    await runPlayerNext(label);
  } else if (action === "operatorNext") {
    await runOperatorNext(label);
  } else if (action === "issue") {
    await api("/api/player/packs/issue", { ownerId: "player_1" }, label);
  } else if (action === "list") {
    await api("/api/packs/list", { packId: latestPack()?.id, ownerId: "player_1", price: 101 }, label);
  } else if (action === "buy") {
    await api("/api/packs/buy", { listingId: latestListing()?.id, buyerId: "operator_1" }, label);
  } else if (action === "open") {
    const pack = latestPack();
    await api("/api/packs/open", { packId: pack?.id, actorId: pack?.ownerId }, label);
  } else if (action === "freeze") {
    await api("/api/packs/freeze", { packId: latestPack()?.id, reason: "manual high-risk review" }, label);
  } else if (action === "operationsHalt") {
    await api(
      "/api/operations/halt",
      { scopes: ["TRADING", "WITHDRAWAL"], reason: "manual incident drill", actorId: "risk_admin" },
      label,
    );
  } else if (action === "operationsResume") {
    const incident = latestState?.operations?.incidents?.findLast?.((item) => item.status === "ACTIVE");
    await api(
      "/api/operations/resume",
      { incidentId: incident?.id, reason: "manual review complete", actorId: "risk_admin" },
      label,
    );
  } else if (action === "settlement") {
    await api("/api/operator/settlements", { operatorId: "operator_1", amount: 5000 }, label);
  } else if (action === "withdrawal") {
    await api(
      "/api/operator/withdrawals",
      { operatorId: "operator_1", settlementId: latestSettlement()?.id, amount: 3000 },
      label,
    );
  } else if (
    [
      "approveWithdrawal",
      "taxReady",
      "schedulePayment",
      "markPaid",
      "rejectWithdrawal",
      "paymentFail",
      "retryWithdrawal",
    ].includes(action)
  ) {
    const transitionByAction = {
      approveWithdrawal: "APPROVE",
      taxReady: "MARK_TAX_READY",
      schedulePayment: "SCHEDULE_PAYMENT",
      markPaid: "MARK_PAID",
      rejectWithdrawal: "REJECT",
      paymentFail: "PAYMENT_FAIL",
      retryWithdrawal: "RETRY_REVIEW",
    };
    await api(
      "/api/operator/withdrawals/advance",
      { withdrawalId: latestWithdrawal()?.id, transition: transitionByAction[action] },
      label,
    );
  } else if (action === "forbidden") {
    await api("/api/forbidden/gameplay-withdrawal", {}, label);
  } else if (action === "ticketPurchase") {
    await api("/api/tickets/purchase", { quantity: 2, idempotencyKey: `ui-ticket-buy-${nonce++}` }, label);
  } else if (action === "ticketReserve") {
    await api("/api/tickets/reserve", { quantity: 1, idempotencyKey: `ui-ticket-reserve-${nonce++}` }, label);
  } else if (action === "ticketConsume") {
    await api("/api/tickets/consume", { quantity: 1, idempotencyKey: `ui-ticket-consume-${nonce++}` }, label);
  } else if (action === "redemption") {
    await api(
      "/api/redemptions/submit",
      { ticketId: `boss_ticket_${nonce}`, refId: `boss_reward_${nonce}`, idempotencyKey: `ui-redemption-${nonce++}` },
      label,
    );
  } else if (action === "bossSettle") {
    await api("/api/boss/settle", { bossRewardPool: 1000 }, label);
  } else if (action === "guildScan") {
    await api("/api/guild/scan", {}, label);
  } else if (action === "rpgValidate") {
    await api("/api/rpg/validate", {}, label);
  } else if (action === "economyCreate") {
    await api("/api/economy/configs", { maxGrowthRate: 1.1, maxTradeCount: 1, forceOpenPrice: 999 }, label);
  } else if (action === "economyApprove") {
    await api("/api/economy/configs/approve", { configId: latestDraftEconomyConfig()?.id }, label);
  } else if (action === "economyActivate") {
    await api("/api/economy/configs/activate", { configId: latestApprovedEconomyConfig()?.id }, label);
  } else if (action === "forceOpenJob") {
    await api("/api/jobs/force-open", {}, label);
  } else if (action === "sessionCreate") {
    await api("/api/trading-sessions", {}, label);
  } else if (action === "sessionOpen") {
    await api("/api/trading-sessions/advance", { sessionId: latestTradingSession()?.id, status: "OPEN" }, label);
  } else if (action === "sessionClose") {
    await api("/api/trading-sessions/advance", { sessionId: latestTradingSession()?.id, status: "CLOSED" }, label);
  } else if (action === "campaignCreate") {
    await api("/api/liveops/campaigns", { rewardCopy: "遊戲道具獎勵" }, label);
  } else if (action === "campaignSubmit") {
    await api("/api/liveops/campaigns/advance", { campaignId: latestCampaign()?.id, transition: "SUBMIT_PRODUCT_REVIEW" }, label);
  } else if (action === "campaignProductApprove") {
    await api(
      "/api/liveops/campaigns/advance",
      { campaignId: latestCampaign()?.id, transition: "PRODUCT_APPROVE", actorId: "product_1", role: "PRODUCT_REVIEWER" },
      label,
    );
  } else if (action === "campaignRiskApprove") {
    await api(
      "/api/liveops/campaigns/advance",
      { campaignId: latestCampaign()?.id, transition: "RISK_APPROVE", actorId: "risk_1", role: "RISK_REVIEWER" },
      label,
    );
  } else if (action === "campaignActivate") {
    await api("/api/liveops/campaigns/advance", { campaignId: latestCampaign()?.id, transition: "ACTIVATE" }, label);
  } else if (action === "campaignRollback") {
    await api(
      "/api/liveops/campaigns/advance",
      { campaignId: latestCampaign()?.id, transition: "ROLLBACK", role: "ADMIN", reason: "manual rollback drill" },
      label,
    );
  } else if (action === "reviewCreate") {
    await api("/api/regulatory/reviews", {}, label);
  } else if (action === "reviewSubmit") {
    await api("/api/regulatory/reviews/submit", { reviewId: latestReview()?.id }, label);
  } else if (action === "reviewOpinions") {
    const review = latestReview();
    for (const owner of ["PRODUCT", "ENGINEERING", "RISK", "LEGAL", "ACCOUNTING_TAX", "PAYMENT"]) {
      await api(
        "/api/regulatory/reviews/opinion",
        { reviewId: review?.id, owner, decision: "GO", opinionRef: `docs/regulatory-reviews/ui/${owner}.md` },
        `${label} ${owner}`,
      );
    }
  } else if (action === "reviewFinalize") {
    await api("/api/regulatory/reviews/finalize", { reviewId: latestReview()?.id }, label);
  } else if (action === "reviewAssert") {
    await api("/api/regulatory/reviews/assert-allowed", { reviewId: latestReview()?.id }, label);
  } else if (action === "reviewCircumvention") {
    await api(
      "/api/regulatory/reviews/circumvention-check",
      { reviewId: latestReview()?.id, proposedText: "第三方兌換禮品卡並宣稱可提現" },
      label,
    );
  } else if (action === "adminSave") {
    await api("/api/admin/save", {}, label);
  } else if (action === "adminBackup") {
    await api("/api/admin/backup", {}, label);
  } else if (action === "adminExport") {
    await api("/api/admin/export", null, label);
  } else if (action === "adminSeed") {
    await api("/api/admin/seed", {}, label);
  } else if (action === "adminReset") {
    await api("/api/admin/reset", { seed: false }, label);
  } else if (action === "systemStatus") {
    await api("/api/system/status", null, label);
  } else if (action === "apiContract") {
    await api("/api/openapi.json", null, label);
  }
}

async function runPlayerNext(label) {
  const pack = latestPack();
  const listing = latestListing();
  if (!pack) {
    await api("/api/player/packs/issue", { ownerId: "player_1" }, label);
    return;
  }
  if (pack.status === "OWNED" && pack.ownerId === "player_1") {
    if (activeOpenTradingSession()) {
      await api("/api/packs/list", { packId: pack.id, ownerId: "player_1", price: 101 }, label);
      return;
    }
    await api("/api/packs/open", { packId: pack.id, actorId: pack.ownerId }, label);
    return;
  }
  if (listing) {
    await api("/api/packs/buy", { listingId: listing.id, buyerId: "operator_1" }, label);
    return;
  }
  if (["OWNED", "COOLDOWN", "FORCE_OPEN_PENDING"].includes(pack.status)) {
    await api("/api/packs/open", { packId: pack.id, actorId: pack.ownerId }, label);
    return;
  }
  setMessage("目前玩家流程沒有可執行的下一步", "error");
  render();
}

async function runOperatorNext(label) {
  const settlement = latestSettlement();
  const withdrawal = latestWithdrawal();
  if (!settlement) {
    await api("/api/operator/settlements", { operatorId: "operator_1", amount: 5000 }, label);
    return;
  }
  if (!withdrawal) {
    await api("/api/operator/withdrawals", { operatorId: "operator_1", settlementId: settlement.id, amount: 3000 }, label);
    return;
  }
  const transitionByStatus = {
    PENDING_REVIEW: "APPROVE",
    APPROVED: "MARK_TAX_READY",
    TAX_READY: "SCHEDULE_PAYMENT",
    PAYMENT_SCHEDULED: "MARK_PAID",
    PAYMENT_FAILED: "RETRY_REVIEW",
  };
  const transition = transitionByStatus[withdrawal.status];
  if (!transition) {
    setMessage("目前撥款流程沒有可執行的下一步", "error");
    render();
    return;
  }
  await api("/api/operator/withdrawals/advance", { withdrawalId: withdrawal.id, transition }, label);
}

function setMessage(message, type = "ok") {
  lastMessage = message;
  lastMessageType = type;
}

function isActionEnabled(action) {
  const pack = latestPack();
  const listing = latestListing();
  const settlement = latestSettlement();
  const withdrawal = latestWithdrawal();
  const hasActiveWithdrawal = (latestState?.withdrawals ?? []).some(
    (item) =>
      item.settlementId === settlement?.id &&
      !["REJECTED", "CANCELLED", "PAID"].includes(item.status) &&
      !item.releasedAt,
  );
  const reservedSettlementAmount = (latestState?.withdrawals ?? [])
    .filter((item) => item.settlementId === settlement?.id && !item.releasedAt)
    .reduce((sum, item) => sum + item.amount, 0);
  const availableSettlementAmount = settlement
    ? settlement.approvedWithdrawableAmount - reservedSettlementAmount
    : 0;
  const ticketBook = latestState?.gameplay?.ticketBook;
  const campaign = latestCampaign();
  const review = latestReview();

  if (action === "playerNext") return true;
  if (action === "operatorNext") return true;
  if (["issue", "settlement", "forbidden", "ticketPurchase", "bossSettle", "guildScan", "rpgValidate"].includes(action)) return true;
  if (action === "list") return pack?.status === "OWNED" && pack.ownerId === "player_1";
  if (action === "buy") return Boolean(listing);
  if (action === "open") return Boolean(pack && ["OWNED", "COOLDOWN", "FORCE_OPEN_PENDING"].includes(pack.status));
  if (action === "freeze") return Boolean(pack && !["OPENED", "BURNED", "FROZEN"].includes(pack.status));
  if (action === "operationsHalt") return latestState?.operations?.mode !== "HALTED";
  if (action === "operationsResume") return latestState?.operations?.mode === "HALTED";
  if (action === "withdrawal") return Boolean(settlement?.status === "APPROVED" && !hasActiveWithdrawal && availableSettlementAmount > 0);
  if (action === "approveWithdrawal") return withdrawal?.status === "PENDING_REVIEW";
  if (action === "taxReady") return withdrawal?.status === "APPROVED";
  if (action === "schedulePayment") return withdrawal?.status === "TAX_READY";
  if (action === "markPaid") return withdrawal?.status === "PAYMENT_SCHEDULED";
  if (action === "rejectWithdrawal") return withdrawal?.status === "PENDING_REVIEW";
  if (action === "paymentFail") return withdrawal?.status === "PAYMENT_SCHEDULED";
  if (action === "retryWithdrawal") return withdrawal?.status === "PAYMENT_FAILED";
  if (action === "ticketReserve") return (ticketBook?.active ?? 0) > 0;
  if (action === "ticketConsume") return (ticketBook?.reserved ?? 0) > 0;
  if (action === "redemption") return (ticketBook?.consumed ?? 0) > 0;
  if (action === "economyCreate" || action === "forceOpenJob") return true;
  if (action === "economyApprove") return Boolean(latestDraftEconomyConfig());
  if (action === "economyActivate") return Boolean(latestApprovedEconomyConfig());
  if (action === "sessionCreate") return true;
  if (action === "sessionOpen") return latestTradingSession()?.status === "SCHEDULED";
  if (action === "sessionClose") return latestTradingSession()?.status === "OPEN";
  if (action === "campaignCreate" || action === "reviewCreate") return true;
  if (action === "campaignSubmit") return campaign?.status === "DRAFT";
  if (action === "campaignProductApprove") return campaign?.status === "PRODUCT_REVIEW";
  if (action === "campaignRiskApprove") return campaign?.status === "RISK_REVIEW";
  if (action === "campaignActivate") return campaign?.status === "SCHEDULED";
  if (action === "campaignRollback") return ["ACTIVE", "PAUSED"].includes(campaign?.status);
  if (action === "reviewSubmit") return review?.status === "DRAFT";
  if (action === "reviewOpinions") return review?.status === "IN_REVIEW";
  if (action === "reviewFinalize") return review?.status === "IN_REVIEW" && review.opinions?.length >= 6;
  if (action === "reviewAssert") return ["GO", "GO_WITH_CHANGES", "LIMITED_PILOT"].includes(review?.status);
  if (action === "reviewCircumvention") return Boolean(review);
  if (["adminSave", "adminBackup", "adminExport", "adminSeed", "adminReset", "systemStatus", "apiContract"].includes(action)) return true;
  return false;
}

function render(error) {
  if (!latestState) return;
  const boundaryCopy = document.querySelector("#boundaryCopy");
  if (boundaryCopy) boundaryCopy.textContent = latestState.boundaryCopy;
  renderActiveView();
  renderPlayerTabs();
  renderPlayerDashboard();
  renderFeed("#playerFeed", playerFeedItems());
  renderProgressList("#playerProgress", playerProgressItems());
  renderButtons();
  renderState(error);
}

function renderActivityFeeds() {
  renderFeed("#playerFeed", playerFeedItems());
  renderFeed("#operatorFeed", operatorFeedItems());
}

function renderFeed(selector, items) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = items.length
    ? items
        .slice(0, 6)
        .map(
          (item) => `
            <div class="feed-item">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.detail)}</strong>
            </div>
          `,
        )
        .join("")
    : `<div class="feed-item"><span>目前狀態</span><strong>尚無事件</strong></div>`;
}

function playerFeedItems() {
  const trades = [...(latestState.trades ?? [])].reverse().map((trade) => ({
    label: "交易完成",
    detail: `${trade.packId} / ${formatGc(trade.price)}`,
  }));
  const opens = [...(latestState.openLogs ?? [])].reverse().map((log) => ({
    label: "開包完成",
    detail: `${log.content.name} / ${log.content.rarity}`,
  }));
  const listings = [...(latestState.listings ?? [])].reverse().map((listing) => ({
    label: listing.status === "ACTIVE" ? "掛單中" : "掛單結束",
    detail: `${listing.packId} / ${formatGc(listing.price)}`,
  }));
  return [...opens, ...trades, ...listings];
}

function operatorFeedItems() {
  const withdrawals = [...(latestState.withdrawals ?? [])].reverse().map((withdrawal) => ({
    label: "撥款狀態",
    detail: `${withdrawal.id} / ${withdrawal.status} / ${formatTwd(withdrawal.amount)}`,
  }));
  const settlements = [...(latestState.settlements ?? [])].reverse().map((settlement) => ({
    label: "收入結算",
    detail: `${settlement.id} / 可撥 ${formatTwd(settlement.approvedWithdrawableAmount)}`,
  }));
  return [...withdrawals, ...settlements];
}

function renderProgressBands() {
  renderProgressList("#playerProgress", playerProgressItems());
  renderProgressList("#operatorProgress", operatorProgressItems());
  renderProgressList("#adminQueue", adminQueueItems());
}

function renderProgressList(selector, items) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = items
    .map(
      (item) => `
        <li class="progress-item ${item.status}">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.detail)}</strong>
        </li>
      `,
    )
    .join("");
}

function playerProgressItems() {
  const pack = latestPack();
  const listing = latestListing();
  const latestOpen = latestState.openLogs?.at(-1);
  return [
    {
      label: "取得禮包",
      detail: pack ? `${pack.id} / ${packStatusLabels[pack.status] ?? pack.status}` : "尚未取得",
      status: pack ? "done" : "current",
    },
    {
      label: "交易場",
      detail: listing ? `${listing.id} / ${formatGc(listing.price)}` : "目前沒有有效掛單",
      status: listing ? "current" : pack ? "pending" : "locked",
    },
    {
      label: "開包結果",
      detail: latestOpen ? `${latestOpen.content.name} / ${latestOpen.content.rarity}` : "尚未開包",
      status: latestOpen ? "done" : pack ? "pending" : "locked",
    },
  ];
}

function operatorProgressItems() {
  const settlement = latestSettlement();
  const withdrawal = latestWithdrawal();
  return [
    {
      label: "建立結算",
      detail: settlement ? `${settlement.id} / ${formatTwd(settlement.approvedWithdrawableAmount)}` : "尚未建立",
      status: settlement ? "done" : "current",
    },
    {
      label: "申請撥款",
      detail: withdrawal ? `${withdrawal.id} / ${formatTwd(withdrawal.amount)}` : "尚未申請",
      status: withdrawal ? "done" : settlement ? "current" : "locked",
    },
    {
      label: "完成付款",
      detail: withdrawal?.status ?? "等待前置流程",
      status: withdrawal?.status === "PAID" ? "done" : withdrawal ? "current" : "locked",
    },
  ];
}

function adminQueueItems() {
  const operations = latestState.operations ?? { mode: "ACTIVE", haltedScopes: [], incidents: [] };
  const openRiskCases = (latestState.riskCases ?? []).filter((riskCase) => riskCase.status === "OPEN");
  const pendingReviews = (latestState.regulatory?.reviews ?? []).filter((review) =>
    ["DRAFT", "IN_REVIEW"].includes(review.status),
  );
  const campaigns = latestState.liveOps?.campaigns ?? [];
  return [
    {
      label: "營運模式",
      detail: operations.mode === "HALTED" ? `暫停：${operations.haltedScopes.join(", ")}` : "正常營運",
      status: operations.mode === "HALTED" ? "current" : "done",
    },
    {
      label: "風控案件",
      detail: openRiskCases.length ? `${openRiskCases.length} 件待處理` : "無開啟中案件",
      status: openRiskCases.length ? "current" : "done",
    },
    {
      label: "活動與審查",
      detail: `${campaigns.length} 個活動 / ${pendingReviews.length} 件待審`,
      status: pendingReviews.length ? "current" : "pending",
    },
  ];
}

function renderAdminOverview() {
  const operations = latestState.operations ?? { mode: "ACTIVE", haltedScopes: [], incidents: [] };
  const openRiskCases = (latestState.riskCases ?? []).filter((riskCase) => riskCase.status === "OPEN");
  const campaigns = latestState.liveOps?.campaigns ?? [];
  const reviews = latestState.regulatory?.reviews ?? [];
  const systemStatus = latestState.systemStatus;

  document.querySelector("#adminOperationsCard").innerHTML = `
    <dl class="card-facts">
      <div><dt>營運模式</dt><dd>${escapeHtml(operations.mode)}</dd></div>
      <div><dt>暫停範圍</dt><dd>${escapeHtml(operations.haltedScopes.join(", ") || "-")}</dd></div>
      <div><dt>事故紀錄</dt><dd>${escapeHtml(String(operations.incidents.length))}</dd></div>
    </dl>
  `;

  document.querySelector("#adminRiskCard").innerHTML = `
    <dl class="card-facts">
      <div><dt>開啟中風控案</dt><dd>${escapeHtml(String(openRiskCases.length))}</dd></div>
      <div><dt>最高風險</dt><dd>${escapeHtml(highestSeverity(openRiskCases))}</dd></div>
      <div><dt>帳本檢查</dt><dd>${escapeHtml(systemStatus?.checks?.reconciliation ?? "-")}</dd></div>
    </dl>
  `;

  document.querySelector("#adminGovernanceCard").innerHTML = `
    <dl class="card-facts">
      <div><dt>活動數</dt><dd>${escapeHtml(String(campaigns.length))}</dd></div>
      <div><dt>審查案</dt><dd>${escapeHtml(String(reviews.length))}</dd></div>
      <div><dt>邊界檢查</dt><dd>${escapeHtml(systemStatus?.checks?.boundary ?? "-")}</dd></div>
    </dl>
  `;
}

function renderOperatorDashboard() {
  const settlement = latestSettlement();
  const withdrawal = latestWithdrawal();
  const settlementWithdrawals = (latestState.withdrawals ?? []).filter(
    (item) => item.settlementId === settlement?.id && !item.releasedAt,
  );
  const reservedAmount = settlementWithdrawals.reduce((sum, item) => sum + item.amount, 0);
  const availableAmount = settlement ? settlement.approvedWithdrawableAmount - reservedAmount : 0;

  document.querySelector("#operatorIncomeCard").innerHTML = settlement
    ? `
        <div class="money-token">${escapeHtml(formatTwd(settlement.approvedWithdrawableAmount))}</div>
        <dl class="card-facts">
          <div><dt>結算單</dt><dd>${escapeHtml(settlement.id)}</dd></div>
          <div><dt>總額</dt><dd>${escapeHtml(formatTwd(settlement.grossAmount ?? settlement.amount))}</dd></div>
          <div><dt>剩餘可撥</dt><dd>${escapeHtml(formatTwd(availableAmount))}</dd></div>
        </dl>
      `
    : `
        <div class="empty-state">
          <strong>尚未建立經營收入結算</strong>
          <span>先建立 OperatorSettlement，才會出現可撥款收入。</span>
        </div>
      `;

  document.querySelector("#operatorExcludedCard").innerHTML = settlement
    ? `
        <div class="money-token is-muted">${escapeHtml(formatTwd(settlement.excludedAmount ?? 0))}</div>
        <dl class="card-facts">
          <div><dt>排除理由</dt><dd>${escapeHtml((settlement.excludedReasons ?? []).join("、") || "無")}</dd></div>
          <div><dt>規則</dt><dd>遊戲資產、未核實調整與玩家交易價差不可撥款</dd></div>
        </dl>
      `
    : `
        <div class="empty-state">
          <strong>尚無排除金額</strong>
          <span>部分核准時必須留下排除原因。</span>
        </div>
      `;

  document.querySelector("#operatorPayoutCard").innerHTML = withdrawal
    ? `
        <div class="payout-status">${escapeHtml(withdrawal.status)}</div>
        <dl class="card-facts">
          <div><dt>撥款單</dt><dd>${escapeHtml(withdrawal.id)}</dd></div>
          <div><dt>申請金額</dt><dd>${escapeHtml(formatTwd(withdrawal.amount))}</dd></div>
          <div><dt>稅務 / 付款資料</dt><dd>${escapeHtml(withdrawal.taxStatus)} / ${escapeHtml(withdrawal.paymentStatus)}</dd></div>
        </dl>
      `
    : `
        <div class="empty-state">
          <strong>尚未申請撥款</strong>
          <span>撥款申請會檢查可撥額度、稅務狀態與付款資料。</span>
        </div>
      `;
}

function renderPlayerDashboard() {
  const pack = latestPack();
  const listing = latestListing();
  const latestOpen = latestState.openLogs?.at(-1);
  const activeSession = (latestState.tradingSessions ?? []).find(
    (session) => session.id === latestState.activeTradingSessionId,
  );
  renderCharacterStatus({ pack, listing, latestOpen, activeSession });

  document.querySelector("#playerPackCard").innerHTML = pack
    ? `
        <div class="big-token">${escapeHtml(packStatusLabels[pack.status] ?? pack.status)}</div>
        <dl class="card-facts">
          <div><dt>禮包編號</dt><dd>${escapeHtml(pack.id)}</dd></div>
          <div><dt>持有人</dt><dd>${escapeHtml(pack.ownerId)}</dd></div>
          <div><dt>目前價格</dt><dd>${escapeHtml(formatGc(pack.currentPrice))}</dd></div>
        </dl>
      `
    : `
        <div class="empty-state">
          <strong>背包還沒有測試禮包</strong>
          <span>先取得一個禮包，再測試交易或開包。</span>
        </div>
      `;

  document.querySelector("#playerMarketCard").innerHTML = `
    <dl class="card-facts">
      <div><dt>交易場</dt><dd>${escapeHtml(activeSession?.status ?? "-")}</dd></div>
      <div><dt>有效掛單</dt><dd>${listing ? escapeHtml(listing.id) : "-"}</dd></div>
      <div><dt>掛單價格</dt><dd>${listing ? escapeHtml(formatGc(listing.price)) : "-"}</dd></div>
    </dl>
    <p class="asset-note">交易得到的是遊戲資產流轉，不會產生玩家可提現收益。</p>
  `;

  document.querySelector("#playerRewardCard").innerHTML = latestOpen
    ? `
        <div class="reward-token">
          <strong>${escapeHtml(latestOpen.content.name)}</strong>
          <span>${escapeHtml(latestOpen.content.rarity)}</span>
        </div>
        <dl class="card-facts">
          <div><dt>來源禮包</dt><dd>${escapeHtml(latestOpen.packId)}</dd></div>
          <div><dt>內容版本</dt><dd>${escapeHtml(latestOpen.contentSnapshotVersion)}</dd></div>
        </dl>
      `
    : `
        <div class="empty-state">
          <strong>尚未開包</strong>
          <span>開包後會在這裡顯示遊戲內容結果。</span>
        </div>
      `;
}

function renderCharacterStatus({ pack, listing, latestOpen, activeSession }) {
  const characterFrame = document.querySelector("#characterFrame");
  const characterNameplate = document.querySelector("#characterNameplate");
  const statusTitle = document.querySelector("#characterStatusTitle");
  const statusText = document.querySelector("#characterStatusText");
  const statusFacts = document.querySelector("#characterStatusFacts");
  const hudPackStatus = document.querySelector("#hudPackStatus");
  const hudMarketStatus = document.querySelector("#hudMarketStatus");
  const hudOpenStatus = document.querySelector("#hudOpenStatus");
  if (!characterFrame || !characterNameplate || !statusTitle || !statusText || !statusFacts) return;

  const status = getCharacterStatus({ pack, listing, latestOpen, activeSession });
  characterFrame.dataset.avatarState = status.avatarState;
  characterNameplate.textContent = status.nameplate;
  statusTitle.textContent = status.title;
  statusText.textContent = status.text;
  statusFacts.innerHTML = status.facts
    .map(
      ([label, value]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>
      `,
    )
    .join("");
  if (hudPackStatus) hudPackStatus.textContent = pack ? (packStatusLabels[pack.status] ?? pack.status) : "尚未取得";
  if (hudMarketStatus) hudMarketStatus.textContent = listing ? `${formatGc(listing.price)}` : (activeSession?.status ?? "未開啟");
  if (hudOpenStatus) hudOpenStatus.textContent = latestOpen ? latestOpen.content.name : "尚未開包";
}

function getCharacterStatus({ pack, listing, latestOpen, activeSession }) {
  if (!pack) {
    return {
      avatarState: "idle",
      nameplate: "Lv.1 禮包冒險者",
      title: "待命中",
      text: "角色目前待命中，按下開始玩家流程後會取得第一個幸運禮包。",
      facts: [
        ["目前任務", "取得幸運禮包"],
        ["背包狀態", "空"],
        ["提現規則", "遊戲資產不可提現"],
      ],
    };
  }

  if (latestOpen) {
    return {
      avatarState: "opened",
      nameplate: "Lv.4 開包完成",
      title: "已取得開包內容",
      text: `最新開包結果是 ${latestOpen.content.name}，內容屬於遊戲進度，不會形成可提現餘額。`,
      facts: [
        ["目前任務", "查看開包結果"],
        ["開包內容", `${latestOpen.content.name} / ${latestOpen.content.rarity}`],
        ["提現規則", "開包內容不可提現"],
      ],
    };
  }

  if (listing) {
    return {
      avatarState: "market",
      nameplate: "Lv.3 交易場巡行",
      title: "交易場掛單中",
      text: `角色正在交易場等待掛單結果，目前掛單價格為 ${formatGc(listing.price)}。`,
      facts: [
        ["目前任務", "等待交易結果"],
        ["交易場", activeSession?.status ?? "未開啟"],
        ["掛單價格", formatGc(listing.price)],
      ],
    };
  }

  if (pack.status === "OWNED" && pack.ownerId === "player_1") {
    return {
      avatarState: activeOpenTradingSession() ? "market" : "ready",
      nameplate: "Lv.2 禮包持有者",
      title: activeOpenTradingSession() ? "可前往交易場" : "可開啟禮包",
      text: activeOpenTradingSession()
        ? "交易場已開啟，角色可以選擇上架禮包；交易價差仍屬遊戲紀錄，不可提現。"
        : "角色已持有禮包，可以直接開啟取得遊戲內容。",
      facts: [
        ["目前任務", activeOpenTradingSession() ? "上架交易" : "開啟禮包"],
        ["禮包狀態", packStatusLabels[pack.status] ?? pack.status],
        ["目前價格", formatGc(pack.currentPrice)],
      ],
    };
  }

  return {
    avatarState: "ready",
    nameplate: "Lv.2 狀態確認中",
    title: packStatusLabels[pack.status] ?? pack.status,
    text: "角色正在依照目前禮包狀態等待下一個可執行動作。",
    facts: [
      ["目前任務", getPlayerNextLabel()],
      ["禮包狀態", packStatusLabels[pack.status] ?? pack.status],
      ["交易次數", String(pack.tradeCount ?? 0)],
    ],
  };
}

function renderActiveView() {
  document.querySelectorAll("[data-view]").forEach((section) => {
    section.hidden = section.dataset.view !== activeView;
  });
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === activeView);
    button.setAttribute("aria-current", button.dataset.viewTarget === activeView ? "page" : "false");
  });
}

function renderPlayerTabs() {
  document.querySelectorAll("[data-player-panel]").forEach((section) => {
    const active = section.dataset.playerPanel === activePlayerTab;
    section.hidden = !active;
    section.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll("[data-player-tab]").forEach((button) => {
    const active = button.dataset.playerTab === activePlayerTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
    button.tabIndex = active ? 0 : -1;
  });
}

function renderOverview() {
  const latestWithdrawalStatus = latestWithdrawal()?.status ?? "尚未申請";
  const activeSession = (latestState.tradingSessions ?? []).find(
    (session) => session.id === latestState.activeTradingSessionId,
  );
  const rows = [
    ["禮包數", String(latestState.packs?.length ?? 0)],
    ["交易場", activeSession ? activeSession.status : "-"],
    ["營運模式", latestState.operations?.mode ?? "ACTIVE"],
    ["經營收入", formatTwd(latestState.balances?.operatorIncome ?? 0)],
    ["待撥款", formatTwd(latestState.balances?.operatorPayable ?? 0)],
    ["撥款狀態", latestWithdrawalStatus],
  ];
  document.querySelector("#overviewMetrics").innerHTML = rows.map(renderStat).join("");
}

function renderButtons() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.disabled = !isActionEnabled(button.dataset.action);
  });
  document.querySelectorAll('[data-action="playerNext"]').forEach((button) => {
    button.textContent = getPlayerNextLabel();
  });
  const operatorNext = document.querySelector('[data-action="operatorNext"]');
  if (operatorNext) operatorNext.textContent = getOperatorNextLabel();
}

function getPlayerNextLabel() {
  const pack = latestPack();
  const listing = latestListing();
  if (!pack) return "取得幸運禮包";
  if (pack.status === "OWNED" && pack.ownerId === "player_1") return activeOpenTradingSession() ? "上架交易" : "開啟禮包";
  if (listing) return "購買目前掛單";
  if (["OWNED", "COOLDOWN", "FORCE_OPEN_PENDING"].includes(pack.status)) return "開包取得內容";
  if (pack.status === "BURNED") return "已開包，取得新禮包";
  if (pack.status === "FROZEN") return "禮包已凍結";
  return "查看目前狀態";
}

function getOperatorNextLabel() {
  const settlement = latestSettlement();
  const withdrawal = latestWithdrawal();
  if (!settlement) return "建立經營收入結算";
  if (!withdrawal) return "申請撥款";
  const labelByStatus = {
    PENDING_REVIEW: "核准撥款",
    APPROVED: "標記稅務完成",
    TAX_READY: "排程付款",
    PAYMENT_SCHEDULED: "標記已付款",
    PAYMENT_FAILED: "退回重審",
    PAID: "撥款已完成",
    REJECTED: "撥款已拒絕",
  };
  return labelByStatus[withdrawal.status] ?? "查看撥款狀態";
}

function renderPackFlow() {
  const pack = latestPack();
  document.querySelector("#packFlow").innerHTML = packStatuses
    .map(
      (status) => `
        <li class="flow-step ${pack?.status === status ? "is-active" : ""}">
          <strong>${packStatusLabels[status] ?? status}</strong>
          <span>${pack?.status === status ? "目前" : status}</span>
        </li>
      `,
    )
    .join("");
}

function renderPackSummary() {
  const pack = latestPack();
  const listing = latestListing();
  const latestTrade = latestState.trades?.at(-1);
  const latestOpen = latestState.openLogs?.at(-1);
  const rows = [
    ["目前禮包", pack ? `${pack.id} / ${pack.status}` : "尚未發行"],
    ["擁有者", pack?.ownerId ?? "-"],
    ["目前掛單", listing ? `${listing.id} / ${formatGc(listing.price)}` : "-"],
    ["最新交易", latestTrade ? `${latestTrade.id} / ${formatGc(latestTrade.price)}` : "-"],
    ["開包結果", latestOpen ? `${latestOpen.content.name} / ${latestOpen.content.rarity}` : "-"],
    ["交易次數", String(pack?.tradeCount ?? 0)],
  ];
  document.querySelector("#packSummary").innerHTML = rows.map(renderStat).join("");
}

function renderRisk() {
  const cases = latestState.riskCases ?? [];
  const guildSignals = latestState.gameplay?.guildSignals ?? [];
  const operations = latestState.operations ?? { mode: "ACTIVE", haltedScopes: [], incidents: [] };
  const openCases = cases.filter((riskCase) => riskCase.status === "OPEN");
  document.querySelector("#riskMeter").innerHTML = [
    ["營運模式", operations.mode],
    ["暫停範圍", operations.haltedScopes.join(", ") || "-"],
    ["開啟中的風控案", String(openCases.length)],
    ["最高風險等級", highestSeverity(openCases)],
    ["公會濫用訊號", String(guildSignals.length)],
  ]
    .map(renderStat)
    .join("");

  const items = [
    ...cases.map((riskCase) => ({
      title: `${riskCase.id} / ${riskCase.targetType}`,
      detail: `${riskCase.severity} - ${riskCase.status}`,
      note: riskCase.reason ?? "-",
    })),
    ...guildSignals.map((signal) => ({
      title: signal.code,
      detail: `${signal.severity} - ${signal.action}`,
      note: signal.userId ?? "-",
    })),
    ...operations.incidents.map((incident) => ({
      title: `${incident.id} / ${incident.status}`,
      detail: incident.scopes.join(", "),
      note: incident.reason,
    })),
  ];

  document.querySelector("#riskCases").innerHTML = items.length
    ? items
        .slice(-5)
        .reverse()
        .map(
          (item) => `
            <div class="event-item">
              <span>${escapeHtml(item.title)}</span>
              <strong>${escapeHtml(item.detail)}</strong>
              <span>${escapeHtml(item.note)}</span>
            </div>
          `,
        )
        .join("")
    : `<div class="event-item"><span>RiskCase</span><strong>目前沒有開啟中的風控案</strong></div>`;
}

function renderSettlement() {
  const settlement = latestSettlement();
  const withdrawal = latestWithdrawal();
  const settlementWithdrawals = (latestState.withdrawals ?? []).filter(
    (item) => item.settlementId === settlement?.id && !item.releasedAt,
  );
  const reservedAmount = settlementWithdrawals.reduce((sum, item) => sum + item.amount, 0);
  const availableAmount = settlement ? settlement.approvedWithdrawableAmount - reservedAmount : 0;
  const rows = [
    ["最新結算", settlement ? `${settlement.id} / ${settlement.status}` : "尚未建立"],
    ["結算總額", settlement ? formatTwd(settlement.grossAmount ?? settlement.amount) : "-"],
    ["核准金額", settlement ? formatTwd(settlement.approvedWithdrawableAmount) : "-"],
    ["排除金額", settlement ? formatTwd(settlement.excludedAmount ?? 0) : "-"],
    ["剩餘可撥", settlement ? formatTwd(availableAmount) : "-"],
    ["稅務狀態", settlement?.taxStatus ?? "-"],
    ["付款資料", settlement?.paymentStatus ?? "-"],
    ["最新撥款", withdrawal ? `${withdrawal.id} / ${withdrawal.status}` : "-"],
    ["撥款金額", withdrawal ? formatTwd(withdrawal.amount) : "-"],
  ];
  document.querySelector("#settlementStatus").innerHTML = rows.map(renderStat).join("");
}

function renderGameplay() {
  const gameplay = latestState.gameplay ?? {};
  const ticketBook = gameplay.ticketBook ?? {};
  const latestBoss = gameplay.bossSettlements?.at(-1);
  const rows = [
    ["票券庫存", String(gameplay.ticketProduct?.availableInventory ?? 0)],
    ["可用票券", String(ticketBook.active ?? 0)],
    ["保留票券", String(ticketBook.reserved ?? 0)],
    ["已消耗票券", String(ticketBook.consumed ?? 0)],
    ["票券負債", String(ticketBook.liability ?? 0)],
    ["兌換單", String(gameplay.redemptions?.length ?? 0)],
    ["Boss 結算", latestBoss ? latestBoss.id : "-"],
    ["RPG 職業", String(gameplay.rpgClasses?.length ?? 0)],
  ];
  document.querySelector("#gameplaySummary").innerHTML = rows.map(renderStat).join("");
}

function renderEconomy() {
  const economy = latestState.economy ?? {};
  const active = economy.configs?.find((config) => config.id === economy.activeConfigId);
  const latestJob = economy.forceOpenJobs?.at(-1);
  const rows = [
    ["Active config", active ? `${active.id} / ${active.status}` : "-"],
    ["設定版本數", String(economy.configs?.length ?? 0)],
    ["價格成長上限", active ? String(active.maxGrowthRate) : "-"],
    ["強制交易次數", active ? String(active.maxTradeCount) : "-"],
    ["Force-open jobs", String(economy.forceOpenJobs?.length ?? 0)],
    ["最新開包", latestJob ? latestJob.openedPackIds.join(", ") || "-" : "-"],
    ["最新跳過", latestJob ? latestJob.skippedPackIds.join(", ") || "-" : "-"],
  ];
  document.querySelector("#economySummary").innerHTML = rows.map(renderStat).join("");
}

function renderTradingSession() {
  const sessions = latestState.tradingSessions ?? [];
  const active = sessions.find((session) => session.id === latestState.activeTradingSessionId);
  const latest = latestTradingSession();
  const rows = [
    ["Active session", active ? `${active.id} / ${active.status}` : "-"],
    ["最新 Session", latest ? `${latest.id} / ${latest.status}` : "-"],
    ["Session 數", String(sessions.length)],
    ["狀態紀錄", String(latest?.statusLog?.length ?? 0)],
  ];
  document.querySelector("#sessionSummary").innerHTML = rows.map(renderStat).join("");
}

function renderBalances() {
  document.querySelector("#balances").innerHTML = Object.entries(latestState.balances ?? {})
    .map(([key, value]) => {
      const formatted = key.toLowerCase().includes("gc") ? formatGc(value) : formatTwd(value);
      return `<div><dt>${escapeHtml(balanceLabels[key] ?? key)}</dt><dd>${escapeHtml(formatted)}</dd></div>`;
    })
    .join("");
}

function renderLedgerSummary() {
  const rows = [
    ["禮包", latestState.packs?.length ?? 0],
    ["掛單", latestState.listings?.length ?? 0],
    ["交易", latestState.trades?.length ?? 0],
    ["開包紀錄", latestState.openLogs?.length ?? 0],
    ["結算", latestState.settlements?.length ?? 0],
    ["撥款申請", latestState.withdrawals?.length ?? 0],
  ];
  document.querySelector("#ledgerSummary").innerHTML = rows
    .map(([label, value]) => `<div class="ledger-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join("");
}

function renderLiveOps() {
  const campaign = latestCampaign();
  const rows = [
    ["最新活動", campaign ? `${campaign.id} / ${campaign.status}` : "尚未建立"],
    ["活動文案", campaign?.rewardCopy ?? "-"],
    ["產品審批", hasApproval(campaign, "PRODUCT") ? "已完成" : "未完成"],
    ["風控審批", hasApproval(campaign, "RISK") ? "已完成" : "未完成"],
    ["狀態紀錄", String(campaign?.statusLog?.length ?? 0)],
  ];
  document.querySelector("#liveOpsSummary").innerHTML = rows.map(renderStat).join("");
}

function renderRegulatory() {
  const review = latestReview();
  const rows = [
    ["最新審查", review ? `${review.id} / ${review.status}` : "尚未建立"],
    ["功能名稱", review?.featureName ?? "-"],
    ["書面意見", `${review?.opinions?.length ?? 0} / 6`],
    ["防繞過檢查", review?.noGoChecks?.at(-1)?.status ?? "-"],
    ["司法轄區", review?.jurisdictions?.join(", ") ?? "-"],
  ];
  document.querySelector("#regulatorySummary").innerHTML = rows.map(renderStat).join("");
}

function renderAdmin() {
  const rows = [
    ["資料模式", "本地 JSON snapshot"],
    ["禮包數", String(latestState.packs?.length ?? 0)],
    ["Audit logs", String(latestState.auditLogs?.length ?? 0)],
    ["LiveOps 活動", String(latestState.liveOps?.campaigns?.length ?? 0)],
    ["審查案", String(latestState.regulatory?.reviews?.length ?? 0)],
    ["最近匯出", latestState.adminExport?.exportedAt ?? "-"],
  ];
  document.querySelector("#adminSummary").innerHTML = rows.map(renderStat).join("");
}

function renderSystem() {
  const rows = [
    ["App 版本", latestState.systemStatus?.appVersion ?? "-"],
    ["Schema 版本", String(latestState.systemStatus?.storeSchemaVersion ?? "-")],
    ["Migration 數", String(latestState.systemStatus?.migrations?.length ?? 0)],
    ["API routes", String(latestState.apiContract?.routes?.length ?? 0)],
    ["邊界規則", latestState.apiContract?.productBoundary ?? "遊戲資產不可提現"],
  ];
  document.querySelector("#systemSummary").innerHTML = rows.map(renderStat).join("");
}

function renderState(error) {
  const toast = document.querySelector("#actionToast");
  toast.textContent = error ? `操作失敗：${error}` : lastMessage;
  toast.classList.toggle("is-error", Boolean(error) || lastMessageType === "error");

  const output = {
    error: error ?? null,
    demoRole: selectedDemoRole(),
    packs: latestState.packs,
    listings: latestState.listings,
    trades: latestState.trades,
    openLogs: latestState.openLogs,
    settlements: latestState.settlements,
    withdrawals: latestState.withdrawals,
    balances: latestState.balances,
    riskCases: latestState.riskCases,
    operations: latestState.operations,
    gameplay: latestState.gameplay,
    economy: latestState.economy,
    tradingSessions: latestState.tradingSessions,
    activeTradingSessionId: latestState.activeTradingSessionId,
    liveOps: latestState.liveOps,
    regulatory: latestState.regulatory,
    systemStatus: latestState.systemStatus,
    apiContract: latestState.apiContract,
    auditLogs: latestState.auditLogs,
  };
  const stateOutput = document.querySelector("#stateOutput");
  if (stateOutput) stateOutput.textContent = JSON.stringify(output, null, 2);
}

function hasApproval(campaign, type) {
  return Boolean(campaign?.approvals?.some((approval) => approval.type === type));
}

function renderStat([label, value]) {
  return `<div class="stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function highestSeverity(cases) {
  const rank = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  return cases.reduce(
    (highest, riskCase) => (rank.indexOf(riskCase.severity) > rank.indexOf(highest) ? riskCase.severity : highest),
    "LOW",
  );
}

function formatGc(value) {
  return `${Number(value ?? 0).toLocaleString("zh-TW")} GC`;
}

function formatTwd(value) {
  return `TWD ${Number(value ?? 0).toLocaleString("zh-TW")}`;
}

function selectedDemoRole() {
  return document.querySelector("#demoRole")?.value ?? "ADMIN";
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => runAction(button.dataset.action));
});

document.querySelectorAll("[data-view-target]").forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.viewTarget;
    window.location.hash = activeView;
    render();
  });
});

document.querySelectorAll("[data-player-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    activePlayerTab = button.dataset.playerTab;
    render();
  });
  button.addEventListener("keydown", (event) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const tabs = Array.from(document.querySelectorAll("[data-player-tab]"));
    const currentIndex = tabs.indexOf(button);
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    event.preventDefault();
    activePlayerTab = tabs[nextIndex].dataset.playerTab;
    render();
    tabs[nextIndex].focus();
  });
});

document.querySelector("#demoRole").addEventListener("change", () => {
  setMessage("狀態已更新");
  render();
});

const initialHash = window.location.hash.replace("#", "");
if (["player"].includes(initialHash)) {
  activeView = initialHash;
}

api("/api/state");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {
    setMessage("PWA 快取註冊失敗，但核心功能仍可使用", "error");
  });
}
