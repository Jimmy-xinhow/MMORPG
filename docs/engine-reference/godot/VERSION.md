# Godot Version Reference

| Field | Value |
| --- | --- |
| **Engine Version** | Godot 4.4 |
| **Project Pinned** | 2026-05-27 |
| **Source** | `godot-client/project.godot` `config/features=PackedStringArray("4.4")` |
| **LLM Knowledge Cutoff** | May 2025 |
| **Risk Level** | MEDIUM - version is near the knowledge cutoff and should be verified against official docs when uncertain |

## Project Constraints

- Main scene: `res://scenes/Main.tscn`
- Logical viewport: 432x768
- Orientation: portrait
- Stretch mode: `canvas_items`
- Rendering method: `gl_compatibility`

## Verification Rule

When changing Godot APIs or project settings, verify with the local Godot runtime if available and run `npm.cmd run check:godot` plus the full `npm.cmd run check` before handoff.
