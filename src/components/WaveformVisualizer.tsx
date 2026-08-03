import React, { useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  isActive: boolean;
  mode: 'listening' | 'speaking' | 'idle';
  barCount?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive,
  mode,
  barCount = 28,
}) => {
  const [scales, setScales] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive || mode === 'idle') {
      setScales(new Array(barCount).fill(0.15));
      return;
    }

    let animId: number;
    let step = 0;

    const animate = () => {
      step += 0.12;
      const newScales = Array.from({ length: barCount }, (_, i) => {
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2);
        const centerWeight = 1 - centerDistance * 0.45;

        if (mode === 'speaking') {
          const sine1 = Math.sin(step * 2 + i * 0.4);
          const sine2 = Math.cos(step * 1.5 + i * 0.3);
          const noise = Math.random() * 0.25;
          const val = (sine1 + sine2 + 2) / 4 + noise;
          return Math.max(0.12, Math.min(1.0, val * centerWeight));
        } else {
          // listening mode: subtle responsive pulse
          const sine = Math.sin(step * 1.8 + i * 0.5);
          const noise = Math.random() * 0.2;
          const val = (sine + 1) / 2 + noise;
          return Math.max(0.1, Math.min(0.65, val * centerWeight));
        }
      });

      setScales(newScales);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isActive, mode, barCount]);

  if (!isActive && mode === 'idle') {
    return (
      <div className="flex items-center justify-center gap-1.5 h-12 px-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono text-slate-500">
        <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
        <span>Audio Waveform Standby</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-[3px] h-14 px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Background glow behind visualizer */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/15 to-purple-500/10 blur-xl pointer-events-none" />

      {scales.map((scale, idx) => {
        const isCenter = Math.abs(idx - barCount / 2) < barCount / 4;
        return (
          <div
            key={idx}
            className={`w-1 h-10 rounded-full transition-transform duration-75 ${
              mode === 'speaking'
                ? isCenter
                  ? 'bg-gradient-to-t from-indigo-500 via-cyan-400 to-white shadow-[0_0_8px_rgba(0,229,255,0.8)]'
                  : 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                : 'bg-gradient-to-t from-cyan-600 via-teal-400 to-emerald-300 shadow-[0_0_6px_rgba(6,182,212,0.6)]'
            }`}
            style={{
              transform: `scaleY(${scale})`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          />
        );
      })}
    </div>
  );
};
