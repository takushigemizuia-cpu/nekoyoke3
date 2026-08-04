import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { RepellentLog } from '../types';

interface SessionHistoryProps {
  logs: RepellentLog[];
  onClearLogs: () => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ logs, onClearLogs }) => {
  if (logs.length === 0) return null;

  const formatDuration = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}m ${remSecs > 0 ? `${remSecs}s` : ''}`;
  };

  return (
    <div className="w-full bg-[#05070A] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2 text-slate-300 font-mono tracking-wider uppercase text-[11px]">
          <History className="w-4 h-4 text-cyan-400" />
          <span>TRANSMISSION LOGS (発信履歴)</span>
        </div>
        <button
          onClick={onClearLogs}
          className="text-[10px] font-mono tracking-widest uppercase text-slate-500 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
        >
          <Trash2 className="w-3 h-3" /> CLEAR LOGS
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800/60 rounded-2xl text-xs font-mono text-slate-300"
          >
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${
                log.triggeredBy === 'motion' ? 'bg-amber-400' : log.triggeredBy === 'timer' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}></span>
              <div>
                <span className="font-semibold text-slate-100 block">{log.mode}</span>
                <span className="text-[10px] text-slate-500">{log.frequencyLabel}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-cyan-400 font-bold block">{formatDuration(log.durationSeconds)}</span>
              <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

