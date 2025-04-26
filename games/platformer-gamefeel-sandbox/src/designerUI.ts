export function setupDesignerUI(
  scene: Phaser.Scene,
  {
    gravity,
    jumpStrength,
    moveSpeed,
    coyoteTimeMs,
    jumpBufferTimeMs,
    jumpGravityMultiplier,
  }: {
    gravity: () => number;
    jumpStrength: () => number;
    moveSpeed: () => number;
    coyoteTimeMs: () => number;
    jumpBufferTimeMs: () => number;
    jumpGravityMultiplier: () => number;
  },
  setters: {
    setGravity: (v: number) => void;
    setJumpStrength: (v: number) => void;
    setMoveSpeed: (v: number) => void;
    setCoyoteTimeMs: (v: number) => void;
    setJumpBufferTimeMs: (v: number) => void;
    setJumpGravityMultiplier: (v: number) => void;
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
} 