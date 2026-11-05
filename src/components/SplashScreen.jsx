import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
          }, 150);
          return 100;
        }
        return prev + 12;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#07080c] flex flex-col items-center justify-center transition-all duration-700 ${
        isFading ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* High-Tech Radar Visual */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-8">
        {/* Outer concentric rings */}
        <div className="absolute inset-0 rounded-full border border-indigo-500/20" />
        <div className="absolute inset-3 rounded-full border border-indigo-500/30" />
        <div className="absolute inset-6 rounded-full border border-indigo-500/40" />

        {/* Pulse expansion */}
        <div className="absolute inset-0 rounded-full border border-indigo-400/30 radar-pulse pointer-events-none" />

        {/* Rotating Radar Sweep Line */}
        <div className="absolute inset-0 rounded-full radar-spin pointer-events-none overflow-hidden">
          <div className="w-1/2 h-1/2 ml-auto origin-bottom-left bg-gradient-to-tr from-indigo-500/30 via-indigo-500/10 to-transparent" />
        </div>

        {/* Center Icon */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center text-white relative z-10">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Bold Branding */}
      <div className="text-center space-y-2 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
          <span className="text-slate-100">foundr</span>
          <span className="text-indigo-400">Radar</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <span>🇮🇳</span>
          <span>India's Executive Outreach & Founder Intelligence</span>
        </p>
      </div>

      {/* Minimal Progress Bar */}
      <div className="w-48 h-1 bg-[#151722] rounded-full overflow-hidden mt-8 border border-[#232638]">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading caption */}
      <div className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-wider">
        Scanning Ecosystem... {Math.min(progress, 100)}%
      </div>
    </div>
  );
}
