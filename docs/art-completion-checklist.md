# Art Completion Checklist

## Status

Art MVP asset coverage complete; manual polish remains.

The project now has the correct art toolchain, project skills, Batch 01 and Batch 02 reference images, production PNG assets for the required MVP categories, and Godot integration for the home screen plus pack, market, challenge, role, inventory, and skill pages. These assets are suitable for internal visual iteration, but still need human art polish before public launch quality.

Reference image:

- `godot-client/assets/production/reference/batch-01-style-direction.png`
- `godot-client/assets/production/reference/batch-02-paper-doll-equipment-sheet.png`
- `godot-client/assets/production/reference/batch-02-vfx-monster-sheet.png`
- `godot-client/assets/production/reference/batch-03-animation-ui-sheet.png`
- `godot-client/assets/production/reference/batch-04-character-animation-sheet.png`

## Required Before Art MVP Can Be Accepted

| Area | Required Detail | Status |
| --- | --- | --- |
| Style bible | RO-like original direction, palette, line, UI material, icon language | done |
| Male paper doll | transparent layered PNG, idle/combat/hit/reward/walk/cast/death/loot states | layered front pass done; idle, combat, hit, reward, walk, cast, death, loot frames added |
| Female paper doll | transparent layered PNG, idle/combat/hit/reward/walk/cast/death/loot states | layered front pass done; idle, combat, hit, reward, walk, cast, death, loot frames added |
| Paper doll layers | base, hair/head, outfit/armor, weapon, headgear, accessory, cloak/back item | done for MVP; manual alignment polish remains |
| Equipment visibility | at least one weapon, armor, headgear, accessory visibly changes character | done in Godot preview; expanded item set remains |
| Home scene | 432x768 production background with character display area | first pass done |
| Enemy target | first field monster, elite target, boss target | done plus mushroom, bandit, crystal golem |
| HUD art | player info, HP/MP/EXP, log panel, status panel | done; Batch 03 9-slice texture pass added |
| Bottom nav | mobile game buttons with production art frames/icons | done; Batch 03 9-slice texture pass added |
| Page backgrounds | pack, market, trading, challenge, role, inventory, skill | done |
| Item icons | GC, pack, stardust, material, potion, ticket, rare item | done |
| Skill icons | attack, ranged, magic, healing, passive | done |
| Lucky pack states | sealed, opened, burned, listed | done |
| Market/trading art | stall, price marker, lock, cooldown, listing card | done |
| Challenge art | boss room, boss ticket, reward chest, guild marker | done |
| VFX | attack, ranged, magic, healing, level-up, drop, pack opening, boss warning | done for MVP |
| Cleanup pass | transparent PNG, no fringe, consistent light, mobile readability | second pass done; manual polish remains |
| Godot import | replace placeholder assets with production PNG/sprite sheet/9-slice | MVP integration done across home, pack, market, challenge, role, inventory, and skill pages; character state textures, extended animation frames, and UI 9-slice assets now wired |
| Godot visual QA | home has real character, scene, HUD; no pack/trade progress on home | automated checks done; pack stage now scoped only to pack and market pages; visual review remains |

## Remaining Polish

1. Clean transparent edges around character hair, boots, gloves, and weapons.
2. Hand-polish the Batch 03 9-slice frames in Krita/Aseprite for final commercial UI quality.
3. Add directional walk variants, weapon-specific attack variants, and smoother 6-8 frame animation passes beyond the current 4-frame set.
4. Expand equipment tiers beyond the MVP sword, staff, bow, shield, cloak, armor, headgear, boots, gloves, and charm.
5. Run manual visual QA in Godot after every feature-page integration.
6. Replace first-pass composed backgrounds with hand-polished page-specific art before public launch.
