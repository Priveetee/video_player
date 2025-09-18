// src/App.tsx
import { VideoPlayer } from "./components/VideoPlayer";

function App() {
  const sampleVideo =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const multiQualityVideo = [
    { label: "1080p", url: sampleVideo, quality: 1080 },
    { label: "720p", url: sampleVideo, quality: 720 },
    { label: "480p", url: sampleVideo, quality: 480 },
    { label: "360p", url: sampleVideo, quality: 360 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-white text-3xl font-bold text-center">
          Modern Video Player
        </h1>

        <VideoPlayer
          src={multiQualityVideo}
          title="Big Buck Bunny - Demo Video"
          className="aspect-video max-w-full"
        />

        <div className="text-center text-gray-400">
          <p>
            Tap center to play • Swipe left/right to seek • Swipe up/down for
            volume
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
