// src/components/PlayerControls.tsx
import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import type { PlayerState, VideoSource } from "../types/player";
import { SettingsMenu } from "./SettingsMenu";

interface PlayerControlsProps {
  state: PlayerState;
  sources: VideoSource[];
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSourceChange: (source: VideoSource) => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
}

export const PlayerControls = ({
  state,
  sources,
  onTogglePlay,
  onSeek,
  onSkip,
  onVolumeChange,
  onToggleMute,
  onSourceChange,
  onPlaybackRateChange,
  onToggleFullscreen,
}: PlayerControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (state.currentTime / state.duration) * 100 || 0;
  const bufferedPercentage = (state.buffered / state.duration) * 100 || 0;

  if (!state.showControls) return null;

  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col">
      <div className="absolute top-4 right-4">
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
        >
          {state.isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center md:hidden">
        <div className="flex items-center gap-8">
          <button
            onClick={() => onSkip(-10)}
            className="flex flex-col items-center p-3 rounded-full bg-black/40 backdrop-blur-sm text-white active:scale-95 transition-transform"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-xs mt-1">10</span>
          </button>

          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm text-white active:scale-95 transition-transform"
          >
            {state.isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>

          <button
            onClick={() => onSkip(10)}
            className="flex flex-col items-center p-3 rounded-full bg-black/40 backdrop-blur-sm text-white active:scale-95 transition-transform"
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-xs mt-1">10</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="relative group">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/30 rounded-full"
              style={{ width: `${bufferedPercentage}%` }}
            />
            <div
              className="absolute top-0 h-full bg-red-500 rounded-full transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={state.duration || 0}
            value={state.currentTime || 0}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-6 opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className="hidden md:flex items-center justify-center p-2 text-white hover:text-red-500 transition-colors"
            >
              {state.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onSkip(-10)}
                className="p-1.5 text-white/70 hover:text-white transition-colors rounded hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSkip(10)}
                className="p-1.5 text-white/70 hover:text-white transition-colors rounded hover:bg-white/10"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMute}
                className="p-1 text-white hover:text-red-500 transition-colors"
              >
                {state.isMuted || state.volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <div className="hidden sm:block relative w-20">
                <div className="h-1 bg-white/30 rounded-full">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${state.isMuted ? 0 : state.volume * 100}%`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={state.isMuted ? 0 : state.volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <span className="text-white/90 text-sm font-mono">
              {formatTime(state.currentTime)} / {formatTime(state.duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
                className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettings && (
                <SettingsMenu
                  sources={sources}
                  currentSource={state.currentSource}
                  playbackRate={state.playbackRate}
                  onSourceChange={onSourceChange}
                  onPlaybackRateChange={onPlaybackRateChange}
                  onClose={() => setShowSettings(false)}
                />
              )}
            </div>

            <button
              onClick={onToggleFullscreen}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
              {state.isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
