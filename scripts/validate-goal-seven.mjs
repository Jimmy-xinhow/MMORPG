import { readdir, readFile, stat } from "node:fs/promises";
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

const [
  goalDoc,
  skillDoc,
  artRoadmap,
  artToolchain,
  artSpec,
  godotScript,
  godotProject,
  godotReadme,
  exportPresets,
  apiContract,
  server,
  services,
  authzTest,
  smokeApi,
  packageJson,
] = await Promise.all([
  file("docs/goal-seven-acceptance.md"),
  file("docs/implementation-skill-usage.md"),
  file("docs/art-asset-roadmap.md"),
  file("docs/art-toolchain.md"),
  file("docs/art-asset-spec.md"),
  file("godot-client/scripts/Main.gd"),
  file("godot-client/project.godot"),
  file("godot-client/README.md"),
  file("godot-client/export_presets.cfg"),
  file("src/api-contract.js"),
  file("src/server.js"),
  file("src/domain/services.js"),
  file("test/authz.test.js"),
  file("scripts/smoke-api.mjs"),
  file("package.json"),
]);

const godotScriptPaths = (await listFiles("godot-client/scripts")).filter((path) => path.endsWith(".gd"));
const allGodotScripts = (await Promise.all(godotScriptPaths.map((path) => file(path)))).join("\n");

for (let i = 1; i <= 7; i += 1) {
  assert(goalDoc.includes(`GOAL-${i}`), `goal acceptance doc must include GOAL-${i}`);
}

assert(apiContract.includes('"/api/player/state"'), "GOAL-1 requires player state API");
assert(apiContract.includes('"/api/player/action"'), "GOAL-1 requires player action API");
assert(apiContract.includes('"/api/player/simulate-payment"'), "GOAL-1 requires simulated payment API");
assert(server.includes('url.pathname === "/api/player/action"'), "GOAL-1 requires server player action route");
assert(services.includes("runPlayerAction") && services.includes("runPlayerPatrol") && services.includes("creditPlayerGc"), "GOAL-1 requires persisted gameplay action loop");
assert(smokeApi.includes("/api/player/action") && authzTest.includes("public player action updates persistent RPG state"), "GOAL-2 requires action verification");
assert(packageJson.includes('"godot:package:windows"') && packageJson.includes('"check:goal"'), "GOAL-1 and GOAL-2 require package/check scripts");

assert(godotProject.includes('run/main_scene="res://scenes/Main.tscn"'), "GOAL-3 requires a real Godot main scene");
assert(godotScript.includes("extends Node2D") && godotScript.includes("CanvasLayer") && godotScript.includes("class GameWorld"), "GOAL-5 requires Godot game screen architecture");
assert(godotScript.includes("class PaperDollView") && godotScript.includes("_draw_paper_doll_world"), "GOAL-3 requires paper doll rendering");
assert(godotScript.includes("_draw_equipment_slots") && godotScript.includes("_draw_enemy_target"), "GOAL-3 and GOAL-6 require equipment and enemy visual rendering");
assert(godotScript.includes('"gender": "male"') && godotScript.includes('"gender": "female"'), "GOAL-3 requires male and female base paper dolls");
assert(godotScript.includes('"weapon"') && godotScript.includes('"armor"') && godotScript.includes('"head"') && godotScript.includes('"accessory"'), "GOAL-3 requires visible equipment slots");
assert(allGodotScripts.includes("/api/player/action") && allGodotScripts.includes("/api/player/state"), "GOAL-1 requires Godot to call online gameplay APIs");

const forbiddenHomeLabels = [
  "交易進度 %d/3",
  "draw_string(font, Vector2(62, 515)",
  "draw_string(font, Vector2(244, 515)",
];
for (const text of forbiddenHomeLabels) {
  assert(!godotScript.includes(text), `GOAL-6 forbids home pack/trade label: ${text}`);
}
assert(!godotScript.includes("OperatorSettlement") && !godotScript.includes("tax workflow"), "GOAL-5 forbids operator/legal copy in Godot player UI");

assert(
  artRoadmap.includes("original RO-like") &&
    artRoadmap.includes("Do not copy RO") &&
    artRoadmap.includes("Godot is not the art creation tool") &&
    artRoadmap.includes("CSS, HTML") &&
    artRoadmap.includes("Male and female base paper dolls"),
  "GOAL-3 requires original external-first art roadmap with Godot-only integration",
);
assert(
  artToolchain.includes("external-first") &&
    artToolchain.includes("Scenario") &&
    artToolchain.includes("Layer AI") &&
    artToolchain.includes("Makko AI") &&
    artToolchain.includes("Krita") &&
    artToolchain.includes("Aseprite") &&
    artToolchain.includes("PLACEHOLDER_NOT_SHIPPABLE"),
  "GOAL-3 requires correct external/open-source art production toolchain",
);
assert(
  artSpec.includes("transparent PNG") &&
    artSpec.includes("sprite sheet") &&
    artSpec.includes("9-slice") &&
    artSpec.includes("Equipment") &&
    artSpec.includes("Challenge"),
  "GOAL-3 requires production art asset specification",
);

const assetFiles = await listFiles("godot-client/assets");
const pngFiles = assetFiles.filter((path) => path.endsWith(".png"));
const svgFiles = assetFiles.filter((path) => path.endsWith(".svg"));
assert(pngFiles.length >= 20 && svgFiles.length >= 20, "GOAL-3 requires baseline placeholder item, skill, character, scene, and UI art assets until replaced");

for (const skill of [
  "game-art-direction",
  "ai-game-asset-pipeline",
  "sprite-cleanup-and-sheet",
  "paper-doll-character-system",
  "game-ui-art-integration",
  "godot",
  "godot-ui",
  "hud-system",
  "2d-essentials",
  "animation-system",
  "inventory-system",
  "gdscript-patterns",
  "senior-backend",
  "senior-qa",
]) {
  assert(skillDoc.includes(skill), `GOAL-4 requires skill usage record for ${skill}`);
}

assert(exportPresets.includes('name="Windows Desktop"') && exportPresets.includes("binary_format/embed_pck=true"), "GOAL-1 requires Windows export preset");
assert(godotReadme.includes("internal test client") && godotReadme.includes("POST /api/player/action"), "GOAL-1 requires Godot internal test documentation");
assert(existsSync("build/windows/LuckyPackMMORPG.exe"), "GOAL-1 requires exported Windows executable");
assert(existsSync("build/windows/Play-Lucky-Pack-Online.cmd"), "GOAL-1 requires Windows online launcher");
const exeStat = await stat("build/windows/LuckyPackMMORPG.exe");
assert(exeStat.size > 50_000_000, "GOAL-1 exported Windows executable looks too small");

console.log("Seven goal acceptance validation passed");
