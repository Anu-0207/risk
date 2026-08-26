import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  Activity,
} from 'lucide-react';
import scanService from '../services/scanService.js';
import analyticsService from '../services/analyticsService.js';
import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatDate } from '../utils/formatters.js';

const SEVERITY_COLORS = {
  Critical: '#f43f5e',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#10b981',
};

const CATEGORY_COLORS = {
  Privacy: '#06b6d4',
  Security: '#6366f1',
  Hallucination: '#a855f7',
  Bias: '#ec4899',
  Compliance: '#3b82f6',
  Fraud: '#f43f5e',
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Aggregating risk telemetry...
      </div>
    );
  }

  if (!data || data.totalScans === 0) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
        <div className="border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            <BarChart3 className="h-3.5 w-3.5" />
            Security Intelligence Metrics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Analytics & Governance
          </h1>
        </div>

        <EmptyState
          title="No analytics data available yet."
          description="Scan AI inputs, payloads, or transactions to generate deep historical risk trends and vulnerability metrics."
          actionLabel="Run Your First Scan →"
          actionLink="/scanner"
        />
      </div>
    );
  }

  // Format Risk Trend
  const trendChartData = (data.riskTrend || []).map((t, idx) => ({
    name: `#${t.id || idx + 1}`,
    score: t.score,
    trust: t.trust,
    date: formatDate(t.date),
  }));

  // Format Category Averages
  const categoryBarData = Object.entries(data.categoryAverages || {}).map(([key, val]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    score: val,
  }));

  // Format Threat Severity Distribution
  const severityPieData = Object.entries(data.threatsBySeverity || {}).map(([name, value]) => ({
    name,
    value,
  }));

  // Format Threat Category Distribution
  const categoryPieData = Object.entries(data.threatsByCategory || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
          <BarChart3 className="h-3.5 w-3.5" />
          Enterprise Telemetry Metrics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Analytics & Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Real-time historical posture, category vulnerability scores, and threat distribution.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Risk Score"
          value={`${data.averageRiskScore}/100`}
          subvalue={data.averageRiskScore > 50 ? 'High Risk Average' : 'Healthy Baseline'}
          icon={Activity}
          color={data.averageRiskScore > 50 ? 'rose' : data.averageRiskScore > 20 ? 'amber' : 'emerald'}
        />

        <StatCard
          title="AI Trust Index"
          value={`${data.aiTrustIndex}%`}
          subvalue="Mean Reliability"
          icon={TrendingUp}
          color="cyan"
        />

        <StatCard
          title="Total Scans"
          value={data.totalScans}
          subvalue="Analyzed Payloads"
          icon={Layers}
          color="indigo"
        />

        <StatCard
          title="Total Threats Logged"
          value={data.totalThreats}
          subvalue="Vulnerability Signatures"
          icon={ShieldAlert}
          color={data.totalThreats > 0 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Main Charts: Trend & Category Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score & Trust Trend */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Risk & Trust Index Trend
              </h3>
              <p className="text-xs text-slate-400">Sequential scan evaluations over time</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" name="Risk Score" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#riskGradient)" />
                <Area type="monotone" dataKey="trust" name="Trust Index" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#trustGradient)" />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Category Risk Baseline
              </h3>
              <p className="text-xs text-slate-400">Mean risk score across all 6 evaluation pillars</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} interval={0} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" name="Average Score" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {categoryBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Threat Distribution Pies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threats by Severity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                Threat Severity Distribution
              </h3>
              <p className="text-xs text-slate-400">Criticality ratio of detected vulnerabilities</p>
            </div>
          </div>

          {severityPieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              No threat signatures flagged yet.
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {severityPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Threats by Category */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-cyan-400" />
                Threat Category Distribution
              </h3>
              <p className="text-xs text-slate-400">Concentration of privacy, injection, or fraud incidents</p>
            </div>
          </div>

          {categoryPieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              No threat categories recorded yet.
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#38bdf8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
