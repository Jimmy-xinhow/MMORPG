import { API_CONTRACT } from "../src/api-contract.js";

const failures = [];
const seen = new Set();

for (const route of API_CONTRACT) {
  const key = `${route.method} ${route.path}`;
  if (seen.has(key)) {
    failures.push(`Duplicate route: ${key}`);
  }
  seen.add(key);

  for (const field of ["method", "path", "role", "description", "riskLevel"]) {
    if (!route[field]) {
      failures.push(`${key}: missing ${field}`);
    }
  }

  if (route.path.includes("withdrawal") && route.path !== "/api/forbidden/gameplay-withdrawal") {
    if (!["HIGH"].includes(route.riskLevel)) {
      failures.push(`${key}: withdrawal routes must be HIGH risk`);
    }
  }
}

const requiredRoutes = [
  "GET /api/system/status",
  "GET /api/launch-readiness",
  "GET /api/player/state",
  "POST /api/player/action",
  "POST /api/player/simulate-payment",
  "GET /api/admin/export",
  "POST /api/player/packs/issue",
  "POST /api/operator/withdrawals/advance",
  "POST /api/regulatory/reviews/finalize",
  "POST /api/admin/backup",
  "POST /api/economy/configs/activate",
  "POST /api/jobs/force-open",
  "POST /api/trading-sessions/advance",
];

for (const key of requiredRoutes) {
  if (!seen.has(key)) {
    failures.push(`Missing required contract route: ${key}`);
  }
}

if (failures.length > 0) {
  console.error("API contract validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`API contract validation passed for ${API_CONTRACT.length} routes.`);
