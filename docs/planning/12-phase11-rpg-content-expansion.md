# 12 Phase 11: RPG Content Expansion

## Purpose

Phase 11 expands RPG content without destabilizing the economy. Classes, skills, quests, and rewards must be versioned, testable, and rollback-ready.

## Entry Gate

- Phase 10 exit gate approved.
- Content flag and config version framework implemented.
- Economy simulation can estimate reward impact.
- RPG rewards are confirmed non-withdrawable.

## Minimum First Release Scope

Initial classes:

| Class | Role | Stat Boundary |
|---|---|---|
| Warrior | durable melee | HP 110%-130%, damage 80%-100% |
| Ranger | ranged damage | HP 80%-100%, damage 100%-120% |
| Mage | burst skill | HP 70%-90%, damage 110%-140%, cooldown higher |
| Cleric | support | HP 90%-110%, healing/support cap |

Do not launch more than 4 classes in the first expansion. More content requires balance review.

## Skill Cost Curve

```text
upgradeCost(level) = baseCost * level ^ growthExponent
```

Defaults:

- `baseCost = 100`
- `growthExponent = 1.35`
- max level per skill in first release: 10
- reset cost: configurable ticket or GC, non-withdrawable

Rules:

- Skill reset returns gameplay resources only.
- Version balance adjustment must not create withdrawable value.
- Deprecated skills remain readable for historical logs.

## Content Flags

Every new content unit must have:

- `contentKey`
- `configVersion`
- `enabledForPercent`
- `allowedCohorts`
- `startsAt`
- `endsAt`
- `rollbackVersion`

Rollout:

```text
internal -> 5% beta -> 25% beta -> 100% beta -> production
```

## Reward Impact Controls

- RPG rewards cannot create operator income.
- RPG reward pool must have daily cap.
- Quest rewards must use ledger journal.
- Boss/guild/RPG combined rewards must be simulated together before release.
- Risk system must detect automated farming.

## Exit Gate

- Content can be enabled and disabled by flag.
- Skill upgrade/reset ledger is reversible through audit, not deletion.
- Economy simulation shows reward inflation within approved range.
- Mobile RPG screens pass responsive QA.
- No RPG reward path reaches withdrawal or operator income.

## Required Tests

- class creation and stat boundary validation.
- skill upgrade cost curve.
- skill reset.
- content flag rollout.
- rollback to previous content version.
- reward cap enforcement.
- automated farming risk case.
