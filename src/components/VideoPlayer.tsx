// src/components/VideoPlayer.tsx - VERSION CORRIGÉE
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

  const handleContainerClick = (e: React.MouseEvent) => {
    // Vérifier si on a cliqué sur un élément de contrôle
    const target = e.target as HTMLElement;

    // Exclure tous les éléments de contrôles
    if (
      target.closest(".settings-menu") ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("[data-controls]") // On va ajouter cette class
    ) {
      return;
    }

    // Si on clique ailleurs, toggle play
    actions.togglePlay();
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.togglePlay();
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={`relative bg-black rounded-lg overflow-hidden group ${className || ""}`}
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
          className="w-full h-full object-contain"
          onClick={handleVideoClick}
          onDoubleClick={actions.toggleFullscreen}
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
