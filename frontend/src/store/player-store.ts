import { create } from 'zustand';
import type { Song } from '@/types/models';
import { AudioManager } from '@/lib/player/audio-manager';
import { QueueManager } from '@/lib/player/queue-manager';
import { PlaybackControls, type RepeatMode } from '@/lib/player/playback-controls';

interface PlayerState {
  // Current playback
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;

  // Playback state
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;

  // Playback modes
  repeatMode: RepeatMode;
  isShuffle: boolean;

  // Managers (internal)
  audioManager: AudioManager | null;
  queueManager: QueueManager;
  playbackControls: PlaybackControls;

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

  // Initialization
  initAudio: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  const queueManager = new QueueManager();
  const playbackControls = new PlaybackControls(0.7);

  return {
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
    audioManager: null,
    queueManager,
    playbackControls,

    initAudio: () => {
      if (typeof window === 'undefined') return;

      const audioManager = new AudioManager(playbackControls.volume, {
        onTimeUpdate: (time) => set({ progress: time }),
        onDurationChange: (duration) => set({ duration }),
        onEnded: () => get().next(),
        onPlayStateChange: (isPlaying) => set({ isPlaying }),
        onError: (e) => {
          console.error('Audio playback error:', e);
          set({ isPlaying: false });
        },
      });

      set({ audioManager });
    },

    playSong: (song, queue) => {
      const { audioManager, queueManager } = get();
      const newQueue = queue || [song];
      const startIndex = newQueue.findIndex(s => s.id === song.id);

      queueManager.setQueue(newQueue, startIndex);

      set({
        currentSong: song,
        queue: queueManager.queue,
        currentIndex: queueManager.currentIndex,
        progress: 0,
        duration: song.duration,
      });

      if (audioManager) {
        audioManager.load(song.audioUrl);
        audioManager.play().catch(() => set({ isPlaying: false }));
      }
    },

    play: () => {
      const { audioManager } = get();
      audioManager?.play().catch(() => set({ isPlaying: false }));
    },

    pause: () => {
      get().audioManager?.pause();
    },

    togglePlayPause: () => {
      const { isPlaying } = get();
      isPlaying ? get().pause() : get().play();
    },

    next: () => {
      const { queueManager, playbackControls } = get();
      const nextIndex = queueManager.getNextIndex(playbackControls.repeatMode);

      if (nextIndex === queueManager.currentIndex && playbackControls.repeatMode === 'one') {
        // Restart current track
        const { audioManager } = get();
        if (audioManager) {
          audioManager.seek(0);
          audioManager.play();
        }
        return;
      }

      if (nextIndex !== null) {
        const nextSong = queueManager.moveToIndex(nextIndex);
        if (nextSong) {
          get().playSong(nextSong, queueManager.queue);
        }
      } else {
        get().pause();
      }
    },

    prev: () => {
      const { queueManager, progress, audioManager } = get();
      const prevIndex = queueManager.getPrevIndex(progress);

      if (prevIndex === queueManager.currentIndex) {
        audioManager?.seek(0);
        return;
      }

      const prevSong = queueManager.moveToIndex(prevIndex);
      if (prevSong) {
        get().playSong(prevSong, queueManager.queue);
      }
    },

    addToQueue: (song) => {
      const { queueManager } = get();
      queueManager.add(song);
      set({ queue: [...queueManager.queue] });
    },

    removeFromQueue: (index) => {
      const { queueManager } = get();
      const { newQueue, newIndex, removedCurrent } = queueManager.remove(index);

      if (removedCurrent && newQueue[newIndex]) {
        get().playSong(newQueue[newIndex], newQueue);
      } else {
        set({
          queue: newQueue,
          currentIndex: newIndex,
          currentSong: newQueue[newIndex] || null,
          duration: newQueue[newIndex]?.duration || 0,
        });
      }
    },

    clearQueue: () => {
      const { audioManager, queueManager } = get();
      audioManager?.destroy();
      queueManager.clear();

      set({
        queue: [],
        currentIndex: 0,
        currentSong: null,
        isPlaying: false,
        progress: 0,
        duration: 0,
      });
    },

    reorderQueue: (startIndex, endIndex) => {
      const { queueManager } = get();
      const { newQueue, newIndex } = queueManager.reorder(startIndex, endIndex);
      set({ queue: newQueue, currentIndex: newIndex });
    },

    seek: (time) => {
      const { audioManager, duration } = get();
      const newTime = Math.max(0, Math.min(duration, time));
      audioManager?.seek(newTime);
      set({ progress: newTime });
    },

    setVolume: (volume) => {
      const { audioManager, playbackControls } = get();
      const newVolume = playbackControls.setVolume(volume);
      audioManager?.setVolume(newVolume);
      set({ volume: newVolume });
    },

    setProgress: (progress) => set({ progress }),
    setDuration: (duration) => set({ duration }),

    toggleRepeat: () => {
      const { playbackControls } = get();
      const newMode = playbackControls.toggleRepeat();
      set({ repeatMode: newMode });
    },

    setRepeatMode: (mode) => {
      const { playbackControls } = get();
      playbackControls.setRepeat(mode);
      set({ repeatMode: mode });
    },

    toggleShuffle: () => {
      const { queueManager, currentSong } = get();
      const result = queueManager.toggleShuffle(currentSong?.id);
      set({
        queue: result.queue,
        currentIndex: result.currentIndex,
        isShuffle: result.isShuffle,
      });
    },
  };
});

export type { RepeatMode };
