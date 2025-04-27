import Phaser from 'phaser';
import { setupDesignerUI } from './designerUI';
import { createPlayer, updatePlayer, PlayerState, PlayerParameters } from './player';
import { getInputState } from './input';
import { createCameraState, setupCamera, updateCamera, CameraState, CameraParameters } from './camera';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1d1d1d',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 1000 },
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
  input: {
    gamepad: true
  },
};

let playerState!: PlayerState;
let cameraState!: CameraState;
let pad: Phaser.Input.Gamepad.Gamepad | null = null;

// Gamefeel parameters (designer adjustable)
const playerParameters: PlayerParameters = {
  gravity: 1000,
  jumpStrength: -500,
  moveSpeed: 200,
  coyoteTimeMs: 120,
  jumpBufferTimeMs: 150,
  jumpGravityMultiplier: 0.6,
};

// Camera parameters (designer adjustable)
const cameraParameters: CameraParameters = {
  lerpX: 0.12,
  lerpY: 0.12,
  deadzoneWidth: 200,
  deadzoneHeight: 150,
  lookaheadX: 120,
  lookaheadY: 60,
  lookaheadSmoothingX: 0.15,
  lookaheadSmoothingY: 0.15,
  lookaheadThresholdX: 5,
  lookaheadThresholdY: 5,
};

function preload(this: Phaser.Scene) {
  // Placeholder: use a simple rectangle for the player
}

function create(this: Phaser.Scene) {
  // Set world bounds larger than the camera view
  const worldWidth = 2400;
  const worldHeight = 1200;
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

  // Create player
  playerState = createPlayer(this, 100, worldHeight - 100);

  // Create ground (spans the whole world)
  const ground = this.add.rectangle(worldWidth / 2, worldHeight - 20, worldWidth, 40, 0x888888);
  this.physics.add.existing(ground, true);

  // Additional platforms scattered throughout the level
  const platforms = [
    this.add.rectangle(300, worldHeight - 200, 120, 20, 0x8888ff),
    this.add.rectangle(600, worldHeight - 350, 120, 20, 0x88ff88),
    this.add.rectangle(900, worldHeight - 500, 120, 20, 0xff8888),
    this.add.rectangle(1200, worldHeight - 300, 120, 20, 0xffff88),
    this.add.rectangle(1500, worldHeight - 600, 120, 20, 0x88ffff),
    this.add.rectangle(1800, worldHeight - 400, 120, 20, 0xff88ff),
    this.add.rectangle(2100, worldHeight - 250, 120, 20, 0x88ff44),
    this.add.rectangle(400, worldHeight - 800, 120, 20, 0xff4444),
    this.add.rectangle(1000, worldHeight - 900, 120, 20, 0x44ff44),
    this.add.rectangle(2000, worldHeight - 1000, 120, 20, 0x4444ff),
  ];
  platforms.forEach(platform => {
    this.physics.add.existing(platform, true);
  });

  // Add all colliders
  this.physics.add.collider(playerState.sprite, ground);
  platforms.forEach(platform => {
    this.physics.add.collider(playerState.sprite, platform);
  });

  // Listen for gamepad connection
  this.input.gamepad?.once('connected', (padObj: Phaser.Input.Gamepad.Gamepad) => {
    console.log('Gamepad connected');
    pad = padObj;
  });

  // Setup camera
  cameraState = createCameraState(this);
  setupCamera(this, playerState.sprite, cameraParameters);

  setupDesignerUI(this, {
    gravity: () => playerParameters.gravity,
    jumpStrength: () => playerParameters.jumpStrength,
    moveSpeed: () => playerParameters.moveSpeed,
    coyoteTimeMs: () => playerParameters.coyoteTimeMs,
    jumpBufferTimeMs: () => playerParameters.jumpBufferTimeMs,
    jumpGravityMultiplier: () => playerParameters.jumpGravityMultiplier,
    cameraLerpX: () => cameraParameters.lerpX,
    cameraLerpY: () => cameraParameters.lerpY,
    cameraDeadzoneWidth: () => cameraParameters.deadzoneWidth,
    cameraDeadzoneHeight: () => cameraParameters.deadzoneHeight,
    cameraLookaheadX: () => cameraParameters.lookaheadX,
    cameraLookaheadY: () => cameraParameters.lookaheadY,
    cameraLookaheadSmoothingX: () => cameraParameters.lookaheadSmoothingX,
    cameraLookaheadSmoothingY: () => cameraParameters.lookaheadSmoothingY,
    cameraLookaheadThresholdX: () => cameraParameters.lookaheadThresholdX,
    cameraLookaheadThresholdY: () => cameraParameters.lookaheadThresholdY,
  }, {
    setGravity: v => { playerParameters.gravity = v; },
    setJumpStrength: v => { playerParameters.jumpStrength = v; },
    setMoveSpeed: v => { playerParameters.moveSpeed = v; },
    setCoyoteTimeMs: v => { playerParameters.coyoteTimeMs = v; },
    setJumpBufferTimeMs: v => { playerParameters.jumpBufferTimeMs = v; },
    setJumpGravityMultiplier: v => { playerParameters.jumpGravityMultiplier = v; },
    setCameraLerpX: v => { cameraParameters.lerpX = v; },
    setCameraLerpY: v => { cameraParameters.lerpY = v; },
    setCameraDeadzoneWidth: v => { cameraParameters.deadzoneWidth = v; },
    setCameraDeadzoneHeight: v => { cameraParameters.deadzoneHeight = v; },
    setCameraLookaheadX: v => { cameraParameters.lookaheadX = v; },
    setCameraLookaheadY: v => { cameraParameters.lookaheadY = v; },
    setCameraLookaheadSmoothingX: v => { cameraParameters.lookaheadSmoothingX = v; },
    setCameraLookaheadSmoothingY: v => { cameraParameters.lookaheadSmoothingY = v; },
    setCameraLookaheadThresholdX: v => { cameraParameters.lookaheadThresholdX = v; },
    setCameraLookaheadThresholdY: v => { cameraParameters.lookaheadThresholdY = v; },
  });
}

function update(this: Phaser.Scene, time: number, delta: number) {
  // Get current input state
  const input = getInputState(this, pad);

  // Update player
  playerState = updatePlayer(playerState, delta, playerParameters, input, this);

  // Update camera
  cameraState = updateCamera(
    cameraState,
    this,
    playerState.sprite,
    cameraParameters,
    playerParameters.moveSpeed
  );
}

new Phaser.Game(config); 