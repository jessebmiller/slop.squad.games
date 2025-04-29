export {}; // This makes the file a module

declare global {
  interface Window {
    updateMaterialDebug: (material: string) => void;
    updateMaterialValues: (values: { acceleration: number; deceleration: number; friction: number }) => void;
    updateGravityDebug: (gravity: number) => void;
  }
} 