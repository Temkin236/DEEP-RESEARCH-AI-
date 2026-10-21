import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Copy,
  Download,
  Printer,
  Check,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Report, ResearchJobDetail } from '../types';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<Report | null>(null);
  const [job, setJob] = useState<ResearchJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [fetchedReport, fetchedJob] = await Promise.all([
          api.getResearchReport(id),
          api.getResearchJob(id),
        ]);
        setReport(fetchedReport);
        setJob(fetchedJob);
      } catch (err: any) {
        setError(err.message || 'Failed to load research report.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.markdown_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!report || !job) return;
    const blob = new Blob([report.markdown_content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Deep_Research_${job.topic.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="card-warm p-16 text-center space-y-3 max-w-3xl mx-auto">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#B89576]" />
        <p className="text-sm font-medium text-[#75685D]">Loading publication report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="card-warm p-8 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="w-10 h-10 mx-auto text-[#B6534B]" />
        <h2 className="text-lg font-bold text-[#332B25]">Report Not Available</h2>
        <p className="text-xs text-[#75685D]">{error || 'No report has been compiled yet.'}</p>
        <Link to={`/workspace/${id}`} className="btn-secondary text-xs inline-flex">
          Return to Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:p-0 print:max-w-none">
      {/* Action Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to={`/workspace/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#75685D] hover:text-[#332B25] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Workspace</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary text-xs"
            title="Copy Raw Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#52785C]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-secondary text-xs"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary text-xs shadow-warm-sm"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Card */}
      <article className="card-warm p-8 md:p-12 bg-[#FFFEFC] space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-[#E5D8C8] pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B785B] bg-[#F3EADF] px-2.5 py-1 rounded-md border border-[#E5D8C8]">
              Verified Research Report
            </span>
            <span className="text-xs text-[#75685D]">
              {report.word_count} words • {report.citations_data?.length || 0} citations
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#332B25] tracking-tight leading-tight">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#75685D] pt-1">
            <span>Date: {new Date(report.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#52785C] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence-Backed Synthesis</span>
            </span>
          </div>
        </div>

        {/* Executive Summary Callout */}
        <div className="bg-[#FAF7F2] border-l-4 border-[#B89576] p-6 rounded-r-xl space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#9B785B]">
            Executive Summary
          </h2>
          <p className="text-sm text-[#332B25] leading-relaxed font-medium">
            {report.executive_summary}
          </p>
        </div>

        {/* Rendered Markdown Body */}
        <div className="report-markdown text-sm text-[#332B25] space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom citation chip rendering for links
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9B785B] hover:text-[#332B25] underline decoration-[#B89576]/50 transition-colors font-medium"
                />
              ),
            }}
          >
            {report.markdown_content}
          </ReactMarkdown>
        </div>

        {/* Registered Sources & Citations Table */}
        {report.citations_data && report.citations_data.length > 0 && (
          <div className="border-t border-[#E5D8C8] pt-8 space-y-4 print:break-before-page">
            <h3 className="text-lg font-bold text-[#332B25] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#B89576]" />
              <span>Evidence Registry & Citations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.citations_data.map((src, i) => (
                <div
                  key={src.url || i}
                  className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold font-mono text-[#9B785B]">
                      [{src.index || i + 1}]
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3EADF] text-[#75685D] border border-[#E5D8C8]">
                      {src.domain || src.source_type}
                    </span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#332B25] hover:text-[#9B785B] transition-colors block truncate"
                  >
                    {src.title}
                  </a>
                  {src.snippet && (
                    <p className="text-[11px] text-[#75685D] line-clamp-2 italic">
                      "{src.snippet}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
