/**
 * Advanced Combat Music Engine — Cinematic battle soundtrack generator.
 * Features: layered drums, bass drops, energy buildups, tempo sync, intensity scaling.
 * Zero external dependencies — pure Web Audio API.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let running = false;
let intensity = 0.3; // 0-1 combat intensity
let tempo = 140; // BPM
let beat = 0;
let drumTimer: number | null = null;
let layers: { stop: () => void }[] = [];

function getCtx() {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return { ctx, master: masterGain! };
}

/* ===================== DRUM MACHINE ===================== */

function kick(time: number, volume = 0.4) {
  const { ctx: c, master } = getCtx();
  // Sub oscillator for deep punch
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
  osc.connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.4);

  // Click transient for attack
  const click = c.createOscillator();
  const clickGain = c.createGain();
  click.type = "square";
  click.frequency.setValueAtTime(1500, time);
  click.frequency.exponentialRampToValueAtTime(200, time + 0.02);
  clickGain.gain.setValueAtTime(volume * 0.6, time);
  clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  click.connect(clickGain).connect(master);
  click.start(time);
  click.stop(time + 0.05);

  // Noise body
  const bufLen = Math.floor(c.sampleRate * 0.05);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
  const ns = c.createBufferSource();
  const nsGain = c.createGain();
  const filter = c.createBiquadFilter();
  ns.buffer = buf;
  filter.type = "lowpass";
  filter.frequency.value = 200;
  nsGain.gain.setValueAtTime(volume * 0.3, time);
  nsGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  ns.connect(filter).connect(nsGain).connect(master);
  ns.start(time);
}

function snare(time: number, volume = 0.25) {
  const { ctx: c, master } = getCtx();
  // Tone body
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(250, time);
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.05);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  osc.connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.2);

  // Noise crack
  const bufLen = Math.floor(c.sampleRate * 0.12);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1);
  const ns = c.createBufferSource();
  const nsGain = c.createGain();
  const hp = c.createBiquadFilter();
  ns.buffer = buf;
  hp.type = "highpass";
  hp.frequency.value = 3000;
  nsGain.gain.setValueAtTime(volume * 0.8, time);
  nsGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
  ns.connect(hp).connect(nsGain).connect(master);
  ns.start(time);
}

function hihat(time: number, open = false, volume = 0.08) {
  const { ctx: c, master } = getCtx();
  const dur = open ? 0.2 : 0.04;
  const bufLen = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1);
  const ns = c.createBufferSource();
  const gain = c.createGain();
  const hp = c.createBiquadFilter();
  const bp = c.createBiquadFilter();
  ns.buffer = buf;
  hp.type = "highpass";
  hp.frequency.value = 7000;
  bp.type = "bandpass";
  bp.frequency.value = 10000;
  bp.Q.value = 1;
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
  ns.connect(hp).connect(bp).connect(gain).connect(master);
  ns.start(time);
}

function cymbalCrash(time: number, volume = 0.12) {
  const { ctx: c, master } = getCtx();
  const bufLen = Math.floor(c.sampleRate * 1.5);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1);
  const ns = c.createBufferSource();
  const gain = c.createGain();
  const bp = c.createBiquadFilter();
  ns.buffer = buf;
  bp.type = "bandpass";
  bp.frequency.value = 8000;
  bp.Q.value = 0.5;
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
  ns.connect(bp).connect(gain).connect(master);
  ns.start(time);
}

/* ===================== BASS ENGINE ===================== */

function bassLine(time: number, note: number, dur: number, volume = 0.15) {
  const { ctx: c, master } = getCtx();
  const osc = c.createOscillator();
  const osc2 = c.createOscillator();
  const gain = c.createGain();
  // Distortion could be added via c.createWaveShaper() if needed
  const filter = c.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.value = note;
  osc2.type = "square";
  osc2.frequency.value = note * 0.998; // slight detune for width

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(200 + intensity * 600, time);
  filter.Q.value = 4;

  gain.gain.setValueAtTime(volume * (0.5 + intensity * 0.5), time);
  gain.gain.setValueAtTime(volume * (0.5 + intensity * 0.5), time + dur * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain).connect(master);
  osc.start(time);
  osc2.start(time);
  osc.stop(time + dur + 0.05);
  osc2.stop(time + dur + 0.05);
}

/* ===================== BASS DROP ===================== */

function bassDrop(time: number) {
  const { ctx: c, master } = getCtx();

  // Sweeping sub bass
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(200, time);
  osc.frequency.exponentialRampToValueAtTime(25, time + 0.8);
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.setValueAtTime(0.5, time + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
  osc.connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 1.3);

  // Impact noise
  const bufLen = Math.floor(c.sampleRate * 0.3);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1);
  const ns = c.createBufferSource();
  const nsGain = c.createGain();
  const lp = c.createBiquadFilter();
  ns.buffer = buf;
  lp.type = "lowpass";
  lp.frequency.value = 150;
  nsGain.gain.setValueAtTime(0.3, time);
  nsGain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
  ns.connect(lp).connect(nsGain).connect(master);
  ns.start(time);

  // Second sub harmonic
  const osc2 = c.createOscillator();
  const gain2 = c.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(100, time);
  osc2.frequency.exponentialRampToValueAtTime(20, time + 0.6);
  gain2.gain.setValueAtTime(0.3, time);
  gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
  osc2.connect(gain2).connect(master);
  osc2.start(time);
  osc2.stop(time + 0.9);

  cymbalCrash(time, 0.15);
}

/* ===================== ENERGY BUILDUP ===================== */

function energyBuildup(duration = 2) {
  const { ctx: c, master } = getCtx();
  const now = c.currentTime;

  // Rising filtered noise
  const bufLen = Math.floor(c.sampleRate * duration);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1);
  const ns = c.createBufferSource();
  const nsGain = c.createGain();
  const bp = c.createBiquadFilter();
  ns.buffer = buf;
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(500, now);
  bp.frequency.exponentialRampToValueAtTime(8000, now + duration);
  bp.Q.value = 3;
  nsGain.gain.setValueAtTime(0.02, now);
  nsGain.gain.linearRampToValueAtTime(0.15, now + duration * 0.9);
  nsGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  ns.connect(bp).connect(nsGain).connect(master);
  ns.start(now);

  // Rising pitch siren
  const siren = c.createOscillator();
  const sirenGain = c.createGain();
  siren.type = "sawtooth";
  siren.frequency.setValueAtTime(100, now);
  siren.frequency.exponentialRampToValueAtTime(2000, now + duration);
  sirenGain.gain.setValueAtTime(0.01, now);
  sirenGain.gain.linearRampToValueAtTime(0.08, now + duration * 0.8);
  sirenGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  siren.connect(sirenGain).connect(master);
  siren.start(now);
  siren.stop(now + duration + 0.1);

  // Snare roll accelerating
  const beatDur = 60 / (tempo * 2);
  let rollBeats = Math.floor(duration / beatDur);
  for (let i = 0; i < rollBeats; i++) {
    const t = now + (i / rollBeats) * duration;
    const vol = 0.05 + (i / rollBeats) * 0.2;
    snare(t, vol * 0.5);
  }
}

/* ===================== SYNTH PAD (TENSION) ===================== */

function startTensionPad(): { stop: () => void } {
  const { ctx: c, master } = getCtx();
  const gain = c.createGain();
  gain.gain.value = 0.03;
  gain.connect(master);

  const oscs: OscillatorNode[] = [];
  // Minor chord drone: E2, G2, B2, D3
  const notes = [82.41, 98, 123.47, 146.83];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    osc.type = i < 2 ? "sawtooth" : "triangle";
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 10;
    const oscGain = c.createGain();
    oscGain.gain.value = 0.4;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300 + intensity * 400;
    const lfo = c.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1 + i * 0.05;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain).connect(oscGain.gain);
    lfo.start();
    osc.connect(filter).connect(oscGain).connect(gain);
    osc.start();
    oscs.push(osc, lfo);
  });

  return {
    stop() {
      gain.gain.linearRampToValueAtTime(0.001, (c.currentTime || 0) + 0.5);
      setTimeout(() => {
        oscs.forEach(o => { try { o.stop(); } catch {} });
      }, 600);
    }
  };
}

/* ===================== DRUM SEQUENCER ===================== */

const drumPatterns = {
  // [kick, snare, hihat, openHihat] per 16th note
  low: [
    [1,0,0,0], [0,0,1,0], [0,0,0,0], [0,0,1,0],
    [0,0,0,0], [0,0,1,0], [0,1,0,0], [0,0,1,0],
    [1,0,0,0], [0,0,1,0], [0,0,0,0], [0,0,1,0],
    [0,0,0,0], [0,0,1,0], [0,1,0,0], [0,0,0,1],
  ],
  mid: [
    [1,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0],
    [0,1,1,0], [0,0,1,0], [1,0,1,0], [0,0,1,0],
    [1,0,1,0], [0,0,1,0], [0,0,1,0], [1,0,1,0],
    [0,1,1,0], [0,0,1,0], [0,0,1,0], [0,0,0,1],
  ],
  high: [
    [1,0,1,0], [0,0,1,0], [1,0,1,0], [0,0,1,0],
    [0,1,1,0], [0,0,1,0], [1,0,1,0], [0,0,1,0],
    [1,0,1,0], [1,0,1,0], [0,0,1,0], [0,0,1,0],
    [0,1,1,0], [1,0,1,0], [0,1,1,0], [0,0,0,1],
  ],
  intense: [
    [1,0,1,0], [0,0,1,0], [1,0,1,0], [1,0,1,0],
    [0,1,1,0], [0,0,1,0], [1,0,1,0], [0,1,1,0],
    [1,0,1,0], [1,0,1,0], [0,1,1,0], [1,0,1,0],
    [0,1,1,0], [1,0,1,0], [1,1,1,0], [0,0,0,1],
  ],
};

// Bass note pattern per beat (4 notes per bar, minor key)
const bassNotes = [41.2, 41.2, 49, 36.7]; // E1, E1, G1, D1

function getPattern(): number[][] {
  if (intensity < 0.25) return drumPatterns.low;
  if (intensity < 0.5) return drumPatterns.mid;
  if (intensity < 0.75) return drumPatterns.high;
  return drumPatterns.intense;
}

function scheduleBar() {
  if (!running || !ctx) return;
  const c = ctx;
  const now = c.currentTime;
  const sixteenth = 60 / tempo / 4;
  const pattern = getPattern();
  const kickVol = 0.2 + intensity * 0.3;
  const snareVol = 0.12 + intensity * 0.18;
  const hihatVol = 0.04 + intensity * 0.06;

  for (let i = 0; i < 16; i++) {
    const t = now + i * sixteenth;
    const [k, s, h, oh] = pattern[i];
    if (k) kick(t, kickVol);
    if (s) snare(t, snareVol);
    if (h) hihat(t, false, hihatVol);
    if (oh) hihat(t, true, hihatVol * 1.5);

    // Bass on quarter notes
    if (i % 4 === 0) {
      const noteIdx = Math.floor(i / 4);
      bassLine(t, bassNotes[noteIdx % bassNotes.length], sixteenth * 3.5, 0.1 + intensity * 0.08);
    }
  }

  const barDuration = sixteenth * 16;
  beat += 16;

  // Every 4 bars, add variation
  if (beat % 64 === 0 && intensity > 0.5) {
    cymbalCrash(now + barDuration - sixteenth, 0.08 + intensity * 0.08);
  }

  drumTimer = window.setTimeout(scheduleBar, barDuration * 1000 - 50);
}

/* ===================== PUBLIC API ===================== */

function startCombatMusic() {
  if (running) return;
  running = true;
  beat = 0;
  intensity = 0.3;
  getCtx(); // ensure audio context

  // Start tension pad
  const pad = startTensionPad();
  layers.push(pad);

  // Start drum sequencer
  scheduleBar();
}

function stopCombatMusic() {
  running = false;
  if (drumTimer !== null) {
    clearTimeout(drumTimer);
    drumTimer = null;
  }
  layers.forEach(l => l.stop());
  layers = [];
  beat = 0;
}

function setCombatIntensity(value: number) {
  const prev = intensity;
  intensity = Math.max(0, Math.min(1, value));

  // Dynamically adjust tempo based on intensity
  tempo = 130 + Math.floor(intensity * 40); // 130-170 BPM

  // Adjust master volume with intensity
  if (masterGain && ctx) {
    masterGain.gain.linearRampToValueAtTime(
      0.18 + intensity * 0.17,
      ctx.currentTime + 0.3
    );
  }

  // Trigger bass drop on big intensity jumps
  if (intensity - prev > 0.3 && ctx) {
    bassDrop(ctx.currentTime);
  }
}

/** Trigger energy buildup before a big attack */
function triggerBuildup(duration = 1.5) {
  energyBuildup(duration);
}

/** Trigger bass drop synced to a visual explosion */
function triggerDrop() {
  if (!ctx) getCtx();
  bassDrop(ctx!.currentTime);
}

/** Trigger a hit accent — cymbal + kick */
function triggerHitAccent() {
  if (!ctx) getCtx();
  const now = ctx!.currentTime;
  kick(now, 0.5);
  cymbalCrash(now, 0.1);
  snare(now + 0.05, 0.3);
}

/** Silence drums for dramatic pause before big moment */
function triggerSilence(duration = 0.8) {
  if (!running || !masterGain || !ctx) return;
  const now = ctx.currentTime;
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(0.01, now + 0.05);
  masterGain.gain.linearRampToValueAtTime(0.18 + intensity * 0.17, now + duration);
}

export function useCombatMusic() {
  return {
    startCombatMusic,
    stopCombatMusic,
    setCombatIntensity,
    triggerBuildup,
    triggerDrop,
    triggerHitAccent,
    triggerSilence,
    getIntensity: () => intensity,
  };
}

export type CombatMusic = ReturnType<typeof useCombatMusic>;
