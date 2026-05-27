# Adoption Plan

> **Generated**: 2026-05-27
> **Project phase**: Production
> **Engine**: Godot 4.4 + Node backend
> **Template version**: CCGS brownfield scaffold

This plan records the minimum CCGS workflow scaffold added for this existing project.

---

## Step 1: Fixed Blocking Gaps

- [x] Added `.claude/docs/technical-preferences.md` so engine and routing preferences are explicit.
- [x] Added `docs/engine-reference/godot/VERSION.md` from the existing Godot project config.
- [x] Added `design/gdd/game-concept.md` and `design/gdd/systems-index.md`.
- [x] Added `docs/architecture/tr-registry.yaml`.
- [x] Added accepted ADR `docs/architecture/adr-0001-godot-client-modular-ui.md`.
- [x] Added `docs/architecture/control-manifest.md`.
- [x] Added `production/review-mode.txt` and `production/stage.txt`.

---

## Step 2: First Development Track

- [x] Added `production/epics/godot-client-engineering/EPIC.md`.
- [x] Added `production/epics/godot-client-engineering/story-001-extract-player-api-bridge.md`.

---

## Step 3: Next Actions

- [ ] Run story readiness for story 001.
- [ ] Implement story 001 using Godot, GDScript, CCGS dev-story guidance, and the project `godot` / `gdscript-patterns` skills.
- [ ] Run `npm.cmd run check`.

---

## Notes

Existing project documents under `docs/planning/` remain the product and backend source of truth. This scaffold does not rewrite those documents; it adds CCGS-compatible traceability around the next Godot client engineering work.
