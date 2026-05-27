import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/server.js";

function listen(server) {
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server.address().port)));
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

test("privileged POST routes reject insufficient demo role", async () => {
  const server = createServer();
  const port = await listen(server);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/operator/settlements`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-demo-role": "PLAYER" },
      body: JSON.stringify({ operatorId: "operator_1", amount: 5000 }),
    });
    const payload = await response.json();
    assert.equal(payload.ok, false);
    assert.match(payload.error, /Unauthorized/);
  } finally {
    await close(server);
  }
});

test("admin demo role can use privileged route", async () => {
  const server = createServer();
  const port = await listen(server);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/operator/settlements`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-demo-role": "ADMIN" },
      body: JSON.stringify({ operatorId: "operator_1", amount: 5000 }),
    });
    const payload = await response.json();
    assert.equal(payload.ok, true);
  } finally {
    await close(server);
  }
});

test("privileged GET reports reject insufficient demo role", async () => {
  const server = createServer();
  const port = await listen(server);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/admin/export`, {
      headers: { "x-demo-role": "PLAYER" },
    });
    const payload = await response.json();
    assert.equal(payload.ok, false);
    assert.match(payload.error, /Unauthorized/);
  } finally {
    await close(server);
  }
});

test("admin demo role can read privileged GET reports", async () => {
  const server = createServer();
  const port = await listen(server);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/admin/export`, {
      headers: { "x-demo-role": "ADMIN" },
    });
    const payload = await response.json();
    assert.equal(payload.reconciliation.status, "PASS");
    assert.equal(payload.boundary.withdrawableSource, "OperatorSettlement");
  } finally {
    await close(server);
  }
});

test("production mode rejects demo role and accepts admin token", async () => {
  const previousAllowDemoRole = process.env.ALLOW_DEMO_ROLE;
  const previousAdminToken = process.env.ADMIN_TOKEN;
  process.env.ALLOW_DEMO_ROLE = "false";
  process.env.ADMIN_TOKEN = "test-admin-token";
  const server = createServer();
  const port = await listen(server);
  try {
    const demoResponse = await fetch(`http://127.0.0.1:${port}/api/admin/export`, {
      headers: { "x-demo-role": "ADMIN" },
    });
    const demoPayload = await demoResponse.json();
    assert.equal(demoPayload.ok, false);
    assert.match(demoPayload.error, /Unauthorized/);

    const tokenResponse = await fetch(`http://127.0.0.1:${port}/api/admin/export`, {
      headers: { "x-admin-token": "test-admin-token" },
    });
    const tokenPayload = await tokenResponse.json();
    assert.equal(tokenPayload.reconciliation.status, "PASS");
  } finally {
    await close(server);
    restoreEnv("ALLOW_DEMO_ROLE", previousAllowDemoRole);
    restoreEnv("ADMIN_TOKEN", previousAdminToken);
  }
});

test("public player start route issues a non-withdrawable pack without admin role", async () => {
  const previousAllowDemoRole = process.env.ALLOW_DEMO_ROLE;
  process.env.ALLOW_DEMO_ROLE = "false";
  const server = createServer();
  const port = await listen(server);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/player/packs/issue`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ownerId: "player_1" }),
    });
    const payload = await response.json();
    assert.equal(payload.ok, true);
    assert.equal(payload.result.ownerId, "player_1");
    assert.match(payload.state.boundaryCopy, /遊戲資產不可提現/);
  } finally {
    await close(server);
    restoreEnv("ALLOW_DEMO_ROLE", previousAllowDemoRole);
  }
});

test("public player state exposes only player-safe gameplay data", async () => {
  const previousAllowDemoRole = process.env.ALLOW_DEMO_ROLE;
  process.env.ALLOW_DEMO_ROLE = "false";
  const server = createServer();
  const port = await listen(server);
  try {
    const paymentResponse = await fetch(`http://127.0.0.1:${port}/api/player/simulate-payment`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ownerId: "player_1", amount: 120, idempotencyKey: "test-sim-payment" }),
    });
    const paymentPayload = await paymentResponse.json();
    assert.equal(paymentPayload.ok, true);
    assert.equal(paymentPayload.result.payment.status, "SIMULATED_APPROVED");

    const response = await fetch(`http://127.0.0.1:${port}/api/player/state`);
    const payload = await response.json();
    assert.equal(payload.player.id, "player_1");
    assert.equal(payload.character.equipment.weapon.name, "青銅長劍");
    assert.equal(payload.inventory.some((item) => item.id === "star_charm"), true);
    assert.equal(payload.skills.some((skill) => skill.id === "power_slash"), true);
    assert.equal(payload.combat.mode, "AUTO_BATTLE");
    assert.equal(payload.balances.gc, 1000);
    assert.ok(payload.packs.length >= 1);
    assert.equal(payload.simulatedPayments[0].status, "SIMULATED_APPROVED");
    assert.equal("withdrawals" in payload, false);
    assert.equal("settlements" in payload, false);
  } finally {
    await close(server);
    restoreEnv("ALLOW_DEMO_ROLE", previousAllowDemoRole);
  }
});

test("public player action updates persistent RPG state without exposing withdrawal data", async () => {
  const previousAllowDemoRole = process.env.ALLOW_DEMO_ROLE;
  process.env.ALLOW_DEMO_ROLE = "false";
  const server = createServer();
  const port = await listen(server);
  try {
    const actionResponse = await fetch(`http://127.0.0.1:${port}/api/player/action`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ownerId: "player_1", action: "patrol" }),
    });
    const actionPayload = await actionResponse.json();
    assert.equal(actionPayload.ok, true);
    assert.equal(actionPayload.result.action, "patrol");
    assert.equal(actionPayload.result.profile.balances.gc, 1018);
    assert.ok(actionPayload.result.profile.combat.target.hp < 110);

    const stateResponse = await fetch(`http://127.0.0.1:${port}/api/player/state`);
    const statePayload = await stateResponse.json();
    assert.equal(statePayload.balances.gc, 1018);
    assert.equal(statePayload.player.partyPower, 2168);
    assert.equal("withdrawals" in statePayload, false);
  } finally {
    await close(server);
    restoreEnv("ALLOW_DEMO_ROLE", previousAllowDemoRole);
  }
});

function restoreEnv(key, value) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
