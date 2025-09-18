// src/types/index.ts
export interface VideoQuality {
  label: string;
  url: string;
  quality: number;
}

export interface PlayerState {
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

export interface VideoPlayerProps {
  src: string | VideoQuality[];
  poster?: string;
  title?: string;
  className?: string;
}

export interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isDragging: boolean;
  isVertical: boolean;
  action: "seek" | "volume" | null;
}
