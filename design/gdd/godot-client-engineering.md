# Godot Client Engineering GDD

**Status**: Approved

## Overview

The current Godot internal client has MVP art integration and player API connectivity, but the main script concentrates API transport, state mapping, UI construction, page flow, and rendering. This system incrementally modularizes the client while preserving current behavior.

## Player Fantasy

Players should experience the same compact MMORPG screen while engineering work happens behind the scenes. Refactors must not remove the character stage, HUD, bottom navigation, feature pages, or player-safe backend actions.

## Detailed Design

- Keep `Main.tscn` as the entry scene during the first engineering pass.
- Extract API transport before deeper page or scene splits.
- Preserve active page and sub-view state keys.
- Keep fallback local state for internal testing when the backend is unavailable.
- Keep all player actions routed through documented backend endpoints.
- Keep imported production art paths stable.

## Formulas

- No new gameplay formulas are introduced by this engineering system.
- Performance target remains 60 fps on the 432x768 logical canvas.

## Edge Cases

- Duplicate HTTP requests must not be fired while a previous request is pending.
- Failed state fetch or action request must not crash the client.
- Extracted modules must not change current smoke-test-visible route strings or page keys.
- `Main.gd` orchestration may remain temporarily large if behavior-preserving extraction would otherwise become risky.

## Dependencies

- `docs/architecture/adr-0001-godot-client-modular-ui.md`
- `docs/architecture/control-manifest.md`
- `docs/architecture/tr-registry.yaml`
- `godot-client/README.md`
- `godot-client/scripts/Main.gd`

## Tuning Knobs

- API base URL
- HTTP pending action name
- Request headers and JSON body construction
- Active page and sub-view values
- Local fallback state values

## Acceptance Criteria

- API request construction and HTTP completion routing are isolated from page drawing and HUD construction.
- `Main.gd` still owns top-level orchestration for the first pass but delegates player API calls to a focused module.
- Existing public player endpoints remain unchanged: `/api/player/state`, `/api/player/action`, and `/api/player/simulate-payment`.
- Backend request failures leave the client usable with fallback state and diagnostic status text.
- `npm.cmd run check` passes after each extraction story.
