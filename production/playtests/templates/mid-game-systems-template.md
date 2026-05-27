# Playtest Report Template: Mid-Game Systems

**Template Status**: Template only - not completed playtest evidence  
**Workflow**: CCGS `playtest-report new` adapted for RR-012  
**Focus**: Returning player system comprehension across role, packs, market, challenge, guild, and system pages  

---

## Session Info

- **Date**: [Date]
- **Build**: [Version / commit / artifact name]
- **Artifact SHA256**: [Hash if testing an RC package]
- **Duration**: [Target: 30-45 minutes]
- **Tester**: [Name / ID]
- **Tester Type**: [Returning internal tester / QA systems tester]
- **Platform**: [Windows internal package / mobile device / other]
- **Input Method**: [Mouse fallback / touch]
- **Viewport**: [432x768 expected]
- **Language**: [Traditional Chinese internal scope unless otherwise approved]
- **Observer**: [QA / Designer]

---

## Test Focus

Validate whether a returning tester can understand and evaluate the mid-game feature loop:

- role and equipment progression,
- inventory and skill expectations where visible,
- pack ownership/open/listing state,
- market/trading presentation,
- challenge and boss reward presentation,
- guild activity and guild reward presentation,
- system/status feedback,
- separation between gameplay assets and restricted operator-finance workflows.

---

## Session Script

1. Launch the build with a seeded or returning-player state.
2. Ask the tester to inspect current role power, resources, equipment, and status log.
3. Ask the tester to visit the packs page and explain available pack actions.
4. Ask the tester to visit the market page and explain listing/trading state.
5. Ask the tester to visit the challenge page and explain challenge readiness and reward expectations.
6. Ask the tester to visit the guild page and explain guild activity, donation, boss, shop, and task areas.
7. Ask the tester to visit the system page and explain account/client state.
8. Ask the tester to identify any missing feedback after actions or page transitions.
9. Ask whether any mid-game reward looks like withdrawable value or operator settlement access.

---

## System Comprehension

| System | Understood purpose? | Understood next action? | Feedback clear after action? | Notes |
| --- | --- | --- | --- | --- |
| Role / equipment | [Yes / No / Partially] | [Yes / No / Partially] | [Yes / No / N/A] | [Notes] |
| Packs | [Yes / No / Partially] | [Yes / No / Partially] | [Yes / No / N/A] | [Notes] |
| Market | [Yes / No / Partially] | [Yes / No / Partially] | [Yes / No / N/A] | [Notes] |
| Challenge | [Yes / No / Partially] | [Yes / No / Partially] | [Yes / No / N/A] | [Notes] |
| Guild | [Yes / No / Partially] | [Yes / No / Partially] | [Yes / No / N/A] | [Notes] |
| System | [Yes / No / Partially] | [Yes / No / Partially] | [Yes / No / N/A] | [Notes] |

---

## Mid-Game Loop Assessment

- **Progression clarity**: [Clear / Partial / Unclear]
- **Pack loop clarity**: [Clear / Partial / Unclear]
- **Market loop clarity**: [Clear / Partial / Unclear]
- **Challenge loop clarity**: [Clear / Partial / Unclear]
- **Guild loop clarity**: [Clear / Partial / Unclear]
- **Reward clarity**: [Clear / Partial / Unclear]
- **Status/error feedback**: [Clear / Partial / Unclear]

### What worked well

- [Observation 1]

### Pain points

- [Issue 1 - Severity: High / Medium / Low]

### Confusion points

- [Where the tester was confused and why]

### Missing affordances

- [Button/state/copy/feedback the tester expected but did not find]

---

## Product Boundary Check

| Area | Any cash-out, payout, tax, withdrawal, or operator settlement implication? | Verdict | Notes |
| --- | --- | --- | --- |
| Packs | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| Market | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| Challenge rewards | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| Guild rewards | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |
| System page | [Yes / No] | [PASS / CONCERN / FAIL] | [Notes] |

Any `FAIL` in this section must be routed as a release blocker candidate.

---

## Bugs Encountered

| # | Description | Severity | Reproducible | Evidence |
| --- | --- | --- | --- | --- |
| 1 | [Bug] | [S1 / S2 / S3 / S4] | [Yes / No / Unknown] | [Screenshot / steps] |

---

## Quantitative Data

- **Time to inspect role state**: [mm:ss]
- **Time to explain pack state**: [mm:ss]
- **Time to explain market state**: [mm:ss]
- **Time to explain challenge/guild state**: [mm:ss]
- **Action attempts**: [Count]
- **Failed or unclear action attempts**: [Count and notes]
- **Pages with text clipped or unreadable at 432x768**: [List]

---

## Overall Assessment

- **Would continue playing this mid-game loop?** [Yes / No / Maybe]
- **Systems feel connected?** [Yes / No / Partially]
- **Rewards feel meaningful without cash-out implication?** [Yes / No / Partially]
- **Mid-game pacing**: [Too Slow / Good / Too Fast]
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
