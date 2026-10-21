import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  FileText,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Share2,
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

  // Initial load of job details
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

  // Setup Server-Sent Events (SSE) connection
  useEffect(() => {
    if (!id) return;

    const eventSourceUrl = api.getEventSourceUrl(id);
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (e) => {
      try {
        const parsedEvent: WorkflowEvent = JSON.parse(e.data);
        setEvents((prev) => {
          // Avoid duplicate events by ID
          if (prev.some((item) => item.id === parsedEvent.id)) {
            return prev;
          }
          return [...prev, parsedEvent];
        });

        // Update current stage and progress dynamically if event provides it
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
      console.log('Research workflow completed or ended.');
      fetchJob();
      eventSource.close();
    });

    eventSource.onerror = () => {
      console.log('SSE connection closed or re-connecting...');
      eventSource.close();
      // Periodically refresh job to catch completion
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

  if (loading) {
    return (
      <div className="card-warm p-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#B89576]" />
        <p className="text-sm font-medium text-[#75685D]">Connecting to agent workspace...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="card-warm p-8 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="w-10 h-10 mx-auto text-[#B6534B]" />
        <h2 className="text-lg font-bold text-[#332B25]">Unable to Load Research Job</h2>
        <p className="text-xs text-[#75685D]">{error || 'Job not found.'}</p>
        <Link to="/dashboard" className="btn-secondary text-xs inline-flex">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner with Subject & Controls */}
      <div className="card-warm p-6 space-y-3 bg-[#FFFEFC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#75685D] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E5D8C8]">
              JOB-{job.id.slice(0, 8)}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                isCompleted
                  ? 'bg-[#52785C]/15 text-[#52785C] border-[#52785C]/30'
                  : isFailed
                  ? 'bg-[#B6534B]/15 text-[#B6534B] border-[#B6534B]/30'
                  : 'bg-[#B89576]/15 text-[#9B785B] border-[#B89576]/30'
              }`}
            >
              {job.status}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isFailed && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="btn-primary text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
                <span>Retry Research</span>
              </button>
            )}
            {isCompleted && (
              <Link to={`/report/${job.id}`} className="btn-primary text-xs shadow-warm-sm">
                <FileText className="w-3.5 h-3.5" />
                <span>Open Completed Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#332B25] tracking-tight">
          {job.topic}
        </h1>

        {job.instructions && (
          <p className="text-xs text-[#75685D] italic">
            Instructions: "{job.instructions}"
          </p>
        )}
      </div>

      {/* Progress & Milestone Bar */}
      <ProgressIndicator
        progress={job.progress}
        currentStage={job.current_stage}
        status={job.status}
      />

      {/* Failure message if failed */}
      {isFailed && (
        <div className="p-4 bg-[#B6534B]/10 border border-[#B6534B]/30 rounded-xl flex items-start gap-3 text-xs text-[#B6534B]">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Workflow Execution Halt</span>
            <span>{job.error_message || 'The research workflow encountered an unrecoverable provider error.'}</span>
          </div>
        </div>
      )}

      {/* Workspace Grid: Timeline & Discovered Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Agent Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <AgentTimeline events={events} />
        </div>

        {/* Right Column: Evidence & Findings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sources Panel */}
          <div className="card-warm p-5 space-y-3 bg-[#FFFEFC]">
            <div className="flex items-center justify-between border-b border-[#E5D8C8] pb-2.5">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#B89576]" />
                <h3 className="font-bold text-sm text-[#332B25]">
                  Verified Sources
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#75685D]">
                {job.sources.length} captured
              </span>
            </div>

            {job.sources.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#75685D]">
                No sources indexed yet. Researcher agent is actively searching.
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {job.sources.map((s, idx) => (
                  <SourceCard key={s.id} source={s} index={idx + 1} />
                ))}
              </div>
            )}
          </div>

          {/* Findings Panel */}
          <div className="card-warm p-5 space-y-3 bg-[#FFFEFC]">
            <div className="flex items-center justify-between border-b border-[#E5D8C8] pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#52785C]" />
                <h3 className="font-bold text-sm text-[#332B25]">
                  Synthesized Findings
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#75685D]">
                {job.findings.length} findings
              </span>
            </div>

            {job.findings.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#75685D]">
                Awaiting analytical synthesis from Analyst agent.
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {job.findings.map((f) => (
                  <FindingCard key={f.id} finding={f} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
