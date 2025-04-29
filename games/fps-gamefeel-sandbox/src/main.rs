use bevy::prelude::*;
use bevy::pbr::AmbientLight;
use bevy_egui::{egui, EguiContexts, EguiPlugin, EguiContextPass};
use bevy::input::mouse::{MouseButton, MouseButtonInput};
use bevy::input::gamepad::{GamepadButton, GamepadEvent};
use bevy::input::keyboard::{KeyboardInput, KeyCode};
use bevy::input::ButtonState;

#[derive(Event, Debug, Clone)]
enum GameEvent {
    Jump,
    Fire,
    // Add more game events as needed
}

#[derive(Default, Resource)]
struct RecentInputEvents {
    events: Vec<String>,
}

#[derive(Default, Resource)]
struct RecentGameEvents {
    events: Vec<GameEvent>,
}

fn controls_system(
    mut keyboard_events: EventReader<KeyboardInput>,
    mut mouse_events: EventReader<MouseButtonInput>,
    mut gamepad_events: EventReader<GamepadEvent>,
    mut game_event_writer: EventWriter<GameEvent>,
    mut recent_input: ResMut<RecentInputEvents>,
) {
    // Keyboard
    for event in keyboard_events.read() {
        let key = format!("Keyboard: {:?}", event);
        recent_input.events.push(key);
        if let (KeyCode::Space, ButtonState::Pressed) = (event.key_code, event.state) {
            game_event_writer.write(GameEvent::Jump);
        }
    }
    // Mouse
    for event in mouse_events.read() {
        let mouse = format!("Mouse: {:?}", event);
        recent_input.events.push(mouse);
        if let(MouseButton::Left, ButtonState::Pressed) = (event.button, event.state) {
            game_event_writer.write(GameEvent::Fire);
        }
    }
    // Gamepad
    for event in gamepad_events.read() {
        let pad = format!("Gamepad: {:?}", event);
        recent_input.events.push(pad);
        match event {
            GamepadEvent::Button(event) => {
                // Jump: A button
                if event.button == GamepadButton::South && event.value > 0.5 {
                    game_event_writer.write(GameEvent::Jump);
                }
                // Fire: Right Trigger
                if event.button == GamepadButton::RightTrigger2 && event.value > 0.5 {
                    game_event_writer.write(GameEvent::Fire);
                }
            }
            _ => {}
        }
    }
    // Keep only last 5 input events
    let len = recent_input.events.len();
    if len > 5 {
        recent_input.events.drain(0..len - 5);
    }
}

fn game_event_collector_system(
    mut game_events: EventReader<GameEvent>,
    mut recent_game: ResMut<RecentGameEvents>,
) {
    for event in game_events.read() {
        recent_game.events.push(event.clone());
    }
    // Keep only last 5 game events
    let len = recent_game.events.len();
    if len > 5 {
        recent_game.events.drain(0..len - 5);
    }
}

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
    commands.spawn(Camera3d::default());
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
        .add_plugins(DefaultPlugins)
        .add_plugins(EguiPlugin { enable_multipass_for_primary_context: true })
        .init_resource::<RecentInputEvents>()
        .init_resource::<RecentGameEvents>()
        .add_event::<GameEvent>()
        .add_systems(Startup, setup_level)
        .add_systems(Update, controls_system)
        .add_systems(Update, game_event_collector_system)
        .add_systems(EguiContextPass, dev_ui_panel_system)
        .run();
} 
 