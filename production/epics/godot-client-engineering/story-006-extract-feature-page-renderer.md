# Story 006: Extract Feature Page Renderer

> **Epic**: Godot Client Engineering
> **Status**: Complete
> **Layer**: Presentation
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
**Engine Notes**: Use typed GDScript and preserve current feature page title and renderer behavior.

**Control Manifest Rules (this layer)**:
- Required: Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`.
- Required: Preserve the 432x768 mobile portrait UI contract.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Feature page content refresh clears the content body, sets the page title, and dispatches page renderer calls through a focused renderer module.
- [ ] `Main.gd` still owns content widget construction, row/card helper methods, page-specific render functions, action dispatch, and hotspot handling.
- [ ] Home still does not render feature content below the character display.
- [ ] Existing feature page titles and renderer routing remain behaviorally unchanged.
- [ ] `npm.cmd run check` passes after the extraction.

---

## Implementation Notes

- Create a focused feature page renderer under `godot-client/scripts/`.
- Move `_refresh_page()` title selection, content clearing, and renderer dispatch into the new module.
- Keep `_render_pack_page()`, `_render_market_page()`, `_render_challenge_page()`, `_render_role_page()`, `_render_inventory_page()`, `_render_skill_page()`, `_render_guild_page()`, and `_render_system_page()` in `Main.gd` for this story.
- Do not change feature page body copy, card rows, helper methods, action routing, backend routes, art asset paths, composite texture selection, or hotspot geometry.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Moving page-specific render functions out of `Main.gd`.
- Rewriting content cards, rows, page copy, or visual hierarchy.
- Changing pack, market, role, inventory, challenge, guild, or system state binding.
- Changing locked composite art, page hotspots, or bottom navigation.
- Adding new backend routes or gameplay economy rules.

---

## QA Test Cases

- **AC-1**: Feature page renderer handles refresh orchestration.
  - Given: `_refresh_all()` runs on any supported page.
  - When: feature content is refreshed.
  - Then: content body is cleared, page title is applied, and the matching page renderer callable is invoked through the focused module.
  - Edge cases: missing optional control references do not crash.

- **AC-2**: Home remains content-free.
  - Given: active page is home.
  - When: feature content is refreshed.
  - Then: content title is blank and no feature renderer callable is invoked.
  - Edge cases: returning from a feature page clears stale feature content.

- **AC-3**: Main keeps feature UI construction boundaries.
  - Given: a feature page renderer callable runs.
  - When: it builds cards, rows, and action controls.
  - Then: `Main.gd` still owns the page-specific render functions and helper methods.
  - Edge cases: existing feature titles and routes remain unchanged.

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

- Depends on: Story 005 complete
- Unlocks: pack page live state binding and market page live state binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now requires feature page refresh delegation outside `Main.gd`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
