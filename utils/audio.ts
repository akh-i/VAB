
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn("SoundEngine initialization failed:", e);
      }
    }
  }

  playIntro() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. POWER ON (Sub Bass)
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(40, now);
    sub.frequency.exponentialRampToValueAtTime(20, now + 3);
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.6, now + 0.1);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + 4);

    // 2. DATA SWEEP (Granular feel)
    const sweep = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(100, now + 1);
    sweep.frequency.exponentialRampToValueAtTime(2000, now + 3);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(50, now + 1);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 3);

    sweepGain.gain.setValueAtTime(0, now + 1);
    sweepGain.gain.linearRampToValueAtTime(0.1, now + 1.5);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

    sweep.connect(filter);
    filter.connect(sweepGain);
    sweepGain.connect(this.ctx.destination);
    sweep.start(now + 1);
    sweep.stop(now + 3.5);

    // 3. V-A-B SIGNATURE CHIME (C Major Arpeggio)
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + 2.5 + i * 0.2);
      g.gain.setValueAtTime(0, now + 2.5 + i * 0.2);
      g.gain.linearRampToValueAtTime(0.2, now + 2.5 + i * 0.2 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 2.5 + i * 0.2 + 0.8);
      osc.connect(g);
      g.connect(this.ctx!.destination);
      osc.start(now + 2.5 + i * 0.2);
      osc.stop(now + 2.5 + i * 0.2 + 1);
    });
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 1046.50].forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.1);
      g.gain.setValueAtTime(0.1, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      osc.connect(g);
      g.connect(this.ctx!.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });
  }
}

export const sounds = new SoundEngine();
