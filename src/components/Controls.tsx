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
import { SettingsModal } from "./SettingsModal";

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
          <div className="bg-black/80 rounded-full p-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
      )}

      {/* Mobile Center Controls */}
      <div
        className={`md:hidden absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          state.showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-12">
          <button
            onClick={() => onSkip(-10)}
            className="flex flex-col items-center justify-center w-14 h-14 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all duration-200 active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-[10px] mt-1">10</span>
          </button>

          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center w-20 h-20 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all duration-200 active:scale-95"
          >
            {state.playing ? (
              <Pause className="w-10 h-10" />
            ) : (
              <Play className="w-10 h-10 ml-1" />
            )}
          </button>

          <button
            onClick={() => onSkip(10)}
            className="flex flex-col items-center justify-center w-14 h-14 text-white bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all duration-200 active:scale-95"
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-[10px] mt-1">10</span>
          </button>
        </div>
      </div>

      {/* Main Controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          state.showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top right fullscreen only */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onToggleFullscreen}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-black/30"
          >
            {state.fullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar - YouTube Style amélioré */}
          <div className="relative mb-4 group cursor-pointer">
            <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden group-hover:h-1.5 transition-all duration-200">
              {/* Buffered */}
              <div
                className="absolute top-0 h-full bg-white/40 rounded-full transition-all duration-300"
                style={{ width: `${bufferedPercentage}%` }}
              />
              {/* Progress - YouTube Red Clean */}
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
              className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-4">
              {/* Desktop Play/Pause */}
              <button
                onClick={onTogglePlay}
                className="hidden md:flex items-center justify-center text-white hover:text-red-500 transition-colors p-1"
              >
                {state.playing ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              {/* Desktop Skip buttons */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => onSkip(-10)}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onSkip(10)}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleMute}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {state.muted || state.volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <div className="hidden sm:flex items-center">
                  <div className="relative w-20">
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
                      className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="text-white text-sm font-medium">
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Fullscreen - Mobile */}
              <button
                onClick={onToggleFullscreen}
                className="md:hidden text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentSpeed={playbackSpeed}
        currentQuality={state.quality}
        qualities={qualities}
        onSpeedChange={onSpeedChange}
        onQualityChange={onQualityChange}
      />
    </>
  );
};
