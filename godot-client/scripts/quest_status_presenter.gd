class_name QuestStatusPresenter
extends RefCounted

func apply_quest(game_state: Dictionary, active_page: String, event_feed: Array, controls: Dictionary) -> void:
	var copy: Dictionary = _quest_copy(game_state, active_page, event_feed)
	var quest_title_control: Variant = controls.get("quest_title", null)
	var quest_body_control: Variant = controls.get("quest_body", null)
	var main_action_control: Variant = controls.get("main_action", null)

	if quest_title_control is Label:
		var quest_title := quest_title_control as Label
		quest_title.text = String(copy["title"])
	if quest_body_control is Label:
		var quest_body := quest_body_control as Label
		quest_body.text = String(copy["body"])
	if main_action_control is Button:
		var main_action := main_action_control as Button
		main_action.text = String(copy["action"])

func _quest_copy(game_state: Dictionary, active_page: String, event_feed: Array) -> Dictionary:
	match active_page:
		"home":
			return {
				"title": "普隆丘陵 / 自動戰鬥中",
				"body": _home_status_text(event_feed),
				"action": "巡邏一次",
			}
		"packs":
			return {
				"title": "禮包玩法",
				"body": "模擬付款狀態：%s。內部經濟已發放禮包，外部金流暫未串接。" % String(game_state["simulated_payment"]),
				"action": "開啟禮包",
			}
		"market":
			return {
				"title": "交易場",
				"body": "交易場使用 GC、Session、價格上限與冷卻規則，先跑通內部經濟。",
				"action": "上架焦點禮包",
			}
		"challenge":
			return {
				"title": "挑戰與活動",
				"body": "Boss、公會、票券商店與賽季活動集中在這裡，作為玩法擴充入口。",
				"action": "使用挑戰票",
			}
		"role":
			return {
				"title": "角色 / 紙娃娃裝備",
				"body": "男女角色各一套基礎紙娃娃，裝備會顯示在角色身上。",
				"action": "切換裝備",
			}
		"inventory":
			return {
				"title": "背包",
				"body": "裝備、消耗品、材料與稀有物集中整理，避免首頁出現交易或禮包進度。",
				"action": "整理裝備",
			}
		"skills":
			return {
				"title": "技能",
				"body": "主動、被動與支援技能以圖示與等級呈現，戰鬥文字只保留在狀態欄。",
				"action": "切換技能",
			}
		"guild":
			return {
				"title": "公會",
				"body": "公會大廳集中顯示成員、Boss、商店、任務與捐獻。",
				"action": "公會捐獻",
			}
		"system":
			return {
				"title": "系統",
				"body": "玩家設定、音效、通知、語言與客服入口集中在系統頁。",
				"action": "套用設定",
			}
		_:
			return {
				"title": "普隆丘陵 / 自動戰鬥中",
				"body": _home_status_text(event_feed),
				"action": "巡邏一次",
			}

func _home_status_text(event_feed: Array) -> String:
	for event in event_feed:
		var text := String(event)
		if text.contains("LP-") or text.contains("禮包") or text.contains("交易") or text.contains("同步"):
			continue
		return text
	return "自動巡邏持續中，角色狀態已同步。"
