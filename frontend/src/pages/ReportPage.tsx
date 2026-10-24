import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileCode2,
  Copy,
  Download,
  Printer,
  Check,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Share2,
  Database,
  Cpu,
  Layers,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { Report, ResearchJobDetail } from '../types';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<Report | null>(null);
  const [job, setJob] = useState<ResearchJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCitationIndex, setSelectedCitationIndex] = useState<number | null>(null);

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
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    if (!report || !job) return;
    const blob = new Blob([report.markdown_content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TechResearch_Report_${job.topic.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!report || !job) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ report, job }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TechResearch_Report_${job.topic.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="card-clean p-16 text-center space-y-3 max-w-3xl mx-auto border-[#E8E1D7] bg-white">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#785135]" />
        <p className="text-sm font-mono text-[#6E6255]">Compiling verified research publication...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="card-clean p-8 text-center space-y-4 max-w-xl mx-auto border-[#E8E1D7] bg-white">
        <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
        <h2 className="text-lg font-bold text-[#1A1612] font-mono">Report Publication Not Available</h2>
        <p className="text-xs text-[#6E6255]">{error || 'The research pipeline has not finished drafting the report.'}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link to={`/workspace/${id}`} className="btn-primary text-xs inline-flex items-center gap-1.5">
            <span>Check Agent Telemetry Workspace</span>
          </Link>
          <Link to="/dashboard" className="btn-secondary text-xs inline-flex">
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:p-0 print:max-w-none">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to={`/workspace/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C5248] hover:text-[#785135] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agent Workspace</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          <Link
            to={`/chat?topic=${encodeURIComponent(job?.topic || '')}`}
            className="btn-secondary text-xs"
            title="Ask AI Chatbot questions about this research topic"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#785135]" />
            <span>Ask Chatbot</span>
          </Link>

          <button
            type="button"
            onClick={handleShareLink}
            className="btn-secondary text-xs"
            title="Share report URL"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#2E6B4E]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary text-xs"
            title="Copy Raw Markdown to Clipboard"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-[#2E6B4E]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied' : 'Copy .md'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="btn-secondary text-xs"
            title="Download formatted Markdown file"
          >
            <Download className="w-3.5 h-3.5 text-[#785135]" />
            <span>Download .md</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="btn-secondary text-xs"
            title="Download full JSON dataset"
          >
            <Download className="w-3.5 h-3.5 text-[#5C5248]" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary text-xs shadow-sm"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Header Metadata Card */}
      <div className="card-clean p-6 sm:p-8 space-y-4 bg-white border-[#E8E1D7] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D7] pb-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[11px] font-semibold text-[#785135] bg-[#F6F1EB] px-2.5 py-0.5 rounded-full border border-[#E8E1D7]">
              REPORT ID: {report.id.slice(0, 8)}
            </span>
            <span className="text-xs text-[#5C5248]">
              Generated: {new Date(report.created_at).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#2E6B4E] bg-[#EAF3ED] border border-[#C5DEC8] px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#2E6B4E]" />
              <span>Evidence Verified: {report.citations_data?.length || 0} Citations</span>
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] tracking-tight leading-tight">
          {report.title || job?.topic}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#5C5248] pt-1">
          <span>Swarm Pipeline: LangGraph</span>
          <span>•</span>
          <span>Word Count: ~{report.markdown_content.split(/\s+/).length} words</span>
          <span>•</span>
          <span>Registered Sources: {job?.sources?.length || 0}</span>
          <span>•</span>
          <span>Focus: {job?.focus || 'technical'}</span>
        </div>
      </div>

      {/* Main Publication Article Card */}
      <article className="card-clean p-6 sm:p-10 border-[#E8E1D7] bg-white shadow-sm">
        <div className="report-markdown prose prose-stone max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#785135] hover:text-[#59371F] font-medium underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                  {...props}
                >
                  <span>{children}</span>
                  <ExternalLink className="w-3 h-3 inline-block ml-0.5 opacity-70" />
                </a>
              ),
            }}
          >
            {report.markdown_content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Sources & Citations Inspector */}
      {job?.sources && job.sources.length > 0 && (
        <section className="card-clean p-6 space-y-4 border-[#E8E1D7] bg-white shadow-sm print:hidden">
          <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#785135]" />
              <h3 className="font-bold text-sm text-[#1A1612] font-mono uppercase tracking-wider">
                Full Registered Source Corpus ({job.sources.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-[#5C5248]">
              Referenced by citations in report body
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {job.sources.map((src, i) => (
              <div
                key={src.id || i}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] hover:border-[#785135]/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#785135] bg-[#F6F1EB] px-2 py-0.5 rounded border border-[#E8E1D7]">
                    [{i + 1}]
                  </span>
                  <span className="text-[11px] text-[#5C5248]">
                    {src.domain || 'Source'}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#1A1612] line-clamp-1">
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#785135] transition-colors">
                    {src.title}
                  </a>
                </h4>
                {src.snippet && (
                  <p className="text-[11px] text-[#5C5248] line-clamp-2">
                    "{src.snippet}"
                  </p>
                )}
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#8C7F73]">
                  <span>Reliability: {Math.round(src.reliability_score * 100)}%</span>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[#785135] hover:underline flex items-center gap-1 font-semibold">
                    <span>Visit Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
