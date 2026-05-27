# Playtest Report Template: New Player Experience

**Template Status**: Template only - not completed playtest evidence  
**Workflow**: CCGS `playtest-report new` adapted for RR-012  
**Focus**: First-time player comprehension, first 10 minutes, bottom navigation, product boundary  

---

## Session Info

- **Date**: [Date]
- **Build**: [Version / commit / artifact name]
- **Artifact SHA256**: [Hash if testing an RC package]
- **Duration**: [Target: 20-30 minutes]
- **Tester**: [Name / ID]
- **Tester Type**: [First-time internal tester]
- **Platform**: [Windows internal package / mobile device / other]
- **Input Method**: [Mouse fallback / touch]
- **Viewport**: [432x768 expected]
- **Language**: [Traditional Chinese internal scope unless otherwise approved]
- **Observer**: [QA / Designer]

---

## Test Focus

Validate whether a first-time tester understands:

- the bright fantasy idle MMORPG premise,
- the home screen goal,
- character/resource/status presentation,
- bottom navigation,
- role, packs, market, challenge, guild, and system page purpose,
- gameplay rewards as non-withdrawable entertainment assets.

---

## Session Script

1. Launch the build from a clean state.
2. Let the tester look at the home screen for 60 seconds without guidance.
3. Ask the tester to explain what they think the goal is.
4. Ask the tester to identify character state, resources, status log, and navigation.
5. Ask the tester to visit role, packs, market, challenge, guild, and system pages.
6. Ask the tester what pack rewards, challenge rewards, and market actions appear to mean.
7. Ask the tester whether any screen appears to offer cash-out, payout, tax handling, or operator workflow access.
8. Record the first point where the tester asks for help.

---

## First Impressions - First 5 Minutes

- **Understood the game goal?** [Yes / No / Partially]
- **Understood the home screen?** [Yes / No / Partially]
- **Understood bottom navigation?** [Yes / No / Partially]
- **Understood controls?** [Yes / No / Partially]
- **Emotional response**: [Engaged / Confused / Bored / Frustrated / Excited]
- **First help request time**: [mm:ss]
- **Notes**: [Observations]

---

## Page Comprehension

| Page | Tester understood purpose? | Tester could navigate without help? | Confusion / notes |
| --- | --- | --- | --- |
| Home | [Yes / No / Partially] | [Yes / No] | [Notes] |
| Role | [Yes / No / Partially] | [Yes / No] | [Notes] |
| Packs | [Yes / No / Partially] | [Yes / No] | [Notes] |
| Market | [Yes / No / Partially] | [Yes / No] | [Notes] |
| Challenge | [Yes / No / Partially] | [Yes / No] | [Notes] |
| Guild | [Yes / No / Partially] | [Yes / No] | [Notes] |
| System | [Yes / No / Partially] | [Yes / No] | [Notes] |

---

## Product Boundary Check

| Question | Tester answer | Observer verdict |
| --- | --- | --- |
| Did any gameplay reward look withdrawable? | [Answer] | [PASS / CONCERN / FAIL] |
| Did any page imply cash-out or payout? | [Answer] | [PASS / CONCERN / FAIL] |
| Did any page expose tax, withdrawal, or settlement workflow? | [Answer] | [PASS / CONCERN / FAIL] |
| Did the market feel like game trading, not external value trading? | [Answer] | [PASS / CONCERN / FAIL] |

Any `FAIL` in this section must be routed as a release blocker candidate.

---

## Gameplay Flow

### What worked well

- [Observation 1]

### Pain points

- [Issue 1 - Severity: High / Medium / Low]

### Confusion points

- [Where the player was confused and why]

### Moments of delight

- [What surprised or pleased the player]

---

## Bugs Encountered

| # | Description | Severity | Reproducible | Evidence |
| --- | --- | --- | --- | --- |
| 1 | [Bug] | [S1 / S2 / S3 / S4] | [Yes / No / Unknown] | [Screenshot / steps] |

---

## Quantitative Data

- **Time to understand home screen**: [mm:ss]
- **Time to first successful page switch**: [mm:ss]
- **Pages discovered without prompting**: [List]
- **Pages missed**: [List]
- **Help requests**: [Count and topics]
- **Text clipped or unreadable at 432x768**: [Yes / No / details]

---

## Overall Assessment

- **Would play again?** [Yes / No / Maybe]
- **Goal clarity**: [Clear / Partial / Unclear]
- **Control clarity**: [Clear / Partial / Unclear]
- **Navigation clarity**: [Clear / Partial / Unclear]
- **Pacing**: [Too Slow / Good / Too Fast]
- **Product-boundary clarity**: [Clear / Needs copy change / Blocking issue]

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
