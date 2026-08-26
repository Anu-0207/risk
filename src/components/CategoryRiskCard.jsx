import React from 'react';
import {
  Lock,
  Shield,
  HelpCircle,
  Scale,
  FileCheck,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

const CATEGORY_CONFIG = {
  privacy: {
    label: 'Privacy Risk',
    weight: '20% Weight',
    icon: Lock,
    desc: 'PII, phone numbers, emails, government IDs, and confidential tokens.',
    color: 'text-cyan-400',
    barColor: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
  },
  security: {
    label: 'Security & Injection',
    weight: '25% Weight',
    icon: Shield,
    desc: 'Prompt injection, jailbreak heuristics, SQLi, malware, and exploits.',
    color: 'text-indigo-400',
    barColor: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
  },
  hallucination: {
    label: 'Hallucination & Drift',
    weight: '15% Weight',
    icon: HelpCircle,
    desc: 'Absolutist assertions, fabricated facts, and unverified data claims.',
    color: 'text-purple-400',
    barColor: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
  },
  bias: {
    label: 'Bias & Fairness',
    weight: '10% Weight',
    icon: Scale,
    desc: 'Demographic bias, toxic generalizations, and stereotyping signals.',
    color: 'text-violet-400',
    barColor: 'from-violet-500 to-fuchsia-500',
    bgColor: 'bg-violet-500/10 border-violet-500/20',
  },
  compliance: {
    label: 'Compliance & Safety',
    weight: '15% Weight',
    icon: FileCheck,
    desc: 'Alignment with AI governance frameworks, GDPR, HIPAA, and safety policies.',
    color: 'text-blue-400',
    barColor: 'from-blue-500 to-sky-500',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  fraud: {
    label: 'Fraud & Financial Risk',
    weight: '15% Weight',
    icon: CreditCard,
    desc: 'Stolen credentials, illicit transaction patterns, and ATO indicators.',
    color: 'text-rose-400',
    barColor: 'from-rose-500 to-amber-500',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
  },
};

export default function CategoryRiskCard({ categoryKey, score = 0 }) {
  const config = CATEGORY_CONFIG[categoryKey.toLowerCase()] || {
    label: categoryKey,
    weight: 'Category',
    icon: AlertTriangle,
    desc: 'Evaluated category risk score.',
    color: 'text-slate-400',
    barColor: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-slate-800/40 border-slate-700/40',
  };

  const Icon = config.icon;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  let statusBadge = 'Low';
  let statusClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (clampedScore > 75) {
    statusBadge = 'Critical';
    statusClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (clampedScore > 50) {
    statusBadge = 'High';
    statusClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (clampedScore > 20) {
    statusBadge = 'Moderate';
    statusClass = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg backdrop-blur-sm flex flex-col justify-between hover:border-slate-700 transition-all group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${config.bgColor}`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">{config.label}</h4>
              <span className="text-[10px] font-mono text-slate-400">{config.weight}</span>
            </div>
          </div>

          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
            {statusBadge}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {config.desc}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">RISK SCORE</span>
          <span className="font-mono text-base font-extrabold text-slate-100">{clampedScore}<span className="text-[11px] text-slate-500 font-normal">/100</span></span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${config.barColor} transition-all duration-700`}
            style={{ width: `${clampedScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
