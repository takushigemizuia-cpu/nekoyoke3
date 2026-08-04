export type FrequencyMode = 'sweep' | 'preset' | 'pulse' | 'chaos' | 'custom' | 'test';

export interface FrequencyPreset {
  id: string;
  name: string;
  target: string;
  freqMin: number;
  freqMax: number;
  description: string;
  iconName: string;
  recommended: boolean;
  category: 'cat' | 'rat' | 'dual';
}

export interface AudioEngineState {
  isPlaying: boolean;
  currentFrequency: number;
  mode: FrequencyMode;
  volume: number;
  sampleRate: number;
  maxNyquist: number;
  sweepMin: number;
  sweepMax: number;
  pulseSpeedHz: number;
  strobeEnabled: boolean;
}

export interface MotionConfig {
  enabled: boolean;
  sensitivity: number; // 1 to 10
  isTriggered: boolean;
  blastDurationSec: number;
  lastTriggerTime: number | null;
}

export interface RepellentLog {
  id: string;
  timestamp: Date;
  mode: string;
  frequencyLabel: string;
  durationSeconds: number;
  triggeredBy: 'manual' | 'timer' | 'motion';
}
