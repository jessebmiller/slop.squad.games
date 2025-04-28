import Phaser from 'phaser';
import { AnimationState, createAnimations, getAnimationForState, ANIMATION_CONFIGS } from './player/animations';
import { Material, DEFAULT_MATERIAL, AIR_MATERIAL } from './materials';

// Add global debug function
declare global {
  interface Window {
    updateMaterialDebug: (material: string) => void;
    updateGravityDebug: (gravity: number) => void;
  }
}

export type PlayerState = {
  sprite: Phaser.Physics.Arcade.Sprite;
  coyoteTimer: number;
  wasOnGround: boolean;
  prevJumpPressed: boolean;
  jumpBufferTimer: number;
  currentAnimation: AnimationState;
  currentMaterial: Material | null;
  wallSliding: boolean;
  wallJumpDirection: number;
  wallJumpTimer: number;
  doubleJumpAvailable: boolean;
  dashAvailable: boolean;
  dashTimer: number;
  dashDirection: number;
  groundPoundAvailable: boolean;
  groundPoundTimer: number;
};

export type PlayerParameters = {
  gravity: number;
  jumpStrength: number;
  moveSpeed: number;
  coyoteTimeMs: number;
  jumpBufferTimeMs: number;
  jumpGravityMultiplier: number;
  scale: number;
  maxSpeed: number;
  terminalVelocity: number;
  acceleration: number;
  deceleration: number;
  airAcceleration: number;
  airDeceleration: number;
  wallSlideSpeed: number;
  wallJumpStrength: number;
  wallJumpTimeMs: number;
  wallJumpPushStrength: number;
  doubleJumpStrength: number;
  dashSpeed: number;
  dashDurationMs: number;
  dashCooldownMs: number;
  groundPoundSpeed: number;
  groundPoundBounceStrength: number;
  groundPoundCooldownMs: number;
};

export type PlayerInput = {
  left: boolean;
  right: boolean;
  jump: boolean;
  dash: boolean;
  groundPound: boolean;
  jumpBuffered: boolean;
  dashBuffered: boolean;
  groundPoundBuffered: boolean;
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
    currentMaterial: null,
    wallSliding: false,
    wallJumpDirection: 0,
    wallJumpTimer: 0,
    doubleJumpAvailable: true,
    dashAvailable: true,
    dashTimer: 0,
    dashDirection: 0,
    groundPoundAvailable: true,
    groundPoundTimer: 0,
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
  const onWall = !!(state.sprite.body && 
    ((state.sprite.body as Phaser.Physics.Arcade.Body).touching.left || 
     (state.sprite.body as Phaser.Physics.Arcade.Body).touching.right));

  // Update current material based on what we're touching
  if (state.sprite.body) {
    const body = state.sprite.body as Phaser.Physics.Arcade.Body;
    if (body.touching.down) {
      const platforms = scene.children.list.filter(
        child => child.getData('material') && child !== state.sprite
      ) as Phaser.GameObjects.GameObject[];
      
      for (const platform of platforms) {
        const platformBody = platform.body as Phaser.Physics.Arcade.Body;
        if (platformBody && body.touching.down) {
          const playerBottom = body.bottom;
          const platformTop = platformBody.top;
          const distance = Math.abs(playerBottom - platformTop);
          if (distance < 10) {
            state.currentMaterial = platform.getData('material');
            if (window.updateMaterialDebug && state.currentMaterial) {
              window.updateMaterialDebug(state.currentMaterial.type);
            }
            break;
          }
        }
      }
    } else {
      state.currentMaterial = null;
      if (window.updateMaterialDebug) {
        window.updateMaterialDebug('None');
      }
    }
  }

  // Reset movement abilities when landing
  if (onGround && !state.wasOnGround) {
    state.doubleJumpAvailable = true;
    state.dashAvailable = true;
    state.groundPoundAvailable = true;
    state.wallSliding = false;
  }

  // Coyote time logic
  let coyoteTimer = state.coyoteTimer;
  if (onGround) {
    coyoteTimer = parameters.coyoteTimeMs;
  } else if (coyoteTimer > 0) {
    coyoteTimer -= delta;
  }

  // Jump buffering logic
  let jumpBufferTimer = state.jumpBufferTimer;
  if (input.jumpBuffered) {
    jumpBufferTimer = parameters.jumpBufferTimeMs;
  } else if (jumpBufferTimer > 0) {
    jumpBufferTimer -= delta;
  }

  // Wall slide logic
  if (onWall && !onGround && (input.left || input.right)) {
    state.wallSliding = true;
    if (state.sprite.body) {
      const body = state.sprite.body as Phaser.Physics.Arcade.Body;
      body.setVelocityY(parameters.wallSlideSpeed);
    }
  } else {
    state.wallSliding = false;
  }

  // Wall jump logic
  if (state.wallSliding && input.jumpBuffered) {
    state.wallJumpDirection = (state.sprite.body as Phaser.Physics.Arcade.Body).touching.left ? 1 : -1;
    state.wallJumpTimer = parameters.wallJumpTimeMs;
    if (state.sprite.body) {
      const body = state.sprite.body as Phaser.Physics.Arcade.Body;
      body.setVelocityY(parameters.wallJumpStrength);
      body.setVelocityX(parameters.wallJumpPushStrength * state.wallJumpDirection);
    }
  }

  // Double jump logic
  if (!onGround && !state.wallSliding && input.jumpBuffered && state.doubleJumpAvailable) {
    state.doubleJumpAvailable = false;
    if (state.sprite.body) {
      const body = state.sprite.body as Phaser.Physics.Arcade.Body;
      body.setVelocityY(parameters.doubleJumpStrength);
    }
  }

  // Dash logic
  if (input.dashBuffered && state.dashAvailable && state.dashTimer <= 0) {
    state.dashAvailable = false;
    state.dashTimer = parameters.dashDurationMs;
    state.dashDirection = input.right ? 1 : (input.left ? -1 : 0);
    if (state.dashDirection === 0) {
      state.dashDirection = state.sprite.flipX ? -1 : 1;
    }
  }

  // Update dash timer and apply dash velocity
  if (state.dashTimer > 0) {
    state.dashTimer -= delta;
    if (state.sprite.body) {
      const body = state.sprite.body as Phaser.Physics.Arcade.Body;
      body.setVelocityX(parameters.dashSpeed * state.dashDirection);
      body.setVelocityY(0);
    }
  } else if (!state.dashAvailable && !onGround) {
    state.dashTimer = -parameters.dashCooldownMs;
  }

  // Ground pound logic
  if (input.groundPoundBuffered && state.groundPoundAvailable && state.groundPoundTimer <= 0) {
    state.groundPoundAvailable = false;
    state.groundPoundTimer = parameters.groundPoundCooldownMs;
    if (state.sprite.body) {
      const body = state.sprite.body as Phaser.Physics.Arcade.Body;
      body.setVelocityY(parameters.groundPoundSpeed);
    }
  }

  // Update ground pound timer
  if (state.groundPoundTimer > 0) {
    state.groundPoundTimer -= delta;
  }

  // Movement with momentum (only if not dashing)
  if (state.sprite.body && state.dashTimer <= 0) {
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
      const currentAcceleration = onGround 
        ? (state.currentMaterial?.acceleration ?? DEFAULT_MATERIAL.acceleration)
        : AIR_MATERIAL.acceleration;
      const accelerationAmount = currentAcceleration * delta;
      newVelocityX += direction * accelerationAmount;
      if (Math.sign(newVelocityX) === Math.sign(targetVelocityX) && 
          Math.abs(newVelocityX) > Math.abs(targetVelocityX)) {
        newVelocityX = targetVelocityX;
      }
    } else {
      // Stopping: decelerate
      const direction = -Math.sign(currentVelocityX);
      const currentDeceleration = onGround
        ? (state.currentMaterial?.deceleration ?? DEFAULT_MATERIAL.deceleration)
        : AIR_MATERIAL.deceleration;
      const decelerationAmount = currentDeceleration * delta;
      newVelocityX += direction * decelerationAmount;
      if (Math.sign(newVelocityX) !== Math.sign(currentVelocityX) || 
          Math.abs(newVelocityX) < 0.1) {
        newVelocityX = 0;
      }
    }
    
    // Apply friction only when there's no input
    if (targetVelocityX === 0) {
      if (onGround && state.currentMaterial) {
        newVelocityX *= state.currentMaterial.friction;
      } else if (!onGround) {
        newVelocityX *= AIR_MATERIAL.friction;
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

  // Variable jump height: apply jump gravity multiplier only while rising and jump is held
  if (state.sprite.body) {
    const body = state.sprite.body as Phaser.Physics.Arcade.Body;
    const rising = body.velocity.y < 0;
    
    // Set base gravity
    scene.physics.world.gravity.y = parameters.gravity;
    
    // If rising and holding jump, apply reduced gravity
    if (rising && input.jump) {
      scene.physics.world.gravity.y = parameters.gravity * parameters.jumpGravityMultiplier;
    }

    // Update gravity debug info
    if (window.updateGravityDebug) {
      window.updateGravityDebug(scene.physics.world.gravity.y);
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