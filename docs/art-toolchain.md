# Game Art Toolchain

## Decision

The project uses an external-first art pipeline. Godot is the game integration tool only; it must not be used as the primary art production tool.

## Primary Tools

| Stage | Tool | Role |
| --- | --- | --- |
| Art direction | imagegen, Scenario, Layer AI | style bible, concept art, first-pass asset direction |
| Consistent asset production | Scenario or Layer AI | character, scene, UI, item, skill, and pack asset batches |
| 2D character and sprite draft | Makko AI | first-pass 2D character, sprite, and simple animation drafts |
| Cleanup and layering | Krita | paint-over, line cleanup, transparent PNG, layer separation, lighting consistency |
| Sprite sheet production | Aseprite | frame cleanup, anchors, animation tags, sprite sheet export |
| Local fallback | ComfyUI or Stable Diffusion WebUI | low-VRAM fallback for concept, img2img, and repair work |
| Game integration | Godot 4 | import PNG, sprite sheets, atlas, 9-slice UI, play animations, wire gameplay |

## Tool Rules

- Godot may import, display, animate, and compose assets.
- Godot `_draw()` geometry may remain only for debug, prototype, or temporary layout guides.
- Formal production art must come from raster assets: PNG, sprite sheet, atlas, or 9-slice UI textures.
- Current script-generated assets are `PLACEHOLDER_NOT_SHIPPABLE` and cannot be called production-ready art.
- CSS, HTML, and web UI are forbidden for player-facing game art.
- External payment integration is deferred, but internal economy visuals must still have real game-style assets.

## Local Hardware Constraint

The available GPU is NVIDIA GTX 1660 Ti with 6 GB VRAM. Local ComfyUI or Stable Diffusion WebUI can be used only with low-VRAM workflows and must not be the only asset production path.

## Source Notes

- Scenario: game asset generation and consistent asset infrastructure.
- Layer AI: game art production workspace for creative teams.
- Makko AI: 2D game art and game-ready asset drafting.
- Krita: open-source painting and cleanup.
- Aseprite: sprite and animation editing.
- ComfyUI / Stable Diffusion WebUI: local open-source fallback.
