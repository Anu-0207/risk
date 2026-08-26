import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ScanEye,
  Trash2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import { getUser } from '../utils/auth.js';
import scanService from '../services/scanService.js';
import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { getRiskLevelDetails, getSeverityBadge } from '../utils/riskHelpers.js';
import { formatDate, truncate } from '../utils/formatters.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await scanService.getScans();
      setScans(data);
    } catch (err) {
      console.error('Failed to load scans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this risk assessment?')) {
      try {
        await scanService.deleteScan(id);
        setScans((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error('Failed to delete scan:', err);
      }
    }
  };

  // Compute stats strictly from authenticated user's scan data
  const totalScans = scans.length;
  const avgRiskScore = totalScans > 0
    ? Math.round(scans.reduce((acc, s) => acc + s.risk_score, 0) / totalScans)
    : 0;
  const trustIndex = Math.max(0, 100 - avgRiskScore);

  let highCriticalThreatsCount = 0;
  let protectedInputsCount = 0;

  scans.forEach((s) => {
    if (s.risk_level === 'CRITICAL' || s.risk_level === 'HIGH') {
      highCriticalThreatsCount++;
    }
    if (Array.isArray(s.threats)) {
      s.threats.forEach((t) => {
        if (t.severity === 'Critical' || t.severity === 'High') {
          highCriticalThreatsCount++;
        }
      });
    }
    if (s.input) {
      protectedInputsCount++;
    }
  });

  const filteredScans = scans.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.input?.toLowerCase().includes(q) ||
      s.risk_level?.toLowerCase().includes(q) ||
      s.summary?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            ACTIVE RISK TELEMETRY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            WELCOME BACK, {user?.full_name?.toUpperCase() || 'SECURITY ANALYST'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enterprise AI defense telemetry and real-time model risk governance.
          </p>
        </div>

        <Link
          to="/scanner"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="h-4 w-4 text-cyan-200" />
          <span>NEW RISK SCAN</span>
        </Link>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Overall Risk"
          value={`${avgRiskScore}/100`}
          subvalue={totalScans > 0 ? (avgRiskScore > 50 ? 'Elevated Alert' : 'Nominal Health') : 'No data yet'}
          icon={Activity}
          color={avgRiskScore > 50 ? 'rose' : avgRiskScore > 20 ? 'amber' : 'emerald'}
        />

        <StatCard
          title="AI Trust Index"
          value={`${trustIndex}%`}
          subvalue="Reliability Confidence"
          icon={ShieldCheck}
          color="cyan"
        />

        <StatCard
          title="Total Scans"
          value={totalScans}
          subvalue="All Evaluated Payloads"
          icon={ScanEye}
          color="indigo"
        />

        <StatCard
          title="High/Critical Threats"
          value={highCriticalThreatsCount}
          subvalue="Requires Attention"
          icon={ShieldAlert}
          color={highCriticalThreatsCount > 0 ? 'rose' : 'emerald'}
        />

        <StatCard
          title="Protected Inputs"
          value={protectedInputsCount}
          subvalue="Tokens Sanitized"
          icon={Lock}
          color="blue"
        />
      </div>

      {/* Recent Scans Section */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">AUDIT FEED</span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">Recent Risk Assessments</h3>
            <p className="text-xs text-slate-400">Authenticated payload history and threat classifications</p>
          </div>

          {totalScans > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search scans or threats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <div className="h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading scan history...
          </div>
        ) : totalScans === 0 ? (
          <EmptyState
            title="No risk assessments yet."
            description="You haven't scanned any AI prompts, responses, or transactions yet. Run your first scan to generate real-time metrics."
            actionLabel="Run Your First Scan →"
            actionLink="/scanner"
          />
        ) : filteredScans.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No scans matched your search query "{searchQuery}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  <th className="pb-3 px-3">Scan Input Excerpt</th>
                  <th className="pb-3 px-3">Risk Level</th>
                  <th className="pb-3 px-3">Risk Score</th>
                  <th className="pb-3 px-3">Trust Index</th>
                  <th className="pb-3 px-3">Engine</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredScans.map((scan) => {
                  const details = getRiskLevelDetails(scan.risk_level);
                  return (
                    <tr
                      key={scan.id}
                      onClick={() => navigate(`/scan/${scan.id}`)}
                      className="group cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3 max-w-xs font-mono text-slate-200">
                        <span className="font-sans font-medium text-slate-200 block truncate">
                          {truncate(scan.input, 65)}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${details.badgeBg}`}>
                          {scan.risk_level}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-extrabold text-slate-100">
                        {scan.risk_score} <span className="text-slate-500 font-normal text-[11px]">/ 100</span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">
                        {scan.trust_index}%
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                        {scan.analysis_engine?.split(' ')[0] || 'Hybrid'}
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {formatDate(scan.created_at)}
                      </td>

                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/scan/${scan.id}`);
                            }}
                            className="rounded-lg bg-slate-800 px-3 py-1 text-slate-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors font-bold text-[11px] uppercase tracking-wider"
                          >
                            View Result
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, scan.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded hover:bg-rose-500/10"
                            title="Delete scan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
