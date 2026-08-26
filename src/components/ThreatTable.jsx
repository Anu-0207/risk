import React, { useState } from 'react';
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Quote,
  HelpCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { getSeverityBadge } from '../utils/riskHelpers.js';

export default function ThreatTable({ threats = [], onStatusChange, scanId }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!threats || threats.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
          <CheckCircle className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-slate-200">No Critical Threats Flagged</p>
        <p className="text-xs text-slate-400 mt-1">
          This payload passed all deterministic heuristics and AI security checks without high-risk signatures.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {threats.map((t, idx) => {
        const isExpanded = expandedId === t.id || expandedId === idx;
        const currentStatus = t.status || 'Open';

        return (
          <div
            key={t.id || idx}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-slate-700 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 tracking-tight">{t.threat}</h4>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${getSeverityBadge(t.severity)}`}>
                      {t.severity}
                    </span>
                    <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400">
                      {t.category || 'Security'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {t.explanation}
                  </p>
                </div>
              </div>

              {/* Status & Expand controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                {onStatusChange && (
                  <select
                    value={currentStatus}
                    onChange={(e) => onStatusChange(scanId, t.id, e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-cyan-500 font-mono uppercase"
                  >
                    <option value="Open">Open</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                )}

                <button
                  onClick={() => setExpandedId(isExpanded ? null : t.id || idx)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  <span>{isExpanded ? 'Hide Details' : 'Why Flagged'}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              </div>
            </div>

            {/* Explainable Details Accordion */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
                {/* Evidence Section */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/90 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1.5 font-mono">
                    <Quote className="h-3.5 w-3.5" />
                    DETECTED EVIDENCE IN INPUT
                  </div>
                  <div className="font-mono text-xs text-amber-200/95 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/40 break-all leading-relaxed">
                    {t.evidence || 'Pattern identified during payload token inspection.'}
                  </div>
                </div>

                {/* Explanation Section */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1.5 font-mono">
                    <HelpCircle className="h-3.5 w-3.5" />
                    WHY RISKVAULT FLAGGED THIS
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
