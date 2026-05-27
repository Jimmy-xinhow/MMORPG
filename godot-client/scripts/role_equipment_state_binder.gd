class_name RoleEquipmentStateBinder
extends RefCounted

const EQUIPMENT_SLOTS: Array[String] = ["weapon", "armor", "head", "accessory"]

func live_role_state(game_state: Dictionary, paper_dolls: Array) -> Dictionary:
	var equipped: Dictionary = _normalized_equipment(Dictionary(game_state.get("equipped", {})))
	var active_doll: Dictionary = _active_paper_doll(game_state, paper_dolls, equipped)
	var live_dolls: Array[Dictionary] = [active_doll]

	for i in range(1, paper_dolls.size()):
		live_dolls.append(_normalized_doll(Dictionary(paper_dolls[i])))

	return {
		"player_name": String(game_state.get("player_name", active_doll.get("name", ""))),
		"gender": String(game_state.get("gender", active_doll.get("gender", "male"))),
		"equipped": equipped,
		"active_doll": active_doll,
		"paper_dolls": live_dolls,
	}

func sync_active_paper_doll(game_state: Dictionary, paper_dolls: Array) -> void:
	var equipped: Dictionary = _normalized_equipment(Dictionary(game_state.get("equipped", {})))
	var active_doll: Dictionary = _active_paper_doll(game_state, paper_dolls, equipped)
	if paper_dolls.is_empty():
		paper_dolls.append(active_doll)
	else:
		paper_dolls[0] = active_doll
	game_state["equipped"] = equipped

func apply_equipment_set(
	game_state: Dictionary,
	paper_dolls: Array,
	equipment: Dictionary,
	gender: String,
	player_name: String
) -> void:
	game_state["equipped"] = _normalized_equipment(equipment)
	game_state["gender"] = gender
	game_state["player_name"] = player_name
	sync_active_paper_doll(game_state, paper_dolls)

func apply_accessory(game_state: Dictionary, paper_dolls: Array, accessory: String) -> void:
	var equipped: Dictionary = _normalized_equipment(Dictionary(game_state.get("equipped", {})))
	equipped["accessory"] = accessory
	game_state["equipped"] = equipped
	sync_active_paper_doll(game_state, paper_dolls)

func _active_paper_doll(game_state: Dictionary, paper_dolls: Array, equipped: Dictionary) -> Dictionary:
	var active_doll: Dictionary = _normalized_doll({} if paper_dolls.is_empty() else Dictionary(paper_dolls[0]))
	active_doll["name"] = String(game_state.get("player_name", active_doll.get("name", "")))
	active_doll["gender"] = String(game_state.get("gender", active_doll.get("gender", "male")))
	active_doll["equipped"] = equipped.duplicate(true)
	return active_doll

func _normalized_doll(doll: Dictionary) -> Dictionary:
	return {
		"gender": String(doll.get("gender", "male")),
		"name": String(doll.get("name", "")),
		"job": String(doll.get("job", "")),
		"equipped": _normalized_equipment(Dictionary(doll.get("equipped", {}))),
	}

func _normalized_equipment(equipment: Dictionary) -> Dictionary:
	var normalized: Dictionary = {}
	for slot in EQUIPMENT_SLOTS:
		normalized[slot] = String(equipment.get(slot, ""))
	return normalized
