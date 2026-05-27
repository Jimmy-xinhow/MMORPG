# 15 Phase 14: Regulated Feature Review

## Purpose

Phase 14 is the review gate for features that may affect gambling, payments, taxation, securities-like value, app-store policy, or external redemption. This phase decides whether a proposed feature can ship, must be redesigned, or is no-go.

## Entry Gate

- Feature proposal is written.
- Product flow, asset flow, and money flow are diagrammed.
- Legal, accounting, payment, risk, and engineering owners are assigned.
- Existing product boundary impact is identified.

## Review Owners and SLA

| Owner | Responsibility | Target Time |
|---|---|---:|
| Product owner | user flow and business intent | 5 business days |
| Engineering owner | system design and implementation risk | 5 business days |
| Risk owner | abuse and fraud routes | 5 business days |
| Legal owner | regulatory and terms review | 10 business days |
| Accounting/tax owner | income, withholding, reporting treatment | 10 business days |
| Payment owner | payout/payment/provider compliance | 10 business days |

If any owner returns `NO_GO`, the feature cannot ship under a renamed or repackaged form without a new review.

## Required Review Template

Every regulated feature review must include:

- feature name and version.
- user story.
- jurisdictions affected.
- product flow diagram.
- asset flow diagram.
- money flow diagram.
- ledger journal design.
- tax/accounting treatment.
- payment provider treatment.
- app-store policy impact.
- user-facing copy.
- abuse cases.
- risk controls.
- QA test cases.
- go/no-go decision.
- written opinions attached.
- approved implementation constraints.

## Decision Types

| Decision | Meaning |
|---|---|
| `GO` | may implement within listed constraints |
| `GO_WITH_CHANGES` | must revise before implementation |
| `LIMITED_PILOT` | may test with explicit caps and review period |
| `NO_GO` | cannot implement |
| `NEEDS_EXTERNAL_COUNSEL` | blocked until external written opinion |

## Version Storage

Store review output under:

```text
docs/regulatory-reviews/{yyyy-mm-dd}-{feature-slug}/
```

Required files:

- `proposal.md`
- `flow-product.mmd`
- `flow-asset.mmd`
- `flow-money.mmd`
- `legal-opinion.md`
- `accounting-tax-opinion.md`
- `payment-opinion.md`
- `risk-review.md`
- `qa-plan.md`
- `decision.md`

## No-Go Anti-Circumvention Checks

After a no-go decision, the team must verify no one reintroduces the feature through:

- renamed assets.
- event reward wrapper.
- ticket shop substitute.
- third-party partner redemption.
- manual admin adjustment.
- operator settlement adjustment.
- coupon or gift-card equivalent.
- app-store-only variant.
- off-platform instruction.

## Exit Gate

Phase 14 completes only when:

- all owner decisions are recorded.
- money/asset/user flows are complete.
- engineering constraints are testable.
- QA plan covers go and no-go paths.
- approved copy is stored.
- no-go features are added to blocked-feature list.

## Required Tests

- policy copy scan for approved wording.
- ledger path test for proposed feature.
- withdrawal/non-withdrawal boundary test.
- risk abuse regression.
- payment webhook/provider sandbox if payment is involved.
- app-store screenshot and metadata review if mobile is involved.
