// src/types/index.ts

/**
 * Represents a video quality option with its metadata
 */
export interface VideoQuality {
  /** Display label for the quality option (e.g., "1080p", "720p") */
  label: string;
  /** Direct URL to the video file */
  url: string;
  /** Numeric quality level for sorting (higher = better quality) */
  quality: number;
}

/**
 * Complete state of the video player
 */
export interface PlayerState {
  /** Whether the video is currently playing */
  playing: boolean;
  /** Whether the audio is muted */
  muted: boolean;
  /** Current volume level (0-1) */
  volume: number;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration of the video in seconds */
  duration: number;
  /** Amount of video buffered in seconds */
  buffered: number;
  /** Whether the player is in fullscreen mode */
  fullscreen: boolean;
  /** Currently selected video quality */
  quality: VideoQuality | null;
  /** Whether player controls are visible */
  showControls: boolean;
  /** Whether the video is currently loading/buffering */
  loading: boolean;
}

/**
 * Props for the main VideoPlayer component
 */
export interface VideoPlayerProps {
  /** Video source - can be a single URL string or array of quality options */
  src: string | VideoQuality[];
  /** Optional poster image URL displayed before video loads */
  poster?: string;
  /** Optional video title displayed below the player */
  title?: string;
  /** Additional CSS classes for styling the player container */
  className?: string;
}

/**
 * Internal state for tracking touch gesture interactions
 */
export interface TouchState {
  /** Initial horizontal touch position */
  startX: number;
  /** Initial vertical touch position */
  startY: number;
  /** Video time when touch gesture started */
  startTime: number;
  /** Whether user is currently dragging/swiping */
  isDragging: boolean;
  /** Whether the gesture is primarily vertical */
  isVertical: boolean;
  /** Type of action being performed with the gesture */
  action: "seek" | "volume" | null;
}
