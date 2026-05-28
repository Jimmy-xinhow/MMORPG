# FPS / Frame-Time Feasibility: RC4

**Date**: 2026-05-28
**Workflow Context**: Release Remediation Sprint 001 / RR-006 performance evidence follow-up
**CCGS Workflows**: `perf-profile` + `soak-test` adaptation
**Build Context**: `v0.1.0-rc.4` clean worktree source at `C:\tmp\mmorpg-rc4`
**Verdict**: PASS WITH LIMITATIONS

---

## Scope

This pass verifies that Godot 4.4 runtime FPS output can be captured at the project target viewport before the full 2-hour human soak.

This is not packaged executable telemetry, not a human-observed soak, and not a replacement for the RR-006 full soak requirement.

---

## Command

```powershell
tools\godot-4.4\Godot_v4.4-stable_win64_console.exe --path C:\tmp\mmorpg-rc4\godot-client --windowed --resolution 432x768 --print-fps --quit-after 3600 -- --api-base=https://lucky-pack-api-production.up.railway.app
```

---

## Raw Evidence

| File | Purpose |
| --- | --- |
| `production/qa/evidence/rc4-fps-feasibility-2026-05-28/godot-4.4-print-fps.log` | Godot 4.4 console output including FPS lines. |
| `production/qa/evidence/rc4-fps-feasibility-2026-05-28/summary.json` | Parsed FPS/frame-time summary. |

---

## Results

| Metric | Result |
| --- | ---: |
| Exit code | 0 |
| Duration | 63.39 seconds |
| FPS samples | 58 |
| Minimum FPS | 59 |
| Maximum FPS | 60 |
| Average FPS | 59.98 |
| Average frame time derived from FPS | 16.67 ms |

---

## Budget Comparison

| Metric | Budget | Observed | Status |
| --- | --- | --- | --- |
| FPS | 60 fps target | 59.98 average; 59 minimum | PASS WITH LIMITATIONS |
| Frame time | 16.6 ms target | 16.67 ms derived average | PASS WITH LIMITATIONS |
| Viewport | 432x768 logical canvas | `--resolution 432x768` | PASS |

---

## Limitations

- This pass ran the source project from the clean RC4 worktree with the Godot 4.4 console runtime.
- It did not measure the uploaded packaged executable directly.
- It lasted about one minute, not two hours.
- It did not include human fatigue/content-exhaustion observation.
- It does not close RR-006 without the full human-observed soak or explicit owner acceptance of a narrower internal scope.

---

## Release Gate Impact

- [x] FPS/frame-time capture path verified for Godot 4.4 runtime.
- [x] Short FPS/frame-time evidence captured at 432x768.
- [ ] Packaged executable FPS telemetry remains unavailable unless a console export, runtime overlay, external profiler, or owner-approved limitation is accepted.
- [ ] Full 2-hour human-observed soak remains pending.
- [ ] QA Lead and Performance Analyst sign-off remain pending.
