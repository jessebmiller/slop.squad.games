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
};

let player!: Phaser.Physics.Arcade.Sprite;
let cursors: any;

function preload(this: Phaser.Scene) {
  // Placeholder: use a simple rectangle for the player
}

function create(this: Phaser.Scene) {
  // Create ground
  const ground = this.add.rectangle(400, 580, 800, 40, 0x888888);
  this.physics.add.existing(ground, true);

  // Create player
  player = this.physics.add.sprite(400, 300, '');
  player.setDisplaySize(40, 60);
  player.setCollideWorldBounds(true);

  // Add collision
  this.physics.add.collider(player, ground);

  // Create cursors
  cursors = this.input.keyboard?.createCursorKeys() ?? {};
}

function update(this: Phaser.Scene) {
  // Basic left/right/jump controls
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
}

new Phaser.Game(config); 