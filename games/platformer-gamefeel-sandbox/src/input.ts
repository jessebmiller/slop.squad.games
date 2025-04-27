import Phaser from 'phaser';
import { PlayerInput } from './player';

export const getInputState = (scene: Phaser.Scene, pad: Phaser.Input.Gamepad.Gamepad | null): PlayerInput => {
  const keyA = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  const keyD = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  const keySpace = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  let left = false;
  let right = false;
  let jump = false;

  // Keyboard input
  if (keyA?.isDown) left = true;
  if (keyD?.isDown) right = true;
  if (keySpace?.isDown) jump = true;

  // Gamepad input
  if (pad) {
    const axisH = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
    if (axisH < -0.1) left = true;
    if (axisH > 0.1) right = true;
    if (pad.buttons[0].pressed) jump = true;
  }

  return { left, right, jump };
}; 