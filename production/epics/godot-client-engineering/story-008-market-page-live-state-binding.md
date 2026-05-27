# Story 008: Market Page Live State Binding

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
**Engine Notes**: Use typed GDScript and preserve current market page layout, composites, and hotspot behavior.

**Control Manifest Rules (this layer)**:
- Required: Keep feature-page state data-driven through `active_page`, `pack_view`, `role_view`, and `market_view`.
- Required: Keep pack and market state scoped to the pack and market pages.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Market page visual cards and record rows are rendered from normalized live market state.
- [ ] Local market list, purchase, and refresh actions update `market_rows` consistently for the next market render.
- [ ] Backend-synced session text in `game_state["session"]` remains the source for market session display.
- [ ] Pack and trade state remains scoped to pack/market pages and does not render on home.
- [ ] `npm.cmd run check` passes after the binding change.

---

## Implementation Notes

- Create a focused market page state binder under `godot-client/scripts/`.
- Use the binder from market page rendering and local market action handlers.
- Preserve current market page layout, page copy, action routes, composite art, hotspot geometry, and backend endpoint usage.
- Do not add or change economy rules; the Node backend remains authoritative for player-safe API state.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Changing trading economy rules, listing caps, cooldown logic, settlement logic, or payment semantics.
- Reworking market composite art, hotspots, or subview flow.
- Moving all market page render functions out of `Main.gd`.
- Changing pack page live binding.
- Adding new backend routes.

---

## QA Test Cases

- **AC-1**: Market page uses normalized live market state.
  - Given: `game_state` has session and focus pack values and `market_rows` contains visible rows.
  - When: the market page renders.
  - Then: visual cards and rows use normalized live market data.
  - Edge cases: `market_rows` is empty.

- **AC-2**: Local market actions keep rows consistent.
  - Given: a local market list, purchase, or refresh action runs.
  - When: `_refresh_all()` renders the market page.
  - Then: the market row list reflects the action without changing backend rules.
  - Edge cases: listing the focused pack when no matching row exists.

- **AC-3**: Session display remains backend-driven.
  - Given: `PlayerStateMapper` applies a backend `tradingSession.status`.
  - When: the market page renders.
  - Then: market session visual state uses `game_state["session"]`.
  - Edge cases: missing session data keeps existing fallback text.

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

- Depends on: Story 007 complete
- Unlocks: role/equipment live binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now requires market page live-state rendering and row synchronization through `MarketPageStateBinder`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
