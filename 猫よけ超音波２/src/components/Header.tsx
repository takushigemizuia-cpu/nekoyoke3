import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenKnowledge: () => void;
  isPlaying: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenKnowledge, isPlaying }) => {
  return (
    <header className="w-full bg-[#05070A]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isPlaying
              ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)] animate-pulse'
              : 'bg-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
          }`} />
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-slate-100">
                SONIC GUARD PRO
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 border border-slate-800 rounded-full text-[9px] font-mono tracking-widest uppercase text-slate-400 bg-slate-900/50">
                v2.4.0 High-Res
              </span>
            </div>
            <p className="text-[10px] tracking-wider text-slate-400 font-mono mt-0.5">高周波超音波発信 ・ 猫＆ネズミ害獣遠ざけシステム</p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onOpenKnowledge}
          className="px-4 py-2 rounded-full border border-slate-800 text-[11px] font-medium tracking-wider uppercase text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors bg-slate-900/60 flex items-center gap-1.5 active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>ガイド</span>
        </button>
      </div>
    </header>
  );
};

