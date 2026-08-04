import React from 'react';
import { CAT_SAFETY_GUIDE } from '../data/presets';
import { BookOpen, X, Shield, Info } from 'lucide-react';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-xl">
      <div className="w-full max-w-xl bg-[#05070A] border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-900 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-100">
              KNOWLEDGE GUIDE & SAFETY PROTOCOL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs leading-relaxed">
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl flex items-start gap-3 text-cyan-200">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              本アプリの超音波は猫の健康に身体的影響を与えるものではありません。「居心地が悪い不快領域」と学習させて侵入を防ぎます。
            </span>
          </div>

          {CAT_SAFETY_GUIDE.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-2">
              <h3 className="font-mono text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {item.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-xs">{item.content}</p>
            </div>
          ))}

          <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-2">
            <h3 className="font-mono text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              その他の併用対策アドバイス
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-400 text-xs">
              <li>物理的対策：侵入路に猫よけシート(とげとげシート)や砂利を敷く</li>
              <li>匂い対策：木酢液、コーヒーかす、ハーブ(トウガラシ・柑橘類)の散布</li>
              <li>環境対策：猫が隠れやすい物陰やフンをしやすい柔らかい土の場所を減らす</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-slate-800 hover:border-cyan-500 text-slate-200 text-xs font-mono uppercase tracking-widest transition cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

