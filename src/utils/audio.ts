/**
 * Synthesizes sound effects using standard Web Audio API. No external network request required!
 * This operates 100% locally and safely in all browsers.
 */

class SoundSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (browser security autoplays)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft swish/rip sound when tearing open a pack
  public playTear() {
    try {
      this.init();
      if (!this.ctx) return;

      const dur = 0.45;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + dur);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + dur);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  // Classic card flip sound effect
  public playFlip() {
    try {
      this.init();
      if (!this.ctx) return;

      const dur = 0.15;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + dur);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch {
      // Audio failover
    }
  }

  // Sparkly high pitch bells when finding a shiny holographic card!
  public playShinyCelebration() {
    try {
      this.init();
      if (!this.ctx) return;

      const baseTime = this.ctx.currentTime;
      // Arpeggio of bells
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, index) => {
        const time = baseTime + index * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.35);
      });
    } catch {
      // Audio failover
    }
  }

  // Retro cash register chaching for trading or redeeming tokens
  public playChaching() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // T1: bell ding
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.frequency.setValueAtTime(1800, now);
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // T2: double high bell ding
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.frequency.setValueAtTime(2400, now + 0.1);
      gain2.gain.setValueAtTime(0.06, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.4);
    } catch {
      // Audio failover
    }
  }

  // Success glue sound (wet slap/paste)
  public playGlue() {
    try {
      this.init();
      if (!this.ctx) return;

      const dur = 0.2;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + dur);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch {
      // Audio failover
    }
  }
}

export const audioSynth = new SoundSynth();
