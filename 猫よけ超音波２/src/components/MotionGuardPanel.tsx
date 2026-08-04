import React, { useEffect, useState } from 'react';
import { ShieldAlert, Eye, Sliders, BellRing } from 'lucide-react';
import { requestMotionPermission, startMotionDetection, stopMotionDetection } from '../utils/sensor';
import { MotionConfig } from '../types';

interface MotionGuardPanelProps {
  onTriggerBlast: () => void;
  isAudioPlaying: boolean;
}

export const MotionGuardPanel: React.FC<MotionGuardPanelProps> = ({
  onTriggerBlast,
  isAudioPlaying,
}) => {
  const [config, setConfig] = useState<MotionConfig>({
    enabled: false,
    sensitivity: 5,
    isTriggered: false,
    blastDurationSec: 15,
    lastTriggerTime: null,
  });

  const [motionValue, setMotionValue] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(true);

  const toggleGuard = async () => {
    if (!config.enabled) {
      const granted = await requestMotionPermission();
      if (!granted) {
        setPermissionGranted(false);
        return;
      }
      setPermissionGranted(true);
      setConfig((prev) => ({ ...prev, enabled: true }));

      startMotionDetection((magnitude) => {
        setMotionValue(magnitude);

        const threshold = 18 - config.sensitivity * 1.5;

        if (magnitude > threshold) {
          setConfig((prev) => {
            const now = Date.now();
            if (prev.lastTriggerTime && now - prev.lastTriggerTime < 5000) {
              return prev;
            }
            onTriggerBlast();
            return {
              ...prev,
              isTriggered: true,
              lastTriggerTime: now,
            };
          });

          setTimeout(() => {
            setConfig((prev) => ({ ...prev, isTriggered: false }));
          }, 3000);
        }
      });
    } else {
      stopMotionDetection();
      setConfig((prev) => ({ ...prev, enabled: false, isTriggered: false }));
      setMotionValue(0);
    }
  };

  useEffect(() => {
    return () => {
      stopMotionDetection();
    };
  }, []);

  return (
    <div className="w-full bg-[#05070A] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2 text-slate-300 font-mono tracking-wider uppercase text-[11px]">
          <ShieldAlert className={`w-4 h-4 ${config.enabled ? 'text-amber-400' : 'text-slate-500'}`} />
          <span>INTRUSION & MOTION SENSOR (振動・接近ガード)</span>
        </div>
        <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${
          config.enabled ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-500'
        }`}>
          {config.enabled ? 'ARMED' : 'OFF'}
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        スマホを庭先や花壇横、玄関前に静置し、加速度センサーで動物接近時の微振動を検出。動体を察知すると瞬時に超音波を自動発射します。
      </p>

      {/* Main Guard Toggle Button */}
      <button
        onClick={toggleGuard}
        className={`w-full py-3.5 px-4 rounded-full border flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer ${
          config.enabled
            ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        {config.enabled ? 'DISARM SENSOR (警戒解除)' : 'ARM SENSOR GUARD (振動検知警戒スタート)'}
      </button>

      {!permissionGranted && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-2xl text-xs text-rose-300">
          モーションセンサーへのアクセス許可が必要です。
        </div>
      )}

      {config.enabled && (
        <div className="space-y-3 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/80">
          {/* Live motion intensity bar */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
              <span>LIVE MOTION MAGNITUDE:</span>
              <span className="text-amber-400 font-bold">{motionValue.toFixed(1)}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-75"
                style={{ width: `${Math.min(100, (motionValue / 15) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Sensitivity slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" /> SENSITIVITY (感度):
              </span>
              <span className="text-amber-400 font-bold">LEVEL {config.sensitivity}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={config.sensitivity}
              onChange={(e) => setConfig((prev) => ({ ...prev, sensitivity: Number(e.target.value) }))}
              className="w-full accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {config.isTriggered && (
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-950/60 border border-amber-500 text-amber-300 rounded-xl text-xs font-mono tracking-wider animate-bounce uppercase">
              <BellRing className="w-4 h-4 text-amber-400" />
              MOTION DETECTED! ULTRASONIC BLAST ACTIVATED
            </div>
          )}
        </div>
      )}
    </div>
  );
};

