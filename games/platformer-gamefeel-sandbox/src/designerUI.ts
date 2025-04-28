import { saveCurrentConfig, loadNamedConfig, getAllSavedConfigs, deleteNamedConfig, getCurrentConfig } from './configStorage';
import { PlayerParameters } from './player';
import { CameraParameters } from './camera';
import { DEFAULT_MATERIAL, ICE_MATERIAL, AIR_MATERIAL } from './materials';

interface ParameterSlider {
  label: string;
  getValue: () => number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  description?: string;
}

export function setupDesignerUI(
  playerParameters: PlayerParameters,
  cameraParameters: CameraParameters
) {
  const container = document.createElement('div');
  container.className = 'gamefeel-controls';
  container.style.cssText = `
    position: fixed;
    right: 20px;
    top: 20px;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 8px;
    color: white;
    font-family: Arial, sans-serif;
    max-height: 90vh;
    overflow-y: auto;
  `;

  // Create sections for different parameter groups
  const playerSection = createSection('Player Movement');
  const cameraSection = createSection('Camera Settings');
  const configSection = createSection('Config Management', false);
  const materialsSection = createSection('Materials');
  const debugSection = createSection('Debug Info', false);

  // Add debug info
  const debugContent = debugSection.querySelector('.section-content')!;
  const materialDisplay = document.createElement('div');
  materialDisplay.style.cssText = 'color: #fff; margin: 10px 0;';
  materialDisplay.textContent = 'Current Material: None';
  const gravityDisplay = document.createElement('div');
  gravityDisplay.style.cssText = 'color: #fff; margin: 10px 0;';
  gravityDisplay.textContent = 'Gravity: 0';    
  debugContent.appendChild(materialDisplay);
  debugContent.appendChild(gravityDisplay);

  // Function to update material debug info
  function updateMaterialDebug(material: string) {
    materialDisplay.textContent = `Current Material: ${material}`;
  }

  // Function to update gravity debug info
  function updateGravityDebug(gravity: number) {
    gravityDisplay.textContent = `Gravity: ${gravity.toFixed(2)}`;
  }

  // Expose debug functions to window
  (window as any).updateMaterialDebug = updateMaterialDebug;
  (window as any).updateGravityDebug = updateGravityDebug;

  // Player parameters
  const playerSliders: ParameterSlider[] = [
    createSlider('Gravity', () => playerParameters.gravity, v => { 
      playerParameters.gravity = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 2000, 10, 'Strength of gravity affecting the player'),
    createSlider('Jump Strength', () => -playerParameters.jumpStrength, v => { 
      playerParameters.jumpStrength = -v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1000, 10, 'Initial upward velocity when jumping (higher = stronger jump)'),
    createSlider('Jump Gravity Multiplier', () => playerParameters.jumpGravityMultiplier, v => { 
      playerParameters.jumpGravityMultiplier = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.05, 'Gravity multiplier while jumping (lower = floatier jumps)'),
    createSlider('Move Speed', () => playerParameters.moveSpeed, v => { 
      playerParameters.moveSpeed = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 500, 5, 'Horizontal movement speed'),
    createSlider('Coyote Time (ms)', () => playerParameters.coyoteTimeMs, v => { 
      playerParameters.coyoteTimeMs = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 500, 10, 'Time window after leaving a platform where you can still jump'),
    createSlider('Jump Buffer Time (ms)', () => playerParameters.jumpBufferTimeMs, v => { 
      playerParameters.jumpBufferTimeMs = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 500, 10, 'Time window before landing where jump input is remembered'),
    createSlider('Scale', () => playerParameters.scale, v => { 
      playerParameters.scale = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 1, 500, 1, 'Scale of the player character in percent'),
    createSlider('Terminal Velocity', () => playerParameters.terminalVelocity, v => { 
      playerParameters.terminalVelocity = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 100, 1000, 10, 'Maximum falling speed (higher = faster falling)'),
    createSlider('Wall Slide Speed', () => playerParameters.wallSlideSpeed, v => { 
      playerParameters.wallSlideSpeed = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 200, 5, 'Speed at which the player slides down walls'),
    createSlider('Wall Jump Strength', () => -playerParameters.wallJumpStrength, v => { 
      playerParameters.wallJumpStrength = -v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1000, 10, 'Upward velocity when wall jumping'),
    createSlider('Wall Jump Time (ms)', () => playerParameters.wallJumpTimeMs, v => { 
      playerParameters.wallJumpTimeMs = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 500, 10, 'Duration of wall jump control lock'),
    createSlider('Wall Jump Push', () => playerParameters.wallJumpPushStrength, v => { 
      playerParameters.wallJumpPushStrength = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 500, 10, 'Horizontal push force when wall jumping'),
    createSlider('Double Jump Strength', () => -playerParameters.doubleJumpStrength, v => { 
      playerParameters.doubleJumpStrength = -v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1000, 10, 'Upward velocity when double jumping'),
    createSlider('Dash Speed', () => playerParameters.dashSpeed, v => { 
      playerParameters.dashSpeed = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1000, 10, 'Speed of the dash move'),
    createSlider('Dash Duration (ms)', () => playerParameters.dashDurationMs, v => { 
      playerParameters.dashDurationMs = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 500, 10, 'How long the dash lasts'),
    createSlider('Dash Cooldown (ms)', () => playerParameters.dashCooldownMs, v => { 
      playerParameters.dashCooldownMs = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 2000, 50, 'Time between dashes'),
    createSlider('Ground Pound Speed', () => playerParameters.groundPoundSpeed, v => { 
      playerParameters.groundPoundSpeed = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1000, 10, 'Downward velocity when ground pounding'),
    createSlider('Ground Pound Bounce', () => -playerParameters.groundPoundBounceStrength, v => { 
      playerParameters.groundPoundBounceStrength = -v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 500, 10, 'Upward velocity after ground pound'),
    createSlider('Ground Pound Cooldown (ms)', () => playerParameters.groundPoundCooldownMs, v => { 
      playerParameters.groundPoundCooldownMs = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 2000, 50, 'Time between ground pounds'),
  ];

  // Camera parameters
  const cameraSliders: ParameterSlider[] = [
    createSlider('Camera Lerp X', () => cameraParameters.lerpX, v => { 
      cameraParameters.lerpX = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.01, 'Horizontal camera smoothing (0 = instant, 1 = no movement)'),
    createSlider('Camera Lerp Y', () => cameraParameters.lerpY, v => { 
      cameraParameters.lerpY = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.01, 'Vertical camera smoothing (0 = instant, 1 = no movement)'),
    createSlider('Deadzone Width', () => cameraParameters.deadzoneWidth, v => { 
      cameraParameters.deadzoneWidth = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 400, 10, 'Horizontal distance before camera follows player'),
    createSlider('Deadzone Height', () => cameraParameters.deadzoneHeight, v => { 
      cameraParameters.deadzoneHeight = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 400, 10, 'Vertical distance before camera follows player'),
    createSlider('Lookahead X', () => cameraParameters.lookaheadX, v => { 
      cameraParameters.lookaheadX = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 300, 10, 'Horizontal camera lookahead distance'),
    createSlider('Lookahead Y', () => cameraParameters.lookaheadY, v => { 
      cameraParameters.lookaheadY = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 300, 10, 'Vertical camera lookahead distance'),
    createSlider('Lookahead Smoothing X', () => cameraParameters.lookaheadSmoothingX, v => { 
      cameraParameters.lookaheadSmoothingX = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.01, 'Horizontal lookahead smoothing'),
    createSlider('Lookahead Smoothing Y', () => cameraParameters.lookaheadSmoothingY, v => { 
      cameraParameters.lookaheadSmoothingY = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.01, 'Vertical lookahead smoothing'),
    createSlider('Lookahead Threshold X', () => cameraParameters.lookaheadThresholdX, v => { 
      cameraParameters.lookaheadThresholdX = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 20, 1, 'Minimum horizontal speed to trigger lookahead'),
    createSlider('Lookahead Threshold Y', () => cameraParameters.lookaheadThresholdY, v => { 
      cameraParameters.lookaheadThresholdY = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 20, 1, 'Minimum vertical speed to trigger lookahead')
  ];

  // Material parameters
  const materialSliders: ParameterSlider[] = [
    // Default Material
    createSlider('Default Material - Acceleration', () => DEFAULT_MATERIAL.acceleration, v => { 
      DEFAULT_MATERIAL.acceleration = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 4, 0.05, 'How quickly the player accelerates on default material'),
    createSlider('Default Material - Deceleration', () => DEFAULT_MATERIAL.deceleration, v => { 
      DEFAULT_MATERIAL.deceleration = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 4, 0.05, 'How quickly the player slows down on default material'),
    createSlider('Default Material - Friction', () => DEFAULT_MATERIAL.friction, v => { 
      DEFAULT_MATERIAL.friction = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.05, 'How much friction the default material has (1 = no friction)'),
    
    // Ice Material
    createSlider('Ice Material - Acceleration', () => ICE_MATERIAL.acceleration, v => { 
      ICE_MATERIAL.acceleration = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 4, 0.05, 'How quickly the player accelerates on ice'),
    createSlider('Ice Material - Deceleration', () => ICE_MATERIAL.deceleration, v => { 
      ICE_MATERIAL.deceleration = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 4, 0.05, 'How quickly the player slows down on ice'),
    createSlider('Ice Material - Friction', () => ICE_MATERIAL.friction, v => { 
      ICE_MATERIAL.friction = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.05, 'How much friction ice has (1 = no friction)'),

    // Air Material
    createSlider('Air - Acceleration', () => AIR_MATERIAL.acceleration, v => { 
      AIR_MATERIAL.acceleration = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 4, 0.05, 'How quickly the player accelerates in the air'),
    createSlider('Air - Deceleration', () => AIR_MATERIAL.deceleration, v => { 
      AIR_MATERIAL.deceleration = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 4, 0.05, 'How quickly the player slows down in the air'),
    createSlider('Air - Friction', () => AIR_MATERIAL.friction, v => { 
      AIR_MATERIAL.friction = v;
      const currentConfig = getCurrentConfig();
      saveCurrentConfig({ 
        name: currentConfig?.name || '', 
        player: playerParameters, 
        camera: cameraParameters,
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
    }, 0, 1, 0.05, 'How much friction the air has (1 = no friction)'),
  ];

  // Add sliders to their sections
  playerSliders.forEach(slider => playerSection.querySelector('.section-content')!.appendChild(createSliderElement(slider)));
  cameraSliders.forEach(slider => cameraSection.querySelector('.section-content')!.appendChild(createSliderElement(slider)));
  materialSliders.forEach(slider => materialsSection.querySelector('.section-content')!.appendChild(createSliderElement(slider)));

  // Add config management UI
  const configContent = configSection.querySelector('.section-content')!;
  const currentConfigDisplay = document.createElement('div');
  currentConfigDisplay.style.cssText = 'margin-bottom: 10px; color: #aaa; font-size: 0.9em;';
  function updateCurrentConfigDisplay() {
    const currentConfig = getCurrentConfig();
    currentConfigDisplay.textContent = currentConfig?.name 
      ? `Current config: ${currentConfig.name}`
      : 'Current config: (unsaved)';
  }
  updateCurrentConfigDisplay();
  
  // Save new config button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save New Config';
  saveButton.onclick = () => {
    const name = prompt('Enter a name for this config:');
    if (name) {
      saveCurrentConfig({ 
        name, 
        player: { ...playerParameters }, 
        camera: { ...cameraParameters },
        materials: {
          default: { ...DEFAULT_MATERIAL },
          ice: { ...ICE_MATERIAL },
          air: { ...AIR_MATERIAL }
        }
      });
      updateConfigList();
      updateCurrentConfigDisplay();
    }
  };
  
  // Load config UI
  const loadContainer = document.createElement('div');
  loadContainer.style.cssText = 'display: flex; gap: 8px; margin-top: 10px;';
  
  const loadSelect = document.createElement('select');
  loadSelect.style.cssText = 'flex: 1; padding: 5px; border: none; border-radius: 4px;';
  loadSelect.onchange = () => {
    const name = loadSelect.value;
    if (name) {
      const config = loadNamedConfig(name);
      if (config) {
        Object.assign(playerParameters, config.player);
        Object.assign(cameraParameters, config.camera);
        if (config.materials) {
          Object.assign(DEFAULT_MATERIAL, config.materials.default);
          Object.assign(ICE_MATERIAL, config.materials.ice);
          Object.assign(AIR_MATERIAL, config.materials.air);
        }
        // Update all slider values
        [...playerSliders, ...cameraSliders, ...materialSliders].forEach(slider => {
          const input = document.getElementById(`slider-${slider.label}`) as HTMLInputElement;
          if (input) {
            input.value = slider.getValue().toString();
            updateSliderValue(slider.label, slider.getValue());
          }
        });
        updateCurrentConfigDisplay();
      }
    }
  };
  
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => {
    const name = loadSelect.value;
    if (name && confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteNamedConfig(name);
      updateConfigList();
      updateCurrentConfigDisplay();
    }
  };
  
  loadContainer.appendChild(loadSelect);
  loadContainer.appendChild(deleteButton);
  
  // Function to update the config list
  function updateConfigList() {
    const configs = getAllSavedConfigs();
    loadSelect.innerHTML = '<option value="">Select a config...</option>';
    configs.forEach(config => {
      const option = document.createElement('option');
      option.value = config.name;
      option.textContent = config.name;
      loadSelect.appendChild(option);
    });
  }
  
  // Initial update of config list
  updateConfigList();
  
  configContent.appendChild(currentConfigDisplay);
  configContent.appendChild(saveButton);
  configContent.appendChild(loadContainer);

  // Add sections to container
  container.appendChild(playerSection);
  container.appendChild(cameraSection);
  container.appendChild(materialsSection);
  container.appendChild(configSection);
  container.appendChild(debugSection);

  // Add container to document
  document.body.appendChild(container);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .gamefeel-controls section {
      margin-bottom: 20px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    .gamefeel-controls .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    }
    .gamefeel-controls .section-header:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .gamefeel-controls h3 {
      margin: 0;
      color: #fff;
    }
    .gamefeel-controls .section-content {
      margin-top: 10px;
    }
    .gamefeel-controls .slider-container {
      margin: 10px 0;
    }
    .gamefeel-controls label {
      display: block;
      margin-bottom: 5px;
      color: #fff;
    }
    .gamefeel-controls input[type="range"] {
      width: 100%;
    }
    .gamefeel-controls .value {
      display: inline-block;
      min-width: 50px;
      text-align: right;
    }
    .gamefeel-controls .description {
      font-size: 0.8em;
      color: #aaa;
      margin-top: 2px;
    }
    .gamefeel-controls button {
      margin: 5px;
      padding: 5px 10px;
      background: #444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .gamefeel-controls button:hover {
      background: #555;
    }
  `;
  document.head.appendChild(style);

  return container;
}

function createSection(title: string, isCollapsible: boolean = true): HTMLElement {
  const section = document.createElement('section');
  section.className = 'collapsible-section';
  
  if (isCollapsible) {
    const header = document.createElement('div');
    header.className = 'section-header';
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    `;
    
    const heading = document.createElement('h3');
    heading.textContent = title;
    heading.style.margin = '0';
    
    const toggle = document.createElement('span');
    toggle.textContent = '▼';
    toggle.style.transition = 'transform 0.2s';
    
    const content = document.createElement('div');
    content.className = 'section-content';
    
    // Get initial state from localStorage
    const sectionKey = `section_${title}`;
    const isExpanded = localStorage.getItem(sectionKey) === 'true';
    content.style.cssText = `
      overflow: hidden;
      transition: opacity 0.2s ease-out;
      display: ${isExpanded ? 'block' : 'none'};
      opacity: ${isExpanded ? '1' : '0'};
    `;
    toggle.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
    
    header.appendChild(heading);
    header.appendChild(toggle);
    section.appendChild(header);
    section.appendChild(content);
    
    header.onclick = () => {
      const isExpanded = content.style.display !== 'none';
      content.style.display = isExpanded ? 'none' : 'block';
      content.style.opacity = isExpanded ? '0' : '1';
      toggle.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
      // Save state to localStorage
      localStorage.setItem(sectionKey, (!isExpanded).toString());
    };
  } else {
    const heading = document.createElement('h3');
    heading.textContent = title;
    heading.style.margin = '0';
    section.appendChild(heading);
    
    const content = document.createElement('div');
    content.className = 'section-content';
    section.appendChild(content);
  }
  
  return section;
}

function createSliderElement(slider: ParameterSlider): HTMLElement {
  const container = document.createElement('div');
  container.className = 'slider-container';

  const label = document.createElement('label');
  label.htmlFor = `slider-${slider.label}`;
  label.textContent = slider.label;

  const value = document.createElement('span');
  value.className = 'value';
  value.textContent = slider.getValue().toString();

  const input = document.createElement('input');
  input.type = 'range';
  input.id = `slider-${slider.label}`;
  input.min = slider.min.toString();
  input.max = slider.max.toString();
  input.step = slider.step.toString();
  input.value = slider.getValue().toString();

  input.oninput = () => {
    const newValue = parseFloat(input.value);
    slider.setValue(newValue);
    value.textContent = newValue.toString();
  };

  const description = document.createElement('div');
  description.className = 'description';
  description.textContent = slider.description || '';

  container.appendChild(label);
  container.appendChild(value);
  container.appendChild(input);
  container.appendChild(description);

  return container;
}

function updateSliderValue(label: string, value: number) {
  const input = document.getElementById(`slider-${label}`) as HTMLInputElement;
  const valueSpan = input?.previousElementSibling as HTMLElement;
  if (input && valueSpan) {
    input.value = value.toString();
    valueSpan.textContent = value.toString();
  }
}

function createSlider(
  label: string,
  getValue: () => number,
  setValue: (value: number) => void,
  min: number,
  max: number,
  step: number,
  description?: string
): ParameterSlider {
  return { label, getValue, setValue, min, max, step, description };
} 