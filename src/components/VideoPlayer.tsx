// src/components/VideoPlayer.tsx
import { useMemo } from "react";
import type { VideoPlayerProps } from "../types";
import { usePlayer } from "../hooks/usePlayer";
import { useTouchGestures } from "../hooks/useTouchGestures";
import { Controls } from "./Controls";

/**
 * Modern video player component with touch gestures, quality selection, and fullscreen support.
 * 
 * Features:
 * - Touch gesture controls (tap to play/pause, swipe to seek/volume)
 * - Multiple quality options
 * - Fullscreen support
 * - Custom playback speed
 * - Mobile-optimized interface
 * 
 * @param src - Video source URL or array of quality options
 * @param poster - Optional poster image URL
 * @param title - Optional video title displayed below player
 * @param className - Additional CSS classes for styling
 */
export const VideoPlayer = ({
  src,
  poster,
  title,
  className,
}: VideoPlayerProps) => {
  const qualities = useMemo(() => {
    if (typeof src === "string") {
      return [{ label: "Auto", url: src, quality: 720 }];
    }
    return src.sort((a, b) => b.quality - a.quality);
  }, [src]);

  const { videoRef, containerRef, state, playbackSpeed, actions } =
    usePlayer(qualities);

  const touchGestures = useTouchGestures(
    actions.seek,
    actions.setVolume,
    actions.togglePlay,
    actions.skip,
    state.currentTime,
    state.duration,
    state.volume,
  );

  const handleContainerTouch = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest("[data-controls]") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }

    touchGestures.handleTouchStart(e);
  };

  const handleContainerTouchMove = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest("[data-controls]") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }

    touchGestures.handleTouchMove(e);
  };

  const handleContainerTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest("[data-controls]") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }

    touchGestures.handleTouchEnd(e);
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={`relative bg-black rounded-lg overflow-hidden group touch-manipulation ${className || ""}`}
        onMouseMove={actions.showControlsTemporarily}
        onMouseEnter={actions.showControlsTemporarily}
        onTouchStart={handleContainerTouch}
        onTouchMove={handleContainerTouchMove}
        onTouchEnd={handleContainerTouchEnd}
      >
        <video
          ref={videoRef}
          src={
            state.quality?.url ||
            (typeof src === "string" ? src : qualities[0]?.url)
          }
          poster={poster}
          className="w-full h-full object-contain"
          onDoubleClick={actions.toggleFullscreen}
          playsInline
          preload="metadata"
        />

        <Controls
          state={state}
          qualities={qualities}
          playbackSpeed={playbackSpeed}
          onTogglePlay={actions.togglePlay}
          onToggleMute={actions.toggleMute}
          onVolumeChange={actions.setVolume}
          onSeek={actions.seek}
          onSkip={actions.skip}
          onSpeedChange={actions.changeSpeed}
          onToggleFullscreen={actions.toggleFullscreen}
          onQualityChange={actions.changeQuality}
        />
      </div>

      {title && (
        <div className="px-2">
          <h1 className="text-white text-xl font-bold mb-2">{title}</h1>
        </div>
      )}
    </div>
  );
};
