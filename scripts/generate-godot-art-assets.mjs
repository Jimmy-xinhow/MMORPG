import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = "godot-client/assets";

function svg(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff0a8"/>
      <stop offset="1" stop-color="#d58a34"/>
    </linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd8ff"/>
      <stop offset="0.48" stop-color="#bdeaff"/>
      <stop offset="1" stop-color="#77c56d"/>
    </linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eff8ff"/>
      <stop offset="1" stop-color="#84a9c8"/>
    </linearGradient>
  </defs>
${body}
</svg>`;
}

function iconBase(body) {
  return svg(96, 96, `
  <rect x="6" y="6" width="84" height="84" rx="18" fill="#172437" stroke="#78b7ff" stroke-width="4"/>
  <ellipse cx="48" cy="74" rx="30" ry="8" fill="#07101b" opacity="0.5"/>
${body}`);
}

const files = {
  "backgrounds/ro_field_day.svg": svg(432, 768, `
  <rect width="432" height="768" fill="url(#sky)"/>
  <path d="M0 230 C90 170 170 210 238 158 C310 106 372 142 432 112 L432 768 L0 768 Z" fill="#6fb669"/>
  <path d="M0 290 C110 230 190 265 270 210 C340 165 390 184 432 160 L432 768 L0 768 Z" fill="#4f9e67"/>
  <path d="M-40 768 C80 590 168 510 232 400 C286 488 348 598 472 768 Z" fill="#bdad8c"/>
  <path d="M-20 768 C92 604 168 534 226 430 C278 510 336 610 452 768 Z" fill="#d8c6a2"/>
  <path d="M64 414 L368 414" stroke="#e8d5ae" stroke-width="8" opacity="0.7"/>
  <path d="M55 455 L378 455" stroke="#b29a77" stroke-width="4" opacity="0.55"/>
  <circle cx="68" cy="92" r="34" fill="#fff5b5" opacity="0.95"/>
  <g opacity="0.55" fill="#f4ffff">
    <ellipse cx="274" cy="84" rx="46" ry="14"/>
    <ellipse cx="318" cy="96" rx="58" ry="16"/>
    <ellipse cx="142" cy="122" rx="52" ry="15"/>
  </g>`),
  "sprites/player_adventurer.svg": svg(180, 220, `
  <ellipse cx="90" cy="202" rx="58" ry="12" fill="#07101b" opacity="0.45"/>
  <path d="M45 93 C22 128 22 168 50 196 L72 154 Z" fill="#426a94"/>
  <path d="M135 93 C158 128 158 168 130 196 L108 154 Z" fill="#2f557c"/>
  <path d="M58 72 C78 46 108 46 126 72 L138 156 C126 185 54 185 42 156 Z" fill="#70472f"/>
  <path d="M60 79 L120 79 L110 155 L70 155 Z" fill="url(#gold)"/>
  <rect x="62" y="108" width="56" height="18" fill="#7bd7ff" opacity="0.95"/>
  <circle cx="90" cy="47" r="28" fill="#f0d2a8"/>
  <path d="M58 45 C64 17 108 6 129 35 C119 26 93 32 79 40 C74 49 66 52 58 45 Z" fill="#1e2432"/>
  <path d="M132 92 L166 58" stroke="url(#steel)" stroke-width="8" stroke-linecap="round"/>
  <path d="M149 69 L174 45" stroke="#79d7ff" stroke-width="4" stroke-linecap="round"/>
  <path d="M48 154 L20 204" stroke="#ffe181" stroke-width="8" stroke-linecap="round"/>
  <path d="M16 205 L34 215" stroke="#7bd7ff" stroke-width="5" stroke-linecap="round"/>`),
  "sprites/lucky_chest.svg": svg(160, 130, `
  <ellipse cx="80" cy="116" rx="66" ry="10" fill="#07101b" opacity="0.42"/>
  <path d="M24 54 C34 20 126 20 136 54 L136 72 L24 72 Z" fill="#8a5738" stroke="#f3c96d" stroke-width="6"/>
  <rect x="22" y="60" width="116" height="50" rx="8" fill="#795033" stroke="#f3c96d" stroke-width="6"/>
  <rect x="68" y="24" width="24" height="86" fill="url(#gold)"/>
  <circle cx="80" cy="76" r="19" fill="#7bdcff" stroke="#eaffff" stroke-width="4"/>
  <path d="M18 48 L4 34 M142 48 L156 34 M80 15 L80 0" stroke="#fff0a8" stroke-width="6" stroke-linecap="round"/>`),
};

const icons = {
  pack: `<rect x="28" y="38" width="40" height="28" rx="4" fill="#8a5535" stroke="url(#gold)" stroke-width="5"/><rect x="43" y="25" width="10" height="43" fill="url(#gold)"/><circle cx="48" cy="52" r="11" fill="#6fd6ff"/>`,
  listing: `<path d="M24 42 L72 42 L64 25 L32 25 Z" fill="url(#gold)"/><rect x="28" y="42" width="40" height="24" fill="#27384d" stroke="#6fd6ff" stroke-width="4"/><path d="M34 69 L34 78 M62 69 L62 78" stroke="#6fd6ff" stroke-width="4"/>`,
  open: `<circle cx="48" cy="48" r="24" fill="#684394"/><path d="M48 16 L48 80 M16 48 L80 48 M25 25 L71 71 M71 25 L25 71" stroke="url(#gold)" stroke-width="5"/><circle cx="48" cy="48" r="11" fill="#6fd6ff"/>`,
  cooldown: `<path d="M48 22 A26 26 0 1 1 30 67" fill="none" stroke="#6fd6ff" stroke-width="7"/><path d="M48 48 L48 28 M48 48 L64 54" stroke="url(#gold)" stroke-width="6" stroke-linecap="round"/>`,
  market: `<rect x="22" y="40" width="52" height="26" rx="4" fill="#26384c" stroke="#6fd6ff" stroke-width="5"/><path d="M20 40 L76 40 L68 25 L28 25 Z" fill="url(#gold)"/><circle cx="36" cy="55" r="6" fill="#fff0a8"/><circle cx="60" cy="55" r="6" fill="#fff0a8"/>`,
  price: `<ellipse cx="42" cy="61" rx="20" ry="9" fill="#d58a34"/><ellipse cx="48" cy="49" rx="20" ry="9" fill="#f3c96d"/><ellipse cx="54" cy="37" rx="20" ry="9" fill="#fff0a8"/><text x="43" y="55" fill="#26384c" font-size="26" font-family="Arial" font-weight="700">G</text>`,
  lock: `<rect x="28" y="43" width="40" height="28" rx="4" fill="url(#gold)"/><path d="M34 45 V36 A14 14 0 0 1 62 36 V45" fill="none" stroke="#6fd6ff" stroke-width="7"/><circle cx="48" cy="56" r="5" fill="#26384c"/>`,
  force_open: `<path d="M48 16 L53 35 L72 24 L61 43 L82 48 L61 53 L72 72 L53 61 L48 82 L43 61 L24 72 L35 53 L14 48 L35 43 L24 24 L43 35 Z" fill="url(#gold)"/><rect x="34" y="34" width="28" height="28" fill="#8a5535" stroke="#6fd6ff" stroke-width="4"/>`,
  boss: `<circle cx="48" cy="52" r="25" fill="#82465e"/><circle cx="38" cy="47" r="5" fill="#ff7187"/><circle cx="58" cy="47" r="5" fill="#ff7187"/><path d="M28 34 L38 14 L43 38 M68 34 L58 14 L53 38" fill="url(#gold)"/>`,
  guild: `<path d="M48 16 L73 27 L66 65 L48 78 L30 65 L23 27 Z" fill="#38537a" stroke="#6fd6ff" stroke-width="5"/><path d="M48 24 V66 M34 40 H62" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/>`,
  ticket: `<path d="M23 35 H73 V61 H23 Z" fill="url(#gold)"/><circle cx="23" cy="48" r="8" fill="#172437"/><circle cx="73" cy="48" r="8" fill="#172437"/><path d="M48 37 V59" stroke="#172437" stroke-width="4" stroke-dasharray="4 4"/>`,
  season: `<circle cx="48" cy="38" r="20" fill="url(#gold)"/><path d="M36 56 L28 82 L47 66 L68 82 L60 56" fill="#6fd6ff"/><circle cx="48" cy="38" r="9" fill="#fff7bd"/>`,
  warrior: `<path d="M25 70 L70 25" stroke="url(#gold)" stroke-width="9" stroke-linecap="round"/><path d="M31 32 L66 67" stroke="#6fd6ff" stroke-width="6" stroke-linecap="round"/><path d="M66 18 L78 18 L78 30" fill="none" stroke="#eff8ff" stroke-width="5"/>`,
  ranger: `<path d="M58 20 C28 30 28 66 58 76" fill="none" stroke="url(#gold)" stroke-width="7"/><path d="M36 22 L66 74 M23 48 H75" stroke="#6fd6ff" stroke-width="5" stroke-linecap="round"/>`,
  mage: `<path d="M32 78 L63 18" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/><circle cx="65" cy="18" r="16" fill="#8b78ff"/><circle cx="65" cy="18" r="7" fill="#6fd6ff"/>`,
  cleric: `<circle cx="48" cy="48" r="25" fill="#356f68"/><rect x="43" y="25" width="10" height="46" fill="url(#gold)"/><rect x="25" y="43" width="46" height="10" fill="url(#gold)"/>`,
  skill: `<path d="M48 17 L58 39 L82 42 L64 58 L69 81 L48 69 L27 81 L32 58 L14 42 L38 39 Z" fill="url(#gold)" stroke="#6fd6ff" stroke-width="4"/>`,
};

for (const [name, body] of Object.entries(icons)) {
  files[`icons/${name}.svg`] = iconBase(body);
}

for (const [path, content] of Object.entries(files)) {
  const full = join(root, path);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, content, "utf8");
}

console.log(`Generated ${Object.keys(files).length} Godot art assets.`);
