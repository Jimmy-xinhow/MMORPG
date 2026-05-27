# Art Production Batch 01

## Goal

Create the first coherent original RO-like 2D/2.5D mobile MMORPG art set for internal testing.

This batch replaces the current `PLACEHOLDER_NOT_SHIPPABLE` look with a unified direction that can be expanded into production assets.

## Style Bible V1

| Dimension | Direction |
| --- | --- |
| Genre | original bright fantasy mobile MMORPG |
| Camera | 2D/2.5D, slightly top-down, character-forward |
| Character proportion | cute adventure proportion, large readable head, compact body, clear weapon silhouette |
| Line | clean painted outline, soft inner shading, readable at mobile size |
| Palette | teal sky, grass green, warm gold UI accents, dark blue-gray panels, ruby warning accents |
| UI material | carved fantasy metal/stone frame with blue glass panels and gold highlights |
| Icon style | square readable 128x128 icons, rim-lit subject, no text |
| Forbidden | copied RO sprites, logos, UI, monster designs, web/CSS card visuals, engineering panels |

## Batch Assets

| ID | Asset | Target File |
| --- | --- | --- |
| B01-CHAR-MALE | male base adventurer paper doll | `godot-client/assets/production/characters/male-base.png` |
| B01-CHAR-FEMALE | female base adventurer paper doll | `godot-client/assets/production/characters/female-base.png` |
| B01-EQ-WEAPON | sword equipment layer | `godot-client/assets/production/equipment/sword-layer.png` |
| B01-EQ-ARMOR | cloth armor equipment layer | `godot-client/assets/production/equipment/cloth-armor-layer.png` |
| B01-EQ-HEAD | headgear equipment layer | `godot-client/assets/production/equipment/headgear-layer.png` |
| B01-SCENE-HOME | home field scene | `godot-client/assets/production/backgrounds/home-field.png` |
| B01-UI-HUD | HUD frame and status panels | `godot-client/assets/production/ui/hud-frame.png` |
| B01-UI-NAV | bottom navigation frame | `godot-client/assets/production/ui/bottom-nav.png` |
| B01-MONSTER | first field enemy | `godot-client/assets/production/monsters/field-slime.png` |
| B01-ICON-PACK | sealed lucky pack icon | `godot-client/assets/production/icons/pack-sealed.png` |
| B01-ICON-SKILL | active attack skill icon | `godot-client/assets/production/icons/skill-active-attack.png` |
| B01-ICON-TICKET | challenge ticket icon | `godot-client/assets/production/icons/challenge-ticket.png` |

## Master Prompt

Original bright fantasy RO-like 2D/2.5D mobile MMORPG art direction, not copying any existing game. Cute adventure proportions, clean painted outlines, readable silhouettes, teal sky and grass green world, warm gold UI accents, dark blue-gray fantasy panels, no logo, no text, no watermark, no copyrighted characters, no copied RO assets.

## Style Direction Sheet Prompt

Create a production art direction sheet for an original bright fantasy 2D/2.5D mobile MMORPG. Include one male adventurer paper doll, one female adventurer paper doll, a home field background, a compact fantasy HUD frame, a bottom navigation frame, a sealed lucky pack icon, a sword equipment layer, a slime-like first field monster, and three square skill/item icons. The style should feel inspired by classic cute fantasy MMORPG readability without copying any existing game. Clean painted outlines, soft cel-shaded lighting, warm gold accents, teal and green world colors, dark blue-gray UI panels. No text, no logo, no watermark.

## Transparent Asset Prompt Template

Create `{asset_name}` for an original bright fantasy RO-like 2D/2.5D mobile MMORPG, transparent background, clean painted outline, soft cel shading, readable at mobile size, no text, no logo, no watermark, no copyrighted character, no copied RO asset.

## Scene Prompt Template

Create `{scene_name}` background for an original bright fantasy RO-like 2D/2.5D mobile MMORPG, mobile portrait 432x768 composition, character display area in the center, readable world depth, teal sky, green field, warm fantasy lighting, no UI text, no logo, no watermark, no copied game assets.

## Cleanup Rules

- Raw AI output is draft only.
- Krita pass: remove artifacts, unify line weight, fix hands/face/weapon shape, split layers.
- Aseprite pass: normalize canvas, set anchors, export sprite sheet when animation frames exist.
- Final Godot import must use PNG, sprite sheet, atlas, or 9-slice UI texture.
