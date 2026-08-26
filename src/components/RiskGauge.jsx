import React, { useEffect, useState } from 'react';
import { getRiskLevelDetails } from '../utils/riskHelpers.js';

export default function RiskGauge({ score = 0, level = 'LOW', size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const details = getRiskLevelDetails(level);

  useEffect(() => {
    let current = 0;
    const duration = 900;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = normalizedScore / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= normalizedScore) {
        setAnimatedScore(normalizedScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [normalizedScore]);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer Glow Background */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30 transition-all duration-700"
          style={{ backgroundColor: details.ringColor }}
        />

        <svg className="relative transform -rotate-90" width={size} height={size}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={details.ringColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className="text-5xl font-extrabold tracking-tighter leading-none transition-colors duration-500"
            style={{ color: details.ringColor }}
          >
            {animatedScore}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
            RISK INDEX
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest border shadow-lg ${details.badgeBg}`}
        >
          <span
            className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: details.ringColor }}
          />
          {level} RISK
        </span>
      </div>
    </div>
  );
}
