# ADR-0001: Godot Client Modular UI Boundary

## Status

Accepted

## Summary

The Godot internal test client remains the player-facing game-engine shell, while the Node backend remains authoritative for game rules, economy constraints, and player-safe API state.

## GDD Requirements Addressed

- `TR-godot-client-001`
- `TR-godot-client-002`
- `TR-godot-client-003`
- `TR-godot-client-004`

## Decision

Godot client development will separate API transport, player state mapping, page flow, HUD composition, and world rendering into focused GDScript modules. `Main.gd` may continue to orchestrate the current single-scene prototype, but new work must reduce direct coupling instead of adding more unrelated responsibilities to the file.

The Node backend remains the rule/API layer. Godot must use documented player-safe endpoints and must not implement new economy or withdrawal rules locally.

## Implementation Guidelines

- Create focused GDScript files for reusable responsibilities before adding more logic to `Main.gd`.
- Keep request construction, pending action names, response decoding, and HTTP completion handling inside an API bridge module.
- Keep screen/page selection data-driven through state fields such as `active_page`, `pack_view`, `role_view`, and `market_view`.
- Preserve current visual behavior while extracting modules unless a story explicitly changes UI behavior.
- Use explicit type hints for new variables, functions, signals, and return values.
- Keep feature-page economy presentation scoped to the feature pages; home must not show pack/trade progress.
- Route player actions through the backend endpoints documented in `godot-client/README.md`.

## Alternatives Considered

- Keep all Godot behavior in `Main.gd`. Rejected because it makes pack, market, role, inventory, challenge, skill, API, and rendering work conflict-prone.
- Move game rules into Godot. Rejected because product and ledger rules are already enforced by the Node backend and must remain authoritative.
- Rewrite the Godot scene into many scenes immediately. Rejected for the first engineering pass because it increases risk while art integration is still being visually reviewed.

## ADR Dependencies

- Depends On: None

## Engine Compatibility

- Engine: Godot 4.4
- Language: GDScript
- Knowledge Risk: MEDIUM
- Post-Cutoff APIs Used: none introduced by this ADR
- Compatibility Notes: Use built-in `HTTPRequest`, `JSON`, `Node`, `Control`, `CanvasLayer`, and `Texture2D` APIs already present in the project.

## Performance Implications

- API bridge extraction is not expected to add per-frame work.
- Rendering changes must avoid increasing per-frame allocations in `_draw()` or `_process()`.
- The 432x768 mobile portrait canvas and current smoke-test expectations must remain intact.
