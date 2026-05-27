# RO-like MMORPG Original Art Roadmap

## Direction

This project uses original RO-like 2D/2.5D MMORPG art direction. RO is only a genre and feel reference: bright fantasy, readable silhouettes, cute but adventure-ready proportions, clear class identity, field/town/market RPG framing, and mobile-readable UI.

Do not copy RO characters, sprites, UI, logos, icons, maps, monsters, names, or protected designs.

## Correct Production Order

The art pipeline must run in this order:

1. 美術聖經: define visual bible, proportions, palette, UI material, icon shape language, and anti-copying boundaries.
2. 第一批資產: generate first-pass assets through Scenario, Layer AI, Makko AI, or imagegen.
3. 修圖分層: clean, paint over, remove background, separate layers, and normalize files in Krita and Aseprite.
4. Godot 匯入: import PNG, sprite sheets, atlases, and 9-slice UI textures into Godot.
5. UI/角色替換: replace prototype geometry and placeholder icons with real assets.
6. 驗收: verify mobile readability, paper doll equipment display, page boundaries, and internal economy presentation.

## Tool Order

| Priority | Tool | Purpose |
| --- | --- | --- |
| 1 | Scenario | consistent production batches for characters, scenes, UI, items, and skills |
| 1 | Layer AI | consistent game art workspace and production asset batches |
| 2 | Makko AI | 2D character, sprite, and animation drafts |
| 3 | imagegen | quick concept direction or missing one-off assets |
| 4 | Krita | cleanup, paint-over, layer separation, transparent PNG |
| 5 | Aseprite | sprite sheet, animation tags, anchors, frame cleanup |
| fallback | ComfyUI | local node-based generation or img2img repair |
| fallback | Stable Diffusion WebUI | local browser-based generation fallback |
| integration | Godot 4 | asset import, composition, animation playback, UI layout, gameplay |

## Godot Boundary

Godot is not the art creation tool. Godot may use `_draw()` geometry only for debug, layout guides, and temporary prototype placeholders.

Formal art must be imported as PNG, sprite sheet, atlas, 9-slice UI texture, or another Godot-supported raster asset. CSS, HTML, and web card layouts are forbidden for player-facing game art.

## Required First Art Pass

1. Male and female base paper dolls with visible layer separation.
2. Equipment layers: weapon, armor, headgear, accessory, cloak/back item.
3. Home field background with character display space and no pack/trade progress.
4. HUD art: player info, HP/MP/EXP bars, status log panel, bottom nav, feature tab title.
5. Icons: item, skill, pack, trading, market, challenge, boss, ticket, GC, material.
6. Page art: pack page, market page, trading page, challenge page, role page, inventory page, skill page.
7. First enemy/target art for idle combat.

## Internal Economy Visual Scope

External payment integration remains deferred. Internal economy must still be visually represented with game art:

- simulated payment state: `SIMULATED_APPROVED`
- pack purchase/open/list/burn states
- trading and market states
- challenge ticket state
- GC reward and item drop state

These states must stay on their own feature pages. Home shows only character, character info, region/scene, status log, and function menu.

## Placeholder Status

Existing script-generated PNG/SVG assets are `PLACEHOLDER_NOT_SHIPPABLE`. They can keep tests and layouts working, but they cannot be described as production art or visual MVP completion.
