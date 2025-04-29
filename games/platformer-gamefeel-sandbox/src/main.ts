import Phaser from 'phaser';
import { setupDesignerUI } from './designerUI';
import { createPlayer, updatePlayer, PlayerState, PlayerParameters } from './player';
import { getInputState } from './input';
import { createCameraState, setupCamera, updateCamera, CameraState, CameraParameters } from './camera';
import { saveCurrentConfig, getCurrentConfig, loadNamedConfig, getAllSavedConfigs, GameConfig } from './configStorage';
import { setupConfigUI } from './configUI';
import { DEFAULT_MATERIAL, ICE_MATERIAL, AIR_MATERIAL } from './materials';

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
  scale: 1.0,
  acceleration: 0.5,
  deceleration: 0.7,
  airAcceleration: 0.2,
  airDeceleration: 0.3,
  maxSpeed: 300,
  terminalVelocity: 500,
  // New movement parameters
  wallSlideSpeed: 100,
  wallJumpStrength: -400,
  wallJumpTimeMs: 200,
  wallJumpPushStrength: 300,
  doubleJumpStrength: -450,
  dashSpeed: 600,
  dashDurationMs: 150,
  dashCooldownMs: 500,
  groundPoundSpeed: 800,
  groundPoundBounceStrength: -300,
  groundPoundCooldownMs: 1000,
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

// Load saved config if it exists
const savedConfig = getCurrentConfig();
if (savedConfig) {
  Object.assign(playerParameters, savedConfig.player);
  Object.assign(cameraParameters, savedConfig.camera);
  if (savedConfig.materials) {
    Object.assign(DEFAULT_MATERIAL, savedConfig.materials.default);
    Object.assign(ICE_MATERIAL, savedConfig.materials.ice);
    Object.assign(AIR_MATERIAL, savedConfig.materials.air);
  }
}

function preload(this: Phaser.Scene) {
  // Load player sprite sheets
  this.load.spritesheet('idle', 'assets/player/Idle.png', {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet('walk', 'assets/player/Walk.png', {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet('sprint', 'assets/player/Sprint.png', {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet('jump', 'assets/player/Jump.png', {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet('land', 'assets/player/Land on Ground.png', {
    frameWidth: 128,
    frameHeight: 128,
  });
}

function create(this: Phaser.Scene) {
  // Set world bounds larger than the camera view
  const worldWidth = 2400;
  const worldHeight = 1200;
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

  // Create player
  const spawnHeight = 100 + (playerParameters.scale - 100); // Add extra height based on scale above 100
  playerState = createPlayer(this, 100, worldHeight - spawnHeight);

  // Create ground (spans the whole world)
  const ground = this.add.rectangle(worldWidth / 2, worldHeight - 20, worldWidth, 40, DEFAULT_MATERIAL.color);
  this.physics.add.existing(ground, true);
  ground.setData('material', DEFAULT_MATERIAL);

  // Additional platforms scattered throughout the level
  const platforms = [
    // Wall jump practice walls
    this.add.rectangle(300, worldHeight - 200, 20, 200, DEFAULT_MATERIAL.color),
    this.add.rectangle(500, worldHeight - 200, 20, 200, DEFAULT_MATERIAL.color),
    // Small platforms for jumping between walls
    this.add.rectangle(400, worldHeight - 300, 120, 20, DEFAULT_MATERIAL.color),
    // Higher walls for advanced practice
    this.add.rectangle(200, worldHeight - 400, 20, 200, DEFAULT_MATERIAL.color),
    this.add.rectangle(600, worldHeight - 400, 20, 200, DEFAULT_MATERIAL.color),
    // Final platform at the top
    this.add.rectangle(400, worldHeight - 500, 120, 20, DEFAULT_MATERIAL.color),
    // Original platforms
    this.add.rectangle(600, worldHeight - 350, 120, 20, DEFAULT_MATERIAL.color),
    this.add.rectangle(900, worldHeight - 500, 120, 20, DEFAULT_MATERIAL.color),
    this.add.rectangle(1200, worldHeight - 100, 320, 20, ICE_MATERIAL.color),
    this.add.rectangle(1500, worldHeight - 600, 120, 20, DEFAULT_MATERIAL.color),
    this.add.rectangle(1800, worldHeight - 400, 120, 20, DEFAULT_MATERIAL.color),
    this.add.rectangle(2100, worldHeight - 250, 120, 20, DEFAULT_MATERIAL.color),
    this.add.rectangle(400, worldHeight - 800, 120, 20, DEFAULT_MATERIAL.color),
    this.add.rectangle(1000, worldHeight - 900, 120, 20, DEFAULT_MATERIAL.color),
    this.add.rectangle(2000, worldHeight - 1000, 120, 20, DEFAULT_MATERIAL.color),
  ];
  platforms.forEach((platform, index) => {
    this.physics.add.existing(platform, true);
    // Set the fourth platform to ice material, others to default
    platform.setData('material', index === 8 ? ICE_MATERIAL : DEFAULT_MATERIAL);
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

  // Setup designer UI with config management
  setupDesignerUI(playerParameters, cameraParameters);
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