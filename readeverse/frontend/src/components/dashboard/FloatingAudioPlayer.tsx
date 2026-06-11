'use client';

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from 'lucide-react';

import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { usePathname } from 'next/navigation';


export default function FloatingAudioPlayer() {
  const pathname = usePathname();



  const {
    currentTrack,
    isPlaying,
    progress,
    playbackSpeed,
    togglePlayPause,
    setPlaybackSpeed,
    skipForward,
    skipBackward,
    closePlayer,
  } = useAudioPlayer();

  // Show only on audiobooks page
  if (pathname !== '/dashboard/audiobooks') return null;

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent =
    (progress / currentTrack.duration) * 100;



  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-72 z-50">

      <div className="bg-[#0f0f11]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 md:px-6 shadow-2xl">

        <div className="flex flex-col md:flex-row items-center gap-4">

          {/* Track Info */}
          <div className="flex items-center gap-4 w-full md:w-1/3 min-w-0">

            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentTrack.cover} shadow-md flex-shrink-0`}
            />

            <div className="min-w-0">
              <h4 className="font-semibold text-sm md:text-base truncate text-white">
                {currentTrack.title}
              </h4>

              <p className="text-gray-400 text-xs md:text-sm truncate">
                {currentTrack.author}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex-1 w-full flex flex-col items-center">

            {/* Buttons */}
            <div className="flex items-center gap-5 mb-2">

              <button
                onClick={skipBackward}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlayPause}
                className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={skipForward}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Progress */}
            <div className="w-full flex items-center gap-3 text-xs text-gray-400">

              <span>
                {formatTime(progress)}
              </span>

              <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden">

                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span>
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center justify-end gap-4 w-1/3">

            {/* Speed */}
            <div className="relative group">

              <button className="text-xs text-gray-400 hover:text-white transition-colors">
                {playbackSpeed}x
              </button>

              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-24 bg-[#18181b] border border-white/10 rounded-lg py-1 shadow-xl">

                {[1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors hover:bg-white/10 ${
                      playbackSpeed === speed
                        ? 'text-primary font-medium'
                        : 'text-gray-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>



            {/* Volume */}
            <button className="text-gray-400 hover:text-white transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Close */}
            <button
              onClick={closePlayer}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close audio player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}