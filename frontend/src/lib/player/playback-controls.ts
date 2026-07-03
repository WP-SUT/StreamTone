export type RepeatMode = 'off' | 'one' | 'all';

export class PlaybackControls {
  repeatMode: RepeatMode;
  volume: number;

  constructor(initialVolume = 0.7) {
    this.repeatMode = 'off';
    this.volume = initialVolume;
  }

  toggleRepeat(): RepeatMode {
    const modes: RepeatMode[] = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(this.repeatMode);
    this.repeatMode = modes[(currentIndex + 1) % modes.length];
    return this.repeatMode;
  }

  setRepeat(mode: RepeatMode) {
    this.repeatMode = mode;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    return this.volume;
  }
}
