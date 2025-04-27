import Phaser from 'phaser';

export type PlayerState = {
  sprite: Phaser.Physics.Arcade.Sprite;
  coyoteTimer: number;
  wasOnGround: boolean;
  prevJumpPressed: boolean;
  jumpBufferTimer: number;
};

export type PlayerParameters = {
  gravity: number;
  jumpStrength: number;
  moveSpeed: number;
  coyoteTimeMs: number;
  jumpBufferTimeMs: number;
  jumpGravityMultiplier: number;
};

export type PlayerInput = {
  left: boolean;
  right: boolean;
  jump: boolean;
};

export const createPlayer = (scene: Phaser.Scene, x: number, y: number): PlayerState => {
  const sprite = scene.physics.add.sprite(x, y, '');
  sprite.setDisplaySize(40, 60);
  sprite.setCollideWorldBounds(true);

  return {
    sprite,
    coyoteTimer: 0,
    wasOnGround: false,
    prevJumpPressed: false,
    jumpBufferTimer: 0,
  };
};

export const updatePlayer = (
  state: PlayerState,
  delta: number,
  parameters: PlayerParameters,
  input: PlayerInput,
  scene: Phaser.Scene
): PlayerState => {
  const onGround = !!(state.sprite.body && (state.sprite.body as Phaser.Physics.Arcade.Body).touching.down);

  // Coyote time logic
  let coyoteTimer = state.coyoteTimer;
  if (onGround) {
    coyoteTimer = parameters.coyoteTimeMs;
  } else if (coyoteTimer > 0) {
    coyoteTimer -= delta;
  }

  // Jump buffering logic
  let jumpBufferTimer = state.jumpBufferTimer;
  if (input.jump && !state.prevJumpPressed) {
    jumpBufferTimer = parameters.jumpBufferTimeMs;
  } else if (jumpBufferTimer > 0) {
    jumpBufferTimer -= delta;
  }

  // Movement
  if (input.left) {
    state.sprite.setVelocityX(-parameters.moveSpeed);
  } else if (input.right) {
    state.sprite.setVelocityX(parameters.moveSpeed);
  } else {
    state.sprite.setVelocityX(0);
  }

  // Jump logic with coyote time and jump buffer
  if (jumpBufferTimer > 0 && coyoteTimer > 0 && state.sprite.body) {
    state.sprite.setVelocityY(parameters.jumpStrength);
    coyoteTimer = 0;
    jumpBufferTimer = 0;
  }

  // Gravity tweak: apply jump gravity multiplier only while rising and jump is held
  if (state.sprite.body) {
    const body = state.sprite.body as Phaser.Physics.Arcade.Body;
    const rising = body.velocity.y < 0;
    if (rising && state.prevJumpPressed) {
      body.setAccelerationY(parameters.gravity * (parameters.jumpGravityMultiplier - 1));
      scene.physics.world.gravity.y = parameters.gravity * parameters.jumpGravityMultiplier;
    } else {
      body.setAccelerationY(0);
      scene.physics.world.gravity.y = parameters.gravity;
    }
  }

  return {
    ...state,
    coyoteTimer,
    wasOnGround: onGround,
    prevJumpPressed: input.jump,
    jumpBufferTimer,
  };
}; 