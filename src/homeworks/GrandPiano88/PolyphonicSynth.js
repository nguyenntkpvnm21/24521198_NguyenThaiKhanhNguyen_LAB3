const PEAK_GAIN = 0.2;
const SUSTAIN_RATIO = 0.7;
const ATTACK_S = 0.01;
const DECAY_S = 0.08;
const RELEASE_S = 0.04;
const STOP_MARGIN_S = 0.02;
const MASTER_GAIN = 0.5;
const SILENCE = 0.0001;

/**
 * Polyphonic Web Audio synth. `voices` is a Map (midi -> { osc, gain }),
 * so insertion order is FIFO order.
 */
export class PolyphonicSynth {
  constructor(maxVoices = 8) {
    this.ctx = null;
    this.master = null;
    this.maxVoices = maxVoices;
    this.voices = new Map();
  }

  ensureContext() {
    if (this.ctx === null) {
      this.ctx = new window.AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = MASTER_GAIN;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /** @returns {{ started: boolean, stolenMidi: number | null }} */
  noteOn(midi, freqHz) {
    if (this.voices.has(midi)) return { started: false, stolenMidi: null };
    const ctx = this.ensureContext();

    // FIFO voice stealing: the Map keeps insertion order, so the first key is the oldest.
    let stolenMidi = null;
    if (this.voices.size >= this.maxVoices) {
      stolenMidi = this.voices.keys().next().value;
      this.noteOff(stolenMidi);
    }

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(freqHz, t);
    // Attack then decay to the sustain level: no click at note start.
    gain.gain.setValueAtTime(SILENCE, t);
    gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, t + ATTACK_S);
    gain.gain.exponentialRampToValueAtTime(
      PEAK_GAIN * SUSTAIN_RATIO,
      t + ATTACK_S + DECAY_S,
    );
    osc.connect(gain).connect(this.master);
    osc.start(t);
    this.voices.set(midi, { osc, gain });
    return { started: true, stolenMidi };
  }

  /** @returns {boolean} true if a sounding voice was released */
  noteOff(midi) {
    const voice = this.voices.get(midi);
    if (!voice) return false;
    this.voices.delete(midi);
    const { osc, gain } = voice;
    const t = this.ctx.currentTime;
    // Ramp from the current level to silence before stopping: no click at note end.
    const current = Math.max(gain.gain.value, SILENCE);
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(current, t);
    gain.gain.exponentialRampToValueAtTime(SILENCE, t + RELEASE_S);
    osc.stop(t + RELEASE_S + STOP_MARGIN_S);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    return true;
  }

  /** Release every held voice. @returns {number[]} the released midi numbers */
  allNotesOff() {
    const released = [...this.voices.keys()];
    for (const midi of released) {
      this.noteOff(midi);
    }
    return released;
  }

  /** Free all audio resources. Safe to call more than once (StrictMode runs cleanups twice in dev). */
  dispose() {
    if (this.ctx === null) return;
    for (const { osc, gain } of this.voices.values()) {
      osc.disconnect();
      gain.disconnect();
    }
    this.voices.clear();
    this.ctx.close();
    this.ctx = null;
    this.master = null;
  }
}