'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from 'react';

export interface AudiobookTrack {
  id: string;
  title: string;
  author: string;
  cover: string;

  // AUDIO FILE URL
  audioUrl: string;

  duration: number;
}

interface AudioPlayerContextType {
  currentTrack: AudiobookTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackSpeed: number;

  playTrack: (track: AudiobookTrack) => void;

  togglePlayPause: () => void;

  setProgress: (progress: number) => void;

  setPlaybackSpeed: (speed: number) => void;

  skipForward: () => void;

  skipBackward: () => void;

  closePlayer: () => void;
}

const AudioPlayerContext =
  createContext<AudioPlayerContextType | undefined>(
    undefined
  );

export function AudioPlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentTrack, setCurrentTrack] =
    useState<AudiobookTrack | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [progress, setProgressState] = useState(0);

  const [duration, setDuration] = useState(0);

  const [playbackSpeed, setPlaybackSpeedState] =
    useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // CREATE AUDIO ELEMENT
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const updateProgress = () => {
      setProgressState(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener(
      'timeupdate',
      updateProgress
    );

    audio.addEventListener(
      'loadedmetadata',
      updateDuration
    );

    audio.addEventListener(
      'ended',
      handleEnded
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        'timeupdate',
        updateProgress
      );

      audio.removeEventListener(
        'loadedmetadata',
        updateDuration
      );

      audio.removeEventListener(
        'ended',
        handleEnded
      );
    };
  }, []);

  // PLAY TRACK
  const playTrack = async (
    track: AudiobookTrack
  ) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // SAME TRACK TOGGLE
    if (
      currentTrack?.id === track.id
    ) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }

      return;
    }

    // NEW TRACK
    setCurrentTrack(track);

    audio.src = track.audioUrl;

    audio.playbackRate = playbackSpeed;

    try {
      await audio.play();

      setIsPlaying(true);
    } catch (error) {
      console.error(
        'Audio playback failed:',
        error
      );
    }
  };

  // PLAY / PAUSE
  const togglePlayPause = async () => {
    if (!audioRef.current || !currentTrack)
      return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();

      setIsPlaying(false);
    } else {
      try {
        await audio.play();

        setIsPlaying(true);
      } catch (error) {
        console.error(
          'Playback failed:',
          error
        );
      }
    }
  };

  // SEEK
  const setProgress = (
    newProgress: number
  ) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime =
      newProgress;

    setProgressState(newProgress);
  };

  // PLAYBACK SPEED
  const setPlaybackSpeed = (
    speed: number
  ) => {
    setPlaybackSpeedState(speed);

    if (audioRef.current) {
      audioRef.current.playbackRate =
        speed;
    }
  };

  // SKIP FORWARD
  const skipForward = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    audio.currentTime = Math.min(
      audio.currentTime + 15,
      audio.duration
    );
  };

  // SKIP BACKWARD
  const skipBackward = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    audio.currentTime = Math.max(
      audio.currentTime - 15,
      0
    );
  };

  // CLOSE PLAYER
  const closePlayer = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    setCurrentTrack(null);

    setIsPlaying(false);

    setProgressState(0);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        playbackSpeed,

        playTrack,

        togglePlayPause,

        setProgress,

        setPlaybackSpeed,

        skipForward,

        skipBackward,

        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(
    AudioPlayerContext
  );

  if (context === undefined) {
    throw new Error(
      'useAudioPlayer must be used within an AudioPlayerProvider'
    );
  }

  return context;
}