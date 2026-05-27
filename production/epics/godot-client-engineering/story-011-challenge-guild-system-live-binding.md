# Story 011: Challenge/Guild/System Live Binding

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
**Engine Notes**: Use typed GDScript and preserve current challenge, guild, system page layout, composites, and hotspot behavior.

**Control Manifest Rules (this layer)**:
- Required: Keep feature-page state data-driven through `active_page`, `pack_view`, `role_view`, and `market_view`.
- Required: Keep pack and market state scoped to the pack and market pages.
- Forbidden: Never leak pack or trade progress onto the home screen.
- Guardrail: Avoid increasing allocations in `_draw()` or `_process()` while refactoring.

---

## Acceptance Criteria

From `design/gdd/godot-client-engineering.md`, scoped to this story:

- [ ] Challenge page visual cards and record rows are rendered from normalized live challenge state.
- [ ] Guild page visual cards and member rows are rendered from normalized live guild state.
- [ ] System page visual cards and settings rows are rendered from normalized live system state.
- [ ] Local challenge, guild, and system hotspot actions synchronize their page state through a focused binder.
- [ ] `npm.cmd run check` passes after the binding change.

---

## Implementation Notes

- Create a focused challenge/guild/system state binder under `godot-client/scripts/`.
- Use the binder from challenge, guild, and system page rendering.
- Use the binder after local challenge, guild, and system actions update `game_state` or page rows.
- Preserve current page layout, page copy, action routes, composite art, hotspot geometry, and backend endpoint usage.
- Do not add or change challenge rewards, guild rules, system settings semantics, RPG economy rules, or backend routes.
- Use explicit type hints for new variables, functions, and return values.

---

## Out of Scope

- Changing challenge ticket costs, boss damage, guild contribution values, reward quantities, or combat formulas.
- Reworking challenge/guild/system composite art, hotspots, or subview flow.
- Moving all challenge, guild, or system render functions out of `Main.gd`.
- Changing pack, market, role, inventory, or skill live binding.
- Adding new backend routes.

---

## QA Test Cases

- **AC-1**: Challenge page uses normalized live challenge state.
  - Given: `game_state` has ticket, boss HP, party power, and reward values.
  - When: the challenge page renders after challenge actions.
  - Then: visual cards and rows use normalized live challenge data.
  - Edge cases: zero tickets keeps a visible no-ticket state without crashing.

- **AC-2**: Guild page uses normalized live guild state.
  - Given: guild donate or guild boss actions update player state.
  - When: the guild page renders.
  - Then: guild cards and rows reflect normalized live guild data.
  - Edge cases: missing guild name keeps fallback copy.

- **AC-3**: System page uses normalized live system state.
  - Given: system toggle is pressed.
  - When: the system page renders.
  - Then: system cards and settings rows reflect normalized local system state.
  - Edge cases: unset system flags use defaults.

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

- Depends on: Story 010 complete
- Unlocks: Godot runtime/editor validation and sprint QA close-out

---

## Completion Notes

**Completed**: 2026-05-27
**Criteria**: 5/5 passing
**Deviations**: None
**Test Evidence**: `npm.cmd run check` passed; Godot prototype validation now requires challenge/guild/system live-state rendering and local action synchronization through `ChallengeGuildSystemStateBinder`.
**Code Review**: Self-review complete against ADR-0001, control manifest, `godot`, and `gdscript-patterns` guidance.
**Residual Risk**: Godot CLI was not available on PATH, so local runtime/editor parse validation was not run in this shell.
