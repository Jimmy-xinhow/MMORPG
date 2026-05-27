class_name ChallengeGuildSystemStateBinder
extends RefCounted

func live_challenge_rows(game_state: Dictionary, boss_rows: Array) -> Array[Array]:
	var rows: Array[Array] = []
	rows.append([
		"Boss挑戰",
		"HP %d%%" % int(game_state.get("boss_hp", 0)),
		"戰力 %d" % int(game_state.get("party_power", 0)),
	])
	rows.append([
		"挑戰票",
		"x%d" % int(game_state.get("tickets", 0)),
		"可進入 Boss",
	])
	for i in range(1, boss_rows.size()):
		rows.append(_normalized_row(Array(boss_rows[i])))
	return rows

func challenge_visual_cards(game_state: Dictionary, boss_rows: Array) -> Array[Dictionary]:
	var live_rows: Array[Array] = live_challenge_rows(game_state, boss_rows)
	return [
		{"art": "boss", "title": String(live_rows[0][0]), "body": String(live_rows[0][1])},
		{"art": "guild", "title": String(game_state.get("guild_name", "Guild")), "body": "戰力 %d" % int(game_state.get("party_power", 0))},
		{"art": "ticket", "title": String(live_rows[1][0]), "body": String(live_rows[1][1])},
		{"art": "season", "title": "挑戰紀錄", "body": "Boss HP %d%%" % int(game_state.get("boss_hp", 0))},
	]

func sync_challenge_state(game_state: Dictionary, boss_rows: Array) -> void:
	var rows: Array[Array] = live_challenge_rows(game_state, boss_rows)
	boss_rows.clear()
	for row in rows:
		boss_rows.append(row)

func guild_visual_cards(game_state: Dictionary) -> Array[Dictionary]:
	return [
		{"art": "guild", "title": String(game_state.get("guild_name", "Guild")), "body": "戰力 %d" % int(game_state.get("party_power", 0))},
		{"art": "boss", "title": "公會 Boss", "body": "Boss HP %d%%" % int(game_state.get("boss_hp", 0))},
		{"art": "ticket", "title": "公會任務", "body": "貢獻 %d" % int(game_state.get("guild_contribution", 0))},
		{"art": "rare", "title": "公會獎勵", "body": "GC %d" % int(game_state.get("gc", 0))},
	]

func live_guild_rows(game_state: Dictionary) -> Array[Array]:
	return [
		[String(game_state.get("guild_name", "Guild")), "主公會 / 戰力 %d" % int(game_state.get("party_power", 0))],
		["公會貢獻", "%d / 今日" % int(game_state.get("guild_contribution", 0))],
		["公會 Boss", "HP %d%% / GC %d" % [int(game_state.get("boss_hp", 0)), int(game_state.get("gc", 0))]],
	]

func sync_guild_donation(game_state: Dictionary) -> void:
	game_state["guild_contribution"] = int(game_state.get("guild_contribution", 0)) + 50

func sync_guild_boss(game_state: Dictionary) -> void:
	game_state["guild_contribution"] = int(game_state.get("guild_contribution", 0)) + 12

func system_visual_cards(game_state: Dictionary) -> Array[Dictionary]:
	var notifications: String = "ON" if bool(game_state.get("system_notifications_enabled", true)) else "OFF"
	return [
		{"art": "skill", "title": "音效設定", "body": "BGM 70% / SFX 80%"},
		{"art": "crystal", "title": "畫面設定", "body": "60 FPS"},
		{"art": "listing", "title": "通知設定", "body": notifications},
		{"art": "open", "title": "帳號設定", "body": String(game_state.get("simulated_payment", "SIMULATED_APPROVED"))},
	]

func live_system_rows(game_state: Dictionary) -> Array[Array]:
	var notifications: String = "ON" if bool(game_state.get("system_notifications_enabled", true)) else "OFF"
	return [
		["音效", "BGM 70% / SFX 80%"],
		["通知", notifications],
		["付款模擬", String(game_state.get("simulated_payment", "SIMULATED_APPROVED"))],
	]

func sync_system_toggle(game_state: Dictionary) -> void:
	game_state["system_notifications_enabled"] = not bool(game_state.get("system_notifications_enabled", true))

func _normalized_row(row: Array) -> Array:
	var title: String = "" if row.size() < 1 else String(row[0])
	var body: String = "" if row.size() < 2 else String(row[1])
	var meta: String = "" if row.size() < 3 else String(row[2])
	return [title, body, meta]
