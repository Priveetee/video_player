// src/hooks/useTouchGestures.ts
import { useRef, useCallback } from "react";
import type { TouchState } from "../types";

export const useTouchGestures = (
  onSeek: (time: number) => void,
  onVolumeChange: (volume: number) => void,
  onTogglePlay: () => void,
  onSkip: (seconds: number) => void,
  currentTime: number,
  duration: number,
  volume: number,
) => {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isDragging: false,
    isVertical: false,
    action: null,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: currentTime,
        isDragging: false,
        isVertical: false,
        action: null,
      };
    },
    [currentTime],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const { startX, startY } = touchState.current;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (!touchState.current.isDragging) {
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 20) {
          touchState.current.isDragging = true;
          touchState.current.isVertical = Math.abs(deltaY) > Math.abs(deltaX);
          touchState.current.action = touchState.current.isVertical
            ? "volume"
            : "seek";
          e.preventDefault();
        }
      }

      if (touchState.current.isDragging) {
        e.preventDefault();

        if (touchState.current.action === "seek") {
          const progress = deltaX / window.innerWidth;
          const newTime = touchState.current.startTime + progress * duration;
          onSeek(Math.max(0, Math.min(duration, newTime)));
        } else if (touchState.current.action === "volume") {
          const volumeChange = -deltaY / 300;
          const newVolume = Math.max(0, Math.min(1, volume + volumeChange));
          onVolumeChange(newVolume);
        }
      }
    },
    [duration, volume, onSeek, onVolumeChange],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      if (!touchState.current.isDragging) {
        const touch = e.changedTouches[0];
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const width = rect.width;

        if (x < width * 0.25) {
          onSkip(-10);
        } else if (x > width * 0.75) {
          onSkip(10);
        } else {
          onTogglePlay();
        }
      }

      touchState.current.isDragging = false;
    },
    [onTogglePlay, onSkip],
  );

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
