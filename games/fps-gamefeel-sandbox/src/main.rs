use bevy::prelude::*;
use bevy::pbr::AmbientLight;
use bevy_egui::{egui, EguiContexts, EguiPlugin, EguiContextPass};
use bevy::window::{CursorGrabMode, CursorOptions};

mod events;
mod controls;
mod player;

use events::{GameEvent, RecentInputEvents, RecentGameEvents, game_event_collector_system};
use controls::controls_system;
use player::{spawn_player, player_movement, player_look};

#[derive(Resource, Default, PartialEq)]
struct GameState {
    is_paused: bool,
}

fn handle_pause(
    mut game_events: EventReader<GameEvent>,
    mut game_state: ResMut<GameState>,
    mut windows: Query<&mut Window>,
) {
    for event in game_events.read() {
        if let GameEvent::Pause(pause) = event {
            game_state.is_paused = *pause;
            
            // Update cursor state
            for mut window in windows.iter_mut() {
                window.cursor_options.visible = *pause;
                window.cursor_options.grab_mode = if *pause {
                    CursorGrabMode::None
                } else {
                    CursorGrabMode::Confined
                };
            }
        }
    }
}

fn dev_ui_panel_system(
    mut contexts: EguiContexts,
    recent_input: Res<RecentInputEvents>,
    recent_game: Res<RecentGameEvents>,
    game_state: Res<GameState>,
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

fn toggle_cursor(
    mut windows: Query<&mut Window>,
    keyboard: Res<ButtonInput<KeyCode>>,
) {
    if keyboard.just_pressed(KeyCode::Escape) {
        for mut window in windows.iter_mut() {
            window.cursor_options.visible = !window.cursor_options.visible;
            window.cursor_options.grab_mode = if window.cursor_options.visible {
                CursorGrabMode::None
            } else {
                CursorGrabMode::Confined
            };
        }
    }
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                cursor_options: CursorOptions {
                    visible: false,
                    grab_mode: CursorGrabMode::Confined,
                    ..default()
                },
                ..default()
            }),
            ..default()
        }))
        .add_plugins(EguiPlugin { enable_multipass_for_primary_context: true })
        .init_resource::<RecentInputEvents>()
        .init_resource::<RecentGameEvents>()
        .init_resource::<GameState>()
        .add_event::<GameEvent>()
        .add_systems(Startup, (setup_level, spawn_player))
        .add_systems(Update, (
            controls_system,
            game_event_collector_system,
            handle_pause,
            player_movement.run_if(not(resource_equals(GameState { is_paused: true }))),
            player_look.run_if(not(resource_equals(GameState { is_paused: true }))),
        ))
        .add_systems(EguiContextPass, dev_ui_panel_system)
        .add_systems(Update, toggle_cursor)
        .run();
} 
 