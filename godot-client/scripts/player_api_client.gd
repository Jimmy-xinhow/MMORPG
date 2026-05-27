class_name PlayerApiClient
extends Node

signal player_state_received(payload: Dictionary)
signal player_action_received(payload: Dictionary)
signal simulated_payment_received(payload: Dictionary)
signal request_failed(action: String, response_code: int, message: String)

const ACTION_PLAYER_STATE := "player_state"
const ACTION_PLAYER_ACTION := "player_action"
const ACTION_SIMULATE_PAYMENT := "simulate_payment"
const PLAYER_STATE_PATH := "/api/player/state"
const PLAYER_ACTION_PATH := "/api/player/action"
const SIMULATE_PAYMENT_PATH := "/api/player/simulate-payment"

var api_base_url: String = "http://127.0.0.1:3000"
var owner_id: String = "player_1"
var pending_action: String = ""
var http_request: HTTPRequest

func _ready() -> void:
	_ensure_http_request()

func _ensure_http_request() -> void:
	if http_request != null:
		return
	http_request = HTTPRequest.new()
	http_request.request_completed.connect(_on_request_completed)
	add_child(http_request)

func has_pending_request() -> bool:
	return pending_action != ""

func request_player_state() -> bool:
	return _send_request(ACTION_PLAYER_STATE, PLAYER_STATE_PATH)

func post_simulated_payment(amount: int, step: int) -> bool:
	var body := {
		"ownerId": owner_id,
		"amount": amount,
		"idempotencyKey": "godot-sim-payment-%d" % step,
	}
	return _send_request(ACTION_SIMULATE_PAYMENT, SIMULATE_PAYMENT_PATH, HTTPClient.METHOD_POST, body)

func post_player_action(action_name: String) -> bool:
	var body := {
		"ownerId": owner_id,
		"action": action_name,
	}
	return _send_request(ACTION_PLAYER_ACTION, PLAYER_ACTION_PATH, HTTPClient.METHOD_POST, body)

func _send_request(action: String, path: String, method: int = HTTPClient.METHOD_GET, body_data: Dictionary = {}) -> bool:
	_ensure_http_request()
	if http_request == null:
		request_failed.emit(action, 0, "HTTP request node is not ready")
		return false
	if pending_action != "":
		return false
	pending_action = action
	var headers := PackedStringArray()
	var body := ""
	if method != HTTPClient.METHOD_GET:
		headers = PackedStringArray(["Content-Type: application/json"])
		body = JSON.stringify(body_data)
	var error := http_request.request(api_base_url + path, headers, method, body)
	if error != OK:
		pending_action = ""
		request_failed.emit(action, 0, "Request start failed: %d" % error)
		return false
	return true

func _on_request_completed(_result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray) -> void:
	var completed_action := pending_action
	pending_action = ""
	if response_code < 200 or response_code >= 300:
		request_failed.emit(completed_action, response_code, "HTTP response failed")
		return
	var parsed: Variant = JSON.parse_string(body.get_string_from_utf8())
	if typeof(parsed) != TYPE_DICTIONARY:
		request_failed.emit(completed_action, response_code, "Response JSON was not an object")
		return
	var payload := Dictionary(parsed)
	match completed_action:
		ACTION_PLAYER_STATE:
			player_state_received.emit(payload)
		ACTION_PLAYER_ACTION:
			player_action_received.emit(payload)
		ACTION_SIMULATE_PAYMENT:
			simulated_payment_received.emit(payload)
		_:
			request_failed.emit(completed_action, response_code, "Unknown completed action")
