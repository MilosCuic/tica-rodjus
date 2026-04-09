/**
 * Zvuci preko Web Audio API — nema spoljnih fajlova, radi posle prvog klika (browser policy).
 */

let audioCtx;

function ctx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export async function resumeAudio() {
  const c = ctx();
  if (c.state === "suspended") await c.resume();
}

function noiseBuffer(durationSec, c) {
  const len = Math.floor(c.sampleRate * durationSec);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Kratki „grebanje“ zvuk — throttluje se spolja */
export function playScratchTick() {
  const c = ctx();
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(0.035, c);
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.7;
  const g = c.createGain();
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  src.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  src.start(t);
  src.stop(t + 0.05);
}

/** Jedan „tick“ točka (slot mašina) */
function playWheelTick() {
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.exponentialRampToValueAtTime(220, t + 0.06);
  g.gain.setValueAtTime(0.2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.09);
}

/** Kratak „ding“ kad se točak zaustavi */
export function playWinChime() {
  const c = ctx();
  const t = c.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = t + i * 0.08;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(0.15, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

let spinInterval = null;

/** Pokreće brze tick-ove tokom vrtenja (~4.5s), pozovi iz spin() */
export function startSpinnerTicks(durationMs = 4500) {
  stopSpinnerTicks();
  const start = performance.now();
  const tick = () => {
    playWheelTick();
    if (performance.now() - start < durationMs) {
      spinInterval = window.setTimeout(tick, 95 + Math.random() * 40);
    }
  };
  tick();
}

export function stopSpinnerTicks() {
  if (spinInterval != null) {
    clearTimeout(spinInterval);
    spinInterval = null;
  }
}

/** Udarac / šamar */
export function playPunch() {
  const c = ctx();
  const t = c.currentTime;
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(0.08, c);
  const nf = c.createBiquadFilter();
  nf.type = "lowpass";
  nf.frequency.value = 400;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.35, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  noise.connect(nf);
  nf.connect(ng);
  ng.connect(c.destination);
  noise.start(t);
  noise.stop(t + 0.1);

  const osc = c.createOscillator();
  const og = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(90, t);
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
  og.gain.setValueAtTime(0.45, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  osc.connect(og);
  og.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}

/** Poljubac — kratak „mwah“ */
export function playKiss() {
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.linearRampToValueAtTime(780, t + 0.08);
  osc.frequency.linearRampToValueAtTime(620, t + 0.18);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.22, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.25);
}
