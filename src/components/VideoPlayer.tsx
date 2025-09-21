import { useMemo } from "react";
import type { VideoPlayerProps } from "../types";
import { usePlayer } from "../hooks/usePlayer";
import { Controls } from "./Controls";

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

  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-controls]") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }
    actions.togglePlay();
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={`relative bg-black rounded-lg overflow-hidden aspect-video w-full max-w-full group touch-manipulation ${className || ""}`}
        onMouseMove={actions.showControlsTemporarily}
        onMouseEnter={actions.showControlsTemporarily}
        onClick={handleContainerClick}
      >
        <video
          ref={videoRef}
          src={
            state.quality?.url ||
            (typeof src === "string" ? src : qualities[0]?.url)
          }
          poster={poster}
          className="absolute inset-0 w-full h-full object-contain"
          onDoubleClick={actions.toggleFullscreen}
          playsInline
          preload="metadata"
          muted={state.muted}
          onClick={(e) => e.stopPropagation()}
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
