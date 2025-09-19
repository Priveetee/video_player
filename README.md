# Modern Video Player

A modern, touch-friendly video player built with React and TypeScript. Features include gesture controls, quality selection, playback speed control, and a sleek mobile-optimized interface.

## Features

### 🎮 Controls
- **Play/Pause**: Toggle video playback
- **Volume Control**: Adjust audio levels with visual indicator
- **Seek Bar**: Navigate through video timeline with buffering indication
- **Fullscreen**: Toggle fullscreen mode
- **Quality Selection**: Choose from multiple video qualities
- **Playback Speed**: Adjust playback speed from 0.25x to 2x

### 📱 Touch Gestures
- **Center Tap**: Play/pause video
- **Left Side Tap**: Skip backward 10 seconds  
- **Right Side Tap**: Skip forward 10 seconds
- **Horizontal Swipe**: Seek through video timeline
- **Vertical Swipe**: Adjust volume level

### 🎨 Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-hide Controls**: Controls fade out during playback
- **Loading States**: Visual feedback during buffering
- **Gradient Overlays**: Subtle gradients for better text readability
- **Touch-optimized**: Large touch targets for mobile interaction

## Installation

```bash
# Clone the repository
git clone https://github.com/Priveetee/video_player.git
cd video_player

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

### Basic Usage

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function App() {
  return (
    <VideoPlayer
      src="https://example.com/video.mp4"
      title="My Video"
      className="aspect-video max-w-full"
    />
  );
}
```

### Multi-Quality Video

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function App() {
  const videoSources = [
    { label: "1080p", url: "https://example.com/video-1080p.mp4", quality: 1080 },
    { label: "720p", url: "https://example.com/video-720p.mp4", quality: 720 },
    { label: "480p", url: "https://example.com/video-480p.mp4", quality: 480 },
  ];

  return (
    <VideoPlayer
      src={videoSources}
      title="Multi-Quality Video"
      poster="https://example.com/poster.jpg"
      className="aspect-video max-w-full"
    />
  );
}
```

## API Reference

### VideoPlayer Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `src` | `string \| VideoQuality[]` | ✅ | Video source URL or array of quality options |
| `poster` | `string` | ❌ | Poster image URL shown before video loads |
| `title` | `string` | ❌ | Video title displayed below player |
| `className` | `string` | ❌ | Additional CSS classes for styling |

### VideoQuality Interface

```typescript
interface VideoQuality {
  label: string;    // Display name (e.g., "1080p")
  url: string;      // Video file URL
  quality: number;  // Quality level for sorting (higher = better)
}
```

## Architecture

The video player is built using a modular architecture with custom React hooks:

### Components

- **VideoPlayer**: Main container component that orchestrates everything
- **Controls**: UI controls overlay with play/pause, seek bar, volume, etc.
- **SettingsDropdown**: Quality and speed selection dropdown

### Hooks

- **usePlayer**: Manages video state, playback controls, and DOM interactions
- **useTouchGestures**: Handles touch/swipe gestures for mobile interaction

### Key Features Implementation

#### Touch Gesture System
The touch gesture system uses a state machine approach:

1. **Touch Start**: Records initial touch position and time
2. **Touch Move**: Detects gesture type (horizontal seek vs vertical volume)
3. **Touch End**: Executes appropriate action or falls back to tap detection

#### State Management
Video state is managed centrally in the `usePlayer` hook:

```typescript
interface PlayerState {
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  fullscreen: boolean;
  quality: VideoQuality | null;
  showControls: boolean;
  loading: boolean;
}
```

#### Event Handling
The player handles various video events:
- `play`/`pause`: Update playing state
- `timeupdate`: Track current time and duration
- `progress`: Update buffering progress
- `volumechange`: Sync volume state
- `fullscreenchange`: Track fullscreen state

## Development

### Project Structure

```
src/
├── components/
│   ├── VideoPlayer.tsx     # Main player component
│   ├── Controls.tsx        # Player controls UI
│   └── SettingsDropdown.tsx # Quality/speed settings
├── hooks/
│   ├── usePlayer.ts        # Core player logic
│   └── useTouchGestures.ts # Touch gesture handling
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Demo application
└── main.tsx              # Application entry point
```

### Tech Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

### Browser Support

- Modern browsers with ES6+ support
- Mobile Safari (iOS 10+)
- Chrome Mobile (Android 5+)
- Desktop Chrome, Firefox, Safari, Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for commercial or personal purposes.