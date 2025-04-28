import Phaser from 'phaser';
import { PlayerState, PlayerInput } from '../player';

// Animation state definitions
export type AnimationState = 'idle' | 'run' | 'jump' | 'fall' | 'land' | 'wallSlide' | 'dash' | 'groundPound';

// Frame configuration for each animation state
export interface AnimationConfig {
  key: string;
  textureKey: string;
  frames: number;
  frameRate: number;
  repeat: number;
  yoyo?: boolean;
  startFrame?: number;
  endFrame?: number;
}

// Animation configurations
export const ANIMATION_CONFIGS: Record<AnimationState, AnimationConfig> = {
  idle: {
    key: 'player-idle',
    textureKey: 'idle',
    frames: 4,
    frameRate: 8,
    repeat: -1,
  },
  run: {
    key: 'player-run',
    textureKey: 'sprint',
    frames: 8,
    frameRate: 15,
    repeat: -1,
  },
  jump: {
    key: 'player-jump',
    textureKey: 'jump',
    frames: 4,
    frameRate: 10,
    repeat: 0,
  },
  fall: {
    key: 'player-fall',
    textureKey: 'jump',
    frames: 1,
    frameRate: 1,
    repeat: -1,
    startFrame: 4,
    endFrame: 4,
  },
  land: {
    key: 'player-land',
    textureKey: 'land',
    frames: 4,
    frameRate: 12,
    repeat: 0,
  },
  wallSlide: {
    key: 'player-wallSlide',
    textureKey: 'jump',
    frames: 1,
    frameRate: 1,
    repeat: -1,
    startFrame: 4,
    endFrame: 4,
  },
  dash: {
    key: 'player-dash',
    textureKey: 'sprint',
    frames: 1,
    frameRate: 1,
    repeat: -1,
    startFrame: 4,
    endFrame: 4,
  },
  groundPound: {
    key: 'player-groundPound',
    textureKey: 'jump',
    frames: 1,
    frameRate: 1,
    repeat: -1,
    startFrame: 4,
    endFrame: 4,
  },
};

// Helper function to create animations
export function createAnimations(scene: Phaser.Scene): void {
  // Use a type-safe way to iterate over the configs
  (Object.keys(ANIMATION_CONFIGS) as AnimationState[]).forEach((state) => {
    const config = ANIMATION_CONFIGS[state];
    const frames = scene.anims.generateFrameNumbers(config.textureKey, {
      start: config.startFrame ?? 0,
      end: config.endFrame ?? config.frames - 1,
    });

    scene.anims.create({
      key: config.key,
      frames,
      frameRate: config.frameRate,
      repeat: config.repeat,
      yoyo: config.yoyo,
    });
  });
}

// Helper function to get the appropriate animation based on player state
export function getAnimationForState(
  state: PlayerState,
  input: PlayerInput,
  wasOnGround: boolean
): AnimationState {
  if (!state.sprite.body) return 'idle';
  
  const body = state.sprite.body as Phaser.Physics.Arcade.Body;
  const isMoving = Math.abs(body.velocity.x) > 0.1;
  const isFalling = body.velocity.y > 0 && !body.touching.down;
  const isJumping = body.velocity.y < 0 && !body.touching.down;
  const isOnGround = body.touching.down;
  const isActivelyMoving = (input.left || input.right) && isMoving;

  // Ground pound takes priority
  if (state.groundPoundTimer > 0) {
    return 'groundPound';
  }

  // Dash takes next priority
  if (state.dashTimer > 0) {
    return 'dash';
  }

  // Wall slide takes next priority
  if (state.wallSliding) {
    return 'wallSlide';
  }

  // Landing takes next priority
  if (isOnGround && !wasOnGround) {
    return 'land';
  }

  // Jumping takes next priority
  if (isJumping) {
    return 'jump';
  }

  // Falling state
  if (isFalling) {
    return 'fall';
  }

  // Running on ground only when actively moving
  if (isActivelyMoving && isOnGround) {
    return 'run';
  }

  // Default to idle
  return 'idle';
} 