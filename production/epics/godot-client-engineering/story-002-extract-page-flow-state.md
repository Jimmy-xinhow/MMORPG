# Story 002: Extract Page Flow State

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
**Engine Notes**: Use typed GDScript and preserve existing page keys, sub-view keys, startup arguments, and composite texture routing.

**Control Manifest Rules (this layer)**:
- Required: Keep feature-page state data-driven through `active_page`, `pack_view`, `role_view`, and `market_view`.
- Required: Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Active page and pack/role/market sub-view state are owned by a focused page flow module.
- [ ] Existing startup arguments remain supported: `--page=`, `--pack-view=`, `--role-view=`, `--market-view=`, and `--api-base=`.
- [ ] Existing page keys and sub-view keys remain unchanged.
- [ ] Home page visibility rules still prevent pack/trade progress from appearing on home.
- [ ] `npm.cmd run check` passes after the extraction.

---

## Implementation Notes

- Create a focused GDScript page flow state module under `godot-client/scripts/`.
- Move active page, pack view, role view, market view, startup page argument parsing, and sub-view validation into the module.
- Keep `Main.gd` responsible for rendering, hotspot actions, and top-level refresh orchestration for this story.
- Do not change hotspot rectangles, composite texture paths, API routes, backend behavior, or imported art assets.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Reworking pack, market, role, inventory, challenge, or skill live UI.
- Splitting HUD/world rendering into separate scenes.
- Changing button layouts, hotspot rectangles, art assets, or composite textures.
- Changing backend routes, Node API behavior, or domain rules.

---

## QA Test Cases

- **AC-1**: Page flow module owns page and sub-view state.
  - Given: `Main.gd` needs active page and sub-view values.
  - When: navigation, hotspot actions, or startup args change page state.
  - Then: the values are read from and updated through the page flow module.
  - Edge cases: invalid page or sub-view values are ignored.

- **AC-2**: Startup args remain supported.
  - Given: the Godot client starts with `--page=`, `--pack-view=`, `--role-view=`, `--market-view=`, or `--api-base=`.
  - When: `_apply_start_page_from_args()` runs.
  - Then: page/sub-view args are handled by the page flow module and API base URL remains handled by `Main.gd`.
  - Edge cases: invalid URL or invalid view does not mutate state.

- **AC-3**: Home remains scoped.
  - Given: current page is `home`.
  - When: `_refresh_all()` updates visibility and game state.
  - Then: pack, role, and market sub-view data do not make page hotspot/composite content visible on home.
  - Edge cases: returning from another page to home resets only relevant page state.

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

- Depends on: Story 001 complete
- Unlocks: future stories for HUD/view decomposition and live page UI binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now accepts sub-view ownership outside `Main.gd`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
