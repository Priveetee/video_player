// src/components/Controls.tsx
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
  RotateCcw,
  RotateCw,
  Settings,
} from "lucide-react";
import { useState } from "react";
import type { PlayerState, VideoQuality } from "../types";
import { SettingsDropdown } from "./SettingsDropdown";

interface ControlsProps {
  state: PlayerState;
  qualities: VideoQuality[];
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onToggleFullscreen: () => void;
  onQualityChange: (quality: VideoQuality) => void;
  onSpeedChange: (speed: number) => void;
  playbackSpeed: number;
}

export const Controls = ({
  state,
  qualities,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onSkip,
  onToggleFullscreen,
  onQualityChange,
  onSpeedChange,
  playbackSpeed,
}: ControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (state.currentTime / state.duration) * 100 || 0;
  const bufferedPercentage = (state.buffered / state.duration) * 100 || 0;

  const handleTouchStart = (e: React.TouchEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <>
      {state.loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-2">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>
      )}

      {state.showControls && (
        <>
          {/* Central mobile controls (small, iOS-like) */}
          <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="flex items-center justify-center gap-6 pointer-events-auto"
              data-controls
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSkip(-10);
                }}
                onTouchStart={(e) => handleTouchStart(e, () => onSkip(-10))}
                onTouchEnd={(e) => e.stopPropagation()}
                data-controls
                className="flex flex-col items-center justify-center w-9 h-9 text-white/80 bg-black/15 backdrop-blur-sm rounded-full border border-white/5 active:scale-90 transition-all duration-100 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium leading-none">10</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTogglePlay();
                }}
                onTouchStart={(e) => handleTouchStart(e, onTogglePlay)}
                onTouchEnd={(e) => e.stopPropagation()}
                data-controls
                className="flex items-center justify-center w-12 h-12 text-black bg-white/90 backdrop-blur-sm rounded-full active:scale-90 transition-all duration-100 shadow-lg border border-white/10"
              >
                {state.playing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSkip(10);
                }}
                onTouchStart={(e) => handleTouchStart(e, () => onSkip(10))}
                onTouchEnd={(e) => e.stopPropagation()}
                data-controls
                className="flex flex-col items-center justify-center w-9 h-9 text-white/80 bg-black/15 backdrop-blur-sm rounded-full border border-white/5 active:scale-90 transition-all duration-100 shadow-md"
              >
                <RotateCw className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium leading-none">10</span>
              </button>
            </div>
          </div>

          {/* Overlay gradient, top-right fullscreen, bottom controls */}
          <div className="absolute inset-0 transition-all duration-300 ease-out pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            <div className="absolute top-3 right-3 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFullscreen();
                }}
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/40 transition-all shadow-md border border-white/5"
              >
                {state.fullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 pointer-events-auto">
              <div className="relative mb-3 group">
                <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 h-full bg-white/25 rounded-full"
                    style={{ width: `${bufferedPercentage}%` }}
                  />
                  <div
                    className="absolute top-0 h-full bg-white rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <input
                  type="range"
                  min="0"
                  max={state.duration || 0}
                  value={state.currentTime || 0}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSeek(Number(e.target.value));
                  }}
                  className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlay();
                    }}
                    className="hidden md:flex items-center justify-center p-1.5 text-white/80 hover:text-white transition-all rounded-md hover:bg-white/10"
                  >
                    {state.playing ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>

                  <div className="hidden md:flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSkip(-10);
                      }}
                      className="p-1.5 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSkip(10);
                      }}
                      className="p-1.5 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMute();
                      }}
                      className="p-1.5 text-white/70 hover:text-white transition-all rounded-md hover:bg-white/10"
                    >
                      {state.muted || state.volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    <div className="hidden sm:flex items-center">
                      <div className="relative w-16">
                        <div className="h-1 bg-white/15 rounded-full">
                          <div
                            className="h-full bg-white rounded-full transition-all"
                            style={{
                              width: `${state.muted ? 0 : state.volume * 100}%`,
                            }}
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={state.muted ? 0 : state.volume}
                          onChange={(e) => {
                            e.stopPropagation();
                            onVolumeChange(Number(e.target.value));
                          }}
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-white/70 text-xs md:text-sm font-mono">
                    {formatTime(state.currentTime)} /{" "}
                    {formatTime(state.duration)}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      }}
                      className="p-2 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    <SettingsDropdown
                      isOpen={showSettings}
                      onClose={() => setShowSettings(false)}
                      currentSpeed={playbackSpeed}
                      currentQuality={state.quality}
                      qualities={qualities}
                      onSpeedChange={onSpeedChange}
                      onQualityChange={onQualityChange}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFullscreen();
                    }}
                    className="md:hidden p-2 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10"
                  >
                    {state.fullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
