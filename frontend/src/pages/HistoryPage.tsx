import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileCode2,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  Cpu,
  CheckCircle2,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchJobSummary } from '../types';

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
      setError(null);
      const data = await api.listResearchJobs({
        q: searchTerm || undefined,
        status: statusFilter || undefined,
      });
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch historical investigations.');
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

  const handleClearSearch = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTimeout(fetchJobs, 10);
  };

  const confirmDelete = async () => {
    if (!jobToDelete || deleting) return;
    setDeleting(true);
    try {
      await api.deleteResearchJob(jobToDelete);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete));
      setJobToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete research record.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportHistoryJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jobs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tech_research_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#785135]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] tracking-tight">
              Research Pipeline History
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#6E6255]">
            Query, inspect, and export all past multi-agent technical investigations.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleExportHistoryJson}
            disabled={jobs.length === 0}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Export all records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#785135]" />
            <span>Export Registry (JSON)</span>
          </button>
          <button
            type="button"
            onClick={fetchJobs}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Refresh records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-clean p-4 bg-white border-[#E8E1D7] shadow-warm-xs flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9284]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search historical topics or keywords..."
              className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl pl-9 pr-8 py-2 text-xs text-[#1A1612] placeholder-[#9E9284] focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E9284] hover:text-[#1A1612]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button type="submit" className="btn-secondary text-xs px-4 py-2">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#785135]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl px-3 py-2 text-xs text-[#1A1612] focus:outline-none font-mono transition-colors"
          >
            <option value="">All Statuses ({jobs.length})</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          {(searchTerm || statusFilter) && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs text-[#6E6255] hover:text-[#785135] underline underline-offset-2 ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchJobs}
            className="btn-secondary text-xs px-3 py-1.5 self-start sm:self-auto shrink-0"
          >
            Retry Query
          </button>
        </div>
      )}

      {/* History Table / Cards */}
      {loading ? (
        <div className="card-clean p-16 text-center text-[#6E6255] space-y-2 border-[#E8E1D7] bg-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#785135] mb-2" />
          <p className="text-sm font-mono">Loading investigation archives...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card-clean p-12 text-center space-y-3 border-[#E8E1D7] bg-white">
          <FileCode2 className="w-10 h-10 mx-auto text-[#9E9284]" />
          <h3 className="font-bold text-sm text-[#1A1612] font-mono">No research archives found</h3>
          <p className="text-xs text-[#6E6255] max-w-sm mx-auto">
            {searchTerm || statusFilter
              ? 'No records match your active filter criteria. Try clearing search filters.'
              : 'Launch your first multi-agent research inquiry to start building your knowledge history.'}
          </p>
          <div className="pt-2">
            <Link to="/research/new" className="btn-primary text-xs inline-flex items-center gap-1.5">
              <span>Launch New Investigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="card-clean card-clean-hover p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#E8E1D7] bg-white shadow-warm-xs"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap font-mono">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      job.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : job.status === 'running'
                        ? 'bg-[#F4EBE1] text-[#785135] border-[#E0D5C7]'
                        : 'bg-[#FAF8F5] text-[#6E6255] border-[#E8E1D7]'
                    }`}
                  >
                    {job.status === 'running' && '● '}
                    {job.status}
                  </span>
                  <span className="text-xs text-[#6E6255]">
                    Depth: {job.depth} • Focus: {job.focus}
                  </span>
                  <span className="text-[11px] text-[#9E9284]">
                    ID: {job.id.slice(0, 8)}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#1A1612] hover:text-[#785135] transition-colors">
                  <Link to={job.has_report ? `/report/${job.id}` : `/workspace/${job.id}`}>
                    {job.topic}
                  </Link>
                </h3>

                <div className="flex items-center gap-3 text-xs font-mono text-[#6E6255]">
                  <span>Stage: {job.current_stage || 'Completed'}</span>
                  <span>•</span>
                  <span>{job.source_count || 0} Sources Registered</span>
                  <span>•</span>
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 font-mono">
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
                  onClick={() => setJobToDelete(job.id)}
                  className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E1D7] text-[#9E9284] hover:text-rose-600 hover:border-rose-300 transition-colors"
                  title="Delete Investigation Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1612]/40 backdrop-blur-sm p-4">
          <div className="card-clean w-full max-w-md p-6 space-y-4 border-[#E8E1D7] bg-white shadow-warm-lg">
            <h3 className="font-bold text-base text-[#1A1612] font-mono">Confirm Deletion</h3>
            <p className="text-xs text-[#6E6255]">
              Are you sure you want to delete this research record and its associated findings from the database? This action is permanent.
            </p>
            <div className="flex justify-end gap-3 pt-2">
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
                className="btn-danger text-xs font-mono"
              >
                {deleting ? 'Deleting...' : 'Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
