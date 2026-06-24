// =====================================================================
// AUDIO ENGINE — HTML audio (music) + Web Audio synthesis (SFX)
// =====================================================================
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxGain = null;
    this.muted = false;
    this.music = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.muted ? 0 : 0.45;
    this.sfxGain.connect(this.ctx.destination);
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.sfxGain) this.sfxGain.gain.value = muted ? 0 : 0.45;
    if (this.music) this.music.muted = muted;
  }

  // ----- MUSIC -----
  // Loops the supplied track via an HTML <audio> element.
  async startMusic() {
    this.init();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (!this.music) {
      this.music = new Audio('audio/maple-dyalla.mp3');
      this.music.loop = true;
      this.music.volume = 0.6;
      this.music.muted = this.muted;
    }
    // Restart cleanly if it was previously stopped mid-track.
    this.music.currentTime = 0;
    try {
      await this.music.play();
    } catch (err) {
      // Autoplay can be blocked until a user gesture; ignore and let the
      // first flip/click re-trigger the context.
    }
  }

  stopMusic() {
    if (!this.music) return;
    this.music.pause();
    this.music.currentTime = 0;
  }

  // ----- SFX (Web Audio synthesis) -----
  // Soft click on flip
  playFlip() {
    this.init();
    if (this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Bell chime on match
  playChime() {
    this.init();
    if (this.muted) return;
    const now = this.ctx.currentTime;
    const fundamental = 880;
    const harmonics = [
      { mult: 1, gain: 0.4, decay: 1.3 },
      { mult: 2, gain: 0.22, decay: 0.9 },
      { mult: 3, gain: 0.13, decay: 0.6 },
      { mult: 4.2, gain: 0.08, decay: 0.4 }
    ];
    harmonics.forEach(h => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = fundamental * h.mult;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(h.gain, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + h.decay);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + h.decay + 0.05);
    });
  }

  // Descending buzz on miss
  playMiss() {
    this.init();
    if (this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.45);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(filter).connect(gain).connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  // Ascending arpeggio for streaks
  playStreak(level) {
    this.init();
    if (this.muted) return;
    const now = this.ctx.currentTime;
    const baseNotes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1396.91];
    const noteCount = Math.min(level + 2, 6);
    for (let i = 0; i < noteCount; i++) {
      const startTime = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = baseNotes[i];
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    }
    // Sparkle on top after arpeggio
    setTimeout(() => {
      if (!this.ctx || this.muted) return;
      const t = this.ctx.currentTime;
      [1567.98, 2093.00].forEach(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        osc.connect(gain).connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.75);
      });
    }, noteCount * 80);
  }

  // Victory fanfare
  playWin() {
    this.init();
    if (this.muted) return;
    const now = this.ctx.currentTime;
    const melody = [
      [523.25, 0, 0.3], [659.25, 0.15, 0.3], [783.99, 0.3, 0.3],
      [1046.50, 0.45, 0.45], [783.99, 0.78, 0.2], [1046.50, 0.93, 0.2],
      [1318.51, 1.08, 0.65], [1046.50, 1.75, 0.2], [1318.51, 1.9, 0.2],
      [1567.98, 2.05, 0.9]
    ];
    melody.forEach(([freq, offset, duration]) => {
      const startTime = now + offset;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain).connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);

      // Octave harmonic
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2;
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0, startTime);
      gain2.gain.linearRampToValueAtTime(0.09, startTime + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.7);
      osc2.connect(gain2).connect(this.sfxGain);
      osc2.start(startTime);
      osc2.stop(startTime + duration);
    });
  }
}
