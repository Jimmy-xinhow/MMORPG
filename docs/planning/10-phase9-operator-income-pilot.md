# 10 Phase 9: Operator Income Pilot

## Purpose

Phase 9 pilots taxable operating income for approved operators. This is separate from player gameplay assets and remains controlled by settlement, tax, risk, and finance review.

## Entry Gate

- Phase 8 exit gate approved.
- Operator income config approved by product, risk, and finance.
- Tax and payment profile fields implemented.
- Settlement remains export-only unless Phase 14 approves real payout integration.

## KPI Calculation

```text
grossScore =
  activeUserScore * activeUserWeight +
  retentionScore * retentionWeight +
  contentQualityScore * contentQualityWeight +
  supportQualityScore * supportQualityWeight -
  riskPenaltyScore * riskPenaltyWeight

grossIncome = min(periodMaxIncome, grossScore * incomeUnitRate)
approvedIncome = grossIncome - exclusions - manualHolds
```

| KPI | Evidence | Anti-Cheat |
|---|---|---|
| active users | signed-in qualified users | exclude same-device and bot sessions |
| retention | returning users by cohort | exclude internal/test accounts |
| content quality | reviewed content/event delivery | require human review sample |
| support quality | response and resolution metrics | exclude self-created tickets |
| risk penalty | risk cases and reversals | high severity can zero settlement |

## Settlement Failure Branches

```text
DRAFT -> PENDING_REVIEW -> APPROVED -> TAX_READY -> EXPORT_READY -> EXPORTED
PENDING_REVIEW -> NEEDS_DOCUMENT
PENDING_REVIEW -> PARTIAL_APPROVED
PENDING_REVIEW -> REJECTED
APPROVED -> FROZEN
TAX_READY -> TAX_EXPIRED
EXPORT_READY -> EXPORT_FAILED
EXPORTED -> PAYMENT_FAILED_SIMULATION
```

Branch rules:

- `NEEDS_DOCUMENT`: user must update identity/tax/payment profile.
- `PARTIAL_APPROVED`: only approved amount can proceed; excluded amount remains locked.
- `REJECTED`: no withdrawal request can be created.
- `FROZEN`: risk case blocks export and payment.
- `TAX_EXPIRED`: cannot export until profile renewed.
- `EXPORT_FAILED`: finance can regenerate with same settlement version.

## Mobile Operator Center IA

Screens:

- overview: approved income, pending review, holds.
- settlement detail: period, KPI evidence, exclusions.
- tax/payment profile: status only, sensitive data masked.
- withdrawal/export status: export-only in pilot.
- risk notices: clear reason category and next action.

Copy restrictions:

- Do not say players earn cash by playing.
- Do not show operator income on normal player reward screens.
- Use `經營收入` only inside operator center.
- Use `遊戲資產不可提現` near any income/withdrawal explanation.

## Data Requirements

- `OperatorProfile`
- `OperatorKpiSnapshot`
- `OperatorIncomeConfig`
- `OperatorSettlement`
- `SettlementReview`
- `TaxProfile`
- `PayoutProfile`
- `SettlementExport`

## Exit Gate

- Settlement calculation is reproducible from snapshots.
- All exclusions from `01-product-boundary.md` are applied.
- Finance export contains tax, period, approval, and amount fields.
- Risk reviewer can freeze and unfreeze settlement.
- Mobile operator center passes copy and disclosure QA.

## Required Tests

- KPI snapshot replay returns same approved amount.
- same-device/same-bank cluster zeros affected settlement portion.
- expired tax profile blocks export.
- partial approval only exports approved amount.
- rejected settlement cannot create withdrawal.
- normal player APIs cannot read operator income.
