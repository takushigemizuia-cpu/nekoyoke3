import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface TimerPanelProps {
  isPlaying: boolean;
  onStop: () => void;
}

const TIMER_OPTIONS = [
  { label: '連続発信', minutes: 0 },
  { label: '1 分', minutes: 1 },
  { label: '5 分', minutes: 5 },
  { label: '15 分', minutes: 15 },
  { label: '30 分', minutes: 30 },
  { label: '60 分', minutes: 60 },
];

export const TimerPanel: React.FC<TimerPanelProps> = ({ isPlaying, onStop }) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    if (isPlaying && selectedMinutes > 0) {
      setRemainingSeconds(selectedMinutes * 60);
    } else if (!isPlaying) {
      setRemainingSeconds(0);
    }
  }, [isPlaying, selectedMinutes]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, remainingSeconds, onStop]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#05070A] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2 text-slate-300 font-mono tracking-wider uppercase text-[11px]">
          <Timer className="w-4 h-4 text-cyan-400" />
          <span>AUTO STOP TIMER (自動停止タイマー)</span>
        </div>
        {remainingSeconds > 0 && isPlaying && (
          <span className="font-mono font-bold text-[10px] tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40 animate-pulse uppercase">
            REMAINING: {formatTime(remainingSeconds)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TIMER_OPTIONS.map((opt) => {
          const isSelected = selectedMinutes === opt.minutes;
          return (
            <button
              key={opt.minutes}
              onClick={() => setSelectedMinutes(opt.minutes)}
              className={`py-2.5 px-2 text-center text-[11px] font-mono tracking-wider rounded-2xl border transition cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                  : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {selectedMinutes > 0 && (
        <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
          * {selectedMinutes}分後に自動停止。連続発信による無駄なスマホバッテリー消費を防ぎます。
        </p>
      )}
    </div>
  );
};

