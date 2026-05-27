# Story 012: Cleanup Unreachable Fallback Render Blocks

> **Epic**: Godot Client Engineering
> **Status**: Complete
> **Layer**: Feature
> **Type**: Integration
> **Estimate**: 2 hours
> **Manifest Version**: 2026-05-27
> **Last Updated**: 2026-05-27

## Context

**GDD**: `design/gdd/godot-client-engineering.md`
**Requirement**: `TR-godot-client-004`

**ADR Governing Implementation**: ADR-0001: Godot Client Modular UI Boundary
**ADR Decision Summary**: Godot client development separates API transport, player state mapping, page flow, HUD composition, and world rendering into focused GDScript modules while preserving current behavior.

**Engine**: Godot 4.4 | **Risk**: LOW
**Engine Notes**: Remove unreachable old fallback render blocks after live binding returns. Preserve current live render output and hotspot behavior.

**Control Manifest Rules (this layer)**:
- Required: Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`.
- Required: Keep feature-page state data-driven through page state and binder modules.
- Forbidden: Never rewrite the scene structure broadly during a narrow cleanup story.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Live-bound feature render functions do not retain unreachable fallback visual-grid blocks after `return`.
- [ ] Market, challenge, inventory, skill, guild, and system pages keep their current binder-driven render paths.
- [ ] Pack, role, home, API, and local action behavior remains unchanged.
- [ ] Godot prototype validation prevents reintroducing unreachable fallback render blocks.
- [ ] `npm.cmd run check` passes after cleanup.

---

## Implementation Notes

- Remove only unreachable fallback render code below live-binding `return` statements in `Main.gd`.
- Do not alter binder APIs, page routes, hotspot geometry, composite art, backend endpoints, or gameplay formulas.
- Update `scripts/validate-godot-prototype.mjs` to reject `return` followed by fallback `_add_visual_grid` blocks.
- Preserve explicit type hints and existing live render flow.

---

## Out of Scope

- Moving render functions out of `Main.gd`.
- Changing UI copy, composite art, hotspots, gameplay rules, economy values, or backend routes.
- Refactoring unrelated helper functions.
- Running Godot editor/runtime validation unless a Godot CLI is available.

---

## QA Test Cases

- **AC-1**: No unreachable fallback visual grids remain.
  - Given: `Main.gd` has live-bound feature render functions.
  - When: static validation scans the script.
  - Then: it rejects `return` immediately followed by fallback `_add_visual_grid` blocks.
  - Edge cases: legitimate early returns outside render fallback cleanup are not targeted.

- **AC-2**: Live render paths remain intact.
  - Given: market, challenge, inventory, skill, guild, and system pages render.
  - When: `npm.cmd run check:godot` runs.
  - Then: binder-driven render assertions still pass.
  - Edge cases: pack and role pages remain unaffected.

- **AC-3**: Project smoke remains green.
  - Given: cleanup removes dead code only.
  - When: `npm.cmd run check` runs.
  - Then: all prototype, Node, UI, API, and production smoke checks pass.

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

- Depends on: Story 011 complete
- Unlocks: Godot runtime/editor validation and sprint QA close-out

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now rejects unreachable fallback `_add_visual_grid` blocks after live render returns.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
