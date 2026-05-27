# 13 Phase 12: Mobile App Readiness

## Purpose

Phase 12 prepares mobile web, PWA, and possible app-store submission. Mobile must preserve the same compliance wording, risk notices, and transaction clarity as desktop.

## Entry Gate

- Phase 11 exit gate approved.
- Responsive UI system exists.
- Product boundary copy is approved.
- Store payment and random-item disclosure decisions are documented.

## Viewport Matrix

| Width | Device Class | Required Checks |
|---:|---|---|
| 360 px | small Android | no clipped buttons, readable disclosures |
| 390 px | modern iPhone | pack open/trade/ticket flows |
| 430 px | large phone | operator center and leaderboard |
| 768 px | tablet | split layout and modal behavior |
| landscape phone | rotated | no hidden primary action |

Network/device checks:

- low-end Android performance.
- weak network and retry behavior.
- PWA installed mode.
- offline state.
- push notification deep link.

## App Store Review Package

Prepare:

- test accounts: player, operator, support, risk admin.
- feature explanation.
- random item probability disclosure.
- non-withdrawable asset disclosure.
- operator income explanation.
- tax/payment explanation if visible.
- privacy policy.
- terms.
- screenshots for pack/trade/ticket/boss/operator center.
- IAP/external payment decision note.

If app-store policy requires platform payment for digital goods, the product must not bypass it through external links or misleading flows.

## UI Test Cases

Mobile QA must verify:

- trading session countdown.
- pack listing price and cap errors.
- pack opening animation and final content.
- asset number wrapping.
- ticket purchase and reservation.
- boss contribution and reward screen.
- guild leaderboard with long names.
- frozen/risk hold notice.
- operator settlement status.
- long legal disclosure does not cover CTA.

## Performance Targets

- first interactive screen under 3 seconds on test low-end Android over simulated 4G.
- pack open result under 2 seconds after server response.
- no layout shift that causes accidental buy/open/ticket action.
- tap targets at least 44 px high.

## Exit Gate

- Viewport matrix passes.
- PWA install/offline behavior is acceptable.
- Store review package is complete.
- Product/risk approves mobile screenshots and copy.
- No mobile-only route bypasses desktop risk or settlement checks.

## Required Tests

- responsive screenshot comparison.
- mobile keyboard/input flow.
- weak-network retry.
- duplicate submit prevention.
- disclosure visibility before action.
- PWA install and offline page.
