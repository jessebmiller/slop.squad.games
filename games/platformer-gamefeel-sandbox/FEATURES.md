# Platformer Game Feel Sandbox - Features

## Overview

The Platformer Game Feel Sandbox is a web-based tool designed to help game designers and developers tune platformer game feel parameters in real-time. It provides an interface for adjusting player movement and camera behaviors, with the ability to save and load different configurations.

## Core Features

### 1. Real-time Parameter Adjustment
- **Description**: All parameters can be adjusted while playing
- **Components**:
  - Slider-based controls for precise tuning
  - Real-time feedback of changes
  - Organized parameter groups
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
- **Features**:
  - Independent control of each parameter
  - Real-time physics updates
  - Advanced jump mechanics (coyote time, jump buffering)

### 3. Camera Behavior Tuning
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

### 4. Configuration Management
- **Features**:
  - Save current settings as named configs
  - Load existing configurations
  - Delete unwanted configs
  - Current config display
- **Storage**:
  - Uses browser's localStorage
  - Automatic config saving
  - Persistent between sessions

### 5. Input Support
- **Supported Input Methods**:
  - Keyboard (A/D for movement, SPACE for jump)
  - Gamepad (Xbox-style controllers)
- **Features**:
  - Automatic input detection
  - Basic input mapping
  - Gamepad connection handling

### 6. User Interface
- **Components**:
  - Parameter sections
  - Real-time value displays
  - Save/Load interface
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

## Implementation Details

### Physics System
- Uses Phaser's arcade physics
- Custom gravity implementation
- Collision detection
- Advanced jump mechanics

### Camera System
- Phaser camera follow
- Custom lookahead implementation
- Deadzone support
- Smooth lerp transitions

### Storage System
- localStorage-based
- JSON serialization
- Automatic state persistence
- Named configurations 