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
└── designerUI.ts        # Main designer interface
```

## Key Components

### 1. Main Game Loop (`main.ts`)
- **Responsibilities**:
  - Game initialization
  - Scene management
  - Main update loop
  - Component coordination
- **Key Functions**:
  - `preload()`: Asset loading
  - `create()`: Game setup
  - `update()`: Main game loop
- **Implementation**:
  - Uses Phaser's scene system
  - Coordinates player and camera updates
  - Handles gamepad connection

### 2. Player System (`player.ts`)
- **Components**:
  - `PlayerState`: Current player state
  - `PlayerParameters`: Tunable parameters
  - Movement physics
  - Collision handling
- **Key Functions**:
  - `createPlayer()`: Player initialization
  - `updatePlayer()`: Movement updates
  - Physics calculations
- **Implementation**:
  - Uses Phaser's arcade physics
  - Implements coyote time
  - Handles jump buffering
  - Custom gravity during jumps

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

### 5. Configuration Storage (`configStorage.ts`)
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

### 6. UI Systems (`configUI.ts`, `designerUI.ts`)
- **Components**:
  - Parameter sliders
  - Configuration management
  - Real-time updates
- **Key Functions**:
  - `setupDesignerUI()`: Main UI setup
  - `setupConfigUI()`: Config management UI
- **Implementation**:
  - DOM-based UI
  - Real-time parameter updates
  - Configuration management interface

## Data Flow

1. **Input Processing**:
   ```
   Input Device -> input.ts -> Player/Camera Updates
   ```

2. **Parameter Updates**:
   ```
   UI Sliders -> designerUI.ts -> Parameter Objects -> Game Systems
   ```

3. **Configuration Management**:
   ```
   UI Actions -> configUI.ts -> configStorage.ts -> Local Storage
   ```

## Technical Details

### State Management
- Player and camera states are updated every frame
- Parameters are stored in separate objects
- Configuration changes trigger immediate updates

### Physics Implementation
- Uses Phaser's arcade physics
- Custom gravity and movement calculations
- Collision detection and response
- Advanced jump mechanics with coyote time and buffering

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

## Development Guidelines

### Code Style
- TypeScript strict mode
- Consistent naming conventions
- Modular component design
- Clear documentation

### Testing
- Manual testing of core systems
- Performance monitoring
- Input validation

### Performance Considerations
- Optimize update loops
- Minimize DOM operations
- Efficient state updates
- Memory management

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

## Troubleshooting

### Common Issues
1. **Input Lag**
   - Check update loop timing
   - Verify input processing
   - Monitor frame rate

2. **Camera Jitter**
   - Adjust lerp values
   - Check deadzone settings
   - Verify update order

3. **Storage Issues**
   - Check browser support
   - Verify serialization
   - Monitor storage limits

### Debug Tools
- Browser console logging
- Performance monitoring
- Input state display
- Parameter value logging

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies
3. Run development server
4. Make changes
5. Submit pull request
