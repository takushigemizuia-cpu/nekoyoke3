import React, { useState } from 'react';
import { FREQUENCY_PRESETS } from '../data/presets';
import { FrequencyPreset } from '../types';
import { Activity, Zap, ShieldAlert, Radio, VolumeX, Shuffle, Sliders } from 'lucide-react';

interface PresetSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (preset: FrequencyPreset | 'custom') => void;
  disabled?: boolean;
}

const getIcon = (name: string) => {
  switch (name) {
    case 'Activity':
      return <Activity className="w-4 h-4 text-cyan-400" />;
    case 'Zap':
      return <Zap className="w-4 h-4 text-amber-400" />;
    case 'ShieldAlert':
      return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
    case 'Radio':
      return <Radio className="w-4 h-4 text-cyan-300" />;
    case 'VolumeX':
      return <VolumeX className="w-4 h-4 text-purple-400" />;
    case 'Shuffle':
      return <Shuffle className="w-4 h-4 text-pink-400" />;
    default:
      return <Sliders className="w-4 h-4 text-slate-400" />;
  }
};

const getCategoryBadge = (category: 'cat' | 'rat' | 'dual') => {
  switch (category) {
    case 'rat':
      return <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[9px] font-mono tracking-wider uppercase">🐭 ネズミ撃退</span>;
    case 'cat':
      return <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[9px] font-mono tracking-wider uppercase">🐱 猫よけ</span>;
    case 'dual':
      return <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono tracking-wider uppercase">🐭🐱 猫・ネズミ両対応</span>;
  }
};

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rat' | 'cat' | 'dual'>('all');

  const filteredPresets = FREQUENCY_PRESETS.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header & Filter Tabs */}
      <div className="space-y-3 border-b border-slate-900 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-mono tracking-[0.2em] text-slate-400 uppercase">
            TARGET PRESETS (撃退プロファイル選択)
          </h3>
          <span className="text-[10px] font-mono text-slate-500">{FREQUENCY_PRESETS.length} PROFILES</span>
        </div>

        {/* Filter Tab Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition cursor-pointer shrink-0 border ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            すべて ({FREQUENCY_PRESETS.length})
          </button>
          <button
            onClick={() => setActiveTab('rat')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition cursor-pointer shrink-0 border ${
              activeTab === 'rat'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            🐭 ネズミ撃退
          </button>
          <button
            onClick={() => setActiveTab('cat')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition cursor-pointer shrink-0 border ${
              activeTab === 'cat'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            🐱 猫よけ
          </button>
          <button
            onClick={() => setActiveTab('dual')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition cursor-pointer shrink-0 border ${
              activeTab === 'dual'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            🐭🐱 猫・ネズミ両対応
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredPresets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_20px_rgba(34,211,238,0.1)] ring-1 ring-cyan-500/40'
                  : 'bg-[#080c14] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {preset.recommended && (
                <div className="absolute top-0 right-0 bg-cyan-500 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-950 px-2.5 py-0.5 rounded-bl-xl">
                  RECOMMENDED
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${isSelected ? 'bg-cyan-950/80 border-cyan-500/40' : 'bg-slate-900 border-slate-800'}`}>
                      {getIcon(preset.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-100">{preset.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 block tracking-wider">{preset.target}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  {getCategoryBadge(preset.category)}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {preset.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="uppercase tracking-wider">FREQUENCIES:</span>
                <span className="text-slate-200 font-semibold tracking-wider">
                  {preset.freqMin === preset.freqMax
                    ? `${(preset.freqMin / 1000).toFixed(1)} kHz`
                    : `${(preset.freqMin / 1000).toFixed(1)} ~ ${(preset.freqMax / 1000).toFixed(1)} kHz`}
                </span>
              </div>
            </button>
          );
        })}

        {/* Custom manual mode card */}
        {(activeTab === 'all' || activeTab === 'dual') && (
          <button
            onClick={() => onSelectPreset('custom')}
            className={`text-left p-4 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
              selectedPresetId === 'custom'
                ? 'bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_20px_rgba(34,211,238,0.1)] ring-1 ring-cyan-500/40'
                : 'bg-[#080c14] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-xl border ${selectedPresetId === 'custom' ? 'bg-cyan-950/80 border-cyan-500/40' : 'bg-slate-900 border-slate-800'}`}>
                  <Sliders className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-100">マニュアル自由設定</h4>
                  <span className="text-[10px] font-mono text-cyan-400 block tracking-wider">10,000Hz 〜 24,000Hz</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                スライダーで特定の周波数を微調整。特定の反応を確認したい時に便利です。
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="uppercase tracking-wider">MODE:</span>
              <span className="text-cyan-400 font-semibold tracking-wider">MANUAL SLIDER</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};


