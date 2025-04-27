import Phaser from 'phaser';

export type CameraState = {
  lookaheadOffsetX: number;
  lookaheadOffsetY: number;
};

export type CameraParameters = {
  lerpX: number;
  lerpY: number;
  deadzoneWidth: number;
  deadzoneHeight: number;
  lookaheadX: number;
  lookaheadY: number;
  lookaheadSmoothingX: number;
  lookaheadSmoothingY: number;
  lookaheadThresholdX: number;
  lookaheadThresholdY: number;
};

export const createCameraState = (scene: Phaser.Scene): CameraState => {
  return {
    lookaheadOffsetX: 0,
    lookaheadOffsetY: 0,
  };
};

export const setupCamera = (
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject,
  parameters: CameraParameters
) => {
  const camera = scene.cameras.main;
  camera.startFollow(target, true, parameters.lerpX, parameters.lerpY);
  camera.setRoundPixels(true);
  camera.setDeadzone(parameters.deadzoneWidth, parameters.deadzoneHeight);
};

export const updateCamera = (
  state: CameraState,
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject,
  parameters: CameraParameters,
  moveSpeed: number
): CameraState => {
  const camera = scene.cameras.main;
  
  // Calculate target lookahead based on target velocity
  let targetLookaheadX = 0;
  let targetLookaheadY = 0;
  
  if (target.body) {
    const body = target.body as Phaser.Physics.Arcade.Body;
    if (Math.abs(body.velocity.x) > parameters.lookaheadThresholdX) {
      targetLookaheadX = -(body.velocity.x / moveSpeed) * parameters.lookaheadX;
    }
    if (Math.abs(body.velocity.y) > parameters.lookaheadThresholdY) {
      targetLookaheadY = -(body.velocity.y / moveSpeed) * parameters.lookaheadY;
    }
  }

  // Smoothly update lookahead offsets
  const lookaheadOffsetX = state.lookaheadOffsetX + 
    (targetLookaheadX - state.lookaheadOffsetX) * parameters.lookaheadSmoothingX;
  const lookaheadOffsetY = state.lookaheadOffsetY + 
    (targetLookaheadY - state.lookaheadOffsetY) * parameters.lookaheadSmoothingY;

  // Update camera follow offset if it's changed
  if (lookaheadOffsetX !== camera.followOffset.x || lookaheadOffsetY !== camera.followOffset.y) {
    camera.setFollowOffset(lookaheadOffsetX, lookaheadOffsetY);
  }

  // Update camera lerp
  camera.setLerp(parameters.lerpX, parameters.lerpY);

  // update deadzone if it's changed
  if (parameters.deadzoneWidth !== camera.deadzone?.width || parameters.deadzoneHeight !== camera.deadzone?.height) {
    camera.setDeadzone(parameters.deadzoneWidth, parameters.deadzoneHeight);
  }

  return {
    ...state,
    lookaheadOffsetX,
    lookaheadOffsetY,
  };
}; 