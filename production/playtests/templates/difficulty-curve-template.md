# Playtest Report Template: Difficulty Curve

**Template Status**: Template only - not completed playtest evidence  
**Workflow**: CCGS `playtest-report new` adapted for RR-012  
**Focus**: Early-to-mid progression pacing, challenge readability, reward clarity, and friction  

---

## Session Info

- **Date**: [Date]
- **Build**: [Version / commit / artifact name]
- **Artifact SHA256**: [Hash if testing an RC package]
- **Duration**: [Target: 30-60 minutes]
- **Tester**: [Name / ID]
- **Tester Type**: [QA / design tester / returning internal tester]
- **Platform**: [Windows internal package / mobile device / other]
- **Input Method**: [Mouse fallback / touch]
- **Viewport**: [432x768 expected]
- **Language**: [Traditional Chinese internal scope unless otherwise approved]
- **Observer**: [QA / Designer]

---

## Test Focus

Validate whether the early-to-mid player experience has a readable and reasonable difficulty curve:

- first visible challenge target,
- role/equipment growth expectations,
- skill/resource spend expectations,
- pack and reward pacing,
- challenge/boss readiness communication,
- guild support or friction,
- failure and recovery clarity,
- gameplay-only reward framing.

---

## Session Script

1. Launch with the agreed test state: [fresh / seeded early / seeded mid-game].
2. Record starting level, class, visible resources, pack state, challenge status, and guild status.
3. Ask the tester to pursue the clearest next progression goal without guidance.
4. Ask the tester to interact with role/equipment, packs, market, challenge, and guild pages as needed.
5. Observe whether the tester can judge when they are underpowered, ready, or blocked.
6. Record any moment where the tester cannot tell how to improve.
7. Record any reward moment that feels too weak, too strong, unclear, or cash-value-like.
8. End by asking the tester to describe the next three upgrades or goals they would pursue.

---

## Starting State

- **Level / power**: [Value]
- **Class / role**: [Value]
- **Equipment state**: [Summary]
- **Skills visible**: [Summary]
- **Resources**: [Summary]
- **Packs owned/listed/openable**: [Summary]
- **Challenge readiness**: [Summary]
- **Guild state**: [Summary]
- **Known risk/freeze/test flags**: [Summary or N/A]

---

## Difficulty Curve Observations

| Moment / System | Expected difficulty | Actual tester experience | Verdict | Notes |
| --- | --- | --- | --- | --- |
| First goal selection | [Easy / Medium / Hard] | [Observation] | [PASS / CONCERN / FAIL] | [Notes] |
| Role/equipment progression | [Easy / Medium / Hard] | [Observation] | [PASS / CONCERN / FAIL] | [Notes] |
| Pack action decision | [Easy / Medium / Hard] | [Observation] | [PASS / CONCERN / FAIL] | [Notes] |
| Market decision | [Easy / Medium / Hard] | [Observation] | [PASS / CONCERN / FAIL] | [Notes] |
| Challenge readiness | [Easy / Medium / Hard] | [Observation] | [PASS / CONCERN / FAIL] | [Notes] |
| Guild contribution/activity | [Easy / Medium / Hard] | [Observation] | [PASS / CONCERN / FAIL] | [Notes] |
| Recovery after failure/block | [Easy / Medium / Hard] | [Observation] | [PASS / CONCERN / FAIL] | [Notes] |

---

## Pacing and Friction

- **Too easy moments**: [List]
- **Too hard moments**: [List]
- **Unclear blocked moments**: [List]
- **Reward timing felt good?** [Yes / No / Partially]
- **Reward magnitude felt good?** [Yes / No / Partially]
- **Upgrade cost clarity**: [Clear / Partial / Unclear]
- **Challenge requirement clarity**: [Clear / Partial / Unclear]
- **Recovery path clarity**: [Clear / Partial / Unclear]

---

## Product Boundary Check

| Reward / Progression Moment | Did it imply withdrawable or external value? | Verdict | Notes |
| --- | --- | --- | --- |
| Pack reward | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| Market/trade result | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| Challenge/Boss reward | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| Guild reward | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| Progression summary | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |

Any `FAIL` in this section must be routed as a release blocker candidate before RC or public launch claims.

---

## Bugs Encountered

| # | Description | Severity | Reproducible | Evidence |
| --- | --- | --- | --- | --- |
| 1 | [Bug] | [S1 / S2 / S3 / S4] | [Yes / No / Unknown] | [Screenshot / steps] |

---

## Quantitative Data

- **Session length**: [mm:ss]
- **Number of progression goals identified by tester**: [Count]
- **Number of goals completed**: [Count]
- **Number of unclear blockers**: [Count]
- **Number of failed actions**: [Count]
- **Help requests**: [Count and topics]
- **Time to identify next upgrade**: [mm:ss]
- **Time to identify challenge readiness**: [mm:ss]
- **Text clipped or unreadable at 432x768**: [Yes / No / details]

---

## Overall Assessment

- **Difficulty**: [Too Easy / Just Right / Too Hard / Too Spiky]
- **Pacing**: [Too Slow / Good / Too Fast]
- **Progression clarity**: [Clear / Partial / Unclear]
- **Reward clarity**: [Clear / Partial / Unclear]
- **Would continue to chase next goal?** [Yes / No / Maybe]
- **Session length preference**: [Shorter / Good / Longer]

---

## Verdict

- **Session Verdict**: [PASS / PASS WITH NOTES / FAIL]
- **Reason**: [Short rationale]
- **Blocks release gate?** [Yes / No / Needs triage]

---

## Top 3 Priorities From This Session

1. [Most important finding]
2. [Second priority]
3. [Third priority]

---

## Action Routing

| Finding | Category | Owner | Next Workflow |
| --- | --- | --- | --- |
| [Finding] | [Design / Balance / Bug / Polish / Product Boundary] | [Owner] | [`/propagate-design-change`, `/balance-check`, `/bug-report`, polish backlog, or release blocker review] |

---

## Sign-Off

- **Observer**: [Name / date]
- **QA Lead Review**: [Name / date / PASS or concerns]
- **Creative Director Review**: [Name / date / PASS or concerns]
