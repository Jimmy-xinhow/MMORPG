# 勇者傳說 Brave Legend Godot Internal Test Client

This is a Godot 4.x mobile portrait internal test client for the player-facing idle RPG interface.

## Open

1. Install Godot 4.x.
2. Open `godot-client/project.godot`.
3. Run the main scene.

The client is designed as a game-engine screen:

- top profile/story/resource HUD
- center character stage drawn by Godot
- quest/status panel
- content pages for the lucky pack gameplay, market, challenge, role, inventory, and skills
- bottom mobile navigation

The Node backend remains the rule/API layer. Godot reads and mutates the player-safe game state through:

- `GET /api/player/state`
- `POST /api/player/action`
- `POST /api/player/simulate-payment`

Local API:

```powershell
npm.cmd run start
npm.cmd run godot:open
```

Online internal test API:

```powershell
npm.cmd run godot:open:online
```

Or pass a target backend explicitly:

```powershell
godot --path godot-client -- --api-base=https://lucky-pack-api-production.up.railway.app
```
