# Technical Preferences

> Last Updated: 2026-05-27
> Source: `/setup-engine` brownfield scaffold from existing `godot-client/project.godot`.

## Engine & Language

- **Engine**: Godot 4.4
- **Language**: GDScript
- **Build System**: Godot Export Templates
- **Asset Pipeline**: Godot Import System + project PNG generation/import scripts

## Input & Platform

- **Target Platforms**: Mobile portrait internal test client, Windows internal test package
- **Input Methods**: Touch-first UI, mouse fallback for desktop internal testing
- **Primary Input**: Touch
- **Gamepad Support**: None for current internal test scope
- **Touch Support**: Full for player-facing mobile screens
- **Platform Notes**: UI must fit a 432x768 portrait viewport and must not rely on hover-only interaction.

## Naming Conventions

| Element | Convention | Example |
| --- | --- | --- |
| Classes | PascalCase | `PlayerApiClient` |
| Variables | snake_case | `api_base_url` |
| Functions | snake_case | `_request_player_state` |
| Signals | snake_case past tense | `player_state_received` |
| Files | snake_case matching class | `player_api_client.gd` |
| Scenes | PascalCase matching root node | `Main.tscn` |
| Constants | UPPER_SNAKE_CASE | `VIEWPORT_SIZE` |

## Performance Budgets

| Target | Value |
| --- | --- |
| Framerate | 60 fps target for internal client interactions |
| Frame budget | 16.6 ms |
| Mobile viewport | 432x768 logical canvas |
| Draw approach | Prefer imported textures and lightweight Control nodes over heavy per-frame UI drawing |

## Testing

- **Primary project check**: `npm.cmd run check`
- **Godot static validation**: `npm.cmd run check:godot`
- **Player API smoke**: `npm.cmd run smoke:api`
- **UI smoke**: `npm.cmd run smoke:ui`

## Approved Libraries / Addons

- None beyond Godot built-ins and the existing Node validation scripts.

## Forbidden Patterns

- Do not put player-facing economy state on the home page unless explicitly scoped there.
- Do not create withdrawable value through RPG rewards or player-safe APIs.
- Do not replace production art imports with CSS, HTML, or procedural debug geometry for player-facing MVP art.
- Do not hardcode new gameplay economy rules in Godot; the Node backend remains the rule/API layer.

## Engine Specialists

- **Primary**: godot-specialist
- **Language/Code Specialist**: godot-gdscript-specialist
- **Shader Specialist**: godot-shader-specialist
- **UI Specialist**: godot-specialist
- **Additional Specialists**: godot-gdextension-specialist only if native extensions are introduced later
- **Routing Notes**: Use Godot and GDScript guidance for all `.gd`, `.tscn`, imported asset, Control-node, CanvasLayer, and scene composition work.

### File Extension Routing

| File Extension / Type | Specialist |
| --- | --- |
| `.gd` | godot-gdscript-specialist |
| `.tscn`, `.tres`, project config | godot-specialist |
| Control nodes / CanvasLayer UI | godot-specialist |
| `.gdshader`, VisualShader resources | godot-shader-specialist |
| Native extension files | godot-gdextension-specialist |
