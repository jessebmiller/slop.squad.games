import Phaser from 'phaser';
import { Material } from '../materials';
import { AnimationState } from './animations';

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