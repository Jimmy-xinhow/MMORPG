class_name MarketPageStateBinder
extends RefCounted

func live_market_rows(game_state: Dictionary, market_rows: Array) -> Array[Dictionary]:
	var rows: Array[Dictionary] = []
	var focus_pack := String(game_state.get("pack_focus", ""))
	var focus_found := false

	for row_value in market_rows:
		var row := _normalized_row(Dictionary(row_value))
		if focus_pack != "" and String(row["pack"]) == focus_pack:
			focus_found = true
		rows.append(row)

	if focus_pack != "" and String(game_state.get("pack_status", "")) == "LISTED" and not focus_found:
		rows.push_front(_focus_listing_row(game_state))

	return rows

func market_visual_cards(game_state: Dictionary, market_rows: Array) -> Array[Dictionary]:
	var rows := live_market_rows(game_state, market_rows)
	var cards: Array[Dictionary] = [
		{"art": "market", "title": "交易場", "body": String(game_state.get("session", "Session OPEN"))},
		{"art": "price", "title": "價格上限", "body": "本輪價格 %d GC" % int(game_state.get("pack_price", 0))},
		{"art": "lock", "title": "交易鎖定", "body": "買家流程保護"},
		{"art": "force_open", "title": "強制開啟", "body": "冷卻後進入消耗"},
	]

	for i in range(mini(rows.size(), 4)):
		var row := rows[i]
		cards.append({
			"art": "listing",
			"title": String(row["pack"]),
			"body": "%s / %s" % [String(row["price"]), String(row["state"])],
		})

	return cards

func sync_focus_listing(game_state: Dictionary, market_rows: Array) -> void:
	var row := _focus_listing_row(game_state)
	_upsert_row(market_rows, row)

func sync_purchase_record(market_rows: Array) -> void:
	if market_rows.is_empty():
		market_rows.push_front({"pack": "MARKET-BUY", "seller": "Market", "price": "120 GC", "state": "PURCHASED"})
		return
	var row := _normalized_row(Dictionary(market_rows[0]))
	row["state"] = "PURCHASED"
	market_rows[0] = row

func sync_refresh_row(market_rows: Array, row: Dictionary, limit: int) -> void:
	market_rows.push_front(_normalized_row(row))
	while market_rows.size() > limit:
		market_rows.pop_back()

func _focus_listing_row(game_state: Dictionary) -> Dictionary:
	return {
		"pack": String(game_state.get("pack_focus", "")),
		"seller": "Player",
		"price": "%d GC" % int(game_state.get("pack_price", 0)),
		"state": String(game_state.get("pack_status", "LISTED")),
	}

func _normalized_row(row: Dictionary) -> Dictionary:
	return {
		"pack": String(row.get("pack", "")),
		"seller": String(row.get("seller", "")),
		"price": String(row.get("price", "")),
		"state": String(row.get("state", "")),
	}

func _upsert_row(market_rows: Array, row: Dictionary) -> void:
	var pack_id := String(row.get("pack", ""))
	for i in range(market_rows.size()):
		var existing := _normalized_row(Dictionary(market_rows[i]))
		if String(existing["pack"]) == pack_id:
			market_rows[i] = row
			return
	market_rows.push_front(row)
