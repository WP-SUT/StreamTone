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
  
  // Audio element
  audioElement: HTMLAudioElement | null;
  
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
  
  // Audio element initialization
  initAudio: () => void;
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
  audioElement: null,
  
  // Initialize audio element (call this once from a top-level component)
  initAudio: () => {
    if (typeof window === 'undefined') return;
    
    const audio = new Audio();
    audio.volume = get().volume;
    
    // Event listeners
    audio.addEventListener('timeupdate', () => {
      set({ progress: audio.currentTime });
    });
    
    audio.addEventListener('durationchange', () => {
      set({ duration: audio.duration });
    });
    
    audio.addEventListener('ended', () => {
      get().next();
    });
    
    audio.addEventListener('play', () => {
      set({ isPlaying: true });
    });
    
    audio.addEventListener('pause', () => {
      set({ isPlaying: false });
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      set({ isPlaying: false });
    });
    
    set({ audioElement: audio });
  },
  
  // Play a song with optional queue
  playSong: (song, queue) => {
    const { audioElement } = get();
    
    const newQueue = queue || [song];
    const currentIndex = newQueue.findIndex(s => s.id === song.id);
    
    set({
      currentSong: song,
      queue: newQueue,
      originalQueue: newQueue,
      currentIndex,
      progress: 0,
      duration: song.duration,
    });
    
    if (audioElement) {
      audioElement.src = song.audioUrl;
      audioElement.load();
      audioElement.play().catch(error => {
        console.error('Playback failed:', error);
        set({ isPlaying: false });
      });
    }
  },
  
  play: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.play().catch(error => {
        console.error('Playback failed:', error);
        set({ isPlaying: false });
      });
    }
  },
  
  pause: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
    }
  },
  
  togglePlayPause: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },
  
  next: () => {
    const { queue, currentIndex, repeatMode } = get();
    
    if (repeatMode === 'one') {
      // Restart current track
      const { audioElement } = get();
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
      }
      return;
    }
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      get().playSong(nextSong, queue);
    } else if (repeatMode === 'all' && queue.length > 0) {
      // Loop back to start
      const firstSong = queue[0];
      get().playSong(firstSong, queue);
    } else {
      // End of queue
      get().pause();
    }
  },
  
  prev: () => {
    const { queue, currentIndex, progress, audioElement } = get();
    
    // If more than 3 seconds into song, restart it
    if (progress > 3) {
      if (audioElement) {
        audioElement.currentTime = 0;
      }
      return;
    }
    
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      get().playSong(prevSong, queue);
    } else {
      // Already at start - restart current song
      if (audioElement) {
        audioElement.currentTime = 0;
      }
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
      // Play next song if removing current
      const nextSong = newQueue[newIndex];
      if (nextSong) {
        get().playSong(nextSong, newQueue);
        return;
      }
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
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    
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
    const { duration, audioElement } = get();
    const newTime = Math.max(0, Math.min(duration, time));
    
    if (audioElement) {
      audioElement.currentTime = newTime;
    }
    
    set({ progress: newTime });
  },
  
  setVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    const { audioElement } = get();
    
    if (audioElement) {
      audioElement.volume = clamped;
    }
    
    set({ volume: clamped });
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
