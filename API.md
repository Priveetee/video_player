# API Documentation

This document provides detailed API documentation for the Modern Video Player components, hooks, and types.

## Components

### VideoPlayer

The main video player component that combines all functionality.

```tsx
interface VideoPlayerProps {
  src: string | VideoQuality[];
  poster?: string;
  title?: string;
  className?: string;
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string \| VideoQuality[]` | ✅ | - | Video source URL or array of quality options |
| `poster` | `string` | ❌ | `undefined` | Poster image URL displayed before video loads |
| `title` | `string` | ❌ | `undefined` | Video title displayed below the player |
| `className` | `string` | ❌ | `""` | Additional CSS classes for styling |

#### Example

```tsx
// Single source
<VideoPlayer 
  src="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
  title="My Video"
  className="aspect-video w-full"
/>

// Multiple qualities
<VideoPlayer 
  src={[
    { label: "1080p", url: "video-1080p.mp4", quality: 1080 },
    { label: "720p", url: "video-720p.mp4", quality: 720 }
  ]}
  title="HD Video"
/>
```

### Controls

Internal component that renders the player controls overlay.

```tsx
interface ControlsProps {
  state: PlayerState;
  qualities: VideoQuality[];
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onToggleFullscreen: () => void;
  onQualityChange: (quality: VideoQuality) => void;
  onSpeedChange: (speed: number) => void;
  playbackSpeed: number;
}
```

#### Features

- Play/pause button with loading spinner
- Skip forward/backward buttons (±10 seconds)
- Progress bar with buffering indication
- Volume control with mute toggle
- Fullscreen toggle button
- Settings dropdown for quality and speed
- Time display (current/total)

### SettingsDropdown

Component for quality and playback speed selection.

```tsx
interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpeed: number;
  currentQuality: VideoQuality | null;
  qualities: VideoQuality[];
  onSpeedChange: (speed: number) => void;
  onQualityChange: (quality: VideoQuality) => void;
}
```

#### Available Speeds

- 0.25x (Quarter speed)
- 0.5x (Half speed)
- 0.75x (Three-quarter speed)
- 1x (Normal speed)
- 1.25x (25% faster)
- 1.5x (50% faster)
- 1.75x (75% faster)
- 2x (Double speed)

## Hooks

### usePlayer

Main hook for managing video player state and functionality.

```tsx
function usePlayer(qualities: VideoQuality[] = []): {
  videoRef: RefObject<HTMLVideoElement>;
  containerRef: RefObject<HTMLDivElement>;
  state: PlayerState;
  playbackSpeed: number;
  actions: {
    togglePlay: () => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    seek: (time: number) => void;
    skip: (seconds: number) => void;
    changeSpeed: (speed: number) => void;
    toggleFullscreen: () => void;
    changeQuality: (quality: VideoQuality) => void;
    showControlsTemporarily: () => void;
  };
}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `qualities` | `VideoQuality[]` | Array of available video quality options |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `videoRef` | `RefObject<HTMLVideoElement>` | React ref for the video element |
| `containerRef` | `RefObject<HTMLDivElement>` | React ref for the container element |
| `state` | `PlayerState` | Current player state |
| `playbackSpeed` | `number` | Current playback speed multiplier |
| `actions` | `object` | Collection of action functions |

#### Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| `togglePlay` | `()` | Toggle between play and pause |
| `toggleMute` | `()` | Toggle audio mute state |
| `setVolume` | `(volume: number)` | Set volume level (0-1) |
| `seek` | `(time: number)` | Seek to specific time in seconds |
| `skip` | `(seconds: number)` | Skip forward/backward by seconds |
| `changeSpeed` | `(speed: number)` | Change playback speed |
| `toggleFullscreen` | `()` | Toggle fullscreen mode |
| `changeQuality` | `(quality: VideoQuality)` | Switch video quality |
| `showControlsTemporarily` | `()` | Show controls for a few seconds |

### useTouchGestures

Hook for handling touch gestures on the video player.

```tsx
function useTouchGestures(
  onSeek: (time: number) => void,
  onVolumeChange: (volume: number) => void,
  onTogglePlay: () => void,
  onSkip: (seconds: number) => void,
  currentTime: number,
  duration: number,
  volume: number
): {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `onSeek` | `(time: number) => void` | Callback for seeking to specific time |
| `onVolumeChange` | `(volume: number) => void` | Callback for volume changes |
| `onTogglePlay` | `() => void` | Callback for play/pause toggle |
| `onSkip` | `(seconds: number) => void` | Callback for skipping |
| `currentTime` | `number` | Current playback time |
| `duration` | `number` | Total video duration |
| `volume` | `number` | Current volume level |

#### Gesture Mapping

| Gesture | Action | Description |
|---------|--------|-------------|
| **Center Tap** | Play/Pause | Toggle playback state |
| **Left Side Tap** | Skip -10s | Skip backward 10 seconds |
| **Right Side Tap** | Skip +10s | Skip forward 10 seconds |
| **Horizontal Swipe** | Seek | Navigate through timeline |
| **Vertical Swipe** | Volume | Adjust volume level |

#### Gesture Detection

- **Drag Threshold**: 20 pixels minimum movement to trigger gesture
- **Touch Zones**: Left 25%, center 50%, right 25% for tap detection
- **Sensitivity**: 
  - Horizontal: Proportional to screen width
  - Vertical: 300 pixels = full volume range

## Types

### VideoQuality

Represents a video quality option.

```typescript
interface VideoQuality {
  label: string;    // Display name (e.g., "1080p")
  url: string;      // Direct video file URL
  quality: number;  // Numeric quality for sorting
}
```

#### Examples

```typescript
const qualities: VideoQuality[] = [
  { label: "4K UHD", url: "video-4k.mp4", quality: 2160 },
  { label: "1080p HD", url: "video-1080p.mp4", quality: 1080 },
  { label: "720p", url: "video-720p.mp4", quality: 720 },
  { label: "480p", url: "video-480p.mp4", quality: 480 }
];
```

### PlayerState

Complete state of the video player.

```typescript
interface PlayerState {
  playing: boolean;           // Currently playing
  muted: boolean;             // Audio muted
  volume: number;             // Volume level (0-1)
  currentTime: number;        // Current time in seconds
  duration: number;           // Total duration in seconds
  buffered: number;           // Buffered amount in seconds
  fullscreen: boolean;        // Fullscreen mode active
  quality: VideoQuality | null; // Current quality
  showControls: boolean;      // Controls visible
  loading: boolean;           // Loading/buffering
}
```

### TouchState

Internal state for touch gesture tracking.

```typescript
interface TouchState {
  startX: number;             // Initial X position
  startY: number;             // Initial Y position
  startTime: number;          // Video time at start
  isDragging: boolean;        // Currently dragging
  isVertical: boolean;        // Vertical gesture
  action: "seek" | "volume" | null; // Current action
}
```

## Event Handling

### Video Events

The player listens to these HTML5 video events:

| Event | Description | State Updates |
|-------|-------------|---------------|
| `play` | Video starts playing | `playing: true, loading: false` |
| `pause` | Video pauses | `playing: false` |
| `timeupdate` | Time position changes | `currentTime`, `duration` |
| `progress` | Download progress | `buffered` |
| `volumechange` | Volume changes | `volume`, `muted` |
| `loadstart` | Loading starts | `loading: true` |
| `loadeddata` | Data loaded | `loading: false` |
| `waiting` | Buffering | `loading: true` |
| `canplay` | Ready to play | `loading: false` |
| `error` | Playback error | `loading: false` |

### Fullscreen Events

| Event | Description |
|-------|-------------|
| `fullscreenchange` | Fullscreen state changes |
| `webkitfullscreenchange` | Safari fullscreen change |
| `mozfullscreenchange` | Firefox fullscreen change |
| `MSFullscreenChange` | IE fullscreen change |

## Styling

### CSS Classes

The player uses Tailwind CSS classes for styling:

#### Container
- `relative` - Positioned container
- `bg-black` - Black background
- `rounded-lg` - Rounded corners
- `overflow-hidden` - Hide overflow
- `group` - Group hover effects
- `touch-manipulation` - Optimize touch

#### Controls
- `absolute` - Positioned overlay
- `inset-0` - Full coverage
- `bg-gradient-to-t` - Gradient overlay
- `backdrop-blur-sm` - Backdrop blur
- `transition-all` - Smooth transitions

#### Responsive
- `aspect-video` - 16:9 aspect ratio
- `w-full` - Full width
- `max-w-*` - Maximum width constraints
- `sm:*`, `md:*`, `lg:*` - Responsive breakpoints

### Custom Properties

You can override default styles using CSS custom properties:

```css
.video-player {
  --player-bg: theme(colors.black);
  --controls-bg: theme(colors.black / 15%);
  --text-color: theme(colors.white / 80%);
  --accent-color: theme(colors.blue.500);
}
```

## Browser Compatibility

### Supported Browsers

| Browser | Version | Notes |
|---------|---------|-------|
| **Chrome** | 60+ | Full support |
| **Firefox** | 55+ | Full support |
| **Safari** | 12+ | Full support |
| **Edge** | 79+ | Full support |
| **Chrome Mobile** | 60+ | Touch optimized |
| **Safari Mobile** | 12+ | Touch optimized |

### Required Features

- ES6+ JavaScript support
- HTML5 video element
- CSS Grid and Flexbox
- Touch events (mobile)
- Fullscreen API
- ResizeObserver (for responsive behavior)

### Polyfills

None required for supported browsers. For older browsers, consider:

- Core-js for ES6+ features
- Intersection Observer polyfill
- ResizeObserver polyfill

## Performance Considerations

### Optimization Tips

1. **Video Encoding**
   - Use modern codecs (H.264, H.265, VP9)
   - Multiple quality levels for adaptive streaming
   - Optimize bitrates for target audience

2. **Loading Strategy**
   - Use `preload="metadata"` by default
   - Consider `preload="none"` for data-sensitive users
   - Implement lazy loading for multiple videos

3. **Memory Management**
   - Component cleans up event listeners automatically
   - Video element releases resources on unmount
   - Use React.memo for components when appropriate

4. **Network Optimization**
   - Serve videos from CDN
   - Use HTTP/2 for multiple quality files
   - Implement progressive download

### Bundle Size

Current bundle impact:
- Core components: ~15KB (gzipped)
- Dependencies: React, Lucide icons
- No additional video libraries required

## Migration Guide

### From HTML5 Video

```tsx
// Before (HTML5)
<video controls>
  <source src="video.mp4" type="video/mp4" />
</video>

// After (VideoPlayer)
<VideoPlayer src="video.mp4" />
```

### From Other Players

Most video player libraries can be replaced with:

```tsx
// Generic replacement
<VideoPlayer
  src={videoSources}
  poster={posterImage}
  title={videoTitle}
  className="aspect-video w-full"
/>
```

Key differences:
- Touch gestures built-in
- No external dependencies
- Responsive by default
- React-native patterns