// src/components/LoadingSpinner.tsx
import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
    <div className="p-4 bg-black/60 backdrop-blur-sm rounded-full">
      <Loader2 className="w-8 h-8 text-white animate-spin" />
    </div>
  </div>
);
