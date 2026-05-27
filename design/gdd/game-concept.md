# Lucky Pack Idle RPG - Game Concept

**Status**: Approved

## Overview

Lucky Pack Idle RPG is a mobile portrait internal test client and backend MVP for a bright fantasy idle MMORPG loop. The player-facing Godot client presents character progression, pack flows, market/trading views, challenges, role/equipment screens, inventory, and skills. The Node backend remains the authoritative rule and API layer for pack state, ledger safety, risk controls, and player-safe RPG actions.

## Player Fantasy

Players see a compact fantasy MMORPG screen with a readable adventurer, RPG resources, status log, function navigation, enemy/challenge targets, equipment visibility, and lucky pack interactions. The fantasy is game progression and collectible discovery, not cash-out or external asset speculation.

## Detailed Design

- Godot runs a 432x768 portrait internal client.
- Node exposes public player-safe endpoints for state, actions, simulated payment, and pack issue flows.
- Pack, market, challenge, role, inventory, and skill pages are feature pages, not home-screen overlays.
- RPG rewards are gameplay resources only and cannot become withdrawable value.
- Production art assets are imported PNG/sprite sheet/9-slice resources under `godot-client/assets/production/`.

## Formulas

- Skill upgrade cost follows `upgradeCost(level) = baseCost * level ^ growthExponent` in backend rules.
- First-release skill defaults are documented in `docs/planning/12-phase11-rpg-content-expansion.md`.
- Godot does not calculate authoritative economy values; it displays backend-provided player-safe state.

## Edge Cases

- Backend unavailable: Godot must keep a local fallback state and avoid crashing.
- Feature pages must not leak pack/trade state onto home.
- RPG reward presentation must not imply player income, withdrawal, cash-out, or external marketplace value.
- Imported art may be visually first-pass; code must preserve integration paths while art polish continues.

## Dependencies

- `docs/planning/05-mvp-scope.md`
- `docs/planning/12-phase11-rpg-content-expansion.md`
- `docs/art-completion-checklist.md`
- `godot-client/README.md`
- `src/server.js`
- `godot-client/scripts/Main.gd`

## Tuning Knobs

- API base URL
- Active page and sub-view keys
- Player class/stat configuration from backend
- Skill upgrade cost parameters from backend
- Content flags and rollout percentages from backend
- Art asset paths and texture imports

## Acceptance Criteria

- Godot client reads player-safe state from the backend and can still render a fallback state when offline.
- Home screen shows character, scene, HUD, status log, enemy target, and function navigation without pack/trade progress.
- Pack, market, challenge, role, inventory, and skill pages remain reachable from bottom navigation.
- RPG rewards and pack actions shown in Godot cannot create or imply withdrawable value.
- Full project verification passes through `npm.cmd run check`.
