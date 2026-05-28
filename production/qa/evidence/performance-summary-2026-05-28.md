# Performance Summary: 2026-05-28

**Build**: `v0.1.0-rc.4` Windows internal archive  
**Pilot Evidence**: `production/qa/evidence/performance-memory-pilot-rc4-2026-05-28.md`  
**Verdict**: PASS WITH LIMITATIONS  

---

## Budget Comparison

| Metric | Budget | Observed | Status |
| --- | --- | --- | --- |
| FPS | 60 fps target | Not measured in packaged pilot | UNKNOWN |
| Frame time | 16.6 ms target | Not measured in packaged pilot | UNKNOWN |
| Memory growth | Alert if >20% after warm-up | Working set +16.88%; private memory +10.38%; last three samples stable | PASS WITH LIMITATIONS |
| Load / boot timing | No formal budget | 5 runs averaged 2041 ms, 0 failures | PASS |
| Runtime stability | No crash/hang | 10-minute visible runtime completed | PASS WITH LIMITATIONS |

---

## Hotspots Observed

| Area | Evidence | Severity | Follow-up |
| --- | --- | --- | --- |
| Initial memory warm-up | Memory rose during first two minutes, then plateaued | Low in pilot | Re-check during full 2-hour soak. |
| FPS/frame-time visibility | Packaged executable pilot did not expose FPS telemetry | Medium evidence gap | Use Godot debugger/monitor, PresentMon, overlay capture, or owner-accepted visual-only observation during full soak. |
| Human fatigue/content exhaustion | Not covered by automation | Medium evidence gap | Full soak must be human-observed. |

---

## Release Gate Impact

- [x] Boot timing pilot evidence captured.
- [x] Short memory trend pilot evidence captured.
- [ ] Full 2-hour soak evidence complete.
- [ ] FPS/frame-time evidence complete or limitation accepted.
- [ ] QA Lead sign-off complete.
- [ ] Performance Analyst sign-off complete.
