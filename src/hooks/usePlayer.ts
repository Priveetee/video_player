import { useState, useRef, useEffect, useCallback } from "react";
import type { PlayerState, VideoQuality } from "../types";

export const usePlayer = (qualities: VideoQuality[] = []) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const vibrate = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    vibrate();
    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Toggle play failed:", error);
    }
  }, [vibrate]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    vibrate();
    video.muted = !video.muted;
  }, [vibrate]);

  const setVolume = useCallback(
    (volume: number) => {
      const video = videoRef.current;
      if (!video) return;

      vibrate();
      const clampedVolume = Math.max(0, Math.min(1, volume));
      video.volume = clampedVolume;
      if (clampedVolume === 0) {
        video.muted = true;
      } else if (video.muted) {
        video.muted = false;
      }
    },
    [vibrate],
  );

  const seek = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;

      vibrate();
      const clampedTime = Math.max(0, Math.min(time, video.duration || 0));
      video.currentTime = clampedTime;
    },
    [vibrate],
  );

  const skip = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;

      vibrate();
      const newTime = Math.max(
        0,
        Math.min(video.currentTime + seconds, video.duration || 0),
      );
      video.currentTime = newTime;
    },
    [vibrate],
  );

  const changeSpeed = useCallback((speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    vibrate();
    try {
      if (!document.fullscreenElement) {
        if (video.webkitSupportsFullscreen) {
          await video.webkitEnterFullscreen();
        } else {
          await container.requestFullscreen();
        }
      } else {
        if (document.webkitFullscreenElement) {
          await document.webkitExitFullscreen();
        } else {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, [vibrate]);

  const changeQuality = useCallback((quality: VideoQuality) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;
    const currentSpeed = video.playbackRate;

    video.pause();
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
      if (timeUpdateTimeoutRef.current) {
        clearTimeout(timeUpdateTimeoutRef.current);
      }
      timeUpdateTimeoutRef.current = setTimeout(() => {
        safeSetState({
          currentTime: video.currentTime,
          duration: video.duration || 0,
        });
      }, 500);
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
      if (timeUpdateTimeoutRef.current)
        clearTimeout(timeUpdateTimeoutRef.current);
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setState((prev) => ({
        ...prev,
        fullscreen: !!(
          document.fullscreenElement || document.webkitFullscreenElement
        ),
      }));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (timeUpdateTimeoutRef.current) {
        clearTimeout(timeUpdateTimeoutRef.current);
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
