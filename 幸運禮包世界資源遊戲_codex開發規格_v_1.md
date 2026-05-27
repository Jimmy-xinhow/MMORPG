# 幸運禮包世界資源遊戲｜Codex 開發規格 V1

## 0. 文件目的

本文件是給 Codex / Cursor / 工程團隊使用的產品開發規格。

本版本目標不是做大型 MMORPG，而是做一套可落地的「幸運禮包交易 × 動態盲包重分配 × 輕量遊戲經濟 × 公會組織收益倍率」系統。

核心要求：

1. 保留幸運禮包交易市場。
2. 保留玩家買賣禮包、養包、搶頂包的刺激感。
3. 禮包交易不做固定保證收益，只限制最高漲幅。
4. 禮包每次交易成功後必須回收原標記內容並重新分配內容物。
5. 玩家不需要每日強制開包。
6. 開包是加速進入遊戲，不是領獎資格。
7. 遊戲本身不做重美術，採輕量文字型 / 數值型 / 放置型 RPG。
8. GC 是遊戲內消耗資源，幾乎無現金成本，但必須大量消耗。
9. 彩票是活動獎勵與商城兌換憑證，不可提現、不可轉讓、不可玩家交易。
10. 組織收益不採用傳統多層抽成，而是「交易收益權 × 遊戲經營倍率」。
11. 多層組織不直接分潤，只作為倍率門檻與公會結構加成。
12. 店長 / 公會長的收益必須與旗下玩家活躍、開包、GC 消耗、Boss 參與、留存等遊戲行為掛鉤。

---

# 1. 產品定位

## 1.1 產品名稱暫定

可暫用：

- Lucky Realm
- 幸運大陸
- 幸運世界
- Lucky Pack World
- Fortune Guild

本文件統稱為「平台」。

---

## 1.2 核心一句話

玩家透過幸運禮包進入世界資源經濟，禮包可交易、可養成、可開啟；開包取得遊戲資產後，玩家可透過角色養成、公會活動、Boss 挑戰與彩票商城形成遊戲內外的價值循環。

---

## 1.3 核心玩法不是傳統 MMORPG

不做：

- 大地圖
- 3D 場景
- 即時戰鬥
- 高成本角色動畫
- 重度劇情副本

要做：

- 交易市場
- 動態禮包內容重分配
- 角色數值
- 裝備數值
- 放置戰報
- Boss 戰報
- 公會數據
- 收益倍率
- 彩票商城
- 風控後台

---

# 2. 核心經濟架構

平台有 4 個核心資產 / 貨幣：

1. 現金 / USDT / 法幣
2. 幸運禮包
3. GC 遊戲幣
4. 彩票

---

## 2.1 現金 / USDT / 法幣

用途：

- 玩家購買平台首發禮包。
- 玩家之間交易時作為結算參考。
- 平台計算交易服務費。

限制：

- 平台不得承諾保證收益。
- 平台不得承諾保證回購。
- 平台不得承諾禮包必定升值。

---

## 2.2 幸運禮包

禮包是本平台的核心交易資產。

禮包不是固定盲盒，而是「動態標記盲包」。

每個禮包都有：

- packId
- 初始價格 initialPrice
- 目前價格 currentPrice
- 上一手成交價 lastTradePrice
- 流轉次數 tradeCount
- 最大流轉次數 maxTradeCount
- 強制開包價格 forceOpenPrice
- 持有期限 holdExpireAt
- 內容估值 contentValue
- 已標記內容物 contentSnapshot
- 狀態 status

狀態包含：

- ISSUED：平台已發行，尚未售出
- OWNED：玩家持有中
- LISTED：掛單中
- TRADED：交易成功待重分配
- COOLDOWN：交易後冷卻中
- FORCE_OPEN_PENDING：等待強制開包
- OPENED：已開啟
- BURNED：已銷毀

---

## 2.3 GC 遊戲幣

GC 是遊戲內核心消耗資源。

GC 來源：

- 開啟禮包
- 活動獎勵
- Boss 掉落
- 任務少量取得

GC 用途：

- 裝備強化
- 裝備精煉
- 裝備修理
- 技能升級
- Boss 入場
- 公會活動
- 攻城補給
- 活動道具合成

設計原則：

- GC 幾乎沒有直接現金成本。
- GC 不能無限制累積。
- GC 必須有大量消耗場景。
- GC 是否開放玩家交易，需要後台開關控制。

---

## 2.4 彩票

彩票是高階活動獎勵與商品兌換憑證。

彩票來源：

- Boss 活動
- 公會活動
- 世界事件
- 賽季排名
- 少量開包保底

彩票用途：

- 兌換商品
- 兌換商品卡
- 兌換限定獎品
- 兌換活動權益

硬性限制：

- 不可提現
- 不可玩家互轉
- 不可自由交易
- 不可掛單買賣
- 不可官方回購現金
- 不可由放置掛機自動產出

---

# 3. 幸運禮包交易市場

## 3.1 每日交易場次

禮包不做全天候自由交易。

每日開放 2 個交易場：

1. 中午交易場：12:00～12:20
2. 晚上交易場：20:00～20:30

後台需可調整交易場時間。

交易場外玩家可以：

- 查看持有禮包
- 查看禮包狀態
- 提前設定掛單意向
- 查看下一交易場倒數
- 選擇是否主動開包
- 查看遊戲活動

交易場內玩家可以：

- 掛單
- 取消掛單
- 購買他人掛單
- 查看市場列表
- 查看即將強制開包禮包

---

## 3.2 掛單規則

玩家掛單價格由玩家自行決定。

限制：

```text
掛單最高價 = 上一手成交價 × 1.06
```

玩家可以：

- 低於上一手價格出售
- 等於上一手價格出售
- 在最高 +6% 內出售
- 不出售
- 主動開包

系統不保證成交。

---

## 3.3 冷卻規則

每個禮包交易成功後，必須冷卻 1 個交易場次。

例：

- 中午場買入，最快晚上場可掛單。
- 晚上場買入，最快隔日中午場可掛單。

目的：

- 防止秒買秒賣。
- 防止機器人高頻刷單。
- 提高玩家選擇開包的可能性。

---

## 3.4 強制開包規則

禮包符合任一條件，系統強制開包：

1. 達最大流轉次數。
2. 達封頂價格。
3. 持有超過指定時間。
4. 活動期結算。
5. 後台人工風控指定。

建議初始參數：

```text
maxTradeCount = 5
forceOpenPrice = initialPrice × 1.5
holdExpireHours = 72
```

後台需可調整。

---

# 4. 動態標記禮包機制

## 4.1 初始標記

平台發行禮包時，系統會標記初始內容物。

玩家看不到完整內容，只能看到：

- 禮包等級
- 可能內容範圍
- 目前成熟度
- 距離強制開包條件

---

## 4.2 交易成功後重分配

每次交易成功後，系統必須執行重分配。

流程：

```text
交易成功
↓
收取交易服務費
↓
舊內容物回收至各資產池
↓
依最新成交價計算新內容估值
↓
依照內容配置權重重新標記內容物
↓
禮包狀態更新為 COOLDOWN
↓
冷卻結束後可再次交易或開包
```

公式：

```text
newContentValue = latestTradePrice × contentAllocationRate
```

建議：

```text
contentAllocationRate = 0.45 ～ 0.60
預設 0.50
```

---

## 4.3 內容物配置權重

以 newContentValue 作為內容估值基準。

預設配置：

| 類型 | 權重 | 說明 |
|---|---:|---|
| GC | 40% | 主遊戲資源，低現金成本 |
| 裝備 / 角色 | 25% | 戰力資產 |
| 強化石 / 材料 | 15% | 養成資源 |
| 行動力 / 活動券 | 10% | 導入活動與 Boss |
| 彩票 | 5% | 真成本，低比例 |
| 稀有權重 | 5% | SSR、稀有券、特殊內容 |

後台需可調整各權重。

---

## 4.4 資產池回收規則

禮包每次交易重分配前，必須先回收舊內容物。

例：

舊內容：

- GC 3000
- 強化石 5
- 裝備箱 1
- 彩票 100

交易成功後：

- GC 回到 GC 待發池
- 強化石回到材料池
- 裝備箱回到裝備池
- 彩票額度回到彩票池

再依新成交價重新配置。

目的：

- 避免重複發放。
- 避免累積負債。
- 避免最終開包成本失控。

---

## 4.5 開包揭曉規則

開包時不再重新計算。

直接揭曉該禮包目前 contentSnapshot。

開包後：

- 禮包狀態改為 OPENED。
- 內容物發送玩家帳戶。
- 禮包改為 BURNED。
- 不再進入交易市場。

---

# 5. 養包與頂包設計

## 5.1 養包概念

玩家不應被鼓勵拿到禮包就開。

平台要鼓勵：

```text
低階包流通
↓
價格與內容估值提升
↓
接近封頂
↓
形成頂包競爭
↓
高階玩家 / 公會搶頂包
↓
開啟取得高價值遊戲資產
```

---

## 5.2 禮包分層

### 基礎包

價格區間：100～300

定位：市場流動性主力。

建議：

- 高流轉
- 低開包誘因
- 內容多為基礎 GC / 材料

目標：

```text
交易率 80%～90%
開包率 10%～20%
```

---

### 中階包

價格區間：500～1500

定位：交易與開包平衡。

建議：

- 有機會開出中階裝備
- 可作為 Boss 活動前補資源

目標：

```text
交易率 50%～70%
開包率 30%～50%
```

---

### 高階包 / 頂包

價格區間：3000 以上，或達封頂條件。

定位：高級遊戲資源入口。

建議：

- 高階 GC
- SSR 裝備箱
- Boss 入場券
- 攻城素材
- 公會活動權益
- 稀有彩票額度

目標：

```text
交易率 10%～30%
開包率 70%～90%
```

---

## 5.3 頂包搶奪機制

當禮包接近封頂：

```text
currentPrice ≥ forceOpenPrice × 0.9
```

標記為：

```text
TOP_PACK_CANDIDATE
```

交易場中獨立顯示「頂包區」。

頂包區功能：

- 顯示即將強制開包時間。
- 顯示可能內容範圍。
- 顯示成熟度。
- 顯示所屬公會。

高階玩家 / 公會可搶購頂包。

搶到後可：

- 等待強制開包。
- 主動開啟。
- 在規則允許下再掛單一次。

---

# 6. 輕量 RPG 系統

## 6.1 角色系統

玩家有角色資料：

- 等級 level
- 職業 class
- 戰力 power
- HP
- ATK
- DEF
- CRIT
- LUCK
- 公會 guildId

職業暫定：

1. 騎士：Boss 傷害加成。
2. 獵人：掉落率加成。
3. 工匠：強化成功率加成。
4. 商人：交易服務費折扣或市場搜尋能力。
5. 法師：活動傷害加成。

MVP 可先只做一個預設職業，後續擴充。

---

## 6.2 裝備系統

裝備欄位：

- 武器
- 防具
- 飾品

裝備稀有度：

- N
- R
- SR
- SSR
- UR

裝備屬性：

- attack
- defense
- bossDamage
- luckBonus
- gcCostReduction
- ticketDropBonus

---

## 6.3 放置打怪

放置產出：

- 經驗
- 材料
- 強化石
- 低階裝備碎片

不產出票。

放置規則：

- 每小時結算一次。
- 最多累積 8 小時未領取收益。
- 領取後寫入 idleRewardLog。

---

## 6.4 強化系統

強化消耗：

- GC
- 強化石

強化提升：

- 裝備基礎數值
- 戰力

強化不可產出彩票。

---

## 6.5 精煉系統

精煉是主要 GC 消耗黑洞。

精煉消耗：

- GC
- 精煉石
- 保護石 optional

精煉結果：

- 成功：提升精煉等級。
- 失敗：材料消失，可能降級或耐久下降。

初始成功率建議：

| 精煉等級 | 成功率 |
|---|---:|
| +1～+3 | 90% |
| +4～+6 | 65% |
| +7～+9 | 40% |
| +10～+12 | 20% |
| +13 以上 | 8% |

後台可調整。

---

# 7. Boss 與活動系統

## 7.1 Boss 開啟時間

Boss 活動建議接在交易場後：

- 12:30 小型 Boss
- 20:40 公會 Boss / 世界 Boss

目的：

- 讓交易後資源立即進入遊戲消耗。
- 讓玩家有理由開包。
- 讓店長有組織活動可做。

---

## 7.2 Boss 入場條件

需要至少一種：

- 行動力
- Boss 券
- GC 入場費

Boss 不以課長單人傷害決定全部獎勵。

獎勵計算要綜合：

- 參與
- 傷害
- 公會貢獻
- 活躍權重

---

## 7.3 Boss 獎勵

Boss 可產出：

- GC
- 強化石
- 裝備箱
- 彩票
- 特殊稱號
- 公會貢獻

彩票只能透過活動池限量釋放。

---

# 8. 公會系統

## 8.1 公會功能

公會負責：

- 聚合玩家
- 組織 Boss
- 提升留存
- 提升 GC 消耗
- 提升開包率
- 提升交易收益倍率

---

## 8.2 公會職位

- 會長
- 副會長
- 隊長
- 成員

MVP 只需：會長、成員。

---

## 8.3 有效玩家定義

有效玩家需符合：

- 7 日內登入
- 有至少一次禮包交易或開包
- 有至少一次遊戲行為
- 有 GC 消耗或 Boss 參與

---

# 9. 交易收益權與倍率系統

## 9.1 基礎收益權

每筆禮包交易收 3% 交易服務費。

其中 60% 進入收益權池。

公式：

```text
tradeFee = tradeAmount × 3%
rewardRightPoolShare = tradeFee × 60%
```

個人基礎收益權：

```text
baseRewardRight = 個人有效流水 ÷ 全服有效流水 × 當期收益權池
```

---

## 9.2 最終收益公式

```text
finalReward = baseRewardRight × finalMultiplier
```

finalMultiplier 最高上限：

```text
5x
```

---

## 9.3 倍率來源

倍率來源：

1. 健康流動倍率
2. GC 消耗倍率
3. Boss 活躍倍率
4. 公會結構倍率
5. 留存倍率
6. 多層門檻倍率

---

# 10. 健康流動倍率

開包率不能只看總開包率，必須看不同禮包級別是否符合健康比例。

## 10.1 目標比例

| 禮包類型 | 目標交易率 | 目標開包率 |
|---|---:|---:|
| 基礎包 | 80%～90% | 10%～20% |
| 中階包 | 50%～70% | 30%～50% |
| 高階包 | 10%～30% | 70%～90% |

## 10.2 健康流動倍率

| 健康度 | 條件 | 倍率 |
|---|---|---:|
| 異常 | 幾乎全交易或全開包 | 0.8x |
| 普通 | 只符合 1 個級別 | 1x |
| 良好 | 符合 2 個級別 | 1.3x |
| 優秀 | 符合 3 個級別 | 1.6x |

健康度計算方式：

```text
每個禮包級別達標 = 1 分
總分 0～3
```

---

# 11. GC 消耗倍率

以旗下活躍玩家平均 GC 消耗量計算。

| 平均 GC 消耗 | 倍率 |
|---|---:|
| <500 | 1x |
| 500～1000 | 1.1x |
| 1000～2000 | 1.25x |
| 2000～5000 | 1.5x |
| 5000～10000 | 1.8x |
| >10000 | 2x |

---

# 12. Boss 活躍倍率

公式：

```text
bossParticipationRate = 參與 Boss 玩家數 ÷ 活躍玩家數
```

| Boss 參與率 | 倍率 |
|---|---:|
| <10% | 1x |
| 10%～20% | 1.1x |
| 20%～30% | 1.2x |
| 30%～40% | 1.35x |
| 40%～50% | 1.5x |
| >50% | 1.8x |

---

# 13. 公會結構倍率

| 有效玩家 | 倍率 |
|---|---:|
| 0～20 | 1x |
| 20～50 | 1.2x |
| 50～100 | 1.5x |
| 100～300 | 2x |
| 300～500 | 2.5x |
| >500 | 3x |

注意：

有效玩家必須符合有效玩家定義。

---

# 14. 留存倍率

| 7 日留存率 | 倍率 |
|---|---:|
| <20% | 1x |
| 20%～30% | 1.1x |
| 30%～40% | 1.2x |
| 40%～50% | 1.35x |
| >50% | 1.5x |

---

# 15. 多層門檻倍率

## 15.1 原則

多層不是分潤。

多層只作為「倍率門檻」。

下層不被抽收益。

上層也不直接拿下層交易分潤。

結構越完整，個人收益權倍率越高。

---

## 15.2 門檻表

### L1 基礎組織

條件：

- 直屬有效玩家 ≥ 3
- 直屬開包率達標

倍率：

```text
1.1x
```

---

### L2 小隊結構

條件：

- 直屬有效玩家 ≥ 5
- 其中 3 人各自擁有至少 3 位有效玩家
- 直屬群組活躍率 ≥ 30%

倍率：

```text
1.25x
```

---

### L3 公會結構

條件：

- 有效玩家 ≥ 30
- 形成至少 2 層活躍結構
- Boss 參與率 ≥ 20%
- GC 消耗達標

倍率：

```text
1.5x
```

---

### L4 高階公會結構

條件：

- 有效玩家 ≥ 100
- 形成至少 3 層活躍結構
- 開包健康度達標
- 7 日留存 ≥ 35%

倍率：

```text
1.8x
```

---

### L5 聯盟結構

條件：

- 有效玩家 ≥ 300
- 至少 3 個有效公會分支
- Boss 參與率 ≥ 40%
- GC 消耗達標
- 活動健康度達標

倍率：

```text
2x
```

---

# 16. 倍率總公式

```text
rawMultiplier =
健康流動倍率
× GC消耗倍率
× Boss活躍倍率
× 公會結構倍率
× 留存倍率
× 多層門檻倍率
```

```text
finalMultiplier = min(rawMultiplier, 5)
```

---

# 17. 反套利規則

## 17.1 純交易公會限制

若公會符合以下條件：

- 交易流水高
- 開包率低
- GC 消耗低
- Boss 參與低

則：

```text
finalMultiplier 強制鎖定 1x
```

---

## 17.2 全開包異常限制

若基礎包開包率過高，例如超過 50%，視為市場流動異常。

處理：

- 健康流動倍率降至 0.8x。
- 該公會進入觀察。

---

## 17.3 店長本人貢獻上限

店長本人數據最多只計入團隊指標：

```text
20%
```

避免自刷。

---

## 17.4 同設備 / 同 IP 風控

同設備或同 IP 大量帳號互相交易，不計入有效流水，並進入人工審核。

---

# 18. MVP 開發範圍

## 18.1 必做模組

1. 使用者系統
2. 錢包系統
3. 禮包發行系統
4. 禮包交易場
5. 禮包動態重分配
6. 開包系統
7. GC 錢包
8. 彩票錢包
9. 角色系統
10. 裝備系統
11. 強化 / 精煉
12. Boss 活動
13. 公會系統
14. 收益權與倍率計算
15. 彩票商城
16. 後台設定
17. 風控紀錄
18. 財務流水 Ledger

---

## 18.2 V1 不做

1. 大型地圖
2. 3D 角色
3. 即時 PvP
4. 區塊鏈
5. NFT
6. 複雜裝備自由市場
7. 自動提現
8. 彩票交易

---

# 19. 建議技術架構

以下為建議，可依現有專案調整。

前端：

- Next.js
- React
- Tailwind

後端：

- Next.js API routes 或 NestJS

資料庫：

- MySQL / PostgreSQL
- Prisma / Drizzle 擇一

背景任務：

- BullMQ / Cron job

必要工作：

- 交易場開關
- 強制開包掃描
- 禮包冷卻解除
- 放置收益結算
- Boss 結算
- 倍率結算
- 彩票商城兌換處理

---

# 20. 資料庫模型草案

## User

欄位：

- id
- email
- username
- inviterId
- guildId
- role
- createdAt
- updatedAt

---

## Wallet

欄位：

- id
- userId
- cashBalance
- gcBalance
- ticketBalance
- frozenBalance
- createdAt
- updatedAt

---

## LedgerEntry

所有金流與資產變動必須寫 Ledger。

欄位：

- id
- userId
- type
- assetType
- amount
- balanceBefore
- balanceAfter
- refType
- refId
- metadata
- createdAt

---

## LuckyPack

欄位：

- id
- ownerId
- initialPrice
- currentPrice
- lastTradePrice
- maxTradePrice
- tradeCount
- maxTradeCount
- contentValue
- contentSnapshot
- status
- cooldownUntil
- forceOpenAt
- createdAt
- updatedAt

---

## PackListing

欄位：

- id
- packId
- sellerId
- price
- status
- tradingSessionId
- createdAt
- completedAt

---

## TradingSession

欄位：

- id
- startsAt
- endsAt
- status
- type
- createdAt

---

## PackTrade

欄位：

- id
- packId
- buyerId
- sellerId
- price
- serviceFee
- status
- createdAt

---

## PackContentHistory

記錄每次重分配。

欄位：

- id
- packId
- tradeId
- contentValue
- oldSnapshot
- newSnapshot
- reason
- createdAt

---

## Character

欄位：

- id
- userId
- level
- exp
- class
- power
- stats
- createdAt

---

## Equipment

欄位：

- id
- ownerId
- slot
- rarity
- level
- refineLevel
- durability
- stats
- status
- createdAt

---

## Guild

欄位：

- id
- name
- leaderId
- level
- createdAt

---

## GuildMember

欄位：

- id
- guildId
- userId
- role
- joinedAt

---

## BossEvent

欄位：

- id
- name
- startsAt
- endsAt
- hp
- status
- rewardPool
- createdAt

---

## BossParticipation

欄位：

- id
- bossEventId
- userId
- guildId
- damage
- contribution
- rewardSnapshot
- createdAt

---

## RewardRightPeriod

欄位：

- id
- startsAt
- endsAt
- totalEffectiveTradeVolume
- totalRewardRightPool
- status

---

## RewardRightSnapshot

欄位：

- id
- periodId
- userId
- guildId
- effectiveTradeVolume
- baseRewardRight
- healthMultiplier
- gcMultiplier
- bossMultiplier
- guildMultiplier
- retentionMultiplier
- structureMultiplier
- finalMultiplier
- finalReward
- status
- createdAt

---

## ShopItem

欄位：

- id
- name
- costTickets
- stock
- costEstimate
- status
- createdAt

---

## Redemption

欄位：

- id
- userId
- shopItemId
- ticketCost
- status
- createdAt

---

# 21. 核心 API 草案

## 禮包

- POST /api/packs/purchase
- GET /api/packs/my
- POST /api/packs/list
- POST /api/packs/cancel-listing
- POST /api/packs/buy
- POST /api/packs/open
- GET /api/packs/:id

## 交易場

- GET /api/trading-sessions/current
- GET /api/trading-sessions/next
- GET /api/market/listings

## 遊戲

- GET /api/character/me
- POST /api/idle/claim
- POST /api/equipment/enhance
- POST /api/equipment/refine

## Boss

- GET /api/boss/current
- POST /api/boss/join
- GET /api/boss/ranking

## 公會

- POST /api/guild/create
- POST /api/guild/join
- GET /api/guild/:id
- GET /api/guild/:id/stats

## 收益

- GET /api/rewards/current
- GET /api/rewards/history
- POST /api/rewards/claim

## 彩票商城

- GET /api/shop/items
- POST /api/shop/redeem

## 後台

- POST /api/admin/packs/issue
- PATCH /api/admin/config/economy
- GET /api/admin/risk-dashboard
- GET /api/admin/ledger

---

# 22. 後台設定項

必須可調整：

## 禮包

- 初始價格
- 最大流轉次數
- 強制開包倍率
- 冷卻場次
- 內容分配率
- 內容配置權重

## 交易

- 交易場時間
- 交易服務費
- 單包最高漲幅
- 單帳號交易限制

## GC

- 開包 GC 權重
- 強化消耗
- 精煉消耗
- Boss 入場費
- 每日新增 / 消耗監控閾值

## 彩票

- 彩票釋放上限
- 商城兌換成本率
- 商品庫存
- 兌換限制

## 倍率

- 各倍率門檻
- 倍率上限
- 反作弊鎖定規則

---

# 23. 驗收標準

## 禮包交易

- 玩家只能在交易場內購買掛單。
- 掛單價格不可超過上一手價格 6%。
- 交易成功後必須產生 PackTrade。
- 交易成功後必須產生 LedgerEntry。
- 交易成功後必須觸發 PackContentHistory。
- 交易後禮包進入冷卻期。

## 動態重分配

- 每次交易成功後，舊 contentSnapshot 必須回收。
- 新 contentSnapshot 必須依 latestTradePrice 重新計算。
- 開包時不得重新隨機計算，只能揭曉當前 contentSnapshot。

## 開包

- 開包後內容物必須進玩家錢包或背包。
- 禮包必須改為 OPENED / BURNED。
- 已開包禮包不可再次交易。

## GC

- 所有 GC 增減必須寫 Ledger。
- 強化 / 精煉必須消耗 GC。
- 後台能看到每日 GC 新增與消耗。

## 彩票

- 彩票不可轉帳。
- 彩票不可交易。
- 彩票只能用於商城兌換。
- 所有兌換必須寫 Redemption 與 Ledger。

## 收益倍率

- 系統需能依 period 計算 baseRewardRight。
- 系統需能計算各倍率。
- finalMultiplier 不得超過 5x。
- 純交易無遊戲活躍的帳號 finalMultiplier 應被鎖定或降低。

---

# 24. Codex 任務拆分建議

## Task 1：建立資料庫模型

建立所有 Prisma / Drizzle schema。

完成 migration。

建立基礎 seed。

---

## Task 2：建立 Ledger 系統

所有貨幣與資產變動必須走 Ledger。

禁止直接更新餘額不留紀錄。

---

## Task 3：建立禮包發行與交易場

完成：

- 發行禮包
- 掛單
- 購買
- 冷卻
- 交易場時間限制

---

## Task 4：建立動態重分配引擎

完成：

- 回收舊內容
- 依價格重新估值
- 重新標記內容
- 寫入 PackContentHistory

---

## Task 5：建立開包系統

完成：

- 主動開包
- 強制開包
- 內容發放
- 禮包銷毀

---

## Task 6：建立角色、裝備、GC 消耗

完成：

- 角色頁
- 裝備頁
- 強化
- 精煉
- GC 消耗

---

## Task 7：建立 Boss 活動

完成：

- Boss 建立
- 參與
- 傷害計算
- 排名
- 獎勵發放

---

## Task 8：建立公會與有效玩家統計

完成：

- 建立公會
- 加入公會
- 公會統計
- 有效玩家計算

---

## Task 9：建立收益權與倍率計算

完成：

- period 結算
- baseRewardRight
- 各倍率
- finalReward
- 反作弊鎖倍率

---

## Task 10：建立彩票商城

完成：

- 商品列表
- 彩票兌換
- 庫存扣除
- 兌換紀錄

---

# 25. 最後開發原則

1. 先做數值與資料正確，不做華麗 UI。
2. 所有經濟行為必須可追溯。
3. 所有資產變動必須寫 Ledger。
4. 所有倍率與比例必須後台可調。
5. 彩票不可交易，不可提現。
6. 開包不是每日義務。
7. 交易收益要透過遊戲倍率放大，不做傳統多層抽成。
8. MVP 先證明經濟循環，再做美術與遊戲擴充。

