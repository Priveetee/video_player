// src/hooks/usePlayer.ts - VERSION FINALE NETTOYÉE
import { useState, useRef, useEffect, useCallback } from "react";
import type { PlayerState, VideoQuality } from "../types";

export const usePlayer = (qualities: VideoQuality[] = []) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [state, setState] = useState<PlayerState>({
    playing: false,
    muted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    fullscreen: false,
    quality: qualities[0] || null,
    showControls: true,
    loading: false,
  });

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Toggle play failed:", error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  }, []);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    video.volume = clampedVolume;
    if (clampedVolume === 0) {
      video.muted = true;
    } else if (video.muted) {
      video.muted = false;
    }
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedTime = Math.max(0, Math.min(time, video.duration || 0));
    video.currentTime = clampedTime;
  }, []);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(
      0,
      Math.min(video.currentTime + seconds, video.duration || 0),
    );
    video.currentTime = newTime;
  }, []);

  const changeSpeed = useCallback((speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  const changeQuality = useCallback((quality: VideoQuality) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;
    const currentSpeed = video.playbackRate;

    setState((prev) => ({ ...prev, quality, loading: true }));

    video.src = quality.url;
    video.load();

    const handleLoadedData = () => {
      if (!video) return;

      video.currentTime = currentTime;
      video.playbackRate = currentSpeed;

      if (wasPlaying) {
        video.play().catch(console.error);
      }

      setState((prev) => ({ ...prev, loading: false }));
      video.removeEventListener("loadeddata", handleLoadedData);
    };

    video.addEventListener("loadeddata", handleLoadedData);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setState((prev) => ({ ...prev, showControls: true }));

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setState((prev) =>
        prev.playing ? { ...prev, showControls: false } : prev,
      );
    }, 3000);
  }, []);

  // Event listeners unifiés
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;

    const safeSetState = (updates: Partial<PlayerState>) => {
      if (mounted) {
        setState((prev) => ({ ...prev, ...updates }));
      }
    };

    const handlePlay = () => safeSetState({ playing: true, loading: false });
    const handlePause = () => safeSetState({ playing: false });
    const handleLoadStart = () => safeSetState({ loading: true });
    const handleLoadedData = () => safeSetState({ loading: false });
    const handleWaiting = () => safeSetState({ loading: true });
    const handleCanPlay = () => safeSetState({ loading: false });

    const handleTimeUpdate = () => {
      safeSetState({
        currentTime: video.currentTime,
        duration: video.duration || 0,
      });
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        safeSetState({
          buffered: video.buffered.end(video.buffered.length - 1),
        });
      }
    };

    const handleVolumeChange = () => {
      safeSetState({
        volume: video.volume,
        muted: video.muted,
      });
    };

    const handleError = () => safeSetState({ loading: false });

    // Attacher les événements
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("error", handleError);

    return () => {
      mounted = false;
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("error", handleError);
    };
  }, []);

  // Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState((prev) => ({
        ...prev,
        fullscreen: !!document.fullscreenElement,
      }));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return {
    videoRef,
    containerRef,
    state,
    playbackSpeed,
    actions: {
      togglePlay,
      toggleMute,
      setVolume,
      seek,
      skip,
      changeSpeed,
      toggleFullscreen,
      changeQuality,
      showControlsTemporarily,
    },
  };
};
