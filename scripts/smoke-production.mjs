import { createServer } from "../src/server.js";
import { readFile } from "node:fs/promises";

const previousAllowDemoRole = process.env.ALLOW_DEMO_ROLE;
const previousAdminToken = process.env.ADMIN_TOKEN;
const [startProductionScript, startProductionMjs, railwayConfig] = await Promise.all([
  readFile("scripts/start-production.ps1", "utf8"),
  readFile("scripts/start-production.mjs", "utf8"),
  readFile("railway.json", "utf8"),
]);
assert(startProductionScript.includes("ADMIN_TOKEN is required"), "production start script must require ADMIN_TOKEN");
assert(startProductionScript.includes('ALLOW_DEMO_ROLE = "false"'), "production start script must disable demo role");
assert(startProductionMjs.includes("ADMIN_TOKEN is required"), "cloud production start script must require ADMIN_TOKEN");
assert(startProductionMjs.includes('process.env.ALLOW_DEMO_ROLE = "false"'), "cloud production start script must disable demo role");
assert(startProductionMjs.includes('"0.0.0.0"'), "cloud production start script must bind externally");
assert(railwayConfig.includes("node scripts/start-production.mjs"), "Railway config must use production Node start script");
process.env.ALLOW_DEMO_ROLE = "false";
process.env.ADMIN_TOKEN = "production-smoke-token";

const server = createServer();
const port = 3300;
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

function restoreEnv(key, value) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await listen();

try {
  const home = await fetch(`${baseUrl}/`).then((response) => response.text());
  assert(home.includes("幸運禮包世界"), "production homepage missing product name");
  assert(!home.includes("Demo Role"), "production homepage exposes demo role");
  assert(!home.includes("MVP"), "production homepage exposes internal MVP wording");

  const publicPack = await fetch(`${baseUrl}/api/player/packs/issue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ownerId: "player_1" }),
  }).then((response) => response.json());
  assert(publicPack.ok === true, "public player route should work without admin token");

  const demoAdmin = await fetch(`${baseUrl}/api/admin/export`, {
    headers: { "x-demo-role": "ADMIN" },
  }).then((response) => response.json());
  assert(demoAdmin.ok === false, "production must reject demo role");

  const tokenAdmin = await fetch(`${baseUrl}/api/admin/export`, {
    headers: { "x-admin-token": "production-smoke-token" },
  }).then((response) => response.json());
  assert(tokenAdmin.reconciliation.status === "PASS", "production admin token should access export");
  assert(tokenAdmin.readiness.status === "PUBLIC_BETA_READY", "production readiness should be public beta ready");

  console.log("Production smoke passed");
} finally {
  await close();
  restoreEnv("ALLOW_DEMO_ROLE", previousAllowDemoRole);
  restoreEnv("ADMIN_TOKEN", previousAdminToken);
}
