import { Check } from "lucide-react";
import type { VideoQuality } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpeed: number;
  currentQuality: VideoQuality | null;
  qualities: VideoQuality[];
  onSpeedChange: (speed: number) => void;
  onQualityChange: (quality: VideoQuality) => void;
}

const speeds = [
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 1.75, label: "1.75x" },
  { value: 2, label: "2x" },
];

export const SettingsModal = ({
  isOpen,
  onClose,
  currentSpeed,
  currentQuality,
  qualities,
  onSpeedChange,
  onQualityChange,
}: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white text-lg font-semibold mb-6 text-center">
          Paramètres
        </h3>

        {/* Speed Section */}
        <div className="mb-6">
          <h4 className="text-white/80 text-sm font-medium mb-3">
            Vitesse de lecture
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {speeds.map((speed) => (
              <button
                key={speed.value}
                onClick={() => {
                  onSpeedChange(speed.value);
                  onClose();
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentSpeed === speed.value
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Section */}
        {qualities.length > 1 && (
          <div>
            <h4 className="text-white/80 text-sm font-medium mb-3">Qualité</h4>
            <div className="space-y-1">
              {qualities.map((quality) => (
                <button
                  key={quality.quality}
                  onClick={() => {
                    onQualityChange(quality);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    currentQuality?.quality === quality.quality
                      ? "bg-red-600 text-white"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span className="font-medium">{quality.label}</span>
                  {currentQuality?.quality === quality.quality && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
