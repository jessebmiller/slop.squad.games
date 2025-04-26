import Phaser from 'phaser';
import { setupDesignerUI } from './designerUI';

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

let player!: Phaser.Physics.Arcade.Sprite;
let cursors: any;
let pad: Phaser.Input.Gamepad.Gamepad | null = null;
let keyA: Phaser.Input.Keyboard.Key;
let keyD: Phaser.Input.Keyboard.Key;
let keySpace: Phaser.Input.Keyboard.Key;

// Gamefeel parameters (designer adjustable)
let gravity = 1000;
let jumpStrength = -500;
let moveSpeed = 200;
let coyoteTimeMs = 120; // milliseconds
let jumpBufferTimeMs = 150; // milliseconds
let jumpGravityMultiplier = 0.6; // Only applies while rising and jump is held

// Coyote time state
let coyoteTimer = 0;
let wasOnGround = false;
let prevJumpPressed = false;
// Jump buffer state
let jumpBufferTimer = 0;

function preload(this: Phaser.Scene) {
  // Placeholder: use a simple rectangle for the player
}

function create(this: Phaser.Scene) {
  // Set world bounds larger than the camera view
  const worldWidth = 2400;
  const worldHeight = 1200;
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

  // Create player near the left side
  player = this.physics.add.sprite(100, worldHeight - 100, '');
  player.setDisplaySize(40, 60);
  player.setCollideWorldBounds(true);

  // Set initial gravity
  this.physics.world.gravity.y = gravity;

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
  this.physics.add.collider(player, ground);
  platforms.forEach(platform => {
    this.physics.add.collider(player, platform);
  });

  // Create WASD and Space keys
  keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Listen for gamepad connection
  const result = this.input.gamepad?.once('connected', (padObj: Phaser.Input.Gamepad.Gamepad) => {
    console.log('Gamepad connected');
    pad = padObj;
  });
  console.log(result);
  console.log(this.input.gamepad);

  setupDesignerUI(this, {
    gravity: () => gravity,
    jumpStrength: () => jumpStrength,
    moveSpeed: () => moveSpeed,
    coyoteTimeMs: () => coyoteTimeMs,
    jumpBufferTimeMs: () => jumpBufferTimeMs,
    jumpGravityMultiplier: () => jumpGravityMultiplier,
  }, {
    setGravity: v => { gravity = v; },
    setJumpStrength: v => { jumpStrength = v; },
    setMoveSpeed: v => { moveSpeed = v; },
    setCoyoteTimeMs: v => { coyoteTimeMs = v; },
    setJumpBufferTimeMs: v => { jumpBufferTimeMs = v; },
    setJumpGravityMultiplier: v => { jumpGravityMultiplier = v; },
  });

  // Camera follows the player and is clamped to world bounds
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
  this.cameras.main.setRoundPixels(true);
}

function update(this: Phaser.Scene, time: number, delta: number) {
  // Track if player is on ground
  const onGround = !!(player.body && (player.body as Phaser.Physics.Arcade.Body).touching.down);

  // Coyote time logic
  if (onGround) {
    coyoteTimer = coyoteTimeMs;
  } else if (coyoteTimer > 0) {
    coyoteTimer -= delta;
  }

  // Keyboard controls (A/D for left/right, Space for jump)
  let jumpPressed = false;
  if (keyA.isDown) {
    player.setVelocityX(-moveSpeed);
  } else if (keyD.isDown) {
    player.setVelocityX(moveSpeed);
  } else {
    player.setVelocityX(0);
  }
  jumpPressed = keySpace.isDown;

  // Gamepad controls
  if (pad) {
    const axisH = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
    if (axisH < -0.1) {
      player.setVelocityX(-moveSpeed);
    } else if (axisH > 0.1) {
      player.setVelocityX(moveSpeed);
    } else {
      player.setVelocityX(0);
    }
    if (pad.buttons[0].pressed) {
      jumpPressed = true;
    }
  }

  // Jump buffering logic
  if (jumpPressed && !prevJumpPressed) {
    jumpBufferTimer = jumpBufferTimeMs;
  } else if (jumpBufferTimer > 0) {
    jumpBufferTimer -= delta;
  }

  // Jump logic with coyote time and jump buffer
  if (
    jumpBufferTimer > 0 &&
    coyoteTimer > 0 &&
    player.body
  ) {
    player.setVelocityY(jumpStrength);
    coyoteTimer = 0;
    jumpBufferTimer = 0;
  }

  // Gravity tweak: apply jump gravity multiplier only while rising and jump is held
  if (player.body) {
    const body = player.body as Phaser.Physics.Arcade.Body;
    const rising = body.velocity.y < 0;
    if (rising && prevJumpPressed) {
      body.setAccelerationY(gravity * (jumpGravityMultiplier - 1));
      this.physics.world.gravity.y = gravity * jumpGravityMultiplier;
    } else {
      body.setAccelerationY(0);
      this.physics.world.gravity.y = gravity;
    }
  }

  prevJumpPressed = jumpPressed;
  wasOnGround = onGround;
}

new Phaser.Game(config); 