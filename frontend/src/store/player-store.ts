// src/store/playerStore.ts
import { create } from 'zustand';
import type { Song } from '@/types/models';

export type RepeatMode = 'off' | 'one' | 'all';

interface PlayerState {
  // Current playback
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  
  // Playback state
  isPlaying: boolean;
  volume: number; // 0-1
  progress: number; // current time in seconds
  duration: number; // total duration in seconds
  
  // Playback modes
  repeatMode: RepeatMode;
  isShuffle: boolean;
  
  // Original queue (for shuffle)
  originalQueue: Song[];
  
  // Actions
  playSong: (song: Song, queue?: Song[]) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  prev: () => void;
  
  // Queue management
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  
  // Playback controls
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  
  // Modes
  toggleRepeat: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  currentSong: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  repeatMode: 'off',
  isShuffle: false,
  originalQueue: [],
  
  // Play a song with optional queue
  playSong: (song, queue) => {
    const newQueue = queue || [song];
    set({
      currentSong: song,
      queue: newQueue,
      originalQueue: newQueue,
      currentIndex: newQueue.findIndex(s => s.id === song.id),
      isPlaying: true,
      progress: 0,
      duration: song.duration,
    });
  },
  
  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  togglePlayPause: () => set(state => ({ isPlaying: !state.isPlaying })),
  
  next: () => {
    const { queue, currentIndex, repeatMode } = get();
    
    if (repeatMode === 'one') {
      // Restart current track
      set({ progress: 0, isPlaying: true });
      return;
    }
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      set({
        currentIndex: nextIndex,
        currentSong: nextSong,
        progress: 0,
        duration: nextSong.duration,
        isPlaying: true,
      });
    } else if (repeatMode === 'all' && queue.length > 0) {
      // Loop back to start
      const firstSong = queue[0];
      set({
        currentIndex: 0,
        currentSong: firstSong,
        progress: 0,
        duration: firstSong.duration,
        isPlaying: true,
      });
    } else {
      // End of queue
      set({ isPlaying: false });
    }
  },
  
  prev: () => {
    const { queue, currentIndex, progress } = get();
    
    // If more than 3 seconds into song, restart it
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }
    
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({
        currentIndex: prevIndex,
        currentSong: prevSong,
        progress: 0,
        duration: prevSong.duration,
        isPlaying: true,
      });
    } else {
      // Already at start
      set({ progress: 0 });
    }
  },
  
  addToQueue: (song) => {
    set(state => ({
      queue: [...state.queue, song],
      originalQueue: state.isShuffle ? state.originalQueue : [...state.queue, song],
    }));
  },
  
  removeFromQueue: (index) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);
    
    let newIndex = currentIndex;
    if (index < currentIndex) {
      newIndex = currentIndex - 1;
    } else if (index === currentIndex) {
      newIndex = Math.min(currentIndex, newQueue.length - 1);
    }
    
    const newCurrentSong = newQueue[newIndex] || null;
    
    set({
      queue: newQueue,
      currentIndex: Math.max(0, newIndex),
      currentSong: newCurrentSong,
      duration: newCurrentSong?.duration || 0,
    });
  },
  
  clearQueue: () => {
    set({
      queue: [],
      originalQueue: [],
      currentIndex: 0,
      currentSong: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
    });
  },
  
  reorderQueue: (startIndex, endIndex) => {
    const { queue, currentIndex } = get();
    const newQueue = [...queue];
    const [removed] = newQueue.splice(startIndex, 1);
    newQueue.splice(endIndex, 0, removed);
    
    // Update current index if needed
    let newIndex = currentIndex;
    if (startIndex === currentIndex) {
      newIndex = endIndex;
    } else if (startIndex < currentIndex && endIndex >= currentIndex) {
      newIndex = currentIndex - 1;
    } else if (startIndex > currentIndex && endIndex <= currentIndex) {
      newIndex = currentIndex + 1;
    }
    
    set({
      queue: newQueue,
      currentIndex: newIndex,
    });
  },
  
  seek: (time) => {
    const { duration } = get();
    set({ progress: Math.max(0, Math.min(duration, time)) });
  },
  
  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },
  
  setProgress: (progress) => {
    set({ progress });
  },
  
  setDuration: (duration) => {
    set({ duration });
  },
  
  toggleRepeat: () => {
    set(state => {
      const modes: RepeatMode[] = ['off', 'one', 'all'];
      const currentModeIndex = modes.indexOf(state.repeatMode);
      const nextMode = modes[(currentModeIndex + 1) % modes.length];
      return { repeatMode: nextMode };
    });
  },
  
  setRepeatMode: (mode) => {
    set({ repeatMode: mode });
  },
  
  toggleShuffle: () => {
    const { isShuffle, queue, originalQueue, currentSong } = get();
    
    if (!isShuffle) {
      // Enable shuffle
      const currentSongInQueue = queue.find(s => s.id === currentSong?.id);
      const otherSongs = queue.filter(s => s.id !== currentSong?.id);
      const shuffledOthers = shuffleArray(otherSongs);
      
      const newQueue = currentSongInQueue 
        ? [currentSongInQueue, ...shuffledOthers]
        : shuffleArray(queue);
      
      set({
        isShuffle: true,
        originalQueue: queue,
        queue: newQueue,
        currentIndex: 0,
      });
    } else {
      // Disable shuffle - restore original queue
      const currentIndex = originalQueue.findIndex(s => s.id === currentSong?.id);
      
      set({
        isShuffle: false,
        queue: originalQueue,
        currentIndex: Math.max(0, currentIndex),
      });
    }
  },
}));
