# 08 Phase 7: Beta Economy Calibration

## Purpose

Phase 7 validates the MVP economy with controlled beta users before expanding gameplay or operator settlement. The goal is evidence, not growth.

## Entry Gate

- MVP Phase 1-6 exit gates passed.
- Deterministic risk regression dataset exists.
- Ledger replay has zero unexplained mismatch for 7 consecutive test runs.
- Product copy scan has no cash-out implication for gameplay assets.
- Beta users accept testing terms and no-withdrawal boundary.

## Beta Cohorts

| Cohort | Purpose | Minimum Sample |
|---|---|---:|
| New player | onboarding and first pack flow | 30 |
| Heavy trader | market liquidity and price cap | 20 |
| Operator candidate | operator center and settlement export feedback | 10 |
| Mobile user | responsive and PWA flows | 30 |
| Risk simulation | abuse and freeze behavior | internal dataset |
| Support reviewer | audit and case handling | 3 staff |

## Metrics and Formulas

| Metric | Formula | Source | Healthy Range |
|---|---|---|---|
| Ledger mismatch count | replay balance - cached balance | `LedgerJournal`, `WalletBalance` | 0 |
| Pack open duplicate rate | duplicate open logs / total opens | `PackOpenLog` | 0 |
| Trade settlement failure | failed trades / attempted trades | `PackTrade`, API logs | <= 0.5% |
| Risk false positive rate | reversed risk holds / total holds | `RiskCase` | <= 5% |
| Support ticket rate | economy tickets / active beta users | support log | <= 3% daily |
| Price growth pressure | median currentPrice / initialPrice | `LuckyPack` | reviewed daily |
| Ticket liability mismatch | replay liability - cached liability | ledger reports | 0 |
| Operator settlement exception | blocked settlements / settlement drafts | `OperatorSettlement` | explainable only |

Default time window: rolling 24h and rolling 7d. All metrics must exclude internal QA users unless the metric is explicitly a risk simulation.

## Calibration Tasks

- Tune listing price cap and cooldown.
- Validate content pool probability and replay.
- Measure pack open, trade, cancel, and force-open paths.
- Confirm support can explain every audit trail.
- Confirm risk holds do not create stuck assets.
- Confirm mobile users can read disclosures before action.

## Pause Gates

Expansion must pause if any condition occurs:

- Ledger mismatch > 0 without root cause.
- Two or more duplicate open or payout-like events.
- Risk false positive rate > 5% for 2 consecutive days.
- Support ticket rate > 3% for 2 consecutive days.
- Any player-facing copy implies gameplay cash-out.
- Any settlement calculation uses non-approved source.
- Any unresolved high-risk abuse cluster affects settlement evidence.

## Exit Gate

Phase 7 passes when:

- 14 consecutive days have no unexplained ledger mismatch.
- All pack race tests pass in CI/local verification.
- Risk reviewer signs off on false-positive and abuse data.
- Product owner signs off that economy metrics are stable enough for Phase 8.
- Finance confirms operator settlement remains export-only and separate from gameplay assets.

## Required Tests

- Replay all beta ledger journals.
- Run concurrent trade/open/cancel race suite.
- Run risk regression dataset.
- Run mobile disclosure QA at 360, 390, 430, and 768 px widths.
- Export beta economy report and verify formulas.
