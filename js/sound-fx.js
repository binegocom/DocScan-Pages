/**
 * DocScan Offline - Duolingo-Style Synthesized Sound Effects Engine
 * Pure Web Audio API: Zero Latency, Zero Dependencies, Zero External MP3s
 * Features:
 * - Duolingo Iconic Correct Chime (Ascending Bell Chords)
 * - Duolingo VIP Chest / Level-up Dopamine Fanfare
 * - Cute Bubble Pop Button Click
 * - Futuristic OCR Laser Scanner Whoosh
 * - Soft Tactile Tab Switch
 * - Gentle Reset / Oops Thud
 */

class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initAudioContext();
    this.loadPreference();
  }

  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  loadPreference() {
    const saved = localStorage.getItem('docscan_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('docscan_sound_enabled', this.enabled);
    if (this.enabled) {
      this.playPop();
    }
    return this.enabled;
  }

  // 1. Cute Duolingo Bubble Pop (Buttons & Chips)
  playPop() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;

    // Pitch envelope: quick drop from 900Hz to 280Hz
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

    // Gain envelope: snappy bubble pop
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 2. Soft Tactile Click (Tab switch, FAQ accordion)
  playClick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // 3. Duolingo Correct Answer Chime (Ascending Joyful Bells: C5, E5, G5, C6)
  playSuccessChime() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Joyful major notes (Hz): C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.09;
      
      // Main chime tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      // Bell chime harmonic overtone
      const harmOsc = this.ctx.createOscillator();
      const harmGain = this.ctx.createGain();
      harmOsc.type = 'triangle';
      harmOsc.frequency.setValueAtTime(freq * 2, noteTime);

      const duration = idx === notes.length - 1 ? 0.6 : 0.25;

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      harmGain.gain.setValueAtTime(0.12, noteTime);
      harmGain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration * 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      harmOsc.connect(harmGain);
      harmGain.connect(this.ctx.destination);

      osc.start(noteTime);
      harmOsc.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
      harmOsc.stop(noteTime + duration + 0.05);
    });
  }

  // 4. Duolingo Chest / Streak Reward Fanfare (Dopamine Sparkling Arpeggio)
  playChestReward() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Rich sparkling arpeggio: C5, E5, G5, B5, D6, G6
    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
    const now = this.ctx.currentTime;

    arpeggio.forEach((freq, i) => {
      const t = now + i * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const dur = i === arpeggio.length - 1 ? 0.8 : 0.35;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + dur + 0.05);
    });

    // Shimmering sparkle trail
    setTimeout(() => {
      if (!this.ctx || !this.enabled) return;
      const t2 = this.ctx.currentTime;
      [1318.51, 1567.98, 2093.00].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t2 + idx * 0.05);
        gain.gain.setValueAtTime(0.15, t2 + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t2 + idx * 0.05 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t2 + idx * 0.05);
        osc.stop(t2 + idx * 0.05 + 0.55);
      });
    }, 450);
  }

  // 5. Futuristic Scanning Laser Sweep Sound
  playLaserSweep() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    const now = this.ctx.currentTime;

    // Laser pitch swoop
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(600, now + 1.2);

    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + 0.6);
    filter.frequency.exponentialRampToValueAtTime(500, now + 1.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.35);
  }

  // 6. Reset / Gentle Thud ("Oops" low bounce)
  playResetThud() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.14);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }
}

// Global instance
window.soundFX = new SoundFXEngine();

// Confetti Particle Celebration Effect
window.triggerConfetti = function(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  const container = document.createElement('div');
  container.className = 'confetti-burst-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const colors = ['#10B981', '#34D399', '#F59E0B', '#FBBF24', '#60A5FA', '#A78BFA', '#F43F5E'];
  const count = 45;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 220 + 80;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 60; // arch upward

    p.style.position = 'absolute';
    p.style.left = originX + 'px';
    p.style.top = originY + 'px';
    p.style.width = size + 'px';
    p.style.height = (size * (Math.random() > 0.5 ? 1 : 1.6)) + 'px';
    p.style.backgroundColor = color;
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.transition = 'all 0.9s cubic-bezier(0.12, 0.8, 0.32, 1)';
    p.style.transform = `translate(0, 0) rotate(0deg) scale(0)`;
    p.style.opacity = '1';

    container.appendChild(p);

    setTimeout(() => {
      p.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 720 - 360}deg) scale(1)`;
      p.style.opacity = '0';
    }, 15);
  }

  setTimeout(() => {
    container.remove();
  }, 1000);
};
