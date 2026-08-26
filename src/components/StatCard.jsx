import React from 'react';

export default function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  color = 'blue',
}) {
  const colorMap = {
    blue: {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      glow: 'hover:shadow-blue-500/10',
    },
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      glow: 'hover:shadow-cyan-500/10',
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      glow: 'hover:shadow-emerald-500/10',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      glow: 'hover:shadow-amber-500/10',
    },
    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      glow: 'hover:shadow-rose-500/10',
    },
    indigo: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      glow: 'hover:shadow-indigo-500/10',
    },
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900/90 ${currentTheme.glow} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          {title}
        </span>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${currentTheme.bg}`}>
            <Icon className={`h-4.5 w-4.5 ${currentTheme.text}`} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
            {value}
          </span>
          {trend && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              {trend}
            </span>
          )}
        </div>
        {subvalue && (
          <p className="text-[11px] font-semibold text-slate-400 mt-1.5 uppercase tracking-wide">
            {subvalue}
          </p>
        )}
      </div>
    </div>
  );
}
