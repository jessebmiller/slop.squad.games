import { PlayerParameters } from './player';
import { CameraParameters } from './camera';
import { Material } from './materials';

export interface GameConfig {
  name: string;
  player: PlayerParameters;
  camera: CameraParameters;
  materials: {
    default: Material;
    ice: Material;
    air: Material;
  };
}

const STORAGE_KEY = 'gamefeel_configs';
const CURRENT_CONFIG_KEY = 'current_gamefeel_config';

export function saveCurrentConfig(config: GameConfig) {
  // Save as current config
  localStorage.setItem(CURRENT_CONFIG_KEY, JSON.stringify(config));
  
  // Also save to named configs if it has a name
  if (config.name) {
    const savedConfigs = getAllSavedConfigs();
    const existingIndex = savedConfigs.findIndex(c => c.name === config.name);
    
    if (existingIndex >= 0) {
      savedConfigs[existingIndex] = config;
    } else {
      savedConfigs.push(config);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedConfigs));
  }
}

export function getCurrentConfig(): GameConfig | null {
  const configStr = localStorage.getItem(CURRENT_CONFIG_KEY);
  return configStr ? JSON.parse(configStr) : null;
}

export function getAllSavedConfigs(): GameConfig[] {
  const configsStr = localStorage.getItem(STORAGE_KEY);
  return configsStr ? JSON.parse(configsStr) : [];
}

export function saveNamedConfig(config: GameConfig) {
  if (!config.name) {
    throw new Error('Config must have a name to be saved');
  }
  
  const savedConfigs = getAllSavedConfigs();
  const existingIndex = savedConfigs.findIndex(c => c.name === config.name);
  
  if (existingIndex >= 0) {
    savedConfigs[existingIndex] = config;
  } else {
    savedConfigs.push(config);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedConfigs));
}

export function loadNamedConfig(name: string): GameConfig | null {
  const savedConfigs = getAllSavedConfigs();
  const config = savedConfigs.find(c => c.name === name);
  if (config) {
    localStorage.setItem(CURRENT_CONFIG_KEY, JSON.stringify(config));
  }
  return config || null;
}

export function deleteNamedConfig(name: string) {
  const savedConfigs = getAllSavedConfigs();
  const filteredConfigs = savedConfigs.filter(c => c.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredConfigs));
} 