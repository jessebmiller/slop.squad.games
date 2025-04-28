export type MaterialType = 'default' | 'ice' | 'air';

export interface Material {
  type: MaterialType;
  acceleration: number;
  deceleration: number;
  friction: number;
  color: number;
}

export const DEFAULT_MATERIAL: Material = {
  type: 'default',
  acceleration: 0.5,
  deceleration: 0.7,
  friction: 0.8,
  color: 0x888888,
};

export const ICE_MATERIAL: Material = {
  type: 'ice',
  acceleration: 0.2,
  deceleration: 0.1,
  friction: 0.1,
  color: 0x88ffff,
};

export const AIR_MATERIAL: Material = {
  type: 'air',
  acceleration: 0.2,
  deceleration: 0.3,
  friction: 1.0, // No friction in air
  color: 0x000000, // Not used
};

export const MATERIALS: Record<MaterialType, Material> = {
  default: DEFAULT_MATERIAL,
  ice: ICE_MATERIAL,
  air: AIR_MATERIAL,
}; 