import { createServer } from "../src/server.js";

if (!process.env.ADMIN_TOKEN || process.env.ADMIN_TOKEN.trim() === "") {
  throw new Error("ADMIN_TOKEN is required for production mode.");
}

process.env.ALLOW_DEMO_ROLE = "false";
process.env.DATA_FILE ??= "data/production-store.json";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

createServer().listen(port, host, () => {
  console.log(`Lucky Pack MMORPG API listening on ${host}:${port}`);
});
