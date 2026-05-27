---
name: game-ui-art-integration
description: Use when turning UI art into Godot HUD, panels, bottom navigation, 9-slice frames, page backgrounds, and player-friendly mobile game screens.
---

# Game UI Art Integration

Use this skill when replacing prototype UI with production UI art.

## Workflow

1. Prepare UI art as PNG or 9-slice textures.
2. Assign each UI piece to a player-facing purpose: HUD, log panel, bottom nav, feature tab, inventory grid, market card, pack result, or challenge screen.
3. Import into Godot through TextureRect, Sprite2D, AtlasTexture, or StyleBoxTexture.
4. Keep passive status displays visually different from buttons.
5. Keep feature pages separate from the home character scene.

## Forbidden

- engineering/admin panels in player UI
- fake buttons with no action
- pack ownership or trade progress on home
- CSS/HTML as player game art
