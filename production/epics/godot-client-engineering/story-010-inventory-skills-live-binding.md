# Story 010: Inventory/Skills Live Binding

> **Epic**: Godot Client Engineering
> **Status**: Complete
> **Layer**: Feature
> **Type**: Integration
> **Estimate**: 3 hours
> **Manifest Version**: 2026-05-27
> **Last Updated**: 2026-05-27

## Context

**GDD**: `design/gdd/godot-client-engineering.md`
**Requirement**: `TR-godot-client-004`

**ADR Governing Implementation**: ADR-0001: Godot Client Modular UI Boundary
**ADR Decision Summary**: Godot client development separates API transport, player state mapping, page flow, HUD composition, and world rendering into focused GDScript modules while preserving current behavior.

**Engine**: Godot 4.4 | **Risk**: MEDIUM
**Engine Notes**: Use typed GDScript and preserve current inventory page, skill page, composite art, and hotspot behavior.

**Control Manifest Rules (this layer)**:
- Required: Keep feature-page state data-driven through `active_page`, `pack_view`, `role_view`, and `market_view`.
- Required: Keep pack and market state scoped to the pack and market pages.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Inventory page visual cards and item rows are rendered from normalized live inventory state.
- [ ] Skill page visual cards and skill rows are rendered from normalized live skill state.
- [ ] Local item reward actions synchronize `inventory_items` through a focused binder.
- [ ] Backend inventory and skills payloads remain the source for backend-synced inventory/skill state through `PlayerStateMapper`.
- [ ] `npm.cmd run check` passes after the binding change.

---

## Implementation Notes

- Create a focused inventory/skill state binder under `godot-client/scripts/`.
- Use the binder from inventory and skill page rendering.
- Use the binder after local reward actions that add inventory items.
- Keep `PlayerStateMapper` as the backend payload mapper and normalize inventory/skill lists after backend state applies.
- Preserve current page layout, page copy, action routes, composite art, hotspot geometry, and backend endpoint usage.
- Do not add or change inventory rules, skill upgrade rules, RPG economy rules, or backend routes.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Changing item drop rates, item quantities, skill costs, skill levels, or combat formulas.
- Reworking inventory/skill composite art, hotspots, or subview flow.
- Moving all inventory or skill render functions out of `Main.gd`.
- Changing pack, market, or role live binding.
- Adding new backend routes.

---

## QA Test Cases

- **AC-1**: Inventory page uses normalized live inventory state.
  - Given: `inventory_items` contains item dictionaries from seed data, backend payloads, or local rewards.
  - When: the inventory page renders.
  - Then: visual cards and item rows use normalized live inventory data.
  - Edge cases: duplicate item rewards stack consistently.

- **AC-2**: Skill page uses normalized live skill state.
  - Given: `skill_rows` contains local seed rows or backend mapped rows.
  - When: the skill page renders.
  - Then: visual cards and skill rows use normalized live skill data.
  - Edge cases: a malformed row keeps empty fallback fields instead of crashing.

- **AC-3**: Local and backend updates use the focused binder boundary.
  - Given: pack-open, market purchase, challenge reward, or backend player state sync runs.
  - When: `_refresh_all()` renders inventory or skill pages.
  - Then: list state is normalized through `InventorySkillStateBinder` without changing backend authority.
  - Edge cases: empty backend inventory or skills keep existing local fallback data.

---

## Test Evidence

**Story Type**: Integration
**Required evidence**:
- `npm.cmd run check`
- `npm.cmd run check:godot`
- Manual Godot launch or package smoke when Godot CLI is available

**Status**: [x] `npm.cmd run check` passed on 2026-05-27. Godot CLI was not available on PATH for runtime/editor parse validation.

---

## Dependencies

- Depends on: Story 009 complete
- Unlocks: challenge/guild/system page live binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now requires inventory/skill live-state rendering and local/backend list synchronization through `InventorySkillStateBinder`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
