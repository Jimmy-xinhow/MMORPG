import { readFile } from "node:fs/promises";
import { createServer } from "../src/server.js";

const server = createServer();
const port = 3200;
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function occurrences(text, pattern) {
  return (text.match(pattern) ?? []).length;
}

const [indexHtml, appJs, stylesCss] = await Promise.all([
  readFile("public/index.html", "utf8"),
  readFile("public/app.js", "utf8"),
  readFile("public/styles.css", "utf8"),
]);

assert(occurrences(indexHtml, /id="launchChecklist"/g) === 0, "public homepage must not expose internal launch checklist");
assert(occurrences(indexHtml, /data-view-target="/g) === 0, "public homepage must not expose internal navigation");
assert(occurrences(indexHtml, /data-view="/g) === 1, "public homepage must contain only player view");
assert(occurrences(indexHtml, /data-player-tab="/g) === 5, "public homepage must expose five player tabs");
assert(occurrences(indexHtml, /data-player-panel="/g) === 5, "public homepage must contain five player panels");
assert(occurrences(indexHtml, /role="tab"/g) === 5, "public homepage tabs must use tab roles");
assert(occurrences(indexHtml, /role="tabpanel"/g) === 5, "public homepage panels must use tabpanel roles");
assert(occurrences(indexHtml, /class="player-panel"[^>]+hidden/g) === 4, "only one player panel should be visible by default");
assert(indexHtml.includes('id="characterFrame"'), "public homepage must include a character display frame");
assert(indexHtml.includes('id="characterStatusTitle"'), "public homepage must include character status text");
assert(indexHtml.includes('id="hudPackStatus"'), "public homepage must include game HUD pack status");
assert(indexHtml.includes("角色目前執行狀態"), "public homepage must label the character status interface");
assert(indexHtml.includes("角色目前狀態"), "public homepage must show a visible character status title");
assert(indexHtml.includes("遊戲主畫面"), "public homepage must present a clear game screen");
assert(indexHtml.includes("手機放置冒險"), "public homepage must frame the UI as a mobile idle adventure");
assert(!indexHtml.includes("Demo Role"), "public homepage must not expose demo role controls");
assert(!indexHtml.includes("Demo 控制"), "public homepage must not expose demo controls");
assert(!indexHtml.includes("OperatorSettlement"), "public homepage must not expose operator settlement details");
assert(!indexHtml.includes("經營者中心"), "public homepage must not expose operator center");
assert(!indexHtml.includes("管理後台"), "public homepage must not expose admin center");
assert(indexHtml.includes("遊戲資產都只屬於遊戲體驗"), "public homepage must show player-facing service rule");
assert(indexHtml.includes("哪些內容不可提現"), "public homepage must clearly name non-withdrawable contents");
assert(indexHtml.includes("/assets/lucky-pack.svg"), "public homepage must render game artwork");
assert(!indexHtml.includes("Launch Gap"), "public homepage must not show internal launch wording");
assert(!indexHtml.includes("MVP"), "public homepage must not show internal MVP wording");
for (const path of ["/legal/terms.html", "/legal/privacy.html", "/legal/probability.html", "/legal/refund.html"]) {
  assert(indexHtml.includes(path), `homepage missing legal link: ${path}`);
}

assert(!appJs.includes("renderLaunchReadiness"), "public UI must not render internal readiness");
assert(appJs.includes("renderPlayerTabs"), "public UI must switch player tabs");
assert(appJs.includes("renderCharacterStatus"), "public UI must update character status");
assert(appJs.includes("hudPackStatus"), "public UI must update HUD pack status");
assert(!stylesCss.includes(".readiness-board"), "public CSS must not keep removed readiness board styles");
assert(stylesCss.includes(".player-tabs"), "public CSS must style player tabs");
assert(stylesCss.includes(".game-screen"), "public CSS must style the game screen");
assert(stylesCss.includes(".character-frame"), "public CSS must style the character frame");
assert(stylesCss.includes('max-width: 30rem'), "public CSS must constrain the UI to a mobile portrait shell");
assert(stylesCss.includes('grid-template-areas:\n      "inventory"\n      "character"\n      "status"'), "desktop view must keep the mobile idle layout order");

await listen();
try {
  const home = await fetch(`${baseUrl}/`).then((response) => response.text());
  assert(!home.includes("launchChecklist"), "served homepage must not expose launch checklist");
  assert(!home.includes("OperatorSettlement"), "served homepage must not expose operator settlement details");
  assert(!home.includes("經營者中心"), "served homepage must not expose operator center");
  assert(!home.includes("管理後台"), "served homepage must not expose admin center");
  assert(home.includes("遊戲資產都只屬於遊戲體驗"), "served homepage missing player-facing service rule");
  assert(home.includes("哪些內容不可提現"), "served homepage missing non-withdrawable content rule");
  assert(home.includes('id="characterFrame"'), "served homepage missing character display frame");
  assert(home.includes('id="hudPackStatus"'), "served homepage missing HUD pack status");
  assert(home.includes("角色目前執行狀態"), "served homepage missing character status label");
  assert(home.includes("角色目前狀態"), "served homepage missing visible character status title");
  assert(home.includes("手機放置冒險"), "served homepage missing mobile idle adventure framing");
  assert((home.match(/data-player-tab="/g) ?? []).length === 5, "served homepage missing player tabs");
  assert((home.match(/class="player-panel"[^>]+hidden/g) ?? []).length === 4, "served homepage should hide inactive player panels");
  assert(!home.includes("MVP"), "served homepage must not show internal MVP wording");
  for (const path of ["/legal/terms.html", "/legal/privacy.html", "/legal/probability.html", "/legal/refund.html"]) {
    const legal = await fetch(`${baseUrl}${path}`).then((response) => response.text());
    assert(
      legal.includes("遊戲資產") || legal.includes("隱私權政策") || legal.includes("機率與內容揭露") || legal.includes("退款與客服"),
      `legal page missing expected content: ${path}`,
    );
  }
  const robots = await fetch(`${baseUrl}/robots.txt`).then((response) => response.text());
  assert(robots.includes("Sitemap: /sitemap.xml"), "robots.txt missing sitemap");
  const sitemap = await fetch(`${baseUrl}/sitemap.xml`).then((response) => response.text());
  assert(sitemap.includes("/legal/terms.html"), "sitemap missing legal pages");
  const asset = await fetch(`${baseUrl}/assets/lucky-pack.svg`).then((response) => response.text());
  assert(asset.includes("<svg"), "lucky pack artwork must be served");
  console.log("UI smoke passed");
} finally {
  await close();
}
