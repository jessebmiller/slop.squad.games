# Platformer Game Feel Designer Guide

This guide explains how to use the Platformer Game Feel Sandbox to tune your platformer's movement and camera feel. Each parameter is explained in detail with recommendations for different game styles.

## Player Movement Parameters

### Gravity
- **Description**: The base strength of gravity affecting the player
- **Range**: 0-2000
- **Default**: 1000
- **Effects**:
  - Higher values make the player fall faster
  - Lower values create floatier movement
- **Implementation**: Directly sets `scene.physics.world.gravity.y`
- **Recommendations**:
  - Fast-paced platformers: 1200-1500
  - Precision platformers: 800-1000
  - Floaty platformers: 500-800

### Jump Strength
- **Description**: Initial upward velocity when jumping
- **UI Range**: 0-1000 (higher values = higher jumps)
- **Internal Range**: -1000 to 0 (more negative = higher jumps)
- **Default**: 500 (internally -500)
- **Effects**:
  - Higher values make jumps higher
  - Lower values create shorter hops
- **Implementation**: Sets `sprite.setVelocityY()` when jumping (value is inverted internally)
- **Note**: The UI shows positive values for easier understanding, but the actual physics uses negative values for upward movement
- **Recommendations**:
  - High jumps: 600-800
  - Medium jumps: 400-600
  - Low jumps: 200-400

### Move Speed
- **Description**: Horizontal movement speed
- **Range**: 0-500
- **Default**: 200
- **Effects**:
  - Higher values make movement faster
  - Lower values create more controlled movement
- **Implementation**: Sets `sprite.setVelocityX()` for left/right movement
- **Recommendations**:
  - Fast movement: 300-400
  - Standard movement: 200-300
  - Slow movement: 100-200

### Coyote Time
- **Description**: Time window after leaving a platform where you can still jump
- **Range**: 0-500ms
- **Default**: 120ms
- **Effects**:
  - Higher values make edge jumping more forgiving
  - Lower values require more precise timing
- **Implementation**: Counts down from value when leaving ground
- **Recommendations**:
  - Forgiving: 150-200ms
  - Standard: 100-150ms
  - Precise: 50-100ms

### Jump Buffer Time
- **Description**: Time window before landing where jump input is remembered
- **Range**: 0-500ms
- **Default**: 150ms
- **Effects**:
  - Higher values make chaining jumps easier
  - Lower values require more precise timing
- **Implementation**: Counts down from value when jump is pressed in air
- **Recommendations**:
  - Forgiving: 150-200ms
  - Standard: 100-150ms
  - Precise: 50-100ms

### Jump Gravity Multiplier
- **Description**: Gravity multiplier while jumping (affects jump arc)
- **Range**: 0-1
- **Default**: 0.6
- **Effects**:
  - Lower values create floatier jumps
  - Higher values create snappier jumps
- **Implementation**: Multiplies gravity while rising and jump is held
- **Recommendations**:
  - Floaty jumps: 0.4-0.5
  - Standard jumps: 0.6-0.7
  - Snappy jumps: 0.8-0.9

### Scale
- **Description**: Player character size as a percentage
- **Range**: 1-500%
- **Default**: 100%
- **Effects**:
  - Higher values make the player larger
  - Lower values make the player smaller
- **Implementation**: Sets sprite scale
- **Recommendations**:
  - Large character: 150-200%
  - Standard size: 100%
  - Small character: 50-75%

### Terminal Velocity
- **Description**: Maximum falling speed
- **Range**: 100-1000
- **Default**: 500
- **Effects**:
  - Higher values allow faster falling
  - Lower values cap falling speed
- **Implementation**: Limits vertical velocity when falling
- **Recommendations**:
  - Fast falling: 800-1000
  - Standard falling: 500-700
  - Slow falling: 200-400

## Material Parameters

The game features different materials that affect player movement. Each material has its own set of parameters:

### Default Material
- **Acceleration**: 0-4 (How quickly the player speeds up)
- **Deceleration**: 0-4 (How quickly the player slows down)
- **Friction**: 0-1 (How much friction the material has, 1 = no friction)

### Ice Material
- **Acceleration**: 0-4 (How quickly the player speeds up on ice)
- **Deceleration**: 0-4 (How quickly the player slows down on ice)
- **Friction**: 0-1 (How much friction ice has, 1 = no friction)

### Air Material
- **Acceleration**: 0-4 (How quickly the player speeds up in air)
- **Deceleration**: 0-4 (How quickly the player slows down in air)
- **Friction**: 0-1 (How much friction air has, 1 = no friction)

## Camera Parameters

### Lerp X/Y
- **Description**: Camera smoothing in each axis
- **Range**: 0-1
- **Default**: 0.12
- **Effects**:
  - Lower values make camera movement snappier
  - Higher values create smoother camera movement
- **Implementation**: Sets Phaser camera lerp values
- **Recommendations**:
  - Snappy camera: 0.05-0.1
  - Standard camera: 0.1-0.15
  - Smooth camera: 0.15-0.2

### Deadzone Width/Height
- **Description**: Area around player where camera doesn't move
- **Range**: 0-400 pixels
- **Default**: Width 200, Height 150
- **Effects**:
  - Larger values give player more freedom before camera moves
  - Smaller values keep player more centered
- **Implementation**: Sets Phaser camera deadzone
- **Recommendations**:
  - Large freedom: 250-300
  - Standard: 150-200
  - Centered: 50-100

### Lookahead X/Y
- **Description**: How far camera looks ahead of player movement
- **Range**: 0-300 pixels
- **Default**: X 120, Y 60
- **Effects**:
  - Higher values show more of where player is going
  - Lower values keep focus on current position
- **Implementation**: Calculates offset based on player velocity
- **Recommendations**:
  - High lookahead: 150-200
  - Standard: 100-150
  - Low lookahead: 50-100

### Lookahead Smoothing X/Y
- **Description**: How smoothly the lookahead transitions
- **Range**: 0-1
- **Default**: 0.15
- **Effects**:
  - Lower values make lookahead snappier
  - Higher values create smoother transitions
- **Implementation**: Lerps between current and target lookahead
- **Recommendations**:
  - Snappy: 0.1-0.15
  - Standard: 0.15-0.2
  - Smooth: 0.2-0.25

### Lookahead Threshold X/Y
- **Description**: Minimum speed to trigger lookahead
- **Range**: 0-20
- **Default**: 5
- **Effects**:
  - Higher values require faster movement to trigger lookahead
  - Lower values make lookahead more sensitive
- **Implementation**: Compares player velocity to threshold
- **Recommendations**:
  - High threshold: 8-10
  - Standard: 5-7
  - Low threshold: 2-4

## Input Methods

The game supports both keyboard and gamepad input:

### Keyboard Controls
- **Left/Right**: A/D keys
- **Jump**: Space bar

### Gamepad Controls
- **Left/Right**: Left stick horizontal axis
- **Jump**: A button (Xbox) / Cross button (PlayStation)
