use bevy::prelude::*;
use crate::events::GameEvent;
use bevy::input::mouse::MouseMotion;

// Player components
#[derive(Component)]
pub struct Player {
    pub walk_speed: f32,
    pub run_speed: f32,
    pub jump_force: f32,
    pub mouse_sensitivity: f32,
}

#[derive(Component)]
pub struct PlayerCamera;

impl Default for Player {
    fn default() -> Self {
        Self {
            walk_speed: 5.0,
            run_speed: 10.0,
            jump_force: 5.0,
            mouse_sensitivity: 0.1,
        }
    }
}

pub fn spawn_player(mut commands: Commands) {
    // Spawn player entity
    let player = commands.spawn((
        Player::default(),
        Transform::from_xyz(0.0, 1.0, 0.0),
        GlobalTransform::default(),
    )).id();

    // Spawn camera as child of player
    commands.entity(player).with_children(|parent| {
        parent.spawn((
            Camera3d {
                ..default()
            },
            Transform::from_xyz(0.0, 0.0, 0.0),
            GlobalTransform::default(),
        ));
    });
}

pub fn player_movement(
    time: Res<Time>,
    mut game_events: EventReader<GameEvent>,
    mut player_query: Query<(&Player, &mut Transform)>,
) {
    let (player, mut transform) = match player_query.single_mut() {
        Ok(result) => result,
        Err(_) => return,
    };

    let mut movement = Vec3::ZERO;
    let mut is_sprinting = false;

    // Process all events
    for event in game_events.read() {
        match event {
            GameEvent::Move(move_input) => {
                // Convert input Vec2 to Vec3 in world space
                let forward = transform.forward() * move_input.y;
                let right = transform.right() * move_input.x;
                movement += forward + right;
            }
            GameEvent::Sprint(sprint) => {
                is_sprinting = *sprint;
            }
            _ => {}
        }
    }

    if movement != Vec3::ZERO {
        let speed = if is_sprinting {
            player.run_speed
        } else {
            player.walk_speed
        };
        movement = movement.normalize() * speed * time.delta_secs();
        transform.translation += movement;
    }
}

pub fn player_look(
    mut mouse_motion: EventReader<MouseMotion>,
    mut query_set: ParamSet<(
        Query<(&Player, &mut Transform)>,
        Query<&mut Transform, With<Camera3d>>,
    )>,
) {

    let mut delta = Vec2::ZERO;
    for motion in mouse_motion.read() {
        delta += motion.delta;
    }

    if delta != Vec2::ZERO {
        // Rotate player around Y axis (yaw)
        let mut player_query = query_set.p0();
        let (player, mut player_transform) = match player_query.single_mut() {
            Ok(result) => result,
            Err(_) => return,
        };
        let mouse_sensitivity = player.mouse_sensitivity;
        player_transform.rotate_y(-delta.x * mouse_sensitivity * 0.01);

        // Rotate camera around X axis (pitch)
        let mut camera_query = query_set.p1();
        let mut camera_transform = match camera_query.single_mut() {
            Ok(result) => result,
            Err(_) => return,
        };
        let mut camera_rotation = camera_transform.rotation;
        let pitch = (camera_rotation.to_euler(EulerRot::YXZ).1 - delta.y * mouse_sensitivity * 0.01)
            .clamp(-std::f32::consts::FRAC_PI_2 + 0.1, std::f32::consts::FRAC_PI_2 - 0.1);
        camera_rotation = Quat::from_euler(EulerRot::YXZ, 0.0, pitch, 0.0);
        camera_transform.rotation = camera_rotation;
    }
} 