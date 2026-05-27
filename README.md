# 幸運禮包 MMORPG MVP

這是依照 `docs/planning/` 15 份規格建立的本地 MVP+ 原型。核心原則是：遊戲資產不可提現，只有核准的 `OperatorSettlement` 經營收入能進入撥款流程。

目前前端已分成三個入口：

- 玩家入口：背包、交易場行情、開包結果、遊戲資產不可提現邊界。
- 經營者中心：可撥款收入、排除金額、撥款進度。
- 管理後台：營運狀態、風險摘要、活動與審查、資料與系統。

第一層只顯示主流程與狀態式主行動，進階測試工具與管理細項已收進折疊區。

目前定位是可展示、可驗證的本地 MVP，不是正式上線版。首頁已列出正式上線前仍缺的玩家端、經營者端、合規與部署項目。

## 啟動

```powershell
npm.cmd run start
```

開啟：

```text
http://127.0.0.1:3000
```

`npm.cmd run start` 會使用 `data/dev-store.json` 做本地持久化；重啟後會保留操作狀態。若只想跑記憶體模式：

```powershell
npm.cmd run start:memory
```

## 驗證

```powershell
npm.cmd run check
```

這會執行：

- 15 份規格文件完整性檢查。
- Node domain tests。
- API smoke test。
- PWA manifest / service worker smoke check。
- 權限邊界 smoke check。
- 中文亂碼檢查。

## Demo 資料管理

```powershell
npm.cmd run seed
npm.cmd run reset:data
```

前端的「資料管理」區也可以手動保存、建立備份、匯入 demo 資料、重置資料。

## 已實作範圍

- Pack 狀態機：發行、掛單、購買、冷卻、開包、burn、風控凍結。
- Ledger：double-entry journal、idempotency、replay reconciliation。
- 不可提現邊界：GC、Pack、Item、Ticket、Boss/Guild reward、玩家交易價差不可提現。
- OperatorSettlement：總額、可提現核准額、排除額與排除理由；撥款申請、核准、稅務完成、排程付款、付款失敗重審、拒絕釋放額度、已付款出帳狀態機。
- Ticket：購買、保留、消耗、防超賣、liability replay。
- Redemption：防止同 ticket/ref 重複 active 申請。
- Boss/Guild：Boss reward cap、guild penalty、risk signal。
- RPG：首批職業邊界、技能成本曲線、content flag、reward cap。
- Economy config：版本化經濟設定、核准、啟用、價格上限。
- Force-open job：依交易次數、價格、持有期限掃描並強制開包，風控凍結會跳過。
- Trading session：掛單與購買必須在 OPEN session 內進行。
- Reports：reconciliation、boundary、audit report。
- Frontend：手機優先控制台、PWA manifest、service worker。
- Local persistence：本地 JSON snapshot，可重啟恢復。
- LiveOps：活動建立、產品審查、風控審查、啟動、暫停、回滾、audit。
- Regulated review：高風險功能審查、owner opinions、GO/NO_GO、no-go 防繞過檢查。
- Demo RBAC：高風險 POST/GET route 需要 `x-demo-role`；前端 `Demo Role` 已收進 `Demo 控制`。
- Admin export：可匯出 boundary、reconciliation、audit、state snapshot。
- System status：提供 app version、store schema version、migration 清單與健康檢查狀態。
- API contract：`/api/openapi.json` 可查 route、角色、用途與風險等級。
- Operational halt：風控/管理員可暫停交易與撥款 scope，解除前 route 會被 backend 擋住。

## 重要 API

- `GET /api/state`
- `GET /api/system/status`
- `GET /api/openapi.json`
- `GET /api/reports/reconciliation`
- `GET /api/reports/boundary`
- `GET /api/reports/audit`
- `GET /api/admin/export`
- `POST /api/admin/save`
- `POST /api/admin/backup`
- `POST /api/admin/reset`
- `POST /api/admin/seed`
- `POST /api/packs/issue`
- `POST /api/packs/list`
- `POST /api/packs/buy`
- `POST /api/packs/open`
- `POST /api/operator/settlements`
- `POST /api/operator/withdrawals`
- `POST /api/operator/withdrawals/advance`
- `POST /api/tickets/purchase`
- `POST /api/tickets/reserve`
- `POST /api/tickets/consume`
- `POST /api/boss/settle`
- `POST /api/guild/scan`
- `POST /api/operations/halt`
- `POST /api/operations/resume`
- `POST /api/rpg/validate`
- `POST /api/economy/configs`
- `POST /api/economy/configs/approve`
- `POST /api/economy/configs/activate`
- `POST /api/jobs/force-open`
- `POST /api/trading-sessions`
- `POST /api/trading-sessions/advance`
- `POST /api/liveops/campaigns`
- `POST /api/liveops/campaigns/advance`
- `POST /api/regulatory/reviews`
- `POST /api/regulatory/reviews/submit`
- `POST /api/regulatory/reviews/opinion`
- `POST /api/regulatory/reviews/finalize`
- `POST /api/regulatory/reviews/circumvention-check`
- `POST /api/regulatory/reviews/assert-allowed`

## 尚未接真實外部服務

目前沒有接真實金流、銀行撥款、KYC/KYB、稅務申報、正式資料庫或 app store submission。這些都需要依 `15-phase14-regulated-feature-review.md` 先完成書面審查後才可實作。

## 本輪使用的 SKILL

- `senior-backend`：API 契約、資料持久化、seed/reset/backup、狀態報告。
- `senior-qa`：domain tests、API smoke、首頁文案 smoke、權限測試。
- `security-best-practices`：demo RBAC、security headers、rate limit、敏感 POST 與 GET 報表/匯出分權。
- `frontend-design`：三入口 IA、主流程卡片、狀態式主行動、進階功能折疊。
- `frontend-responsive-ui`：三入口與卡片版面維持手機優先。
- `karpathy-guidelines`：只做 15 份規格內的功能，不接未審查的真實金流與稅務。

完整對照紀錄在 `docs/implementation-skill-usage.md`。
## 目前新增的系統狀態 API

- 首頁已移除內部工程清單與缺口清單，面向玩家只呈現遊戲功能與必要服務規則。
- `GET /api/launch-readiness` 保留為內部系統狀態 API；本機狀態是 `LOCAL_REVIEW_READY`，設定 `ADMIN_TOKEN` 並關閉 demo role 後會進入 `PUBLIC_BETA_READY`。
- 正式部署需設定 `ADMIN_TOKEN` 與 `ALLOW_DEMO_ROLE=false`。
- 不可提現項目以後端 `boundaryReport` 與 readiness 共同揭露：GC、PACK、ITEM、TICKET、BOSS_REWARD、GUILD_REWARD、TRADE_PROFIT。
- `npm.cmd run check` 會同時跑編碼、15 份規劃文件、44 條 API contract、43 個 Node tests、UI smoke、API smoke。
