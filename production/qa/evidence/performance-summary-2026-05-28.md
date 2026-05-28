# Performance Summary: 2026-05-28

**Build**: `v0.1.0-rc.4` Windows internal archive  
**Pilot Evidence**: `production/qa/evidence/performance-memory-pilot-rc4-2026-05-28.md`  
**FPS Evidence**: `production/qa/evidence/fps-frame-time-feasibility-rc4-2026-05-28.md`
**Verdict**: PASS WITH LIMITATIONS  

---

## Budget Comparison

| Metric | Budget | Observed | Status |
| --- | --- | --- | --- |
| FPS | 60 fps target | Godot 4.4 runtime feasibility pass averaged 59.98 FPS at 432x768; packaged executable FPS still not measured | PASS WITH LIMITATIONS |
| Frame time | 16.6 ms target | Derived average 16.67 ms from Godot 4.4 runtime feasibility pass; packaged executable frame-time still not measured | PASS WITH LIMITATIONS |
| Memory growth | Alert if >20% after warm-up | Working set +16.88%; private memory +10.38%; last three samples stable | PASS WITH LIMITATIONS |
| Load / boot timing | No formal budget | 5 runs averaged 2041 ms, 0 failures | PASS |
| Runtime stability | No crash/hang | 10-minute visible runtime completed | PASS WITH LIMITATIONS |

---

## Hotspots Observed

| Area | Evidence | Severity | Follow-up |
| --- | --- | --- | --- |
| Initial memory warm-up | Memory rose during first two minutes, then plateaued | Low in pilot | Re-check during full 2-hour soak. |
| FPS/frame-time visibility | Godot 4.4 runtime `--print-fps` path verified, but packaged executable pilot did not expose FPS telemetry | Medium evidence gap | Use Godot runtime `--print-fps`, console export, PresentMon, overlay capture, or owner-accepted limitation during full soak. |
| Human fatigue/content exhaustion | Not covered by automation | Medium evidence gap | Full soak must be human-observed. |

---

## Release Gate Impact

- [x] Boot timing pilot evidence captured.
- [x] Short memory trend pilot evidence captured.
- [ ] Full 2-hour soak evidence complete.
- [x] Short Godot 4.4 runtime FPS/frame-time feasibility evidence captured.
- [ ] Packaged executable FPS/frame-time evidence complete or limitation accepted.
- [ ] QA Lead sign-off complete.
- [ ] Performance Analyst sign-off complete.
