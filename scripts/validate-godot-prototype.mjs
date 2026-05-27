import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function file(path) {
  return readFile(path, "utf8");
}

async function listFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = `${path}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...(await listFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

const [
  project,
  scene,
  script,
  readme,
  exportPresets,
  packageScript,
  windowsPackageScript,
  artRoadmap,
  artToolchain,
  artSpec,
] = await Promise.all([
  file("godot-client/project.godot"),
  file("godot-client/scenes/Main.tscn"),
  file("godot-client/scripts/Main.gd"),
  file("godot-client/README.md"),
  file("godot-client/export_presets.cfg"),
  file("scripts/package-godot-internal-test.ps1"),
  file("scripts/package-windows-internal-test.ps1"),
  file("docs/art-asset-roadmap.md"),
  file("docs/art-toolchain.md"),
  file("docs/art-asset-spec.md"),
]);

const godotScriptPaths = (await listFiles("godot-client/scripts")).filter((path) => path.endsWith(".gd"));
const allGodotScripts = (await Promise.all(godotScriptPaths.map((path) => file(path)))).join("\n");

const requiredArtAssets = [
  "godot-client/assets/backgrounds/ro_field_day.svg",
  "godot-client/assets/backgrounds/ro_field_day.png",
  "godot-client/assets/sprites/player_adventurer.svg",
  "godot-client/assets/sprites/player_adventurer.png",
  "godot-client/assets/sprites/lucky_chest.svg",
  "godot-client/assets/sprites/lucky_chest.png",
  "godot-client/assets/icons/pack.svg",
  "godot-client/assets/icons/pack.png",
  "godot-client/assets/icons/market.svg",
  "godot-client/assets/icons/market.png",
  "godot-client/assets/icons/boss.svg",
  "godot-client/assets/icons/boss.png",
  "godot-client/assets/icons/warrior.svg",
  "godot-client/assets/icons/warrior.png",
  "godot-client/assets/icons/mage.svg",
  "godot-client/assets/icons/mage.png",
  "godot-client/assets/icons/cleric.svg",
  "godot-client/assets/icons/cleric.png",
];
for (const path of requiredArtAssets) {
  assert(existsSync(path), `missing Godot placeholder asset: ${path}`);
}

assert(project.includes('run/main_scene="res://scenes/Main.tscn"'), "Godot project must point to Main.tscn");
assert(project.includes("viewport_width=432") && project.includes("viewport_height=768"), "Godot project must use mobile portrait resolution");
assert(scene.includes('type="Node2D"') && scene.includes("res://scripts/Main.gd"), "Main scene must use Node2D root with Main.gd");
assert(script.includes("extends Node2D"), "Godot main script must be a Node2D scene");
assert(script.includes("CanvasLayer") && script.includes("class GameWorld"), "Godot client must separate HUD and game world");
assert(script.includes("func _process(delta: float)") && script.includes("func tick(delta: float)"), "Godot client must animate through the engine loop");
assert(allGodotScripts.includes("HTTPRequest") && allGodotScripts.includes("api_base_url") && script.includes("--api-base="), "Godot client must support online API internal testing");

assert(script.includes("_render_pack_page") && script.includes("_render_market_page") && script.includes("_render_challenge_page") && script.includes("_render_role_page") && script.includes("_render_inventory_page") && script.includes("_render_skill_page"), "Godot feature pages must be separate pages");
assert(allGodotScripts.includes("/api/player/state") && allGodotScripts.includes("/api/player/action") && allGodotScripts.includes("/api/player/simulate-payment") && script.includes("_apply_player_state"), "Godot must synchronize player state, actions, and simulated payment");
assert(allGodotScripts.includes("character") && allGodotScripts.includes("inventory") && allGodotScripts.includes("skills") && allGodotScripts.includes("combat"), "Godot must consume character, inventory, skills, and combat state");
assert(script.includes("class PaperDollView") && script.includes("_draw_paper_doll_world") && script.includes("paper_dolls"), "Godot must keep paper doll integration hooks");
assert(script.includes('"gender": "male"') && script.includes('"gender": "female"'), "Godot must include male and female paper doll bases");
assert(script.includes('"weapon"') && script.includes('"armor"') && script.includes('"head"') && script.includes('"accessory"'), "Godot equipment must drive visible paper doll slots");
assert(script.includes("_draw_equipment_slots") && script.includes("_draw_enemy_target"), "Godot home must show equipment slots and enemy target integration");

assert(
  script.includes("res://assets/production/backgrounds/home-field.png") &&
    script.includes("res://assets/production/backgrounds/pack-page.png") &&
    script.includes("res://assets/production/backgrounds/market-page.png") &&
    script.includes("res://assets/production/backgrounds/challenge-page.png") &&
    script.includes("res://assets/production/backgrounds/role-page.png") &&
    script.includes("res://assets/production/backgrounds/inventory-page.png") &&
    script.includes("res://assets/production/backgrounds/skill-page.png") &&
    script.includes("res://assets/production/characters/male-base.png") &&
    script.includes("res://assets/production/characters/female-base.png") &&
    script.includes("res://assets/production/characters/states/male-combat.png") &&
    script.includes("res://assets/production/characters/states/female-reward.png") &&
    script.includes("res://assets/production/characters/animations/%s-%s-%d.png") &&
    script.includes("res://assets/production/characters/layers/male-body-front.png") &&
    script.includes("res://assets/production/characters/layers/female-body-front.png") &&
    script.includes("res://assets/production/monsters/slime-v2.png") &&
    script.includes("res://assets/production/monsters/crystal-golem.png") &&
    script.includes("res://assets/production/vfx/sword-slash.png") &&
    script.includes("res://assets/production/icons/pack-sealed.png") &&
    script.includes("res://assets/production/equipment/sword-layer.png") &&
    script.includes("res://assets/production/equipment/blue-cloak-layer.png") &&
    script.includes("res://assets/production/equipment/staff-layer.png"),
  "Godot home must use production asset paths for background, paper dolls, monster, pack, and equipment",
);
assert(script.includes("StyleBoxTexture") && script.includes("hud-frame-9slice.png") && script.includes("button-normal.png") && script.includes("button-disabled.png"), "Godot UI must use production 9-slice/button texture assets");
assert(script.includes("_load_character_animation_set") && script.includes("_current_animation_name") && script.includes('"walk"') && script.includes('"cast"') && script.includes('"death"') && script.includes('"loot"'), "Godot runtime must drive walk, cast, death, and loot animation frames");
assert(script.includes("_current_visual_state") && script.includes("paper-doll-combat-states-sheet") === false, "Godot runtime must drive visible character states from production state textures, not a static debug sheet");
assert(
  script.includes("res://assets/production/icons/market-stall.png") &&
    script.includes("res://assets/production/icons/listing-status.png") &&
    script.includes("res://assets/production/icons/boss-marker.png") &&
    script.includes("res://assets/production/icons/guild-marker.png") &&
    script.includes("res://assets/production/icons/skill-magic-burst.png") &&
    script.includes("res://assets/production/icons/skill-healing.png"),
  "Godot feature cards must use production icon assets before drawing fallback shapes",
);
assert(script.includes("ResourceLoader.exists(path)") && script.includes("Image.load_from_file(ProjectSettings.globalize_path(path))"), "Godot exported builds must load packed resources before filesystem fallback");
assert(script.includes("class ArtIcon"), "Godot prototype may keep ArtIcon placeholders until production art replacement");
assert(artSpec.includes("PLACEHOLDER_NOT_SHIPPABLE"), "Current generated assets must be classified as placeholder-only");

assert(script.includes("_action_panel_style") && script.includes("_resource_style") && script.includes("_section_style") && script.includes("_log_style") && script.includes("_button_style"), "Godot UI must separate actions, resources, sections, logs, and buttons");
assert(!script.includes("_status_card_style") && !script.includes("_icon_frame_style") && !script.includes("_badge_style"), "Passive info must not use button-like individual frames");
assert(script.includes("HOME_COMPOSITE_PATH") && script.includes("home-target-composite.png") && existsSync("godot-client/assets/production/ui/home-target-composite.png"), "Home must use the locked target composite art asset");
for (const page of ["role", "packs", "market", "challenge", "guild", "system"]) {
  assert(script.includes(`res://assets/production/ui/${page}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${page}-target-composite.png`), `missing locked ${page} composite UI`);
}
for (const packView of ["pack-shop", "pack-confirm", "pack-result", "pack-records", "pack-odds"]) {
  assert(script.includes(`res://assets/production/ui/${packView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${packView}-target-composite.png`), `missing locked ${packView} composite UI`);
}
for (const roleView of ["role-equipment", "role-training", "role-job", "role-appearance"]) {
  assert(script.includes(`res://assets/production/ui/${roleView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${roleView}-target-composite.png`), `missing locked ${roleView} composite UI`);
}
for (const marketView of ["market-confirm", "market-list", "market-records", "market-rules"]) {
  assert(script.includes(`res://assets/production/ui/${marketView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${marketView}-target-composite.png`), `missing locked ${marketView} composite UI`);
}
for (const challengeView of ["challenge-confirm", "challenge-battle", "challenge-result", "challenge-records"]) {
  assert(script.includes(`res://assets/production/ui/${challengeView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${challengeView}-target-composite.png`), `missing locked ${challengeView} composite UI`);
}
for (const guildView of ["guild-hall", "guild-donate", "guild-boss", "guild-shop"]) {
  assert(script.includes(`res://assets/production/ui/${guildView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${guildView}-target-composite.png`), `missing locked ${guildView} composite UI`);
}
for (const systemView of ["system-settings", "system-graphics", "system-account", "system-logout"]) {
  assert(script.includes(`res://assets/production/ui/${systemView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${systemView}-target-composite.png`), `missing locked ${systemView} composite UI`);
}
for (const inventoryView of ["inventory-main", "inventory-detail", "inventory-materials", "inventory-use"]) {
  assert(script.includes(`res://assets/production/ui/${inventoryView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${inventoryView}-target-composite.png`), `missing locked ${inventoryView} composite UI`);
}
for (const skillView of ["skills-main", "skills-upgrade", "skills-equip", "skills-tree"]) {
  assert(script.includes(`res://assets/production/ui/${skillView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${skillView}-target-composite.png`), `missing locked ${skillView} composite UI`);
}
for (const shopView of ["shop-main", "shop-detail", "shop-confirm", "shop-result"]) {
  assert(script.includes(`res://assets/production/ui/${shopView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${shopView}-target-composite.png`), `missing locked ${shopView} composite UI`);
}
for (const questView of ["quests-main", "quests-detail", "quests-event", "quests-reward"]) {
  assert(script.includes(`res://assets/production/ui/${questView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${questView}-target-composite.png`), `missing locked ${questView} composite UI`);
}
for (const rankingView of ["ranking-power", "ranking-challenge", "ranking-guild", "ranking-player"]) {
  assert(script.includes(`res://assets/production/ui/${rankingView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${rankingView}-target-composite.png`), `missing locked ${rankingView} composite UI`);
}
for (const mailView of ["mail-inbox", "mail-detail", "mail-claim", "mail-announcement"]) {
  assert(script.includes(`res://assets/production/ui/${mailView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${mailView}-target-composite.png`), `missing locked ${mailView} composite UI`);
}
for (const friendsView of ["friends-list", "friends-party", "friends-invite", "friends-support"]) {
  assert(script.includes(`res://assets/production/ui/${friendsView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${friendsView}-target-composite.png`), `missing locked ${friendsView} composite UI`);
}
for (const worldView of ["world-map", "world-region", "world-stage", "world-dispatch"]) {
  assert(script.includes(`res://assets/production/ui/${worldView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${worldView}-target-composite.png`), `missing locked ${worldView} composite UI`);
}
for (const accountView of ["account-login", "account-select", "account-create", "account-server"]) {
  assert(script.includes(`res://assets/production/ui/${accountView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${accountView}-target-composite.png`), `missing locked ${accountView} composite UI`);
}
for (const liveopsView of ["liveops-detail", "liveops-tasks", "liveops-shop", "liveops-ranking"]) {
  assert(script.includes(`res://assets/production/ui/${liveopsView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${liveopsView}-target-composite.png`), `missing locked ${liveopsView} composite UI`);
}
for (const standaloneView of ["beta-feedback", "achievements-title", "codex-collection", "tutorial-guide", "chat-social", "party-recruit", "pet-companion", "equipment-enhance", "arena", "boss-preview", "dispatch-result", "battle-stats", "title-detail", "codex-detail", "appearance-collection", "badge-collection", "tutorial-battle", "tutorial-inventory", "tutorial-skills", "tutorial-guild"]) {
  assert(script.includes(`res://assets/production/ui/${standaloneView}-target-composite.png`) && existsSync(`godot-client/assets/production/ui/${standaloneView}-target-composite.png`), `missing locked ${standaloneView} composite UI`);
}
assert(script.includes('const PAGE_NAMES := ["home", "role", "packs", "market", "challenge", "guild", "system"]'), "Godot bottom nav must route to home, role, pack, market, challenge, guild, and system pages");
assert(script.includes('const ARG_PAGE_NAMES := ["home", "role", "packs", "market", "challenge", "guild", "system", "inventory", "skills", "shop", "quests", "ranking", "mail", "friends", "world", "account", "liveops", "feedback", "achievements", "codex", "tutorial", "chat", "party", "pets", "enhance", "arena", "boss_preview", "dispatch_result", "battle_stats", "title_detail", "codex_detail", "appearance_collection", "badge_collection", "tutorial_battle", "tutorial_inventory", "tutorial_skills", "tutorial_guild", "daily_checkin", "pass_progress", "timed_challenge", "event_exchange_confirm"]'), "Godot direct page startup must include secondary pages without crowding bottom nav");
assert(script.includes("PACK_COMPOSITE_PATHS") && allGodotScripts.includes("active_pack_view") && allGodotScripts.includes("--pack-view="), "Pack feature must support internal composite subviews");
assert(script.includes("ROLE_COMPOSITE_PATHS") && allGodotScripts.includes("active_role_view") && allGodotScripts.includes("--role-view="), "Role feature must support internal composite subviews");
assert(script.includes("MARKET_COMPOSITE_PATHS") && allGodotScripts.includes("active_market_view") && allGodotScripts.includes("--market-view="), "Market feature must support internal composite subviews");
assert(script.includes("CHALLENGE_COMPOSITE_PATHS") && allGodotScripts.includes("active_challenge_view") && allGodotScripts.includes("--challenge-view="), "Challenge feature must support internal composite subviews");
assert(script.includes("GUILD_COMPOSITE_PATHS") && allGodotScripts.includes("active_guild_view") && allGodotScripts.includes("--guild-view="), "Guild feature must support internal composite subviews");
assert(script.includes("SYSTEM_COMPOSITE_PATHS") && allGodotScripts.includes("active_system_view") && allGodotScripts.includes("--system-view="), "System feature must support internal composite subviews");
assert(script.includes("INVENTORY_COMPOSITE_PATHS") && allGodotScripts.includes("active_inventory_view") && allGodotScripts.includes("--inventory-view="), "Inventory feature must support internal composite subviews");
assert(script.includes("SKILL_COMPOSITE_PATHS") && allGodotScripts.includes("active_skill_view") && allGodotScripts.includes("--skill-view="), "Skill feature must support internal composite subviews");
assert(script.includes("SHOP_COMPOSITE_PATHS") && allGodotScripts.includes("active_shop_view") && allGodotScripts.includes("--shop-view="), "Shop feature must support internal composite subviews");
assert(script.includes("QUEST_COMPOSITE_PATHS") && allGodotScripts.includes("active_quest_view") && allGodotScripts.includes("--quest-view="), "Quest/event feature must support internal composite subviews");
assert(script.includes("RANKING_COMPOSITE_PATHS") && allGodotScripts.includes("active_ranking_view") && allGodotScripts.includes("--ranking-view="), "Ranking feature must support internal composite subviews");
assert(script.includes("MAIL_COMPOSITE_PATHS") && allGodotScripts.includes("active_mail_view") && allGodotScripts.includes("--mail-view="), "Mail feature must support internal composite subviews");
assert(script.includes("FRIENDS_COMPOSITE_PATHS") && allGodotScripts.includes("active_friends_view") && allGodotScripts.includes("--friends-view="), "Friends feature must support internal composite subviews");
assert(script.includes("WORLD_COMPOSITE_PATHS") && allGodotScripts.includes("active_world_view") && allGodotScripts.includes("--world-view="), "World map feature must support internal composite subviews");
assert(script.includes("ACCOUNT_COMPOSITE_PATHS") && allGodotScripts.includes("active_account_view") && allGodotScripts.includes("--account-view="), "Account feature must support internal composite subviews");
assert(script.includes("LIVEOPS_COMPOSITE_PATHS") && allGodotScripts.includes("active_liveops_view") && allGodotScripts.includes("--liveops-view="), "Live ops feature must support internal composite subviews");
assert(allGodotScripts.includes('"home_stage_spacer"') && allGodotScripts.includes("target_home"), "Home display area must only be reserved on home");
assert(allGodotScripts.includes('"top_hud_panel"') && allGodotScripts.includes('"quest_panel"') && allGodotScripts.includes('"content_panel"') && allGodotScripts.includes("not composite_page"), "Locked composite pages must hide old HUD/status/content overlays");
assert(existsSync("godot-client/scripts/quest_status_presenter.gd") && script.includes("QuestStatusPresenterScript") && script.includes("quest_status_presenter.apply_quest") && allGodotScripts.includes("class_name QuestStatusPresenter"), "Godot quest/status labels must be delegated to a focused presenter module");
assert(!script.includes("quest_title.text") && !script.includes("quest_body.text") && !script.includes("main_action.text") && !script.includes("func _home_status_text"), "Main.gd must not retain quest/status copy selection after presenter extraction");
assert(allGodotScripts.includes("func _home_status_text(event_feed: Array)") && allGodotScripts.includes('text.contains("LP-")') && allGodotScripts.includes('text.contains("禮包")') && allGodotScripts.includes('text.contains("交易")') && allGodotScripts.includes('text.contains("同步")'), "Quest presenter must preserve home feed filtering against pack, trade, and sync leakage");
assert(existsSync("godot-client/scripts/feature_page_renderer.gd") && script.includes("FeaturePageRendererScript") && script.includes("feature_page_renderer.refresh_page") && allGodotScripts.includes("class_name FeaturePageRenderer"), "Godot feature page refresh must be delegated to a focused renderer module");
assert(!script.includes("content_title.text =") && !script.includes("content_body.get_children()"), "Main.gd must not retain feature page title assignment or content clearing after renderer extraction");
assert(script.includes('"packs": Callable(self, "_render_pack_page")') && script.includes('"market": Callable(self, "_render_market_page")') && script.includes('"system": Callable(self, "_render_system_page")') && !script.includes('"home": Callable'), "Main.gd must expose feature page renderers as callables without rendering home feature content");
assert(allGodotScripts.includes("const PAGE_TITLES") && allGodotScripts.includes('if active_page == "home"') && allGodotScripts.includes("renderer.call()"), "Feature page renderer must own page title lookup, home skip, and renderer dispatch");
assert(existsSync("godot-client/scripts/pack_page_state_binder.gd") && script.includes("PackPageStateBinderScript") && allGodotScripts.includes("class_name PackPageStateBinder"), "Pack page state must use a focused live-state binder module");
assert(script.includes("pack_page_state_binder.live_pack_cards(game_state, pack_cards)") && script.includes("_pack_visual_cards(live_pack_cards)") && script.includes("for pack in live_pack_cards"), "Pack page visual cards and rows must render from normalized live pack state");
assert(script.includes("pack_page_state_binder.sync_focus_card(game_state, pack_cards") && !script.includes("pack_cards.push_front"), "Local pack actions must synchronize the focused pack card through the binder");
assert(allGodotScripts.includes("func live_pack_cards(game_state: Dictionary, pack_cards: Array)") && allGodotScripts.includes("func sync_focus_card(game_state: Dictionary, pack_cards: Array") && allGodotScripts.includes("func _apply_focus_state(card: Dictionary, game_state: Dictionary)"), "Pack page binder must expose live rendering and focus synchronization helpers");
assert(existsSync("godot-client/scripts/market_page_state_binder.gd") && script.includes("MarketPageStateBinderScript") && allGodotScripts.includes("class_name MarketPageStateBinder"), "Market page state must use a focused live-state binder module");
assert(script.includes("market_page_state_binder.live_market_rows(game_state, market_rows)") && script.includes("market_page_state_binder.market_visual_cards(game_state, market_rows)") && script.includes("for row in live_market_rows"), "Market page visual cards and rows must render from normalized live market state");
assert(script.includes("market_page_state_binder.sync_focus_listing(game_state, market_rows)") && script.includes("market_page_state_binder.sync_purchase_record(market_rows)") && script.includes("market_page_state_binder.sync_refresh_row(market_rows"), "Local market actions must synchronize rows through the binder");
assert(allGodotScripts.includes("func live_market_rows(game_state: Dictionary, market_rows: Array)") && allGodotScripts.includes("func market_visual_cards(game_state: Dictionary, market_rows: Array)") && allGodotScripts.includes("func sync_focus_listing(game_state: Dictionary, market_rows: Array)"), "Market page binder must expose live rendering and action synchronization helpers");
assert(existsSync("godot-client/scripts/role_equipment_state_binder.gd") && script.includes("RoleEquipmentStateBinderScript") && allGodotScripts.includes("class_name RoleEquipmentStateBinder"), "Role/equipment state must use a focused live-state binder module");
assert(script.includes("role_equipment_state_binder.live_role_state(game_state, paper_dolls)") && script.includes("_add_paper_doll_showcase(live_role_state)") && script.includes("for doll in live_paper_dolls"), "Role page paper doll showcase must render from normalized live role/equipment state");
assert(script.includes("role_equipment_state_binder.apply_accessory(game_state, paper_dolls") && script.includes("role_equipment_state_binder.apply_equipment_set(game_state, paper_dolls") && script.includes("role_equipment_state_binder.sync_active_paper_doll(game_state, paper_dolls)"), "Local role/equipment and backend state application must synchronize through the binder");
assert(allGodotScripts.includes("func live_role_state(game_state: Dictionary, paper_dolls: Array)") && allGodotScripts.includes("func sync_active_paper_doll(game_state: Dictionary, paper_dolls: Array)") && allGodotScripts.includes("func _normalized_equipment(equipment: Dictionary)"), "Role/equipment binder must expose live rendering, synchronization, and normalization helpers");
assert(existsSync("godot-client/scripts/inventory_skill_state_binder.gd") && script.includes("InventorySkillStateBinderScript") && allGodotScripts.includes("class_name InventorySkillStateBinder"), "Inventory/skill state must use a focused live-state binder module");
assert(script.includes("inventory_skill_state_binder.live_inventory_items(inventory_items)") && script.includes("inventory_skill_state_binder.inventory_visual_cards(live_inventory_items)") && script.includes("for item in live_inventory_items"), "Inventory page visual cards and rows must render from normalized live inventory state");
assert(script.includes("inventory_skill_state_binder.live_skill_rows(skill_rows)") && script.includes("inventory_skill_state_binder.skill_visual_cards(live_skill_rows)") && script.includes("for row in live_skill_rows"), "Skill page visual cards and rows must render from normalized live skill state");
assert(script.includes("inventory_skill_state_binder.sync_inventory_item(inventory_items") && script.includes("inventory_skill_state_binder.sync_skill_training(skill_rows)") && script.includes("inventory_skill_state_binder.sync_backend_lists(inventory_items, skill_rows)") && !script.includes("inventory_items.append({\"name\""), "Local inventory rewards, skill training, and backend list application must synchronize through the binder");
assert(allGodotScripts.includes("func live_inventory_items(inventory_items: Array)") && allGodotScripts.includes("func live_skill_rows(skill_rows: Array)") && allGodotScripts.includes("func sync_inventory_item(inventory_items: Array, item: Dictionary)") && allGodotScripts.includes("func _normalized_item(item: Dictionary)"), "Inventory/skill binder must expose live rendering, synchronization, and normalization helpers");
assert(existsSync("godot-client/scripts/challenge_guild_system_state_binder.gd") && script.includes("ChallengeGuildSystemStateBinderScript") && allGodotScripts.includes("class_name ChallengeGuildSystemStateBinder"), "Challenge/guild/system state must use a focused live-state binder module");
assert(script.includes("challenge_guild_system_state_binder.live_challenge_rows(game_state, boss_rows)") && script.includes("challenge_guild_system_state_binder.challenge_visual_cards(game_state, boss_rows)") && script.includes("for row: Array in live_challenge_rows"), "Challenge page visual cards and rows must render from normalized live challenge state");
assert(script.includes("challenge_guild_system_state_binder.guild_visual_cards(game_state)") && script.includes("challenge_guild_system_state_binder.live_guild_rows(game_state)") && script.includes("challenge_guild_system_state_binder.system_visual_cards(game_state)") && script.includes("challenge_guild_system_state_binder.live_system_rows(game_state)"), "Guild and system pages must render from normalized live state");
assert(script.includes("challenge_guild_system_state_binder.sync_challenge_state(game_state, boss_rows)") && script.includes("challenge_guild_system_state_binder.sync_guild_donation(game_state)") && script.includes("challenge_guild_system_state_binder.sync_guild_boss(game_state)") && script.includes("challenge_guild_system_state_binder.sync_system_toggle(game_state)"), "Local challenge, guild, and system hotspot actions must synchronize through the binder");
assert(allGodotScripts.includes("func live_challenge_rows(game_state: Dictionary, boss_rows: Array)") && allGodotScripts.includes("func live_guild_rows(game_state: Dictionary)") && allGodotScripts.includes("func live_system_rows(game_state: Dictionary)") && allGodotScripts.includes("func sync_system_toggle(game_state: Dictionary)"), "Challenge/guild/system binder must expose live rendering and synchronization helpers");
assert(!script.includes("\treturn\n\t_add_visual_grid(["), "Live-bound feature renderers must not retain unreachable fallback visual-grid blocks after return");
assert(script.includes("_build_home_hotspots") && script.includes("_apply_transparent_button_style"), "Locked home composite must keep transparent game interaction hotspots");
assert(script.includes("_build_page_hotspots") && script.includes("page_hotspot_buttons") && script.includes("_on_page_hotspot_pressed"), "Locked feature composite pages must keep transparent interaction hotspots");
for (const action of ["role_train", "role_equip", "role_apply_equipment", "role_train_once", "role_confirm_job", "role_apply_appearance", "pack_open_starter", "pack_shop", "pack_confirm_open", "pack_records", "pack_odds", "market_buy", "market_confirm_buy", "market_list", "market_confirm_list", "market_records", "market_rules", "market_refresh", "challenge_boss", "challenge_start", "challenge_finish", "challenge_records", "challenge_result", "challenge_ticket_shop", "guild_donate_view", "guild_boss_view", "guild_shop_view", "guild_donate", "guild_boss", "guild_shop", "guild_task", "system_graphics", "system_account", "system_toggle", "system_copy_id", "system_support", "system_logout", "inventory_detail", "inventory_materials", "inventory_sort", "inventory_equip", "inventory_craft", "inventory_use_item", "skill_upgrade_view", "skill_equip_view", "skill_tree_view", "skill_upgrade_confirm", "skill_equip_confirm", "skill_learn", "shop_detail", "shop_confirm", "shop_buy", "shop_go_inventory", "quest_detail", "quest_event", "quest_reward", "quest_claim_all", "quest_go_inventory", "ranking_challenge", "ranking_guild", "ranking_player", "ranking_add_friend", "ranking_message", "mail_detail", "mail_claim", "mail_announcement", "mail_claim_all", "mail_go_inventory", "mail_go_quests", "friends_invite_view", "friends_party_view", "friends_support_view", "friends_apply_party", "friends_set_support", "world_region", "world_stage", "world_dispatch", "world_send_dispatch", "account_start", "account_server", "account_settings", "account_enter", "account_create", "account_random", "account_create_confirm", "account_server_select", "account_server_refresh", "liveops_join", "liveops_tasks", "liveops_claim", "liveops_exchange", "liveops_ranking_reward", "feedback_submit", "feedback_back_system", "achievement_title", "achievement_claim", "achievement_back_role", "codex_region", "codex_card", "codex_back_world", "tutorial_next", "tutorial_back_home", "chat_send", "chat_invite_party", "chat_report", "chat_back_friends", "party_join", "party_create", "party_applications", "party_back_friends", "pet_feed", "pet_train", "pet_codex", "pet_back_role", "enhance_material", "enhance_confirm", "enhance_back_inventory", "arena_refresh", "arena_challenge", "arena_defense", "arena_back_challenge", "boss_preview_team", "boss_preview_go", "boss_preview_remind", "boss_preview_back_challenge", "dispatch_result_claim", "dispatch_result_back_world", "battle_stats_replay", "battle_stats_share", "battle_stats_back_challenge", "title_detail_back_achievements", "title_detail_equip", "title_detail_source", "codex_detail_back_codex", "codex_detail_route", "codex_detail_track", "appearance_collection_back_role", "appearance_collection_preview", "appearance_collection_equip", "appearance_collection_dye", "badge_collection_back_achievements", "badge_collection_equip", "badge_collection_set", "tutorial_battle_back_tutorial", "tutorial_battle_skill", "tutorial_battle_next", "tutorial_inventory_back_tutorial", "tutorial_inventory_item", "tutorial_inventory_next", "tutorial_skills_back_tutorial", "tutorial_skills_upgrade", "tutorial_skills_next", "tutorial_guild_back_tutorial", "tutorial_guild_entry", "tutorial_guild_finish"]) {
  assert(script.includes(action), `missing feature hotspot action: ${action}`);
}
assert(script.includes("_train_character") && script.includes("_confirm_job_change") && script.includes("_apply_role_appearance") && script.includes("_buy_market_item") && script.includes("_buy_shop_item") && script.includes("_claim_quest_rewards") && script.includes("_claim_mail_rewards") && script.includes("_complete_challenge_result") && script.includes("_donate_to_guild") && script.includes("_run_guild_boss"), "Feature hotspots must update local gameplay state");
assert(script.includes("page_composite_textures") && script.includes("pack_composite_textures") && script.includes("role_composite_textures") && script.includes("market_composite_textures") && script.includes("challenge_composite_textures") && script.includes("guild_composite_textures") && script.includes("system_composite_textures") && script.includes("inventory_composite_textures") && script.includes("skill_composite_textures") && script.includes("shop_composite_textures") && script.includes("quest_composite_textures") && script.includes("ranking_composite_textures") && script.includes("mail_composite_textures") && script.includes("friends_composite_textures") && script.includes("world_composite_textures") && script.includes("account_composite_textures") && script.includes("liveops_composite_textures") && script.includes("_current_composite_texture") && script.includes("_using_page_composite"), "Godot feature pages must render locked composite art before fallback prototype drawings");
assert(!script.includes("_render_home_page"), "Home must not render feature content below character display");

assert(!script.includes("OperatorSettlement") && !script.includes("tax workflow"), "Godot player UI must not show operator settlement or tax workflow copy");
assert(!script.includes('"禮包：%s"') && !script.includes('"交易進度 %d/3"'), "Godot home must not include pack ownership or trade progress labels");
assert(script.includes('page != "packs" and page != "market"') && script.includes("_draw_pack_stage"), "Pack stage labels must be scoped only to pack and market pages");

assert(
  artRoadmap.includes("Godot is not the art creation tool") &&
    artRoadmap.includes("Formal art must be imported as PNG") &&
    artRoadmap.includes("Male and female base paper dolls") &&
    artRoadmap.includes("SIMULATED_APPROVED"),
  "Art roadmap must enforce external-first original art production, Godot-only integration, paper dolls, and simulated payment scope",
);
assert(artToolchain.includes("Scenario") && artToolchain.includes("Layer AI") && artToolchain.includes("Makko AI") && artToolchain.includes("Krita") && artToolchain.includes("Aseprite"), "Art toolchain must name the proper art production tools");

const assetFiles = await listFiles("godot-client/assets");
assert(assetFiles.filter((path) => path.endsWith(".png")).length >= 20, "Godot placeholder PNG assets must remain available until replacement");
assert(assetFiles.filter((path) => path.endsWith(".svg")).length >= 20, "Godot placeholder SVG assets must remain available until replacement");

assert(readme.includes("Godot 4.x"), "Godot README must document engine version");
assert(project.includes('config/name="勇者傳說 Brave Legend"'), "Godot project must use the current visible game title");
assert(packageScript.includes("Play-Brave-Legend-Online.cmd") && packageScript.includes("lucky-pack-api-production.up.railway.app"), "Godot internal package must include online launcher");
assert(exportPresets.includes('name="Windows Desktop"') && exportPresets.includes("binary_format/embed_pck=true"), "Godot project must include Windows export preset with embedded pack");
assert(windowsPackageScript.includes("BraveLegend.exe") && windowsPackageScript.includes("https://lucky-pack-api-production.up.railway.app") && windowsPackageScript.includes("--api-base=$apiBase"), "Windows package must include online API launcher");

console.log("Godot prototype validation passed");
