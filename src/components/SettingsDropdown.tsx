// src/components/SettingsDropdown.tsx
import { Check, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 1.75, label: "1.75x" },
  { value: 2, label: "2x" },
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveMenu("main");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSpeedLabel =
    speeds.find((s) => s.value === currentSpeed)?.label || "Normal";

  const handleBackdropClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleMenuClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  // Version mobile compacte - plus de modal plein écran !
  if (isMobile) {
    return (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={handleBackdropClick}
          onTouchStart={handleBackdropClick}
        />

        <div className="absolute bottom-full right-0 mb-2 z-50 w-72 max-w-[90vw]">
          <div
            className="bg-gray-900/98 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in"
            onClick={handleMenuClick}
            onTouchStart={handleMenuClick}
          >
            {activeMenu === "main" && (
              <div className="py-2">
                <div className="px-4 py-2 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      Paramètres
                    </span>
                    <button
                      onClick={onClose}
                      className="p-1 rounded-full hover:bg-white/10 text-white/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setActiveMenu("speed")}
                    className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      Vitesse de lecture
                    </span>
                    <div className="flex items-center gap-2 text-white/70">
                      <span className="text-sm">{currentSpeedLabel}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>

                  {qualities.length > 1 && (
                    <button
                      onClick={() => setActiveMenu("quality")}
                      className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm font-medium">Qualité</span>
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">
                          {currentQuality?.label || "Auto"}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeMenu === "speed" && (
              <div className="py-2">
                <div className="px-4 py-2 border-b border-white/10">
                  <button
                    onClick={() => setActiveMenu("main")}
                    className="text-white/70 hover:text-white text-sm font-medium"
                  >
                    ← Vitesse de lecture
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {speeds.map((speed) => (
                    <button
                      key={speed.value}
                      onClick={() => {
                        onSpeedChange(speed.value);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm font-medium">{speed.label}</span>
                      {currentSpeed === speed.value && (
                        <Check className="w-4 h-4 text-blue-400" />
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
                    onClick={() => setActiveMenu("main")}
                    className="text-white/70 hover:text-white text-sm font-medium"
                  >
                    ← Qualité
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {qualities.map((quality) => (
                    <button
                      key={quality.quality}
                      onClick={() => {
                        onQualityChange(quality);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {quality.label}
                      </span>
                      {currentQuality?.quality === quality.quality && (
                        <Check className="w-4 h-4 text-blue-400" />
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
  }

  // Version desktop inchangée
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={handleBackdropClick} />

      <div className="settings-menu absolute bottom-full right-0 mb-3 z-50">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 min-w-52 overflow-hidden">
          {activeMenu === "main" && (
            <div className="py-2">
              <button
                onClick={() => setActiveMenu("speed")}
                className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
              >
                <span className="font-medium">Vitesse</span>
                <div className="flex items-center gap-2 text-white/60">
                  <span className="text-sm">{currentSpeedLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {qualities.length > 1 && (
                <button
                  onClick={() => setActiveMenu("quality")}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
                >
                  <span className="font-medium">Qualité</span>
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
                  onClick={() => setActiveMenu("main")}
                  className="text-white/60 hover:text-white text-sm font-medium"
                >
                  ← Vitesse
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {speeds.map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() => {
                      onSpeedChange(speed.value);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="font-medium">{speed.label}</span>
                    {currentSpeed === speed.value && (
                      <Check className="w-4 h-4 text-blue-500" />
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
                  onClick={() => setActiveMenu("main")}
                  className="text-white/60 hover:text-white text-sm font-medium"
                >
                  ← Qualité
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {qualities.map((quality) => (
                  <button
                    key={quality.quality}
                    onClick={() => {
                      onQualityChange(quality);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="font-medium">{quality.label}</span>
                    {currentQuality?.quality === quality.quality && (
                      <Check className="w-4 h-4 text-blue-500" />
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
