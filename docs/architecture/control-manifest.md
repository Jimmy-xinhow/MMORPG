# Control Manifest

> **Engine**: Godot 4.4
> **Last Updated**: 2026-05-27
> **Manifest Version**: 2026-05-27
> **ADRs Covered**: ADR-0001
> **Status**: Active - regenerate with `/create-control-manifest update` when ADRs change

This manifest is the programmer quick-reference extracted from accepted ADRs, technical preferences, and the Godot version reference.

---

## Foundation Layer Rules

### Required Patterns

- Keep the Node backend authoritative for game rules, economy constraints, and player-safe API state. Source: ADR-0001
- Route player state reads and mutations through the documented player API endpoints. Source: ADR-0001
- Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`. Source: ADR-0001

### Forbidden Approaches

- Never move economy or withdrawal rules into Godot. Source: ADR-0001
- Never rewrite the scene structure broadly during a narrow extraction story. Source: ADR-0001

### Performance Guardrails

- API bridge extraction must not add per-frame work. Source: ADR-0001

---

## Core Layer Rules

### Required Patterns

- Preserve existing player-safe action flow unless a story explicitly changes behavior. Source: ADR-0001
- Keep gameplay reward and economy state non-withdrawable in Godot-facing flows. Source: `.claude/docs/technical-preferences.md`

### Forbidden Approaches

- Never hardcode new gameplay economy rules in Godot. Source: `.claude/docs/technical-preferences.md`

---

## Feature Layer Rules

### Required Patterns

- Keep feature-page state data-driven through `active_page`, `pack_view`, `role_view`, and `market_view`. Source: ADR-0001
- Keep pack and market state scoped to the pack and market pages. Source: ADR-0001

### Forbidden Approaches

- Never leak pack or trade progress onto the home screen. Source: ADR-0001

---

## Presentation Layer Rules

### Required Patterns

- Preserve the 432x768 mobile portrait UI contract. Source: `docs/engine-reference/godot/VERSION.md`
- Use imported production art assets for player-facing MVP art. Source: `.claude/docs/technical-preferences.md`
- Use explicit type hints for new GDScript variables, functions, signals, and return values. Source: `gdscript-patterns`

### Forbidden Approaches

- Never replace production art imports with CSS, HTML, or procedural debug geometry for player-facing MVP art. Source: `.claude/docs/technical-preferences.md`
- Avoid increasing allocations in `_draw()` or `_process()` while refactoring. Source: ADR-0001

---

## Global Rules (All Layers)

### Naming Conventions

| Element | Convention | Example |
| --- | --- | --- |
| Classes | PascalCase | `PlayerApiClient` |
| Variables | snake_case | `api_base_url` |
| Functions | snake_case | `_request_player_state` |
| Signals | snake_case past tense | `player_state_received` |
| Files | snake_case matching class | `player_api_client.gd` |
| Constants | UPPER_SNAKE_CASE | `VIEWPORT_SIZE` |

### Performance Budgets

| Target | Value |
| --- | --- |
| Framerate | 60 fps target |
| Frame budget | 16.6 ms |
| Viewport | 432x768 portrait |

### Approved Libraries / Addons

- Godot built-ins only for this client extraction pass.

### Forbidden APIs

- None listed. Verify uncertain Godot 4.4 APIs against official docs or local runtime before use.
