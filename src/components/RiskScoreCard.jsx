import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import RiskGauge from './RiskGauge.jsx';

export default function RiskScoreCard({ score = 0, level = 'LOW', summary = '', engine = '' }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"></div>

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 font-mono">
            <Activity className="h-3.5 w-3.5" />
            COMPOSITE THREAT METRIC
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">OVERALL RISK ASSESSMENT</h3>
        </div>
        {engine && (
          <span className="hidden sm:inline-block rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
            {engine}
          </span>
        )}
      </div>

      <div className="my-4 flex flex-col sm:flex-row items-center justify-around gap-6">
        <RiskGauge score={score} level={level} size={170} />

        <div className="flex-1 space-y-3">
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              EXECUTIVE SUMMARY
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {summary || 'Assessment calculated through local deterministic heuristic rules and contextual AI vulnerability models.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-mono tracking-wider">Weighting Model</span>
              <span className="font-extrabold text-slate-200 text-xs mt-0.5 block">ISO/IEC 42001 + NIST AI</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-mono tracking-wider">Verification Status</span>
              <span className="font-extrabold text-emerald-400 text-xs mt-0.5 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Audited & Logged
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
