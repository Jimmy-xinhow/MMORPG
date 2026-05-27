# Epic: Godot Client Engineering

> **Status**: Ready
> **Layer**: Presentation
> **GDD**: `design/gdd/godot-client-engineering.md`
> **Governing ADRs**: ADR-0001

## Overview

Incrementally modularize the Godot internal test client while preserving current MVP behavior, art integration, player-safe API routes, and smoke-test coverage.

## GDD Requirements

| TR-ID | Requirement | Priority |
| --- | --- | --- |
| TR-godot-client-001 | Godot uses the Node backend as the authoritative player-safe API layer. | Must Have |
| TR-godot-client-002 | Godot preserves the 432x768 mobile portrait interface. | Must Have |
| TR-godot-client-003 | Home does not leak pack or trade progress. | Must Have |
| TR-godot-client-004 | Godot source becomes modular enough for live feature pages to evolve safely. | Must Have |

## Stories

| # | Story | Type | Status | ADR |
| --- | --- | --- | --- | --- |
| 001 | Extract Player API Bridge | Integration | Complete | ADR-0001 |
| 002 | Extract Page Flow State | Integration | Complete | ADR-0001 |
| 003 | Extract Player State Mapper | Integration | Complete | ADR-0001 |
| 004 | Extract HUD Presenter | Integration | Complete | ADR-0001 |
| 005 | Extract Quest Status Presenter | Integration | Complete | ADR-0001 |
| 006 | Extract Feature Page Renderer | Integration | Complete | ADR-0001 |
| 007 | Pack Page Live State Binding | Integration | Complete | ADR-0001 |
| 008 | Market Page Live State Binding | Integration | Complete | ADR-0001 |
| 009 | Role/Equipment Live Binding | Integration | Complete | ADR-0001 |
| 010 | Inventory/Skills Live Binding | Integration | Complete | ADR-0001 |
| 011 | Challenge/Guild/System Live Binding | Integration | Complete | ADR-0001 |
| 012 | Cleanup Unreachable Fallback Render Blocks | Integration | Complete | ADR-0001 |
