import Phaser from 'phaser';
import { saveCurrentConfig, loadNamedConfig, getAllSavedConfigs, GameConfig } from './configStorage';
import { PlayerParameters } from './player';
import { CameraParameters } from './camera';
import { DEFAULT_MATERIAL, ICE_MATERIAL, AIR_MATERIAL } from './materials';

export function setupConfigUI(
  scene: Phaser.Scene,
  playerParameters: PlayerParameters,
  cameraParameters: CameraParameters
) {
  const configContainer = scene.add.container(10, 10);
  
  // Save current config button
  const saveButton = scene.add.text(0, 0, 'Save Current Config', { 
    backgroundColor: '#444',
    padding: { x: 10, y: 5 }
  });
  saveButton.setInteractive();
  saveButton.on('pointerdown', () => {
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
      alert('Config saved!');
    }
  });

  // Load config button
  const loadButton = scene.add.text(0, 40, 'Load Config', { 
    backgroundColor: '#444',
    padding: { x: 10, y: 5 }
  });
  loadButton.setInteractive();
  loadButton.on('pointerdown', () => {
    const configs = getAllSavedConfigs();
    if (configs.length === 0) {
      alert('No saved configs found!');
      return;
    }
    
    const configNames = configs.map(c => c.name);
    const name = prompt('Enter config name to load:\n' + configNames.join('\n'));
    if (name) {
      const config = loadNamedConfig(name);
      if (config) {
        Object.assign(playerParameters, config.player);
        Object.assign(cameraParameters, config.camera);
        alert('Config loaded!');
      } else {
        alert('Config not found!');
      }
    }
  });

  configContainer.add([saveButton, loadButton]);
  return configContainer;
} 