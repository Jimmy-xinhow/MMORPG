export const APP_VERSION = "0.2.0-mvp-plus";
export const STORE_SCHEMA_VERSION = 1;
export const MIGRATIONS = Object.freeze([
  {
    id: "001-initial-json-store",
    schemaVersion: 1,
    description: "Initial local JSON store with ledger, packs, risk, gameplay, liveops, and regulatory review.",
  },
]);
