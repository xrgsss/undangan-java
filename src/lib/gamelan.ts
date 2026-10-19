/**
 * ============================================================================
 *  GAMELAN ENGINE  ·  Web Audio API
 * ============================================================================
 *  Instrumen gamelan Jawa disintesis langsung di browser sehingga:
 *    ✔ Tidak ada file audio berhak cipta yang dibundel.
 *    ✔ Tidak ada request jaringan → tetap berbunyi walau offline.
 *    ✔ Tamu bebas memakai lagu miliknya sendiri (set `music.src`).
 *
 *  Tuning: pendekatan Slendro/Pelog dengan rasio inharmonik khas bilah
 *  perunggu gamelan (FM synthesis ratio ~3.5) + gong rendah berdesir.
 * ============================================================================
 */

/** Frekuensi dasar (Hz) untuk nada 1 (barang) — kira-kira G3. */
const BASE = 196.0;

/** Slendro: 5 nada nyaris berjarak sama dalam satu oktaf. */
const SLENDRO = [0, 1, 2, 3, 4].map((i) => BASE * Math.pow(2, i / 5));

/** Pelog: 7 nada dengan jarak tidak sama (disederhanakan, cents). */
const PELOG_CENTS = [0, 120, 270, 540, 670, 790, 1000];
const PELOG = PELOG_CENTS.map((c) => BASE * Math.pow(2, c / 1200));

/** Naikkan/ turunkan nada berdasarkan indeks skala. */
function scaleNote(scale: number[], index: number): number {
  const len = scale.length;
  const octave = Math.floor(index / len);
  const i = ((index % len) + len) % len;
  return scale[i] * Math.pow(2, octave);
}

interface GamelanOptions {
  /** Volume awal 0..1 */
  volume?: number;
}

export class GamelanEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private reverb: ConvolverNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private _volume: number;
  private _playing = false;
  private freqData: Uint8Array | null = null;

  constructor(opts: GamelanOptions = {}) {
    this._volume = opts.volume ?? 0.5;
  }

  get isPlaying() {
    return this._playing;
  }

  get volume() {
    return this._volume;
  }

  /** Harus dipanggil dari dalam gesture pengguna (klik tombol buka undangan). */
  private ensureContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      const Ctor: typeof AudioContext =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor();

      const master = ctx.createGain();
      master.gain.value = 0;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;

      // Reverb dari impulse response yang digenerate (ruang pendopo).
      const reverb = ctx.createConvolver();
      reverb.buffer = this.buildImpulse(ctx, 2.6, 2.2);
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.34;

      master.connect(analyser);
      analyser.connect(ctx.destination);
      master.connect(reverbGain);
      reverbGain.connect(reverb);
      reverb.connect(ctx.destination);

      this.ctx = ctx;
      this.master = master;
      this.analyser = analyser;
      this.reverb = reverb;
      this.freqData = new Uint8Array(analyser.frequencyBinCount);
      return ctx;
    } catch {
      return null;
    }
  }

  /** Bangun impulse response sintetis untuk efek ruang. */
  private buildImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
    const rate = ctx.sampleRate;
    const length = Math.max(1, Math.floor(rate * seconds));
    const buffer = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch += 1) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  /** Bilah perunggu: FM dengan rasio inharmonik + transient logam. */
  private strike(freq: number, time: number, gain: number, decay: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = freq;

    // Modulator inharmonik → menghasilkan spektrum logam khas gamelan.
    const mod = ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.value = freq * 3.47;
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(freq * 1.9, time);
    modGain.gain.exponentialRampToValueAtTime(freq * 0.05, time + decay * 0.5);
    mod.connect(modGain);
    modGain.connect(carrier.frequency);

    // Partial kedua (2.76x) untuk kesan bilah tebal.
    const partial = ctx.createOscillator();
    partial.type = 'triangle';
    partial.frequency.value = freq * 2.76;
    const partialGain = ctx.createGain();
    partialGain.gain.setValueAtTime(gain * 0.22, time);
    partialGain.gain.exponentialRampToValueAtTime(0.0001, time + decay * 0.6);
    partial.connect(partialGain);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(gain, time + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, time + decay);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = Math.min(9000, freq * 9);

    carrier.connect(env);
    partialGain.connect(env);
    env.connect(lowpass);
    lowpass.connect(master);

    carrier.start(time);
    mod.start(time);
    partial.start(time);
    const stop = time + decay + 0.1;
    carrier.stop(stop);
    mod.stop(stop);
    partial.stop(stop);
  }

  /** Gong ageng: rendah, bergelombang, panjang. */
  private gong(time: number, gain = 0.5) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const freq = 62;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.6, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.4);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2.02;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(gain, time + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 6.5);

    // Desir logam.
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(ctx, 1.4);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 0.8;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(gain * 0.16, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    osc.connect(env);
    osc2.connect(env);
    noiseGain.connect(master);
    env.connect(master);

    osc.start(time);
    osc2.start(time);
    noise.start(time);
    const stop = time + 6.6;
    osc.stop(stop);
    osc2.stop(stop);
    noise.stop(stop);
  }

  private noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** Satu langkah sequencer. Pola sederhana bergaya Lancaran / Ketawang. */
  private playStep(step: number, time: number) {
    const s = step % 16;
    const beat = 0.62; // detik per ketukan

    // Gong ageng tiap 16 ketukan (siklus gongan), kempul di tengah.
    if (s === 0) this.gong(time, 0.5);
    if (s === 8) {
      this.strike(scaleNote(SLENDRO, -3), time, 0.32, 3.4); // kempul
    }
    if (s === 4 || s === 12) {
      this.strike(scaleNote(SLENDRO, 1) * 0.5, time, 0.22, 2.6); // kenong
    }

    // Balungan saron: pola melodi Slendro.
    const balungan: Record<number, number> = {
      0: 0,
      2: 1,
      3: 3,
      5: 2,
      6: 4,
      8: 3,
      10: 2,
      11: 0,
      13: 1,
      14: 2,
    };
    const idx = balungan[s];
    if (idx !== undefined) {
      this.strike(scaleNote(SLENDRO, idx), time, 0.2, 1.9);
    }

    // Peking: hiasan gatra ganjil, satu oktaf lebih tinggi.
    if (s % 2 === 1) {
      const p = [0, 2, 3, 1, 4, 3, 2, 1][s] ?? 2;
      this.strike(scaleNote(SLENDRO, p + 5) * 2, time, 0.075, 1.0);
    }

    // Bonang barung: petikan halus pada ketukan tertentu (pelog).
    if (s === 6 || s === 14) {
      this.strike(scaleNote(PELOG, 4) * 2, time + beat * 0.5, 0.09, 1.6);
    }

    this.step += 1;
  }

  /** Mulai memutar gendhing. Mengembalikan false bila Web Audio tidak tersedia. */
  async start(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return false;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    this._playing = true;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this._volume * 0.55, now + 1.6);

    const beat = 0.62;
    this.step = 0;
    // Gong pembuka.
    this.gong(now + 0.05, 0.5);
    for (let i = 0; i < 16; i += 1) {
      this.playStep(i, now + 0.9 + i * beat);
    }

    let nextTime = now + 0.9 + 16 * beat;
    const schedule = () => {
      if (!this._playing || !this.ctx) return;
      const ahead = this.ctx.currentTime + 2.4;
      while (nextTime < ahead) {
        this.playStep(this.step, nextTime);
        nextTime += beat;
      }
    };
    schedule();
    this.timer = window.setInterval(schedule, 600);
    return true;
  }

  /** Jeda dengan fade-out halus agar tidak terasa terpotong. */
  pause(): void {
    this._playing = false;
    if (this.timer != null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.9);
  }

  async toggle(): Promise<boolean> {
    if (this._playing) {
      this.pause();
      return false;
    }
    return this.start();
  }

  setVolume(v: number): void {
    this._volume = Math.min(1, Math.max(0, v));
    const ctx = this.ctx;
    const master = this.master;
    if (ctx && master && this._playing) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(this._volume * 0.55, now + 0.25);
    }
  }

  /** Amplitudo 0..1 untuk visualisasi ikon musik yang bereaksi nyata. */
  getLevel(): number {
    if (!this.analyser || !this.freqData || !this._playing) return 0;
    this.analyser.getByteFrequencyData(this.freqData as Uint8Array<ArrayBuffer>);
    let sum = 0;
    for (let i = 0; i < this.freqData.length; i += 1) sum += this.freqData[i];
    return Math.min(1, sum / this.freqData.length / 128);
  }

  /** Dipanggil saat unmount. */
  dispose(): void {
    this.pause();
    if (this.ctx) {
      // Putuskan jalur efek gema sebelum konteks ditutup.
      this.reverb?.disconnect();
      void this.ctx.close();
      this.ctx = null;
    }
    this.master = null;
    this.analyser = null;
    this.reverb = null;
  }
}
