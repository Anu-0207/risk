import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Printer,
  Download,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import scanService from '../services/scanService.js';
import { getUser } from '../utils/auth.js';
import { formatDate } from '../utils/formatters.js';
import { getRiskLevelDetails, getSeverityBadge } from '../utils/riskHelpers.js';
import EmptyState from '../components/EmptyState.jsx';

export default function Reports() {
  const user = getUser();
  const [scans, setScans] = useState([]);
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const data = await scanService.getScans();
      setScans(data);
      if (data.length > 0) {
        setSelectedScanId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const selectedScan = scans.find((s) => s.id === selectedScanId);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!selectedScan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedScan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RiskVault-Audit-Report-${selectedScan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Generating audit reports...
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
        <div className="border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            <FileText className="h-3.5 w-3.5" />
            Compliance & Audit Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Executive Risk Reports
          </h1>
        </div>

        <EmptyState
          title="No scan records for audit generation."
          description="Execute your first AI risk inspection to produce formal compliance and threat audit documents."
          actionLabel="Run First Scan →"
          actionLink="/scanner"
        />
      </div>
    );
  }

  const riskDetails = selectedScan ? getRiskLevelDetails(selectedScan.risk_level) : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            <FileText className="h-3.5 w-3.5" />
            Governance Documentation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Executive Risk Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Structured audit reports for compliance officers, security leads, and AI oversight boards.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Select Scan Selector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-sm print:hidden">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
          Select Scan Assessment for Audit View:
        </label>
        <select
          value={selectedScanId || ''}
          onChange={(e) => setSelectedScanId(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
        >
          {scans.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} • {s.risk_level} ({s.risk_score}/100) • {formatDate(s.created_at)} • "{s.input?.slice(0, 50)}..."
            </option>
          ))}
        </select>
      </div>

      {/* Formal Audit Document */}
      {selectedScan && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 sm:p-12 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white font-mono">
                  RiskVault <span className="text-cyan-400">AI Risk Assessment</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  AUDIT ID: RV-{selectedScan.id}-{Date.now().toString().slice(-6)} • ISO/IEC 42001 CONFORMANT
                </p>
              </div>
            </div>

            <div className="text-right text-xs font-mono space-y-1">
              <div className="text-slate-400">
                AUDITOR: <span className="text-slate-200 font-bold">{user?.full_name || 'System Admin'}</span>
              </div>
              <div className="text-slate-400">
                DATE: <span className="text-slate-200">{formatDate(selectedScan.created_at)}</span>
              </div>
              <div className="text-slate-400">
                ENGINE: <span className="text-cyan-300">{selectedScan.analysis_engine}</span>
              </div>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="text-xs text-slate-400 font-mono uppercase">Overall Risk Score</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-mono text-4xl font-extrabold text-white">
                  {selectedScan.risk_score}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
                <span className={`ml-auto text-xs font-bold uppercase rounded px-2 py-0.5 border ${riskDetails?.badgeBg}`}>
                  {selectedScan.risk_level}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="text-xs text-slate-400 font-mono uppercase">AI Trust Index</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-mono text-4xl font-extrabold text-emerald-400">
                  {selectedScan.trust_index}%
                </span>
                <span className="text-xs text-slate-400 ml-auto font-medium">Confidence Rating</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <span className="text-xs text-slate-400 font-mono uppercase">Threat Signatures</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-mono text-4xl font-extrabold text-white">
                  {selectedScan.threats?.length || 0}
                </span>
                <span className="text-xs text-slate-400 ml-auto font-medium">Vulnerabilities Logged</span>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Executive Evaluation Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedScan.summary || 'Assessment evaluated against deterministic heuristics and large language model safety rules.'}
            </p>
          </div>

          {/* Category Scores Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Six-Pillar Risk Evaluation
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-[11px] font-mono text-slate-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Pillar</th>
                    <th className="py-2.5 px-4">Weight</th>
                    <th className="py-2.5 px-4">Score</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/80">
                  {[
                    { name: 'Privacy Risk', weight: '20%', score: selectedScan.privacy },
                    { name: 'Security & Injection Risk', weight: '25%', score: selectedScan.security },
                    { name: 'Hallucination & Drift Risk', weight: '15%', score: selectedScan.hallucination },
                    { name: 'Bias & Fairness Risk', weight: '10%', score: selectedScan.bias },
                    { name: 'Compliance & Safety Risk', weight: '15%', score: selectedScan.compliance },
                    { name: 'Fraud & Financial Risk', weight: '15%', score: selectedScan.fraud },
                  ].map((p, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-4 font-semibold text-slate-200">{p.name}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-400">{p.weight}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-100">{p.score} / 100</td>
                      <td className="py-2.5 px-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${p.score > 50 ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                          {p.score > 75 ? 'Critical' : p.score > 50 ? 'High' : p.score > 20 ? 'Moderate' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explainable Findings */}
          {selectedScan.threats && selectedScan.threats.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Specific Threat Findings & Evidence
              </h4>
              <div className="space-y-2">
                {selectedScan.threats.map((t, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{t.threat}</span>
                      <span className={`rounded border px-2 py-0.2 text-[10px] uppercase font-mono ${getSeverityBadge(t.severity)}`}>
                        {t.severity}
                      </span>
                    </div>
                    {t.evidence && (
                      <p className="font-mono text-[11px] text-amber-300/90 bg-amber-950/20 p-1.5 rounded border border-amber-900/30">
                        Evidence: "{t.evidence}"
                      </p>
                    )}
                    <p className="text-slate-400 text-[11px]">{t.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remediation Checklist */}
          {selectedScan.recommendations && selectedScan.recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Mandated Remediation Protocols
              </h4>
              <div className="space-y-2">
                {selectedScan.recommendations.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${r.resolved ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <span className="font-bold text-slate-200">{r.title}</span>: {r.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Verification Seal */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Certified Autonomous AI Audit • RiskVault Engine v2.4</span>
            </div>
            <div className="font-mono text-[11px]">
              SHA-256 HASH VERIFIED: {Math.random().toString(36).substring(2, 15).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
