# Art Asset Specification

## Production Status

Current generated PNG/SVG files are `PLACEHOLDER_NOT_SHIPPABLE`. They are useful only for layout and integration tests.

The first production art pass must replace the placeholders with external-tool generated and human-cleaned raster assets before the game is considered visually ready for internal player testing.

## Required First-Pass Assets

| Category | Required Assets | Format |
| --- | --- | --- |
| Character | male base paper doll, female base paper doll, idle pose, combat pose, hit pose | layered PNG and sprite sheet |
| Equipment | weapon, armor, headgear, accessory, cloak/back item | transparent PNG layers |
| Monster/target | first field monster, elite target, boss target | transparent PNG and simple sprite sheet |
| Scene | home field, town, market, pack page backdrop, challenge backdrop | PNG background |
| UI | HUD frame, status panel, log panel, bottom nav, tab title, modal panel | PNG and 9-slice textures |
| Item | GC, pack, stardust token, material, potion, ticket, rare item | 128x128 PNG icons |
| Skill | active attack, ranged attack, magic burst, healing, passive mastery | 128x128 PNG icons |
| Lucky pack | sealed pack, opened pack, burned pack, listed pack | PNG icons and page illustration |
| Trading | market stall, price marker, lock, cooldown, listing status | PNG icons |
| Market | listing card frame, buy action, price cap marker | PNG and 9-slice textures |
| Challenge | boss ticket, boss room, reward chest, guild marker | PNG icons and backdrop |

## File Rules

- Character and equipment layers use transparent PNG.
- Icons are square and must keep subject readable at 48x48.
- Scene backgrounds target mobile portrait framing at 432x768.
- UI frames must support 9-slice scaling where possible.
- Sprite sheets must include frame size, anchor point, and animation tag notes.
- File names use lowercase kebab-case and category folders.

## Acceptance Rules

- At least one male and one female paper doll must be visible in Godot.
- At least one equipment change must visibly alter the character.
- Home must show real character art, real scene art, and real HUD art.
- Pack/trade progress must remain outside home and only appear in pack, market, trading, or wallet-related pages.
- Text is allowed for combat logs, drop results, and event narration only.
