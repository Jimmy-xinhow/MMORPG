class_name FeaturePageRenderer
extends RefCounted

const PAGE_TITLES := {
	"home": "",
	"packs": "禮包庫",
	"market": "交易場",
	"challenge": "挑戰大廳",
	"role": "角色編隊",
	"inventory": "背包",
	"skills": "技能",
	"guild": "公會",
	"system": "系統",
}

func refresh_page(active_page: String, controls: Dictionary, renderers: Dictionary) -> void:
	var content_body_control: Variant = controls.get("content_body", null)
	if content_body_control is VBoxContainer:
		var content_body := content_body_control as VBoxContainer
		for child in content_body.get_children():
			child.queue_free()

	var content_title_control: Variant = controls.get("content_title", null)
	if content_title_control is Label:
		var content_title := content_title_control as Label
		content_title.text = String(PAGE_TITLES.get(active_page, ""))

	if active_page == "home":
		return

	var renderer: Callable = renderers.get(active_page, Callable())
	if renderer.is_valid():
		renderer.call()
