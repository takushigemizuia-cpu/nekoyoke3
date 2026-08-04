import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface StrobePanelProps {
  isPlaying: boolean;
}

export const StrobePanel: React.FC<StrobePanelProps> = ({ isPlaying }) => {
  const [strobeEnabled, setStrobeEnabled] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && strobeEnabled) {
      interval = setInterval(() => {
        setFlash((prev) => !prev);
      }, 150); // Fast strobe 6.6Hz
    } else {
      setFlash(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, strobeEnabled]);

  return (
    <>
      {/* Full screen flash overlay when active */}
      {flash && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none opacity-80 animate-pulse"></div>
      )}

      <div className="w-full bg-[#05070A] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2 text-slate-300 font-mono tracking-wider uppercase text-[11px]">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>STROBE FLASH LIGHT (夜間フラッシュ)</span>
          </div>
          <button
            onClick={() => setStrobeEnabled(!strobeEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              strobeEnabled ? 'bg-amber-400 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md transform transition-transform" />
          </button>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
          <Moon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            暗所での屋外設置時、超音波(聴覚)と画面連動フラッシュ(視覚)のダブル刺激で侵入防止効果を強化します。
          </span>
        </div>

        {strobeEnabled && isPlaying && (
          <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-[10px] text-amber-300 font-mono tracking-widest text-center uppercase animate-pulse">
            ⚡ NIGHT STROBE ILLUMINATION ACTIVE
          </div>
        )}
      </div>
    </>
  );
};

