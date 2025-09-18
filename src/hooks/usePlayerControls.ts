// src/hooks/usePlayerControls.ts
import { useRef, useCallback, useEffect } from "react";
import type { PlayerState, VideoSource } from "../types/player";

export const usePlayerControls = (
  state: PlayerState,
  updateState: (updates: Partial<PlayerState>) => void,
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const play = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      updateState({ isPlaying: true });
    } catch (error) {
      console.error("Play failed:", error);
    }
  }, [updateState]);

  const pause = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    updateState({ isPlaying: false });
  }, [updateState]);

  const togglePlay = useCallback(() => {
    state.isPlaying ? pause() : play();
  }, [state.isPlaying, play, pause]);

  const seek = useCallback(
    (time: number) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(time, state.duration),
      );
    },
    [state.duration],
  );

  const skip = useCallback(
    (seconds: number) => {
      if (!videoRef.current) return;
      const newTime = videoRef.current.currentTime + seconds;
      seek(newTime);
    },
    [seek],
  );

  const setVolume = useCallback(
    (volume: number) => {
      if (!videoRef.current) return;
      const clampedVolume = Math.max(0, Math.min(1, volume));
      videoRef.current.volume = clampedVolume;
      updateState({ volume: clampedVolume, isMuted: clampedVolume === 0 });
    },
    [updateState],
  );

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !state.isMuted;
    videoRef.current.muted = newMuted;
    updateState({ isMuted: newMuted });
  }, [state.isMuted, updateState]);

  const changeSource = useCallback(
    (source: VideoSource) => {
      if (!videoRef.current) return;

      const wasPlaying = state.isPlaying;
      const currentTime = videoRef.current.currentTime;

      updateState({ isLoading: true, currentSource: source });

      videoRef.current.src = source.url;
      videoRef.current.load();

      const handleLoadedData = () => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = currentTime;
        if (wasPlaying) videoRef.current.play();
        updateState({ isLoading: false });
        videoRef.current.removeEventListener("loadeddata", handleLoadedData);
      };

      videoRef.current.addEventListener("loadeddata", handleLoadedData);
    },
    [state.isPlaying, updateState],
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      if (!videoRef.current) return;
      videoRef.current.playbackRate = rate;
      updateState({ playbackRate: rate });
    },
    [updateState],
  );

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  }, []);

  const showControls = useCallback(() => {
    updateState({ showControls: true });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (state.isPlaying) {
        updateState({ showControls: false });
      }
    }, 3000);
  }, [state.isPlaying, updateState]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      updateState({
        currentTime: video.currentTime,
        duration: video.duration || 0,
      });
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        updateState({
          buffered: video.buffered.end(video.buffered.length - 1),
        });
      }
    };

    const handleLoadStart = () => updateState({ isLoading: true });
    const handleCanPlay = () => updateState({ isLoading: false });
    const handlePlay = () => updateState({ isPlaying: true });
    const handlePause = () => updateState({ isPlaying: false });

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [updateState]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      updateState({ isFullscreen: !!document.fullscreenElement });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [updateState]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = state.volume;
    video.muted = state.isMuted;
  }, [state.volume, state.isMuted]);

  return {
    videoRef,
    containerRef,
    togglePlay,
    seek,
    skip,
    setVolume,
    toggleMute,
    changeSource,
    setPlaybackRate,
    toggleFullscreen,
    showControls,
  };
};
