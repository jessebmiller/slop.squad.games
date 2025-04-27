import Phaser from 'phaser';
import { PlayerState, PlayerInput } from '../player';

// Animation state definitions
export type AnimationState = 'idle' | 'run' | 'jump' | 'fall' | 'land';

// Frame configuration for each animation state
export interface AnimationConfig {
  key: string;
  frames: number;
  frameRate: number;
  repeat: number;
  yoyo?: boolean;
  startFrame: number; // Add this to track where each animation starts
}

// Animation configurations
export const ANIMATION_CONFIGS: Record<AnimationState, AnimationConfig> = {
  idle: {
    key: 'player-idle',
    frames: 4,
    frameRate: 8,
    repeat: -1, // -1 means infinite
    startFrame: 0, // Starts at frame 0
  },
  run: {
    key: 'player-run',
    frames: 8,
    frameRate: 12,
    repeat: -1,
    startFrame: 4, // Starts after idle (4 frames)
  },
  jump: {
    key: 'player-jump',
    frames: 3,
    frameRate: 10,
    repeat: 0, // Don't repeat jump animation
    startFrame: 12, // Starts after run (4 + 8 = 12 frames)
  },
  fall: {
    key: 'player-fall',
    frames: 1,
    frameRate: 10,
    repeat: -1,
    startFrame: 15, // Starts after jump (12 + 3 = 15 frames)
  },
  land: {
    key: 'player-land',
    frames: 2,
    frameRate: 12,
    repeat: 0,
    startFrame: 16, // Starts after fall (15 + 1 = 16 frames)
  },
};

// Helper function to create animations
export function createAnimations(scene: Phaser.Scene, textureKey: string): void {
  // Use a type-safe way to iterate over the configs
  (Object.keys(ANIMATION_CONFIGS) as AnimationState[]).forEach((state) => {
    const config = ANIMATION_CONFIGS[state];
    const frames = scene.anims.generateFrameNumbers(textureKey, {
      start: config.startFrame,
      end: config.startFrame + config.frames - 1,
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

  // Landing takes priority
  if (isOnGround && !wasOnGround) {
    return 'land';
  }

  // Jumping takes next priority
  if (isJumping) {
    return 'jump';
  }

  // Falling
  if (isFalling) {
    return 'fall';
  }

  // Running
  if (isMoving) {
    return 'run';
  }

  // Default to idle
  return 'idle';
} 