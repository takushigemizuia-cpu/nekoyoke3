import React, { useState } from 'react';
import { Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { startAudioEngine, stopAudioEngine } from '../utils/audioEngine';

export const TestTonePanel: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success'>('idle');

  const runTestTone = (freq: number) => {
    setIsTesting(true);
    setTestResult('testing');

    // Start audible tone
    startAudioEngine('test', freq, freq, freq, 0.7);

    setTimeout(() => {
      stopAudioEngine();
      setIsTesting(false);
      setTestResult('success');
    }, 1800);
  };

  return (
    <div className="w-full bg-[#05070A] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2 text-slate-300 font-mono tracking-wider uppercase text-[11px]">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>SPEAKER OUTPUT DIAGNOSTIC (出力テスト)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">AUDIBLE CHECK</span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        超音波(18kHz以上)は人間の耳には無音に近いため、スマホスピーカーからの出力を確認する可聴テスト音(2kHz / 6kHz)を発信できます。
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={isTesting}
          onClick={() => runTestTone(2000)}
          className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono tracking-wider text-slate-200 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          標準テスト (2.0 kHz)
        </button>

        <button
          disabled={isTesting}
          onClick={() => runTestTone(6000)}
          className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono tracking-wider text-slate-200 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          高音テスト (6.0 kHz)
        </button>
      </div>

      {testResult === 'testing' && (
        <div className="flex items-center justify-center gap-2 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-300 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          テスト音発射中... スピーカーから「ピッ」と音が聞こえていますか？
        </div>
      )}

      {testResult === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>テスト完了。音が確認できた場合、スマホのオーディオ回路は正常に機能しています。</span>
        </div>
      )}

      <div className="flex items-start gap-2 text-[10px] font-mono text-slate-500">
        <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
        <span>※マナーモード(消音)が有効な場合、メディア音量が0になっている場合があります。</span>
      </div>
    </div>
  );
};

