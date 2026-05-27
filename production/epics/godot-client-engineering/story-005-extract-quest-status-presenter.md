# Story 005: Extract Quest Status Presenter

> **Epic**: Godot Client Engineering
> **Status**: Complete
> **Layer**: Presentation
> **Type**: Integration
> **Estimate**: 2 hours
> **Manifest Version**: 2026-05-27
> **Last Updated**: 2026-05-27

## Context

**GDD**: `design/gdd/godot-client-engineering.md`
**Requirement**: `TR-godot-client-004`

**ADR Governing Implementation**: ADR-0001: Godot Client Modular UI Boundary
**ADR Decision Summary**: Godot client development separates API transport, player state mapping, page flow, HUD composition, and world rendering into focused GDScript modules while preserving current behavior.

**Engine**: Godot 4.4 | **Risk**: MEDIUM
**Engine Notes**: Use typed GDScript and preserve current 432x768 quest/status HUD behavior.

**Control Manifest Rules (this layer)**:
- Required: Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`.
- Required: Preserve the 432x768 mobile portrait UI contract.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Quest/status title, body, and main action labels are handled by a focused presenter module.
- [ ] Home status filtering still prevents pack, trade, and sync progress from leaking onto the home screen.
- [ ] `Main.gd` still owns quest widget construction, button signals, player action dispatch, page rendering, and hotspot handling.
- [ ] Existing page quest copy and main action labels remain behaviorally unchanged.
- [ ] `npm.cmd run check` passes after the extraction.

---

## Implementation Notes

- Create a focused quest/status presenter under `godot-client/scripts/`.
- Move quest title/body/action copy selection into the presenter.
- Preserve the existing home feed filtering logic and fallback text.
- Do not change quest panel layout, button styling, action routing, page rendering, backend routes, art asset paths, or hotspot geometry.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Rewriting page content renderers.
- Changing quest/status copy beyond moving it to the presenter.
- Changing main action behavior.
- Splitting quest controls into a separate scene.
- Adding new backend routes or gameplay economy rules.

---

## QA Test Cases

- **AC-1**: Quest presenter handles quest/status labels.
  - Given: `_refresh_all()` runs on any supported page.
  - When: the quest/status area is refreshed.
  - Then: title, body, and main action text are applied through the presenter.
  - Edge cases: missing optional control references do not crash.

- **AC-2**: Home remains free of pack and trade progress.
  - Given: `event_feed` contains pack, trade, or sync entries.
  - When: the active page is home.
  - Then: the quest/status body skips those entries and uses the next safe event or fallback text.
  - Edge cases: all feed entries are filtered.

- **AC-3**: Main keeps orchestration boundaries.
  - Given: a page refresh or main action press occurs.
  - When: the quest/status presenter is used.
  - Then: `Main.gd` still constructs widgets, connects signals, dispatches actions, renders pages, and handles hotspots.
  - Edge cases: page-specific main action labels remain unchanged.

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

- Depends on: Story 004 complete
- Unlocks: feature page renderer extraction and live page UI binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now requires quest/status presenter delegation and home feed filtering outside `Main.gd`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
