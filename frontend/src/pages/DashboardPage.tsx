import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  ArrowRight,
  FileCode2,
  Search,
  Database,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Zap,
  Terminal,
  Trash2,
  Layers,
  Activity,
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchJobSummary, DocumentItem } from '../types';
import { MetricCard } from '../components/MetricCard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [quickTopic, setQuickTopic] = useState('');
  const [jobs, setJobs] = useState<ResearchJobSummary[]>([]);
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exampleTopics = [
    'Autonomous AI Agent Architectures: State Machines, Memory & Tool-Use Protocols',
    'Rust vs Go for High-Throughput Distributed Microservices and Network Proxies',
    'Edge AI Inference: Quantization Benchmarks on WebGPU and WebAssembly (WASM)',
    'Quantum Computing vs Classical HPC: Error Correction and Hybrid Algorithms',
  ];

  const loadData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const [fetchedJobs, fetchedDocs] = await Promise.all([
        api.listResearchJobs(),
        api.listDocuments(),
      ]);
      setJobs(fetchedJobs);
      setDocs(fetchedDocs);
    } catch (err: any) {
      setError(err.message || 'Failed to load research telemetry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTopic.trim() || submitting) return;

    try {
      setSubmitting(true);
      const created = await api.createResearchJob({
        topic: quickTopic.trim(),
        depth: 'standard',
        focus: 'technical',
        max_sources: 8,
      });
      navigate(`/workspace/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Could not launch research swarm.');
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this research job and its generated evidence?')) return;

    try {
      await api.deleteResearchJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      alert(`Failed to delete job: ${err.message}`);
    }
  };

  const totalSourcesCount = jobs.reduce((acc, j) => acc + (j.source_count || 0), 0);
  const completedReportsCount = jobs.filter((j) => j.has_report).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="card-clean p-6 space-y-4 border-[#E8E1D7] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F6F1EB] border border-[#E8E1D7] text-[11px] font-mono text-[#785135] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#785135] animate-pulse" />
              <span>AGENT SWARM CONTROL CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] tracking-tight">
              Research Telemetry & Control
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5248]">
              Coordinated LangGraph multi-agent execution with grounded citation verification
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="btn-secondary text-xs flex items-center gap-1.5"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#785135]' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <Link to="/research/new" className="btn-primary text-xs shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>Configure Advanced Job</span>
            </Link>
          </div>
        </div>

        {/* 3 Core Agent Team Pipeline status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E8E1D7]">
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D7] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1A1612]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#785135]" />
                <span>Node 1: Planner</span>
              </span>
              <span className="text-[10px] text-[#785135] bg-[#F6F1EB] px-1.5 py-0.2 rounded border border-[#E8E1D7]">DECOMPOSE</span>
            </div>
            <p className="text-[11px] text-[#5C5248]">Breaks inquiries into structured technical subqueries</p>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D7] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1A1612]">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#785135]" />
                <span>Node 2: Researcher</span>
              </span>
              <span className="text-[10px] text-[#785135] bg-[#F6F1EB] px-1.5 py-0.2 rounded border border-[#E8E1D7]">RETRIEVE</span>
            </div>
            <p className="text-[11px] text-[#5C5248]">Parallel crawl across live web & ChromaDB vector store</p>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D7] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1A1612]">
              <span className="flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-[#2E6B4E]" />
                <span>Node 3: Writer</span>
              </span>
              <span className="text-[10px] text-[#2E6B4E] bg-[#EAF3ED] px-1.5 py-0.2 rounded border border-[#C5DEC8]">COMPILE</span>
            </div>
            <p className="text-[11px] text-[#5C5248]">Synthesizes evidence and drafts verified markdown reports</p>
          </div>
        </div>
      </div>

      {/* Metrics Row (Interactive) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Jobs"
          value={jobs.length}
          subtext="Click to view history"
          icon={Cpu}
          onClick={() => navigate('/history')}
        />
        <MetricCard
          label="Evidence Sources"
          value={totalSourcesCount}
          subtext="Indexed & verified snippets"
          icon={Search}
          onClick={() => navigate('/history')}
        />
        <MetricCard
          label="Compiled Reports"
          value={completedReportsCount}
          subtext="Complete verified publications"
          icon={FileCode2}
          onClick={() => navigate('/history?status=completed')}
        />
        <MetricCard
          label="Vector Passages"
          value={docs.length}
          subtext="Click to manage ChromaDB"
          icon={Database}
          onClick={() => navigate('/documents')}
        />
      </div>

      {/* Prominent Quick-Input Card */}
      <div className="card-clean p-6 space-y-4 border-[#E8E1D7] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#785135]" />
            <h2 className="text-sm font-bold text-[#1A1612] font-mono uppercase tracking-wider">
              Launch Immediate Investigation
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#5C5248] hidden sm:inline">
            Fast standard mode (8 verified sources)
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickTopic}
              onChange={(e) => setQuickTopic(e.target.value)}
              placeholder="Enter technical inquiry, algorithmic comparison, or research topic..."
              className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl px-4 py-3 text-sm text-[#1A1612] placeholder-[#8C7F73] focus:outline-none transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!quickTopic.trim() || submitting}
            className="btn-primary px-6 py-3 text-sm shrink-0"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Swarm...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Launch Swarm</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Example Topics */}
        <div className="pt-2">
          <span className="text-xs font-mono font-medium text-[#5C5248] block mb-2">
            Suggested benchmark prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setQuickTopic(topic)}
                className="text-xs text-left bg-[#FAF8F5] hover:bg-[#F6F1EB] text-[#42382F] hover:text-[#1A1612] border border-[#E8E1D7] hover:border-[#785135]/40 px-3 py-1.5 rounded-lg transition-colors font-mono"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F7D7D6] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#A83A35] font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#A83A35]" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadData()}
            className="btn-secondary text-xs px-3 py-1.5 self-start sm:self-auto shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Recent Research Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#785135]" />
            <h2 className="text-base font-bold text-[#1A1612] font-mono uppercase tracking-wider">
              Recent Research Pipelines
            </h2>
          </div>
          <Link to="/history" className="text-xs font-mono text-[#785135] hover:text-[#623F27] transition-colors font-medium">
            View All History ({jobs.length}) →
          </Link>
        </div>

        {loading ? (
          <div className="card-clean p-12 text-center text-[#5C5248] space-y-2 bg-white border-[#E8E1D7]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#785135]" />
            <p className="text-sm font-mono">Querying database records...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-clean p-12 text-center space-y-3 bg-white border-[#E8E1D7]">
            <Cpu className="w-10 h-10 mx-auto text-[#C7A788]" />
            <h3 className="font-bold text-sm text-[#1A1612] font-mono">No research jobs launched yet</h3>
            <p className="text-xs text-[#5C5248] max-w-sm mx-auto">
              Start your first multi-agent investigation above or launch an advanced job with custom depth and vector RAG.
            </p>
            <div className="pt-2">
              <Link to="/research/new" className="btn-primary text-xs inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Launch First Investigation</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="card-clean card-clean-hover p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#E8E1D7] bg-white"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap font-mono">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        job.status === 'completed'
                          ? 'bg-[#EAF3ED] text-[#2E6B4E] border-[#C5DEC8]'
                          : job.status === 'running'
                          ? 'bg-[#F6F1EB] text-[#785135] border-[#E8E1D7]'
                          : 'bg-[#FAF8F5] text-[#5C5248] border-[#E8E1D7]'
                      }`}
                    >
                      {job.status === 'running' && '● '}
                      {job.status}
                    </span>
                    <span className="text-xs text-[#5C5248]">
                      Depth: {job.depth} • Focus: {job.focus}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1A1612] hover:text-[#785135] transition-colors truncate">
                    <Link to={job.has_report ? `/report/${job.id}` : `/workspace/${job.id}`}>
                      {job.topic}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#5C5248]">
                    <span>Stage: {job.current_stage || 'Preparing'}</span>
                    <span>•</span>
                    <span>{job.source_count || 0} sources</span>
                    <span>•</span>
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {job.has_report ? (
                    <Link to={`/report/${job.id}`} className="btn-secondary text-xs">
                      <FileCode2 className="w-3.5 h-3.5 text-[#785135]" />
                      <span>View Report</span>
                    </Link>
                  ) : (
                    <Link to={`/workspace/${job.id}`} className="btn-primary text-xs">
                      <span>Live Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteJob(job.id, e)}
                    className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E1D7] text-[#8C7F73] hover:text-[#A83A35] hover:border-[#F7D7D6] transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
