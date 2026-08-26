import React from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp, Lock } from 'lucide-react';

export default function TrustIndexCard({ trustIndex = 100, riskScore = 0 }) {
  const index = Math.max(0, Math.min(100, Math.round(trustIndex)));

  let statusLabel = 'Exceptional Trustworthiness';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let progressColor = 'from-emerald-500 to-cyan-400';

  if (index < 30) {
    statusLabel = 'Critical Risk: Quarantine Immediate';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    progressColor = 'from-rose-600 to-rose-400';
  } else if (index < 50) {
    statusLabel = 'Low Confidence: Verification Mandated';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    progressColor = 'from-amber-600 to-amber-400';
  } else if (index < 80) {
    statusLabel = 'Moderate Trust: Standard Monitoring';
    badgeColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    progressColor = 'from-yellow-500 to-emerald-400';
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"></div>

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" />
            RELIABILITY & GOVERNANCE
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">AI TRUST INDEX</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
          {index}% Reliability
        </span>
      </div>

      <div className="my-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-cyan-400 leading-none">
              {index}
              <span className="text-3xl text-emerald-400 font-bold ml-1">%</span>
            </div>
            <p className="text-xs font-semibold text-slate-300 mt-2 uppercase tracking-wide">{statusLabel}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">Risk Inversion</span>
            <p className="text-sm font-extrabold text-slate-200 font-mono mt-0.5">{100 - index} pt Penalty</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/80">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000 ease-out`}
            style={{ width: `${index}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>Autonomous Policy Compliance</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Lock className="h-4 w-4 text-cyan-400 flex-shrink-0" />
          <span>PII & Token Privacy Gate</span>
        </div>
      </div>
    </div>
  );
}
