# Story 007: Pack Page Live State Binding

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
**Engine Notes**: Use typed GDScript and preserve current pack page layout, composites, and hotspot behavior.

**Control Manifest Rules (this layer)**:
- Required: Keep feature-page state data-driven through `active_page`, `pack_view`, `role_view`, and `market_view`.
- Required: Keep pack and market state scoped to the pack and market pages.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Pack page visual cards and record rows are rendered from a normalized live pack state instead of diverging `game_state` and `pack_cards` values.
- [ ] Local pack purchase, open, and list actions update the focused pack card consistently with `game_state`.
- [ ] Backend-synced `pack_cards` still remain the source for the pack list when `/api/player/state` provides packs.
- [ ] Pack and trade state remains scoped to pack/market pages and does not render on home.
- [ ] `npm.cmd run check` passes after the binding change.

---

## Implementation Notes

- Create a focused pack page state binder under `godot-client/scripts/`.
- Use the binder from pack page rendering and local pack action handlers.
- Preserve current pack page layout, page copy, action routes, composite art, hotspot geometry, and backend endpoint usage.
- Do not add or change economy rules; the Node backend remains authoritative for player-safe API state.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Changing pack economy rules, price caps, cooldown logic, settlement logic, or payment semantics.
- Reworking pack composite art, hotspots, or subview flow.
- Moving all pack page render functions out of `Main.gd`.
- Changing market page live binding.
- Adding new backend routes.

---

## QA Test Cases

- **AC-1**: Pack page uses normalized live pack state.
  - Given: `game_state` has a focused pack and `pack_cards` contains backend-synced packs.
  - When: the pack page renders.
  - Then: visual cards and rows use a normalized pack list where the focused card reflects current `game_state`.
  - Edge cases: focused pack is missing from `pack_cards`.

- **AC-2**: Local pack actions keep cards consistent.
  - Given: a local pack purchase, open, or list action runs.
  - When: `_refresh_all()` renders the pack page.
  - Then: the focused card status, price, trade count, and result match `game_state`.
  - Edge cases: opening a burned pack creates a fresh purchased pack first.

- **AC-3**: Backend sync remains authoritative for available pack list.
  - Given: `/api/player/state` returns a `packs` array.
  - When: `PlayerStateMapper` applies the payload.
  - Then: `pack_cards` is rebuilt from that payload and the binder only normalizes the focused card state for display consistency.
  - Edge cases: empty backend packs keep existing fallback data.

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

- Depends on: Story 006 complete
- Unlocks: market page live state binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now requires pack page live-state binding and focus-card synchronization through `PackPageStateBinder`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
