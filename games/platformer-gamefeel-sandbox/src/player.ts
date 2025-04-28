import Phaser from 'phaser';
import { AnimationState, createAnimations, getAnimationForState, ANIMATION_CONFIGS } from './player/animations';

export type PlayerState = {
  sprite: Phaser.Physics.Arcade.Sprite;
  coyoteTimer: number;
  wasOnGround: boolean;
  prevJumpPressed: boolean;
  jumpBufferTimer: number;
  currentAnimation: AnimationState;
};

export type PlayerParameters = {
  gravity: number;
  jumpStrength: number;
  moveSpeed: number;
  coyoteTimeMs: number;
  jumpBufferTimeMs: number;
  jumpGravityMultiplier: number;
  scale: number;
  acceleration: number;
  deceleration: number;
  airAcceleration: number;
  airDeceleration: number;
  maxSpeed: number;
  terminalVelocity: number;
};

export type PlayerInput = {
  left: boolean;
  right: boolean;
  jump: boolean;
};

export const createPlayer = (
    scene: Phaser.Scene,
    x: number,
    y: number,
): PlayerState => {
  // Create the sprite with the idle texture
  const sprite = scene.physics.add.sprite(x, y, 'idle');
  
  // Set display size to match sprite frame size
  sprite.setDisplaySize(128, 128);
  
  // Adjust the physics body to match the actual character size (18x44)
  if (sprite.body) {
    const body = sprite.body as Phaser.Physics.Arcade.Body;
    
    // Set the body size to match the character (18x44)
    body.setSize(14, 44);
    body.setOffset(57, 46);
    
    // Initialize velocity to 0
    body.setVelocity(0, 0);
  }
  
  sprite.setCollideWorldBounds(true);

  // Create all animations
  createAnimations(scene);

  // Start with idle animation
  sprite.play('player-idle');

  return {
    sprite,
    coyoteTimer: 0,
    wasOnGround: false,
    prevJumpPressed: false,
    jumpBufferTimer: 0,
    currentAnimation: 'idle',
  };
};

export const updatePlayer = (
  state: PlayerState,
  delta: number,
  parameters: PlayerParameters,
  input: PlayerInput,
  scene: Phaser.Scene
): PlayerState => {
  state.sprite.setScale(parameters.scale / 100);
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

  // Movement with momentum
  if (state.sprite.body) {
    const body = state.sprite.body as Phaser.Physics.Arcade.Body;
    const currentVelocityX = body.velocity.x;
    
    // Calculate target velocity based on input
    let targetVelocityX = 0;
    if (input.left) {
      targetVelocityX = -parameters.moveSpeed;
      state.sprite.setFlipX(true);
    } else if (input.right) {
      targetVelocityX = parameters.moveSpeed;
      state.sprite.setFlipX(false);
    }
    
    // Simple momentum: gradually move towards target velocity
    let newVelocityX = currentVelocityX;
    if (targetVelocityX !== 0) {
      // Moving: accelerate towards target
      const direction = Math.sign(targetVelocityX - currentVelocityX);
      newVelocityX += direction * parameters.acceleration * delta;
      // Don't overshoot the target
      if (Math.sign(newVelocityX) === Math.sign(targetVelocityX) && 
          Math.abs(newVelocityX) > Math.abs(targetVelocityX)) {
        newVelocityX = targetVelocityX;
      }
    } else {
      // Stopping: decelerate
      const direction = -Math.sign(currentVelocityX);
      newVelocityX += direction * parameters.deceleration * delta;
      // Stop if we've changed direction or are very slow
      if (Math.sign(newVelocityX) !== Math.sign(currentVelocityX) || 
          Math.abs(newVelocityX) < 0.1) {
        newVelocityX = 0;
      }
    }
    
    body.setVelocityX(newVelocityX);
    
    // Apply terminal velocity for falling
    if (body.velocity.y > parameters.terminalVelocity) {
      body.setVelocityY(parameters.terminalVelocity);
    }
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

  // Update animation
  const newAnimation = getAnimationForState(state, input, state.wasOnGround);
  if (newAnimation !== state.currentAnimation) {
    const config = ANIMATION_CONFIGS[newAnimation];
    state.sprite.play(config.key);
    state.currentAnimation = newAnimation;
  }

  return {
    ...state,
    coyoteTimer,
    wasOnGround: onGround,
    prevJumpPressed: input.jump,
    jumpBufferTimer,
  };
}; 