export function getRiskLevelDetails(level) {
  const normalized = String(level || 'LOW').toUpperCase();
  switch (normalized) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL',
        colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        ringColor: '#f43f5e',
        glowClass: 'shadow-[0_0_20px_rgba(244,63,94,0.35)]',
      };
    case 'HIGH':
      return {
        label: 'HIGH',
        colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        ringColor: '#f59e0b',
        glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      };
    case 'MODERATE':
      return {
        label: 'MODERATE',
        colorClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        ringColor: '#eab308',
        glowClass: 'shadow-[0_0_15px_rgba(234,179,8,0.25)]',
      };
    case 'LOW':
    default:
      return {
        label: 'LOW',
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        ringColor: '#10b981',
        glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      };
  }
}

export function getSeverityBadge(severity) {
  const s = String(severity || 'Medium').toLowerCase();
  if (s === 'critical') {
    return 'bg-rose-950/70 text-rose-300 border-rose-700/60 font-semibold';
  }
  if (s === 'high') {
    return 'bg-amber-950/70 text-amber-300 border-amber-700/60 font-semibold';
  }
  if (s === 'medium' || s === 'moderate') {
    return 'bg-yellow-950/70 text-yellow-300 border-yellow-700/60';
  }
  return 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60';
}

export function getCategoryIconColor(category) {
  const c = String(category || '').toLowerCase();
  if (c.includes('privacy')) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  if (c.includes('security')) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  if (c.includes('hallucination')) return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
  if (c.includes('bias')) return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
  if (c.includes('compliance')) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  if (c.includes('fraud')) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
}
