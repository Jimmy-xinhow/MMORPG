class_name HudPresenter
extends RefCounted

func apply_hud(game_state: Dictionary, active_page: String, composite_page: bool, target_home: bool, controls: Dictionary) -> void:
	_apply_portrait(game_state, controls.get("portrait_doll", null))
	_apply_top_labels(game_state, active_page, controls)
	_apply_resource_labels(game_state, Dictionary(controls.get("resource_labels", {})))
	_apply_visibility(active_page, composite_page, target_home, controls)

func _apply_portrait(game_state: Dictionary, portrait_doll: Variant) -> void:
	if portrait_doll == null:
		return
	portrait_doll.set("gender", String(game_state["gender"]))
	portrait_doll.set("equipped", Dictionary(game_state["equipped"]))
	portrait_doll.call("queue_redraw")

func _apply_top_labels(game_state: Dictionary, active_page: String, controls: Dictionary) -> void:
	var top_story: Variant = controls.get("top_story", null)
	if top_story is Label:
		(top_story as Label).text = _top_story_text(game_state, active_page)
	var level_label: Variant = controls.get("level_label", null)
	if level_label is Label:
		(level_label as Label).text = "Lv.%d" % int(game_state["level"])
	var exp_bar: Variant = controls.get("exp_bar", null)
	if exp_bar is ProgressBar:
		(exp_bar as ProgressBar).value = int(game_state["exp"])
	var power_label: Variant = controls.get("power_label", null)
	if power_label is Label:
		(power_label as Label).text = "戰力 %s" % _format_number(int(game_state["party_power"]))

func _apply_resource_labels(game_state: Dictionary, resource_labels: Dictionary) -> void:
	if resource_labels.has("gc") and resource_labels["gc"] is Label:
		(resource_labels["gc"] as Label).text = "%d GC" % int(game_state["gc"])
	if resource_labels.has("tickets") and resource_labels["tickets"] is Label:
		(resource_labels["tickets"] as Label).text = "票券 %d" % int(game_state["tickets"])
	if resource_labels.has("session") and resource_labels["session"] is Label:
		(resource_labels["session"] as Label).text = String(game_state["region"])

func _apply_visibility(active_page: String, composite_page: bool, target_home: bool, controls: Dictionary) -> void:
	_set_canvas_item_visible(controls.get("top_hud_panel", null), not composite_page)
	_set_canvas_item_visible(controls.get("nav_bg", null), not composite_page)
	_set_canvas_item_visible(controls.get("home_action_hotspot", null), target_home)
	_set_canvas_item_visible(controls.get("home_stage_spacer", null), target_home)
	_set_canvas_item_visible(controls.get("quest_panel", null), false if composite_page else active_page == "home")
	_set_canvas_item_visible(controls.get("content_panel", null), active_page != "home" and not composite_page)

func _set_canvas_item_visible(node: Variant, visible: bool) -> void:
	if node is CanvasItem:
		(node as CanvasItem).visible = visible

func _top_story_text(game_state: Dictionary, active_page: String) -> String:
	if active_page == "home":
		return "%s / %s / 自動巡邏中" % [String(game_state["player_name"]), String(game_state["region"])]
	var title_by_page := {
		"packs": "禮包庫",
		"market": "交易場",
		"challenge": "挑戰大廳",
		"role": "角色編隊",
		"inventory": "背包",
		"skills": "技能",
		"guild": "公會大廳",
		"system": "系統設定",
	}
	if active_page == "packs":
		return "%s / %s" % [String(title_by_page.get(active_page, "功能頁")), String(game_state["pack_focus"])]
	if active_page == "market":
		return "%s / Session %s" % [String(title_by_page.get(active_page, "功能頁")), String(game_state["session"])]
	return "%s / %s Lv.%d" % [String(title_by_page.get(active_page, "功能頁")), String(game_state["player_name"]), int(game_state["level"])]

func _format_number(value: int) -> String:
	var text := str(value)
	var result := ""
	var count := 0
	for i in range(text.length() - 1, -1, -1):
		if count > 0 and count % 3 == 0:
			result = "," + result
		result = text.substr(i, 1) + result
		count += 1
	return result
