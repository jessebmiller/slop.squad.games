export function setupDesignerUI(
  scene: Phaser.Scene,
  {
    gravity,
    jumpStrength,
    moveSpeed,
    coyoteTimeMs,
    jumpBufferTimeMs,
    jumpGravityMultiplier,
    cameraLerpX,
    cameraLerpY,
    cameraDeadzoneWidth,
    cameraDeadzoneHeight,
    cameraLookaheadX,
    cameraLookaheadY,
    cameraLookaheadSmoothingX,
    cameraLookaheadSmoothingY,
    cameraLookaheadThresholdX,
    cameraLookaheadThresholdY,
  }: {
    gravity: () => number;
    jumpStrength: () => number;
    moveSpeed: () => number;
    coyoteTimeMs: () => number;
    jumpBufferTimeMs: () => number;
    jumpGravityMultiplier: () => number;
    cameraLerpX: () => number;
    cameraLerpY: () => number;
    cameraDeadzoneWidth: () => number;
    cameraDeadzoneHeight: () => number;
    cameraLookaheadX: () => number;
    cameraLookaheadY: () => number;
    cameraLookaheadSmoothingX: () => number;
    cameraLookaheadSmoothingY: () => number;
    cameraLookaheadThresholdX: () => number;
    cameraLookaheadThresholdY: () => number;
  },
  setters: {
    setGravity: (v: number) => void;
    setJumpStrength: (v: number) => void;
    setMoveSpeed: (v: number) => void;
    setCoyoteTimeMs: (v: number) => void;
    setJumpBufferTimeMs: (v: number) => void;
    setJumpGravityMultiplier: (v: number) => void;
    setCameraLerpX: (v: number) => void;
    setCameraLerpY: (v: number) => void;
    setCameraDeadzoneWidth: (v: number) => void;
    setCameraDeadzoneHeight: (v: number) => void;
    setCameraLookaheadX: (v: number) => void;
    setCameraLookaheadY: (v: number) => void;
    setCameraLookaheadSmoothingX: (v: number) => void;
    setCameraLookaheadSmoothingY: (v: number) => void;
    setCameraLookaheadThresholdX: (v: number) => void;
    setCameraLookaheadThresholdY: (v: number) => void;
  }
) {
  const gravitySlider = document.getElementById('gravity') as HTMLInputElement;
  const gravityValue = document.getElementById('gravity-value');
  gravitySlider.value = gravity().toString();
  gravityValue!.textContent = gravity().toString();
  gravitySlider.oninput = () => {
    setters.setGravity(parseInt(gravitySlider.value, 10));
    gravityValue!.textContent = gravitySlider.value;
    scene.physics.world.gravity.y = parseInt(gravitySlider.value, 10);
  };

  const jumpSlider = document.getElementById('jumpStrength') as HTMLInputElement;
  const jumpValue = document.getElementById('jumpStrength-value');
  jumpSlider.value = jumpStrength().toString();
  jumpValue!.textContent = jumpStrength().toString();
  jumpSlider.oninput = () => {
    setters.setJumpStrength(parseInt(jumpSlider.value, 10));
    jumpValue!.textContent = jumpSlider.value;
  };

  const moveSlider = document.getElementById('moveSpeed') as HTMLInputElement;
  const moveValue = document.getElementById('moveSpeed-value');
  moveSlider.value = moveSpeed().toString();
  moveValue!.textContent = moveSpeed().toString();
  moveSlider.oninput = () => {
    setters.setMoveSpeed(parseInt(moveSlider.value, 10));
    moveValue!.textContent = moveSlider.value;
  };

  const coyoteSlider = document.getElementById('coyoteTime') as HTMLInputElement;
  const coyoteValue = document.getElementById('coyoteTime-value');
  coyoteSlider.value = coyoteTimeMs().toString();
  coyoteValue!.textContent = coyoteTimeMs().toString();
  coyoteSlider.oninput = () => {
    setters.setCoyoteTimeMs(parseInt(coyoteSlider.value, 10));
    coyoteValue!.textContent = coyoteSlider.value;
  };

  const jumpBufferSlider = document.getElementById('jumpBufferTime') as HTMLInputElement;
  const jumpBufferValue = document.getElementById('jumpBufferTime-value');
  jumpBufferSlider.value = jumpBufferTimeMs().toString();
  jumpBufferValue!.textContent = jumpBufferTimeMs().toString();
  jumpBufferSlider.oninput = () => {
    setters.setJumpBufferTimeMs(parseInt(jumpBufferSlider.value, 10));
    jumpBufferValue!.textContent = jumpBufferSlider.value;
  };

  const jumpGravitySlider = document.getElementById('jumpGravityMultiplier') as HTMLInputElement;
  const jumpGravityValue = document.getElementById('jumpGravityMultiplier-value');
  jumpGravitySlider.value = jumpGravityMultiplier().toString();
  jumpGravityValue!.textContent = jumpGravityMultiplier().toString();
  jumpGravitySlider.oninput = () => {
    setters.setJumpGravityMultiplier(parseFloat(jumpGravitySlider.value));
    jumpGravityValue!.textContent = jumpGravitySlider.value;
  };

  const cameraLerpXSlider = document.getElementById('cameraLerpX') as HTMLInputElement;
  const cameraLerpXValue = document.getElementById('cameraLerpX-value');
  cameraLerpXSlider.value = cameraLerpX().toString();
  cameraLerpXValue!.textContent = cameraLerpX().toString();
  cameraLerpXSlider.oninput = () => {
    setters.setCameraLerpX(parseFloat(cameraLerpXSlider.value));
    cameraLerpXValue!.textContent = cameraLerpXSlider.value;
  };

  const cameraLerpYSlider = document.getElementById('cameraLerpY') as HTMLInputElement;
  const cameraLerpYValue = document.getElementById('cameraLerpY-value');
  cameraLerpYSlider.value = cameraLerpY().toString();
  cameraLerpYValue!.textContent = cameraLerpY().toString();
  cameraLerpYSlider.oninput = () => {
    setters.setCameraLerpY(parseFloat(cameraLerpYSlider.value));
    cameraLerpYValue!.textContent = cameraLerpYSlider.value;
  };

  const cameraDeadzoneWidthSlider = document.getElementById('cameraDeadzoneWidth') as HTMLInputElement;
  const cameraDeadzoneWidthValue = document.getElementById('cameraDeadzoneWidth-value');
  cameraDeadzoneWidthSlider.value = cameraDeadzoneWidth().toString();
  cameraDeadzoneWidthValue!.textContent = cameraDeadzoneWidth().toString();
  cameraDeadzoneWidthSlider.oninput = () => {
    setters.setCameraDeadzoneWidth(parseInt(cameraDeadzoneWidthSlider.value, 10));
    cameraDeadzoneWidthValue!.textContent = cameraDeadzoneWidthSlider.value;
  };

  const cameraDeadzoneHeightSlider = document.getElementById('cameraDeadzoneHeight') as HTMLInputElement;
  const cameraDeadzoneHeightValue = document.getElementById('cameraDeadzoneHeight-value');
  cameraDeadzoneHeightSlider.value = cameraDeadzoneHeight().toString();
  cameraDeadzoneHeightValue!.textContent = cameraDeadzoneHeight().toString();
  cameraDeadzoneHeightSlider.oninput = () => {
    setters.setCameraDeadzoneHeight(parseInt(cameraDeadzoneHeightSlider.value, 10));
    cameraDeadzoneHeightValue!.textContent = cameraDeadzoneHeightSlider.value;
  };

  const cameraLookaheadXSlider = document.getElementById('cameraLookaheadX') as HTMLInputElement;
  const cameraLookaheadXValue = document.getElementById('cameraLookaheadX-value');
  cameraLookaheadXSlider.value = cameraLookaheadX().toString();
  cameraLookaheadXValue!.textContent = cameraLookaheadX().toString();
  cameraLookaheadXSlider.oninput = () => {
    setters.setCameraLookaheadX(parseInt(cameraLookaheadXSlider.value, 10));
    cameraLookaheadXValue!.textContent = cameraLookaheadXSlider.value;
  };

  const cameraLookaheadYSlider = document.getElementById('cameraLookaheadY') as HTMLInputElement;
  const cameraLookaheadYValue = document.getElementById('cameraLookaheadY-value');
  cameraLookaheadYSlider.value = cameraLookaheadY().toString();
  cameraLookaheadYValue!.textContent = cameraLookaheadY().toString();
  cameraLookaheadYSlider.oninput = () => {
    setters.setCameraLookaheadY(parseInt(cameraLookaheadYSlider.value, 10));
    cameraLookaheadYValue!.textContent = cameraLookaheadYSlider.value;
  };

  const cameraLookaheadSmoothingXSlider = document.getElementById('cameraLookaheadSmoothingX') as HTMLInputElement;
  const cameraLookaheadSmoothingXValue = document.getElementById('cameraLookaheadSmoothingX-value');
  cameraLookaheadSmoothingXSlider.value = cameraLookaheadSmoothingX().toString();
  cameraLookaheadSmoothingXValue!.textContent = cameraLookaheadSmoothingX().toString();
  cameraLookaheadSmoothingXSlider.oninput = () => {
    setters.setCameraLookaheadSmoothingX(parseFloat(cameraLookaheadSmoothingXSlider.value));
    cameraLookaheadSmoothingXValue!.textContent = cameraLookaheadSmoothingXSlider.value;
  };

  const cameraLookaheadSmoothingYSlider = document.getElementById('cameraLookaheadSmoothingY') as HTMLInputElement;
  const cameraLookaheadSmoothingYValue = document.getElementById('cameraLookaheadSmoothingY-value');
  cameraLookaheadSmoothingYSlider.value = cameraLookaheadSmoothingY().toString();
  cameraLookaheadSmoothingYValue!.textContent = cameraLookaheadSmoothingY().toString();
  cameraLookaheadSmoothingYSlider.oninput = () => {
    setters.setCameraLookaheadSmoothingY(parseFloat(cameraLookaheadSmoothingYSlider.value));
    cameraLookaheadSmoothingYValue!.textContent = cameraLookaheadSmoothingYSlider.value;
  };

  // Camera Lookahead Threshold X
  const cameraLookaheadThresholdXSlider = document.getElementById('cameraLookaheadThresholdX') as HTMLInputElement;
  const cameraLookaheadThresholdXValue = document.getElementById('cameraLookaheadThresholdX-value');
  cameraLookaheadThresholdXSlider.value = cameraLookaheadThresholdX().toString();
  cameraLookaheadThresholdXValue!.textContent = cameraLookaheadThresholdX().toString();
  cameraLookaheadThresholdXSlider.oninput = () => {
    setters.setCameraLookaheadThresholdX(parseFloat(cameraLookaheadThresholdXSlider.value));
    cameraLookaheadThresholdXValue!.textContent = cameraLookaheadThresholdXSlider.value;
  };

  // Camera Lookahead Threshold Y
  const cameraLookaheadThresholdYSlider = document.getElementById('cameraLookaheadThresholdY') as HTMLInputElement;
  const cameraLookaheadThresholdYValue = document.getElementById('cameraLookaheadThresholdY-value');
  cameraLookaheadThresholdYSlider.value = cameraLookaheadThresholdY().toString();
  cameraLookaheadThresholdYValue!.textContent = cameraLookaheadThresholdY().toString();
  cameraLookaheadThresholdYSlider.oninput = () => {
    setters.setCameraLookaheadThresholdY(parseFloat(cameraLookaheadThresholdYSlider.value));
    cameraLookaheadThresholdYValue!.textContent = cameraLookaheadThresholdYSlider.value;
  };
} 