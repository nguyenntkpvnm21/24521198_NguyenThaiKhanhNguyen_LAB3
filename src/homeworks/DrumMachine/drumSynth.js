export const LEVEL_FLOOR_DB = -60;

const MASTER_GAIN = 0.8;
const SILENCE = 0.0001;

function createNoiseBuffer(ctx) {
  const length = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playTone(ctx, out, t, { type = 'sine', from, to, sweep, decay, peak }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + sweep);
  gain.gain.setValueAtTime(peak, t);
  gain.gain.exponentialRampToValueAtTime(SILENCE, t + decay);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + decay + 0.02);
}

function playNoise(ctx, out, noise, t, { filterType, frequency, decay, peak }) {
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = noise;
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, t);
  gain.gain.setValueAtTime(peak, t);
  gain.gain.exponentialRampToValueAtTime(SILENCE, t + decay);
  source.connect(filter).connect(gain).connect(out);
  source.start(t);
  source.stop(t + decay + 0.02);
}

const VOICES = {
  crash: (ctx, out, noise, t) =>
    playNoise(ctx, out, noise, t, { filterType: 'highpass', frequency: 5000, decay: 0.9, peak: 0.5 }),
  kick: (ctx, out, noise, t) =>
    playTone(ctx, out, t, { from: 160, to: 45, sweep: 0.12, decay: 0.35, peak: 1 }),
  snare: (ctx, out, noise, t) => {
    playNoise(ctx, out, noise, t, { filterType: 'highpass', frequency: 1800, decay: 0.18, peak: 0.7 });
    playTone(ctx, out, t, { type: 'triangle', from: 220, to: 120, sweep: 0.08, decay: 0.12, peak: 0.5 });
  },
  clap: (ctx, out, noise, t) =>
    playNoise(ctx, out, noise, t, { filterType: 'bandpass', frequency: 1500, decay: 0.16, peak: 0.8 }),
  'hihat-closed': (ctx, out, noise, t) =>
    playNoise(ctx, out, noise, t, { filterType: 'highpass', frequency: 7000, decay: 0.05, peak: 0.5 }),
  'hihat-open': (ctx, out, noise, t) =>
    playNoise(ctx, out, noise, t, { filterType: 'highpass', frequency: 7000, decay: 0.35, peak: 0.5 }),
  tom: (ctx, out, noise, t) =>
    playTone(ctx, out, t, { from: 220, to: 90, sweep: 0.15, decay: 0.3, peak: 0.9 }),
};

export function createDrumSynth() {
  let ctx = null;
  let noise = null;
  let master = null;
  let analyser = null;
  let levelData = null;

  function ensureContext() {
    if (ctx === null) {
      ctx = new window.AudioContext();
      noise = createNoiseBuffer(ctx);
      master = ctx.createGain();
      master.gain.value = MASTER_GAIN;
      analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      levelData = new Float32Array(analyser.fftSize);
      master.connect(analyser);
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function trigger(padId) {
    const voice = VOICES[padId];
    if (!voice) return false;
    const audioCtx = ensureContext();
    voice(audioCtx, master, noise, audioCtx.currentTime);
    return true;
  }

  function getLevelDb() {
    if (analyser === null) return LEVEL_FLOOR_DB;
    analyser.getFloatTimeDomainData(levelData);
    let sum = 0;
    for (const sample of levelData) {
      sum += sample * sample;
    }
    const rms = Math.sqrt(sum / levelData.length);
    if (rms === 0) return LEVEL_FLOOR_DB;
    return Math.max(LEVEL_FLOOR_DB, 20 * Math.log10(rms));
  }

  function dispose() {
    if (ctx !== null) {
      ctx.close();
      ctx = null;
      noise = null;
      master = null;
      analyser = null;
      levelData = null;
    }
  }

  return { trigger, getLevelDb, dispose };
}