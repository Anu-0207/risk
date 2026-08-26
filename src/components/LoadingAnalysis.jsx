import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, CheckCircle2, Loader2, Cpu } from 'lucide-react';

const ANALYSIS_STEPS = [
  { label: 'Validating input...', delay: 350 },
  { label: 'Running security checks...', delay: 650 },
  { label: 'Analyzing AI risk...', delay: 950 },
  { label: 'Calculating risk score...', delay: 650 },
  { label: 'Generating recommendations...', delay: 550 },
  { label: 'Saving assessment...', delay: 400 },
];

export default function LoadingAnalysis() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let timeout;
    if (currentStepIndex < ANALYSIS_STEPS.length - 1) {
      timeout = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, ANALYSIS_STEPS[currentStepIndex].delay);
    }
    return () => clearTimeout(timeout);
  }, [currentStepIndex]);

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-950/90 p-8 text-center shadow-2xl backdrop-blur-xl max-w-lg mx-auto relative overflow-hidden">
      {/* Glow animations */}
      <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-600/30">
        <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
          <Cpu className="h-9 w-9 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">RiskVault Deep Risk Engine</h3>
      <p className="text-xs text-slate-400 mt-1 mb-6">
        Inspecting token vectors, heuristic rules, PII formats, and contextual model risks.
      </p>

      {/* Step by step checklist */}
      <div className="space-y-2.5 text-left border border-slate-800/80 rounded-xl bg-slate-900/60 p-4">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                isDone
                  ? 'text-emerald-400 font-medium'
                  : isCurrent
                  ? 'text-cyan-300 font-bold translate-x-1'
                  : 'text-slate-500 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 text-cyan-400 animate-spin flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-700 flex-shrink-0" />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
