use bevy::prelude::*;
use bevy::input::mouse::{MouseButton, MouseButtonInput};
use bevy::input::gamepad::{GamepadButton, GamepadEvent, GamepadAxis};
use bevy::input::keyboard::{KeyboardInput, KeyCode};
use bevy::input::ButtonState;
use crate::events::GameEvent;

pub fn controls_system(
    keyboard: Res<ButtonInput<KeyCode>>,
    mut keyboard_events: EventReader<KeyboardInput>,
    mut mouse_events: EventReader<MouseButtonInput>,
    mut gamepad_events: EventReader<GamepadEvent>,
    mut game_event_writer: EventWriter<GameEvent>,
    mut recent_input: ResMut<crate::events::RecentInputEvents>,
) {
    // Handle continuous movement input
    let mut movement = Vec2::ZERO;
    if keyboard.pressed(KeyCode::KeyW) { movement.y += 1.0; }
    if keyboard.pressed(KeyCode::KeyS) { movement.y -= 1.0; }
    if keyboard.pressed(KeyCode::KeyA) { movement.x -= 1.0; }
    if keyboard.pressed(KeyCode::KeyD) { movement.x += 1.0; }
    
    if movement != Vec2::ZERO {
        game_event_writer.write(GameEvent::Move(movement.normalize()));
    }

    // Handle sprint
    game_event_writer.write(GameEvent::Sprint(keyboard.pressed(KeyCode::ShiftLeft)));

    // Keyboard events (for discrete actions)
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
                // Sprint: Left Shoulder
                if event.button == GamepadButton::LeftTrigger && event.value > 0.5 {
                    game_event_writer.write(GameEvent::Sprint(true));
                } else if event.button == GamepadButton::LeftTrigger && event.value < 0.5 {
                    game_event_writer.write(GameEvent::Sprint(false));
                }
            }
            GamepadEvent::Axis(event) => {
                // Movement from left stick
                match event.axis {
                    GamepadAxis::LeftStickX => {
                        let movement = Vec2::new(event.value, 0.0);
                        if movement.length() > 0.2 {
                            game_event_writer.write(GameEvent::Move(movement.normalize()));
                        }
                    },
                    GamepadAxis::LeftStickY => {
                        let movement = Vec2::new(0.0, event.value);
                        if movement.length() > 0.2 {
                            game_event_writer.write(GameEvent::Move(movement.normalize()));
                        }
                    }
                    _ => {}
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