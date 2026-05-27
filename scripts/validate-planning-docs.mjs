import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const planningDir = path.join(root, "docs", "planning");

const docs = [
  {
    file: "01-product-boundary.md",
    required: [
      "Non-Withdrawable Content",
      "Withdrawable Operating Income",
      "System-Level Conversion Matrix",
      "Withdrawal State Machine",
      "Acceptance Tests",
    ],
  },
  {
    file: "02-pack-state-machine.md",
    required: [
      "Pack States",
      "Transition Enum Contract",
      "Database Locking and Constraints",
      "Force-Open Rules",
      "Required Test Cases",
    ],
  },
  {
    file: "03-ledger-invariants.md",
    required: [
      "Account Dimensions",
      "Journal Model",
      "Database Enforcement",
      "Reconciliation Algorithm",
      "Required Test Cases",
    ],
  },
  {
    file: "04-economy-config.md",
    required: [
      "Effective Version Rules",
      "Content Generation Algorithm",
      "Ticket Budget Lifecycle",
      "Operator Income Parameters",
      "Required Test Cases",
    ],
  },
  {
    file: "05-mvp-scope.md",
    required: [
      "MVP Phases",
      "Required Schema Constraints",
      "API Contracts",
      "Release Gates",
    ],
  },
  {
    file: "06-risk-control.md",
    required: [
      "Risk Severity",
      "Default Rules",
      "Freeze Semantics",
      "Privacy and Security Controls",
      "Regression Dataset",
    ],
  },
  {
    file: "07-post-mvp-roadmap.md",
    required: [
      "Phase Dependency Graph",
      "No Cross-Stage Rule",
      "Phase Gates",
      "Redline Examples",
      "Cross-Phase Acceptance Standards",
    ],
  },
  {
    file: "08-phase7-beta-economy-calibration.md",
    required: [
      "Beta Cohorts",
      "Metrics and Formulas",
      "Pause Gates",
      "Exit Gate",
      "Required Tests",
    ],
  },
  {
    file: "09-phase8-boss-guild-ticket-shop.md",
    required: [
      "Boss Reward Formula",
      "Guild Abuse Model",
      "Ticket Shop Rules",
      "Redemption State Machine",
      "Required Tests",
    ],
  },
  {
    file: "10-phase9-operator-income-pilot.md",
    required: [
      "KPI Calculation",
      "Settlement Failure Branches",
      "Mobile Operator Center IA",
      "Exit Gate",
      "Required Tests",
    ],
  },
  {
    file: "11-phase10-season-liveops.md",
    required: [
      "LiveOps Workflow",
      "Permissions",
      "Season Settlement Lock",
      "Leaderboard UI QA",
      "Required Tests",
    ],
  },
  {
    file: "12-phase11-rpg-content-expansion.md",
    required: [
      "Minimum First Release Scope",
      "Skill Cost Curve",
      "Content Flags",
      "Reward Impact Controls",
      "Required Tests",
    ],
  },
  {
    file: "13-phase12-mobile-app-readiness.md",
    required: [
      "Viewport Matrix",
      "App Store Review Package",
      "UI Test Cases",
      "Performance Targets",
      "Required Tests",
    ],
  },
  {
    file: "14-phase13-scale-security-operations.md",
    required: [
      "SLO and Capacity Targets",
      "Threat Model",
      "Security Controls",
      "Incident Response",
      "Required Tests",
    ],
  },
  {
    file: "15-phase14-regulated-feature-review.md",
    required: [
      "Review Owners and SLA",
      "Required Review Template",
      "Decision Types",
      "No-Go Anti-Circumvention Checks",
      "Required Tests",
    ],
  },
];

const failures = [];

for (const doc of docs) {
  const fullPath = path.join(planningDir, doc.file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${doc.file}: missing file`);
    continue;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  if (content.length < 1000) {
    failures.push(`${doc.file}: content is too short to be implementation-ready`);
  }

  for (const anchor of doc.required) {
    if (!content.includes(anchor)) {
      failures.push(`${doc.file}: missing anchor "${anchor}"`);
    }
  }
}

const readme = path.join(planningDir, "README.md");
if (!fs.existsSync(readme)) {
  failures.push("README.md: missing file");
} else {
  const content = fs.readFileSync(readme, "utf8");
  for (const anchor of ["Document Status", "Phase Dependency", "No Cross-Stage Development Rule", "Verification"]) {
    if (!content.includes(anchor)) {
      failures.push(`README.md: missing anchor "${anchor}"`);
    }
  }
}

if (failures.length > 0) {
  console.error("Planning document validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Planning document validation passed for ${docs.length} files plus README.`);
