// src/components/SettingsMenu.tsx
import { useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import type { VideoSource } from "../types/player";

interface SettingsMenuProps {
  sources: VideoSource[];
  currentSource: VideoSource | null;
  playbackRate: number;
  onSourceChange: (source: VideoSource) => void;
  onPlaybackRateChange: (rate: number) => void;
  onClose: () => void;
}

const PLAYBACK_SPEEDS = [
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 1.75, label: "1.75x" },
  { value: 2, label: "2x" },
];

export const SettingsMenu = ({
  sources,
  currentSource,
  playbackRate,
  onSourceChange,
  onPlaybackRateChange,
  onClose,
}: SettingsMenuProps) => {
  const [activeMenu, setActiveMenu] = useState<"main" | "quality" | "speed">(
    "main",
  );

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div className="absolute bottom-full right-0 mb-2 z-50 min-w-48 bg-black/95 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
        {activeMenu === "main" && (
          <div className="p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu("speed");
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
            >
              <span className="text-sm">Vitesse</span>
              <span className="text-sm text-white/60">
                {PLAYBACK_SPEEDS.find((s) => s.value === playbackRate)?.label}
              </span>
            </button>

            {sources.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu("quality");
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-white/10 rounded transition-colors"
              >
                <span className="text-sm">Qualité</span>
                <span className="text-sm text-white/60">
                  {currentSource?.label}
                </span>
              </button>
            )}
          </div>
        )}

        {activeMenu === "speed" && (
          <div>
            <button
              onClick={() => setActiveMenu("main")}
              className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white border-b border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Vitesse</span>
            </button>
            <div className="max-h-48 overflow-y-auto">
              {PLAYBACK_SPEEDS.map((speed) => (
                <button
                  key={speed.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaybackRateChange(speed.value);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">{speed.label}</span>
                  {playbackRate === speed.value && (
                    <Check className="w-4 h-4 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeMenu === "quality" && (
          <div>
            <button
              onClick={() => setActiveMenu("main")}
              className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white border-b border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Qualité</span>
            </button>
            <div className="max-h-48 overflow-y-auto">
              {sources.map((source) => (
                <button
                  key={source.quality}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSourceChange(source);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">{source.label}</span>
                  {currentSource?.quality === source.quality && (
                    <Check className="w-4 h-4 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
