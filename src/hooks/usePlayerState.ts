// src/hooks/usePlayerState.ts
import { useState, useCallback } from "react";
import type { PlayerState, VideoSource } from "../types/player";

export const usePlayerState = (sources: VideoSource[]) => {
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    isLoading: true,
    showControls: true,
    volume: 1,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    playbackRate: 1,
    currentSource: sources[0] || null,
  });

  const updateState = useCallback((updates: Partial<PlayerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return { state, updateState };
};
