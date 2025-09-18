// src/types/player.ts
export interface VideoSource {
  label: string;
  url: string;
  quality: number;
}

export interface PlayerConfig {
  src: string | VideoSource[];
  poster?: string;
  title?: string;
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  showControls: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  playbackRate: number;
  currentSource: VideoSource | null;
}

export interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isDragging: boolean;
  isVertical: boolean;
  action: "seek" | "volume" | "brightness" | null;
}
