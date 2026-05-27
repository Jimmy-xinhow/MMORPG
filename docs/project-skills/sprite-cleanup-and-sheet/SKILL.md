---
name: sprite-cleanup-and-sheet
description: Use when cleaning AI-generated 2D art with Krita or Aseprite, preparing transparent PNGs, sprite sheets, anchor points, animation tags, and mobile-readable game assets.
---

# Sprite Cleanup And Sheet

Use this skill after AI generation and before Godot import.

## Workflow

1. Remove background and save transparent PNG.
2. Clean silhouette, hands, face, weapons, and small icon details.
3. Normalize canvas size and subject padding.
4. Separate character layers: base body, hair/head, outfit, weapon, accessory.
5. For animation, export sprite sheet with frame size, anchor point, and animation tag notes.
6. Reject assets that blur, overlap, or become unreadable at mobile size.

## Minimum Checks

- alpha channel present
- no chroma-key fringe
- consistent light direction
- subject readable at target display size
- file name follows lowercase kebab-case
