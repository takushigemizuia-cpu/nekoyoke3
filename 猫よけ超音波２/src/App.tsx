import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Visualizer } from './components/Visualizer';
import { ControlPanel } from './components/ControlPanel';
import { PresetSelector } from './components/PresetSelector';
import { TestTonePanel } from './components/TestTonePanel';
import { TimerPanel } from './components/TimerPanel';
import { MotionGuardPanel } from './components/MotionGuardPanel';
import { StrobePanel } from './components/StrobePanel';
import { KnowledgeModal } from './components/KnowledgeModal';
import { SessionHistory } from './components/SessionHistory';
import { FREQUENCY_PRESETS } from './data/presets';
import { FrequencyPreset, RepellentLog } from './types';
import {
  startAudioEngine,
  stopAudioEngine,
  updateFrequency,
  updateVolume,
  setFrequencyUpdateCallback,
} from './utils/audioEngine';
import { ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sweep_auto');
  const [customFrequency, setCustomFrequency] = useState<number>(19000);
  const [currentDisplayFreq, setCurrentDisplayFreq] = useState<number>(19000);
  const [volume, setVolume] = useState<number>(0.85);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<RepellentLog[]>([]);

  const sessionStartTimeRef = useRef<number | null>(null);

  // Set up audio engine frequency update callback
  useEffect(() => {
    setFrequencyUpdateCallback((freq) => {
      setCurrentDisplayFreq(freq);
    });
    return () => {
      setFrequencyUpdateCallback(null);
    };
  }, []);

  const currentPreset = FREQUENCY_PRESETS.find((p) => p.id === selectedPresetId);
  const activePresetName = currentPreset ? currentPreset.name : 'マニュアル設定';

  const handleTogglePlay = () => {
    if (isPlaying) {
      handleStopRepellent('manual');
    } else {
      handleStartRepellent();
    }
  };

  const handleStartRepellent = () => {
    sessionStartTimeRef.current = Date.now();

    let mode: 'static' | 'sweep' | 'pulse' | 'chaos' = 'static';
    let initialFreq = customFrequency;
    let minFreq = 16000;
    let maxFreq = 22000;

    if (selectedPresetId === 'sweep_auto') {
      mode = 'sweep';
      minFreq = 16000;
      maxFreq = 22000;
      initialFreq = 16000;
    } else if (selectedPresetId === 'young_cat') {
      mode = 'sweep';
      minFreq = 20000;
      maxFreq = 24000;
      initialFreq = 20000;
    } else if (selectedPresetId === 'standard_cat') {
      mode = 'sweep';
      minFreq = 17000;
      maxFreq = 20000;
      initialFreq = 17000;
    } else if (selectedPresetId === 'long_distance') {
      mode = 'sweep';
      minFreq = 15000;
      maxFreq = 17500;
      initialFreq = 15000;
    } else if (selectedPresetId === 'pulse_strobe') {
      mode = 'pulse';
      initialFreq = 19500;
    } else if (selectedPresetId === 'chaos_mode') {
      mode = 'chaos';
      minFreq = 15000;
      maxFreq = 23000;
      initialFreq = 18000;
    } else {
      mode = 'static';
      initialFreq = customFrequency;
    }

    startAudioEngine(mode, initialFreq, minFreq, maxFreq, volume);
    setIsPlaying(true);
  };

  const handleStopRepellent = (reason: 'manual' | 'timer' | 'motion' = 'manual') => {
    stopAudioEngine();
    setIsPlaying(false);

    if (sessionStartTimeRef.current) {
      const durationSecs = Math.max(1, Math.floor((Date.now() - sessionStartTimeRef.current) / 1000));
      const newLog: RepellentLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        mode: activePresetName,
        frequencyLabel: `${(currentDisplayFreq / 1000).toFixed(1)} kHz Peak`,
        durationSeconds: durationSecs,
        triggeredBy: reason,
      };
      setLogs((prev) => [newLog, ...prev]);
      sessionStartTimeRef.current = null;
    }
  };

  const handleSelectPreset = (preset: FrequencyPreset | 'custom') => {
    let newId = 'custom';
    if (typeof preset !== 'string') {
      newId = preset.id;
    }
    setSelectedPresetId(newId);

    if (isPlaying) {
      stopAudioEngine();
      setTimeout(() => {
        let mode: 'static' | 'sweep' | 'pulse' | 'chaos' = 'static';
        let minFreq = 16000;
        let maxFreq = 22000;
        let initialFreq = customFrequency;

        if (newId === 'sweep_auto') {
          mode = 'sweep';
          minFreq = 16000;
          maxFreq = 22000;
          initialFreq = 16000;
        } else if (newId === 'young_cat') {
          mode = 'sweep';
          minFreq = 20000;
          maxFreq = 24000;
          initialFreq = 20000;
        } else if (newId === 'standard_cat') {
          mode = 'sweep';
          minFreq = 17000;
          maxFreq = 20000;
          initialFreq = 17000;
        } else if (newId === 'long_distance') {
          mode = 'sweep';
          minFreq = 15000;
          maxFreq = 17500;
          initialFreq = 15000;
        } else if (newId === 'pulse_strobe') {
          mode = 'pulse';
          initialFreq = 19500;
        } else if (newId === 'chaos_mode') {
          mode = 'chaos';
          minFreq = 15000;
          maxFreq = 23000;
          initialFreq = 18000;
        }

        startAudioEngine(mode, initialFreq, minFreq, maxFreq, volume);
      }, 50);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isPlaying) {
      updateVolume(newVol);
    }
  };

  const handleCustomFrequencyChange = (newFreq: number) => {
    setCustomFrequency(newFreq);
    if (isPlaying && selectedPresetId === 'custom') {
      updateFrequency(newFreq);
    }
  };

  const handleMotionBlast = () => {
    if (!isPlaying) {
      handleStartRepellent();
      setTimeout(() => {
        handleStopRepellent('motion');
      }, 12000);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-300 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header onOpenKnowledge={() => setIsKnowledgeOpen(true)} isPlaying={isPlaying} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Safety Alert Banner */}
        <div className="flex items-center justify-between p-4 bg-[#080c14] border border-slate-800/80 rounded-2xl text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px]">高周波Web Audio調律・超音波発信システム準備完了</span>
          </div>
          <button
            onClick={() => setIsKnowledgeOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 shrink-0 ml-2 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Info className="w-3.5 h-3.5" /> GUIDELINES
          </button>
        </div>

        {/* Real-time Visualizer */}
        <Visualizer isPlaying={isPlaying} currentFrequency={currentDisplayFreq} mode={activePresetName} />

        {/* Master Power & Controls */}
        <ControlPanel
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          customFrequency={customFrequency}
          onFrequencyChange={handleCustomFrequencyChange}
          isCustomMode={selectedPresetId === 'custom'}
          activePresetName={activePresetName}
        />

        {/* Preset Profiles */}
        <PresetSelector selectedPresetId={selectedPresetId} onSelectPreset={handleSelectPreset} />

        {/* Speaker Audible Diagnostic */}
        <TestTonePanel />

        {/* Advanced Modes Grid: Timer, Strobe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimerPanel isPlaying={isPlaying} onStop={() => handleStopRepellent('timer')} />
          <StrobePanel isPlaying={isPlaying} />
        </div>

        {/* Motion / Intrusion Guard */}
        <MotionGuardPanel onTriggerBlast={handleMotionBlast} isAudioPlaying={isPlaying} />

        {/* Session Log */}
        <SessionHistory logs={logs} onClearLogs={() => setLogs([])} />
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="w-full bg-[#05070A] border-t border-slate-900 py-8 px-4 text-center text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">
        <p>SONIC GUARD PRO — MOBILE ULTRASONIC CAT DETERRENT SYSTEM</p>
        <p className="text-slate-600 mt-1">SMART RESONANCE TUNING ACTIVE • BIOLOGICAL SAFETY COMPLIANT</p>
      </footer>

      {/* Modal */}
      <KnowledgeModal isOpen={isKnowledgeOpen} onClose={() => setIsKnowledgeOpen(false)} />
    </div>
  );
}

