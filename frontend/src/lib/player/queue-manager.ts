import type { Song } from '@/types/models';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export class QueueManager {
  queue: Song[];
  originalQueue: Song[];
  currentIndex: number;
  isShuffle: boolean;

  constructor() {
    this.queue = [];
    this.originalQueue = [];
    this.currentIndex = 0;
    this.isShuffle = false;
  }

  setQueue(songs: Song[], startIndex = 0) {
    this.queue = songs;
    this.originalQueue = songs;
    this.currentIndex = startIndex;
    this.isShuffle = false;
  }

  add(song: Song) {
    this.queue.push(song);
    if (!this.isShuffle) {
      this.originalQueue.push(song);
    }
  }

  remove(index: number): { newQueue: Song[]; newIndex: number; removedCurrent: boolean } {
    const newQueue = this.queue.filter((_, i) => i !== index);
    let newIndex = this.currentIndex;
    let removedCurrent = false;

    if (index < this.currentIndex) {
      newIndex = this.currentIndex - 1;
    } else if (index === this.currentIndex) {
      removedCurrent = true;
      newIndex = Math.min(this.currentIndex, newQueue.length - 1);
    }

    this.queue = newQueue;
    this.currentIndex = Math.max(0, newIndex);

    return { newQueue, newIndex, removedCurrent };
  }

  reorder(startIndex: number, endIndex: number) {
    const newQueue = [...this.queue];
    const [removed] = newQueue.splice(startIndex, 1);
    newQueue.splice(endIndex, 0, removed);

    let newIndex = this.currentIndex;
    if (startIndex === this.currentIndex) {
      newIndex = endIndex;
    } else if (startIndex < this.currentIndex && endIndex >= this.currentIndex) {
      newIndex = this.currentIndex - 1;
    } else if (startIndex > this.currentIndex && endIndex <= this.currentIndex) {
      newIndex = this.currentIndex + 1;
    }

    this.queue = newQueue;
    this.currentIndex = newIndex;

    return { newQueue, newIndex };
  }

  clear() {
    this.queue = [];
    this.originalQueue = [];
    this.currentIndex = 0;
    this.isShuffle = false;
  }

  toggleShuffle(currentSongId?: string) {
    if (!this.isShuffle) {
      // Enable shuffle
      const currentSong = this.queue.find(s => s.id === currentSongId);
      const otherSongs = this.queue.filter(s => s.id !== currentSongId);
      const shuffledOthers = shuffleArray(otherSongs);

      this.originalQueue = [...this.queue];
      this.queue = currentSong ? [currentSong, ...shuffledOthers] : shuffleArray(this.queue);
      this.currentIndex = 0;
      this.isShuffle = true;
    } else {
      // Disable shuffle
      const currentIndex = this.originalQueue.findIndex(s => s.id === currentSongId);
      this.queue = [...this.originalQueue];
      this.currentIndex = Math.max(0, currentIndex);
      this.isShuffle = false;
    }

    return { queue: this.queue, currentIndex: this.currentIndex, isShuffle: this.isShuffle };
  }

  getCurrentSong(): Song | null {
    return this.queue[this.currentIndex] || null;
  }

  getNextIndex(repeatMode: 'off' | 'one' | 'all'): number | null {
    if (repeatMode === 'one') return this.currentIndex;

    const nextIndex = this.currentIndex + 1;

    if (nextIndex < this.queue.length) {
      return nextIndex;
    } else if (repeatMode === 'all' && this.queue.length > 0) {
      return 0;
    }

    return null;
  }

  getPrevIndex(progress: number): number {
    // If more than 3 seconds in, restart current
    if (progress > 3) return this.currentIndex;

    const prevIndex = this.currentIndex - 1;
    return prevIndex >= 0 ? prevIndex : this.currentIndex;
  }

  moveToIndex(index: number) {
    if (index >= 0 && index < this.queue.length) {
      this.currentIndex = index;
      return this.queue[index];
    }
    return null;
  }
}
