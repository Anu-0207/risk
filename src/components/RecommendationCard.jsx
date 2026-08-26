import React from 'react';
import { CheckCircle2, Circle, Sparkles, AlertCircle } from 'lucide-react';
import { getSeverityBadge } from '../utils/riskHelpers.js';

export default function RecommendationCard({
  recommendations = [],
  onToggleResolve,
  scanId,
}) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center">
        <p className="text-xs text-slate-400">No specific mitigation actions required for this scan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, idx) => {
        const isResolved = Boolean(rec.resolved);
        return (
          <div
            key={rec.id || idx}
            className={`rounded-xl border p-4 transition-all ${
              isResolved
                ? 'border-slate-800/60 bg-slate-950/40 opacity-75'
                : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleResolve && onToggleResolve(scanId, rec.id, !isResolved)}
                  className={`mt-0.5 flex-shrink-0 transition-colors ${
                    isResolved ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={isResolved ? 'Mark as unresolved' : 'Mark as resolved'}
                >
                  {isResolved ? (
                    <CheckCircle2 className="h-5 w-5 fill-emerald-500/20" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-extrabold tracking-tight ${
                        isResolved ? 'text-slate-500 line-through' : 'text-slate-100'
                      }`}
                    >
                      {rec.title}
                    </h4>
                    {rec.priority && (
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${getSeverityBadge(
                          rec.priority
                        )}`}
                      >
                        {rec.priority} Priority
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{rec.description}</p>
                </div>
              </div>

              <button
                onClick={() => onToggleResolve && onToggleResolve(scanId, rec.id, !isResolved)}
                className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition-all font-mono ${
                  isResolved
                    ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30'
                }`}
              >
                {isResolved ? 'Resolved' : 'Mark Resolved'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
