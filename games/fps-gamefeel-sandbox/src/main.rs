use bevy::prelude::*;
use bevy::pbr::AmbientLight;
use bevy_egui::{egui, EguiContexts, EguiPlugin, EguiContextPass};

mod events;
mod controls;
mod player;

use events::{GameEvent, RecentInputEvents, RecentGameEvents, game_event_collector_system};
use controls::controls_system;
use player::{spawn_player, player_movement, player_look};

fn dev_ui_panel_system(
    mut contexts: EguiContexts,
    recent_input: Res<RecentInputEvents>,
    recent_game: Res<RecentGameEvents>,
) {
    egui::Window::new("Input Events").show(contexts.ctx_mut(), |ui| {
        ui.label("Recent Input Events:");
        ui.separator();
        for event in &recent_input.events {
            ui.label(event);
        }
    });
    egui::Window::new("Game Events").show(contexts.ctx_mut(), |ui| {
        ui.label("Recent Game Events:");
        ui.separator();
        for event in &recent_game.events {
            ui.label(format!("{:?}", event));
        }
    });
}

fn setup_level(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
) {
    // Spawn the scene
    commands.spawn(SceneRoot(asset_server.load(
        GltfAssetLabel::Scene(0).from_asset("lowpoly_fps_game_map/scene.gltf#Scene0")
    )));

    commands.spawn((
        AmbientLight {
            color: Color::WHITE,
            brightness: 0.5,
            ..default()
        },
    ));
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                cursor_options: bevy::window::CursorOptions {
                    visible: false,
                    grab_mode: bevy::window::CursorGrabMode::Locked,
                    ..default()
                },
                ..default()
            }),
            ..default()
        }))
        .add_plugins(EguiPlugin { enable_multipass_for_primary_context: true })
        .init_resource::<RecentInputEvents>()
        .init_resource::<RecentGameEvents>()
        .add_event::<GameEvent>()
        .add_systems(Startup, (setup_level, spawn_player))
        .add_systems(Update, (
            controls_system,
            game_event_collector_system,
            player_movement,
            player_look,
        ))
        .add_systems(EguiContextPass, dev_ui_panel_system)
        .run();
} 
 