# SKILL Usage Record

This file records the required SKILL usage for the project. It is part of the acceptance gate: future work must use the right skill for the right stage instead of forcing Godot or generic UI work into every problem.

## Art Pipeline Skills

### game-art-direction

Used for original RO-like style direction, character proportions, color palette, UI material language, and anti-copying boundaries.

Applies to:
- `docs/art-toolchain.md`
- `docs/art-asset-roadmap.md`
- `docs/art-asset-spec.md`
- player-facing visual review

### ai-game-asset-pipeline

Used for Scenario, Layer AI, Makko AI, imagegen, ComfyUI, and Stable Diffusion WebUI production order, prompt contracts, consistency rules, and fallback behavior.

Applies to:
- first-pass character, scene, UI, item, skill, pack, market, and challenge assets
- external-first art production
- local low-VRAM fallback planning

### sprite-cleanup-and-sheet

Used for Krita/Aseprite cleanup, transparent PNG, sprite sheet, anchor points, frame tags, and mobile readability checks.

Applies to:
- layered character assets
- equipment overlays
- icon cleanup
- sprite sheet export

### paper-doll-character-system

Used for male/female paper doll layers, equipment visibility, character display anchors, and idle/combat/hit visual states.

Applies to:
- character base bodies
- equipment layers
- Godot paper doll import and display

### game-ui-art-integration

Used for UI art import into Godot HUD, 9-slice panels, bottom navigation, feature pages, and status/log display.

Applies to:
- home HUD
- page backgrounds
- inventory/market/pack/challenge cards
- replacing prototype geometry with imported assets

## Existing Engineering Skills

### godot

Used for Godot project structure, scene loading, Windows export, runtime checks, and asset import. Godot is the integration tool, not the primary art tool.

Applies to:
- `godot-client/project.godot`
- `godot-client/scenes/Main.tscn`
- `godot-client/scripts/Main.gd`
- `godot-client/export_presets.cfg`

### godot-ui

Used for Control nodes, CanvasLayer HUD, mobile page structure, and player-friendly UI layout.

### hud-system

Used for player info, HP/MP/EXP bars, combat log, status text panel, and bottom function menu.

### 2d-essentials

Used for 2D scene composition, Sprite2D/TextureRect/CanvasLayer integration, and mobile portrait framing.

### animation-system

Used for idle/combat/hit/reward visual states and later sprite sheet playback.

### inventory-system

Used for items, equipment, pack contents, skill icons, and inventory UI binding.

### gdscript-patterns

Used for typed GDScript, HTTPRequest flows, API state application, and safe Godot runtime code.

### senior-backend

Used for API contracts, internal economy, simulated payment, pack/trade/challenge actions, non-withdrawable asset boundaries, and deployment routes.

### senior-qa

Used for acceptance gates, smoke tests, asset pipeline validation, API tests, and full `npm.cmd run check` verification.

## Required Verification

```powershell
npm.cmd run check
```

The check must include:
- encoding validation
- planning document validation
- API contract validation
- Godot prototype validation
- seven-goal validation
- art pipeline and project SKILL validation
- Node tests
- UI/API/production smoke tests
