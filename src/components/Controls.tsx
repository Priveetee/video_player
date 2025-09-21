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
  playbackSpeed: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onSpeedChange: (speed: number) => void;
  onToggleFullscreen: () => void;
  onQualityChange: (quality: VideoQuality) => void;
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>
      )}

      {state.showControls && (
        <>
          <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className="flex items-center justify-center gap-8 pointer-events-auto"
              data-controls
            >
              <button
                onClick={() => onSkip(-10)}
                data-controls
                className="flex flex-col items-center justify-center w-12 h-12 text-white bg-black/30 backdrop-blur-sm rounded-full border border-white/20 active:scale-90 transition-all duration-100 shadow-lg touch-manipulation"
              >
                <RotateCcw className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium leading-none">-10s</span>
              </button>

              <button
                onClick={onTogglePlay}
                data-controls
                className="flex items-center justify-center w-16 h-16 text-black bg-white/90 backdrop-blur-sm rounded-full active:scale-90 transition-all duration-100 shadow-xl border border-white/20 touch-manipulation"
              >
                {state.playing ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => onSkip(10)}
                data-controls
                className="flex flex-col items-center justify-center w-12 h-12 text-white bg-black/30 backdrop-blur-sm rounded-full border border-white/20 active:scale-90 transition-all duration-100 shadow-lg touch-manipulation"
              >
                <RotateCw className="w-4 h-4 mb-1" />
                <span className="text-xs font-medium leading-none">+10s</span>
              </button>
            </div>
          </div>

          <div className="absolute inset-0 transition-all duration-300 ease-out pointer-events-none z-20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            <div
              className="absolute top-4 right-4 pointer-events-auto"
              data-controls
            >
              <button
                onClick={onToggleFullscreen}
                className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 active:scale-90 transition-all shadow-md border border-white/20 touch-manipulation"
              >
                {state.fullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto md:p-6"
              data-controls
            >
              <div className="relative mb-4 group">
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 h-full bg-white/30 rounded-full transition-all"
                    style={{ width: `${bufferedPercentage}%` }}
                  />
                  <div
                    className="absolute top-0 h-full bg-white rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <input
                  type="range"
                  min="0"
                  max={state.duration || 0}
                  value={state.currentTime || 0}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={onTogglePlay}
                    className="hidden md:flex items-center justify-center p-2 text-white hover:text-white/90 active:scale-90 transition-all rounded-full hover:bg-white/10 touch-manipulation w-10 h-10"
                  >
                    {state.playing ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>

                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => onSkip(-10)}
                      className="p-2 text-white/70 hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/10 touch-manipulation w-9 h-9"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSkip(10)}
                      className="p-2 text-white/70 hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/10 touch-manipulation w-9 h-9"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                    <button
                      onClick={onToggleMute}
                      className="p-2 text-white/70 hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/10 touch-manipulation w-9 h-9"
                    >
                      {state.muted || state.volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    <div className="relative w-20">
                      <div className="h-1.5 bg-white/20 rounded-full">
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
                        step="0.05"
                        value={state.muted ? 0 : state.volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                        className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer touch-manipulation"
                      />
                    </div>
                  </div>

                  <div className="text-white/70 text-xs md:text-sm font-mono min-w-0 flex-shrink-0 truncate">
                    {formatTime(state.currentTime)} /{" "}
                    {formatTime(state.duration)}
                  </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-white/60 hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/10 touch-manipulation w-10 h-10"
                    >
                      <Settings className="w-5 h-5" />
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
                    className="hidden md:flex p-2 text-white/60 hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/10 touch-manipulation w-10 h-10"
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
