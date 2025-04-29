import { Material, DEFAULT_MATERIAL, AIR_MATERIAL } from '../materials';
import { PlayerState } from './types';

// Add global debug function
declare global {
  interface Window {
    updateMaterialDebug: (material: string) => void;
    updateMaterialValues: (values: { acceleration: number; deceleration: number; friction: number }) => void;
  }
}

export const updateMaterialState = (
  state: PlayerState,
  scene: Phaser.Scene
): void => {
  if (state.sprite.body) {
    const body = state.sprite.body as Phaser.Physics.Arcade.Body;
    if (body.touching.down) {
      const platforms = scene.children.list.filter(
        child => child.getData('material') && child !== state.sprite
      ) as Phaser.GameObjects.GameObject[];
      
      for (const platform of platforms) {
        const platformBody = platform.body as Phaser.Physics.Arcade.Body;
        if (platformBody && body.touching.down) {
          const playerBottom = body.bottom;
          const platformTop = platformBody.top;
          const distance = Math.abs(playerBottom - platformTop);
          if (distance < 10) {
            state.currentMaterial = platform.getData('material');
            if (window.updateMaterialDebug && state.currentMaterial) {
              window.updateMaterialDebug(state.currentMaterial.type);
              // Log material values when material changes
              if (window.updateMaterialValues) {
                window.updateMaterialValues({
                  acceleration: state.currentMaterial.acceleration,
                  deceleration: state.currentMaterial.deceleration,
                  friction: state.currentMaterial.friction
                });
              }
            }
            break;
          }
        }
      }
    } else {
      state.currentMaterial = null;
      if (window.updateMaterialDebug) {
        window.updateMaterialDebug('None');
        if (window.updateMaterialValues) {
          window.updateMaterialValues({
            acceleration: AIR_MATERIAL.acceleration,
            deceleration: AIR_MATERIAL.deceleration,
            friction: AIR_MATERIAL.friction
          });
        }
      }
    }
  }
};

export const applyFriction = (
  velocityX: number,
  onGround: boolean,
  currentMaterial: Material | null
): number => {
  const friction = onGround && currentMaterial ? currentMaterial.friction : AIR_MATERIAL.friction;
  return velocityX * friction;
};

export const getCurrentAcceleration = (
  onGround: boolean,
  currentMaterial: Material | null
): number => {
  return onGround 
    ? (currentMaterial?.acceleration ?? DEFAULT_MATERIAL.acceleration)
    : AIR_MATERIAL.acceleration;
};

export const getCurrentDeceleration = (
  onGround: boolean,
  currentMaterial: Material | null
): number => {
  return onGround
    ? (currentMaterial?.deceleration ?? DEFAULT_MATERIAL.deceleration)
    : AIR_MATERIAL.deceleration;
}; 