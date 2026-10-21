import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchJobSummary, JobStatus } from '../types';

export const HistoryPage: React.FC = () => {
  const [jobs, setJobs] = useState<ResearchJobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await api.listResearchJobs({
        q: searchTerm || undefined,
        status: statusFilter || undefined,
      });
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const confirmDelete = async () => {
    if (!jobToDelete || deleting) return;
    setDeleting(true);
    try {
      await api.deleteResearchJob(jobToDelete);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete));
      setJobToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete research job.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332B25] tracking-tight">
          Research History
        </h1>
        <p className="text-sm text-[#75685D]">
          Search, review, and export all past multi-agent investigations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-warm p-4 bg-[#FFFEFC] flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#75685D]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search past research topics..."
              className="w-full bg-[#FAF7F2] border border-[#E5D8C8] focus:border-[#B89576] rounded-xl pl-9 pr-4 py-2 text-sm text-[#332B25] placeholder-[#75685D]/60 focus:outline-none"
            />
          </div>
          <button type="submit" className="btn-secondary text-xs px-4 py-2">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#75685D]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E5D8C8] focus:border-[#B89576] rounded-xl px-3 py-2 text-xs text-[#332B25] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#B6534B]/10 border border-[#B6534B]/30 rounded-xl flex items-center gap-3 text-sm text-[#B6534B]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* History Table / Cards */}
      {loading ? (
        <div className="card-warm p-16 text-center text-[#75685D]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#B89576] mb-2" />
          <p className="text-sm">Loading historical records...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card-warm p-12 text-center space-y-3">
          <FileText className="w-10 h-10 mx-auto text-[#B89576] opacity-60" />
          <h3 className="font-bold text-sm text-[#332B25]">No research records found</h3>
          <p className="text-xs text-[#75685D] max-w-sm mx-auto">
            Try adjusting your search query or status filter, or start a new research investigation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="card-warm card-warm-hover p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFEFC]"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      job.status === 'completed'
                        ? 'bg-[#52785C]/15 text-[#52785C] border-[#52785C]/30'
                        : job.status === 'running'
                        ? 'bg-[#B89576]/15 text-[#9B785B] border-[#B89576]/30'
                        : 'bg-[#B6534B]/15 text-[#B6534B] border-[#B6534B]/30'
                    }`}
                  >
                    {job.status}
                  </span>
                  <span className="text-xs text-[#75685D]">
                    {job.depth} depth • {job.focus} focus
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#332B25] hover:text-[#9B785B] transition-colors">
                  <Link to={job.has_report ? `/report/${job.id}` : `/workspace/${job.id}`}>
                    {job.topic}
                  </Link>
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#75685D]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </span>
                  <span>•</span>
                  <span>{job.source_count} sources</span>
                  <span>•</span>
                  <span>{job.finding_count} findings</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {job.has_report ? (
                  <Link to={`/report/${job.id}`} className="btn-secondary text-xs">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </Link>
                ) : (
                  <Link to={`/workspace/${job.id}`} className="btn-secondary text-xs">
                    <span>Workspace</span>
                  </Link>
                )}
                <button
                  onClick={() => setJobToDelete(job.id)}
                  className="p-2 text-[#75685D] hover:text-[#B6534B] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                  title="Delete Research Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#332B25]/40 backdrop-blur-sm p-4">
          <div className="card-warm w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-base text-[#332B25]">Delete Research Job</h3>
            <p className="text-xs text-[#75685D] leading-relaxed">
              Are you sure you want to delete this research job? All gathered sources, findings, and the compiled report will be permanently removed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="btn-secondary text-xs"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-[#B6534B] text-white hover:bg-[#9B3C35] font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
