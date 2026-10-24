import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  FileCode2,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Share2,
  Check,
  Download,
  Copy,
  Terminal,
  Layers,
  Database,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchJobDetail, WorkflowEvent } from '../types';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { AgentTimeline } from '../components/AgentTimeline';
import { SourceCard } from '../components/SourceCard';
import { FindingCard } from '../components/FindingCard';

export const WorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<ResearchJobDetail | null>(null);
  const [events, setEvents] = useState<WorkflowEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFindings, setCopiedFindings] = useState(false);
  const [findingFilter, setFindingFilter] = useState<'all' | 'verified' | 'disputed'>('all');

  const fetchJob = async () => {
    if (!id) return;
    try {
      const data = await api.getResearchJob(id);
      setJob(data);
      if (data.events) {
        setEvents(data.events);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve research job.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // Periodic polling while running/pending so sources and findings update live
  useEffect(() => {
    if (!id || !job) return;
    if (job.status === 'completed' || job.status === 'failed') return;

    const interval = setInterval(() => {
      fetchJob();
    }, 2500);

    return () => clearInterval(interval);
  }, [id, job?.status]);

  // Setup Server-Sent Events (SSE) connection
  useEffect(() => {
    if (!id) return;

    const eventSourceUrl = api.getEventSourceUrl(id);
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (e) => {
      try {
        const parsedEvent: WorkflowEvent = JSON.parse(e.data);
        setEvents((prev) => {
          if (prev.some((item) => item.id === parsedEvent.id)) {
            return prev;
          }
          return [...prev, parsedEvent];
        });

        setJob((prev) => {
          if (!prev) return null;
          let newProgress = prev.progress;
          if (parsedEvent.stage === 'Planning') newProgress = 25;
          if (parsedEvent.stage === 'Research Gathering') newProgress = 50;
          if (parsedEvent.stage === 'Analysis') newProgress = 70;
          if (parsedEvent.stage === 'Verification') newProgress = 85;
          if (parsedEvent.stage === 'Completed') newProgress = 100;

          return {
            ...prev,
            current_stage: parsedEvent.stage,
            progress: Math.max(prev.progress, newProgress),
          };
        });
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.addEventListener('done', () => {
      fetchJob();
      eventSource.close();
    });

    eventSource.onerror = () => {
      eventSource.close();
      setTimeout(fetchJob, 3000);
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  const handleRetry = async () => {
    if (!id || retrying) return;
    setRetrying(true);
    try {
      await api.retryResearchJob(id);
      fetchJob();
    } catch (err: any) {
      setError(err.message || 'Retry failed.');
    } finally {
      setRetrying(false);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportEventsJson = () => {
    if (!job) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ job, events }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `telemetry_job_${job.id.slice(0, 8)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyFindings = () => {
    if (!job || !job.findings) return;
    const text = job.findings
      .map(
        (f, idx) =>
          `### Finding ${idx + 1}: ${f.subquestion}\n- **Claim**: ${f.claim}\n- **Confidence**: ${Math.round(
            f.confidence * 100
          )}%\n- **Evidence**: "${f.evidence_excerpt || 'N/A'}"\n`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedFindings(true);
    setTimeout(() => setCopiedFindings(false), 2000);
  };

  if (loading) {
    return (
      <div className="card-clean p-16 text-center space-y-3 bg-white">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#785135]" />
        <p className="text-sm font-mono text-[#6E6255]">Connecting to agent telemetry bus...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="card-clean p-8 text-center space-y-4 max-w-xl mx-auto border-[#E8E1D7] bg-white">
        <AlertCircle className="w-10 h-10 mx-auto text-[#A63D38]" />
        <h2 className="text-lg font-bold text-[#1A1612] font-mono">Unable to Connect to Research Pipeline</h2>
        <p className="text-xs text-[#6E6255]">{error || 'Job not found in database.'}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchJob();
            }}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link to="/dashboard" className="btn-secondary text-xs inline-flex">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';

  const filteredFindings = (job.findings || []).filter((f) => {
    if (findingFilter === 'verified') return !f.is_disputed && f.confidence >= 0.7;
    if (findingFilter === 'disputed') return f.is_disputed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner with Subject & Controls */}
      <div className="card-clean p-6 space-y-3 border-[#E8E1D7] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[11px] text-[#785135] bg-[#F6F1EB] px-2.5 py-0.5 rounded border border-[#E8E1D7]">
              JOB-{job.id.slice(0, 8)}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                isCompleted
                  ? 'bg-[#EAF3ED] text-[#2E6B4E] border-[#C5DEC8]'
                  : isFailed
                  ? 'bg-[#FDF2F2] text-[#A83A35] border-[#F7D7D6]'
                  : 'bg-[#F6F1EB] text-[#785135] border-[#E8E1D7]'
              }`}
            >
              {job.status === 'running' && '● '}
              {job.status}
            </span>
            <span className="text-xs text-[#5C5248]">
              {job.depth} • {job.focus}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareLink}
              className="btn-secondary text-xs flex items-center gap-1.5"
              title="Copy link to this research workspace"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#2E6B4E]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handleExportEventsJson}
              className="btn-secondary text-xs flex items-center gap-1.5"
              title="Export event logs as JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#785135]" />
              <span>Logs (JSON)</span>
            </button>

            <button
              onClick={() => fetchJob()}
              className="btn-secondary text-xs flex items-center gap-1.5"
              title="Refresh job status and logs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#785135]" />
              <span>Refresh</span>
            </button>

            {isFailed && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="btn-primary text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
                <span>Retry Pipeline</span>
              </button>
            )}

            {isCompleted && (
              <Link to={`/report/${job.id}`} className="btn-primary text-xs shadow-sm">
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Open Completed Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1612] tracking-tight">
          {job.topic}
        </h1>

        {job.instructions && (
          <p className="text-xs font-mono text-[#5C5248]">
            Scope constraints: "{job.instructions}"
          </p>
        )}
      </div>

      {/* Progress & Milestone Bar */}
      <ProgressIndicator
        progress={job.progress}
        currentStage={job.current_stage}
        status={job.status}
      />

      {/* Active Running Pulse Notification */}
      {job.status === 'running' && (
        <div className="p-3.5 rounded-xl border border-[#E8E1D7] bg-[#F6F1EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-[#785135]">
            <Loader2 className="w-4 h-4 animate-spin text-[#785135] shrink-0" />
            <span>
              Active LangGraph Node: <strong className="font-bold text-[#1A1612]">{job.current_stage || 'Graph Initializing'}</strong>
            </span>
          </div>
          <span className="text-[11px] text-[#5C5248]">
            Streaming live telemetry from LangGraph executor...
          </span>
        </div>
      )}

      {/* Completed Publication Ready CTA */}
      {isCompleted && (
        <div className="p-4 rounded-xl border border-[#C5DEC8] bg-[#EAF3ED] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2E6B4E] text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1A1612]">
                Research Swarm Completed Successfully
              </h3>
              <p className="text-xs text-[#2E6B4E]">
                Peer-reviewed publication generated with {job.sources?.length || 0} citations and {job.findings?.length || 0} verified findings.
              </p>
            </div>
          </div>
          <Link
            to={`/report/${job.id}`}
            className="btn-primary text-xs flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
          >
            <FileCode2 className="w-4 h-4" />
            <span>Read Publication</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Failure message if failed */}
      {isFailed && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F7D7D6] rounded-xl flex items-start gap-3 text-xs text-[#A83A35] font-mono">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#A83A35]" />
          <div className="space-y-1">
            <span className="font-bold text-[#A83A35]">Execution Error Encountered</span>
            <p className="text-[#42382F]">
              The agent swarm encountered an unexpected exception during execution. Click "Retry Pipeline" above to re-dispatch the swarm with fresh workers.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Agent Timeline + Sources / Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Real-time agent event stream */}
        <div className="lg:col-span-1 space-y-4">
          <AgentTimeline events={events} />
        </div>

        {/* Right Columns: Registered Sources and Extracted Findings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Extracted Findings Matrix */}
          <div className="card-clean p-5 space-y-4 border-[#E8E1D7] bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D7] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#785135]" />
                <h3 className="font-bold text-sm text-[#1A1612] font-mono uppercase tracking-wider">
                  Verified Technical Findings ({filteredFindings.length})
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                {/* Filter Tabs */}
                <div className="flex items-center rounded-lg bg-[#FAF8F5] p-1 border border-[#E8E1D7]">
                  <button
                    type="button"
                    onClick={() => setFindingFilter('all')}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      findingFilter === 'all' ? 'bg-[#F6F1EB] text-[#785135] font-semibold border border-[#E8E1D7]' : 'text-[#5C5248] hover:text-[#1A1612]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFindingFilter('verified')}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      findingFilter === 'verified' ? 'bg-[#EAF3ED] text-[#2E6B4E] font-semibold border border-[#C5DEC8]' : 'text-[#5C5248] hover:text-[#1A1612]'
                    }`}
                  >
                    High Conf
                  </button>
                  <button
                    type="button"
                    onClick={() => setFindingFilter('disputed')}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      findingFilter === 'disputed' ? 'bg-[#FEF5EA] text-[#8C5212] font-semibold border border-[#F3DFC1]' : 'text-[#5C5248] hover:text-[#1A1612]'
                    }`}
                  >
                    Contested
                  </button>
                </div>

                {job.findings && job.findings.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyFindings}
                    className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
                    title="Copy findings as markdown"
                  >
                    {copiedFindings ? <Check className="w-3 h-3 text-[#2E6B4E]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFindings ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            {filteredFindings.length === 0 ? (
              <div className="p-8 text-center text-[#8C7F73] font-mono text-xs space-y-1">
                <Layers className="w-6 h-6 mx-auto text-[#D8CCC0] mb-1" />
                <p>No verified findings match the current filter.</p>
                <p className="text-[10px] text-[#8C7F73]">Findings stream in as the Analyst and Verifier agents execute.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFindings.map((finding, idx) => (
                  <FindingCard key={finding.id || idx} finding={finding} />
                ))}
              </div>
            )}
          </div>

          {/* Registered Sources Registry */}
          <div className="card-clean p-5 space-y-4 border-[#E8E1D7] bg-white">
            <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#785135]" />
                <h3 className="font-bold text-sm text-[#1A1612] font-mono uppercase tracking-wider">
                  Registered Source Corpus ({job.sources?.length || 0})
                </h3>
              </div>
              <span className="text-xs font-mono text-[#5C5248]">
                Live web & vector RAG excerpts
              </span>
            </div>

            {!job.sources || job.sources.length === 0 ? (
              <div className="p-8 text-center text-[#8C7F73] font-mono text-xs space-y-1">
                <Search className="w-6 h-6 mx-auto text-[#D8CCC0] mb-1" />
                <p>Retrieval swarm is querying search providers and vector embeddings...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.sources.map((src, idx) => (
                  <SourceCard key={src.id || idx} source={src} index={idx + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
