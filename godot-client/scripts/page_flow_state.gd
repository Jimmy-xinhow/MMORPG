class_name PageFlowState
extends RefCounted

var active_page: String = "home"
var active_pack_view: String = "main"
var active_role_view: String = "main"
var active_market_view: String = "main"
var active_challenge_view: String = "main"
var active_guild_view: String = "main"
var active_system_view: String = "main"
var active_inventory_view: String = "main"
var active_skill_view: String = "main"
var active_shop_view: String = "main"
var active_quest_view: String = "main"
var active_ranking_view: String = "main"
var active_mail_view: String = "main"
var active_friends_view: String = "main"
var active_world_view: String = "main"
var active_account_view: String = "main"
var active_liveops_view: String = "main"

func apply_start_arg(arg: String, page_names: Array, pack_views: Dictionary, role_views: Dictionary, market_views: Dictionary, challenge_views: Dictionary = {}, guild_views: Dictionary = {}, system_views: Dictionary = {}, inventory_views: Dictionary = {}, skill_views: Dictionary = {}, shop_views: Dictionary = {}, quest_views: Dictionary = {}, ranking_views: Dictionary = {}, mail_views: Dictionary = {}, friends_views: Dictionary = {}, world_views: Dictionary = {}, account_views: Dictionary = {}, liveops_views: Dictionary = {}) -> bool:
	if arg.begins_with("--page="):
		var requested := arg.trim_prefix("--page=")
		if page_names.has(requested):
			select_page(requested)
		return true
	if arg.begins_with("--pack-view="):
		var requested_pack_view := arg.trim_prefix("--pack-view=")
		set_pack_view(requested_pack_view, pack_views)
		return true
	if arg.begins_with("--role-view="):
		var requested_role_view := arg.trim_prefix("--role-view=")
		set_role_view(requested_role_view, role_views)
		return true
	if arg.begins_with("--market-view="):
		var requested_market_view := arg.trim_prefix("--market-view=")
		set_market_view(requested_market_view, market_views)
		return true
	if arg.begins_with("--challenge-view="):
		var requested_challenge_view := arg.trim_prefix("--challenge-view=")
		set_challenge_view(requested_challenge_view, challenge_views)
		return true
	if arg.begins_with("--guild-view="):
		var requested_guild_view := arg.trim_prefix("--guild-view=")
		set_guild_view(requested_guild_view, guild_views)
		return true
	if arg.begins_with("--system-view="):
		var requested_system_view := arg.trim_prefix("--system-view=")
		set_system_view(requested_system_view, system_views)
		return true
	if arg.begins_with("--inventory-view="):
		var requested_inventory_view := arg.trim_prefix("--inventory-view=")
		set_inventory_view(requested_inventory_view, inventory_views)
		return true
	if arg.begins_with("--skill-view="):
		var requested_skill_view := arg.trim_prefix("--skill-view=")
		set_skill_view(requested_skill_view, skill_views)
		return true
	if arg.begins_with("--shop-view="):
		var requested_shop_view := arg.trim_prefix("--shop-view=")
		set_shop_view(requested_shop_view, shop_views)
		return true
	if arg.begins_with("--quest-view="):
		var requested_quest_view := arg.trim_prefix("--quest-view=")
		set_quest_view(requested_quest_view, quest_views)
		return true
	if arg.begins_with("--ranking-view="):
		var requested_ranking_view := arg.trim_prefix("--ranking-view=")
		set_ranking_view(requested_ranking_view, ranking_views)
		return true
	if arg.begins_with("--mail-view="):
		var requested_mail_view := arg.trim_prefix("--mail-view=")
		set_mail_view(requested_mail_view, mail_views)
		return true
	if arg.begins_with("--friends-view="):
		var requested_friends_view := arg.trim_prefix("--friends-view=")
		set_friends_view(requested_friends_view, friends_views)
		return true
	if arg.begins_with("--world-view="):
		var requested_world_view := arg.trim_prefix("--world-view=")
		set_world_view(requested_world_view, world_views)
		return true
	if arg.begins_with("--account-view="):
		var requested_account_view := arg.trim_prefix("--account-view=")
		set_account_view(requested_account_view, account_views)
		return true
	if arg.begins_with("--liveops-view="):
		var requested_liveops_view := arg.trim_prefix("--liveops-view=")
		set_liveops_view(requested_liveops_view, liveops_views)
		return true
	return false

func select_page(page_name: String) -> void:
	active_page = page_name
	if active_page == "packs":
		active_pack_view = "main"
	elif active_page == "role":
		active_role_view = "main"
	elif active_page == "market":
		active_market_view = "main"
	elif active_page == "challenge":
		active_challenge_view = "main"
	elif active_page == "guild":
		active_guild_view = "main"
	elif active_page == "system":
		active_system_view = "main"
	elif active_page == "inventory":
		active_inventory_view = "main"
	elif active_page == "skills":
		active_skill_view = "main"
	elif active_page == "shop":
		active_shop_view = "main"
	elif active_page == "quests":
		active_quest_view = "main"
	elif active_page == "ranking":
		active_ranking_view = "main"
	elif active_page == "mail":
		active_mail_view = "main"
	elif active_page == "friends":
		active_friends_view = "main"
	elif active_page == "world":
		active_world_view = "main"
	elif active_page == "account":
		active_account_view = "main"
	elif active_page == "liveops":
		active_liveops_view = "main"

func current_pack_view() -> String:
	if active_page != "packs":
		return ""
	return active_pack_view

func current_role_view() -> String:
	if active_page != "role":
		return ""
	return active_role_view

func current_market_view() -> String:
	if active_page != "market":
		return ""
	return active_market_view

func current_challenge_view() -> String:
	if active_page != "challenge":
		return ""
	return active_challenge_view

func current_guild_view() -> String:
	if active_page != "guild":
		return ""
	return active_guild_view

func current_system_view() -> String:
	if active_page != "system":
		return ""
	return active_system_view

func current_inventory_view() -> String:
	if active_page != "inventory":
		return ""
	return active_inventory_view

func current_skill_view() -> String:
	if active_page != "skills":
		return ""
	return active_skill_view

func current_shop_view() -> String:
	if active_page != "shop":
		return ""
	return active_shop_view

func current_quest_view() -> String:
	if active_page != "quests":
		return ""
	return active_quest_view

func current_ranking_view() -> String:
	if active_page != "ranking":
		return ""
	return active_ranking_view

func current_mail_view() -> String:
	if active_page != "mail":
		return ""
	return active_mail_view

func current_friends_view() -> String:
	if active_page != "friends":
		return ""
	return active_friends_view

func current_world_view() -> String:
	if active_page != "world":
		return ""
	return active_world_view

func current_account_view() -> String:
	if active_page != "account":
		return ""
	return active_account_view

func current_liveops_view() -> String:
	if active_page != "liveops":
		return ""
	return active_liveops_view

func set_pack_view(next_view: String, pack_views: Dictionary) -> void:
	if pack_views.has(next_view):
		active_pack_view = next_view

func set_role_view(next_view: String, role_views: Dictionary) -> void:
	if role_views.has(next_view):
		active_role_view = next_view

func set_market_view(next_view: String, market_views: Dictionary) -> void:
	if market_views.has(next_view):
		active_market_view = next_view

func set_challenge_view(next_view: String, challenge_views: Dictionary) -> void:
	if challenge_views.has(next_view):
		active_challenge_view = next_view

func set_guild_view(next_view: String, guild_views: Dictionary) -> void:
	if guild_views.has(next_view):
		active_guild_view = next_view

func set_system_view(next_view: String, system_views: Dictionary) -> void:
	if system_views.has(next_view):
		active_system_view = next_view

func set_inventory_view(next_view: String, inventory_views: Dictionary) -> void:
	if inventory_views.has(next_view):
		active_inventory_view = next_view

func set_skill_view(next_view: String, skill_views: Dictionary) -> void:
	if skill_views.has(next_view):
		active_skill_view = next_view

func set_shop_view(next_view: String, shop_views: Dictionary) -> void:
	if shop_views.has(next_view):
		active_shop_view = next_view

func set_quest_view(next_view: String, quest_views: Dictionary) -> void:
	if quest_views.has(next_view):
		active_quest_view = next_view

func set_ranking_view(next_view: String, ranking_views: Dictionary) -> void:
	if ranking_views.has(next_view):
		active_ranking_view = next_view

func set_mail_view(next_view: String, mail_views: Dictionary) -> void:
	if mail_views.has(next_view):
		active_mail_view = next_view

func set_friends_view(next_view: String, friends_views: Dictionary) -> void:
	if friends_views.has(next_view):
		active_friends_view = next_view

func set_world_view(next_view: String, world_views: Dictionary) -> void:
	if world_views.has(next_view):
		active_world_view = next_view

func set_account_view(next_view: String, account_views: Dictionary) -> void:
	if account_views.has(next_view):
		active_account_view = next_view

func set_liveops_view(next_view: String, liveops_views: Dictionary) -> void:
	if liveops_views.has(next_view):
		active_liveops_view = next_view

func write_to_game_state(game_state: Dictionary) -> void:
	game_state["active_page"] = active_page
	game_state["pack_view"] = active_pack_view
	game_state["role_view"] = active_role_view
	game_state["market_view"] = active_market_view
	game_state["challenge_view"] = active_challenge_view
	game_state["guild_view"] = active_guild_view
	game_state["system_view"] = active_system_view
	game_state["inventory_view"] = active_inventory_view
	game_state["skill_view"] = active_skill_view
	game_state["shop_view"] = active_shop_view
	game_state["quest_view"] = active_quest_view
	game_state["ranking_view"] = active_ranking_view
	game_state["mail_view"] = active_mail_view
	game_state["friends_view"] = active_friends_view
	game_state["world_view"] = active_world_view
	game_state["account_view"] = active_account_view
	game_state["liveops_view"] = active_liveops_view
