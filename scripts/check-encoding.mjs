import fs from "node:fs";
import path from "node:path";

const roots = ["README.md", "public", "src", "test", "scripts"];
const suspiciousPatterns = ["�", "嚗", "蝳", "銝", "撟", "摰", "瘝", "頛", "鞈", "蝬"];
const checkedExtensions = new Set([".md", ".html", ".js", ".mjs", ".json", ".css", ".ps1"]);

const failures = [];

for (const root of roots) {
  const resolved = path.resolve(root);
  if (!fs.existsSync(resolved)) continue;
  for (const file of walk(resolved)) {
    if (path.basename(file) === "check-encoding.mjs") continue;
    if (!checkedExtensions.has(path.extname(file))) continue;
    const content = fs.readFileSync(file, "utf8");
    for (const pattern of suspiciousPatterns) {
      if (content.includes(pattern)) {
        failures.push(`${path.relative(process.cwd(), file)} contains suspicious mojibake marker "${pattern}"`);
        break;
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Encoding check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Encoding check passed.");

function* walk(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    yield target;
    return;
  }
  for (const entry of fs.readdirSync(target)) {
    if (entry === "node_modules" || entry === "data" || entry === "tmp") continue;
    yield* walk(path.join(target, entry));
  }
}
