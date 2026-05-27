# 14 Phase 13: Scale, Security, and Operations

## Purpose

Phase 13 hardens the system for larger traffic, production security, operational visibility, and incident response.

## Entry Gate

- Phase 12 exit gate approved.
- Production-like workload model defined.
- Monitoring and alerting stack selected.
- Security review scope approved.

## SLO and Capacity Targets

| Area | Target |
|---|---:|
| pack list API p95 | <= 300 ms |
| pack buy API p95 | <= 500 ms |
| pack open API p95 | <= 700 ms excluding animation |
| ledger journal write error alert | within 1 minute |
| force-open job lag | <= 5 minutes |
| settlement export job lag | <= 15 minutes |
| queue backlog alert | > 1000 jobs or > 10 minutes old |
| uptime target | 99.5% MVP-scale, 99.9% after scale review |

Capacity test baseline:

- 10,000 DAU.
- 1,000 concurrent users.
- 50 listings per second.
- 20 buys per second.
- 30 opens per second.
- 5,000 background jobs per hour.

## Threat Model

Required scenarios:

- account takeover.
- admin privilege abuse.
- idempotency replay.
- payment webhook forgery.
- trading session sniping.
- ledger tampering.
- risk dashboard data leakage.
- settlement export manipulation.
- bot-driven boss/guild farming.
- denial of service against buy/open endpoints.

## Security Controls

- MFA for admin/risk/finance roles.
- least-privilege RBAC.
- signed webhooks with replay window.
- idempotency key with request hash.
- immutable audit log for admin changes.
- encrypted secrets.
- PII and bank fingerprints stored as salted hashes.
- rate limits for trade/open/session endpoints.
- anomaly detection alerts for high-value actions.

## Incident Response

Severity levels:

| Severity | Example | Response |
|---|---|---|
| SEV1 | ledger corruption, payout error | freeze affected flows immediately |
| SEV2 | trading outage, risk dashboard leak | pause affected feature |
| SEV3 | delayed jobs, degraded reports | notify ops and retry |
| SEV4 | minor UI issue | normal backlog |

Incident record must include timeline, affected accounts, ledger refs, mitigation, data correction, and follow-up tasks.

## Exit Gate

- Load test meets baseline.
- Security tests cover all threat model scenarios.
- Alerts fire in test drills.
- Incident freeze switch works.
- Settlement/export flows are protected from replay and unauthorized access.

## Required Tests

- load test pack list/buy/open.
- queue backlog alert simulation.
- webhook signature rejection.
- idempotency replay rejection.
- admin privilege boundary test.
- risk dashboard sensitive data masking.
- incident freeze drill.
