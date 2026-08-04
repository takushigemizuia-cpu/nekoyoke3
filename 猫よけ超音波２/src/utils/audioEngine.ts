/**
 * Web Audio API Engine for High Frequency Ultrasonic Sound Generation
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let oscillator: OscillatorNode | null = null;
let analyser: AnalyserNode | null = null;
let animationFrameId: number | null = null;

// Track current dynamic playback values
let isRunning = false;
let currentFreq = 19000; // Default 19 kHz
let currentMode: 'static' | 'sweep' | 'pulse' | 'chaos' | 'test' = 'static';
let volumeLevel = 0.8; // 0.0 to 1.0

// Sweep state
let sweepMin = 16000;
let sweepMax = 22000;
let sweepDirection = 1;
let sweepSpeed = 3000; // Hz per second

// Pulse state
let pulseLastTime = 0;
let pulseState = false;
let pulseRateMs = 150; // Milliseconds ON / OFF

// Listener for frequency updates in UI
type FreqCallback = (freq: number) => void;
let onFreqUpdate: FreqCallback | null = null;

export function setFrequencyUpdateCallback(cb: FreqCallback | null) {
  onFreqUpdate = cb;
}

export function initAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAudioCapabilities() {
  const ctx = audioCtx || initAudioContext();
  const sampleRate = ctx.sampleRate || 44100;
  const maxFrequency = Math.floor(sampleRate / 2);
  return {
    sampleRate,
    maxFrequency,
    state: ctx.state,
  };
}

export function startAudioEngine(
  mode: 'static' | 'sweep' | 'pulse' | 'chaos' | 'test',
  initialFreq: number = 19000,
  minFreq: number = 16000,
  maxFreq: number = 22000,
  vol: number = 0.8
) {
  const ctx = initAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  stopAudioEngine(); // Clear any active node

  currentMode = mode;
  currentFreq = initialFreq;
  sweepMin = minFreq;
  sweepMax = maxFreq;
  volumeLevel = Math.max(0, Math.min(1, vol));

  // Create Analyser
  analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;

  // Create Master Gain
  masterGain = ctx.createGain();
  // Soft fade-in to prevent initial speaker click
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volumeLevel), ctx.currentTime + 0.05);

  // Create Oscillator
  oscillator = ctx.createOscillator();
  oscillator.type = 'sine'; // Sine wave produces cleanest high-frequency tone
  oscillator.frequency.setValueAtTime(currentFreq, ctx.currentTime);

  // Connect graph: Osc -> Gain -> Analyser -> Destination
  oscillator.connect(masterGain);
  masterGain.connect(analyser);
  analyser.connect(ctx.destination);

  oscillator.start();
  isRunning = true;

  // Start modulation loop if sweep/pulse/chaos
  let lastFrameTime = performance.now();
  let chaosTimer = 0;

  const loop = (now: number) => {
    if (!isRunning || !oscillator || !audioCtx) return;

    const dt = (now - lastFrameTime) / 1000; // seconds
    lastFrameTime = now;

    if (currentMode === 'sweep') {
      currentFreq += sweepDirection * sweepSpeed * dt;
      if (currentFreq >= sweepMax) {
        currentFreq = sweepMax;
        sweepDirection = -1;
      } else if (currentFreq <= sweepMin) {
        currentFreq = sweepMin;
        sweepDirection = 1;
      }
      oscillator.frequency.setValueAtTime(currentFreq, audioCtx.currentTime);
      if (onFreqUpdate) onFreqUpdate(Math.round(currentFreq));
    } else if (currentMode === 'pulse') {
      if (now - pulseLastTime >= pulseRateMs) {
        pulseLastTime = now;
        pulseState = !pulseState;
        if (masterGain && audioCtx) {
          const targetGain = pulseState ? volumeLevel : 0.001;
          masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
          masterGain.gain.setValueAtTime(targetGain, audioCtx.currentTime);
        }
      }
      if (onFreqUpdate) onFreqUpdate(Math.round(currentFreq));
    } else if (currentMode === 'chaos') {
      chaosTimer += dt;
      if (chaosTimer >= 0.2) { // Change every 200ms
        chaosTimer = 0;
        currentFreq = Math.floor(sweepMin + Math.random() * (sweepMax - sweepMin));
        oscillator.frequency.setValueAtTime(currentFreq, audioCtx.currentTime);
        if (onFreqUpdate) onFreqUpdate(Math.round(currentFreq));
      }
    } else {
      if (onFreqUpdate) onFreqUpdate(Math.round(currentFreq));
    }

    animationFrameId = requestAnimationFrame(loop);
  };

  lastFrameTime = performance.now();
  animationFrameId = requestAnimationFrame(loop);
}

export function updateFrequency(freq: number) {
  currentFreq = freq;
  if (oscillator && audioCtx && isRunning) {
    oscillator.frequency.cancelScheduledValues(audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  }
}

export function updateVolume(vol: number) {
  volumeLevel = Math.max(0, Math.min(1, vol));
  if (masterGain && audioCtx && isRunning) {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(volumeLevel, audioCtx.currentTime + 0.05);
  }
}

export function updateSweepRange(min: number, max: number) {
  sweepMin = min;
  sweepMax = max;
  if (currentFreq < min) currentFreq = min;
  if (currentFreq > max) currentFreq = max;
}

export function stopAudioEngine() {
  isRunning = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (masterGain && audioCtx) {
    try {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
    } catch {
      // Ignore if already closed
    }
  }

  setTimeout(() => {
    if (oscillator) {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch {
        // Ignore
      }
      oscillator = null;
    }
    if (masterGain) {
      masterGain.disconnect();
      masterGain = null;
    }
    analyser = null;
  }, 60);
}

export function getAudioData(timeDomainData: Uint8Array, frequencyData: Uint8Array) {
  if (analyser) {
    analyser.getByteTimeDomainData(timeDomainData);
    analyser.getByteFrequencyData(frequencyData);
  } else {
    timeDomainData.fill(128);
    frequencyData.fill(0);
  }
}

export function isAudioRunning() {
  return isRunning;
}

export function getCurrentFrequency() {
  return currentFreq;
}
