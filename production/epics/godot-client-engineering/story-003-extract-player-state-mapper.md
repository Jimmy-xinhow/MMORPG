# Story 003: Extract Player State Mapper

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
**Engine Notes**: Use typed GDScript and preserve the current player-safe payload shape from `/api/player/state` and `/api/player/action`.

**Control Manifest Rules (this layer)**:
- Required: Use focused GDScript modules for reusable responsibilities instead of adding unrelated logic to `Main.gd`.
- Required: Route player state reads and mutations through documented player API endpoints.
- Forbidden: Never move economy or withdrawal rules into Godot.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Backend player payload mapping is isolated from page drawing, HUD construction, and API transport.
- [ ] The mapper consumes current player-safe fields: `player`, `balances`, `tickets`, `tradingSession`, `character`, `inventory`, `skills`, `combat`, and `packs`.
- [ ] `Main.gd` still owns event display and top-level refresh orchestration.
- [ ] Existing UI-visible state remains unchanged after successful backend sync.
- [ ] `npm.cmd run check` passes after the extraction.

---

## Implementation Notes

- Create a focused GDScript state mapper under `godot-client/scripts/`.
- Move player payload dictionary parsing and target data updates out of `Main.gd`.
- Keep `Main.gd` responsible for `_push_event()` and `_refresh_all()`.
- Do not change backend routes, payload field names, local fallback state shape, art paths, or page keys.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Reworking page rendering, HUD layout, or world drawing.
- Changing backend routes, Node API behavior, or domain rules.
- Changing local gameplay action helpers such as training, pack purchase, market buy/list, or guild actions.
- Changing imported art assets.

---

## QA Test Cases

- **AC-1**: Player payload mapping is isolated.
  - Given: the Godot client receives a backend player payload.
  - When: `Main.gd` applies the payload.
  - Then: dictionary parsing and mapped state updates happen in the mapper module.
  - Edge cases: missing optional sections, empty inventory, empty skills, empty packs.

- **AC-2**: Current player-safe fields are consumed.
  - Given: a payload includes player, balances, tickets, trading session, character, inventory, skills, combat, and packs.
  - When: the mapper applies it.
  - Then: `game_state`, `paper_dolls`, `inventory_items`, `skill_rows`, and `pack_cards` are updated as before.
  - Edge cases: character equipment is partially present.

- **AC-3**: Main remains the orchestration owner.
  - Given: mapping returns event messages.
  - When: `Main.gd` receives them.
  - Then: `Main.gd` pushes UI events and calls `_refresh_all()`.
  - Edge cases: combat logs must still be pushed before the final sync message.

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

- Depends on: Story 002 complete
- Unlocks: future stories for HUD/view decomposition and live page UI binding

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now accepts player-safe state mapping outside `Main.gd`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
