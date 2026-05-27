class_name PlayerStateMapper
extends RefCounted

func apply_payload(
	payload: Dictionary,
	game_state: Dictionary,
	paper_dolls: Array,
	inventory_items: Array,
	skill_rows: Array,
	pack_cards: Array
) -> Array[String]:
	var event_messages: Array[String] = []
	var player := Dictionary(payload.get("player", {}))
	var balances := Dictionary(payload.get("balances", {}))
	var tickets := Dictionary(payload.get("tickets", {}))
	var packs := Array(payload.get("packs", []))
	var session := Dictionary(payload.get("tradingSession", {}))
	var character := Dictionary(payload.get("character", {}))
	var inventory := Array(payload.get("inventory", []))
	var skills := Array(payload.get("skills", []))
	var combat := Dictionary(payload.get("combat", {}))

	_apply_player(player, game_state)
	_apply_balances(balances, game_state)
	_apply_tickets(tickets, game_state)
	_apply_session(session, game_state)
	_apply_character(character, game_state, paper_dolls)
	_apply_inventory(inventory, inventory_items)
	_apply_skills(skills, skill_rows)
	_apply_combat(combat, game_state, event_messages)
	_apply_packs(packs, game_state, pack_cards)

	event_messages.append("後端玩家狀態已同步。")
	return event_messages

func _apply_player(player: Dictionary, game_state: Dictionary) -> void:
	if player.has("name"):
		game_state["player_name"] = String(player["name"])
	if player.has("level"):
		game_state["level"] = int(player["level"])
	if player.has("exp"):
		game_state["exp"] = int(player["exp"])
	if player.has("region"):
		game_state["region"] = String(player["region"])
	if player.has("partyPower"):
		game_state["party_power"] = int(player["partyPower"])

func _apply_balances(balances: Dictionary, game_state: Dictionary) -> void:
	if balances.has("gc"):
		game_state["gc"] = int(balances["gc"])

func _apply_tickets(tickets: Dictionary, game_state: Dictionary) -> void:
	if tickets.has("active"):
		game_state["tickets"] = int(tickets["active"])

func _apply_session(session: Dictionary, game_state: Dictionary) -> void:
	if session.has("status"):
		game_state["session"] = "交易場%s" % _session_status_label(String(session["status"]))

func _apply_character(character: Dictionary, game_state: Dictionary, paper_dolls: Array) -> void:
	if character.has("gender"):
		game_state["gender"] = String(character["gender"])
	if not character.has("equipment"):
		return
	var equipment_payload := Dictionary(character["equipment"])
	var equipped := Dictionary(game_state["equipped"])
	for slot in ["weapon", "armor", "head", "accessory"]:
		if equipment_payload.has(slot):
			var item := Dictionary(equipment_payload[slot])
			equipped[slot] = String(item.get("name", equipped.get(slot, "")))
	game_state["equipped"] = equipped
	if paper_dolls.size() > 0:
		paper_dolls[0]["equipped"] = equipped.duplicate(true)

func _apply_inventory(inventory: Array, inventory_items: Array) -> void:
	if inventory.is_empty():
		return
	inventory_items.clear()
	for item_value in inventory:
		var item := Dictionary(item_value)
		inventory_items.append({
			"name": String(item.get("name", "")),
			"type": String(item.get("type", "")),
			"rarity": String(item.get("rarity", "")),
			"qty": int(item.get("quantity", 1)),
		})

func _apply_skills(skills: Array, skill_rows: Array) -> void:
	if skills.is_empty():
		return
	skill_rows.clear()
	for skill_value in skills:
		var skill := Dictionary(skill_value)
		skill_rows.append([
			String(skill.get("name", "")),
			"Lv.%d" % int(skill.get("level", 1)),
			"升級 %d GC" % int(skill.get("nextCostGc", 0)),
		])

func _apply_combat(combat: Dictionary, game_state: Dictionary, event_messages: Array[String]) -> void:
	if combat.has("areaName"):
		game_state["region"] = String(combat["areaName"])
	if combat.has("target"):
		var target := Dictionary(combat["target"])
		game_state["target_name"] = String(target.get("name", ""))
		game_state["target_hp"] = int(target.get("hp", 0))
		game_state["target_max_hp"] = int(target.get("maxHp", 1))
	if combat.has("log"):
		var logs := Array(combat["log"])
		for i in range(logs.size() - 1, -1, -1):
			event_messages.append(String(logs[i]))

func _apply_packs(packs: Array, game_state: Dictionary, pack_cards: Array) -> void:
	if packs.is_empty():
		return
	var first_pack := Dictionary(packs[0])
	game_state["pack_focus"] = String(first_pack.get("id", game_state["pack_focus"]))
	game_state["pack_status"] = String(first_pack.get("status", game_state["pack_status"]))
	game_state["pack_price"] = int(first_pack.get("currentPrice", game_state["pack_price"]))
	game_state["trade_count"] = int(first_pack.get("tradeCount", game_state["trade_count"]))
	pack_cards.clear()
	for pack_value in packs:
		var pack := Dictionary(pack_value)
		pack_cards.append({
			"id": String(pack.get("id", "")),
			"status": String(pack.get("status", "OWNED")),
			"price": int(pack.get("currentPrice", 100)),
			"trades": int(pack.get("tradeCount", 0)),
			"result": "後端同步",
		})

func _session_status_label(status: String) -> String:
	match status:
		"OPEN":
			return "開放中"
		"SCHEDULED":
			return "準備中"
		"CLOSED":
			return "已關閉"
		_:
			return status
