import Phaser from 'phaser';

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

function preload(this: Phaser.Scene) {
  // Placeholder: use a simple rectangle for the player
}

function create(this: Phaser.Scene) {
  // Create player first
  player = this.physics.add.sprite(400, 300, '');
  player.setDisplaySize(40, 60);
  player.setCollideWorldBounds(true);

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
}

function update(this: Phaser.Scene) {
  // Keyboard controls
  if (cursors) {
    if (cursors.left.isDown) {
      player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
      player.setVelocityX(200);
    } else {
      player.setVelocityX(0);
    }
    if (cursors.up.isDown && player.body && (player.body as Phaser.Physics.Arcade.Body).touching.down) {
      player.setVelocityY(-500);
    }
  }

  // Gamepad controls
  if (pad) {
    // Left stick X axis
    const axisH = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
    if (axisH < -0.1) {
      player.setVelocityX(-200);
    } else if (axisH > 0.1) {
      player.setVelocityX(200);
    } else {
      player.setVelocityX(0);
    }
    // A button (index 0) for jump
    if (
      pad.buttons[0].pressed &&
      player.body &&
      (player.body as Phaser.Physics.Arcade.Body).touching.down
    ) {
      player.setVelocityY(-500);
    }
  }
}

new Phaser.Game(config); 