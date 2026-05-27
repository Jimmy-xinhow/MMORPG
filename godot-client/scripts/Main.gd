extends Node2D

const PlayerApiClientScript := preload("res://scripts/player_api_client.gd")
const PageFlowStateScript := preload("res://scripts/page_flow_state.gd")
const PlayerStateMapperScript := preload("res://scripts/player_state_mapper.gd")
const HudPresenterScript := preload("res://scripts/hud_presenter.gd")
const QuestStatusPresenterScript := preload("res://scripts/quest_status_presenter.gd")
const FeaturePageRendererScript := preload("res://scripts/feature_page_renderer.gd")
const PackPageStateBinderScript := preload("res://scripts/pack_page_state_binder.gd")
const MarketPageStateBinderScript := preload("res://scripts/market_page_state_binder.gd")
const RoleEquipmentStateBinderScript := preload("res://scripts/role_equipment_state_binder.gd")
const InventorySkillStateBinderScript := preload("res://scripts/inventory_skill_state_binder.gd")
const ChallengeGuildSystemStateBinderScript := preload("res://scripts/challenge_guild_system_state_binder.gd")

const VIEWPORT_SIZE := Vector2(432, 768)
const HUD_TOP_RECT := Rect2(0, 0, 432, 152)
const RESOURCE_RECT := Rect2(236, 18, 108, 88)
const HOME_STAGE_RECT := Rect2(0, 152, 432, 388)
const HOME_STAGE_SHADE_RECT := Rect2(0, 512, 432, 28)
const QUEST_RECT := Rect2(8, 548, 416, 148)
const NAV_RECT := Rect2(0, 702, 432, 66)
const CONTENT_RECT := Rect2(8, 154, 416, 540)
const HOME_PLAYER_BASE := Vector2(178, 490)
const HOME_PLAYER_SIZE := Vector2(154, 231)
const HOME_ENEMY_BASE := Vector2(336, 500)
const HOME_COMPOSITE_PATH := "res://assets/production/ui/home-target-composite.png"
const PAGE_COMPOSITE_PATHS := {
	"home": HOME_COMPOSITE_PATH,
	"role": "res://assets/production/ui/role-target-composite.png",
	"packs": "res://assets/production/ui/packs-target-composite.png",
	"market": "res://assets/production/ui/market-target-composite.png",
	"challenge": "res://assets/production/ui/challenge-target-composite.png",
	"guild": "res://assets/production/ui/guild-target-composite.png",
	"system": "res://assets/production/ui/system-target-composite.png",
	"feedback": "res://assets/production/ui/beta-feedback-target-composite.png",
	"achievements": "res://assets/production/ui/achievements-title-target-composite.png",
	"codex": "res://assets/production/ui/codex-collection-target-composite.png",
	"tutorial": "res://assets/production/ui/tutorial-guide-target-composite.png",
	"chat": "res://assets/production/ui/chat-social-target-composite.png",
	"party": "res://assets/production/ui/party-recruit-target-composite.png",
	"pets": "res://assets/production/ui/pet-companion-target-composite.png",
	"enhance": "res://assets/production/ui/equipment-enhance-target-composite.png",
	"arena": "res://assets/production/ui/arena-target-composite.png",
	"boss_preview": "res://assets/production/ui/boss-preview-target-composite.png",
	"dispatch_result": "res://assets/production/ui/dispatch-result-target-composite.png",
	"battle_stats": "res://assets/production/ui/battle-stats-target-composite.png",
	"title_detail": "res://assets/production/ui/title-detail-target-composite.png",
	"codex_detail": "res://assets/production/ui/codex-detail-target-composite.png",
	"appearance_collection": "res://assets/production/ui/appearance-collection-target-composite.png",
	"badge_collection": "res://assets/production/ui/badge-collection-target-composite.png",
	"tutorial_battle": "res://assets/production/ui/tutorial-battle-target-composite.png",
	"tutorial_inventory": "res://assets/production/ui/tutorial-inventory-target-composite.png",
	"tutorial_skills": "res://assets/production/ui/tutorial-skills-target-composite.png",
	"tutorial_guild": "res://assets/production/ui/tutorial-guild-target-composite.png",
	"daily_checkin": "res://assets/production/ui/daily-checkin-target-composite.png",
	"pass_progress": "res://assets/production/ui/pass-progress-target-composite.png",
	"timed_challenge": "res://assets/production/ui/timed-challenge-target-composite.png",
	"event_exchange_confirm": "res://assets/production/ui/event-exchange-confirm-target-composite.png",
}
const PACK_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/packs-target-composite.png",
	"shop": "res://assets/production/ui/pack-shop-target-composite.png",
	"confirm": "res://assets/production/ui/pack-confirm-target-composite.png",
	"result": "res://assets/production/ui/pack-result-target-composite.png",
	"records": "res://assets/production/ui/pack-records-target-composite.png",
	"odds": "res://assets/production/ui/pack-odds-target-composite.png",
}
const ROLE_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/role-target-composite.png",
	"equipment": "res://assets/production/ui/role-equipment-target-composite.png",
	"training": "res://assets/production/ui/role-training-target-composite.png",
	"job": "res://assets/production/ui/role-job-target-composite.png",
	"appearance": "res://assets/production/ui/role-appearance-target-composite.png",
}
const MARKET_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/market-target-composite.png",
	"confirm": "res://assets/production/ui/market-confirm-target-composite.png",
	"list": "res://assets/production/ui/market-list-target-composite.png",
	"records": "res://assets/production/ui/market-records-target-composite.png",
	"rules": "res://assets/production/ui/market-rules-target-composite.png",
}
const CHALLENGE_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/challenge-target-composite.png",
	"confirm": "res://assets/production/ui/challenge-confirm-target-composite.png",
	"battle": "res://assets/production/ui/challenge-battle-target-composite.png",
	"result": "res://assets/production/ui/challenge-result-target-composite.png",
	"records": "res://assets/production/ui/challenge-records-target-composite.png",
}
const GUILD_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/guild-hall-target-composite.png",
	"donate": "res://assets/production/ui/guild-donate-target-composite.png",
	"boss": "res://assets/production/ui/guild-boss-target-composite.png",
	"shop": "res://assets/production/ui/guild-shop-target-composite.png",
}
const SYSTEM_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/system-settings-target-composite.png",
	"graphics": "res://assets/production/ui/system-graphics-target-composite.png",
	"account": "res://assets/production/ui/system-account-target-composite.png",
	"logout": "res://assets/production/ui/system-logout-target-composite.png",
}
const INVENTORY_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/inventory-main-target-composite.png",
	"detail": "res://assets/production/ui/inventory-detail-target-composite.png",
	"materials": "res://assets/production/ui/inventory-materials-target-composite.png",
	"use": "res://assets/production/ui/inventory-use-target-composite.png",
}
const SKILL_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/skills-main-target-composite.png",
	"upgrade": "res://assets/production/ui/skills-upgrade-target-composite.png",
	"equip": "res://assets/production/ui/skills-equip-target-composite.png",
	"tree": "res://assets/production/ui/skills-tree-target-composite.png",
}
const SHOP_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/shop-main-target-composite.png",
	"detail": "res://assets/production/ui/shop-detail-target-composite.png",
	"confirm": "res://assets/production/ui/shop-confirm-target-composite.png",
	"result": "res://assets/production/ui/shop-result-target-composite.png",
}
const QUEST_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/quests-main-target-composite.png",
	"detail": "res://assets/production/ui/quests-detail-target-composite.png",
	"event": "res://assets/production/ui/quests-event-target-composite.png",
	"reward": "res://assets/production/ui/quests-reward-target-composite.png",
}
const RANKING_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/ranking-power-target-composite.png",
	"challenge": "res://assets/production/ui/ranking-challenge-target-composite.png",
	"guild": "res://assets/production/ui/ranking-guild-target-composite.png",
	"player": "res://assets/production/ui/ranking-player-target-composite.png",
}
const MAIL_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/mail-inbox-target-composite.png",
	"detail": "res://assets/production/ui/mail-detail-target-composite.png",
	"claim": "res://assets/production/ui/mail-claim-target-composite.png",
	"announcement": "res://assets/production/ui/mail-announcement-target-composite.png",
}
const FRIENDS_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/friends-list-target-composite.png",
	"party": "res://assets/production/ui/friends-party-target-composite.png",
	"invite": "res://assets/production/ui/friends-invite-target-composite.png",
	"support": "res://assets/production/ui/friends-support-target-composite.png",
}
const WORLD_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/world-map-target-composite.png",
	"region": "res://assets/production/ui/world-region-target-composite.png",
	"stage": "res://assets/production/ui/world-stage-target-composite.png",
	"dispatch": "res://assets/production/ui/world-dispatch-target-composite.png",
}
const ACCOUNT_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/account-login-target-composite.png",
	"select": "res://assets/production/ui/account-select-target-composite.png",
	"create": "res://assets/production/ui/account-create-target-composite.png",
	"server": "res://assets/production/ui/account-server-target-composite.png",
}
const LIVEOPS_COMPOSITE_PATHS := {
	"main": "res://assets/production/ui/liveops-detail-target-composite.png",
	"tasks": "res://assets/production/ui/liveops-tasks-target-composite.png",
	"shop": "res://assets/production/ui/liveops-shop-target-composite.png",
	"ranking": "res://assets/production/ui/liveops-ranking-target-composite.png",
}
const TAB_NAMES := ["首頁", "角色", "禮包", "交易", "挑戰", "公會", "系統"]
const PAGE_NAMES := ["home", "role", "packs", "market", "challenge", "guild", "system"]
const ARG_PAGE_NAMES := ["home", "role", "packs", "market", "challenge", "guild", "system", "inventory", "skills", "shop", "quests", "ranking", "mail", "friends", "world", "account", "liveops", "feedback", "achievements", "codex", "tutorial", "chat", "party", "pets", "enhance", "arena", "boss_preview", "dispatch_result", "battle_stats", "title_detail", "codex_detail", "appearance_collection", "badge_collection", "tutorial_battle", "tutorial_inventory", "tutorial_skills", "tutorial_guild", "daily_checkin", "pass_progress", "timed_challenge", "event_exchange_confirm"]

var api_base_url := "http://127.0.0.1:3000"
var game_state := {
	"player_name": "艾爾文",
	"gender": "male",
	"level": 12,
	"exp": 64,
	"gc": 12880,
	"tickets": 3,
	"region": "普隆丘陵",
	"session": "交易場開放中",
	"pack_focus": "LP-2048",
	"pack_status": "OWNED",
	"pack_price": 101,
	"trade_count": 1,
	"open_result": "星塵護符 / Rare",
	"party_power": 2160,
	"boss_hp": 68,
	"guild_name": "晨星旅團",
	"simulated_payment": "SIMULATED_APPROVED",
	"equipped": {
		"weapon": "銅製短劍",
		"armor": "初心者外套",
		"head": "冒險者髮帶",
		"accessory": "藍色披肩",
	},
	"active_page": "home",
	"step": 1,
}

var paper_dolls := [
	{
		"gender": "male",
		"name": "艾爾文",
		"job": "初心戰士",
		"equipped": {
			"weapon": "銅製短劍",
			"armor": "初心者外套",
			"head": "冒險者髮帶",
			"accessory": "藍色披肩",
		},
	},
	{
		"gender": "female",
		"name": "莉娜",
		"job": "初心法師",
		"equipped": {
			"weapon": "橡木法杖",
			"armor": "學徒長袍",
			"head": "羽飾髮夾",
			"accessory": "紅色披肩",
		},
	},
]

var inventory_items := [
	{"name": "初心者外套", "type": "armor", "rarity": "Common", "qty": 1},
	{"name": "銅製短劍", "type": "weapon", "rarity": "Common", "qty": 1},
	{"name": "星塵護符", "type": "accessory", "rarity": "Rare", "qty": 1},
	{"name": "橡木法杖", "type": "weapon", "rarity": "Rare", "qty": 1},
]

var pack_cards := [
	{"id": "LP-2048", "status": "OWNED", "price": 101, "trades": 1, "result": "待開啟"},
	{"id": "LP-2036", "status": "LISTED", "price": 107, "trades": 2, "result": "交易場展示"},
	{"id": "LP-1988", "status": "BURNED", "price": 88, "trades": 0, "result": "星塵護符"},
]

var market_rows := [
	{"pack": "LP-2036", "seller": "Player-07", "price": "107 GC", "state": "可購買"},
	{"pack": "LP-2110", "seller": "Player-18", "price": "119 GC", "state": "冷卻中"},
	{"pack": "LP-2099", "seller": "Player-24", "price": "102 GC", "state": "即將開放"},
]

var event_feed := [
	"艾爾文對丘陵史萊姆造成 152 點傷害。",
	"丘陵史萊姆對你造成 38 點傷害。",
	"自動巡邏持續中，後備玩家狀態已同步。",
]

var boss_rows := [
	["Boss挑戰", "巨岩守衛 HP 68%", "消耗 1 張挑戰票"],
	["公會", "晨星旅團 12/30", "今日貢獻 420"],
	["票券商店", "挑戰票 x3", "庫存 28"],
	["賽季活動", "第 1 季 探索週", "排行榜快照倒數 2 天"],
]

var class_rows := [
	["戰士", "耐久近戰", "HP 120% / 傷害 90%"],
	["遊俠", "遠程輸出", "HP 95% / 傷害 115%"],
	["法師", "爆發技能", "HP 80% / 傷害 130%"],
	["牧師", "支援恢復", "HP 100% / 治療上限"],
]

var skill_rows := [
	["重擊", "Lv.4", "升級成本 660 GC"],
	["精準射擊", "Lv.3", "升級成本 440 GC"],
	["元素爆裂", "Lv.2", "冷卻較高"],
	["群體治癒", "Lv.2", "支援上限啟用"],
]

var world: GameWorld
var hud: CanvasLayer
var portrait_doll: PaperDollView
var top_hud_panel: Control
var top_story: Label
var level_label: Label
var exp_bar: ProgressBar
var power_label: Label
var resource_labels: Dictionary = {}
var quest_title: Label
var quest_body: Label
var main_action: Button
var home_stage_spacer: Control
var quest_panel: PanelContainer
var content_panel: PanelContainer
var content_title: Label
var content_body: VBoxContainer
var nav_bg: TextureRect
var home_action_hotspot: Button
var page_hotspot_buttons: Array[Button] = []
var nav_buttons: Array[Button] = []
var page_flow_state
var player_api_client
var player_state_mapper
var hud_presenter
var quest_status_presenter
var feature_page_renderer
var pack_page_state_binder
var market_page_state_binder
var role_equipment_state_binder
var inventory_skill_state_binder
var challenge_guild_system_state_binder

func _ready() -> void:
	get_viewport().content_scale_size = VIEWPORT_SIZE
	get_viewport().content_scale_mode = Window.CONTENT_SCALE_MODE_CANVAS_ITEMS
	page_flow_state = PageFlowStateScript.new()
	player_state_mapper = PlayerStateMapperScript.new()
	hud_presenter = HudPresenterScript.new()
	quest_status_presenter = QuestStatusPresenterScript.new()
	feature_page_renderer = FeaturePageRendererScript.new()
	pack_page_state_binder = PackPageStateBinderScript.new()
	market_page_state_binder = MarketPageStateBinderScript.new()
	role_equipment_state_binder = RoleEquipmentStateBinderScript.new()
	inventory_skill_state_binder = InventorySkillStateBinderScript.new()
	challenge_guild_system_state_binder = ChallengeGuildSystemStateBinderScript.new()
	_apply_start_page_from_args()
	_build_world()
	_build_hud()
	_build_api_bridge()
	_refresh_all()
	_request_player_state()

func _process(delta: float) -> void:
	world.tick(delta)

func _build_world() -> void:
	world = GameWorld.new()
	world.position = Vector2.ZERO
	world.z_index = 0
	add_child(world)

func _build_hud() -> void:
	hud = CanvasLayer.new()
	hud.layer = 1
	add_child(hud)

	var root := Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	hud.add_child(root)

	_build_top_hud(root)

	home_stage_spacer = Control.new()
	home_stage_spacer.position = HOME_STAGE_RECT.position
	home_stage_spacer.size = HOME_STAGE_RECT.size
	home_stage_spacer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(home_stage_spacer)

	_build_quest_hud(root)
	_build_content_hud(root)
	_build_bottom_nav(root)
	_build_home_hotspots(root)
	_build_page_hotspots(root)

func _build_top_hud(root: Control) -> void:
	var panel := Control.new()
	panel.position = HUD_TOP_RECT.position
	panel.size = HUD_TOP_RECT.size
	top_hud_panel = panel
	root.add_child(panel)

	var frame := TextureRect.new()
	frame.texture = _load_texture_resource("res://assets/production/ui/hud-frame.png")
	frame.set_anchors_preset(Control.PRESET_FULL_RECT)
	frame.stretch_mode = TextureRect.STRETCH_SCALE
	frame.mouse_filter = Control.MOUSE_FILTER_IGNORE
	panel.add_child(frame)

	var portrait := PanelContainer.new()
	portrait.position = Vector2(14, 16)
	portrait.size = Vector2(58, 58)
	portrait.clip_contents = true
	portrait.add_theme_stylebox_override("panel", _portrait_style())
	panel.add_child(portrait)

	portrait_doll = PaperDollView.new()
	portrait_doll.portrait_mode = true
	portrait_doll.set_anchors_preset(Control.PRESET_FULL_RECT)
	portrait_doll.clip_contents = true
	portrait.add_child(portrait_doll)

	top_story = Label.new()
	top_story.position = Vector2(20, 88)
	top_story.size = Vector2(156, 24)
	top_story.autowrap_mode = TextServer.AUTOWRAP_OFF
	top_story.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	top_story.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	top_story.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	top_story.add_theme_font_size_override("font_size", 13)
	top_story.add_theme_color_override("font_color", Color("#fff1d6"))
	panel.add_child(top_story)

	level_label = Label.new()
	level_label.position = Vector2(94, 72)
	level_label.size = Vector2(72, 18)
	level_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	level_label.add_theme_font_size_override("font_size", 11)
	level_label.add_theme_color_override("font_color", Color("#92e7ff"))
	panel.add_child(level_label)

	var hp_label := Label.new()
	hp_label.text = "HP 100%"
	hp_label.position = Vector2(94, 22)
	hp_label.size = Vector2(72, 15)
	hp_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hp_label.add_theme_font_size_override("font_size", 9)
	hp_label.add_theme_color_override("font_color", Color("#ffd46f"))
	panel.add_child(hp_label)

	var hp_bar := ProgressBar.new()
	hp_bar.position = Vector2(94, 22)
	hp_bar.size = Vector2(72, 13)
	hp_bar.min_value = 0
	hp_bar.max_value = 100
	hp_bar.value = 100
	hp_bar.add_theme_stylebox_override("background", _bar_style(Color("#1a212b"), Color("#3f5066")))
	hp_bar.add_theme_stylebox_override("fill", _bar_style(Color("#e94238"), Color("#ffb066")))
	hp_bar.add_theme_font_size_override("font_size", 10)
	hp_bar.add_theme_color_override("font_color", Color("#fff3df"))
	panel.add_child(hp_bar)

	var exp_label := Label.new()
	exp_label.text = "EXP"
	exp_label.position = Vector2(94, 56)
	exp_label.size = Vector2(34, 16)
	exp_label.add_theme_font_size_override("font_size", 10)
	exp_label.add_theme_color_override("font_color", Color("#ffd46f"))
	panel.add_child(exp_label)

	exp_bar = ProgressBar.new()
	exp_bar.position = Vector2(94, 42)
	exp_bar.size = Vector2(72, 13)
	exp_bar.min_value = 0
	exp_bar.max_value = 100
	exp_bar.step = 0
	exp_bar.add_theme_stylebox_override("background", _bar_style(Color("#1a212b"), Color("#3f5066")))
	exp_bar.add_theme_stylebox_override("fill", _bar_style(Color("#24aee7"), Color("#7be9ff")))
	exp_bar.add_theme_font_size_override("font_size", 10)
	exp_bar.add_theme_color_override("font_color", Color("#f8fbff"))
	panel.add_child(exp_bar)

	power_label = Label.new()
	power_label.position = Vector2(20, 112)
	power_label.size = Vector2(150, 24)
	power_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	power_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	power_label.add_theme_font_size_override("font_size", 14)
	power_label.add_theme_color_override("font_color", Color("#ffd36f"))
	panel.add_child(power_label)

	var adventure_status := PanelContainer.new()
	adventure_status.position = Vector2(182, 36)
	adventure_status.size = Vector2(118, 78)
	adventure_status.add_theme_stylebox_override("panel", _plain_status_style())
	panel.add_child(adventure_status)

	var status_box := VBoxContainer.new()
	status_box.add_theme_constant_override("separation", 2)
	adventure_status.add_child(status_box)

	var status_title := Label.new()
	status_title.text = "冒險狀態"
	status_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	status_title.add_theme_font_size_override("font_size", 12)
	status_title.add_theme_color_override("font_color", Color("#ffe0a0"))
	status_box.add_child(status_title)

	var status_line := Label.new()
	status_line.text = "自動巡邏\n目標 丘陵史萊姆"
	status_line.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	status_line.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	status_line.add_theme_font_size_override("font_size", 10)
	status_line.add_theme_color_override("font_color", Color("#dcefff"))
	status_box.add_child(status_line)

	var resource_keys := ["gc", "tickets", "session"]
	for i in range(resource_keys.size()):
		var label := Label.new()
		label.position = Vector2(324, 38 + i * 27)
		label.size = Vector2(88, 22)
		label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		label.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		label.add_theme_font_size_override("font_size", 12)
		label.add_theme_color_override("font_color", Color("#f6e7a8"))
		resource_labels[resource_keys[i]] = label
		panel.add_child(label)

func _build_resource_hud(root: Control) -> void:
	var row := HBoxContainer.new()
	row.position = RESOURCE_RECT.position
	row.size = RESOURCE_RECT.size
	row.add_theme_constant_override("separation", 4)
	root.add_child(row)

	for key in ["gc", "tickets", "session"]:
		var cell := PanelContainer.new()
		cell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		cell.add_theme_stylebox_override("panel", _resource_style())
		row.add_child(cell)

		var label := Label.new()
		label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		label.add_theme_font_size_override("font_size", 11)
		label.add_theme_color_override("font_color", Color("#f6e7a8"))
		resource_labels[key] = label
		cell.add_child(label)

func _build_quest_hud(root: Control) -> void:
	quest_panel = PanelContainer.new()
	quest_panel.position = QUEST_RECT.position
	quest_panel.size = QUEST_RECT.size
	quest_panel.add_theme_stylebox_override("panel", _status_texture_style())
	root.add_child(quest_panel)

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 2)
	quest_panel.add_child(box)

	quest_title = Label.new()
	quest_title.add_theme_font_size_override("font_size", 14)
	quest_title.add_theme_color_override("font_color", Color("#ffdf83"))
	box.add_child(quest_title)

	quest_body = Label.new()
	quest_body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	quest_body.add_theme_font_size_override("font_size", 11)
	quest_body.add_theme_color_override("font_color", Color("#ece6f3"))
	box.add_child(quest_body)

	main_action = Button.new()
	main_action.custom_minimum_size = Vector2(0, 26)
	main_action.pressed.connect(_on_main_action_pressed)
	_apply_button_style(main_action, true)
	box.add_child(main_action)

func _build_content_hud(root: Control) -> void:
	content_panel = PanelContainer.new()
	content_panel.position = CONTENT_RECT.position
	content_panel.size = CONTENT_RECT.size
	content_panel.add_theme_stylebox_override("panel", _texture_style("res://assets/production/ui/page-panel.png", 32, _section_style()))
	root.add_child(content_panel)

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 5)
	content_panel.add_child(box)

	content_title = Label.new()
	content_title.add_theme_font_size_override("font_size", 15)
	content_title.add_theme_color_override("font_color", Color("#87e7ff"))
	box.add_child(content_title)

	var scroll := ScrollContainer.new()
	scroll.custom_minimum_size = Vector2(0, 500)
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	box.add_child(scroll)

	content_body = VBoxContainer.new()
	content_body.add_theme_constant_override("separation", 5)
	content_body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(content_body)

func _build_bottom_nav(root: Control) -> void:
	var nav_root := Control.new()
	nav_root.position = NAV_RECT.position
	nav_root.size = NAV_RECT.size
	root.add_child(nav_root)

	nav_bg = TextureRect.new()
	nav_bg.texture = _load_texture_resource("res://assets/production/ui/bottom-nav.png")
	nav_bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	nav_bg.stretch_mode = TextureRect.STRETCH_SCALE
	nav_bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	nav_root.add_child(nav_bg)

	var nav := HBoxContainer.new()
	nav.anchor_left = 0.0
	nav.anchor_top = 0.0
	nav.anchor_right = 1.0
	nav.anchor_bottom = 1.0
	nav.offset_left = 8
	nav.offset_top = 4
	nav.offset_right = -8
	nav.offset_bottom = -4
	nav.add_theme_constant_override("separation", 2)
	nav_root.add_child(nav)

	for i in range(TAB_NAMES.size()):
		var button := Button.new()
		button.text = ""
		button.tooltip_text = TAB_NAMES[i]
		button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		button.custom_minimum_size = Vector2(0, 58)
		button.pressed.connect(_on_tab_pressed.bind(PAGE_NAMES[i]))
		_apply_nav_button_style(button, false)
		nav_buttons.append(button)
		nav.add_child(button)

func _build_home_hotspots(root: Control) -> void:
	home_action_hotspot = Button.new()
	home_action_hotspot.position = Vector2(132, 622)
	home_action_hotspot.size = Vector2(168, 48)
	home_action_hotspot.text = ""
	home_action_hotspot.tooltip_text = "挑戰首領"
	home_action_hotspot.pressed.connect(_on_main_action_pressed)
	_apply_transparent_button_style(home_action_hotspot)
	root.add_child(home_action_hotspot)

func _build_page_hotspots(root: Control) -> void:
	var specs := [
		{"page": "role", "role_view": "main", "action": "role_train", "tooltip": "培養角色", "rect": Rect2(35, 632, 96, 42)},
		{"page": "role", "role_view": "main", "action": "role_equip", "tooltip": "裝備管理", "rect": Rect2(168, 632, 96, 42)},
		{"page": "role", "role_view": "main", "action": "role_job", "tooltip": "轉職預覽", "rect": Rect2(300, 632, 96, 42)},
		{"page": "role", "role_view": "equipment", "action": "role_back_main", "tooltip": "返回角色", "rect": Rect2(42, 618, 94, 42)},
		{"page": "role", "role_view": "equipment", "action": "role_apply_equipment", "tooltip": "裝備道具", "rect": Rect2(168, 618, 94, 42)},
		{"page": "role", "role_view": "equipment", "action": "role_appearance", "tooltip": "外觀", "rect": Rect2(298, 618, 94, 42)},
		{"page": "role", "role_view": "training", "action": "role_back_main", "tooltip": "返回角色", "rect": Rect2(42, 636, 92, 42)},
		{"page": "role", "role_view": "training", "action": "role_train_once", "tooltip": "培養一次", "rect": Rect2(170, 636, 92, 42)},
		{"page": "role", "role_view": "training", "action": "role_auto_train", "tooltip": "自動培養", "rect": Rect2(298, 636, 92, 42)},
		{"page": "role", "role_view": "job", "action": "role_back_main", "tooltip": "返回角色", "rect": Rect2(42, 636, 92, 42)},
		{"page": "role", "role_view": "job", "action": "role_preview_skill", "tooltip": "預覽技能", "rect": Rect2(170, 636, 92, 42)},
		{"page": "role", "role_view": "job", "action": "role_confirm_job", "tooltip": "確認轉職", "rect": Rect2(298, 636, 92, 42)},
		{"page": "role", "role_view": "appearance", "action": "role_back_main", "tooltip": "返回角色", "rect": Rect2(42, 636, 92, 42)},
		{"page": "role", "role_view": "appearance", "action": "role_apply_appearance", "tooltip": "套用外觀", "rect": Rect2(170, 636, 92, 42)},
		{"page": "role", "role_view": "appearance", "action": "role_reset_appearance", "tooltip": "重置外觀", "rect": Rect2(298, 636, 92, 42)},
		{"page": "packs", "view": "main", "action": "pack_open_starter", "tooltip": "開啟新手禮包", "rect": Rect2(64, 414, 82, 38)},
		{"page": "packs", "view": "main", "action": "pack_open_adventurer", "tooltip": "開啟冒險者禮包", "rect": Rect2(176, 414, 82, 38)},
		{"page": "packs", "view": "main", "action": "pack_open_hero", "tooltip": "開啟勇者禮包", "rect": Rect2(292, 414, 82, 38)},
		{"page": "packs", "view": "main", "action": "pack_shop", "tooltip": "禮包商店", "rect": Rect2(335, 132, 72, 40)},
		{"page": "packs", "view": "main", "action": "pack_records", "tooltip": "禮包紀錄", "rect": Rect2(335, 184, 72, 40)},
		{"page": "packs", "view": "main", "action": "pack_odds", "tooltip": "機率說明", "rect": Rect2(335, 236, 72, 40)},
		{"page": "packs", "view": "shop", "action": "pack_shop_buy", "tooltip": "購買禮包", "rect": Rect2(64, 302, 120, 42)},
		{"page": "packs", "view": "shop", "action": "pack_shop_buy", "tooltip": "購買禮包", "rect": Rect2(248, 302, 120, 42)},
		{"page": "packs", "view": "shop", "action": "pack_back_main", "tooltip": "返回禮包", "rect": Rect2(18, 710, 55, 50)},
		{"page": "packs", "view": "confirm", "action": "pack_confirm_cancel", "tooltip": "取消開啟", "rect": Rect2(72, 646, 96, 42)},
		{"page": "packs", "view": "confirm", "action": "pack_confirm_open", "tooltip": "確認開啟", "rect": Rect2(260, 646, 96, 42)},
		{"page": "packs", "view": "confirm", "action": "pack_odds", "tooltip": "機率說明", "rect": Rect2(24, 158, 62, 62)},
		{"page": "packs", "view": "result", "action": "pack_result_again", "tooltip": "再開一次", "rect": Rect2(35, 604, 100, 42)},
		{"page": "packs", "view": "result", "action": "pack_result_bag", "tooltip": "前往背包", "rect": Rect2(166, 604, 100, 42)},
		{"page": "packs", "view": "result", "action": "pack_records", "tooltip": "查看紀錄", "rect": Rect2(297, 604, 100, 42)},
		{"page": "packs", "view": "records", "action": "pack_back_main", "tooltip": "返回禮包", "rect": Rect2(30, 650, 100, 42)},
		{"page": "packs", "view": "records", "action": "pack_record_result", "tooltip": "查看結果", "rect": Rect2(166, 650, 100, 42)},
		{"page": "packs", "view": "records", "action": "pack_odds", "tooltip": "機率說明", "rect": Rect2(298, 650, 100, 42)},
		{"page": "packs", "view": "odds", "action": "pack_back_main", "tooltip": "返回禮包", "rect": Rect2(74, 650, 120, 42)},
		{"page": "packs", "view": "odds", "action": "pack_records", "tooltip": "查看紀錄", "rect": Rect2(236, 650, 120, 42)},
		{"page": "market", "market_view": "main", "action": "market_buy", "tooltip": "購買商品", "rect": Rect2(356, 166, 52, 48)},
		{"page": "market", "market_view": "main", "action": "market_buy", "tooltip": "購買商品", "rect": Rect2(356, 238, 52, 48)},
		{"page": "market", "market_view": "main", "action": "market_list", "tooltip": "上架商品", "rect": Rect2(142, 88, 92, 38)},
		{"page": "market", "market_view": "main", "action": "market_records", "tooltip": "交易紀錄", "rect": Rect2(245, 88, 92, 38)},
		{"page": "market", "market_view": "main", "action": "market_refresh", "tooltip": "刷新交易行", "rect": Rect2(318, 604, 92, 40)},
		{"page": "market", "market_view": "confirm", "action": "market_cancel", "tooltip": "取消購買", "rect": Rect2(42, 620, 92, 42)},
		{"page": "market", "market_view": "confirm", "action": "market_confirm_buy", "tooltip": "確認購買", "rect": Rect2(170, 620, 92, 42)},
		{"page": "market", "market_view": "confirm", "action": "market_back_main", "tooltip": "返回交易", "rect": Rect2(298, 620, 92, 42)},
		{"page": "market", "market_view": "list", "action": "market_list_cancel", "tooltip": "取消上架", "rect": Rect2(42, 628, 92, 42)},
		{"page": "market", "market_view": "list", "action": "market_confirm_list", "tooltip": "確認上架", "rect": Rect2(170, 628, 92, 42)},
		{"page": "market", "market_view": "list", "action": "market_back_main", "tooltip": "返回交易", "rect": Rect2(298, 628, 92, 42)},
		{"page": "market", "market_view": "records", "action": "market_back_main", "tooltip": "返回交易", "rect": Rect2(42, 646, 92, 42)},
		{"page": "market", "market_view": "records", "action": "market_rules", "tooltip": "查看規則", "rect": Rect2(170, 646, 92, 42)},
		{"page": "market", "market_view": "records", "action": "market_refresh", "tooltip": "篩選紀錄", "rect": Rect2(298, 646, 92, 42)},
		{"page": "market", "market_view": "rules", "action": "market_back_main", "tooltip": "返回交易", "rect": Rect2(80, 646, 112, 42)},
		{"page": "market", "market_view": "rules", "action": "market_records", "tooltip": "查看紀錄", "rect": Rect2(240, 646, 112, 42)},
		{"page": "challenge", "challenge_view": "main", "action": "challenge_boss", "tooltip": "挑戰 Boss", "rect": Rect2(142, 301, 148, 42)},
		{"page": "challenge", "challenge_view": "main", "action": "challenge_daily", "tooltip": "每日挑戰", "rect": Rect2(41, 620, 92, 42)},
		{"page": "challenge", "challenge_view": "main", "action": "challenge_guild", "tooltip": "公會挑戰", "rect": Rect2(170, 620, 92, 42)},
		{"page": "challenge", "challenge_view": "main", "action": "challenge_records", "tooltip": "挑戰紀錄", "rect": Rect2(298, 620, 92, 42)},
		{"page": "challenge", "challenge_view": "confirm", "action": "challenge_cancel", "tooltip": "取消挑戰", "rect": Rect2(42, 636, 92, 42)},
		{"page": "challenge", "challenge_view": "confirm", "action": "challenge_start", "tooltip": "開始挑戰", "rect": Rect2(170, 636, 92, 42)},
		{"page": "challenge", "challenge_view": "confirm", "action": "challenge_back_main", "tooltip": "返回挑戰", "rect": Rect2(298, 636, 92, 42)},
		{"page": "challenge", "challenge_view": "battle", "action": "challenge_retreat", "tooltip": "撤退", "rect": Rect2(42, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "battle", "action": "challenge_finish", "tooltip": "完成戰鬥", "rect": Rect2(170, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "battle", "action": "challenge_speed", "tooltip": "加速", "rect": Rect2(298, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "result", "action": "challenge_again", "tooltip": "再挑戰", "rect": Rect2(42, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "result", "action": "challenge_bag", "tooltip": "前往角色", "rect": Rect2(170, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "result", "action": "challenge_back_main", "tooltip": "返回挑戰", "rect": Rect2(298, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "records", "action": "challenge_back_main", "tooltip": "返回挑戰", "rect": Rect2(42, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "records", "action": "challenge_result", "tooltip": "查看獎勵", "rect": Rect2(170, 646, 92, 42)},
		{"page": "challenge", "challenge_view": "records", "action": "challenge_ticket_shop", "tooltip": "票券商店", "rect": Rect2(298, 646, 92, 42)},
		{"page": "guild", "guild_view": "main", "action": "guild_donate_view", "tooltip": "公會捐獻", "rect": Rect2(35, 462, 176, 64)},
		{"page": "guild", "guild_view": "main", "action": "guild_boss_view", "tooltip": "公會 Boss", "rect": Rect2(220, 462, 176, 64)},
		{"page": "guild", "guild_view": "main", "action": "guild_shop_view", "tooltip": "公會商店", "rect": Rect2(35, 540, 176, 64)},
		{"page": "guild", "guild_view": "main", "action": "guild_shop_view", "tooltip": "公會任務", "rect": Rect2(220, 540, 176, 64)},
		{"page": "guild", "guild_view": "donate", "action": "guild_back_main", "tooltip": "取消", "rect": Rect2(66, 598, 112, 44)},
		{"page": "guild", "guild_view": "donate", "action": "guild_donate", "tooltip": "捐獻", "rect": Rect2(254, 598, 112, 44)},
		{"page": "guild", "guild_view": "donate", "action": "guild_back_main", "tooltip": "返回", "rect": Rect2(158, 654, 116, 42)},
		{"page": "guild", "guild_view": "boss", "action": "guild_back_main", "tooltip": "撤退", "rect": Rect2(35, 646, 92, 42)},
		{"page": "guild", "guild_view": "boss", "action": "guild_boss", "tooltip": "開始戰鬥", "rect": Rect2(144, 646, 144, 42)},
		{"page": "guild", "guild_view": "boss", "action": "guild_back_main", "tooltip": "返回", "rect": Rect2(310, 646, 92, 42)},
		{"page": "guild", "guild_view": "shop", "action": "guild_back_main", "tooltip": "返回", "rect": Rect2(42, 656, 100, 44)},
		{"page": "guild", "guild_view": "shop", "action": "guild_shop", "tooltip": "兌換", "rect": Rect2(214, 656, 144, 44)},
		{"page": "guild", "guild_view": "shop", "action": "guild_task", "tooltip": "接取任務", "rect": Rect2(336, 486, 64, 36)},
		{"page": "system", "system_view": "main", "action": "system_toggle", "tooltip": "套用設定", "rect": Rect2(56, 586, 142, 54)},
		{"page": "system", "system_view": "main", "action": "system_back_main", "tooltip": "返回", "rect": Rect2(240, 586, 142, 54)},
		{"page": "system", "system_view": "main", "action": "system_graphics", "tooltip": "畫面設定", "rect": Rect2(60, 350, 320, 48)},
		{"page": "system", "system_view": "main", "action": "system_account", "tooltip": "帳號與公告", "rect": Rect2(342, 44, 60, 86)},
		{"page": "system", "system_view": "graphics", "action": "system_back_main", "tooltip": "取消", "rect": Rect2(72, 600, 124, 46)},
		{"page": "system", "system_view": "graphics", "action": "system_toggle", "tooltip": "套用", "rect": Rect2(236, 600, 124, 46)},
		{"page": "system", "system_view": "graphics", "action": "system_back_main", "tooltip": "返回", "rect": Rect2(38, 650, 126, 42)},
		{"page": "system", "system_view": "account", "action": "system_back_main", "tooltip": "返回", "rect": Rect2(38, 650, 126, 42)},
		{"page": "system", "system_view": "account", "action": "system_copy_id", "tooltip": "複製 ID", "rect": Rect2(272, 284, 86, 38)},
		{"page": "system", "system_view": "account", "action": "system_support", "tooltip": "聯絡客服", "rect": Rect2(250, 650, 136, 42)},
		{"page": "system", "system_view": "logout", "action": "system_back_main", "tooltip": "取消", "rect": Rect2(72, 574, 124, 48)},
		{"page": "system", "system_view": "logout", "action": "system_logout", "tooltip": "回到登入", "rect": Rect2(234, 574, 142, 48)},
		{"page": "system", "system_view": "logout", "action": "system_back_main", "tooltip": "返回", "rect": Rect2(150, 640, 132, 44)},
		{"page": "inventory", "inventory_view": "main", "action": "inventory_sort", "tooltip": "整理背包", "rect": Rect2(22, 574, 82, 44)},
		{"page": "inventory", "inventory_view": "main", "action": "inventory_detail", "tooltip": "物品詳情", "rect": Rect2(110, 188, 78, 88)},
		{"page": "inventory", "inventory_view": "main", "action": "inventory_materials", "tooltip": "材料倉庫", "rect": Rect2(222, 154, 62, 42)},
		{"page": "inventory", "inventory_view": "main", "action": "inventory_equip", "tooltip": "裝備物品", "rect": Rect2(176, 574, 100, 44)},
		{"page": "inventory", "inventory_view": "main", "action": "inventory_back_role", "tooltip": "返回角色", "rect": Rect2(316, 574, 82, 44)},
		{"page": "inventory", "inventory_view": "detail", "action": "inventory_back_main", "tooltip": "卸下", "rect": Rect2(250, 592, 88, 42)},
		{"page": "inventory", "inventory_view": "detail", "action": "inventory_equip", "tooltip": "裝備", "rect": Rect2(344, 592, 66, 42)},
		{"page": "inventory", "inventory_view": "detail", "action": "inventory_back_main", "tooltip": "返回", "rect": Rect2(366, 646, 58, 40)},
		{"page": "inventory", "inventory_view": "materials", "action": "inventory_back_main", "tooltip": "返回", "rect": Rect2(330, 650, 82, 44)},
		{"page": "inventory", "inventory_view": "materials", "action": "inventory_craft", "tooltip": "合成", "rect": Rect2(150, 650, 86, 44)},
		{"page": "inventory", "inventory_view": "materials", "action": "inventory_dismantle", "tooltip": "分解", "rect": Rect2(242, 650, 86, 44)},
		{"page": "inventory", "inventory_view": "use", "action": "inventory_back_main", "tooltip": "取消", "rect": Rect2(66, 650, 98, 46)},
		{"page": "inventory", "inventory_view": "use", "action": "inventory_use_item", "tooltip": "使用", "rect": Rect2(178, 650, 110, 46)},
		{"page": "inventory", "inventory_view": "use", "action": "inventory_back_main", "tooltip": "返回", "rect": Rect2(306, 650, 98, 46)},
		{"page": "skills", "skill_view": "main", "action": "skill_upgrade_view", "tooltip": "升級技能", "rect": Rect2(316, 190, 48, 38)},
		{"page": "skills", "skill_view": "main", "action": "skill_equip_view", "tooltip": "裝配技能", "rect": Rect2(374, 190, 48, 38)},
		{"page": "skills", "skill_view": "main", "action": "skill_tree_view", "tooltip": "技能樹", "rect": Rect2(198, 152, 82, 38)},
		{"page": "skills", "skill_view": "upgrade", "action": "skill_back_main", "tooltip": "取消", "rect": Rect2(128, 548, 110, 46)},
		{"page": "skills", "skill_view": "upgrade", "action": "skill_upgrade_confirm", "tooltip": "升級", "rect": Rect2(300, 548, 110, 46)},
		{"page": "skills", "skill_view": "upgrade", "action": "skill_back_main", "tooltip": "返回", "rect": Rect2(244, 612, 90, 40)},
		{"page": "skills", "skill_view": "equip", "action": "skill_back_main", "tooltip": "卸下", "rect": Rect2(36, 646, 108, 46)},
		{"page": "skills", "skill_view": "equip", "action": "skill_equip_confirm", "tooltip": "裝配", "rect": Rect2(160, 646, 118, 46)},
		{"page": "skills", "skill_view": "equip", "action": "skill_back_main", "tooltip": "返回", "rect": Rect2(304, 646, 92, 46)},
		{"page": "skills", "skill_view": "tree", "action": "skill_reset", "tooltip": "重置", "rect": Rect2(30, 642, 112, 46)},
		{"page": "skills", "skill_view": "tree", "action": "skill_learn", "tooltip": "學習", "rect": Rect2(162, 642, 118, 46)},
		{"page": "skills", "skill_view": "tree", "action": "skill_back_main", "tooltip": "返回", "rect": Rect2(312, 642, 92, 46)},
		{"page": "shop", "shop_view": "main", "action": "shop_detail", "tooltip": "商品詳情", "rect": Rect2(282, 190, 124, 116)},
		{"page": "shop", "shop_view": "main", "action": "shop_refresh", "tooltip": "刷新商店", "rect": Rect2(28, 488, 88, 44)},
		{"page": "shop", "shop_view": "main", "action": "shop_back_home", "tooltip": "返回首頁", "rect": Rect2(24, 704, 48, 48)},
		{"page": "shop", "shop_view": "detail", "action": "shop_back_main", "tooltip": "取消", "rect": Rect2(74, 610, 110, 48)},
		{"page": "shop", "shop_view": "detail", "action": "shop_confirm", "tooltip": "購買", "rect": Rect2(202, 610, 110, 48)},
		{"page": "shop", "shop_view": "detail", "action": "shop_back_main", "tooltip": "返回", "rect": Rect2(328, 610, 84, 48)},
		{"page": "shop", "shop_view": "confirm", "action": "shop_back_main", "tooltip": "取消", "rect": Rect2(44, 650, 108, 46)},
		{"page": "shop", "shop_view": "confirm", "action": "shop_buy", "tooltip": "確認購買", "rect": Rect2(170, 650, 126, 46)},
		{"page": "shop", "shop_view": "confirm", "action": "shop_back_main", "tooltip": "返回", "rect": Rect2(314, 650, 92, 46)},
		{"page": "shop", "shop_view": "result", "action": "shop_again", "tooltip": "再買一次", "rect": Rect2(54, 642, 104, 46)},
		{"page": "shop", "shop_view": "result", "action": "shop_go_inventory", "tooltip": "前往背包", "rect": Rect2(174, 642, 112, 46)},
		{"page": "shop", "shop_view": "result", "action": "shop_back_main", "tooltip": "返回", "rect": Rect2(314, 642, 92, 46)},
		{"page": "quests", "quest_view": "main", "action": "quest_detail", "tooltip": "任務詳情", "rect": Rect2(330, 192, 70, 44)},
		{"page": "quests", "quest_view": "main", "action": "quest_claim", "tooltip": "領取獎勵", "rect": Rect2(330, 396, 70, 44)},
		{"page": "quests", "quest_view": "main", "action": "quest_event", "tooltip": "活動頁", "rect": Rect2(212, 150, 84, 38)},
		{"page": "quests", "quest_view": "detail", "action": "quest_abandon", "tooltip": "放棄", "rect": Rect2(56, 646, 102, 46)},
		{"page": "quests", "quest_view": "detail", "action": "quest_go", "tooltip": "前往", "rect": Rect2(184, 646, 112, 46)},
		{"page": "quests", "quest_view": "detail", "action": "quest_back_main", "tooltip": "返回", "rect": Rect2(316, 646, 92, 46)},
		{"page": "quests", "quest_view": "event", "action": "quest_event_join", "tooltip": "參加活動", "rect": Rect2(34, 652, 154, 46)},
		{"page": "quests", "quest_view": "event", "action": "quest_reward", "tooltip": "查看獎勵", "rect": Rect2(212, 652, 154, 46)},
		{"page": "quests", "quest_view": "reward", "action": "quest_claim_all", "tooltip": "全部領取", "rect": Rect2(44, 650, 112, 46)},
		{"page": "quests", "quest_view": "reward", "action": "quest_go_inventory", "tooltip": "前往背包", "rect": Rect2(174, 650, 112, 46)},
		{"page": "quests", "quest_view": "reward", "action": "quest_back_main", "tooltip": "返回", "rect": Rect2(312, 650, 92, 46)},
		{"page": "ranking", "ranking_view": "main", "action": "ranking_player", "tooltip": "玩家詳情", "rect": Rect2(350, 214, 58, 42)},
		{"page": "ranking", "ranking_view": "main", "action": "ranking_challenge", "tooltip": "挑戰排行", "rect": Rect2(144, 150, 92, 38)},
		{"page": "ranking", "ranking_view": "main", "action": "ranking_guild", "tooltip": "公會排行", "rect": Rect2(242, 150, 92, 38)},
		{"page": "ranking", "ranking_view": "challenge", "action": "ranking_go_challenge", "tooltip": "前往挑戰", "rect": Rect2(154, 616, 144, 46)},
		{"page": "ranking", "ranking_view": "challenge", "action": "ranking_back_main", "tooltip": "返回", "rect": Rect2(318, 616, 92, 46)},
		{"page": "ranking", "ranking_view": "guild", "action": "ranking_player", "tooltip": "查看公會", "rect": Rect2(42, 642, 124, 46)},
		{"page": "ranking", "ranking_view": "guild", "action": "ranking_apply_guild", "tooltip": "申請加入", "rect": Rect2(182, 642, 124, 46)},
		{"page": "ranking", "ranking_view": "guild", "action": "ranking_back_main", "tooltip": "返回", "rect": Rect2(326, 642, 82, 46)},
		{"page": "ranking", "ranking_view": "player", "action": "ranking_add_friend", "tooltip": "加好友", "rect": Rect2(34, 646, 116, 46)},
		{"page": "ranking", "ranking_view": "player", "action": "ranking_message", "tooltip": "私訊", "rect": Rect2(166, 646, 116, 46)},
		{"page": "ranking", "ranking_view": "player", "action": "ranking_back_main", "tooltip": "返回", "rect": Rect2(310, 646, 92, 46)},
		{"page": "mail", "mail_view": "main", "action": "mail_detail", "tooltip": "讀取郵件", "rect": Rect2(346, 286, 70, 44)},
		{"page": "mail", "mail_view": "main", "action": "mail_claim", "tooltip": "領取附件", "rect": Rect2(346, 198, 70, 44)},
		{"page": "mail", "mail_view": "main", "action": "mail_announcement", "tooltip": "公告列表", "rect": Rect2(322, 150, 84, 38)},
		{"page": "mail", "mail_view": "detail", "action": "mail_back_main", "tooltip": "刪除", "rect": Rect2(70, 602, 108, 46)},
		{"page": "mail", "mail_view": "detail", "action": "mail_claim", "tooltip": "領取附件", "rect": Rect2(202, 602, 126, 46)},
		{"page": "mail", "mail_view": "detail", "action": "mail_back_main", "tooltip": "返回", "rect": Rect2(344, 602, 72, 46)},
		{"page": "mail", "mail_view": "claim", "action": "mail_claim_all", "tooltip": "全部領取", "rect": Rect2(42, 648, 118, 46)},
		{"page": "mail", "mail_view": "claim", "action": "mail_go_inventory", "tooltip": "前往背包", "rect": Rect2(178, 648, 118, 46)},
		{"page": "mail", "mail_view": "claim", "action": "mail_back_main", "tooltip": "返回", "rect": Rect2(318, 648, 82, 46)},
		{"page": "mail", "mail_view": "announcement", "action": "mail_back_main", "tooltip": "返回", "rect": Rect2(26, 640, 92, 46)},
		{"page": "mail", "mail_view": "announcement", "action": "mail_go_quests", "tooltip": "前往活動", "rect": Rect2(334, 280, 76, 40)},
		{"page": "friends", "friends_view": "main", "action": "friends_invite_view", "tooltip": "邀請好友", "rect": Rect2(250, 210, 76, 42)},
		{"page": "friends", "friends_view": "main", "action": "friends_support_view", "tooltip": "支援角色", "rect": Rect2(36, 202, 58, 58)},
		{"page": "friends", "friends_view": "main", "action": "friends_party_view", "tooltip": "隊伍編成", "rect": Rect2(328, 704, 48, 48)},
		{"page": "friends", "friends_view": "party", "action": "friends_auto_party", "tooltip": "自動編成", "rect": Rect2(34, 642, 118, 46)},
		{"page": "friends", "friends_view": "party", "action": "friends_apply_party", "tooltip": "編成完成", "rect": Rect2(172, 642, 132, 46)},
		{"page": "friends", "friends_view": "party", "action": "friends_back_main", "tooltip": "返回", "rect": Rect2(324, 642, 82, 46)},
		{"page": "friends", "friends_view": "invite", "action": "friends_back_main", "tooltip": "取消", "rect": Rect2(44, 644, 110, 48)},
		{"page": "friends", "friends_view": "invite", "action": "friends_confirm_invite", "tooltip": "邀請", "rect": Rect2(178, 644, 112, 48)},
		{"page": "friends", "friends_view": "invite", "action": "friends_back_main", "tooltip": "返回", "rect": Rect2(318, 644, 82, 48)},
		{"page": "friends", "friends_view": "support", "action": "friends_set_support", "tooltip": "設為支援", "rect": Rect2(36, 642, 118, 46)},
		{"page": "friends", "friends_view": "support", "action": "friends_confirm_invite", "tooltip": "加好友", "rect": Rect2(174, 642, 118, 46)},
		{"page": "friends", "friends_view": "support", "action": "friends_back_main", "tooltip": "返回", "rect": Rect2(314, 642, 92, 46)},
		{"page": "world", "world_view": "main", "action": "world_region", "tooltip": "地區詳情", "rect": Rect2(155, 222, 112, 80)},
		{"page": "world", "world_view": "main", "action": "world_dispatch", "tooltip": "探索派遣", "rect": Rect2(188, 620, 126, 46)},
		{"page": "world", "world_view": "main", "action": "world_back_home", "tooltip": "返回首頁", "rect": Rect2(330, 620, 82, 46)},
		{"page": "world", "world_view": "region", "action": "world_patrol", "tooltip": "自動巡邏", "rect": Rect2(18, 630, 122, 46)},
		{"page": "world", "world_view": "region", "action": "world_stage", "tooltip": "進入地區", "rect": Rect2(158, 630, 132, 46)},
		{"page": "world", "world_view": "region", "action": "world_back_main", "tooltip": "返回", "rect": Rect2(314, 630, 86, 46)},
		{"page": "world", "world_view": "stage", "action": "world_sweep", "tooltip": "掃蕩", "rect": Rect2(22, 642, 98, 46)},
		{"page": "world", "world_view": "stage", "action": "world_challenge", "tooltip": "挑戰", "rect": Rect2(262, 642, 112, 46)},
		{"page": "world", "world_view": "stage", "action": "world_back_main", "tooltip": "返回", "rect": Rect2(382, 642, 48, 46)},
		{"page": "world", "world_view": "dispatch", "action": "world_back_main", "tooltip": "取消", "rect": Rect2(34, 642, 118, 46)},
		{"page": "world", "world_view": "dispatch", "action": "world_send_dispatch", "tooltip": "派遣", "rect": Rect2(172, 642, 118, 46)},
		{"page": "world", "world_view": "dispatch", "action": "world_back_main", "tooltip": "返回", "rect": Rect2(312, 642, 92, 46)},
		{"page": "account", "account_view": "main", "action": "account_start", "tooltip": "start", "rect": Rect2(226, 392, 158, 52)},
		{"page": "account", "account_view": "main", "action": "account_server", "tooltip": "server", "rect": Rect2(66, 618, 150, 48)},
		{"page": "account", "account_view": "main", "action": "account_settings", "tooltip": "settings", "rect": Rect2(244, 618, 150, 48)},
		{"page": "account", "account_view": "select", "action": "account_back_main", "tooltip": "back", "rect": Rect2(52, 642, 102, 48)},
		{"page": "account", "account_view": "select", "action": "account_enter", "tooltip": "enter", "rect": Rect2(164, 642, 116, 48)},
		{"page": "account", "account_view": "select", "action": "account_create", "tooltip": "create", "rect": Rect2(292, 642, 114, 48)},
		{"page": "account", "account_view": "create", "action": "account_random", "tooltip": "random", "rect": Rect2(38, 658, 112, 48)},
		{"page": "account", "account_view": "create", "action": "account_create_confirm", "tooltip": "confirm", "rect": Rect2(168, 658, 112, 48)},
		{"page": "account", "account_view": "create", "action": "account_back_select", "tooltip": "back", "rect": Rect2(306, 658, 92, 48)},
		{"page": "account", "account_view": "server", "action": "account_back_main", "tooltip": "back", "rect": Rect2(32, 650, 110, 48)},
		{"page": "account", "account_view": "server", "action": "account_server_refresh", "tooltip": "refresh", "rect": Rect2(160, 650, 112, 48)},
		{"page": "account", "account_view": "server", "action": "account_server_select", "tooltip": "select", "rect": Rect2(292, 650, 112, 48)},
		{"page": "liveops", "liveops_view": "main", "action": "liveops_join", "tooltip": "join", "rect": Rect2(18, 594, 136, 48)},
		{"page": "liveops", "liveops_view": "main", "action": "liveops_tasks", "tooltip": "tasks", "rect": Rect2(170, 594, 136, 48)},
		{"page": "liveops", "liveops_view": "main", "action": "liveops_back_quests", "tooltip": "back", "rect": Rect2(322, 594, 92, 48)},
		{"page": "liveops", "liveops_view": "tasks", "action": "liveops_claim", "tooltip": "claim", "rect": Rect2(336, 166, 74, 48)},
		{"page": "liveops", "liveops_view": "tasks", "action": "liveops_go", "tooltip": "go", "rect": Rect2(336, 248, 74, 48)},
		{"page": "liveops", "liveops_view": "tasks", "action": "liveops_back_main", "tooltip": "back", "rect": Rect2(142, 596, 148, 48)},
		{"page": "liveops", "liveops_view": "shop", "action": "liveops_exchange", "tooltip": "exchange", "rect": Rect2(116, 318, 88, 42)},
		{"page": "liveops", "liveops_view": "shop", "action": "liveops_detail", "tooltip": "detail", "rect": Rect2(72, 660, 130, 48)},
		{"page": "liveops", "liveops_view": "shop", "action": "liveops_back_main", "tooltip": "back", "rect": Rect2(230, 660, 130, 48)},
		{"page": "liveops", "liveops_view": "ranking", "action": "liveops_ranking_reward", "tooltip": "reward", "rect": Rect2(42, 650, 124, 48)},
		{"page": "liveops", "liveops_view": "ranking", "action": "liveops_go", "tooltip": "go", "rect": Rect2(184, 650, 124, 48)},
		{"page": "liveops", "liveops_view": "ranking", "action": "liveops_back_main", "tooltip": "back", "rect": Rect2(326, 650, 82, 48)},
		{"page": "feedback", "action": "feedback_back_system", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "feedback", "action": "feedback_submit", "tooltip": "submit", "rect": Rect2(116, 642, 204, 54)},
		{"page": "achievements", "action": "achievement_back_role", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "achievements", "action": "achievement_title", "tooltip": "title", "rect": Rect2(136, 184, 160, 44)},
		{"page": "achievements", "action": "achievement_claim", "tooltip": "claim", "rect": Rect2(356, 356, 58, 42)},
		{"page": "codex", "action": "codex_back_world", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "codex", "action": "codex_region", "tooltip": "region", "rect": Rect2(38, 206, 86, 42)},
		{"page": "codex", "action": "codex_card", "tooltip": "card", "rect": Rect2(34, 316, 74, 104)},
		{"page": "tutorial", "action": "tutorial_back_home", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "tutorial", "action": "tutorial_next", "tooltip": "next", "rect": Rect2(120, 654, 194, 54)},
		{"page": "chat", "action": "chat_back_friends", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "chat", "action": "chat_send", "tooltip": "send", "rect": Rect2(338, 546, 74, 46)},
		{"page": "chat", "action": "chat_invite_party", "tooltip": "invite", "rect": Rect2(178, 612, 104, 42)},
		{"page": "chat", "action": "chat_report", "tooltip": "report", "rect": Rect2(306, 612, 52, 42)},
		{"page": "party", "action": "party_back_friends", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "party", "action": "party_join", "tooltip": "join", "rect": Rect2(322, 216, 88, 52)},
		{"page": "party", "action": "party_create", "tooltip": "create", "rect": Rect2(84, 644, 130, 46)},
		{"page": "party", "action": "party_applications", "tooltip": "applications", "rect": Rect2(236, 644, 132, 46)},
		{"page": "pets", "action": "pet_back_role", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "pets", "action": "pet_feed", "tooltip": "feed", "rect": Rect2(36, 444, 88, 44)},
		{"page": "pets", "action": "pet_train", "tooltip": "train", "rect": Rect2(144, 444, 88, 44)},
		{"page": "pets", "action": "pet_codex", "tooltip": "codex", "rect": Rect2(348, 650, 64, 42)},
		{"page": "enhance", "action": "enhance_back_inventory", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "enhance", "action": "enhance_material", "tooltip": "material", "rect": Rect2(34, 412, 72, 86)},
		{"page": "enhance", "action": "enhance_confirm", "tooltip": "enhance", "rect": Rect2(124, 642, 184, 50)},
		{"page": "arena", "action": "arena_back_challenge", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "arena", "action": "arena_refresh", "tooltip": "refresh", "rect": Rect2(306, 282, 90, 42)},
		{"page": "arena", "action": "arena_challenge", "tooltip": "challenge", "rect": Rect2(328, 342, 72, 46)},
		{"page": "arena", "action": "arena_defense", "tooltip": "defense", "rect": Rect2(314, 636, 88, 46)},
		{"page": "boss_preview", "action": "boss_preview_back_challenge", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "boss_preview", "action": "boss_preview_team", "tooltip": "team", "rect": Rect2(314, 498, 92, 44)},
		{"page": "boss_preview", "action": "boss_preview_go", "tooltip": "go", "rect": Rect2(86, 642, 130, 46)},
		{"page": "boss_preview", "action": "boss_preview_remind", "tooltip": "remind", "rect": Rect2(236, 642, 130, 46)},
		{"page": "dispatch_result", "action": "dispatch_result_back_world", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "dispatch_result", "action": "dispatch_result_claim", "tooltip": "claim", "rect": Rect2(116, 642, 200, 50)},
		{"page": "battle_stats", "action": "battle_stats_back_challenge", "tooltip": "back", "rect": Rect2(318, 642, 84, 46)},
		{"page": "battle_stats", "action": "battle_stats_replay", "tooltip": "replay", "rect": Rect2(44, 642, 118, 46)},
		{"page": "battle_stats", "action": "battle_stats_share", "tooltip": "share", "rect": Rect2(178, 642, 118, 46)},
		{"page": "title_detail", "action": "title_detail_back_achievements", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "title_detail", "action": "title_detail_equip", "tooltip": "equip", "rect": Rect2(124, 642, 184, 50)},
		{"page": "title_detail", "action": "title_detail_source", "tooltip": "source", "rect": Rect2(316, 282, 84, 42)},
		{"page": "codex_detail", "action": "codex_detail_back_codex", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "codex_detail", "action": "codex_detail_route", "tooltip": "route", "rect": Rect2(124, 642, 184, 50)},
		{"page": "codex_detail", "action": "codex_detail_track", "tooltip": "track", "rect": Rect2(318, 642, 84, 46)},
		{"page": "appearance_collection", "action": "appearance_collection_back_role", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "appearance_collection", "action": "appearance_collection_preview", "tooltip": "preview", "rect": Rect2(44, 642, 118, 46)},
		{"page": "appearance_collection", "action": "appearance_collection_equip", "tooltip": "equip", "rect": Rect2(178, 642, 118, 46)},
		{"page": "appearance_collection", "action": "appearance_collection_dye", "tooltip": "dye", "rect": Rect2(318, 642, 84, 46)},
		{"page": "badge_collection", "action": "badge_collection_back_achievements", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "badge_collection", "action": "badge_collection_equip", "tooltip": "equip", "rect": Rect2(124, 642, 184, 50)},
		{"page": "badge_collection", "action": "badge_collection_set", "tooltip": "set", "rect": Rect2(318, 282, 84, 42)},
		{"page": "tutorial_battle", "action": "tutorial_battle_back_tutorial", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "tutorial_battle", "action": "tutorial_battle_skill", "tooltip": "skill", "rect": Rect2(202, 560, 78, 78)},
		{"page": "tutorial_battle", "action": "tutorial_battle_next", "tooltip": "next", "rect": Rect2(116, 642, 200, 50)},
		{"page": "tutorial_inventory", "action": "tutorial_inventory_back_tutorial", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "tutorial_inventory", "action": "tutorial_inventory_item", "tooltip": "item", "rect": Rect2(134, 298, 70, 70)},
		{"page": "tutorial_inventory", "action": "tutorial_inventory_next", "tooltip": "next", "rect": Rect2(116, 642, 200, 50)},
		{"page": "tutorial_skills", "action": "tutorial_skills_back_tutorial", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "tutorial_skills", "action": "tutorial_skills_upgrade", "tooltip": "upgrade", "rect": Rect2(256, 608, 132, 46)},
		{"page": "tutorial_skills", "action": "tutorial_skills_next", "tooltip": "next", "rect": Rect2(116, 674, 200, 50)},
		{"page": "tutorial_guild", "action": "tutorial_guild_back_tutorial", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "tutorial_guild", "action": "tutorial_guild_entry", "tooltip": "guild", "rect": Rect2(144, 342, 144, 104)},
		{"page": "tutorial_guild", "action": "tutorial_guild_finish", "tooltip": "finish", "rect": Rect2(116, 724, 200, 42)},
		{"page": "daily_checkin", "action": "daily_checkin_back_liveops", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "daily_checkin", "action": "daily_checkin_calendar", "tooltip": "calendar", "rect": Rect2(38, 286, 356, 238)},
		{"page": "daily_checkin", "action": "daily_checkin_claim", "tooltip": "claim", "rect": Rect2(116, 642, 200, 50)},
		{"page": "pass_progress", "action": "pass_progress_back_liveops", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "pass_progress", "action": "pass_progress_tasks", "tooltip": "tasks", "rect": Rect2(116, 642, 200, 50)},
		{"page": "pass_progress", "action": "pass_progress_claim", "tooltip": "claim", "rect": Rect2(330, 418, 66, 112)},
		{"page": "timed_challenge", "action": "timed_challenge_back_liveops", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "timed_challenge", "action": "timed_challenge_reward", "tooltip": "reward", "rect": Rect2(40, 548, 352, 84)},
		{"page": "timed_challenge", "action": "timed_challenge_start", "tooltip": "start", "rect": Rect2(116, 642, 200, 50)},
		{"page": "event_exchange_confirm", "action": "event_exchange_confirm_back_liveops", "tooltip": "back", "rect": Rect2(18, 30, 56, 56)},
		{"page": "event_exchange_confirm", "action": "event_exchange_confirm_cancel", "tooltip": "cancel", "rect": Rect2(92, 560, 116, 48)},
		{"page": "event_exchange_confirm", "action": "event_exchange_confirm_confirm", "tooltip": "confirm", "rect": Rect2(226, 560, 132, 48)},
	]
	for spec in specs:
		var rect: Rect2 = spec["rect"]
		var button := Button.new()
		button.position = rect.position
		button.size = rect.size
		button.text = ""
		button.tooltip_text = String(spec["tooltip"])
		button.set_meta("page", String(spec["page"]))
		button.set_meta("view", String(spec.get("view", "")))
		button.set_meta("role_view", String(spec.get("role_view", "")))
		button.set_meta("market_view", String(spec.get("market_view", "")))
		button.set_meta("challenge_view", String(spec.get("challenge_view", "")))
		button.set_meta("guild_view", String(spec.get("guild_view", "")))
		button.set_meta("system_view", String(spec.get("system_view", "")))
		button.set_meta("inventory_view", String(spec.get("inventory_view", "")))
		button.set_meta("skill_view", String(spec.get("skill_view", "")))
		button.set_meta("shop_view", String(spec.get("shop_view", "")))
		button.set_meta("quest_view", String(spec.get("quest_view", "")))
		button.set_meta("ranking_view", String(spec.get("ranking_view", "")))
		button.set_meta("mail_view", String(spec.get("mail_view", "")))
		button.set_meta("friends_view", String(spec.get("friends_view", "")))
		button.set_meta("world_view", String(spec.get("world_view", "")))
		button.set_meta("account_view", String(spec.get("account_view", "")))
		button.set_meta("liveops_view", String(spec.get("liveops_view", "")))
		button.set_meta("action", String(spec["action"]))
		button.pressed.connect(_on_page_hotspot_pressed.bind(String(spec["page"]), String(spec["action"])))
		_apply_transparent_button_style(button)
		page_hotspot_buttons.append(button)
		root.add_child(button)

func _build_api_bridge() -> void:
	player_api_client = PlayerApiClientScript.new()
	player_api_client.api_base_url = api_base_url
	player_api_client.player_state_received.connect(_apply_player_state)
	player_api_client.player_action_received.connect(_on_player_action_received)
	player_api_client.simulated_payment_received.connect(_on_simulated_payment_received)
	player_api_client.request_failed.connect(_on_player_api_request_failed)
	add_child(player_api_client)

func _request_player_state() -> void:
	if player_api_client == null:
		return
	player_api_client.request_player_state()

func _post_simulated_payment() -> void:
	if player_api_client == null:
		return
	player_api_client.post_simulated_payment(int(game_state["pack_price"]), int(game_state["step"]))

func _post_player_action(action_name: String) -> void:
	if player_api_client == null:
		return
	player_api_client.post_player_action(action_name)

func _apply_start_page_from_args() -> void:
	for arg in OS.get_cmdline_user_args():
		if page_flow_state.apply_start_arg(arg, ARG_PAGE_NAMES, PACK_COMPOSITE_PATHS, ROLE_COMPOSITE_PATHS, MARKET_COMPOSITE_PATHS, CHALLENGE_COMPOSITE_PATHS, GUILD_COMPOSITE_PATHS, SYSTEM_COMPOSITE_PATHS, INVENTORY_COMPOSITE_PATHS, SKILL_COMPOSITE_PATHS, SHOP_COMPOSITE_PATHS, QUEST_COMPOSITE_PATHS, RANKING_COMPOSITE_PATHS, MAIL_COMPOSITE_PATHS, FRIENDS_COMPOSITE_PATHS, WORLD_COMPOSITE_PATHS, ACCOUNT_COMPOSITE_PATHS, LIVEOPS_COMPOSITE_PATHS):
			continue
		if arg.begins_with("--api-base="):
			var requested_api := arg.trim_prefix("--api-base=").strip_edges()
			if requested_api.begins_with("http://") or requested_api.begins_with("https://"):
				api_base_url = requested_api.rstrip("/")

func _refresh_all() -> void:
	page_flow_state.write_to_game_state(game_state)
	var active_page: String = String(page_flow_state.active_page)
	var composite_page := _has_page_composite(active_page)
	var target_home: bool = active_page == "home"
	hud_presenter.apply_hud(game_state, active_page, composite_page, target_home, _hud_controls())
	for button in page_hotspot_buttons:
		var button_page := String(button.get_meta("page", ""))
		var button_view := String(button.get_meta("view", ""))
		var button_role_view := String(button.get_meta("role_view", ""))
		var button_market_view := String(button.get_meta("market_view", ""))
		var button_challenge_view := String(button.get_meta("challenge_view", ""))
		var button_guild_view := String(button.get_meta("guild_view", ""))
		var button_system_view := String(button.get_meta("system_view", ""))
		var button_inventory_view := String(button.get_meta("inventory_view", ""))
		var button_skill_view := String(button.get_meta("skill_view", ""))
		var button_shop_view := String(button.get_meta("shop_view", ""))
		var button_quest_view := String(button.get_meta("quest_view", ""))
		var button_ranking_view := String(button.get_meta("ranking_view", ""))
		var button_mail_view := String(button.get_meta("mail_view", ""))
		var button_friends_view := String(button.get_meta("friends_view", ""))
		var button_world_view := String(button.get_meta("world_view", ""))
		var button_account_view := String(button.get_meta("account_view", ""))
		var button_liveops_view := String(button.get_meta("liveops_view", ""))
		var view_matches := button_view == "" or button_view == _current_pack_view()
		var role_view_matches := button_role_view == "" or button_role_view == _current_role_view()
		var market_view_matches := button_market_view == "" or button_market_view == _current_market_view()
		var challenge_view_matches := button_challenge_view == "" or button_challenge_view == _current_challenge_view()
		var guild_view_matches := button_guild_view == "" or button_guild_view == _current_guild_view()
		var system_view_matches := button_system_view == "" or button_system_view == _current_system_view()
		var inventory_view_matches := button_inventory_view == "" or button_inventory_view == _current_inventory_view()
		var skill_view_matches := button_skill_view == "" or button_skill_view == _current_skill_view()
		var shop_view_matches := button_shop_view == "" or button_shop_view == _current_shop_view()
		var quest_view_matches := button_quest_view == "" or button_quest_view == _current_quest_view()
		var ranking_view_matches := button_ranking_view == "" or button_ranking_view == _current_ranking_view()
		var mail_view_matches := button_mail_view == "" or button_mail_view == _current_mail_view()
		var friends_view_matches := button_friends_view == "" or button_friends_view == _current_friends_view()
		var world_view_matches := button_world_view == "" or button_world_view == _current_world_view()
		var account_view_matches := button_account_view == "" or button_account_view == _current_account_view()
		var liveops_view_matches := button_liveops_view == "" or button_liveops_view == _current_liveops_view()
		button.visible = button_page == active_page and view_matches and role_view_matches and market_view_matches and challenge_view_matches and guild_view_matches and system_view_matches and inventory_view_matches and skill_view_matches and shop_view_matches and quest_view_matches and ranking_view_matches and mail_view_matches and friends_view_matches and world_view_matches and account_view_matches and liveops_view_matches
	world.set_state(game_state)
	_refresh_quest()
	_refresh_page()
	for i in range(nav_buttons.size()):
		nav_buttons[i].disabled = false
		_apply_nav_button_style(nav_buttons[i], PAGE_NAMES[i] == active_page)

func _has_page_composite(page_name: String) -> bool:
	return PAGE_COMPOSITE_PATHS.has(page_name) or page_name == "inventory" or page_name == "skills" or page_name == "shop" or page_name == "quests" or page_name == "ranking" or page_name == "mail" or page_name == "friends" or page_name == "world" or page_name == "account" or page_name == "liveops"

func _current_pack_view() -> String:
	return String(page_flow_state.current_pack_view())

func _current_role_view() -> String:
	return String(page_flow_state.current_role_view())

func _current_market_view() -> String:
	return String(page_flow_state.current_market_view())

func _current_challenge_view() -> String:
	return String(page_flow_state.current_challenge_view())

func _current_guild_view() -> String:
	return String(page_flow_state.current_guild_view())

func _current_system_view() -> String:
	return String(page_flow_state.current_system_view())

func _current_inventory_view() -> String:
	return String(page_flow_state.current_inventory_view())

func _current_skill_view() -> String:
	return String(page_flow_state.current_skill_view())

func _current_shop_view() -> String:
	return String(page_flow_state.current_shop_view())

func _current_quest_view() -> String:
	return String(page_flow_state.current_quest_view())

func _current_ranking_view() -> String:
	return String(page_flow_state.current_ranking_view())

func _current_mail_view() -> String:
	return String(page_flow_state.current_mail_view())

func _current_friends_view() -> String:
	return String(page_flow_state.current_friends_view())

func _current_world_view() -> String:
	return String(page_flow_state.current_world_view())

func _current_account_view() -> String:
	return String(page_flow_state.current_account_view())

func _current_liveops_view() -> String:
	return String(page_flow_state.current_liveops_view())

func _hud_controls() -> Dictionary:
	return {
		"portrait_doll": portrait_doll,
		"top_story": top_story,
		"level_label": level_label,
		"exp_bar": exp_bar,
		"power_label": power_label,
		"resource_labels": resource_labels,
		"top_hud_panel": top_hud_panel,
		"nav_bg": nav_bg,
		"home_action_hotspot": home_action_hotspot,
		"home_stage_spacer": home_stage_spacer,
		"quest_panel": quest_panel,
		"content_panel": content_panel,
	}

func _quest_controls() -> Dictionary:
	return {
		"quest_title": quest_title,
		"quest_body": quest_body,
		"main_action": main_action,
	}

func _page_controls() -> Dictionary:
	return {
		"content_title": content_title,
		"content_body": content_body,
	}

func _page_renderers() -> Dictionary:
	return {
		"packs": Callable(self, "_render_pack_page"),
		"market": Callable(self, "_render_market_page"),
		"challenge": Callable(self, "_render_challenge_page"),
		"role": Callable(self, "_render_role_page"),
		"inventory": Callable(self, "_render_inventory_page"),
		"skills": Callable(self, "_render_skill_page"),
		"guild": Callable(self, "_render_guild_page"),
		"system": Callable(self, "_render_system_page"),
	}

func _refresh_quest() -> void:
	quest_status_presenter.apply_quest(game_state, page_flow_state.active_page, event_feed, _quest_controls())

func _refresh_page() -> void:
	feature_page_renderer.refresh_page(page_flow_state.active_page, _page_controls(), _page_renderers())

func _render_pack_page() -> void:
	var live_pack_cards: Array = pack_page_state_binder.live_pack_cards(game_state, pack_cards)
	_add_page_action("開啟焦點禮包", "pack", "模擬付款狀態：%s。焦點禮包：%s。" % [String(game_state["simulated_payment"]), String(game_state["pack_focus"])])
	_add_visual_grid(_pack_visual_cards(live_pack_cards))
	var flow_box := _add_section("狀態流")
	_add_badge_row(flow_box, ["建立", "持有", "上架", "成交", "冷卻", "開啟", "消耗"])

	var list_box := _add_log_section("禮包紀錄")
	for pack in live_pack_cards:
		_add_row(list_box, "%s / %s" % [pack["id"], _pack_status_label(String(pack["status"]))], "價格 %d GC / 交易 %d 次 / %s" % [int(pack["price"]), int(pack["trades"]), String(pack["result"])])

	var result_box := _add_log_section("開包結果")
	_add_row(result_box, "最新內容", String(game_state["open_result"]))
	_add_row(result_box, "容器狀態", "開啟後進入已消耗，不會重複開啟")

func _pack_visual_cards(live_pack_cards: Array) -> Array[Dictionary]:
	var cards: Array[Dictionary] = []
	for pack in live_pack_cards:
		var status := String(pack["status"])
		var art := "pack"
		if status == "LISTED":
			art = "listing"
		elif status == "BURNED" or status == "OPENED":
			art = "open"
		elif status == "COOLDOWN":
			art = "cooldown"
		cards.append({
			"art": art,
			"title": String(pack["id"]),
			"body": "%s / %d GC / 交易 %d 次" % [_pack_status_label(status), int(pack["price"]), int(pack["trades"])],
		})
		if cards.size() >= 3:
			break
	cards.append({"art": "cooldown", "title": "模擬付款", "body": String(game_state["simulated_payment"])})
	return cards

func _render_market_page() -> void:
	var live_market_rows: Array = market_page_state_binder.live_market_rows(game_state, market_rows)
	var live_market_cards: Array = market_page_state_binder.market_visual_cards(game_state, market_rows)
	_add_page_action("上架焦點禮包", "market", "交易場燈號已亮起，焦點禮包可進入買家列表。")
	_add_visual_grid(live_market_cards)
	var live_list_box := _add_log_section("交易紀錄")
	for row in live_market_rows:
		_add_row(live_list_box, "%s / %s" % [row["pack"], row["state"]], "%s / %s" % [row["price"], row["seller"]])

func _render_challenge_page() -> void:
	_add_page_action("使用挑戰票", "ticket", "挑戰票已備妥，可派出隊伍進入 Boss 房間。")
	var live_challenge_rows: Array[Array] = challenge_guild_system_state_binder.live_challenge_rows(game_state, boss_rows)
	_add_visual_grid(challenge_guild_system_state_binder.challenge_visual_cards(game_state, boss_rows))
	var live_challenge_box: VBoxContainer = _add_log_section("挑戰紀錄")
	for row: Array in live_challenge_rows:
		_add_row(live_challenge_box, String(row[0]), "%s / %s" % [String(row[1]), String(row[2])])
	if int(game_state["tickets"]) > 0:
		_add_text(live_challenge_box, "挑戰票可用，隊伍可以進入 Boss 房間。")

func _render_role_page() -> void:
	var live_role_state: Dictionary = role_equipment_state_binder.live_role_state(game_state, paper_dolls)
	_add_page_action("切換裝備", "skill", "紙娃娃會依照武器、衣服、頭飾與披肩顯示差異。")
	_add_paper_doll_showcase(live_role_state)
	_add_visual_grid([
		{"art": "warrior", "title": "戰士", "body": "耐久近戰"},
		{"art": "ranger", "title": "遊俠", "body": "遠程輸出"},
		{"art": "mage", "title": "法師", "body": "爆發技能"},
		{"art": "cleric", "title": "牧師", "body": "支援恢復"},
	])
	var skill_box := _add_log_section("角色紀錄")
	for row in class_rows:
		_add_row(skill_box, row[0], "%s / %s" % [row[1], row[2]])

func _render_inventory_page() -> void:
	var live_inventory_items: Array[Dictionary] = inventory_skill_state_binder.live_inventory_items(inventory_items)
	_add_page_action("整理裝備", "armor", "背包只呈現玩家可操作的物品、裝備與材料，不再混入首頁角色場景。")
	_add_visual_grid(inventory_skill_state_binder.inventory_visual_cards(live_inventory_items))
	var live_bag_box := _add_log_section("背包紀錄")
	for item in live_inventory_items:
		_add_row(live_bag_box, String(item["name"]), "%s / %s / x%d" % [String(item["type"]), String(item["rarity"]), int(item["qty"])])

func _render_skill_page() -> void:
	var live_skill_rows: Array[Array] = inventory_skill_state_binder.live_skill_rows(skill_rows)
	_add_page_action("切換技能", "skill", "技能頁集中顯示戰鬥能力、升級成本與冷卻狀態。")
	_add_visual_grid(inventory_skill_state_binder.skill_visual_cards(live_skill_rows))
	var live_skill_box := _add_log_section("技能紀錄")
	for row in live_skill_rows:
		_add_row(live_skill_box, "%s %s" % [row[0], row[1]], row[2])

func _render_guild_page() -> void:
	_add_page_action("公會捐獻", "guild", "公會頁集中顯示成員、公會 Boss、公會任務與商店。")
	_add_visual_grid(challenge_guild_system_state_binder.guild_visual_cards(game_state))
	var live_guild_box: VBoxContainer = _add_log_section("公會紀錄")
	for row: Array in challenge_guild_system_state_binder.live_guild_rows(game_state):
		_add_row(live_guild_box, String(row[0]), String(row[1]))

func _render_system_page() -> void:
	_add_page_action("套用設定", "gear", "系統頁集中顯示音效、畫面、通知、語言、客服與帳號設定。")
	_add_visual_grid(challenge_guild_system_state_binder.system_visual_cards(game_state))
	var live_settings_box: VBoxContainer = _add_log_section("設定紀錄")
	for row: Array in challenge_guild_system_state_binder.live_system_rows(game_state):
		_add_row(live_settings_box, String(row[0]), String(row[1]))

func _add_paper_doll_showcase(live_role_state: Dictionary) -> void:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _section_style())
	content_body.add_child(panel)

	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 8)
	panel.add_child(row)

	var live_paper_dolls: Array = Array(live_role_state.get("paper_dolls", []))
	for doll in live_paper_dolls:
		var box := VBoxContainer.new()
		box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row.add_child(box)

		var preview := PaperDollView.new()
		preview.gender = String(doll["gender"])
		preview.equipped = Dictionary(doll["equipped"])
		preview.base_texture_mode = true
		preview.custom_minimum_size = Vector2(0, 138)
		box.add_child(preview)

		var label := Label.new()
		label.text = "%s / %s" % [String(doll["name"]), String(doll["job"])]
		label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		label.add_theme_font_size_override("font_size", 11)
		label.add_theme_color_override("font_color", Color("#eaf4ff"))
		box.add_child(label)

func _add_page_action(title: String, art: String, description: String) -> void:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _action_panel_style())
	content_body.add_child(panel)

	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 8)
	panel.add_child(row)

	var action_icon := ArtIcon.new()
	action_icon.icon_type = art
	action_icon.custom_minimum_size = Vector2(48, 48)
	row.add_child(action_icon)

	var text_box := VBoxContainer.new()
	text_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(text_box)

	var title_label := Label.new()
	title_label.text = title
	title_label.add_theme_font_size_override("font_size", 14)
	title_label.add_theme_color_override("font_color", Color("#ffe38c"))
	text_box.add_child(title_label)

	var body_label := Label.new()
	body_label.text = description
	body_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	body_label.add_theme_font_size_override("font_size", 11)
	body_label.add_theme_color_override("font_color", Color("#ece6f3"))
	text_box.add_child(body_label)

	var button := Button.new()
	button.text = "執行"
	button.custom_minimum_size = Vector2(58, 38)
	button.pressed.connect(_on_main_action_pressed)
	_apply_button_style(button, true)
	row.add_child(button)

func _add_visual_grid(cards: Array[Dictionary]) -> void:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _section_style())
	content_body.add_child(panel)

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 7)
	panel.add_child(box)

	var grid := GridContainer.new()
	grid.columns = 2
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	grid.add_theme_constant_override("h_separation", 8)
	grid.add_theme_constant_override("v_separation", 8)
	box.add_child(grid)

	for card in cards:
		var card_panel := PanelContainer.new()
		card_panel.custom_minimum_size = Vector2(178, 76)
		card_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		card_panel.add_theme_stylebox_override("panel", _stat_card_style())
		grid.add_child(card_panel)

		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 8)
		card_panel.add_child(row)

		var icon := ArtIcon.new()
		icon.icon_type = String(card["art"])
		icon.custom_minimum_size = Vector2(48, 48)
		row.add_child(icon)

		var text_box := VBoxContainer.new()
		text_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		text_box.alignment = BoxContainer.ALIGNMENT_CENTER
		row.add_child(text_box)

		var title_label := Label.new()
		title_label.text = String(card["title"])
		title_label.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		title_label.add_theme_font_size_override("font_size", 12)
		title_label.add_theme_color_override("font_color", Color("#fff4c8"))
		text_box.add_child(title_label)

		var body_label := Label.new()
		body_label.text = String(card["body"])
		body_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		body_label.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		body_label.add_theme_font_size_override("font_size", 10)
		body_label.add_theme_color_override("font_color", Color("#bdd4e8"))
		text_box.add_child(body_label)

func _add_section(title: String) -> VBoxContainer:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _section_style())
	content_body.add_child(panel)

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 3)
	panel.add_child(box)

	var heading := Label.new()
	heading.text = title
	heading.add_theme_font_size_override("font_size", 13)
	heading.add_theme_color_override("font_color", Color("#ffe38c"))
	box.add_child(heading)
	return box

func _add_log_section(title: String) -> VBoxContainer:
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.add_theme_stylebox_override("panel", _log_style())
	content_body.add_child(panel)

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 3)
	panel.add_child(box)

	var heading := Label.new()
	heading.text = title
	heading.add_theme_font_size_override("font_size", 13)
	heading.add_theme_color_override("font_color", Color("#8cf2c4"))
	box.add_child(heading)
	return box

func _add_row(parent: VBoxContainer, label_text: String, value_text: String) -> void:
	var line := Label.new()
	line.text = "• %s　%s" % [label_text, value_text]
	line.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	line.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	line.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	line.add_theme_font_size_override("font_size", 11)
	line.add_theme_color_override("font_color", Color("#e5edf8"))
	parent.add_child(line)

func _add_text(parent: VBoxContainer, text: String) -> void:
	var label := Label.new()
	label.text = text
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", 11)
	label.add_theme_color_override("font_color", Color("#d9e2ef"))
	parent.add_child(label)

func _add_badge_row(parent: VBoxContainer, values: Array[String]) -> void:
	var flow := Label.new()
	var flow_text := ""
	for i in range(values.size()):
		if i > 0:
			flow_text += "  →  "
		flow_text += values[i]
	flow.text = flow_text
	flow.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	flow.add_theme_font_size_override("font_size", 11)
	flow.add_theme_color_override("font_color", Color("#d8e5f5"))
	parent.add_child(flow)

func _pack_status_label(status: String) -> String:
	match status:
		"ISSUED":
			return "系統建立"
		"OWNED":
			return "玩家持有"
		"LISTED":
			return "交易場上架中"
		"TRADE_LOCKED":
			return "交易鎖定中"
		"TRADED":
			return "交易完成"
		"COOLDOWN":
			return "冷卻等待"
		"OPENED":
			return "已開啟"
		"BURNED":
			return "已消耗"
		"FROZEN":
			return "暫時鎖定"
		_:
			return status

func _on_tab_pressed(page_name: String) -> void:
	page_flow_state.select_page(page_name)
	_refresh_all()

func _on_main_action_pressed() -> void:
	var action_name := "patrol"
	var active_page: String = String(page_flow_state.active_page)
	if active_page == "home":
		action_name = "patrol"
	elif active_page == "packs":
		action_name = "open_pack"
	elif active_page == "market":
		action_name = "list_pack"
	elif active_page == "challenge":
		action_name = "challenge"
	elif active_page == "role" or active_page == "guild" or active_page == "system":
		action_name = "toggle_equipment"
	else:
		action_name = "toggle_equipment"
	_post_player_action(action_name)

func _on_page_hotspot_pressed(page_name: String, hotspot_action: String) -> void:
	if page_flow_state.active_page != page_name:
		return
	match hotspot_action:
		"role_train":
			_set_role_view("training")
		"role_equip":
			_set_role_view("equipment")
		"role_job":
			_set_role_view("job")
		"role_back_main":
			_set_role_view("main")
		"role_apply_equipment":
			_toggle_equipment_set()
			_post_player_action("toggle_equipment")
		"role_appearance":
			_set_role_view("appearance")
		"role_train_once":
			_train_character()
		"role_auto_train":
			_train_character()
			_train_character()
		"role_preview_skill":
			_preview_job_change()
			page_flow_state.select_page("skills")
		"role_confirm_job":
			_confirm_job_change()
		"role_apply_appearance":
			_apply_role_appearance()
		"role_reset_appearance":
			_reset_role_appearance()
		"pack_open_starter", "pack_open_adventurer", "pack_open_hero":
			_set_pack_view("confirm")
		"pack_shop":
			_set_pack_view("shop")
		"pack_shop_buy":
			_simulate_pack_purchase()
			_set_pack_view("confirm")
		"pack_confirm_cancel", "pack_back_main":
			_set_pack_view("main")
		"pack_confirm_open":
			_open_focus_pack()
			_post_player_action("open_pack")
			_set_pack_view("result")
		"pack_records":
			_set_pack_view("records")
			_push_event("禮包紀錄已更新，最近開啟與交易狀態已同步。")
		"pack_odds":
			_set_pack_view("odds")
		"pack_result_again":
			_set_pack_view("confirm")
		"pack_result_bag":
			page_flow_state.select_page("inventory")
		"pack_record_result":
			_set_pack_view("result")
		"pack_legacy_records":
			_push_event("禮包紀錄已更新，最近開啟與交易狀態已同步。")
		"market_buy":
			_set_market_view("confirm")
		"market_confirm_buy":
			_buy_market_item()
			_set_market_view("records")
		"market_list":
			_set_market_view("list")
		"market_confirm_list":
			_list_focus_pack()
			_post_player_action("list_pack")
			_set_market_view("records")
		"market_cancel", "market_list_cancel", "market_back_main":
			_set_market_view("main")
		"market_records":
			_set_market_view("records")
		"market_rules":
			_set_market_view("rules")
		"market_refresh":
			_refresh_market_board()
		"challenge_boss", "challenge_daily", "challenge_guild", "challenge_event":
			_set_challenge_view("confirm")
		"challenge_start":
			if _run_boss_challenge():
				_post_player_action("challenge")
				_set_challenge_view("battle")
		"challenge_finish":
			_complete_challenge_result()
			_set_challenge_view("result")
		"challenge_again":
			_set_challenge_view("confirm")
		"challenge_records":
			_set_challenge_view("records")
		"challenge_result":
			_set_challenge_view("result")
		"challenge_cancel", "challenge_back_main":
			_set_challenge_view("main")
		"challenge_retreat":
			_push_event("隊伍已撤退，挑戰未結算獎勵。")
			_set_challenge_view("main")
		"challenge_speed":
			_push_event("挑戰加速已套用。")
		"challenge_bag":
			page_flow_state.select_page("inventory")
		"challenge_ticket_shop":
			_push_event("票券商店已開啟，內測版先使用持有挑戰票。")
		"guild_donate_view":
			_set_guild_view("donate")
		"guild_boss_view":
			_set_guild_view("boss")
		"guild_shop_view":
			_set_guild_view("shop")
		"guild_back_main":
			_set_guild_view("main")
		"guild_donate":
			_donate_to_guild()
			_set_guild_view("main")
		"guild_boss":
			_run_guild_boss()
			_set_guild_view("main")
		"guild_shop":
			_push_event("公會商店已開啟，可用徽章兌換強化材料。")
		"guild_task":
			_push_event("公會任務已接取，完成自動戰鬥可累積貢獻。")
		"system_audio":
			_push_event("音效設定已套用。")
		"system_graphics":
			_set_system_view("graphics")
		"system_account":
			_set_system_view("account")
		"system_back_main":
			_set_system_view("main")
		"system_toggle":
			challenge_guild_system_state_binder.sync_system_toggle(game_state)
			_push_event("自動拾取與技能特效設定已切換。")
		"system_copy_id":
			_push_event("玩家 ID 已複製到內測剪貼紀錄。")
		"system_support":
			_push_event("客服信箱已開啟，內測版先記錄問題回報。")
		"system_logout_view":
			_set_system_view("logout")
		"system_logout":
			_push_event("帳號仍維持登入；內測版不執行登出。")
		"inventory_detail":
			_set_inventory_view("detail")
		"inventory_materials":
			_set_inventory_view("materials")
		"inventory_back_main":
			_set_inventory_view("main")
		"inventory_back_role":
			page_flow_state.select_page("role")
		"inventory_sort":
			_push_event("背包已整理，裝備、道具、材料依稀有度排序。")
		"inventory_equip":
			_toggle_equipment_set()
			_push_event("已從背包套用目前選取裝備。")
		"inventory_craft":
			_push_event("材料合成完成，強化材料已更新。")
		"inventory_dismantle":
			_push_event("已分解多餘材料，獲得強化碎片。")
		"inventory_use_item":
			game_state["exp"] = mini(100, int(game_state["exp"]) + 2)
			_push_event("已使用治療藥水，角色狀態恢復。")
			_set_inventory_view("main")
		"skill_upgrade_view":
			_set_skill_view("upgrade")
		"skill_equip_view":
			_set_skill_view("equip")
		"skill_tree_view":
			_set_skill_view("tree")
		"skill_back_main":
			_set_skill_view("main")
		"skill_upgrade_confirm":
			_train_character()
			_set_skill_view("main")
		"skill_equip_confirm":
			_push_event("技能裝配已更新，自動戰鬥技能列同步。")
			_set_skill_view("main")
		"skill_learn":
			game_state["party_power"] = int(game_state["party_power"]) + 18
			_push_event("技能樹節點已學習，戰力提升 18。")
		"skill_reset":
			_push_event("技能樹已重置為內測預設配置。")
		"shop_detail":
			_set_shop_view("detail")
		"shop_confirm":
			_set_shop_view("confirm")
		"shop_back_main":
			_set_shop_view("main")
		"shop_back_home":
			page_flow_state.select_page("home")
		"shop_refresh":
			_push_event("商店商品已刷新。")
		"shop_buy":
			_buy_shop_item()
			_set_shop_view("result")
		"shop_again":
			_set_shop_view("confirm")
		"shop_go_inventory":
			page_flow_state.select_page("inventory")
		"quest_detail":
			_set_quest_view("detail")
		"quest_event":
			_set_quest_view("event")
		"quest_reward", "quest_claim":
			_set_quest_view("reward")
		"quest_back_main":
			_set_quest_view("main")
		"quest_abandon":
			_push_event("任務已取消追蹤，未移除進度。")
			_set_quest_view("main")
		"quest_go":
			page_flow_state.select_page("home")
			_run_idle_patrol()
		"quest_event_join":
			_push_event("活動已加入，活動點數開始累積。")
		"quest_claim_all":
			_claim_quest_rewards()
			_set_quest_view("main")
		"quest_go_inventory":
			page_flow_state.select_page("inventory")
		"ranking_challenge":
			_set_ranking_view("challenge")
		"ranking_guild":
			_set_ranking_view("guild")
		"ranking_player":
			_set_ranking_view("player")
		"ranking_back_main":
			_set_ranking_view("main")
		"ranking_go_challenge":
			page_flow_state.select_page("challenge")
		"ranking_apply_guild":
			_push_event("已送出公會申請，等待晨星旅團回覆。")
		"ranking_add_friend":
			_push_event("好友邀請已送出。")
		"ranking_message":
			page_flow_state.select_page("mail")
		"mail_detail":
			_set_mail_view("detail")
		"mail_claim":
			_set_mail_view("claim")
		"mail_announcement":
			_set_mail_view("announcement")
		"mail_back_main":
			_set_mail_view("main")
		"mail_claim_all":
			_claim_mail_rewards()
			_set_mail_view("main")
		"mail_go_inventory":
			page_flow_state.select_page("inventory")
		"mail_go_quests":
			page_flow_state.select_page("quests")
			_set_quest_view("event")
		"friends_invite_view":
			_set_friends_view("invite")
		"friends_party_view":
			_set_friends_view("party")
		"friends_support_view":
			_set_friends_view("support")
		"friends_back_main":
			_set_friends_view("main")
		"friends_auto_party":
			game_state["party_power"] = int(game_state["party_power"]) + 28
			_push_event("隊伍已自動編成，支援加成已同步。")
		"friends_apply_party":
			game_state["party_power"] = int(game_state["party_power"]) + 42
			_push_event("隊伍編成完成，總戰力提升。")
			_set_friends_view("main")
		"friends_confirm_invite":
			_push_event("好友邀請已送出，等待對方回覆。")
			_set_friends_view("main")
		"friends_set_support":
			_push_event("支援角色已設定，好友可借用你的角色。")
			_set_friends_view("main")
		"world_region":
			_set_world_view("region")
		"world_stage":
			_set_world_view("stage")
		"world_dispatch":
			_set_world_view("dispatch")
		"world_back_main":
			_set_world_view("main")
		"world_back_home":
			page_flow_state.select_page("home")
		"world_patrol":
			_run_idle_patrol()
		"world_sweep":
			_run_idle_patrol()
			_push_event("關卡掃蕩完成，獲得巡邏收益。")
		"world_challenge":
			page_flow_state.select_page("challenge")
		"world_send_dispatch":
			game_state["gc"] = int(game_state["gc"]) + 72
			inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "探索素材", "type": "material", "rarity": "Common", "qty": 8})
			_push_event("探索派遣完成，獲得 GC 與探索素材。")
			_set_world_view("main")
		"account_start":
			_set_account_view("select")
		"account_server":
			_set_account_view("server")
		"account_settings":
			page_flow_state.select_page("system")
		"account_enter":
			page_flow_state.select_page("home")
		"account_create":
			_set_account_view("create")
		"account_back_main":
			_set_account_view("main")
		"account_back_select":
			_set_account_view("select")
		"account_random":
			_push_event("Character appearance randomized.")
		"account_create_confirm":
			game_state["player_name"] = "Elwin"
			_push_event("Character created.")
			_set_account_view("select")
		"account_server_select":
			_push_event("Internal test server selected.")
			_set_account_view("main")
		"account_server_refresh":
			_push_event("Server list refreshed.")
		"liveops_join", "liveops_tasks":
			_set_liveops_view("tasks")
		"liveops_back_quests":
			page_flow_state.select_page("quests")
		"liveops_back_main":
			_set_liveops_view("main")
		"liveops_go":
			page_flow_state.select_page("quests")
			_set_quest_view("event")
		"liveops_claim":
			_claim_quest_rewards()
		"liveops_exchange":
			_buy_shop_item()
		"liveops_detail":
			_set_liveops_view("main")
		"liveops_ranking_reward":
			_set_liveops_view("shop")
		"feedback_back_system":
			page_flow_state.select_page("system")
		"feedback_submit":
			_push_event("Beta feedback submitted for internal review.")
			page_flow_state.select_page("system")
		"achievement_back_role":
			page_flow_state.select_page("role")
		"achievement_title":
			_push_event("Achievement title equipped.")
		"achievement_claim":
			game_state["exp"] = mini(100, int(game_state["exp"]) + 4)
			_push_event("Achievement gameplay reward claimed.")
		"codex_back_world":
			page_flow_state.select_page("world")
		"codex_region":
			page_flow_state.select_page("world")
			_set_world_view("region")
		"codex_card":
			_push_event("Codex entry inspected.")
		"tutorial_back_home":
			page_flow_state.select_page("home")
		"tutorial_next":
			page_flow_state.select_page("quests")
			_set_quest_view("detail")
		"chat_back_friends":
			page_flow_state.select_page("friends")
		"chat_send":
			_push_event("社群訊息已送出。")
		"chat_invite_party":
			page_flow_state.select_page("party")
		"chat_report":
			_push_event("已送出玩家安全回報。")
		"party_back_friends":
			page_flow_state.select_page("friends")
		"party_join":
			game_state["party_power"] = int(game_state["party_power"]) + 20
			_push_event("已送出隊伍申請。")
		"party_create":
			_push_event("隊伍募集已建立。")
		"party_applications":
			_push_event("已查看隊伍申請。")
		"pet_back_role":
			page_flow_state.select_page("role")
		"pet_feed":
			game_state["exp"] = mini(100, int(game_state["exp"]) + 1)
			_push_event("寵物親密度提升。")
		"pet_train":
			game_state["party_power"] = int(game_state["party_power"]) + 12
			_push_event("寵物訓練完成。")
		"pet_codex":
			page_flow_state.select_page("codex")
		"enhance_back_inventory":
			page_flow_state.select_page("inventory")
		"enhance_material":
			_push_event("已選擇強化材料。")
		"enhance_confirm":
			game_state["party_power"] = int(game_state["party_power"]) + 36
			_push_event("裝備強化完成。")
		"arena_back_challenge":
			page_flow_state.select_page("challenge")
		"arena_refresh":
			_push_event("競技場對手已更新。")
		"arena_challenge":
			if _run_boss_challenge():
				_set_challenge_view("battle")
				_push_event("競技場挑戰開始。")
		"arena_defense":
			page_flow_state.select_page("party")
		"boss_preview_back_challenge":
			page_flow_state.select_page("challenge")
		"boss_preview_team":
			page_flow_state.select_page("party")
		"boss_preview_go":
			page_flow_state.select_page("world")
			_set_world_view("stage")
		"boss_preview_remind":
			_push_event("Boss 出現提醒已設定。")
		"dispatch_result_back_world":
			page_flow_state.select_page("world")
		"dispatch_result_claim":
			game_state["gc"] = int(game_state["gc"]) + 120
			game_state["exp"] = mini(100, int(game_state["exp"]) + 6)
			inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "秘境結晶", "type": "material", "rarity": "Rare", "qty": 3})
			_push_event("派遣獎勵已領取。")
			page_flow_state.select_page("world")
		"battle_stats_back_challenge":
			page_flow_state.select_page("challenge")
		"battle_stats_replay":
			_set_challenge_view("battle")
			page_flow_state.select_page("challenge")
		"battle_stats_share":
			_push_event("戰績摘要已保存。")
		"title_detail_back_achievements":
			page_flow_state.select_page("achievements")
		"title_detail_equip":
			_push_event("稱號已裝備。")
		"title_detail_source":
			page_flow_state.select_page("codex")
		"codex_detail_back_codex":
			page_flow_state.select_page("codex")
		"codex_detail_route":
			page_flow_state.select_page("world")
			_set_world_view("stage")
		"codex_detail_track":
			_push_event("圖鑑目標已追蹤。")
		"appearance_collection_back_role":
			page_flow_state.select_page("role")
		"appearance_collection_preview":
			_push_event("外觀預覽已更新。")
		"appearance_collection_equip":
			_push_event("外觀已套用。")
		"appearance_collection_dye":
			_push_event("染色預覽已套用。")
		"badge_collection_back_achievements":
			page_flow_state.select_page("achievements")
		"badge_collection_equip":
			_push_event("徽章已展示。")
		"badge_collection_set":
			_push_event("徽章套組效果已查看。")
		"tutorial_battle_back_tutorial":
			page_flow_state.select_page("tutorial")
		"tutorial_battle_skill":
			_push_event("教學攻擊技能已鎖定。")
		"tutorial_battle_next":
			page_flow_state.select_page("tutorial_inventory")
		"tutorial_inventory_back_tutorial":
			page_flow_state.select_page("tutorial")
		"tutorial_inventory_item":
			_push_event("背包教學物品已選取。")
		"tutorial_inventory_next":
			page_flow_state.select_page("tutorial_skills")
		"tutorial_skills_back_tutorial":
			page_flow_state.select_page("tutorial")
		"tutorial_skills_upgrade":
			game_state["party_power"] = int(game_state["party_power"]) + 8
			_push_event("教學技能已升級。")
		"tutorial_skills_next":
			page_flow_state.select_page("tutorial_guild")
		"tutorial_guild_back_tutorial":
			page_flow_state.select_page("tutorial")
		"tutorial_guild_entry":
			page_flow_state.select_page("guild")
		"tutorial_guild_finish":
			_push_event("新手教學已完成。")
			page_flow_state.select_page("home")
		"daily_checkin_back_liveops":
			page_flow_state.select_page("liveops")
		"daily_checkin_calendar":
			_push_event("簽到進度已查看。")
		"daily_checkin_claim":
			game_state["gc"] = int(game_state["gc"]) + 80
			_push_event("簽到獎勵已領取。")
		"pass_progress_back_liveops":
			page_flow_state.select_page("liveops")
		"pass_progress_tasks":
			page_flow_state.select_page("liveops")
			_set_liveops_view("tasks")
		"pass_progress_claim":
			game_state["exp"] = mini(100, int(game_state["exp"]) + 4)
			_push_event("通行證獎勵已領取。")
		"timed_challenge_back_liveops":
			page_flow_state.select_page("liveops")
		"timed_challenge_reward":
			_push_event("限時挑戰獎勵已預覽。")
		"timed_challenge_start":
			page_flow_state.select_page("challenge")
			_set_challenge_view("battle")
		"event_exchange_confirm_back_liveops":
			page_flow_state.select_page("liveops")
			_set_liveops_view("shop")
		"event_exchange_confirm_cancel":
			page_flow_state.select_page("liveops")
			_set_liveops_view("shop")
		"event_exchange_confirm_confirm":
			inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "星辰之冠", "type": "equipment", "rarity": "Epic", "qty": 1})
			_push_event("活動道具已兌換。")
			page_flow_state.select_page("liveops")
			_set_liveops_view("shop")
		_:
			return
	_refresh_all()

func _set_pack_view(next_view: String) -> void:
	page_flow_state.set_pack_view(next_view, PACK_COMPOSITE_PATHS)

func _set_role_view(next_view: String) -> void:
	page_flow_state.set_role_view(next_view, ROLE_COMPOSITE_PATHS)

func _set_market_view(next_view: String) -> void:
	page_flow_state.set_market_view(next_view, MARKET_COMPOSITE_PATHS)

func _set_challenge_view(next_view: String) -> void:
	page_flow_state.set_challenge_view(next_view, CHALLENGE_COMPOSITE_PATHS)

func _set_guild_view(next_view: String) -> void:
	page_flow_state.set_guild_view(next_view, GUILD_COMPOSITE_PATHS)

func _set_system_view(next_view: String) -> void:
	page_flow_state.set_system_view(next_view, SYSTEM_COMPOSITE_PATHS)

func _set_inventory_view(next_view: String) -> void:
	page_flow_state.set_inventory_view(next_view, INVENTORY_COMPOSITE_PATHS)

func _set_skill_view(next_view: String) -> void:
	page_flow_state.set_skill_view(next_view, SKILL_COMPOSITE_PATHS)

func _set_shop_view(next_view: String) -> void:
	page_flow_state.set_shop_view(next_view, SHOP_COMPOSITE_PATHS)

func _set_quest_view(next_view: String) -> void:
	page_flow_state.set_quest_view(next_view, QUEST_COMPOSITE_PATHS)

func _set_ranking_view(next_view: String) -> void:
	page_flow_state.set_ranking_view(next_view, RANKING_COMPOSITE_PATHS)

func _set_mail_view(next_view: String) -> void:
	page_flow_state.set_mail_view(next_view, MAIL_COMPOSITE_PATHS)

func _set_friends_view(next_view: String) -> void:
	page_flow_state.set_friends_view(next_view, FRIENDS_COMPOSITE_PATHS)

func _set_world_view(next_view: String) -> void:
	page_flow_state.set_world_view(next_view, WORLD_COMPOSITE_PATHS)

func _set_account_view(next_view: String) -> void:
	page_flow_state.set_account_view(next_view, ACCOUNT_COMPOSITE_PATHS)

func _set_liveops_view(next_view: String) -> void:
	page_flow_state.set_liveops_view(next_view, LIVEOPS_COMPOSITE_PATHS)

func _run_idle_patrol() -> void:
	game_state["gc"] = int(game_state["gc"]) + 18
	game_state["exp"] = mini(100, int(game_state["exp"]) + 5)
	game_state["party_power"] = int(game_state["party_power"]) + 8
	if int(game_state["exp"]) >= 100:
		game_state["level"] = int(game_state["level"]) + 1
		game_state["exp"] = 0
		_push_event("等級提升，紙娃娃基礎能力同步提高。")
	else:
		_push_event("普隆丘陵巡邏完成，獲得 18 GC 與草原材料。")

func _train_character() -> void:
	var cost := 60
	if int(game_state["gc"]) < cost:
		_push_event("GC 不足，暫時無法培養角色。")
		return
	game_state["gc"] = int(game_state["gc"]) - cost
	game_state["exp"] = mini(100, int(game_state["exp"]) + 4)
	game_state["party_power"] = int(game_state["party_power"]) + 20
	inventory_skill_state_binder.sync_skill_training(skill_rows)
	_push_event("角色培養完成，戰力提升 20。")

func _preview_job_change() -> void:
	game_state["party_power"] = int(game_state["party_power"]) + 12
	_push_event("轉職條件已檢查，初心職業可進入下一階段養成。")

func _confirm_job_change() -> void:
	if int(game_state["level"]) < 12:
		_push_event("等級不足，暫時無法轉職。")
		return
	game_state["party_power"] = int(game_state["party_power"]) + 80
	_push_event("已確認劍士轉職預覽，戰力與技能配置已更新。")

func _apply_role_appearance() -> void:
	var equipped := Dictionary(game_state["equipped"])
	equipped["accessory"] = "星塵護符"
	game_state["equipped"] = equipped
	role_equipment_state_binder.apply_accessory(game_state, paper_dolls, String(equipped["accessory"]))
	paper_dolls[0]["equipped"] = equipped.duplicate(true)
	_push_event("紙娃娃外觀已套用，星塵護符顯示於角色外觀。")

func _reset_role_appearance() -> void:
	var equipped := Dictionary(game_state["equipped"])
	equipped["accessory"] = "藍色披肩"
	game_state["equipped"] = equipped
	role_equipment_state_binder.apply_accessory(game_state, paper_dolls, String(equipped["accessory"]))
	paper_dolls[0]["equipped"] = equipped.duplicate(true)
	_push_event("紙娃娃外觀已重置為目前裝備顯示。")

func _open_focus_pack() -> void:
	if String(game_state["pack_status"]) == "BURNED":
		_simulate_pack_purchase()
		return
	game_state["pack_status"] = "BURNED"
	game_state["open_result"] = "星塵護符 / Rare"
	inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "星塵護符", "type": "accessory", "rarity": "Rare", "qty": 1})
	var equipped := Dictionary(game_state["equipped"])
	equipped["accessory"] = "星塵護符"
	game_state["equipped"] = equipped
	role_equipment_state_binder.apply_accessory(game_state, paper_dolls, String(equipped["accessory"]))
	paper_dolls[0]["equipped"] = equipped.duplicate(true)
	pack_page_state_binder.sync_focus_card(game_state, pack_cards, String(game_state["open_result"]))
	_push_event("LP-2048 開啟成功，獲得星塵護符並裝備到角色身上。")

func _simulate_pack_purchase() -> void:
	var cost := 120
	if int(game_state["gc"]) < cost:
		_push_event("GC 不足，無法完成模擬付款。")
		return
	game_state["step"] = int(game_state["step"]) + 1
	game_state["gc"] = int(game_state["gc"]) - cost
	game_state["pack_focus"] = "LP-2124"
	game_state["pack_status"] = "OWNED"
	game_state["pack_price"] = cost
	game_state["trade_count"] = 0
	game_state["simulated_payment"] = "SIMULATED_APPROVED"
	pack_page_state_binder.sync_focus_card(game_state, pack_cards, "待開啟")
	_push_event("模擬付款核准，LP-2124 已進入背包。")
	_post_simulated_payment()

func _list_focus_pack() -> void:
	if String(game_state["pack_status"]) == "OWNED":
		game_state["pack_status"] = "LISTED"
		_push_event("%s 已上架交易場，價格受本輪上限保護。" % String(game_state["pack_focus"]))
	else:
		game_state["trade_count"] = int(game_state["trade_count"]) + 1
		game_state["gc"] = int(game_state["gc"]) + int(game_state["pack_price"])
		game_state["pack_status"] = "COOLDOWN"
		_push_event("買家以 %d GC 成交，禮包進入冷卻窗口。" % int(game_state["pack_price"]))
	pack_page_state_binder.sync_focus_card(game_state, pack_cards)
	market_page_state_binder.sync_focus_listing(game_state, market_rows)

func _buy_market_item() -> void:
	var cost := 120
	if int(game_state["gc"]) < cost:
		_push_event("GC 不足，無法購買交易行商品。")
		return
	game_state["gc"] = int(game_state["gc"]) - cost
	inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "治療藥水", "type": "consumable", "rarity": "Common", "qty": 10})
	market_page_state_binder.sync_purchase_record(market_rows)
	_push_event("交易行購買完成，治療藥水 x10 已放入背包。")

func _buy_shop_item() -> void:
	var cost := 300
	if int(game_state["gc"]) < cost:
		_push_event("GC 不足，無法購買商店商品。")
		return
	game_state["gc"] = int(game_state["gc"]) - cost
	game_state["tickets"] = int(game_state["tickets"]) + 3
	inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "挑戰票", "type": "consumable", "rarity": "Common", "qty": 3})
	_push_event("商店購買成功，挑戰票 x3 已送入背包。")

func _claim_quest_rewards() -> void:
	game_state["gc"] = int(game_state["gc"]) + 500
	game_state["exp"] = mini(100, int(game_state["exp"]) + 12)
	game_state["tickets"] = int(game_state["tickets"]) + 2
	inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "強化石", "type": "material", "rarity": "Common", "qty": 20})
	_push_event("任務與活動獎勵已領取，GC、EXP、票券與材料已同步。")

func _claim_mail_rewards() -> void:
	game_state["gc"] = int(game_state["gc"]) + 500
	game_state["tickets"] = int(game_state["tickets"]) + 3
	inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "星塵碎片", "type": "material", "rarity": "Rare", "qty": 5})
	inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "強化石", "type": "material", "rarity": "Common", "qty": 10})
	_push_event("郵件附件已領取，獎勵送入背包。")

func _refresh_market_board() -> void:
	market_page_state_binder.sync_refresh_row(market_rows, {"pack": "LP-2201", "seller": "Player-31", "price": "118 GC", "state": "新上架"}, 5)
	_push_event("交易行列表已刷新。")

func _run_boss_challenge() -> bool:
	if int(game_state["tickets"]) <= 0:
		_push_event("挑戰票不足，請先在票券商店補充。")
		return false
	game_state["tickets"] = int(game_state["tickets"]) - 1
	game_state["boss_hp"] = max(0, int(game_state["boss_hp"]) - 16)
	game_state["gc"] = int(game_state["gc"]) + 42
	challenge_guild_system_state_binder.sync_challenge_state(game_state, boss_rows)
	_push_event("隊伍挑戰巨岩守衛，造成傷害並獲得 42 GC。")
	return true

func _complete_challenge_result() -> void:
	game_state["gc"] = int(game_state["gc"]) + 420
	game_state["boss_hp"] = max(0, int(game_state["boss_hp"]) - 18)
	inventory_skill_state_binder.sync_inventory_item(inventory_items, {"name": "挑戰徽章", "type": "material", "rarity": "Rare", "qty": 8})
	challenge_guild_system_state_binder.sync_challenge_state(game_state, boss_rows)
	_push_event("Boss 挑戰結算完成，獲得 420 GC 與挑戰徽章。")

func _donate_to_guild() -> void:
	var cost := 50
	if int(game_state["gc"]) < cost:
		_push_event("GC 不足，無法進行公會捐獻。")
		return
	game_state["gc"] = int(game_state["gc"]) - cost
	game_state["party_power"] = int(game_state["party_power"]) + 6
	challenge_guild_system_state_binder.sync_guild_donation(game_state)
	_push_event("公會捐獻完成，公會貢獻與角色支援能力已同步。")

func _run_guild_boss() -> void:
	game_state["boss_hp"] = max(0, int(game_state["boss_hp"]) - 8)
	game_state["gc"] = int(game_state["gc"]) + 24
	challenge_guild_system_state_binder.sync_guild_boss(game_state)
	challenge_guild_system_state_binder.sync_challenge_state(game_state, boss_rows)
	_push_event("已參與公會 Boss，獲得 24 GC 與公會貢獻。")

func _toggle_equipment_set() -> void:
	var equipped := Dictionary(game_state["equipped"])
	if String(equipped["weapon"]) == "銅製短劍":
		equipped["weapon"] = "橡木法杖"
		equipped["armor"] = "學徒長袍"
		equipped["head"] = "羽飾髮夾"
		equipped["accessory"] = "紅色披肩"
		game_state["gender"] = "female"
		game_state["player_name"] = "莉娜"
	else:
		equipped["weapon"] = "銅製短劍"
		equipped["armor"] = "初心者外套"
		equipped["head"] = "冒險者髮帶"
		equipped["accessory"] = "藍色披肩"
		game_state["gender"] = "male"
		game_state["player_name"] = "艾爾文"
	game_state["equipped"] = equipped
	role_equipment_state_binder.apply_equipment_set(game_state, paper_dolls, equipped, String(game_state["gender"]), String(game_state["player_name"]))
	paper_dolls[0]["gender"] = String(game_state["gender"])
	paper_dolls[0]["name"] = String(game_state["player_name"])
	paper_dolls[0]["equipped"] = equipped.duplicate(true)
	game_state["party_power"] = int(game_state["party_power"]) + 30
	_push_event("角色裝備已切換，紙娃娃外觀與戰力同步更新。")

func _push_event(text: String) -> void:
	event_feed.push_front(text)
	if event_feed.size() > 5:
		event_feed.pop_back()

func _try_sync_backend() -> void:
	_request_player_state()

func _on_player_action_received(payload: Dictionary) -> void:
	var result_payload := Dictionary(payload.get("result", {}))
	if result_payload.has("profile"):
		_apply_player_state(Dictionary(result_payload["profile"]))
	else:
		_request_player_state()

func _on_simulated_payment_received(_payload: Dictionary) -> void:
	_push_event("後端已記錄模擬付款，玩家狀態準備同步。")
	_request_player_state()

func _on_player_api_request_failed(action: String, response_code: int, message: String) -> void:
	_push_event("API sync failed: %s (%d) %s" % [action, response_code, message])

func _apply_player_state(payload: Dictionary) -> void:
	var event_messages: Array = player_state_mapper.apply_payload(payload, game_state, paper_dolls, inventory_items, skill_rows, pack_cards)
	role_equipment_state_binder.sync_active_paper_doll(game_state, paper_dolls)
	inventory_skill_state_binder.sync_backend_lists(inventory_items, skill_rows)
	challenge_guild_system_state_binder.sync_challenge_state(game_state, boss_rows)
	for event_message in event_messages:
		_push_event(event_message)
	_refresh_all()

func _apply_button_style(button: Button, highlighted: bool) -> void:
	button.add_theme_font_size_override("font_size", 12)
	button.add_theme_color_override("font_color", Color("#f4f0df"))
	if highlighted:
		button.add_theme_stylebox_override("normal", _texture_style("res://assets/production/ui/button-normal.png", 18, _button_style(Color("#6c3e18"), Color("#ffd05f"), 3, 8)))
		button.add_theme_stylebox_override("hover", _texture_style("res://assets/production/ui/button-pressed.png", 18, _button_style(Color("#875322"), Color("#ffe28a"), 3, 8)))
	else:
		button.add_theme_stylebox_override("normal", _texture_style("res://assets/production/ui/button-normal.png", 18, _button_style(Color("#233047"), Color("#6a83ad"), 2, 8)))
		button.add_theme_stylebox_override("hover", _texture_style("res://assets/production/ui/button-pressed.png", 18, _button_style(Color("#304b68"), Color("#89d7ff"), 2, 8)))
	button.add_theme_stylebox_override("pressed", _texture_style("res://assets/production/ui/button-pressed.png", 18, _button_style(Color("#304b68"), Color("#ffd05f"), 2, 8)))
	button.add_theme_stylebox_override("disabled", _texture_style("res://assets/production/ui/button-disabled.png", 18, _button_style(Color("#155168"), Color("#57d8ff"), 2, 8)))

func _apply_nav_button_style(button: Button, highlighted: bool) -> void:
	button.focus_mode = Control.FOCUS_ALL
	button.add_theme_font_size_override("font_size", 11)
	button.add_theme_color_override("font_color", Color("#f8f0d8") if highlighted else Color("#c7d9e8"))
	button.add_theme_color_override("font_hover_color", Color("#ffffff"))
	button.add_theme_color_override("font_pressed_color", Color("#fff5b8"))
	_apply_transparent_button_style(button)

func _apply_transparent_button_style(button: Button) -> void:
	var empty := StyleBoxEmpty.new()
	button.add_theme_stylebox_override("normal", empty)
	button.add_theme_stylebox_override("hover", empty)
	button.add_theme_stylebox_override("pressed", empty)
	button.add_theme_stylebox_override("disabled", empty)

func _nav_highlight_style(bg: Color) -> StyleBox:
	var style := _base_style(bg, 10)
	style.border_color = Color("#82e7ff", 0.72)
	style.set_border_width_all(1)
	style.set_content_margin(SIDE_LEFT, 2)
	style.set_content_margin(SIDE_RIGHT, 2)
	style.set_content_margin(SIDE_TOP, 2)
	style.set_content_margin(SIDE_BOTTOM, 2)
	return style

func _button_style(bg: Color, border: Color, width: int, radius: int) -> StyleBox:
	var style := _base_style(bg, radius)
	style.border_color = border
	style.set_border_width_all(width)
	style.set_content_margin(SIDE_LEFT, 7)
	style.set_content_margin(SIDE_RIGHT, 7)
	style.set_content_margin(SIDE_TOP, 4)
	style.set_content_margin(SIDE_BOTTOM, 4)
	return style

func _resource_style() -> StyleBox:
	var style := _base_style(Color("#111722d8"), 7)
	style.border_color = Color("#253a4e")
	style.set_border_width_all(1)
	style.set_content_margin(SIDE_LEFT, 5)
	style.set_content_margin(SIDE_RIGHT, 5)
	style.set_content_margin(SIDE_TOP, 3)
	style.set_content_margin(SIDE_BOTTOM, 3)
	return style

func _plain_status_style() -> StyleBox:
	var style := _base_style(Color("#07111ce8"), 8)
	style.set_content_margin(SIDE_LEFT, 7)
	style.set_content_margin(SIDE_RIGHT, 7)
	style.set_content_margin(SIDE_TOP, 6)
	style.set_content_margin(SIDE_BOTTOM, 6)
	return style

func _portrait_style() -> StyleBox:
	var style := _base_style(Color("#07111ce8"), 12)
	style.border_color = Color("#c49c45")
	style.set_border_width_all(2)
	style.set_content_margin(SIDE_LEFT, 3)
	style.set_content_margin(SIDE_RIGHT, 3)
	style.set_content_margin(SIDE_TOP, 3)
	style.set_content_margin(SIDE_BOTTOM, 3)
	return style

func _bar_style(bg: Color, border: Color) -> StyleBox:
	var style := _base_style(bg, 5)
	style.border_color = border
	style.set_border_width_all(1)
	style.set_content_margin(SIDE_LEFT, 2)
	style.set_content_margin(SIDE_RIGHT, 2)
	style.set_content_margin(SIDE_TOP, 2)
	style.set_content_margin(SIDE_BOTTOM, 2)
	return style

func _status_texture_style() -> StyleBox:
	var fallback := _base_style(Color("#06111cea"), 11)
	fallback.border_color = Color("#d2a94f")
	fallback.set_border_width_all(2)
	fallback.set_content_margin(SIDE_LEFT, 16)
	fallback.set_content_margin(SIDE_RIGHT, 16)
	fallback.set_content_margin(SIDE_TOP, 9)
	fallback.set_content_margin(SIDE_BOTTOM, 9)
	return _texture_style("res://assets/production/ui/status-panel.png", 22, fallback)

func _section_style() -> StyleBox:
	var style := _base_style(Color("#0d1722e8"), 7)
	style.border_color = Color("#26384d")
	style.set_border_width_all(1)
	style.set_content_margin(SIDE_LEFT, 9)
	style.set_content_margin(SIDE_RIGHT, 9)
	style.set_content_margin(SIDE_TOP, 8)
	style.set_content_margin(SIDE_BOTTOM, 8)
	return _texture_style("res://assets/production/ui/page-panel-9slice.png", 24, style)

func _log_style() -> StyleBox:
	var style := _base_style(Color("#07111be6"), 6)
	style.border_color = Color("#2b6f86")
	style.set_border_width_all(1)
	style.set_content_margin(SIDE_LEFT, 9)
	style.set_content_margin(SIDE_RIGHT, 9)
	style.set_content_margin(SIDE_TOP, 7)
	style.set_content_margin(SIDE_BOTTOM, 7)
	return _texture_style("res://assets/production/ui/log-panel-9slice.png", 22, style)

func _action_panel_style() -> StyleBox:
	var style := _base_style(Color("#20180fea"), 9)
	style.border_color = Color("#e7b84f")
	style.set_border_width_all(2)
	style.set_content_margin(SIDE_LEFT, 9)
	style.set_content_margin(SIDE_RIGHT, 9)
	style.set_content_margin(SIDE_TOP, 7)
	style.set_content_margin(SIDE_BOTTOM, 7)
	return _texture_style("res://assets/production/ui/modal-panel-9slice.png", 26, style)

func _stat_card_style() -> StyleBox:
	var style := _base_style(Color("#111c2bcc"), 7)
	style.border_color = Color("#263952")
	style.set_border_width_all(1)
	style.set_content_margin(SIDE_LEFT, 7)
	style.set_content_margin(SIDE_RIGHT, 7)
	style.set_content_margin(SIDE_TOP, 7)
	style.set_content_margin(SIDE_BOTTOM, 7)
	return style

func _base_style(bg: Color, radius: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.set_corner_radius_all(radius)
	return style

func _style(bg: Color, border: Color, radius: int) -> StyleBox:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.border_color = border
	style.set_border_width_all(2)
	style.set_corner_radius_all(radius)
	style.set_content_margin(SIDE_LEFT, 7)
	style.set_content_margin(SIDE_RIGHT, 7)
	style.set_content_margin(SIDE_TOP, 4)
	style.set_content_margin(SIDE_BOTTOM, 4)
	return _texture_style("res://assets/production/ui/hud-frame-9slice.png", 22, style)

func _texture_style(path: String, margin: int, fallback: StyleBox) -> StyleBox:
	var texture := _load_texture_resource(path)
	if texture == null:
		return fallback
	var style := StyleBoxTexture.new()
	style.texture = texture
	style.set_texture_margin(SIDE_LEFT, margin)
	style.set_texture_margin(SIDE_RIGHT, margin)
	style.set_texture_margin(SIDE_TOP, margin)
	style.set_texture_margin(SIDE_BOTTOM, margin)
	style.set_content_margin(SIDE_LEFT, 8)
	style.set_content_margin(SIDE_RIGHT, 8)
	style.set_content_margin(SIDE_TOP, 6)
	style.set_content_margin(SIDE_BOTTOM, 6)
	return style

func _load_texture_resource(path: String) -> Texture2D:
	if ResourceLoader.exists(path):
		var resource := load(path)
		if resource is Texture2D:
			return resource as Texture2D
	var image := Image.load_from_file(ProjectSettings.globalize_path(path))
	if image == null or image.is_empty():
		return null
	if image.get_format() != Image.FORMAT_RGBA8:
		image.convert(Image.FORMAT_RGBA8)
	return ImageTexture.create_from_image(image)

class ArtIcon:
	extends Control

	var icon_type := "pack"

	func _draw() -> void:
		var texture := _icon_texture(icon_type)
		if texture != null:
			draw_texture_rect(texture, Rect2(Vector2.ZERO, size), false)
			return
		var rect := Rect2(Vector2(4, 4), size - Vector2(8, 8))
		var c1 := Color("#6fd6ff")
		var c2 := Color("#ffdc72")
		draw_circle(rect.get_center(), minf(rect.size.x, rect.size.y) * 0.48, Color("#102033", 0.92))
		draw_circle(rect.get_center(), minf(rect.size.x, rect.size.y) * 0.48, Color("#67d7ff"), false, 1.6)
		match icon_type:
			"pack":
				draw_rect(Rect2(rect.position + Vector2(6, 16), Vector2(28, 20)), Color("#8a5535"))
				draw_rect(Rect2(rect.position + Vector2(6, 16), Vector2(28, 20)), c2, false, 2)
				draw_rect(Rect2(rect.position + Vector2(17, 8), Vector2(8, 28)), c2)
				draw_circle(rect.position + Vector2(21, 25), 7, c1)
			"listing":
				draw_rect(Rect2(rect.position + Vector2(5, 22), Vector2(30, 14)), Color("#27384d"))
				draw_polygon(PackedVector2Array([rect.position + Vector2(3, 20), rect.position + Vector2(37, 20), rect.position + Vector2(31, 10), rect.position + Vector2(9, 10)]), PackedColorArray([Color("#7fdcff"), Color("#65aeea"), Color("#ffdc72"), Color("#ffdc72")]))
				draw_line(rect.position + Vector2(10, 36), rect.position + Vector2(10, 42), c1, 2)
				draw_line(rect.position + Vector2(30, 36), rect.position + Vector2(30, 42), c1, 2)
			"open":
				draw_circle(rect.position + Vector2(22, 22), 14, Color("#5d3c7f"))
				for i in range(6):
					var a := TAU * float(i) / 6.0
					draw_line(rect.position + Vector2(22, 22), rect.position + Vector2(22, 22) + Vector2(cos(a), sin(a)) * 19.0, c2, 2)
				draw_circle(rect.position + Vector2(22, 22), 7, c1)
			"cooldown":
				draw_arc(rect.position + Vector2(22, 22), 15, -0.5, TAU * 0.78, 24, c1, 3)
				draw_line(rect.position + Vector2(22, 22), rect.position + Vector2(22, 12), c2, 2)
				draw_line(rect.position + Vector2(22, 22), rect.position + Vector2(31, 25), c2, 2)
			"market":
				draw_rect(Rect2(rect.position + Vector2(7, 18), Vector2(28, 18)), Color("#26384c"))
				draw_rect(Rect2(rect.position + Vector2(7, 18), Vector2(28, 18)), c1, false, 2)
				draw_circle(rect.position + Vector2(15, 27), 4, c2)
				draw_circle(rect.position + Vector2(27, 27), 4, c2)
			"price":
				for i in range(3):
					draw_ellipse(rect.position + Vector2(12 + i * 3, 30 - i * 8), 13, 5, c2)
				draw_string(ThemeDB.fallback_font, rect.position + Vector2(15, 25), "G", HORIZONTAL_ALIGNMENT_LEFT, 20, 14, Color("#26384c"))
			"lock":
				draw_rect(Rect2(rect.position + Vector2(11, 21), Vector2(23, 17)), c2)
				draw_arc(rect.position + Vector2(22, 22), 10, PI, TAU, 16, c1, 3)
				draw_circle(rect.position + Vector2(22, 29), 3, Color("#26384c"))
			"force_open":
				for i in range(8):
					var a := TAU * float(i) / 8.0
					draw_line(rect.position + Vector2(22, 22), rect.position + Vector2(22, 22) + Vector2(cos(a), sin(a)) * 18.0, c2, 2)
				draw_rect(Rect2(rect.position + Vector2(12, 14), Vector2(20, 20)), Color("#8a5535"))
				draw_rect(Rect2(rect.position + Vector2(12, 14), Vector2(20, 20)), c1, false, 2)
			"boss":
				draw_circle(rect.position + Vector2(22, 24), 16, Color("#664057"))
				draw_circle(rect.position + Vector2(16, 21), 3, Color("#ff7187"))
				draw_circle(rect.position + Vector2(28, 21), 3, Color("#ff7187"))
				draw_polygon(PackedVector2Array([rect.position + Vector2(10, 12), rect.position + Vector2(16, 4), rect.position + Vector2(18, 15)]), PackedColorArray([c2, c2, c2]))
				draw_polygon(PackedVector2Array([rect.position + Vector2(34, 12), rect.position + Vector2(28, 4), rect.position + Vector2(26, 15)]), PackedColorArray([c2, c2, c2]))
			"guild":
				draw_polygon(PackedVector2Array([rect.position + Vector2(22, 6), rect.position + Vector2(36, 12), rect.position + Vector2(32, 33), rect.position + Vector2(22, 40), rect.position + Vector2(12, 33), rect.position + Vector2(8, 12)]), PackedColorArray([c1, c1, Color("#38537a"), Color("#38537a"), Color("#38537a"), c1]))
				draw_line(rect.position + Vector2(22, 12), rect.position + Vector2(22, 34), c2, 3)
			"ticket":
				draw_rect(Rect2(rect.position + Vector2(8, 14), Vector2(28, 20)), c2)
				draw_circle(rect.position + Vector2(8, 24), 4, Color("#2d3d58"))
				draw_circle(rect.position + Vector2(36, 24), 4, Color("#2d3d58"))
				draw_line(rect.position + Vector2(22, 16), rect.position + Vector2(22, 32), Color("#2d3d58"), 2)
			"season":
				draw_circle(rect.position + Vector2(22, 18), 11, c2)
				draw_polygon(PackedVector2Array([rect.position + Vector2(15, 28), rect.position + Vector2(20, 42), rect.position + Vector2(24, 30)]), PackedColorArray([c1, c1, c1]))
				draw_polygon(PackedVector2Array([rect.position + Vector2(29, 28), rect.position + Vector2(24, 42), rect.position + Vector2(20, 30)]), PackedColorArray([Color("#7aa6ff"), Color("#7aa6ff"), Color("#7aa6ff")]))
			"warrior", "skill":
				draw_line(rect.position + Vector2(13, 34), rect.position + Vector2(33, 10), c2, 4)
				draw_line(rect.position + Vector2(15, 17), rect.position + Vector2(30, 32), c1, 3)
			"ranger":
				draw_arc(rect.position + Vector2(23, 23), 16, -1.2, 1.2, 24, c2, 3)
				draw_line(rect.position + Vector2(15, 10), rect.position + Vector2(31, 36), c1, 2)
				draw_line(rect.position + Vector2(10, 23), rect.position + Vector2(34, 23), c1, 2)
			"mage":
				draw_line(rect.position + Vector2(14, 38), rect.position + Vector2(30, 8), c2, 3)
				draw_circle(rect.position + Vector2(31, 9), 8, Color("#8b78ff"))
				draw_circle(rect.position + Vector2(31, 9), 4, c1)
			"cleric":
				draw_circle(rect.position + Vector2(22, 22), 15, Color("#356f68"))
				draw_rect(Rect2(rect.position + Vector2(19, 11), Vector2(6, 22)), c2)
				draw_rect(Rect2(rect.position + Vector2(12, 19), Vector2(20, 6)), c2)
			"armor":
				draw_polygon(PackedVector2Array([
					rect.position + Vector2(12, 10),
					rect.position + Vector2(32, 10),
					rect.position + Vector2(30, 34),
					rect.position + Vector2(14, 34),
				]), PackedColorArray([Color("#d9b36a"), Color("#f1d58a"), Color("#8b6240"), Color("#a67845")]))
				draw_line(rect.position + Vector2(15, 20), rect.position + Vector2(29, 20), c1, 2)
			"rare":
				draw_polygon(PackedVector2Array([
					rect.position + Vector2(22, 6),
					rect.position + Vector2(34, 18),
					rect.position + Vector2(28, 36),
					rect.position + Vector2(16, 36),
					rect.position + Vector2(10, 18),
				]), PackedColorArray([Color("#caa7ff"), Color("#8e72ff"), Color("#5f48c8"), Color("#7f5de2"), Color("#b990ff")]))
				draw_circle(rect.position + Vector2(22, 22), 5, c2)
			"potion":
				draw_rect(Rect2(rect.position + Vector2(16, 11), Vector2(12, 5)), c2)
				draw_polygon(PackedVector2Array([
					rect.position + Vector2(15, 16),
					rect.position + Vector2(29, 16),
					rect.position + Vector2(33, 34),
					rect.position + Vector2(11, 34),
				]), PackedColorArray([Color("#6fffb1"), Color("#9effca"), Color("#177f5a"), Color("#2bbf84")]))
				draw_line(rect.position + Vector2(15, 26), rect.position + Vector2(31, 26), Color("#eaffff"), 2)
			"material":
				draw_polygon(PackedVector2Array([
					rect.position + Vector2(13, 30),
					rect.position + Vector2(20, 12),
					rect.position + Vector2(31, 18),
					rect.position + Vector2(30, 35),
				]), PackedColorArray([Color("#89a8b8"), Color("#e1f6ff"), Color("#6e8794"), Color("#405a66")]))
				draw_line(rect.position + Vector2(18, 24), rect.position + Vector2(28, 21), c1, 2)
			"crystal":
				draw_polygon(PackedVector2Array([
					rect.position + Vector2(22, 7),
					rect.position + Vector2(33, 20),
					rect.position + Vector2(27, 38),
					rect.position + Vector2(16, 38),
					rect.position + Vector2(10, 20),
				]), PackedColorArray([Color("#b9f7ff"), Color("#6bdcff"), Color("#247aa2"), Color("#2c91c2"), Color("#88ecff")]))
				draw_line(rect.position + Vector2(22, 8), rect.position + Vector2(22, 36), Color("#eaffff", 0.75), 2)
			_:
				draw_circle(rect.position + Vector2(22, 22), 15, c1)

	func _icon_texture(kind: String) -> Texture2D:
		var path := _icon_path(kind)
		if path == "":
			return null
		if ResourceLoader.exists(path):
			var resource := load(path)
			if resource is Texture2D:
				return resource as Texture2D
		var image := Image.load_from_file(ProjectSettings.globalize_path(path))
		if image == null or image.is_empty():
			return null
		if image.get_format() != Image.FORMAT_RGBA8:
			image.convert(Image.FORMAT_RGBA8)
		return ImageTexture.create_from_image(image)

	func _icon_path(kind: String) -> String:
		match kind:
			"pack":
				return "res://assets/production/icons/pack-sealed.png"
			"listing":
				return "res://assets/production/icons/listing-status.png"
			"open":
				return "res://assets/production/icons/pack-opened.png"
			"cooldown":
				return "res://assets/production/icons/cooldown.png"
			"market":
				return "res://assets/production/icons/market-stall.png"
			"price":
				return "res://assets/production/icons/price-marker.png"
			"lock":
				return "res://assets/production/icons/trade-lock.png"
			"force_open":
				return "res://assets/production/icons/pack-opened.png"
			"boss":
				return "res://assets/production/icons/boss-marker.png"
			"guild":
				return "res://assets/production/icons/guild-marker.png"
			"ticket":
				return "res://assets/production/icons/challenge-ticket.png"
			"season":
				return "res://assets/production/icons/reward-chest.png"
			"warrior", "skill":
				return "res://assets/production/icons/skill-active-attack.png"
			"ranger":
				return "res://assets/production/icons/skill-ranged-attack.png"
			"mage":
				return "res://assets/production/icons/skill-magic-burst.png"
			"cleric":
				return "res://assets/production/icons/skill-healing.png"
			"passive":
				return "res://assets/production/icons/skill-passive-mastery.png"
			"weapon":
				return "res://assets/production/equipment/sword-layer-v2.png"
			"head":
				return "res://assets/production/equipment/circlet-layer.png"
			"armor":
				return "res://assets/production/equipment/cloth-armor-layer-v2.png"
			"rare":
				return "res://assets/production/icons/rare-item.png"
			"potion":
				return "res://assets/production/icons/potion-green.png"
			"material":
				return "res://assets/production/icons/material-ore.png"
			"crystal":
				return "res://assets/production/icons/crystal-blue.png"
			_:
				return ""

class PaperDollView:
	extends Control

	var gender: String = "male"
	var visual_state: String = "idle"
	var portrait_mode := false
	var base_texture_mode := false
	var equipped: Dictionary = {
		"weapon": "銅製短劍",
		"armor": "初心者外套",
		"head": "冒險者髮帶",
		"accessory": "藍色披肩",
	}

	func _draw() -> void:
		if portrait_mode:
			_draw_portrait()
			return
		if base_texture_mode:
			_draw_base_texture_preview()
			return
		var center: Vector2 = Vector2(size.x * 0.5, size.y * 0.62)
		var scale: float = minf(size.x / 150.0, size.y / 145.0)
		if visual_state != "idle" and _draw_state_frame(center, scale):
			return
		if _draw_production_layers(center, scale):
			return
		_draw_shadow(center, scale)
		_draw_cape(center, scale)
		_draw_body(center, scale)
		_draw_armor(center, scale)
		_draw_head(center, scale)
		_draw_weapon(center, scale)
		_draw_accessory(center, scale)

	func _draw_portrait() -> void:
		var path := "res://assets/production/characters/male-base.png"
		if gender == "female":
			path = "res://assets/production/characters/female-base.png"
		var texture := _load_texture(path)
		if texture == null:
			var center := Vector2(size.x * 0.5, size.y * 0.58)
			var scale := minf(size.x / 92.0, size.y / 92.0)
			_draw_head(center + Vector2(0, 28) * scale, scale)
			return
		var rect := Rect2(Vector2(4, 4), size - Vector2(8, 8))
		var source := Rect2(28, 0, 136, 136)
		draw_texture_rect_region(texture, rect, source, Color.WHITE, false, true)

	func _draw_base_texture_preview() -> void:
		var path := "res://assets/production/characters/male-base.png"
		if gender == "female":
			path = "res://assets/production/characters/female-base.png"
		var texture := _load_texture(path)
		if texture == null:
			var center := Vector2(size.x * 0.5, size.y * 0.62)
			var scale := minf(size.x / 150.0, size.y / 145.0)
			_draw_shadow(center, scale)
			_draw_cape(center, scale)
			_draw_body(center, scale)
			_draw_armor(center, scale)
			_draw_head(center, scale)
			_draw_weapon(center, scale)
			return
		var target_height := size.y - 8.0
		var target_width := target_height * 0.66
		var x := (size.x - target_width) * 0.5
		draw_texture_rect(texture, Rect2(Vector2(x, 4), Vector2(target_width, target_height)), false)

	func _draw_state_frame(center: Vector2, scale: float) -> bool:
		var path := "res://assets/production/characters/states/%s-%s.png" % [gender, visual_state]
		var texture := _load_texture(path)
		if texture == null:
			return false
		draw_texture_rect(texture, Rect2(center + Vector2(-48, -88) * scale, Vector2(96, 144) * scale), false)
		return true

	func _draw_production_layers(center: Vector2, scale: float) -> bool:
		var body_path := "res://assets/production/characters/layers/male-body-front.png"
		if gender == "female":
			body_path = "res://assets/production/characters/layers/female-body-front.png"
		var body := _load_texture(body_path)
		if body == null:
			return false
		draw_ellipse(center + Vector2(0, 45 * scale), 34.0 * scale, 6.0 * scale, Color("#03060b", 0.38))
		var cloak := _load_texture("res://assets/production/equipment/blue-cloak-layer.png")
		if cloak != null:
			draw_texture_rect(cloak, Rect2(center + Vector2(-43, -62) * scale, Vector2(86, 96) * scale), false)
		draw_texture_rect(body, Rect2(center + Vector2(-48, -88) * scale, Vector2(96, 144) * scale), false)
		var armor_path := "res://assets/production/equipment/cloth-armor-layer-v2.png"
		if String(equipped.get("armor", "")) == "學徒長袍":
			armor_path = "res://assets/production/equipment/leather-armor-layer.png"
		var armor := _load_texture(armor_path)
		if armor != null:
			draw_texture_rect(armor, Rect2(center + Vector2(-46, -66) * scale, Vector2(92, 100) * scale), false)
		var weapon := _load_texture("res://assets/production/equipment/sword-layer-v2.png")
		if String(equipped.get("weapon", "")) == "橡木法杖":
			weapon = _load_texture("res://assets/production/equipment/staff-layer.png")
		if weapon != null:
			draw_texture_rect(weapon, Rect2(center + Vector2(18, -58) * scale, Vector2(72, 54) * scale), false)
		var headgear := _load_texture("res://assets/production/equipment/circlet-layer.png")
		if headgear != null:
			draw_texture_rect(headgear, Rect2(center + Vector2(-36, -102) * scale, Vector2(72, 36) * scale), false)
		return true

	func _load_texture(path: String) -> Texture2D:
		if ResourceLoader.exists(path):
			var resource := load(path)
			if resource is Texture2D:
				return resource as Texture2D
		var image := Image.load_from_file(ProjectSettings.globalize_path(path))
		if image == null or image.is_empty():
			return null
		if image.get_format() != Image.FORMAT_RGBA8:
			image.convert(Image.FORMAT_RGBA8)
		return ImageTexture.create_from_image(image)

	func _draw_shadow(center: Vector2, scale: float) -> void:
		draw_ellipse(center + Vector2(0, 38 * scale), 38.0 * scale, 7.0 * scale, Color("#03060b", 0.45))

	func _draw_cape(center: Vector2, scale: float) -> void:
		var cape_color := Color("#2c5b8e")
		if String(equipped.get("accessory", "")) == "紅色披肩":
			cape_color = Color("#9e3d50")
		draw_polygon(PackedVector2Array([
			center + Vector2(-32, -18) * scale,
			center + Vector2(-56, 34) * scale,
			center + Vector2(-28, 44) * scale,
			center + Vector2(0, 18) * scale,
			center + Vector2(28, 44) * scale,
			center + Vector2(56, 34) * scale,
			center + Vector2(32, -18) * scale,
		]), PackedColorArray([cape_color, cape_color.darkened(0.18), cape_color, cape_color, cape_color, cape_color.darkened(0.18), cape_color]))

	func _draw_body(center: Vector2, scale: float) -> void:
		var body_width := 30.0 if gender == "male" else 26.0
		draw_circle(center + Vector2(0, -57) * scale, 17 * scale, Color("#efd1a8"))
		draw_rect(Rect2(center + Vector2(-body_width, -37) * scale, Vector2(body_width * 2, 62) * scale), Color("#6a4632"))
		draw_line(center + Vector2(-16, 24) * scale, center + Vector2(-26, 48) * scale, Color("#232b36"), 8 * scale)
		draw_line(center + Vector2(16, 24) * scale, center + Vector2(26, 48) * scale, Color("#232b36"), 8 * scale)
		draw_line(center + Vector2(-26, -22) * scale, center + Vector2(-45, 10) * scale, Color("#efd1a8"), 7 * scale)
		draw_line(center + Vector2(26, -22) * scale, center + Vector2(45, 10) * scale, Color("#efd1a8"), 7 * scale)

	func _draw_armor(center: Vector2, scale: float) -> void:
		var armor := String(equipped.get("armor", "初心者外套"))
		var color := Color("#f1c35c")
		if armor == "學徒長袍":
			color = Color("#7a76d8")
		draw_polygon(PackedVector2Array([
			center + Vector2(-28, -38) * scale,
			center + Vector2(28, -38) * scale,
			center + Vector2(22, 22) * scale,
			center + Vector2(-22, 22) * scale,
		]), PackedColorArray([color.lightened(0.12), color.lightened(0.08), color.darkened(0.18), color.darkened(0.12)]))
		draw_rect(Rect2(center + Vector2(-24, -8) * scale, Vector2(48, 10) * scale), Color("#7bd7ff", 0.85))

	func _draw_head(center: Vector2, scale: float) -> void:
		var hair := Color("#1e2432") if gender == "male" else Color("#6b3a49")
		draw_arc(center + Vector2(0, -58) * scale, 20 * scale, PI * 0.92, TAU * 1.06, 24, hair, 8 * scale)
		if String(equipped.get("head", "")) == "羽飾髮夾":
			draw_line(center + Vector2(12, -74) * scale, center + Vector2(30, -92) * scale, Color("#f9f2bd"), 4 * scale)
			draw_line(center + Vector2(15, -71) * scale, center + Vector2(36, -80) * scale, Color("#8de7ff"), 3 * scale)
		else:
			draw_line(center + Vector2(-18, -65) * scale, center + Vector2(18, -65) * scale, Color("#8de7ff"), 4 * scale)

	func _draw_weapon(center: Vector2, scale: float) -> void:
		var weapon := String(equipped.get("weapon", "銅製短劍"))
		if weapon == "橡木法杖":
			draw_line(center + Vector2(46, 18) * scale, center + Vector2(70, -54) * scale, Color("#8b5e34"), 5 * scale)
			draw_circle(center + Vector2(72, -58) * scale, 10 * scale, Color("#8b78ff"))
			draw_circle(center + Vector2(72, -58) * scale, 5 * scale, Color("#7bd7ff"))
		else:
			draw_line(center + Vector2(38, 14) * scale, center + Vector2(70, -38) * scale, Color("#d7ecff"), 6 * scale)
			draw_line(center + Vector2(56, -12) * scale, center + Vector2(78, -46) * scale, Color("#7bd7ff"), 3 * scale)

	func _draw_accessory(center: Vector2, scale: float) -> void:
		if String(equipped.get("accessory", "")) == "星塵護符":
			draw_circle(center + Vector2(0, -8) * scale, 7 * scale, Color("#9e82ff"))
			draw_line(center + Vector2(0, -15) * scale, center + Vector2(0, -28) * scale, Color("#ffe38c"), 2 * scale)

class GameWorld:
	extends Node2D

	var background_texture: Texture2D
	var player_texture: Texture2D
	var chest_texture: Texture2D
	var male_texture: Texture2D
	var female_texture: Texture2D
	var male_state_textures: Dictionary = {}
	var female_state_textures: Dictionary = {}
	var male_animation_frames: Dictionary = {}
	var female_animation_frames: Dictionary = {}
	var slime_texture: Texture2D
	var boss_texture: Texture2D
	var sword_texture: Texture2D
	var slash_texture: Texture2D
	var home_composite_texture: Texture2D
	var page_composite_textures: Dictionary = {}
	var pack_composite_textures: Dictionary = {}
	var role_composite_textures: Dictionary = {}
	var market_composite_textures: Dictionary = {}
	var challenge_composite_textures: Dictionary = {}
	var guild_composite_textures: Dictionary = {}
	var system_composite_textures: Dictionary = {}
	var inventory_composite_textures: Dictionary = {}
	var skill_composite_textures: Dictionary = {}
	var shop_composite_textures: Dictionary = {}
	var quest_composite_textures: Dictionary = {}
	var ranking_composite_textures: Dictionary = {}
	var mail_composite_textures: Dictionary = {}
	var friends_composite_textures: Dictionary = {}
	var world_composite_textures: Dictionary = {}
	var account_composite_textures: Dictionary = {}
	var liveops_composite_textures: Dictionary = {}
	var page_textures: Dictionary = {}
	var t := 0.0
	var state := {}

	func _ready() -> void:
		home_composite_texture = _load_png_texture(HOME_COMPOSITE_PATH)
		for page_name in PAGE_COMPOSITE_PATHS.keys():
			page_composite_textures[page_name] = _load_png_texture(String(PAGE_COMPOSITE_PATHS[page_name]))
		for pack_view in PACK_COMPOSITE_PATHS.keys():
			pack_composite_textures[pack_view] = _load_png_texture(String(PACK_COMPOSITE_PATHS[pack_view]))
		for role_view in ROLE_COMPOSITE_PATHS.keys():
			role_composite_textures[role_view] = _load_png_texture(String(ROLE_COMPOSITE_PATHS[role_view]))
		for market_view in MARKET_COMPOSITE_PATHS.keys():
			market_composite_textures[market_view] = _load_png_texture(String(MARKET_COMPOSITE_PATHS[market_view]))
		for challenge_view in CHALLENGE_COMPOSITE_PATHS.keys():
			challenge_composite_textures[challenge_view] = _load_png_texture(String(CHALLENGE_COMPOSITE_PATHS[challenge_view]))
		for guild_view in GUILD_COMPOSITE_PATHS.keys():
			guild_composite_textures[guild_view] = _load_png_texture(String(GUILD_COMPOSITE_PATHS[guild_view]))
		for system_view in SYSTEM_COMPOSITE_PATHS.keys():
			system_composite_textures[system_view] = _load_png_texture(String(SYSTEM_COMPOSITE_PATHS[system_view]))
		for inventory_view in INVENTORY_COMPOSITE_PATHS.keys():
			inventory_composite_textures[inventory_view] = _load_png_texture(String(INVENTORY_COMPOSITE_PATHS[inventory_view]))
		for skill_view in SKILL_COMPOSITE_PATHS.keys():
			skill_composite_textures[skill_view] = _load_png_texture(String(SKILL_COMPOSITE_PATHS[skill_view]))
		for shop_view in SHOP_COMPOSITE_PATHS.keys():
			shop_composite_textures[shop_view] = _load_png_texture(String(SHOP_COMPOSITE_PATHS[shop_view]))
		for quest_view in QUEST_COMPOSITE_PATHS.keys():
			quest_composite_textures[quest_view] = _load_png_texture(String(QUEST_COMPOSITE_PATHS[quest_view]))
		for ranking_view in RANKING_COMPOSITE_PATHS.keys():
			ranking_composite_textures[ranking_view] = _load_png_texture(String(RANKING_COMPOSITE_PATHS[ranking_view]))
		for mail_view in MAIL_COMPOSITE_PATHS.keys():
			mail_composite_textures[mail_view] = _load_png_texture(String(MAIL_COMPOSITE_PATHS[mail_view]))
		for friends_view in FRIENDS_COMPOSITE_PATHS.keys():
			friends_composite_textures[friends_view] = _load_png_texture(String(FRIENDS_COMPOSITE_PATHS[friends_view]))
		for world_view in WORLD_COMPOSITE_PATHS.keys():
			world_composite_textures[world_view] = _load_png_texture(String(WORLD_COMPOSITE_PATHS[world_view]))
		for account_view in ACCOUNT_COMPOSITE_PATHS.keys():
			account_composite_textures[account_view] = _load_png_texture(String(ACCOUNT_COMPOSITE_PATHS[account_view]))
		for liveops_view in LIVEOPS_COMPOSITE_PATHS.keys():
			liveops_composite_textures[liveops_view] = _load_png_texture(String(LIVEOPS_COMPOSITE_PATHS[liveops_view]))
		background_texture = _load_png_texture("res://assets/production/backgrounds/home-field.png")
		player_texture = _load_png_texture("res://assets/production/characters/male-base.png")
		chest_texture = _load_png_texture("res://assets/production/icons/pack-sealed.png")
		male_texture = _load_png_texture("res://assets/production/characters/male-base.png")
		female_texture = _load_png_texture("res://assets/production/characters/female-base.png")
		male_state_textures = {
			"idle": _load_png_texture("res://assets/production/characters/states/male-idle.png"),
			"combat": _load_png_texture("res://assets/production/characters/states/male-combat.png"),
			"hit": _load_png_texture("res://assets/production/characters/states/male-hit.png"),
			"reward": _load_png_texture("res://assets/production/characters/states/male-reward.png"),
		}
		female_state_textures = {
			"idle": _load_png_texture("res://assets/production/characters/states/female-idle.png"),
			"combat": _load_png_texture("res://assets/production/characters/states/female-combat.png"),
			"hit": _load_png_texture("res://assets/production/characters/states/female-hit.png"),
			"reward": _load_png_texture("res://assets/production/characters/states/female-reward.png"),
		}
		male_animation_frames = _load_character_animation_set("male")
		female_animation_frames = _load_character_animation_set("female")
		slime_texture = _load_png_texture("res://assets/production/monsters/slime-v2.png")
		boss_texture = _load_png_texture("res://assets/production/monsters/crystal-golem.png")
		sword_texture = _load_png_texture("res://assets/production/equipment/sword-layer.png")
		slash_texture = _load_png_texture("res://assets/production/vfx/sword-slash.png")
		page_textures = {
			"packs": _load_png_texture("res://assets/production/backgrounds/pack-page.png"),
			"market": _load_png_texture("res://assets/production/backgrounds/market-page.png"),
			"challenge": _load_png_texture("res://assets/production/backgrounds/challenge-page.png"),
			"role": _load_png_texture("res://assets/production/backgrounds/role-page.png"),
			"inventory": _load_png_texture("res://assets/production/backgrounds/inventory-page.png"),
			"skills": _load_png_texture("res://assets/production/backgrounds/skill-page.png"),
		}

	func set_state(next_state: Dictionary) -> void:
		state = next_state.duplicate(true)
		queue_redraw()

	func tick(delta: float) -> void:
		t += delta
		queue_redraw()

	func _draw() -> void:
		_draw_background()
		if _using_page_composite():
			return
		_draw_pack_stage()
		_draw_party()
		_draw_equipment_slots()
		_draw_enemy_target()
		_draw_market_or_boss()
		_draw_floaters()

	func _draw_background() -> void:
		draw_rect(Rect2(Vector2.ZERO, VIEWPORT_SIZE), Color("#070b12"))
		var page := String(state.get("active_page", "home"))
		var composite_texture: Texture2D = _current_composite_texture()
		if composite_texture != null:
			draw_texture_rect(composite_texture, Rect2(Vector2.ZERO, VIEWPORT_SIZE), false)
			return
		var page_texture: Texture2D = page_textures.get(page, null)
		if page != "home" and page_texture != null:
			draw_texture_rect(page_texture, Rect2(Vector2.ZERO, VIEWPORT_SIZE), false)
		elif background_texture != null:
			draw_texture_rect(background_texture, HOME_STAGE_RECT, false)
		else:
			draw_rect(Rect2(Vector2.ZERO, VIEWPORT_SIZE), Color("#090d16"))
			draw_rect(HOME_STAGE_RECT, Color("#111a2a"))
		if page == "home":
			draw_rect(HOME_STAGE_SHADE_RECT, Color("#101722", 0.56))
			draw_line(HOME_STAGE_SHADE_RECT.position, HOME_STAGE_SHADE_RECT.position + Vector2(HOME_STAGE_SHADE_RECT.size.x, 0), Color("#5c719a", 0.58), 2)
			draw_line(Vector2(0, HOME_STAGE_SHADE_RECT.end.y), Vector2(VIEWPORT_SIZE.x, HOME_STAGE_SHADE_RECT.end.y), Color("#253249", 0.82), 2)

	func _using_home_composite() -> bool:
		return String(state.get("active_page", "home")) == "home" and home_composite_texture != null

	func _using_page_composite() -> bool:
		return _current_composite_texture() != null

	func _current_composite_texture() -> Texture2D:
		var page := String(state.get("active_page", "home"))
		if page == "packs":
			var pack_view := String(state.get("pack_view", "main"))
			var pack_texture: Variant = pack_composite_textures.get(pack_view, null)
			if pack_texture is Texture2D:
				return pack_texture as Texture2D
		if page == "role":
			var role_view := String(state.get("role_view", "main"))
			var role_texture: Variant = role_composite_textures.get(role_view, null)
			if role_texture is Texture2D:
				return role_texture as Texture2D
		if page == "market":
			var market_view := String(state.get("market_view", "main"))
			var market_texture: Variant = market_composite_textures.get(market_view, null)
			if market_texture is Texture2D:
				return market_texture as Texture2D
		if page == "challenge":
			var challenge_view := String(state.get("challenge_view", "main"))
			var challenge_texture: Variant = challenge_composite_textures.get(challenge_view, null)
			if challenge_texture is Texture2D:
				return challenge_texture as Texture2D
		if page == "guild":
			var guild_view := String(state.get("guild_view", "main"))
			var guild_texture: Variant = guild_composite_textures.get(guild_view, null)
			if guild_texture is Texture2D:
				return guild_texture as Texture2D
		if page == "system":
			var system_view := String(state.get("system_view", "main"))
			var system_texture: Variant = system_composite_textures.get(system_view, null)
			if system_texture is Texture2D:
				return system_texture as Texture2D
		if page == "inventory":
			var inventory_view := String(state.get("inventory_view", "main"))
			var inventory_texture: Variant = inventory_composite_textures.get(inventory_view, null)
			if inventory_texture is Texture2D:
				return inventory_texture as Texture2D
		if page == "skills":
			var skill_view := String(state.get("skill_view", "main"))
			var skill_texture: Variant = skill_composite_textures.get(skill_view, null)
			if skill_texture is Texture2D:
				return skill_texture as Texture2D
		if page == "shop":
			var shop_view := String(state.get("shop_view", "main"))
			var shop_texture: Variant = shop_composite_textures.get(shop_view, null)
			if shop_texture is Texture2D:
				return shop_texture as Texture2D
		if page == "quests":
			var quest_view := String(state.get("quest_view", "main"))
			var quest_texture: Variant = quest_composite_textures.get(quest_view, null)
			if quest_texture is Texture2D:
				return quest_texture as Texture2D
		if page == "ranking":
			var ranking_view := String(state.get("ranking_view", "main"))
			var ranking_texture: Variant = ranking_composite_textures.get(ranking_view, null)
			if ranking_texture is Texture2D:
				return ranking_texture as Texture2D
		if page == "mail":
			var mail_view := String(state.get("mail_view", "main"))
			var mail_texture: Variant = mail_composite_textures.get(mail_view, null)
			if mail_texture is Texture2D:
				return mail_texture as Texture2D
		if page == "friends":
			var friends_view := String(state.get("friends_view", "main"))
			var friends_texture: Variant = friends_composite_textures.get(friends_view, null)
			if friends_texture is Texture2D:
				return friends_texture as Texture2D
		if page == "world":
			var world_view := String(state.get("world_view", "main"))
			var world_texture: Variant = world_composite_textures.get(world_view, null)
			if world_texture is Texture2D:
				return world_texture as Texture2D
		if page == "account":
			var account_view := String(state.get("account_view", "main"))
			var account_texture: Variant = account_composite_textures.get(account_view, null)
			if account_texture is Texture2D:
				return account_texture as Texture2D
		if page == "liveops":
			var liveops_view := String(state.get("liveops_view", "main"))
			var liveops_texture: Variant = liveops_composite_textures.get(liveops_view, null)
			if liveops_texture is Texture2D:
				return liveops_texture as Texture2D
		var page_texture: Variant = page_composite_textures.get(page, null)
		if page_texture is Texture2D:
			return page_texture as Texture2D
		return null

	func _draw_pack_stage() -> void:
		return
		var page := String(state.get("active_page", "home"))
		if page != "packs" and page != "market":
			return
		var font: Font = ThemeDB.fallback_font
		draw_string(font, Vector2(296, 166), "戰力 %d" % int(state.get("party_power", 2160)), HORIZONTAL_ALIGNMENT_LEFT, 118, 16, Color("#72ffb3"))
		var cx := 338.0
		var cy := 346.0 + sin(t * 2.0) * 2.0
		draw_ellipse(Vector2(cx, cy + 38), 46.0, 8.0, Color("#05070c", 0.44))
		if chest_texture != null:
			draw_texture_rect(chest_texture, Rect2(cx - 42, cy - 34, 84, 68), false)
		else:
			draw_rect(Rect2(cx - 32, cy - 24, 64, 44), Color("#6d4632"))
			draw_rect(Rect2(cx - 32, cy - 24, 64, 44), Color("#eac46e"), false, 3)
			draw_rect(Rect2(cx - 7, cy - 36, 14, 56), Color("#f4cf6f"))
			draw_circle(Vector2(cx, cy - 2), 10, Color("#7bdcff", 0.85))
		draw_string(font, Vector2(cx - 50, cy + 62), String(state.get("pack_focus", "LP-2048")), HORIZONTAL_ALIGNMENT_CENTER, 100, 13, Color("#ffea99"))

	func _draw_party() -> void:
		if String(state.get("active_page", "home")) != "home":
			return
		_draw_player_body()

	func _draw_equipment_slots() -> void:
		return
		var slots := [
			{"slot": "weapon", "pos": Vector2(30, 286), "icon": "sword"},
			{"slot": "head", "pos": Vector2(30, 404), "icon": "head"},
			{"slot": "armor", "pos": Vector2(356, 286), "icon": "armor"},
			{"slot": "accessory", "pos": Vector2(356, 404), "icon": "charm"},
		]
		for slot_data in slots:
			var pos := Vector2(slot_data["pos"])
			var rect := Rect2(pos, Vector2(46, 46))
			draw_rect(rect, Color("#111925", 0.88))
			draw_rect(rect, Color("#65d6ff", 0.72), false, 2)
			_draw_equipment_icon(rect.position + Vector2(23, 23), String(slot_data["icon"]))

	func _draw_equipment_icon(center: Vector2, icon: String) -> void:
		match icon:
			"sword":
				draw_line(center + Vector2(-10, 13), center + Vector2(13, -14), Color("#e9f7ff"), 5)
				draw_line(center + Vector2(4, -5), center + Vector2(17, -18), Color("#7bd7ff"), 2)
				draw_line(center + Vector2(-12, 7), center + Vector2(4, 20), Color("#f1c35c"), 3)
			"head":
				draw_arc(center, 16, PI * 1.05, TAU * 1.15, 24, Color("#7bd7ff"), 4)
				draw_line(center + Vector2(-14, -2), center + Vector2(14, -2), Color("#f1c35c"), 3)
			"armor":
				draw_polygon(PackedVector2Array([
					center + Vector2(-15, -16),
					center + Vector2(15, -16),
					center + Vector2(11, 18),
					center + Vector2(-11, 18),
				]), PackedColorArray([Color("#f1c35c"), Color("#ffe38c"), Color("#b8863d"), Color("#d09b45")]))
				draw_rect(Rect2(center + Vector2(-13, -1), Vector2(26, 6)), Color("#7bd7ff"))
			"charm":
				draw_circle(center, 11, Color("#9e82ff"))
				draw_circle(center, 5, Color("#ffe38c"))
				draw_line(center + Vector2(0, -12), center + Vector2(0, -21), Color("#ffe38c"), 2)

	func _draw_enemy_target() -> void:
		if String(state.get("active_page", "home")) != "home":
			return
		var target_name := String(state.get("target_name", "丘陵史萊姆"))
		var hp := float(state.get("target_hp", 110)) / maxf(1.0, float(state.get("target_max_hp", 283)))
		var base := HOME_ENEMY_BASE
		draw_ellipse(base + Vector2(0, 22), 30.0, 7.0, Color("#03060b", 0.45))
		if slime_texture != null:
			draw_texture_rect(slime_texture, Rect2(base + Vector2(-42, -36), Vector2(84, 58)), false)
		else:
			draw_circle(base + Vector2(0, 0), 23, Color("#5acb86"))
			draw_circle(base + Vector2(-8, -5), 5, Color("#eaffff"))
			draw_circle(base + Vector2(8, -5), 5, Color("#eaffff"))
			draw_circle(base + Vector2(-8, -5), 2, Color("#26384c"))
			draw_circle(base + Vector2(8, -5), 2, Color("#26384c"))
			draw_arc(base + Vector2(0, 3), 10, 0.15, PI - 0.15, 16, Color("#26384c"), 2)
		draw_rect(Rect2(base + Vector2(-31, 27), Vector2(62, 6)), Color("#32151b"))
		draw_rect(Rect2(base + Vector2(-31, 27), Vector2(62 * hp, 6)), Color("#ff6d7d"))
		draw_string(ThemeDB.fallback_font, base + Vector2(-50, 49), target_name, HORIZONTAL_ALIGNMENT_CENTER, 100, 11, Color("#eaf4ff"))

	func _draw_player_body() -> void:
		var base := HOME_PLAYER_BASE
		_draw_paper_doll_world(base, String(state.get("gender", "male")), Dictionary(state.get("equipped", {})), HOME_PLAYER_SIZE)
		return
		draw_ellipse(base + Vector2(0, 54), 52.0, 10.0, Color("#03060b", 0.58))
		draw_polygon(PackedVector2Array([
			base + Vector2(-58, -8),
			base + Vector2(-24, -48),
			base + Vector2(18, -42),
			base + Vector2(54, -2),
			base + Vector2(36, 62),
			base + Vector2(-36, 62),
		]), PackedColorArray([
			Color("#21324d"),
			Color("#2a4773"),
			Color("#24385c"),
			Color("#1b2a42"),
			Color("#101925"),
			Color("#111a2b"),
		]))
		draw_polygon(PackedVector2Array([
			base + Vector2(-22, -36),
			base + Vector2(22, -36),
			base + Vector2(34, 42),
			base + Vector2(-34, 42),
		]), PackedColorArray([
			Color("#e6c16f"),
			Color("#f3d980"),
			Color("#5d3a2e"),
			Color("#6c4634"),
		]))
		draw_rect(Rect2(base + Vector2(-26, -16), Vector2(52, 12)), Color("#83e0ff", 0.86))
		draw_circle(base + Vector2(0, -62), 22, Color("#d8c3a4"))
		draw_arc(base + Vector2(0, -62), 24, PI * 0.9, TAU * 1.08, 24, Color("#171b2a"), 8)
		draw_line(base + Vector2(-42, 20), base + Vector2(-72, 62), Color("#ffe17d"), 5)
		draw_line(base + Vector2(-72, 62), base + Vector2(-58, 70), Color("#83e0ff"), 3)
		draw_line(base + Vector2(42, 18), base + Vector2(76, -42), Color("#cfe6ff"), 4)
		draw_line(base + Vector2(58, -18), base + Vector2(88, -50), Color("#83e0ff"), 2)

	func _draw_paper_doll_world(base: Vector2, gender: String, equipped: Dictionary, target_size: Vector2 = Vector2(192, 288)) -> void:
		var character_texture := male_texture
		var state_textures := male_state_textures
		var animation_frames := male_animation_frames
		if gender == "female":
			character_texture = female_texture
			state_textures = female_state_textures
			animation_frames = female_animation_frames
		var dest := Rect2(base + Vector2(-target_size.x * 0.5, -target_size.y * 0.78), target_size)
		draw_ellipse(base + Vector2(0, target_size.y * 0.28), target_size.x * 0.25, target_size.y * 0.035, Color("#03060b", 0.45))
		var animation_name := _current_animation_name()
		var use_stable_home_pose := String(state.get("active_page", "home")) == "home"
		var frames: Array = animation_frames.get(animation_name, [])
		if not use_stable_home_pose and frames.size() > 0:
			var frame_index := int(floor(fmod(t * 7.0, float(frames.size()))))
			var animation_texture: Texture2D = frames[frame_index]
			if animation_texture != null:
				draw_texture_rect(animation_texture, dest, false)
				return
		var visual_state := _current_visual_state(animation_name)
		if use_stable_home_pose:
			if character_texture != null:
				draw_texture_rect(character_texture, dest, false)
				return
			visual_state = "idle"
		var state_texture: Texture2D = state_textures.get(visual_state, null)
		if state_texture != null:
			draw_texture_rect(state_texture, dest, false)
			return
		if character_texture != null:
			draw_texture_rect(character_texture, dest, false)
			if sword_texture != null and String(equipped.get("weapon", "")) != "":
				draw_texture_rect(sword_texture, Rect2(base + Vector2(target_size.x * 0.12, -target_size.y * 0.48), Vector2(target_size.x * 0.46, target_size.y * 0.23)), false)
			return
		var cape_color := Color("#2c5b8e")
		if String(equipped.get("accessory", "")) == "紅色披肩":
			cape_color = Color("#9e3d50")
		draw_ellipse(base + Vector2(0, 54), 58.0, 12.0, Color("#03060b", 0.50))
		draw_polygon(PackedVector2Array([
			base + Vector2(-52, -6),
			base + Vector2(-88, 70),
			base + Vector2(-36, 88),
			base + Vector2(0, 32),
			base + Vector2(36, 88),
			base + Vector2(88, 70),
			base + Vector2(52, -6),
		]), PackedColorArray([cape_color, cape_color.darkened(0.2), cape_color, cape_color, cape_color, cape_color.darkened(0.2), cape_color]))
		var body_width := 34.0 if gender == "male" else 30.0
		draw_circle(base + Vector2(0, -76), 24, Color("#efd1a8"))
		var armor := String(equipped.get("armor", "初心者外套"))
		var armor_color := Color("#f1c35c")
		if armor == "學徒長袍":
			armor_color = Color("#7a76d8")
		draw_polygon(PackedVector2Array([
			base + Vector2(-body_width, -52),
			base + Vector2(body_width, -52),
			base + Vector2(30, 44),
			base + Vector2(-30, 44),
		]), PackedColorArray([armor_color.lightened(0.12), armor_color.lightened(0.04), armor_color.darkened(0.20), armor_color.darkened(0.12)]))
		draw_rect(Rect2(base + Vector2(-30, -12), Vector2(60, 14)), Color("#7bd7ff", 0.85))
		draw_line(base + Vector2(-18, 40), base + Vector2(-30, 82), Color("#232b36"), 10)
		draw_line(base + Vector2(18, 40), base + Vector2(30, 82), Color("#232b36"), 10)
		var hair := Color("#1e2432") if gender == "male" else Color("#6b3a49")
		draw_arc(base + Vector2(0, -78), 28, PI * 0.92, TAU * 1.06, 24, hair, 11)
		if String(equipped.get("head", "")) == "羽飾髮夾":
			draw_line(base + Vector2(16, -96), base + Vector2(42, -122), Color("#f9f2bd"), 5)
			draw_line(base + Vector2(20, -92), base + Vector2(50, -106), Color("#8de7ff"), 4)
		else:
			draw_line(base + Vector2(-24, -88), base + Vector2(24, -88), Color("#8de7ff"), 5)
		if String(equipped.get("weapon", "")) == "橡木法杖":
			draw_line(base + Vector2(48, 24), base + Vector2(84, -74), Color("#8b5e34"), 7)
			draw_circle(base + Vector2(88, -82), 13, Color("#8b78ff"))
			draw_circle(base + Vector2(88, -82), 6, Color("#7bd7ff"))
		else:
			draw_line(base + Vector2(48, 18), base + Vector2(86, -56), Color("#d7ecff"), 7)
			draw_line(base + Vector2(66, -24), base + Vector2(96, -66), Color("#7bd7ff"), 4)
		if String(equipped.get("accessory", "")) == "星塵護符":
			draw_circle(base + Vector2(0, -12), 8, Color("#9e82ff"))
			draw_line(base + Vector2(0, -20), base + Vector2(0, -38), Color("#ffe38c"), 3)

	func _current_animation_name() -> String:
		var phase := fmod(t, 9.6)
		if phase < 2.0:
			return "walk"
		if phase < 3.4:
			return "cast"
		if phase < 4.6:
			return "combat"
		if phase < 5.2:
			return "hit"
		if phase < 7.0:
			return "loot"
		if phase < 8.0:
			return "reward"
		if phase < 8.7:
			return "death"
		return "idle"

	func _current_visual_state(animation_name: String) -> String:
		match animation_name:
			"cast", "combat":
				return "combat"
			"hit", "death":
				return "hit"
			"loot", "reward":
				return "reward"
			_:
				return "idle"

	func _load_character_animation_set(gender: String) -> Dictionary:
		var animations := {}
		for animation_name in ["walk", "cast", "death", "loot"]:
			var frames: Array[Texture2D] = []
			for frame_index in range(1, 5):
				var path := "res://assets/production/characters/animations/%s-%s-%d.png" % [gender, animation_name, frame_index]
				var texture := _load_png_texture(path)
				if texture != null:
					frames.append(texture)
			animations[animation_name] = frames
		return animations

	func _draw_market_or_boss() -> void:
		return
		var page := String(state.get("active_page", "home"))
		if page == "challenge":
			var hp := float(state.get("boss_hp", 68)) / 100.0
			if boss_texture != null:
				draw_texture_rect(boss_texture, Rect2(278, 226, 128, 110), false)
			else:
				draw_circle(Vector2(332, 316), 26, Color("#56374b"))
			draw_rect(Rect2(292, 350, 80, 8), Color("#3a1720"))
			draw_rect(Rect2(292, 350, 80.0 * hp, 8), Color("#ff5d76"))
			draw_string(ThemeDB.fallback_font, Vector2(286, 378), "Boss挑戰", HORIZONTAL_ALIGNMENT_LEFT, 110, 16, Color("#ffb0c0"))
		elif page == "market":
			draw_rect(Rect2(286, 286, 82, 56), Color("#1f3340"))
			draw_rect(Rect2(286, 286, 82, 56), Color("#82d9ff"), false, 3)
			draw_string(ThemeDB.fallback_font, Vector2(292, 320), "交易場", HORIZONTAL_ALIGNMENT_LEFT, 80, 16, Color("#9de8ff"))

	func _draw_floaters() -> void:
		if String(state.get("active_page", "home")) != "home":
			return
		if slash_texture != null:
			draw_texture_rect(slash_texture, Rect2(252, 456, 78, 58), false)

	func _pack_status_label(status: String) -> String:
		match status:
			"ISSUED":
				return "系統建立"
			"OWNED":
				return "玩家持有"
			"LISTED":
				return "交易場上架中"
			"TRADE_LOCKED":
				return "交易鎖定中"
			"TRADED":
				return "交易完成"
			"COOLDOWN":
				return "冷卻等待"
			"OPENED":
				return "已開啟"
			"BURNED":
				return "已消耗"
			"FROZEN":
				return "暫時鎖定"
			_:
				return status

	func _load_png_texture(path: String) -> Texture2D:
		if ResourceLoader.exists(path):
			var resource := load(path)
			if resource is Texture2D:
				return resource as Texture2D
		var image := Image.load_from_file(ProjectSettings.globalize_path(path))
		if image == null or image.is_empty():
			return null
		if image.get_format() != Image.FORMAT_RGBA8:
			image.convert(Image.FORMAT_RGBA8)
		return ImageTexture.create_from_image(image)
