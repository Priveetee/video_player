// src/components/SettingsDropdown.tsx
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { VideoQuality } from "../types";

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpeed: number;
  currentQuality: VideoQuality | null;
  qualities: VideoQuality[];
  onSpeedChange: (speed: number) => void;
  onQualityChange: (quality: VideoQuality) => void;
}

const speeds = [
  { value: 0.25, label: "0.25" },
  { value: 0.5, label: "0.5" },
  { value: 0.75, label: "0.75" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25" },
  { value: 1.5, label: "1.5" },
  { value: 1.75, label: "1.75" },
  { value: 2, label: "2" },
];

export const SettingsDropdown = ({
  isOpen,
  onClose,
  currentSpeed,
  currentQuality,
  qualities,
  onSpeedChange,
  onQualityChange,
}: SettingsDropdownProps) => {
  const [activeMenu, setActiveMenu] = useState<"main" | "speed" | "quality">(
    "main",
  );

  if (!isOpen) return null;

  const currentSpeedLabel =
    speeds.find((s) => s.value === currentSpeed)?.label || "Normal";

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div className="settings-menu absolute bottom-full right-0 mb-2 z-50">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 min-w-48 overflow-hidden">
          {activeMenu === "main" && (
            <div className="py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu("speed");
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-white/10 transition-colors"
              >
                <span className="text-sm">Vitesse</span>
                <div className="flex items-center gap-2 text-white/60">
                  <span className="text-sm">{currentSpeedLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {qualities.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu("quality");
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">Qualité</span>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="text-sm">
                      {currentQuality?.label || "Auto"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>
          )}

          {activeMenu === "speed" && (
            <div className="py-2">
              <div className="px-4 py-2 border-b border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu("main");
                  }}
                  className="text-white/60 hover:text-white text-sm"
                >
                  ← Vitesse de lecture
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {speeds.map((speed) => (
                  <button
                    key={speed.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeedChange(speed.value);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">{speed.label}</span>
                    {currentSpeed === speed.value && (
                      <Check className="w-4 h-4 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMenu === "quality" && (
            <div className="py-2">
              <div className="px-4 py-2 border-b border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu("main");
                  }}
                  className="text-white/60 hover:text-white text-sm"
                >
                  ← Qualité
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {qualities.map((quality) => (
                  <button
                    key={quality.quality}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQualityChange(quality);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm">{quality.label}</span>
                    {currentQuality?.quality === quality.quality && (
                      <Check className="w-4 h-4 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
