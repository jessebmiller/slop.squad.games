use bevy::prelude::*;

#[derive(Event, Debug, Clone)]
pub enum GameEvent {
    Jump,
    Fire,
    Move(Vec2),  // x: left/right, y: forward/back
    Sprint(bool),
    Pause(bool),
    // Add more game events as needed
}

#[derive(Default, Resource)]
pub struct RecentInputEvents {
    pub events: Vec<String>,
}

#[derive(Default, Resource)]
pub struct RecentGameEvents {
    pub events: Vec<GameEvent>,
}

pub fn game_event_collector_system(
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