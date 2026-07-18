class SoundSystem {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private playNote(freq: number, type: OscillatorType, startTime: number, duration: number, startGain: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(startGain, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn("Error playing synthesized note:", e);
    }
  }

  /**
   * Chapter Completed sound: Uplifting rising arpeggio (C5 -> E5 -> G5 -> C6)
   */
  playChapterComplete() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const time = now + index * 0.12;
        this.playNote(freq, 'triangle', time, 0.45, 0.12);
      });
    } catch (err) {
      console.warn("Failed to play chapter completion chime:", err);
    }
  }

  /**
   * Streak / Check-in sound: Warm, resonant Fmaj7-inspired chord sweep
   */
  playStreakBonus() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [349.23, 440.00, 523.25, 659.25]; // F4, A4, C5, E5
      freqs.forEach((freq, index) => {
        const time = now + index * 0.08;
        this.playNote(freq, 'sine', time, 0.85, 0.15);
      });
    } catch (err) {
      console.warn("Failed to play streak bonus chime:", err);
    }
  }

  /**
   * Achievement unlocked / Purchased: Sparkly, triumphant rising chime sequence
   */
  playAchievementUnlocked() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 783.99, 1046.50, 1318.51]; // C5, G5, C6, E6
      notes.forEach((freq, index) => {
        const time = now + index * 0.07;
        this.playNote(freq, 'triangle', time, 0.65, 0.15);
      });
    } catch (err) {
      console.warn("Failed to play achievement unlocked chime:", err);
    }
  }
}

export const sound = new SoundSystem();
