# Platformer Game Feel Sandbox - Features

## Overview

The Platformer Game Feel Sandbox is a web-based tool designed to help game designers and developers tune platformer game feel parameters in real-time. It provides an interface for adjusting player movement, camera behaviors, and material properties, with the ability to save and load different configurations.

## Core Features

### 1. Real-time Parameter Adjustment
- **Description**: All parameters can be adjusted while playing
- **Components**:
  - Slider-based controls for precise tuning
  - Real-time feedback of changes
  - Organized parameter groups
  - Material property controls
- **Benefits**:
  - Immediate testing of changes
  - Quick iteration on game feel
  - No need to recompile or restart

### 2. Player Movement Tuning
- **Parameters**:
  - Gravity (0-2000)
  - Jump Strength (0-1000, internally inverted)
  - Move Speed (0-500)
  - Coyote Time (0-500ms)
  - Jump Buffer Time (0-500ms)
  - Jump Gravity Multiplier (0-1)
  - Scale (1-500%)
  - Terminal Velocity (100-1000)
  - Wall Slide Speed (0-200)
  - Wall Jump Strength (0-1000)
  - Wall Jump Time (0-500ms)
  - Wall Jump Push (0-500)
  - Double Jump Strength (0-1000)
  - Dash Speed (0-1000)
  - Dash Duration (0-500ms)
  - Dash Cooldown (0-2000ms)
  - Ground Pound Speed (0-1000)
  - Ground Pound Bounce (0-500)
  - Ground Pound Cooldown (0-2000ms)
  - Variable Jump Height (0-1)
- **Features**:
  - Independent control of each parameter
  - Real-time physics updates
  - Advanced jump mechanics (coyote time, jump buffering)
  - Material-based movement modifiers
  - Wall slide and wall jump mechanics
  - Double jump system
  - Dash movement
  - Ground pound with bounce
  - Variable jump height control

### 3. Material System
- **Material Types**:
  - Default Material
  - Ice Material
  - Air Material
- **Material Properties**:
  - Acceleration (0-4)
  - Deceleration (0-4)
  - Friction (0-1)
- **Features**:
  - Real-time material switching
  - Custom material properties
  - Smooth transitions
  - Material-specific movement modifiers

### 4. Camera Behavior Tuning
- **Parameters**:
  - Lerp X/Y (0-1)
  - Deadzone Width/Height (0-400px)
  - Lookahead X/Y (0-300px)
  - Lookahead Smoothing (0-1)
  - Lookahead Threshold (0-20)
- **Features**:
  - Separate X and Y axis control
  - Velocity-based lookahead
  - Smooth transitions

### 5. Animation System
- **Animation States**:
  - Idle
  - Run
  - Jump
  - Fall
  - Land
- **Features**:
  - Smooth state transitions
  - Frame-based animations
  - Automatic state management
  - Real-time animation preview

### 6. Configuration Management
- **Features**:
  - Save current settings as named configs
  - Load existing configurations
  - Delete unwanted configs
  - Current config display
- **Storage**:
  - Uses browser's localStorage
  - Automatic config saving
  - Persistent between sessions
  - Material configuration support

### 7. Input Support
- **Supported Input Methods**:
  - Keyboard (A/D for movement, SPACE for jump, SHIFT for dash, S for ground pound)
  - Gamepad (Xbox-style controllers)
- **Features**:
  - Automatic input detection
  - Input buffering system
  - Frame-accurate input handling
  - Action input buffering (jump, dash, ground pound)
  - Continuous movement input
  - State tracking for buffered inputs
- **Benefits**:
  - More responsive controls
  - Forgiving input timing
  - Smoother action transitions
  - Professional-grade feel

### 8. User Interface
- **Components**:
  - Parameter sections
  - Real-time value displays
  - Save/Load interface
  - Material controls
- **Design**:
  - Clean layout
  - Organized controls
  - Right-side panel

## Technical Specifications

### System Requirements
- Modern web browser
- 2MB+ RAM
- 1024x768 minimum resolution
- Optional: Xbox-style gamepad

### Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance
- 60 FPS target
- Minimal input lag
- Smooth parameter updates
- Efficient material transitions

## Implementation Details

### Physics System
- Uses Phaser's arcade physics
- Custom gravity implementation
- Collision detection
- Advanced jump mechanics
- Material-based movement modifiers

### Material System
- Surface type detection
- Material property management
- Movement modification
- Smooth transitions

### Camera System
- Phaser camera follow
- Custom lookahead implementation
- Deadzone support
- Smooth lerp transitions

### Animation System
- State-based animations
- Frame-based system
- Smooth transitions
- Automatic state management

### Storage System
- localStorage-based
- JSON serialization
- Automatic state persistence
- Named configurations
- Material configuration support 