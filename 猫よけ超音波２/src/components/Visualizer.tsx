import React, { useEffect, useRef } from 'react';
import { getAudioData, getAudioCapabilities } from '../utils/audioEngine';
import { Radio, Cpu } from 'lucide-react';

interface VisualizerProps {
  isPlaying: boolean;
  currentFrequency: number;
  mode: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isPlaying, currentFrequency, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const timeDomain = new Uint8Array(2048);
    const frequencyData = new Uint8Array(2048);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Deep obsidian minimalist background
      ctx.fillStyle = '#05070A';
      ctx.fillRect(0, 0, width, height);

      // Subtle minimalist grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridCols = 10;
      const gridRows = 4;
      for (let i = 1; i < gridCols; i++) {
        const x = (width / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let j = 1; j < gridRows; j++) {
        const y = (height / gridRows) * j;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (isPlaying) {
        getAudioData(timeDomain, frequencyData);

        // Spectrum bars with subtle opacity
        const barWidth = width / 64;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.12)';
        for (let i = 0; i < 64; i++) {
          const value = frequencyData[i * 4] || 0;
          const barHeight = (value / 255) * height * 0.75;
          ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
        }

        // Clean glowing cyan waveform line
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = width / timeDomain.length;
        let x = 0;

        for (let i = 0; i < timeDomain.length; i++) {
          const v = timeDomain[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // High Hz peak marker line
        const freqRatio = Math.min(1, currentFrequency / 24000);
        const peakX = freqRatio * width;
        ctx.strokeStyle = '#10b981';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(peakX, 0);
        ctx.lineTo(peakX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(peakX, height / 2, 4, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Idle thin baseline
        const midY = height / 2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentFrequency]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = Math.floor(width * window.devicePixelRatio || width);
        canvas.height = Math.floor(height * window.devicePixelRatio || height);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const caps = getAudioCapabilities();
  const freqInKHz = (currentFrequency / 1000).toFixed(1);

  return (
    <div className="w-full bg-[#05070A] border border-slate-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden space-y-6">
      {/* Top Monitor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-900 pb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse' : 'bg-slate-700'}`}></span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase">
            {isPlaying ? `TRANSMITTING: ${mode}` : 'STATUS: STANDBY'}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px] tracking-wider text-slate-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 opacity-60" />
            <span>SAMPLE: {(caps.sampleRate / 1000).toFixed(1)}kHz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400 opacity-60" />
            <span>LIMIT: {(caps.maxFrequency / 1000).toFixed(1)}kHz</span>
          </div>
        </div>
      </div>

      {/* Main Display Big Thin Numbers */}
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="flex items-baseline justify-center">
          <span className={`text-7xl sm:text-8xl font-thin tracking-tighter transition-all duration-300 ${
            isPlaying ? 'text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'text-slate-600'
          }`}>
            {freqInKHz}
          </span>
          <span className="text-2xl font-light text-cyan-400 ml-2">kHz</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.4em] mt-3 font-mono text-cyan-400/80 flex items-center gap-2">
          <span>{currentFrequency.toLocaleString()} Hz</span>
          <span>•</span>
          <span>{isPlaying ? 'Ultrasonic Wave Active' : 'Wave Engine Ready'}</span>
        </div>
      </div>

      {/* Canvas View */}
      <div ref={containerRef} className="w-full h-32 rounded-2xl overflow-hidden relative border border-slate-800/80 bg-[#05070A]">
        <canvas ref={canvasRef} className="w-full h-full block" />
        {isPlaying && (
          <div className="absolute top-3 right-3 bg-[#05070A]/80 border border-cyan-500/30 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            HIGH-RES PULSE
          </div>
        )}
      </div>

      {/* Frequency Range Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 tracking-wider">
          <span>15.0 kHz (Audible Boundary)</span>
          <span className="text-cyan-400 font-semibold tracking-widest">18~22 kHz (Feline Sensitivity Zone)</span>
          <span>24.0 kHz (Speaker Ceiling)</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
          <div className="absolute left-[33%] w-[45%] h-full bg-cyan-500/10 border-x border-cyan-500/30"></div>
          <div
            className="h-full bg-cyan-400 transition-all duration-100 shadow-[0_0_10px_#22d3ee]"
            style={{ width: `${Math.min(100, Math.max(0, ((currentFrequency - 10000) / 14000) * 100))}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

