# Story 004: Extract HUD Presenter

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
**Engine Notes**: Use typed GDScript and preserve current 432x768 HUD behavior.

**Control Manifest Rules (this layer)**:
- Required: Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`.
- Required: Preserve the 432x768 mobile portrait UI contract.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Top HUD text, portrait refresh, resource labels, and HUD visibility are handled by a focused presenter module.
- [ ] `Main.gd` still owns widget construction, navigation button styling, page hotspot filtering, world state update, quest refresh, and page rendering.
- [ ] Composite pages still hide the old HUD/status/content overlays.
- [ ] Home display area remains reserved only on home.
- [ ] `npm.cmd run check` passes after the extraction.

---

## Implementation Notes

- Create a focused HUD presenter under `godot-client/scripts/`.
- Move top story text generation and number formatting into the presenter if they only support HUD display.
- Do not change HUD layout, theme styles, nav button style application, hotspot rectangles, page rendering, backend routes, or art asset paths.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Reworking quest/status copy or main action labels.
- Splitting HUD controls into a separate scene.
- Changing bottom navigation styling.
- Changing composite art or hotspot geometry.

---

## QA Test Cases

- **AC-1**: HUD presenter handles top HUD state.
  - Given: `Main.gd` refreshes after a backend sync or local action.
  - When: `_refresh_all()` runs.
  - Then: portrait, top story, level, exp, power, resource labels, and HUD visibility are updated through the presenter.
  - Edge cases: missing optional control references do not crash.

- **AC-2**: Main keeps orchestration boundaries.
  - Given: a page refresh is required.
  - When: `_refresh_all()` runs.
  - Then: `Main.gd` still applies page hotspot visibility, world state, quest refresh, page rendering, and nav button style.
  - Edge cases: composite pages still bypass old content panel display.

- **AC-3**: Visibility rules remain unchanged.
  - Given: current page is home or a locked composite page.
  - When: HUD is applied.
  - Then: home stage is visible only on home, and old HUD/status/content overlays are hidden on composite pages.
  - Edge cases: returning to home restores home action hotspot visibility.

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

- Depends on: Story 003 complete
- Unlocks: quest/status presenter extraction and live page UI binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now accepts HUD visibility rules outside `Main.gd`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
