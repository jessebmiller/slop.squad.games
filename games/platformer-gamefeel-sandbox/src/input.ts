import Phaser from 'phaser';
import { PlayerInput } from './player';

export const getInputState = (scene: Phaser.Scene, pad: Phaser.Input.Gamepad.Gamepad | null): PlayerInput => {
  const keyA = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  const keyD = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  const keySpace = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  const keyShift = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  const keyS = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);

  let left = false;
  let right = false;
  let jump = false;
  let dash = false;
  let groundPound = false;

  // Keyboard input
  if (keyA?.isDown) left = true;
  if (keyD?.isDown) right = true;
  if (keySpace?.isDown) jump = true;
  if (keyShift?.isDown) dash = true;
  if (keyS?.isDown) groundPound = true;

  // Gamepad input
  if (pad) {
    const axisH = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
    if (axisH < -0.1) left = true;
    if (axisH > 0.1) right = true;
    if (pad.buttons[0].pressed) jump = true;
    if (pad.buttons[1].pressed) dash = true;
    if (pad.buttons[2].pressed) groundPound = true;
  }

  return { left, right, jump, dash, groundPound };
}; 