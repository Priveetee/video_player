# Video Player Examples

This document provides practical examples of how to use the Modern Video Player component in different scenarios.

## Basic Examples

### Simple Video Player

The most basic usage with a single video source:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function SimpleExample() {
  return (
    <VideoPlayer
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      title="Big Buck Bunny"
      className="w-full max-w-4xl mx-auto"
    />
  );
}
```

### Video with Poster Image

Add a poster image that shows before the video loads:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function PosterExample() {
  return (
    <VideoPlayer
      src="https://example.com/my-video.mp4"
      poster="https://example.com/my-poster.jpg"
      title="My Awesome Video"
      className="aspect-video rounded-lg shadow-lg"
    />
  );
}
```

## Multi-Quality Examples

### HD Video with Multiple Qualities

Provide multiple quality options for better user experience:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function HDVideoExample() {
  const videoQualities = [
    {
      label: "4K UHD",
      url: "https://example.com/video-4k.mp4",
      quality: 2160
    },
    {
      label: "1080p HD",
      url: "https://example.com/video-1080p.mp4",
      quality: 1080
    },
    {
      label: "720p",
      url: "https://example.com/video-720p.mp4",
      quality: 720
    },
    {
      label: "480p",
      url: "https://example.com/video-480p.mp4",
      quality: 480
    }
  ];

  return (
    <VideoPlayer
      src={videoQualities}
      poster="https://example.com/hd-poster.jpg"
      title="High Definition Demo"
      className="aspect-video w-full max-w-6xl mx-auto"
    />
  );
}
```

### Mobile-Optimized Qualities

Optimize for mobile with appropriate quality levels:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function MobileOptimizedExample() {
  const mobileQualities = [
    {
      label: "HD",
      url: "https://example.com/mobile-hd.mp4",
      quality: 720
    },
    {
      label: "Standard",
      url: "https://example.com/mobile-standard.mp4",
      quality: 480
    },
    {
      label: "Low",
      url: "https://example.com/mobile-low.mp4",
      quality: 360
    }
  ];

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <VideoPlayer
        src={mobileQualities}
        title="Mobile-Optimized Video"
        className="w-full rounded-lg"
      />
      
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>Optimized for mobile viewing</p>
        <p>Touch controls: Tap center to play, swipe to seek/volume</p>
      </div>
    </div>
  );
}
```

## Integration Examples

### Video Gallery

Create a gallery of videos with the player:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  src: string;
  poster: string;
  description: string;
}

function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const videos: Video[] = [
    {
      id: "1",
      title: "Nature Documentary",
      src: "https://example.com/nature.mp4",
      poster: "https://example.com/nature-poster.jpg",
      description: "Beautiful nature scenes"
    },
    {
      id: "2", 
      title: "City Timelapse",
      src: "https://example.com/city.mp4",
      poster: "https://example.com/city-poster.jpg",
      description: "Urban life in motion"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-white text-3xl font-bold text-center mb-8">
        Video Gallery
      </h1>
      
      {selectedVideo && (
        <div className="mb-8">
          <VideoPlayer
            src={selectedVideo.src}
            poster={selectedVideo.poster}
            title={selectedVideo.title}
            className="aspect-video max-w-4xl mx-auto"
          />
          <p className="text-gray-300 text-center mt-4">
            {selectedVideo.description}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {videos.map((video) => (
          <div 
            key={video.id}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => setSelectedVideo(video)}
          >
            <img
              src={video.poster}
              alt={video.title}
              className="w-full aspect-video object-cover rounded mb-3"
            />
            <h3 className="text-white font-semibold">{video.title}</h3>
            <p className="text-gray-400 text-sm">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Learning Platform Integration

Use the player in an educational context:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";
import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  videoSrc: string;
  duration: string;
  completed: boolean;
}

function LearningPlatform() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Introduction to React",
      videoSrc: "https://example.com/react-intro.mp4",
      duration: "15:30",
      completed: false
    },
    {
      id: "2",
      title: "State Management",
      videoSrc: "https://example.com/state-management.mp4", 
      duration: "22:45",
      completed: false
    },
    {
      id: "3",
      title: "Custom Hooks",
      videoSrc: "https://example.com/custom-hooks.mp4",
      duration: "18:20",
      completed: false
    }
  ]);

  const markCompleted = (index: number) => {
    setLessons(prev => prev.map((lesson, i) => 
      i === index ? { ...lesson, completed: true } : lesson
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 p-4">
        <h2 className="text-white text-xl font-bold mb-6">Course Lessons</h2>
        
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className={`p-3 rounded-lg mb-3 cursor-pointer transition-colors ${
              index === currentLesson 
                ? 'bg-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setCurrentLesson(index)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">{lesson.title}</h3>
              {lesson.completed && (
                <span className="text-green-400 text-sm">✓</span>
              )}
            </div>
            <p className="text-gray-400 text-sm">{lesson.duration}</p>
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-6">
            {lessons[currentLesson].title}
          </h1>
          
          <VideoPlayer
            src={lessons[currentLesson].videoSrc}
            title={lessons[currentLesson].title}
            className="aspect-video w-full mb-6"
          />
          
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
              disabled={currentLesson === 0}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous Lesson
            </button>
            
            <button
              onClick={() => markCompleted(currentLesson)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Mark as Completed
            </button>
            
            <button
              onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
              disabled={currentLesson === lessons.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Advanced Configuration

### Custom Styling

Customize the appearance with Tailwind classes:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function CustomStyledExample() {
  return (
    <div className="bg-gradient-to-br from-purple-900 to-blue-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <VideoPlayer
          src="https://example.com/video.mp4"
          title="Custom Styled Player"
          className="
            aspect-video 
            rounded-xl 
            shadow-2xl 
            ring-4 
            ring-purple-500/20 
            border 
            border-purple-500/30
          "
        />
        
        <div className="mt-6 text-center">
          <h2 className="text-white text-xl font-semibold mb-2">
            Premium Video Experience
          </h2>
          <p className="text-purple-200">
            Enhanced with custom styling and effects
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Responsive Design

Create responsive layouts for different screen sizes:

```tsx
import { VideoPlayer } from "./components/VideoPlayer";

function ResponsiveExample() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto">
        {/* Mobile: Full width, Tablet: 2/3, Desktop: 1/2 */}
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
          <VideoPlayer
            src="https://example.com/responsive-video.mp4"
            title="Responsive Video Player"
            className="
              aspect-video 
              w-full 
              rounded-lg 
              shadow-lg
              transition-all 
              duration-300
            "
          />
        </div>
        
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm md:text-base">
            Automatically adapts to screen size
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Best Practices

### Performance Optimization

```tsx
import { VideoPlayer } from "./components/VideoPlayer";
import { useMemo } from "react";

function OptimizedExample({ videoId }: { videoId: string }) {
  // Memoize video qualities to prevent unnecessary re-renders
  const videoQualities = useMemo(() => [
    {
      label: "1080p",
      url: `https://cdn.example.com/${videoId}/1080p.mp4`,
      quality: 1080
    },
    {
      label: "720p", 
      url: `https://cdn.example.com/${videoId}/720p.mp4`,
      quality: 720
    }
  ], [videoId]);

  return (
    <VideoPlayer
      src={videoQualities}
      poster={`https://cdn.example.com/${videoId}/poster.jpg`}
      title="Optimized Video"
      className="aspect-video w-full"
    />
  );
}
```

### Error Handling

```tsx
import { VideoPlayer } from "./components/VideoPlayer";
import { useState } from "react";

function ErrorHandlingExample() {
  const [videoError, setVideoError] = useState(false);
  
  const fallbackVideo = "https://example.com/fallback-video.mp4";
  const primaryVideo = "https://example.com/primary-video.mp4";

  return (
    <div>
      {videoError ? (
        <div className="text-center text-red-400 p-8">
          <p>Video failed to load. Using fallback...</p>
        </div>
      ) : null}
      
      <VideoPlayer
        src={videoError ? fallbackVideo : primaryVideo}
        title="Error Handling Example"
        className="aspect-video w-full"
      />
    </div>
  );
}
```

These examples demonstrate the flexibility and power of the Modern Video Player component across various use cases and scenarios.