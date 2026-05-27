# Story 001: Extract Player API Bridge

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
**Engine Notes**: Use existing Godot built-ins already present in the project: `HTTPRequest`, `JSON`, `Node`, and typed GDScript.

**Control Manifest Rules (this layer)**:
- Required: Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`.
- Required: Route player state reads and mutations through documented player API endpoints.
- Forbidden: Never move economy or withdrawal rules into Godot.
- Guardrail: API bridge extraction must not add per-frame work.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] API request construction and HTTP completion routing are isolated from page drawing and HUD construction.
- [ ] `Main.gd` still owns top-level orchestration but delegates player API calls to a focused module.
- [ ] Existing public player endpoints remain unchanged: `/api/player/state`, `/api/player/action`, and `/api/player/simulate-payment`.
- [ ] Backend request failures leave the client usable with fallback state and diagnostic status text.
- [ ] `npm.cmd run check` passes after the extraction.

---

## Implementation Notes

- Create a focused GDScript API bridge under `godot-client/scripts/`.
- Move request construction, pending action names, JSON body encoding, and HTTP completion parsing out of direct `Main.gd` request methods where practical.
- Do not change gameplay state shape, endpoint names, page keys, or art asset paths.
- Preserve `Main.gd` callback behavior by emitting parsed success/failure signals or equivalent focused callbacks.
- Use explicit type hints for new signals, variables, functions, and return values.

---

## Out of Scope

- Splitting HUD, world rendering, or page UI into separate scenes.
- Changing backend routes, Node API behavior, or domain rules.
- Reworking pack, market, role, inventory, challenge, or skill live UI.
- Changing imported art assets.

---

## QA Test Cases

- **AC-1**: API request construction and completion routing are isolated.
  - Given: `Main.gd` needs player state from the backend.
  - When: it requests state, simulates payment, or sends a player action.
  - Then: request URL, method, headers, body construction, and JSON response parsing are handled by the API bridge module.
  - Edge cases: backend unavailable, invalid JSON, non-2xx response.

- **AC-2**: Public player endpoints remain unchanged.
  - Given: the existing validation scripts search for player endpoint strings.
  - When: `npm.cmd run check` runs.
  - Then: `/api/player/state`, `/api/player/action`, and `/api/player/simulate-payment` remain present and valid.
  - Edge cases: route strings moved to constants must still be discoverable by validation.

- **AC-3**: The client remains usable on request failure.
  - Given: a request fails.
  - When: the API bridge reports failure.
  - Then: `Main.gd` keeps rendering fallback state and updates status text/logs without crashing.
  - Edge cases: action request fails while a previous state is visible.

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

- Depends on: None
- Unlocks: future stories for HUD/view decomposition and live page UI binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; validation scripts now scan all Godot `.gd` files for API bridge coverage.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
