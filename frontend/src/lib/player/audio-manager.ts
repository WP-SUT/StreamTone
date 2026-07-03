export class AudioManager {
  private audio: HTMLAudioElement;
  private onTimeUpdate: (time: number) => void;
  private onDurationChange: (duration: number) => void;
  private onEnded: () => void;
  private onPlayStateChange: (isPlaying: boolean) => void;
  private onError: (error: Event) => void;

  constructor(
    volume: number,
    callbacks: {
      onTimeUpdate: (time: number) => void;
      onDurationChange: (duration: number) => void;
      onEnded: () => void;
      onPlayStateChange: (isPlaying: boolean) => void;
      onError: (error: Event) => void;
    }
  ) {
    this.audio = new Audio();
    this.audio.volume = volume;
    this.onTimeUpdate = callbacks.onTimeUpdate;
    this.onDurationChange = callbacks.onDurationChange;
    this.onEnded = callbacks.onEnded;
    this.onPlayStateChange = callbacks.onPlayStateChange;
    this.onError = callbacks.onError;

    this.attachListeners();
  }

  private attachListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdate(this.audio.currentTime);
    });

    this.audio.addEventListener('durationchange', () => {
      this.onDurationChange(this.audio.duration);
    });

    this.audio.addEventListener('ended', this.onEnded);

    this.audio.addEventListener('play', () => {
      this.onPlayStateChange(true);
    });

    this.audio.addEventListener('pause', () => {
      this.onPlayStateChange(false);
    });

    this.audio.addEventListener('error', this.onError);
  }

  load(src: string) {
    this.audio.src = src;
    this.audio.load();
  }

  async play() {
    try {
      await this.audio.play();
    } catch (error) {
      console.error('Playback failed:', error);
      throw error;
    }
  }

  pause() {
    this.audio.pause();
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  destroy() {
    this.audio.pause();
    this.audio.src = '';
  }

  getElement() {
    return this.audio;
  }
}
