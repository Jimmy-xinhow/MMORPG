---
name: paper-doll-character-system
description: Use when designing or implementing the male/female paper doll system, equipment layers, character display anchors, and idle/combat/hit visual states.
---

# Paper Doll Character System

Use this skill for character art, equipment visibility, and Godot paper doll integration.

## Layer Contract

- base body
- hair/head
- outfit or armor
- weapon
- headgear
- accessory
- cloak or back item

## Required States

- idle
- combat
- hit
- reward or item gain
- walk
- cast
- death or faint
- loot pickup

## Godot Integration

- Godot reads layered PNG or sprite sheet assets.
- Equipment changes must visibly alter the character.
- At least one male and one female base must exist before visual MVP approval.
- Placeholder `_draw()` bodies cannot pass production art review.
