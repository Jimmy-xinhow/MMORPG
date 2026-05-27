# Story 009: Role/Equipment Live Binding

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
**Engine Notes**: Use typed GDScript and preserve current role page layout, paper doll display, composites, and hotspot behavior.

**Control Manifest Rules (this layer)**:
- Required: Keep feature-page state data-driven through `active_page`, `pack_view`, `role_view`, and `market_view`.
- Required: Keep pack and market state scoped to the pack and market pages.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Role page paper doll and equipment display are rendered from normalized live role/equipment state.
- [ ] Local role equipment, appearance, and pack-open accessory actions synchronize `game_state["equipped"]` and `paper_dolls` through a focused binder.
- [ ] Backend character payload remains the source for backend-synced equipment through `PlayerStateMapper`.
- [ ] Pack and trade state remains scoped to pack/market pages and does not render on home.
- [ ] `npm.cmd run check` passes after the binding change.

---

## Implementation Notes

- Create a focused role/equipment state binder under `godot-client/scripts/`.
- Use the binder from role page rendering and local role/equipment action handlers.
- Keep `PlayerStateMapper` as the backend payload mapper and synchronize the active paper doll after backend state applies.
- Preserve current role page layout, page copy, action routes, composite art, hotspot geometry, and backend endpoint usage.
- Do not add or change RPG rules, equipment rules, inventory rules, or backend routes.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Changing job, class, training, combat, inventory, or skill rules.
- Reworking role composite art, hotspots, or subview flow.
- Moving all role page render functions out of `Main.gd`.
- Changing pack or market live binding.
- Adding new backend routes.

---

## QA Test Cases

- **AC-1**: Role page uses normalized live role/equipment state.
  - Given: `game_state` has player name, gender, and equipped slot values.
  - When: the role page renders.
  - Then: the paper doll showcase uses normalized active role state.
  - Edge cases: `paper_dolls` is empty or missing equipment keys.

- **AC-2**: Local role actions keep equipment and paper dolls consistent.
  - Given: a local equipment toggle, appearance apply/reset, or pack-open accessory action runs.
  - When: `_refresh_all()` renders the role page or home paper doll.
  - Then: `game_state["equipped"]` and the active paper doll equipment are synchronized through the binder.
  - Edge cases: missing accessory key keeps a default slot value.

- **AC-3**: Backend character state remains authoritative for synced equipment.
  - Given: `PlayerStateMapper` applies a backend character payload.
  - When: `_apply_player_state()` completes.
  - Then: the active paper doll reflects backend-mapped equipment without bypassing local normalization.
  - Edge cases: missing character equipment keeps existing slot values.

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

- Depends on: Story 008 complete
- Unlocks: inventory/skills live binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now requires role/equipment live-state rendering and local/backend synchronization through `RoleEquipmentStateBinder`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
