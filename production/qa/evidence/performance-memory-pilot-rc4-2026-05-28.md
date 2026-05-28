# Performance / Memory Pilot: RC4

**Date**: 2026-05-28  
**Workflow Context**: Release Remediation Sprint 001 / RR-006 pilot execution  
**CCGS Workflows**: `perf-profile` + `soak-test` adaptation  
**Build**: `v0.1.0-rc.4` Windows internal archive  
**Executable**: `tmp/rc-smoke-v0.1.0-rc.4-20260528/BraveLegend.exe`  
**Verdict**: PILOT PASS WITH LIMITATIONS  

---

## Scope

This is an automated performance and memory pilot. It does not replace the required 2-hour human-observed soak test defined in `production/qa/performance-soak-memory-protocol-2026-05-27.md`.

The pilot covers:

- 5 headless boot timing runs.
- 10 minutes of visible-window runtime.
- Bottom-navigation page cycling every 10 seconds.
- Process CPU, working set, private memory, and paged memory samples every 2 minutes.

Raw data:

- `production/qa/evidence/rc4-performance-memory-pilot-2026-05-28/boot-timing.json`
- `production/qa/evidence/rc4-performance-memory-pilot-2026-05-28/memory-samples.json`
- `production/qa/evidence/rc4-performance-memory-pilot-2026-05-28/summary.json`

---

## Boot Timing

| Run | Exit Code | Elapsed |
| --- | ---: | ---: |
| 1 | 0 | 2077 ms |
| 2 | 0 | 2034 ms |
| 3 | 0 | 2020 ms |
| 4 | 0 | 2040 ms |
| 5 | 0 | 2036 ms |

**Average**: 2041 ms  
**Failures**: 0 / 5

---

## Memory Samples

| Elapsed | CPU Seconds | Working Set | Private Memory | Notes |
| ---: | ---: | ---: | ---: | --- |
| 0s | 1.953 | 161,234,944 B | 350,605,312 B | Baseline after launch and initial settle. |
| 124s | 10.062 | 183,926,784 B | 378,966,016 B | Expected warm-up growth after page cycling starts. |
| 247s | 18.375 | 188,436,480 B | 387,629,056 B | Near plateau. |
| 361s | 25.812 | 188,514,304 B | 387,637,248 B | Stable against prior sample. |
| 484s | 33.875 | 188,448,768 B | 387,010,560 B | Slight decrease from prior sample. |

Memory trend:

| Metric | Baseline | Final Sample | Delta | Delta % |
| --- | ---: | ---: | ---: | ---: |
| Working Set | 161,234,944 B | 188,448,768 B | +27,213,824 B | +16.88% |
| Private Memory | 350,605,312 B | 387,010,560 B | +36,405,248 B | +10.38% |

After the first 2 minutes, growth slowed and the last three samples stayed around the same working set/private memory range. No monotonic runaway pattern was observed in this 10-minute pilot.

---

## Observations

| Check | Result | Notes |
| --- | --- | --- |
| Boot stability | PASS | 5/5 headless boot runs exited 0. |
| Runtime stability | PASS | Visible-window client remained alive for the pilot duration. |
| Navigation cycling | PASS WITH LIMITATIONS | Script clicked home, role, packs, market, challenge, guild, and system repeatedly. It did not perform human subjective UX/fatigue checks. |
| Memory trend | PASS WITH LIMITATIONS | Warm-up growth remained below the protocol's 20% alert threshold for both working set and private memory during this short pilot. |
| FPS/frame-time | NOT MEASURED | No FPS/frame-time telemetry was available from the packaged executable in this run. |
| Human soak | NOT RUN | Required 2-hour human-observed soak remains pending. |

---

## Release Gate Impact

This pilot improves the performance/memory evidence picture but does not close RR-006 or the release gate soak blocker.

Still required before clean release:

- 2-hour human-observed Windows soak.
- FPS/frame-time observation or accepted tooling limitation.
- QA Lead sign-off.
- Performance Analyst sign-off.
- Bugs filed for any soak issues found.
