export const ASSET_UNITS = Object.freeze({
  GC: "GC",
  PACK: "PACK",
  ITEM: "ITEM",
  TICKET: "TICKET",
  OPERATOR_CURRENCY: "OPERATOR_CURRENCY",
  FIAT_TWD: "FIAT_TWD",
});

export const ACCOUNT_TYPES = Object.freeze({
  PLAYER_ASSET: "PLAYER_ASSET",
  PLAYER_TICKET: "PLAYER_TICKET",
  PLATFORM_REVENUE: "PLATFORM_REVENUE",
  OPERATOR_INCOME: "OPERATOR_INCOME",
  WITHDRAWAL_PAYABLE: "WITHDRAWAL_PAYABLE",
  RISK_HOLD: "RISK_HOLD",
  SYSTEM_CLEARING: "SYSTEM_CLEARING",
});

export const NON_WITHDRAWABLE_ASSETS = Object.freeze([
  ASSET_UNITS.GC,
  ASSET_UNITS.PACK,
  ASSET_UNITS.ITEM,
  ASSET_UNITS.TICKET,
]);

export const WITHDRAWABLE_REF_TYPE = "OperatorSettlement";

export const REQUIRED_BOUNDARY_COPY =
  "遊戲資產不可提現。只有經營者計畫中已核准、完成稅務與風控審查的經營收入，才可申請撥款。";

export function assertWithdrawalSource({ refType, assetUnit }) {
  if (NON_WITHDRAWABLE_ASSETS.includes(assetUnit)) {
    throw new Error(`${assetUnit} is a gameplay asset and cannot be withdrawn`);
  }

  if (refType !== WITHDRAWABLE_REF_TYPE) {
    throw new Error("Withdrawal requires an approved OperatorSettlement");
  }
}
