class_name PackPageStateBinder
extends RefCounted

func live_pack_cards(game_state: Dictionary, pack_cards: Array) -> Array[Dictionary]:
	var cards: Array[Dictionary] = []
	var focus_id := String(game_state.get("pack_focus", ""))
	var focus_found := false

	for pack_value in pack_cards:
		var card := _normalized_card(Dictionary(pack_value))
		if focus_id != "" and String(card["id"]) == focus_id:
			_apply_focus_state(card, game_state)
			focus_found = true
		cards.append(card)

	if focus_id != "" and not focus_found:
		cards.push_front(_focus_card(game_state))

	return cards

func sync_focus_card(game_state: Dictionary, pack_cards: Array, result_override: String = "") -> void:
	var focus_id := String(game_state.get("pack_focus", ""))
	if focus_id == "":
		return

	for i in range(pack_cards.size()):
		var card := _normalized_card(Dictionary(pack_cards[i]))
		if String(card["id"]) == focus_id:
			_apply_focus_state(card, game_state)
			if result_override != "":
				card["result"] = result_override
			pack_cards[i] = card
			return

	pack_cards.push_front(_focus_card(game_state, result_override))

func _normalized_card(pack: Dictionary) -> Dictionary:
	return {
		"id": String(pack.get("id", "")),
		"status": String(pack.get("status", "OWNED")),
		"price": int(pack.get("price", pack.get("currentPrice", 100))),
		"trades": int(pack.get("trades", pack.get("tradeCount", 0))),
		"result": String(pack.get("result", "")),
	}

func _focus_card(game_state: Dictionary, result_override: String = "") -> Dictionary:
	var result := result_override
	if result == "":
		result = String(game_state.get("open_result", ""))
	return {
		"id": String(game_state.get("pack_focus", "")),
		"status": String(game_state.get("pack_status", "OWNED")),
		"price": int(game_state.get("pack_price", 100)),
		"trades": int(game_state.get("trade_count", 0)),
		"result": result,
	}

func _apply_focus_state(card: Dictionary, game_state: Dictionary) -> void:
	card["status"] = String(game_state.get("pack_status", card.get("status", "OWNED")))
	card["price"] = int(game_state.get("pack_price", card.get("price", 100)))
	card["trades"] = int(game_state.get("trade_count", card.get("trades", 0)))
	if not card.has("result") or String(card["result"]) == "":
		card["result"] = String(game_state.get("open_result", ""))
