import { saveCurrentConfig, loadNamedConfig, getAllSavedConfigs, deleteNamedConfig } from './configStorage';
import { PlayerParameters } from './player';
import { CameraParameters } from './camera';

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
  const configSection = createSection('Config Management');

  // Player parameters
  const playerSliders: ParameterSlider[] = [
    createSlider('Gravity', () => playerParameters.gravity, v => { 
      playerParameters.gravity = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 2000, 10, 'Strength of gravity affecting the player'),
    createSlider('Jump Strength', () => playerParameters.jumpStrength, v => { 
      playerParameters.jumpStrength = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, -1000, 0, 10, 'Initial upward velocity when jumping'),
    createSlider('Move Speed', () => playerParameters.moveSpeed, v => { 
      playerParameters.moveSpeed = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 500, 5, 'Horizontal movement speed'),
    createSlider('Coyote Time (ms)', () => playerParameters.coyoteTimeMs, v => { 
      playerParameters.coyoteTimeMs = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 500, 10, 'Time window after leaving a platform where you can still jump'),
    createSlider('Jump Buffer Time (ms)', () => playerParameters.jumpBufferTimeMs, v => { 
      playerParameters.jumpBufferTimeMs = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 500, 10, 'Time window before landing where jump input is remembered'),
    createSlider('Jump Gravity Multiplier', () => playerParameters.jumpGravityMultiplier, v => { 
      playerParameters.jumpGravityMultiplier = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 1, 0.05, 'Gravity multiplier while jumping (lower = floatier jumps)')
  ];

  // Camera parameters
  const cameraSliders: ParameterSlider[] = [
    createSlider('Camera Lerp X', () => cameraParameters.lerpX, v => { 
      cameraParameters.lerpX = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 1, 0.01, 'Horizontal camera smoothing (0 = instant, 1 = no movement)'),
    createSlider('Camera Lerp Y', () => cameraParameters.lerpY, v => { 
      cameraParameters.lerpY = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 1, 0.01, 'Vertical camera smoothing (0 = instant, 1 = no movement)'),
    createSlider('Deadzone Width', () => cameraParameters.deadzoneWidth, v => { 
      cameraParameters.deadzoneWidth = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 400, 10, 'Horizontal distance before camera follows player'),
    createSlider('Deadzone Height', () => cameraParameters.deadzoneHeight, v => { 
      cameraParameters.deadzoneHeight = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 400, 10, 'Vertical distance before camera follows player'),
    createSlider('Lookahead X', () => cameraParameters.lookaheadX, v => { 
      cameraParameters.lookaheadX = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 300, 10, 'Horizontal camera lookahead distance'),
    createSlider('Lookahead Y', () => cameraParameters.lookaheadY, v => { 
      cameraParameters.lookaheadY = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 300, 10, 'Vertical camera lookahead distance'),
    createSlider('Lookahead Smoothing X', () => cameraParameters.lookaheadSmoothingX, v => { 
      cameraParameters.lookaheadSmoothingX = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 1, 0.01, 'Horizontal lookahead smoothing'),
    createSlider('Lookahead Smoothing Y', () => cameraParameters.lookaheadSmoothingY, v => { 
      cameraParameters.lookaheadSmoothingY = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 1, 0.01, 'Vertical lookahead smoothing'),
    createSlider('Lookahead Threshold X', () => cameraParameters.lookaheadThresholdX, v => { 
      cameraParameters.lookaheadThresholdX = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 20, 1, 'Minimum horizontal speed to trigger lookahead'),
    createSlider('Lookahead Threshold Y', () => cameraParameters.lookaheadThresholdY, v => { 
      cameraParameters.lookaheadThresholdY = v;
      saveCurrentConfig({ name: '', player: playerParameters, camera: cameraParameters });
    }, 0, 20, 1, 'Minimum vertical speed to trigger lookahead')
  ];

  // Add sliders to their sections
  playerSliders.forEach(slider => playerSection.querySelector('.section-content')!.appendChild(createSliderElement(slider)));
  cameraSliders.forEach(slider => cameraSection.querySelector('.section-content')!.appendChild(createSliderElement(slider)));

  // Add config management UI
  // Save config button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save Current Config';
  saveButton.onclick = () => {
    const name = prompt('Enter a name for this config:');
    if (name) {
      saveCurrentConfig({ 
        name, 
        player: { ...playerParameters }, 
        camera: { ...cameraParameters } 
      });
      alert('Config saved!');
      updateConfigList();
    }
  };
  
  // Load config UI
  const loadContainer = document.createElement('div');
  loadContainer.style.cssText = 'display: flex; gap: 8px; margin-top: 10px;';
  
  const loadSelect = document.createElement('select');
  loadSelect.style.cssText = 'flex: 1; padding: 5px; border: none; border-radius: 4px;';
  
  const loadButton = document.createElement('button');
  loadButton.textContent = 'Load';
  loadButton.onclick = () => {
    const name = loadSelect.value;
    if (name) {
      const config = loadNamedConfig(name);
      if (config) {
        Object.assign(playerParameters, config.player);
        Object.assign(cameraParameters, config.camera);
        // Update all slider values
        [...playerSliders, ...cameraSliders].forEach(slider => {
          const input = document.getElementById(`slider-${slider.label}`) as HTMLInputElement;
          if (input) {
            input.value = slider.getValue().toString();
            updateSliderValue(slider.label, slider.getValue());
          }
        });
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
    }
  };
  
  loadContainer.appendChild(loadSelect);
  loadContainer.appendChild(loadButton);
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
  
  configSection.querySelector('.section-content')!.appendChild(saveButton);
  configSection.querySelector('.section-content')!.appendChild(loadContainer);

  // Add sections to container
  container.appendChild(playerSection);
  container.appendChild(cameraSection);
  container.appendChild(configSection);

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

function createSection(title: string): HTMLElement {
  const section = document.createElement('section');
  section.className = 'collapsible-section';
  
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
  content.style.cssText = `
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    max-height: 1000px;
  `;
  
  header.appendChild(heading);
  header.appendChild(toggle);
  section.appendChild(header);
  section.appendChild(content);
  
  header.onclick = () => {
    const isExpanded = content.style.maxHeight !== '0px';
    content.style.maxHeight = isExpanded ? '0px' : '1000px';
    toggle.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
  };
  
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