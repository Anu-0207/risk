import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function EmptyState({
  title = 'No risk assessments yet.',
  description = 'Run your first AI prompt, response, or payload scan to view comprehensive safety analytics and threat metrics.',
  actionLabel = 'Run Your First Scan →',
  actionLink = '/scanner',
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-10 text-center max-w-xl mx-auto my-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <ShieldCheck className="h-7 w-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {actionLink && (
        <div className="mt-6">
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
          >
            <span>{actionLabel}</span>
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          </Link>
        </div>
      )}
    </div>
  );
}
