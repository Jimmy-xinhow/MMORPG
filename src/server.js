import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { GameService } from "./domain/services.js";
import { backupStore, loadStore, resetStore, saveStore, seedDemoData } from "./storage.js";
import { apiContractDocument } from "./api-contract.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const dataFile = process.env.DATA_FILE ?? null;
let store = loadStore(dataFile);
let service = new GameService(store);
const rateLimitBuckets = new Map();

function baseHeaders(extra = {}) {
  return {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; manifest-src 'self'",
    ...extra,
  };
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    ...baseHeaders({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    }),
  });
  res.end(body);
}

function enforceRateLimit(req) {
  if (req.method !== "POST") return;
  const key = `${req.socket.remoteAddress ?? "local"}:${new URL(req.url, "http://localhost").pathname}`;
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key) ?? { windowStart: now, count: 0 };
  if (now - bucket.windowStart > 60_000) {
    bucket.windowStart = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);
  if (bucket.count > 120) {
    throw new Error("Rate limit exceeded");
  }
}

const roleRules = [
  ["GET", /^\/api\/reports\/reconciliation$/, ["ADMIN"]],
  ["GET", /^\/api\/reports\/boundary$/, ["ADMIN"]],
  ["GET", /^\/api\/reports\/audit$/, ["ADMIN"]],
  ["GET", /^\/api\/admin\/export$/, ["ADMIN"]],
  ["POST", /^\/api\/admin\//, ["ADMIN"]],
  ["POST", /^\/api\/packs\/issue$/, ["ADMIN"]],
  ["POST", /^\/api\/packs\/freeze$/, ["RISK", "ADMIN"]],
  ["POST", /^\/api\/trading-sessions/, ["ADMIN"]],
  ["POST", /^\/api\/operator\/settlements$/, ["FINANCE", "ADMIN"]],
  ["POST", /^\/api\/operator\/withdrawals$/, ["OPERATOR", "FINANCE", "ADMIN"]],
  ["POST", /^\/api\/operator\/withdrawals\/advance$/, ["FINANCE", "ADMIN"]],
  ["POST", /^\/api\/economy\//, ["ADMIN"]],
  ["POST", /^\/api\/jobs\/force-open$/, ["ADMIN"]],
  ["POST", /^\/api\/boss\/settle$/, ["ADMIN"]],
  ["POST", /^\/api\/rpg\/validate$/, ["ADMIN"]],
  ["POST", /^\/api\/liveops\//, ["LIVEOPS", "ADMIN"]],
  ["POST", /^\/api\/regulatory\//, ["PRODUCT", "LEGAL", "ADMIN"]],
  ["POST", /^\/api\/guild\/scan$/, ["RISK", "ADMIN"]],
  ["POST", /^\/api\/operations\//, ["RISK", "ADMIN"]],
];

function enforceAuthorization(req, pathname) {
  const rule = roleRules.find(([method, pattern]) => method === req.method && pattern.test(pathname));
  if (!rule) return;

  const [, , allowedRoles] = rule;
  const role = resolveRequestRole(req);
  if (role === "ADMIN" || allowedRoles.includes(role)) {
    return;
  }

  throw new Error(`Unauthorized: ${allowedRoles.join(" or ")} role required`);
}

function resolveRequestRole(req) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && req.headers["x-admin-token"] === adminToken) {
    return "ADMIN";
  }

  const demoRolesAllowed = process.env.ALLOW_DEMO_ROLE !== "false" && process.env.NODE_ENV !== "production";
  if (demoRolesAllowed) {
    return req.headers["x-demo-role"];
  }

  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  const filePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const resolved = path.normalize(path.join(publicDir, filePath));
  if (!resolved.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(resolved);
  const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
  };
  const contentType = contentTypes[ext] ?? "text/html; charset=utf-8";
  res.writeHead(200, baseHeaders({ "content-type": contentType, "cache-control": "no-store" }));
  fs.createReadStream(resolved).pipe(res);
}

async function route(req, res) {
  const url = new URL(req.url, "http://localhost");
  if (!url.pathname.startsWith("/api/")) {
    serveStatic(req, res);
    return;
  }

  try {
    enforceRateLimit(req);
    enforceAuthorization(req, url.pathname);
    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/system/status") {
      sendJson(res, 200, service.systemStatus());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/openapi.json") {
      sendJson(res, 200, apiContractDocument());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/state") {
      sendJson(res, 200, service.snapshot());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/player/state") {
      sendJson(res, 200, service.playerState({ ownerId: url.searchParams.get("ownerId") ?? "player_1" }));
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/launch-readiness") {
      sendJson(res, 200, service.launchReadinessReport());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/reports/reconciliation") {
      sendJson(res, 200, service.reconcileLedger());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/reports/boundary") {
      sendJson(res, 200, service.boundaryReport());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/reports/audit") {
      sendJson(res, 200, service.auditReport());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/admin/export") {
      sendJson(res, 200, service.exportSystemSnapshot());
      return;
    }

    const body = await readBody(req);
    let result;
    if (req.method === "POST" && url.pathname === "/api/player/action") {
      result = service.runPlayerAction(body);
    } else if (req.method === "POST" && url.pathname === "/api/player/simulate-payment") {
      result = service.simulatePlayerPayment(body);
    } else if (req.method === "POST" && url.pathname === "/api/player/packs/issue") {
      result = service.issuePack({ ownerId: body.ownerId ?? "player_1" });
    } else if (req.method === "POST" && url.pathname === "/api/packs/issue") {
      result = service.issuePack(body);
    } else if (req.method === "POST" && url.pathname === "/api/packs/list") {
      result = service.listPack(body);
    } else if (req.method === "POST" && url.pathname === "/api/packs/buy") {
      result = service.buyPack(body);
    } else if (req.method === "POST" && url.pathname === "/api/packs/open") {
      result = service.openPack(body);
    } else if (req.method === "POST" && url.pathname === "/api/packs/freeze") {
      result = service.freezePack(body);
    } else if (req.method === "POST" && url.pathname === "/api/trading-sessions") {
      result = service.createTradingSession(body);
    } else if (req.method === "POST" && url.pathname === "/api/trading-sessions/advance") {
      result = service.advanceTradingSession(body);
    } else if (req.method === "POST" && url.pathname === "/api/operator/settlements") {
      result = service.createOperatorSettlement(body);
    } else if (req.method === "POST" && url.pathname === "/api/operator/withdrawals") {
      result = service.requestWithdrawal(body);
    } else if (req.method === "POST" && url.pathname === "/api/operator/withdrawals/advance") {
      result = service.advanceWithdrawal(body);
    } else if (req.method === "POST" && url.pathname === "/api/forbidden/gameplay-withdrawal") {
      result = service.requestGameplayWithdrawal();
    } else if (req.method === "POST" && url.pathname === "/api/tickets/purchase") {
      result = service.purchaseTicket(body);
    } else if (req.method === "POST" && url.pathname === "/api/tickets/reserve") {
      result = service.reserveTicket(body);
    } else if (req.method === "POST" && url.pathname === "/api/tickets/consume") {
      result = service.consumeTicket(body);
    } else if (req.method === "POST" && url.pathname === "/api/redemptions/submit") {
      result = service.submitRedemption(body);
    } else if (req.method === "POST" && url.pathname === "/api/boss/settle") {
      result = service.settleBoss(body);
    } else if (req.method === "POST" && url.pathname === "/api/guild/scan") {
      result = service.scanGuildAbuse(body);
    } else if (req.method === "POST" && url.pathname === "/api/operations/halt") {
      result = service.haltOperations(body);
    } else if (req.method === "POST" && url.pathname === "/api/operations/resume") {
      result = service.resumeOperations(body);
    } else if (req.method === "POST" && url.pathname === "/api/rpg/validate") {
      result = service.validateRpg(body);
    } else if (req.method === "POST" && url.pathname === "/api/economy/configs") {
      result = service.createEconomyConfig(body);
    } else if (req.method === "POST" && url.pathname === "/api/economy/configs/approve") {
      result = service.approveEconomyConfig(body);
    } else if (req.method === "POST" && url.pathname === "/api/economy/configs/activate") {
      result = service.activateEconomyConfig(body);
    } else if (req.method === "POST" && url.pathname === "/api/jobs/force-open") {
      result = service.runForceOpenJob(body);
    } else if (req.method === "POST" && url.pathname === "/api/liveops/campaigns") {
      result = service.createCampaign(body);
    } else if (req.method === "POST" && url.pathname === "/api/liveops/campaigns/advance") {
      result = service.advanceCampaign(body);
    } else if (req.method === "POST" && url.pathname === "/api/regulatory/reviews") {
      result = service.createRegulatoryReview(body);
    } else if (req.method === "POST" && url.pathname === "/api/regulatory/reviews/submit") {
      result = service.submitRegulatoryReview(body);
    } else if (req.method === "POST" && url.pathname === "/api/regulatory/reviews/opinion") {
      result = service.recordRegulatoryOpinion(body);
    } else if (req.method === "POST" && url.pathname === "/api/regulatory/reviews/finalize") {
      result = service.finalizeRegulatoryReview(body);
    } else if (req.method === "POST" && url.pathname === "/api/regulatory/reviews/circumvention-check") {
      result = service.checkRegulatoryCircumvention(body);
    } else if (req.method === "POST" && url.pathname === "/api/regulatory/reviews/assert-allowed") {
      result = service.assertRegulatoryImplementationAllowed(body);
    } else if (req.method === "POST" && url.pathname === "/api/admin/save") {
      result = { saved: true, dataFile };
    } else if (req.method === "POST" && url.pathname === "/api/admin/backup") {
      result = { backupFile: backupStore(store, dataFile) };
    } else if (req.method === "POST" && url.pathname === "/api/admin/reset") {
      store = resetStore(dataFile, { seed: body.seed === true });
      service = new GameService(store);
      result = { reset: true, seeded: body.seed === true };
    } else if (req.method === "POST" && url.pathname === "/api/admin/seed") {
      seedDemoData(store);
      result = { seeded: true };
    } else {
      sendJson(res, 404, { error: "Route not found" });
      return;
    }

    saveStore(store, dataFile);
    sendJson(res, 200, { ok: true, result, state: service.snapshot() });
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message, state: service.snapshot() });
  }
}

export function createServer() {
  return http.createServer((req, res) => {
    route(req, res).catch((error) => sendJson(res, 500, { ok: false, error: error.message }));
  });
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMainModule && process.env.NO_SERVER_LISTEN !== "1") {
  const port = Number(process.env.PORT ?? 3000);
  createServer().listen(port, "127.0.0.1");
}
