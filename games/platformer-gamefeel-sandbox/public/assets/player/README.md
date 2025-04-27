# Player Sprite Sheet Layout

The player sprite sheet should be a single PNG file with the following layout:

## Frame Dimensions
- Each frame: 32x32 pixels
- Total frames: 18
- Total dimensions: 576x32 pixels

## Frame Order
1. Idle (4 frames)
   - Frame 0-3: Standing animation
2. Run (8 frames)
   - Frame 4-11: Running animation
3. Jump (3 frames)
   - Frame 12: Takeoff
   - Frame 13: Peak
   - Frame 14: Falling
4. Fall (1 frame)
   - Frame 15: Falling pose
5. Land (2 frames)
   - Frame 16: Impact
   - Frame 17: Recovery

## Color Coding (for placeholder)
- Idle: Blue shades
- Run: Green shades
- Jump: Yellow shades
- Fall: Orange
- Land: Red shades

## Notes
- All frames should be aligned to the bottom center
- The character's hitbox should be consistent across all frames
- The sprite will be scaled to 40x60 pixels in-game 