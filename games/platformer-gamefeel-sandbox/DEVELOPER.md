# Platformer Game Feel Sandbox - Developer Documentation

## Architecture Overview

The Platformer Game Feel Sandbox is built using Phaser.js and follows a modular architecture. The codebase is organized into several key components that handle different aspects of the system.

## File Structure

```
src/
├── main.ts              # Game initialization and main loop
├── player.ts            # Player movement and physics
├── camera.ts            # Camera behavior and controls
├── input.ts             # Input handling
├── configStorage.ts     # Configuration persistence
├── configUI.ts          # Configuration UI components
├── designerUI.ts        # Main designer interface
├── materials.ts         # Material system definitions
└── player/
    └── animations.ts    # Player animation system
```

## Key Components

### 1. Main Game Loop (`main.ts`)
- **Responsibilities**:
  - Game initialization
  - Scene management
  - Main update loop
  - Component coordination
  - Material system setup
- **Key Functions**:
  - `preload()`: Asset loading
  - `create()`: Game setup
  - `update()`: Main game loop
- **Implementation**:
  - Uses Phaser's scene system
  - Coordinates player and camera updates
  - Handles gamepad connection
  - Manages material system

### 2. Player System (`player.ts`)
- **Components**:
  - `PlayerState`: Current player state
  - `PlayerParameters`: Tunable parameters
  - Movement physics
  - Collision handling
  - Material interaction
- **Key Functions**:
  - `createPlayer()`: Player initialization
  - `updatePlayer()`: Movement updates
  - Physics calculations
  - Material handling
- **Implementation**:
  - Uses Phaser's arcade physics
  - Implements coyote time
  - Handles jump buffering
  - Custom gravity during jumps
  - Material-based movement modifiers

### 3. Camera System (`camera.ts`)
- **Components**:
  - `CameraState`: Current camera state
  - `CameraParameters`: Tunable parameters
  - Camera behaviors
  - Smoothing algorithms
- **Key Functions**:
  - `createCameraState()`: Camera initialization
  - `setupCamera()`: Camera configuration
  - `updateCamera()`: Camera updates
- **Implementation**:
  - Uses Phaser's camera follow
  - Custom lookahead system
  - Velocity-based offset calculation
  - Smooth lerp transitions

### 4. Input System (`input.ts`)
- **Components**:
  - Keyboard input
  - Gamepad input
  - Input state management
- **Key Functions**:
  - `getInputState()`: Current input state
- **Implementation**:
  - Handles A/D keys for movement
  - SPACE for jumping
  - Xbox-style gamepad support
  - Basic input mapping

### 5. Material System (`materials.ts`)
- **Components**:
  - Material definitions
  - Material properties
  - Material switching
- **Key Functions**:
  - Material property access
  - Material state management
- **Implementation**:
  - Defines default, ice, and air materials
  - Handles material transitions
  - Manages material properties

### 6. Animation System (`player/animations.ts`)
- **Components**:
  - Animation states
  - Animation configurations
  - State transitions
- **Key Functions**:
  - `createAnimations()`: Animation setup
  - `getAnimationForState()`: State management
- **Implementation**:
  - Handles idle, run, jump, fall, and land animations
  - Smooth state transitions
  - Frame-based animation system

### 7. Configuration Storage (`configStorage.ts`)
- **Components**:
  - Local storage interface
  - Configuration serialization
  - State management
- **Key Functions**:
  - `saveCurrentConfig()`: Save configuration
  - `loadNamedConfig()`: Load configuration
  - `getAllSavedConfigs()`: List configurations
  - `deleteNamedConfig()`: Remove configuration
- **Implementation**:
  - Uses browser's localStorage
  - JSON serialization
  - Named configuration support
  - Material configuration storage

### 8. UI Systems (`configUI.ts`, `designerUI.ts`)
- **Components**:
  - Parameter sliders
  - Configuration management
  - Real-time updates
  - Material controls
- **Key Functions**:
  - `setupDesignerUI()`: Main UI setup
  - `setupConfigUI()`: Config management UI
- **Implementation**:
  - DOM-based UI
  - Real-time parameter updates
  - Configuration management interface
  - Material parameter controls

## Data Flow

1. **Input Processing**:
   ```
   Input Device -> input.ts -> Player/Camera Updates
   ```

2. **Parameter Updates**:
   ```
   UI Sliders -> designerUI.ts -> Parameter Objects -> Game Systems
   ```

3. **Material System**:
   ```
   Collision Detection -> Material System -> Player Movement Modifiers
   ```

4. **Configuration Management**:
   ```
   UI Actions -> configUI.ts -> configStorage.ts -> Local Storage
   ```

## Technical Details

### State Management
- Player and camera states are updated every frame
- Parameters are stored in separate objects
- Configuration changes trigger immediate updates
- Material states are tracked per collision

### Physics Implementation
- Uses Phaser's arcade physics
- Custom gravity and movement calculations
- Collision detection and response
- Advanced jump mechanics with coyote time and buffering
- Material-based movement modifiers

### Material System
- Defines different surface types
- Handles material transitions
- Modifies player movement
- Supports custom material properties

### Camera System
- Smooth lerp-based movement
- Deadzone implementation
- Lookahead calculations
- Separate X/Y axis control
- Velocity-based lookahead

### Storage System
- Uses browser's localStorage
- JSON serialization
- Automatic state persistence
- Named configurations
- Material configuration storage

## Extension Points

### Adding New Parameters
1. Add to appropriate parameter interface
2. Create UI controls
3. Implement update logic
4. Add storage support

### Custom Camera Behaviors
1. Extend camera system
2. Add new parameters
3. Implement behavior logic
4. Update UI controls

### New Input Methods
1. Extend input system
2. Add device detection
3. Implement mapping
4. Update documentation

### New Materials
1. Define material properties
2. Add material type
3. Implement material effects
4. Update UI controls

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies
3. Run development server
4. Make changes
5. Submit pull request
