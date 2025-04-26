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

// Gamefeel parameters (designer adjustable)
let gravity = 1000;
let jumpStrength = -500;
let moveSpeed = 200;
let coyoteTimeMs = 120; // milliseconds

// Coyote time state
let coyoteTimer = 0;
let wasOnGround = false;
let prevJumpPressed = false;

function preload(this: Phaser.Scene) {
  // Placeholder: use a simple rectangle for the player
}

function create(this: Phaser.Scene) {
  // Create player first
  player = this.physics.add.sprite(400, 300, '');
  player.setDisplaySize(40, 60);
  player.setCollideWorldBounds(true);

  // Set initial gravity
  this.physics.world.gravity.y = gravity;

  // Create ground
  const ground = this.add.rectangle(400, 580, 800, 40, 0x888888);
  this.physics.add.existing(ground, true);

  // Additional platforms
  const platforms = [
    this.add.rectangle(200, 450, 120, 20, 0x8888ff),
    this.add.rectangle(600, 350, 120, 20, 0x88ff88),
    this.add.rectangle(400, 250, 120, 20, 0xff8888),
  ];
  platforms.forEach(platform => {
    this.physics.add.existing(platform, true);
  });

  // Add all colliders
  this.physics.add.collider(player, ground);
  platforms.forEach(platform => {
    this.physics.add.collider(player, platform);
  });

  // Create cursors
  cursors = this.input.keyboard?.createCursorKeys() ?? {};

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
  }, {
    setGravity: v => { gravity = v; },
    setJumpStrength: v => { jumpStrength = v; },
    setMoveSpeed: v => { moveSpeed = v; },
    setCoyoteTimeMs: v => { coyoteTimeMs = v; },
  });
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

  // Keyboard controls
  let jumpPressed = false;
  if (cursors) {
    if (cursors.left.isDown) {
      player.setVelocityX(-moveSpeed);
    } else if (cursors.right.isDown) {
      player.setVelocityX(moveSpeed);
    } else {
      player.setVelocityX(0);
    }
    jumpPressed = cursors.up.isDown;
  }

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

  // Jump logic with coyote time (edge detection)
  if (
    jumpPressed &&
    !prevJumpPressed && // just pressed
    coyoteTimer > 0 &&
    player.body
  ) {
    player.setVelocityY(jumpStrength);
    coyoteTimer = 0;
  }
  prevJumpPressed = jumpPressed;
  wasOnGround = onGround;
}

new Phaser.Game(config); 