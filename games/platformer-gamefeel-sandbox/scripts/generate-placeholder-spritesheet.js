const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a canvas for our sprite sheet
const canvas = createCanvas(576, 32);
const ctx = canvas.getContext('2d');

// Colors for different states
const colors = {
  idle: ['#3498db', '#2980b9', '#1f6aa5', '#155391'], // Blue shades
  run: ['#2ecc71', '#27ae60', '#1e8449', '#1a7a3f', '#156f35', '#10652b', '#0b5a21', '#065017'], // Green shades
  jump: ['#f1c40f', '#f39c12', '#e67e22'], // Yellow to orange
  fall: ['#e67e22'], // Orange
  land: ['#e74c3c', '#c0392b'], // Red shades
};

// Draw each frame
let x = 0;
const frameWidth = 32;
const frameHeight = 32;

// Draw idle frames (4)
colors.idle.forEach((color, i) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, 0, frameWidth, frameHeight);
  x += frameWidth;
});

// Draw run frames (8)
colors.run.forEach((color, i) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, 0, frameWidth, frameHeight);
  x += frameWidth;
});

// Draw jump frames (3)
colors.jump.forEach((color, i) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, 0, frameWidth, frameHeight);
  x += frameWidth;
});

// Draw fall frame (1)
ctx.fillStyle = colors.fall[0];
ctx.fillRect(x, 0, frameWidth, frameHeight);
x += frameWidth;

// Draw land frames (2)
colors.land.forEach((color, i) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, 0, frameWidth, frameHeight);
  x += frameWidth;
});

// Save the sprite sheet
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/assets/player/player.png', buffer);

console.log('Placeholder sprite sheet generated successfully!'); 