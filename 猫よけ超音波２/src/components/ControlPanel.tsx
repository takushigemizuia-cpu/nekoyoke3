import React from 'react';
import { Volume2, VolumeX, Plus, Minus, AlertTriangle } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  customFrequency: number;
  onFrequencyChange: (freq: number) => void;
  isCustomMode: boolean;
  activePresetName: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  customFrequency,
  onFrequencyChange,
  isCustomMode,
  activePresetName,
}) => {
  const handleFreqStep = (step: number) => {
    const next = Math.min(24000, Math.max(10000, customFrequency + step));
    onFrequencyChange(next);
  };

  return (
    <div className="w-full bg-[#05070A] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Big Master Power Trigger Button */}
      <div className="flex flex-col items-center justify-center py-4">
        <button
          onClick={onTogglePlay}
          className={`w-36 h-36 rounded-full border-2 flex items-center justify-center group transition-all duration-300 relative cursor-pointer ${
            isPlaying
              ? 'border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              : 'border-slate-800 hover:border-cyan-500/70 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
          }`}
        >
          {/* Inner core button */}
          <div
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-95 ${
              isPlaying
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                : 'bg-slate-900 border border-slate-800 text-slate-200 group-hover:border-cyan-500/50 group-hover:text-cyan-400'
            }`}
          >
            <span className="font-extrabold text-sm tracking-tighter uppercase">
              {isPlaying ? 'STOP' : 'TRANSMIT'}
            </span>
            <span className="text-[10px] font-mono tracking-widest mt-0.5 opacity-80 uppercase">
              {isPlaying ? '発信停止' : '猫よけ発信'}
            </span>
          </div>
        </button>

        <div className="mt-4 text-center">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            ACTIVE MODE: <span className="text-cyan-400 font-bold">{activePresetName}</span>
          </span>
        </div>
      </div>

      {/* Manual Frequency Fine-Tuning Slider (Shown in Custom Mode) */}
      {isCustomMode && (
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono tracking-wider text-slate-400 uppercase">マニュアル周波数調整</span>
            <span className="font-mono font-bold text-cyan-400">
              {customFrequency.toLocaleString()} Hz ({(customFrequency / 1000).toFixed(2)} kHz)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleFreqStep(-100)}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono flex items-center gap-1 active:scale-95 transition-colors"
            >
              <Minus className="w-3 h-3" /> 100Hz
            </button>

            <input
              type="range"
              min={10000}
              max={24000}
              step={100}
              value={customFrequency}
              onChange={(e) => onFrequencyChange(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <button
              onClick={() => handleFreqStep(100)}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono flex items-center gap-1 active:scale-95 transition-colors"
            >
              <Plus className="w-3 h-3" /> 100Hz
            </button>
          </div>

          <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            <span>10 kHz (Audible)</span>
            <span>18 kHz (Pet Ultrasonic Zone)</span>
            <span>24 kHz (Ceiling)</span>
          </div>
        </div>
      )}

      {/* Volume Output Power Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono tracking-wider uppercase text-[11px]">
            {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>OUTPUT GAIN POWER (音量)</span>
          </div>
          <span className="font-mono text-cyan-400 font-bold text-xs">{Math.round(volume * 100)}%</span>
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />

        {volume < 0.6 && (
          <div className="flex items-start gap-2 p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-[11px] text-amber-300 font-sans">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>スマホのスピーカー出力が低下すると野良猫への威嚇範囲が狭まります。70%〜100%での使用を推奨します。</span>
          </div>
        )}
      </div>
    </div>
  );
};

