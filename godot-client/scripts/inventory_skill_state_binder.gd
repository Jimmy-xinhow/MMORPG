class_name InventorySkillStateBinder
extends RefCounted

const DEFAULT_ITEM_QTY: int = 1
const INVENTORY_CARD_LIMIT: int = 6
const SKILL_CARD_LIMIT: int = 6

func live_inventory_items(inventory_items: Array) -> Array[Dictionary]:
	var items: Array[Dictionary] = []
	for item_value in inventory_items:
		items.append(_normalized_item(Dictionary(item_value)))
	return items

func inventory_visual_cards(inventory_items: Array) -> Array[Dictionary]:
	var cards: Array[Dictionary] = []
	var live_items: Array[Dictionary] = live_inventory_items(inventory_items)
	for i in range(mini(live_items.size(), INVENTORY_CARD_LIMIT)):
		var item: Dictionary = live_items[i]
		cards.append({
			"art": _item_art(String(item["type"]), String(item["rarity"])),
			"title": String(item["name"]),
			"body": "%s / %s / x%d" % [String(item["type"]), String(item["rarity"]), int(item["qty"])],
		})
	return cards

func live_skill_rows(skill_rows: Array) -> Array[Array]:
	var rows: Array[Array] = []
	for row_value in skill_rows:
		rows.append(_normalized_skill_row(Array(row_value)))
	return rows

func skill_visual_cards(skill_rows: Array) -> Array[Dictionary]:
	var cards: Array[Dictionary] = []
	var live_rows: Array[Array] = live_skill_rows(skill_rows)
	for i in range(mini(live_rows.size(), SKILL_CARD_LIMIT)):
		var row: Array = live_rows[i]
		cards.append({
			"art": _skill_art(i),
			"title": "%s %s" % [String(row[0]), String(row[1])],
			"body": String(row[2]),
		})
	return cards

func sync_inventory_item(inventory_items: Array, item: Dictionary) -> void:
	var incoming: Dictionary = _normalized_item(item)
	var incoming_name: String = String(incoming["name"])
	var incoming_type: String = String(incoming["type"])
	var incoming_rarity: String = String(incoming["rarity"])
	for i in range(inventory_items.size()):
		var current: Dictionary = _normalized_item(Dictionary(inventory_items[i]))
		if String(current["name"]) == incoming_name and String(current["type"]) == incoming_type and String(current["rarity"]) == incoming_rarity:
			current["qty"] = int(current["qty"]) + int(incoming["qty"])
			inventory_items[i] = current
			return
	inventory_items.append(incoming)

func sync_skill_training(skill_rows: Array) -> void:
	for i in range(skill_rows.size()):
		skill_rows[i] = _normalized_skill_row(Array(skill_rows[i]))

func sync_backend_lists(inventory_items: Array, skill_rows: Array) -> void:
	for i in range(inventory_items.size()):
		inventory_items[i] = _normalized_item(Dictionary(inventory_items[i]))
	for i in range(skill_rows.size()):
		skill_rows[i] = _normalized_skill_row(Array(skill_rows[i]))

func _normalized_item(item: Dictionary) -> Dictionary:
	return {
		"name": String(item.get("name", "")),
		"type": String(item.get("type", "")),
		"rarity": String(item.get("rarity", "")),
		"qty": maxi(DEFAULT_ITEM_QTY, int(item.get("qty", item.get("quantity", DEFAULT_ITEM_QTY)))),
	}

func _normalized_skill_row(row: Array) -> Array:
	var name: String = "" if row.size() < 1 else String(row[0])
	var level: String = "" if row.size() < 2 else String(row[1])
	var detail: String = "" if row.size() < 3 else String(row[2])
	return [name, level, detail]

func _item_art(item_type: String, rarity: String) -> String:
	if rarity == "Rare":
		return "rare"
	match item_type:
		"weapon":
			return "weapon"
		"armor":
			return "armor"
		"accessory":
			return "crystal"
		"consumable":
			return "potion"
		"material":
			return "material"
		_:
			return "pack"

func _skill_art(index: int) -> String:
	match index:
		0:
			return "skill"
		1:
			return "ranger"
		2:
			return "mage"
		3:
			return "cleric"
		4:
			return "passive"
		_:
			return "boss"
