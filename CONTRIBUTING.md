# Contributing Guide

Thank you for your interest in contributing to the Modern Video Player! This guide will help you get started with development and contributions.

## Development Setup

### Prerequisites

- Node.js 18+ or Bun
- Git
- A modern browser for testing

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/video_player.git
   cd video_player
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000` to see the demo

## Project Structure

```
src/
├── components/          # React components
│   ├── VideoPlayer.tsx    # Main player component
│   ├── Controls.tsx       # Player controls overlay
│   └── SettingsDropdown.tsx # Quality/speed settings
├── hooks/              # Custom React hooks
│   ├── usePlayer.ts       # Core player logic
│   └── useTouchGestures.ts # Touch gesture handling
├── types/              # TypeScript definitions
│   └── index.ts          # All type exports
├── App.tsx             # Demo application
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Code Style

### TypeScript

We use TypeScript for type safety. Follow these conventions:

```typescript
// Use interfaces for props and public APIs
interface VideoPlayerProps {
  src: string | VideoQuality[];
  title?: string;
}

// Use types for unions and utilities
type GestureAction = "seek" | "volume" | null;

// Export types from index.ts
export type { VideoPlayerProps, GestureAction };
```

### React Patterns

```tsx
// Use functional components with hooks
export const VideoPlayer = ({ src, title }: VideoPlayerProps) => {
  // Custom hooks first
  const { state, actions } = usePlayer();
  
  // Event handlers
  const handleClick = useCallback(() => {
    actions.togglePlay();
  }, [actions]);
  
  // Render
  return <div onClick={handleClick}>{/* ... */}</div>;
};

// Use proper prop destructuring
const Controls = ({ state, onTogglePlay }: ControlsProps) => {
  // Component logic
};
```

### CSS/Styling

We use Tailwind CSS for styling:

```tsx
// Prefer utility classes
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>

// Group related utilities
<div className="
  flex items-center justify-center
  w-12 h-12
  bg-white/90 backdrop-blur-sm
  rounded-full
  active:scale-90 transition-all
">
  {/* content */}
</div>

// Use responsive utilities
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

## Making Changes

### 1. Choose an Issue

- Check existing issues for bugs or feature requests
- Comment on the issue to let others know you're working on it
- For new features, create an issue first to discuss

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Development Workflow

1. **Make your changes**
   - Follow the code style guidelines
   - Add TypeScript types for new features
   - Update documentation if needed

2. **Test your changes**
   ```bash
   npm run dev
   # Test manually in browser
   # Try different screen sizes
   # Test touch gestures on mobile
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new gesture for volume control"
   ```

### Commit Message Convention

Use conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add keyboard shortcuts for player controls
fix: resolve fullscreen exit on mobile Safari
docs: update API documentation for new props
refactor: extract touch gesture logic to separate hook
```

## Testing

### Manual Testing Checklist

When making changes, test these scenarios:

#### Desktop
- [ ] Play/pause with spacebar and click
- [ ] Volume control with mouse wheel
- [ ] Seek with progress bar
- [ ] Fullscreen mode
- [ ] Quality switching
- [ ] Speed adjustment
- [ ] Keyboard navigation

#### Mobile/Touch
- [ ] Tap to play/pause
- [ ] Swipe left/right to seek
- [ ] Swipe up/down for volume
- [ ] Tap left/right sides to skip
- [ ] Pinch gestures don't interfere
- [ ] Fullscreen orientation changes
- [ ] Controls auto-hide

#### Cross-browser
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

### Test Cases to Consider

```tsx
// Example test scenarios
const testScenarios = [
  {
    name: "Single video source",
    props: { src: "video.mp4" }
  },
  {
    name: "Multiple qualities",
    props: { 
      src: [
        { label: "1080p", url: "video-1080p.mp4", quality: 1080 },
        { label: "720p", url: "video-720p.mp4", quality: 720 }
      ]
    }
  },
  {
    name: "With poster image",
    props: { 
      src: "video.mp4",
      poster: "poster.jpg"
    }
  }
];
```

## Feature Guidelines

### Adding New Features

1. **Consider the scope**
   - Keep features focused and simple
   - Ensure mobile compatibility
   - Maintain accessibility

2. **Follow existing patterns**
   - Use the same hook patterns
   - Follow component structure
   - Match existing prop naming

3. **Document new features**
   - Add JSDoc comments
   - Update README.md
   - Add to EXAMPLES.md if applicable
   - Update API.md

### Example: Adding a New Control

```tsx
// 1. Add to PlayerState if needed
interface PlayerState {
  // existing properties...
  newFeature: boolean;
}

// 2. Add action to usePlayer
const usePlayer = () => {
  // existing code...
  
  const toggleNewFeature = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      newFeature: !prev.newFeature 
    }));
  }, []);
  
  return {
    // existing returns...
    actions: {
      // existing actions...
      toggleNewFeature,
    }
  };
};

// 3. Add control button
const Controls = ({ state, onToggleNewFeature }: ControlsProps) => {
  return (
    <div>
      {/* existing controls */}
      <button
        onClick={onToggleNewFeature}
        className="p-2 rounded-full bg-black/20 text-white/80"
      >
        <NewFeatureIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

// 4. Wire it up in VideoPlayer
const VideoPlayer = (props) => {
  const { state, actions } = usePlayer();
  
  return (
    <Controls
      state={state}
      onToggleNewFeature={actions.toggleNewFeature}
      // other props...
    />
  );
};
```

## Performance Guidelines

### React Performance

```tsx
// Use useMemo for expensive calculations
const sortedQualities = useMemo(() => 
  qualities.sort((a, b) => b.quality - a.quality),
  [qualities]
);

// Use useCallback for event handlers
const handleVolumeChange = useCallback((volume: number) => {
  actions.setVolume(volume);
}, [actions]);

// Avoid inline objects and functions
// Bad
<Component style={{ color: 'red' }} onClick={() => doSomething()} />

// Good
const style = { color: 'red' };
const handleClick = useCallback(() => doSomething(), []);
<Component style={style} onClick={handleClick} />
```

### Video Performance

```tsx
// Optimize video loading
<video
  preload="metadata"  // Load metadata only
  playsInline        // Prevent fullscreen on iOS
  muted             // Allow autoplay
/>

// Handle multiple qualities efficiently
const qualities = useMemo(() => {
  if (typeof src === 'string') {
    return [{ label: 'Auto', url: src, quality: 720 }];
  }
  return src.sort((a, b) => b.quality - a.quality);
}, [src]);
```

## Accessibility

### Requirements

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels where needed

### Implementation

```tsx
// Keyboard support
const handleKeyDown = useCallback((e: KeyboardEvent) => {
  switch (e.key) {
    case ' ':
      e.preventDefault();
      actions.togglePlay();
      break;
    case 'ArrowLeft':
      actions.skip(-10);
      break;
    case 'ArrowRight':
      actions.skip(10);
      break;
  }
}, [actions]);

// ARIA labels
<button
  aria-label={state.playing ? 'Pause video' : 'Play video'}
  onClick={actions.togglePlay}
>
  {state.playing ? <Pause /> : <Play />}
</button>

// Focus management
<div
  tabIndex={0}
  onKeyDown={handleKeyDown}
  aria-label="Video player"
>
```

## Pull Request Process

### Before Submitting

1. **Test thoroughly**
   - Manual testing on desktop and mobile
   - Cross-browser compatibility
   - Performance check

2. **Update documentation**
   - README.md for new features
   - API.md for new props/methods
   - EXAMPLES.md for usage examples

3. **Clean commit history**
   ```bash
   git rebase -i HEAD~n  # Squash related commits
   ```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Cross-browser testing
- [ ] Performance testing

## Screenshots
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### Review Process

1. **Automated checks** (if any)
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Merge** when approved

## Release Process

### Versioning

We follow Semantic Versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Changelog

All notable changes are documented in CHANGELOG.md:

```markdown
## [1.2.0] - 2024-01-15

### Added
- Touch gestures for mobile interaction
- Quality selection dropdown
- Keyboard shortcuts

### Fixed
- Fullscreen mode on iOS Safari
- Volume control precision

### Changed
- Improved touch sensitivity
- Updated control icons
```

## Getting Help

### Resources

- **Documentation**: README.md, API.md, EXAMPLES.md
- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions

### Communication

- Be respectful and constructive
- Provide clear reproduction steps for bugs
- Include relevant code samples
- Test thoroughly before reporting

### Common Issues

1. **Video not loading**
   - Check CORS headers
   - Verify video URL
   - Test in different browsers

2. **Touch gestures not working**
   - Ensure `touch-action` CSS is set
   - Check for event propagation issues
   - Test on actual mobile devices

3. **Performance issues**
   - Check video file sizes
   - Monitor memory usage
   - Use browser dev tools

Thank you for contributing to the Modern Video Player! 🎥