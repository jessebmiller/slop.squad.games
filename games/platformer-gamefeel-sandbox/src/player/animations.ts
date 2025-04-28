import Phaser from 'phaser';
import { PlayerState, PlayerInput } from '../player';

// Animation state definitions
export type AnimationState = 'idle' | 'walk' | 'sprint' | 'jump' | 'land';

// Frame configuration for each animation state
export interface AnimationConfig {
  key: string;
  textureKey: string;
  frames: number;
  frameRate: number;
  repeat: number;
  yoyo?: boolean;
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
  walk: {
    key: 'player-walk',
    textureKey: 'walk',
    frames: 8,
    frameRate: 12,
    repeat: -1,
  },
  sprint: {
    key: 'player-sprint',
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
  land: {
    key: 'player-land',
    textureKey: 'land',
    frames: 4,
    frameRate: 12,
    repeat: 0,
  },
};

// Helper function to create animations
export function createAnimations(scene: Phaser.Scene): void {
  // Use a type-safe way to iterate over the configs
  (Object.keys(ANIMATION_CONFIGS) as AnimationState[]).forEach((state) => {
    const config = ANIMATION_CONFIGS[state];
    const frames = scene.anims.generateFrameNumbers(config.textureKey, {
      start: 0,
      end: config.frames - 1,
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
  const isFalling = body.velocity.y > 0;
  const isJumping = body.velocity.y < 0;
  const isOnGround = body.touching.down;
  const isSprinting = isMoving && input.jump; // Using jump button for sprint

  // Landing takes priority
  if (isOnGround && !wasOnGround) {
    return 'land';
  }

  // Jumping takes next priority
  if (isJumping) {
    return 'jump';
  }

  // Sprinting
  if (isSprinting) {
    return 'sprint';
  }

  // Walking
  if (isMoving) {
    return 'walk';
  }

  // Default to idle
  return 'idle';
} 