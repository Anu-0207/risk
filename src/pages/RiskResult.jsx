import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Trash2,
  Lock,
  Cpu,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import scanService from '../services/scanService.js';
import RiskScoreCard from '../components/RiskScoreCard.jsx';
import TrustIndexCard from '../components/TrustIndexCard.jsx';
import CategoryRiskCard from '../components/CategoryRiskCard.jsx';
import ThreatTable from '../components/ThreatTable.jsx';
import RecommendationCard from '../components/RecommendationCard.jsx';
import { formatDate } from '../utils/formatters.js';

export default function RiskResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchScan = async () => {
    try {
      setLoading(true);
      const data = await scanService.getScanById(id);
      setScan(data);
    } catch (err) {
      console.error('Failed to retrieve scan:', err);
      setError('Risk assessment not found or unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScan();
  }, [id]);

  const handleToggleResolve = async (scanId, recId, resolved) => {
    try {
      const updated = await scanService.updateRecommendation(scanId, recId, resolved);
      setScan(updated);
    } catch (err) {
      console.error('Failed to update recommendation:', err);
    }
  };

  const handleThreatStatus = async (scanId, threatId, status) => {
    try {
      const updated = await scanService.updateThreatStatus(scanId, threatId, status);
      setScan(updated);
    } catch (err) {
      console.error('Failed to update threat status:', err);
    }
  };

  const handleExportJSON = () => {
    if (!scan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RiskVault-Assessment-${scan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading risk assessment...
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Assessment Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This scan could not be retrieved.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span>SCAN #{scan.id}</span>
              <span>•</span>
              <span className="text-slate-400">{formatDate(scan.created_at)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Risk Assessment Report
            </h1>
          </div>
        </div>

        {/* Export & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>

          <Link
            to="/scanner"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Scan Another</span>
          </Link>
        </div>
      </div>

      {/* Top 2 Primary Cards: Risk Score & Trust Index */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskScoreCard
          score={scan.risk_score}
          level={scan.risk_level}
          summary={scan.summary}
          engine={scan.analysis_engine}
        />

        <TrustIndexCard
          trustIndex={scan.trust_index}
          riskScore={scan.risk_score}
        />
      </div>

      {/* 6 Category Risk Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">Category Breakdown</h3>
          <span className="text-xs font-mono text-slate-400">Risk Weight Standard</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoryRiskCard categoryKey="privacy" score={scan.privacy} />
          <CategoryRiskCard categoryKey="security" score={scan.security} />
          <CategoryRiskCard categoryKey="hallucination" score={scan.hallucination} />
          <CategoryRiskCard categoryKey="bias" score={scan.bias} />
          <CategoryRiskCard categoryKey="compliance" score={scan.compliance} />
          <CategoryRiskCard categoryKey="fraud" score={scan.fraud} />
        </div>
      </div>

      {/* Explainable Threats Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              Why RiskVault Flagged This
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Explainable token evidence and real-world security implications
            </p>
          </div>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
            {scan.threats?.length || 0} Flagged
          </span>
        </div>

        <ThreatTable
          threats={scan.threats}
          scanId={scan.id}
          onStatusChange={handleThreatStatus}
        />
      </div>

      {/* Actionable Recommendations Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              What Should You Do?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Actionable remediation protocols generated based on detected vulnerability vectors
            </p>
          </div>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-300">
            {scan.recommendations?.length || 0} Action Items
          </span>
        </div>

        <RecommendationCard
          recommendations={scan.recommendations}
          scanId={scan.id}
          onToggleResolve={handleToggleResolve}
        />
      </div>

      {/* Raw Payload Inspection */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-slate-400" />
          Submitted Input Payload
        </h3>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
          {scan.input}
        </div>
      </div>
    </div>
  );
}
