// src/hooks/usePlayer.ts
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
    loading: true,
  });

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (state.playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [state.playing]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = !state.muted;
    setState((prev) => ({ ...prev, muted: !prev.muted }));
  }, [state.muted]);

  const setVolume = useCallback((volume: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = volume;
    videoRef.current.muted = volume === 0;
    setState((prev) => ({ ...prev, volume, muted: volume === 0 }));
  }, []);

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = time;
    setState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const skip = useCallback(
    (seconds: number) => {
      if (!videoRef.current) return;

      const newTime = Math.max(
        0,
        Math.min(videoRef.current.currentTime + seconds, state.duration),
      );
      videoRef.current.currentTime = newTime;
      setState((prev) => ({ ...prev, currentTime: newTime }));
    },
    [state.duration],
  );

  const changeSpeed = useCallback((speed: number) => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setState((prev) => ({ ...prev, fullscreen: true }));
      } else {
        await document.exitFullscreen();
        setState((prev) => ({ ...prev, fullscreen: false }));
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  const changeQuality = useCallback(
    (quality: VideoQuality) => {
      if (!videoRef.current) return;

      const currentTime = videoRef.current.currentTime;
      const wasPlaying = state.playing;
      const currentSpeed = videoRef.current.playbackRate;

      setState((prev) => ({ ...prev, quality, loading: true }));

      videoRef.current.src = quality.url;
      videoRef.current.load();

      const handleLoadedData = () => {
        if (!videoRef.current) return;

        videoRef.current.currentTime = currentTime;
        videoRef.current.playbackRate = currentSpeed;

        if (wasPlaying) {
          videoRef.current.play();
        }
        setState((prev) => ({ ...prev, loading: false }));
        videoRef.current.removeEventListener("loadeddata", handleLoadedData);
      };

      videoRef.current.addEventListener("loadeddata", handleLoadedData);
    },
    [state.playing],
  );

  const showControlsTemporarily = useCallback(() => {
    setState((prev) => ({ ...prev, showControls: true }));

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (state.playing) {
        setState((prev) => ({ ...prev, showControls: false }));
      }
    }, 3000);
  }, [state.playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setState((prev) => ({ ...prev, playing: true }));
    const handlePause = () => setState((prev) => ({ ...prev, playing: false }));
    const handleLoadedData = () =>
      setState((prev) => ({ ...prev, loading: false }));
    const handleWaiting = () =>
      setState((prev) => ({ ...prev, loading: true }));
    const handleCanPlay = () =>
      setState((prev) => ({ ...prev, loading: false }));

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: video.currentTime,
        duration: video.duration || 0,
      }));
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setState((prev) => ({
          ...prev,
          buffered: video.buffered.end(video.buffered.length - 1),
        }));
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

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
