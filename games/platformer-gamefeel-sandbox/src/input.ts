import Phaser from 'phaser';
import { PlayerInput } from './player';

// Track the previous state of all inputs
let prevInputState: PlayerInput = {
  left: false,
  right: false,
  jump: false,
  dash: false,
  groundPound: false,
  jumpBuffered: false,
  dashBuffered: false,
  groundPoundBuffered: false
};

export const getInputState = (scene: Phaser.Scene, pad: Phaser.Input.Gamepad.Gamepad | null): PlayerInput => {
  const keyA = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  const keyD = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  const keySpace = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  const keyShift = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  const keyS = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);

  // Get current raw input state
  const currentInputState: PlayerInput = {
    left: false,
    right: false,
    jump: false,
    dash: false,
    groundPound: false,
    jumpBuffered: false,
    dashBuffered: false,
    groundPoundBuffered: false
  };

  // Keyboard input
  if (keyA?.isDown) currentInputState.left = true;
  if (keyD?.isDown) currentInputState.right = true;
  if (keySpace?.isDown) currentInputState.jump = true;
  if (keyShift?.isDown) currentInputState.dash = true;
  if (keyS?.isDown) currentInputState.groundPound = true;

  // Gamepad input
  if (pad) {
    const axisH = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
    if (axisH < -0.1) currentInputState.left = true;
    if (axisH > 0.1) currentInputState.right = true;
    if (pad.buttons[0].pressed) currentInputState.jump = true;
    if (pad.buttons[1].pressed) currentInputState.dash = true;
    if (pad.buttons[2].pressed) currentInputState.groundPound = true;
  }

  // Calculate buffered inputs (only true on first frame of press)
  const bufferedInputState: PlayerInput = {
    left: currentInputState.left,
    right: currentInputState.right,
    jump: currentInputState.jump && !prevInputState.jump,
    dash: currentInputState.dash && !prevInputState.dash,
    groundPound: currentInputState.groundPound && !prevInputState.groundPound,
    jumpBuffered: currentInputState.jump && !prevInputState.jump,
    dashBuffered: currentInputState.dash && !prevInputState.dash,
    groundPoundBuffered: currentInputState.groundPound && !prevInputState.groundPound
  };

  // Update previous state
  prevInputState = currentInputState;

  // Return both buffered and unbuffered states
  return {
    ...currentInputState,  // Raw input state
    jumpBuffered: bufferedInputState.jump,
    dashBuffered: bufferedInputState.dash,
    groundPoundBuffered: bufferedInputState.groundPound
  };
}; 