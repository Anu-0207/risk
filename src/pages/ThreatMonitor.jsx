import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import scanService from '../services/scanService.js';
import { getSeverityBadge } from '../utils/riskHelpers.js';
import { formatDate } from '../utils/formatters.js';
import EmptyState from '../components/EmptyState.jsx';

export default function ThreatMonitor() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchThreats = async () => {
    try {
      setLoading(true);
      const data = await scanService.getScans();
      setScans(data);
    } catch (err) {
      console.error('Failed to load threats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const handleStatusChange = async (scanId, threatId, newStatus) => {
    try {
      const updatedScan = await scanService.updateThreatStatus(scanId, threatId, newStatus);
      setScans((prev) =>
        prev.map((s) => (s.id === scanId ? updatedScan : s))
      );
    } catch (err) {
      console.error('Failed to update threat status:', err);
    }
  };

  // Flatten all threats from authenticated user's scans
  const allThreats = [];
  scans.forEach((s) => {
    if (Array.isArray(s.threats)) {
      s.threats.forEach((t) => {
        allThreats.push({
          ...t,
          scanId: s.id,
          scanDate: s.created_at,
          inputSnippet: s.input,
        });
      });
    }
  });

  // Apply filters
  const filteredThreats = allThreats.filter((item) => {
    if (severityFilter !== 'ALL' && item.severity?.toUpperCase() !== severityFilter) {
      return false;
    }
    if (categoryFilter !== 'ALL' && item.category?.toUpperCase() !== categoryFilter) {
      return false;
    }
    if (statusFilter !== 'ALL' && (item.status || 'Open')?.toUpperCase() !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.threat?.toLowerCase().includes(q) ||
        item.evidence?.toLowerCase().includes(q) ||
        item.explanation?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            Live Threat Stream
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Threat Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Active security findings, injection attempts, and privacy flags recorded across your assessments.
          </p>
        </div>

        <Link
          to="/scanner"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Scan Payload</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search threat evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium / Moderate</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="PRIVACY">Privacy</option>
              <option value="SECURITY">Security</option>
              <option value="HALLUCINATION">Hallucination</option>
              <option value="BIAS">Bias</option>
              <option value="COMPLIANCE">Compliance</option>
              <option value="FRAUD">Fraud</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <span>
            Showing <strong className="text-slate-200">{filteredThreats.length}</strong> of{' '}
            <strong className="text-slate-200">{allThreats.length}</strong> total threats
          </span>
          {(searchQuery || severityFilter !== 'ALL' || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSeverityFilter('ALL');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Threats Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            <div className="h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading threat stream...
          </div>
        ) : allThreats.length === 0 ? (
          <EmptyState
            title="Zero active threat signals detected."
            description="Run scans through the Risk Scanner to inspect inputs and identify potential cybersecurity, injection, or privacy vulnerabilities."
            actionLabel="Start a Scan →"
            actionLink="/scanner"
          />
        ) : filteredThreats.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No threats match the current filter selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3 px-3">Time</th>
                  <th className="pb-3 px-3">Threat & Evidence</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Severity</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredThreats.map((threat, idx) => (
                  <tr key={threat.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {formatDate(threat.scanDate)}
                    </td>

                    <td className="py-4 px-3 max-w-sm">
                      <div className="font-bold text-slate-100">{threat.threat}</div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {threat.explanation}
                      </div>
                      {threat.evidence && (
                        <div className="mt-1.5 font-mono text-[10px] text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/40 truncate">
                          "{threat.evidence}"
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        {threat.category || 'Security'}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getSeverityBadge(threat.severity)}`}>
                        {threat.severity}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <select
                        value={threat.status || 'Open'}
                        onChange={(e) => handleStatusChange(threat.scanId, threat.id, e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Open">Open</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td className="py-4 px-3 text-right whitespace-nowrap">
                      <Link
                        to={`/scan/${threat.scanId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        <span>View Scan</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
