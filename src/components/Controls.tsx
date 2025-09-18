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
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>
      )}

      <div
        className={`md:hidden absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          state.showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSkip(-10);
            }}
            className="flex flex-col items-center justify-center w-12 h-12 text-white bg-black/40 backdrop-blur-sm rounded-full active:scale-95 transition-transform"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">10</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            className="flex items-center justify-center w-16 h-16 text-white bg-black/40 backdrop-blur-sm rounded-full active:scale-95 transition-transform"
          >
            {state.playing ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-0.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSkip(10);
            }}
            className="flex flex-col items-center justify-center w-12 h-12 text-white bg-black/40 backdrop-blur-sm rounded-full active:scale-95 transition-transform"
          >
            <RotateCw className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">10</span>
          </button>
        </div>
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          state.showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={onToggleFullscreen}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-black/20"
          >
            {state.fullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="relative mb-3 group cursor-pointer">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden group-hover:h-1.5 transition-all duration-200">
              <div
                className="absolute top-0 h-full bg-white/30 rounded-full transition-all duration-300"
                style={{ width: `${bufferedPercentage}%` }}
              />
              <div
                className="absolute top-0 h-full bg-red-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <input
              type="range"
              min="0"
              max={state.duration || 0}
              value={state.currentTime || 0}
              onChange={(e) =>
                onSeek(Number((e.target as HTMLInputElement).value))
              }
              className="absolute inset-0 w-full h-5 opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePlay}
                className="hidden md:flex items-center justify-center text-white hover:text-red-500 transition-colors p-1"
              >
                {state.playing ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => onSkip(-10)}
                  className="text-white/70 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSkip(10)}
                  className="text-white/70 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleMute}
                  className="text-white hover:text-red-500 transition-colors p-1"
                >
                  {state.muted || state.volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <div className="hidden sm:flex items-center">
                  <div className="relative w-16">
                    <div className="h-1 bg-white/30 rounded-full">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-100"
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
                      onChange={(e) =>
                        onVolumeChange(
                          Number((e.target as HTMLInputElement).value),
                        )
                      }
                      className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="text-white/90 text-xs font-medium">
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  }}
                  className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
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
                onClick={onToggleFullscreen}
                className="md:hidden text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
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
  );
};
