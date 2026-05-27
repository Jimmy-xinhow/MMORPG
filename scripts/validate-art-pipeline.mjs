import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function file(path) {
  return readFile(path, "utf8");
}

async function listFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = `${path}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...(await listFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

const requiredSkills = [
  "game-art-direction",
  "ai-game-asset-pipeline",
  "sprite-cleanup-and-sheet",
  "paper-doll-character-system",
  "game-ui-art-integration",
];

const [toolchain, assetSpec, artRoadmap, skillUsage, packageJson, godotScript] = await Promise.all([
  file("docs/art-toolchain.md"),
  file("docs/art-asset-spec.md"),
  file("docs/art-asset-roadmap.md"),
  file("docs/implementation-skill-usage.md"),
  file("package.json"),
  file("godot-client/scripts/Main.gd"),
]);
const completionChecklist = await file("docs/art-completion-checklist.md");

for (const skill of requiredSkills) {
  const path = `docs/project-skills/${skill}/SKILL.md`;
  assert(existsSync(path), `missing project skill: ${path}`);
  const body = await file(path);
  assert(body.includes(`name: ${skill}`), `${skill} must declare its skill name`);
  assert(body.includes("description:"), `${skill} must declare a description`);
  assert(skillUsage.includes(skill), `implementation skill usage must record ${skill}`);
}

for (const tool of ["Scenario", "Layer AI", "Makko AI", "Aseprite", "Krita", "ComfyUI", "Stable Diffusion WebUI", "Godot 4"]) {
  assert(toolchain.includes(tool), `art toolchain must include ${tool}`);
}

assert(toolchain.includes("external-first") || toolchain.includes("外部"), "art toolchain must declare external-first production");
assert(toolchain.includes("GTX 1660 Ti") && toolchain.includes("6 GB"), "art toolchain must record local GPU constraint");
assert(toolchain.includes("PLACEHOLDER_NOT_SHIPPABLE"), "art toolchain must mark generated assets as not shippable");
assert(toolchain.includes("Godot `_draw()` geometry may remain only for debug"), "art toolchain must restrict Godot draw geometry to prototype/debug use");

for (const category of ["Character", "Equipment", "Monster", "Scene", "UI", "Item", "Skill", "Lucky pack", "Trading", "Market", "Challenge"]) {
  assert(assetSpec.includes(category), `asset spec must include ${category}`);
}

for (const rule of ["transparent PNG", "sprite sheet", "9-slice", "PLACEHOLDER_NOT_SHIPPABLE", "432x768", "48x48"]) {
  assert(assetSpec.includes(rule), `asset spec must include ${rule}`);
}

for (const workflowStep of ["美術聖經", "第一批資產", "修圖分層", "Godot 匯入", "UI/角色替換", "驗收"]) {
  assert(artRoadmap.includes(workflowStep), `art roadmap must include workflow step ${workflowStep}`);
}

for (const tool of ["Scenario", "Layer AI", "Makko AI", "Aseprite", "Krita", "ComfyUI", "Stable Diffusion WebUI"]) {
  assert(artRoadmap.includes(tool), `art roadmap must include ${tool}`);
}

assert(packageJson.includes('"check:art"'), "package scripts must include check:art");
assert(packageJson.includes("validate-art-pipeline.mjs"), "package scripts must run art pipeline validation");

assert(godotScript.includes("_draw("), "current Godot prototype still has draw hooks; art pipeline must explicitly classify this as prototype-only");
assert(assetSpec.includes("Current generated PNG/SVG files are `PLACEHOLDER_NOT_SHIPPABLE`"), "asset spec must not claim current placeholders are final art");
assert(completionChecklist.includes("Art MVP asset coverage complete; manual polish remains."), "art completion checklist must state current art completion truth");
assert(completionChecklist.includes("batch-01-style-direction.png"), "art completion checklist must reference the Batch 01 direction image");
assert(existsSync("godot-client/assets/production/reference/batch-01-style-direction.png"), "Batch 01 style direction image must be stored in production reference assets");

const assetFiles = await listFiles("godot-client/assets");
const placeholderAssetCount = assetFiles.filter((path) => path.endsWith(".png") || path.endsWith(".svg")).length;
assert(placeholderAssetCount >= 40, "existing placeholder assets should remain available for integration tests until replaced");

console.log("Art toolchain and project skill validation passed");
