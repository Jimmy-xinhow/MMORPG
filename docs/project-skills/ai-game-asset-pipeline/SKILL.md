---
name: ai-game-asset-pipeline
description: Use when producing game art through Scenario, Layer AI, Makko AI, imagegen, ComfyUI, or Stable Diffusion WebUI, including tool order, prompt format, consistency rules, and fallback behavior.
---

# AI Game Asset Pipeline

Use this skill when producing new raster art or batches of related assets.

## Tool Order

1. Scenario or Layer AI for consistent production batches.
2. Makko AI for 2D character and sprite drafts.
3. imagegen for fast concept direction or missing one-off assets.
4. ComfyUI or Stable Diffusion WebUI only as local low-VRAM fallback.
5. Krita and Aseprite cleanup before Godot import.

## Prompt Contract

Every prompt must include:

- original RO-like 2D/2.5D mobile MMORPG
- category and exact asset name
- transparent background requirement when needed
- mobile readability at 48x48 for icons or 432x768 for scenes
- no text, watermark, logo, copyrighted character, or copied RO asset

## Acceptance

- Output is not production-ready until cleaned and layered.
- Raw AI output must be marked draft.
- Final files must be saved as PNG, sprite sheet, atlas, or 9-slice UI texture.
