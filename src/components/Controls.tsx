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

  return (
    <>
      {state.loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-2">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>
      )}

      {state.showControls && (
        <>
          <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="flex items-center justify-center gap-8 pointer-events-auto"
              data-controls
            >
              <button
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSkip(-10);
                }}
                data-controls
                className="flex flex-col items-center justify-center w-14 h-14 text-white/80 bg-black/15 backdrop-blur-sm rounded-full border border-white/5 active:scale-90 transition-all duration-100 shadow-md touch-manipulation"
              >
                <RotateCcw className="w-5 h-5 mb-0.5" />
                <span className="text-sm font-medium leading-none">10</span>
              </button>

              <button
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onTogglePlay();
                }}
                data-controls
                className="flex items-center justify-center w-16 h-16 text-black bg-white/90 backdrop-blur-sm rounded-full active:scale-90 transition-all duration-100 shadow-lg border border-white/10 touch-manipulation"
              >
                {state.playing ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>

              <button
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSkip(10);
                }}
                data-controls
                className="flex flex-col items-center justify-center w-14 h-14 text-white/80 bg-black/15 backdrop-blur-sm rounded-full border border-white/5 active:scale-90 transition-all duration-100 shadow-md touch-manipulation"
              >
                <RotateCw className="w-5 h-5 mb-0.5" />
                <span className="text-sm font-medium leading-none">10</span>
              </button>
            </div>
          </div>

          <div className="absolute inset-0 transition-all duration-300 ease-out pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            <div
              className="absolute top-3 right-3 pointer-events-auto"
              data-controls
            >
              <button
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleFullscreen();
                }}
                onClick={onToggleFullscreen}
                className="p-2.5 md:p-2 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/40 transition-all shadow-md border border-white/5 touch-manipulation"
              >
                {state.fullscreen ? (
                  <Minimize className="w-5 h-5 md:w-4 md:h-4" />
                ) : (
                  <Maximize className="w-5 h-5 md:w-4 md:h-4" />
                )}
              </button>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 p-3 md:p-4 pointer-events-auto"
              data-controls
            >
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
                  className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onTogglePlay();
                    }}
                    onClick={onTogglePlay}
                    className="hidden md:flex items-center justify-center p-1.5 text-white/80 hover:text-white transition-all rounded-md hover:bg-white/10 touch-manipulation"
                  >
                    {state.playing ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>

                  <div className="hidden md:flex items-center gap-1">
                    <button
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onSkip(-10);
                      }}
                      onClick={() => onSkip(-10)}
                      className="p-1.5 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10 touch-manipulation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onSkip(10);
                      }}
                      onClick={() => onSkip(10)}
                      className="p-1.5 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10 touch-manipulation"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onToggleMute();
                      }}
                      onClick={onToggleMute}
                      className="p-2 md:p-1.5 text-white/70 hover:text-white transition-all rounded-md hover:bg-white/10 touch-manipulation"
                    >
                      {state.muted || state.volume === 0 ? (
                        <VolumeX className="w-5 h-5 md:w-4 md:h-4" />
                      ) : (
                        <Volume2 className="w-5 h-5 md:w-4 md:h-4" />
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
                          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-white/70 text-sm md:text-xs font-mono">
                    {formatTime(state.currentTime)} /{" "}
                    {formatTime(state.duration)}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="relative">
                    <button
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowSettings(!showSettings);
                      }}
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2.5 md:p-2 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10 touch-manipulation"
                    >
                      <Settings className="w-5 h-5 md:w-4 md:h-4" />
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
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onToggleFullscreen();
                    }}
                    onClick={onToggleFullscreen}
                    className="md:hidden p-2.5 text-white/60 hover:text-white/80 transition-all rounded-md hover:bg-white/10 touch-manipulation"
                  >
                    {state.fullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
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
