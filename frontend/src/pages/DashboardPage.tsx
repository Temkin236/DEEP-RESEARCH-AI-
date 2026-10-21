import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  FileText,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
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
  const [error, setError] = useState<string | null>(null);

  const exampleTopics = [
    'Compare LangGraph, CrewAI, and PydanticAI for a Python AI application',
    'Analyze current developments in retrieval-augmented generation (RAG)',
    'Research the opportunities and challenges of AI adoption in Ethiopia',
    'Compare cloud deployment platforms for a student-built AI product',
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedJobs, fetchedDocs] = await Promise.all([
        api.listResearchJobs(),
        api.listDocuments(),
      ]);
      setJobs(fetchedJobs);
      setDocs(fetchedDocs);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
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
        focus: 'general',
        max_sources: 8,
      });
      navigate(`/workspace/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Could not start research job.');
      setSubmitting(false);
    }
  };

  const totalSourcesCount = jobs.reduce((acc, j) => acc + (j.source_count || 0), 0);
  const completedReportsCount = jobs.filter((j) => j.has_report).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332B25] tracking-tight">
          Research Dashboard
        </h1>
        <p className="text-sm text-[#75685D]">
          Deploy autonomous research agents to investigate topics, verify evidence, and draft reports.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Research Jobs"
          value={jobs.length}
          subtext="Total investigations"
          icon={Compass}
        />
        <MetricCard
          label="Evidence Sources"
          value={totalSourcesCount}
          subtext="Registered & verified"
          icon={Search}
        />
        <MetricCard
          label="Completed Reports"
          value={completedReportsCount}
          subtext="With verified citations"
          icon={FileText}
        />
        <MetricCard
          label="Document Library"
          value={docs.length}
          subtext="Indexed vector passages"
          icon={BookOpen}
        />
      </div>

      {/* Prominent Quick-Input Card */}
      <div className="card-warm p-6 md:p-8 bg-[#FFFEFC] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B89576]" />
          <h2 className="text-base font-bold text-[#332B25]">Start an Immediate Investigation</h2>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={quickTopic}
            onChange={(e) => setQuickTopic(e.target.value)}
            placeholder="Enter research topic, technology comparison, or investigative question..."
            className="flex-1 bg-[#FAF7F2] border border-[#E5D8C8] focus:border-[#B89576] rounded-xl px-4 py-3 text-sm text-[#332B25] placeholder-[#75685D]/60 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!quickTopic.trim() || submitting}
            className="btn-primary px-6 py-3 text-sm shrink-0"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Agents...</span>
              </>
            ) : (
              <>
                <span>Start Research</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Example Topics */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-[#75685D] block mb-2">
            Or select an example research topic:
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setQuickTopic(topic)}
                className="text-xs text-left bg-[#FAF7F2] hover:bg-[#F3EADF] text-[#332B25] border border-[#E5D8C8] px-3 py-1.5 rounded-lg transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#B6534B]/10 border border-[#B6534B]/30 rounded-xl flex items-center gap-3 text-sm text-[#B6534B]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recent Research Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#332B25]">Recent Research Activity</h2>
          <Link to="/history" className="text-xs font-semibold text-[#9B785B] hover:text-[#332B25]">
            View All History →
          </Link>
        </div>

        {loading ? (
          <div className="card-warm p-12 text-center text-[#75685D]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#B89576] mb-2" />
            <p className="text-sm">Loading research records...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-warm p-12 text-center space-y-3">
            <Compass className="w-10 h-10 mx-auto text-[#B89576] opacity-60" />
            <h3 className="font-bold text-sm text-[#332B25]">No research jobs yet</h3>
            <p className="text-xs text-[#75685D] max-w-sm mx-auto">
              Start your first investigation above or click New Research to configure advanced depth and source options.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="card-warm card-warm-hover p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        job.status === 'completed'
                          ? 'bg-[#52785C]/10 text-[#52785C] border-[#52785C]/30'
                          : job.status === 'running'
                          ? 'bg-[#B89576]/10 text-[#9B785B] border-[#B89576]/30'
                          : 'bg-[#F3EADF] text-[#75685D] border-[#E5D8C8]'
                      }`}
                    >
                      {job.status}
                    </span>
                    <span className="text-xs text-[#75685D]">
                      {job.depth} • {job.focus}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#332B25] hover:text-[#9B785B] transition-colors">
                    <Link to={job.has_report ? `/report/${job.id}` : `/workspace/${job.id}`}>
                      {job.topic}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#75685D]">
                    <span>Stage: {job.current_stage}</span>
                    <span>•</span>
                    <span>{job.source_count} sources</span>
                    <span>•</span>
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {job.has_report ? (
                    <Link to={`/report/${job.id}`} className="btn-secondary text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </Link>
                  ) : (
                    <Link to={`/workspace/${job.id}`} className="btn-primary text-xs">
                      <span>Live Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
