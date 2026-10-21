import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Clock,
  Layers,
  Sliders,
  FileText,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchDepth, ResearchFocus, DocumentItem } from '../types';

export const NewResearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [depth, setDepth] = useState<ResearchDepth>('standard');
  const [focus, setFocus] = useState<ResearchFocus>('general');
  const [maxSources, setMaxSources] = useState(8);
  const [availableDocs, setAvailableDocs] = useState<DocumentItem[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listDocuments().then(setAvailableDocs).catch(() => {});
  }, []);

  const samplePrompts = [
    {
      label: 'LangGraph vs CrewAI Architecture',
      topic: 'Compare LangGraph, CrewAI, and PydanticAI for building a resilient Python AI application',
      depth: 'standard' as ResearchDepth,
      focus: 'comparative' as ResearchFocus,
      instructions: 'Examine state management, parallel branch execution, cyclic loop handling, and long-term durability.',
    },
    {
      label: 'AI Adoption in Ethiopia',
      topic: 'Research the opportunities, infrastructure challenges, and policy initiatives of AI adoption in Ethiopia',
      depth: 'standard' as ResearchDepth,
      focus: 'general' as ResearchFocus,
      instructions: 'Include telecommunications infrastructure, digital strategy, talent development, and key sectors like agriculture.',
    },
    {
      label: 'Production RAG Advances',
      topic: 'Analyze current developments and architectural patterns in retrieval-augmented generation for enterprise AI',
      depth: 'deep' as ResearchDepth,
      focus: 'technical' as ResearchFocus,
      instructions: 'Focus on hybrid search, re-ranking models, query expansion, and citation verification techniques.',
    },
    {
      label: 'Student AI Cloud Deployment',
      topic: 'Compare cloud deployment platforms (Render, Railway, Fly.io, Cloud Run) for a student-built AI product',
      depth: 'quick' as ResearchDepth,
      focus: 'comparative' as ResearchFocus,
      instructions: 'Evaluate free tiers, container support, persistent database availability, and simplicity.',
    },
  ];

  const handleApplySample = (s: typeof samplePrompts[0]) => {
    setTopic(s.topic);
    setDepth(s.depth);
    setFocus(s.focus);
    setInstructions(s.instructions);
    setMaxSources(s.depth === 'quick' ? 4 : s.depth === 'deep' ? 12 : 8);
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a research question or topic.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await api.createResearchJob({
        topic: topic.trim(),
        instructions: instructions.trim() || undefined,
        depth,
        focus,
        max_sources: maxSources,
        selected_documents: selectedDocs,
      });
      navigate(`/workspace/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start research job.');
      setSubmitting(false);
    }
  };

  const getEstimatedDuration = () => {
    switch (depth) {
      case 'quick':
        return '~30 - 60 seconds (Focused search & verification)';
      case 'deep':
        return '~2 - 3 minutes (Broad multi-angle search & iterative gap resolution)';
      default:
        return '~60 - 90 seconds (Balanced multi-agent synthesis)';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332B25] tracking-tight">
          New Research Investigation
        </h1>
        <p className="text-sm text-[#75685D]">
          Configure parameters for the multi-agent research team.
        </p>
      </div>

      {/* Example Templates */}
      <div className="card-warm p-4 bg-[#FFFEFC] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#9B785B]">
          <Sparkles className="w-4 h-4" />
          <span>Quick-Start Templates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {samplePrompts.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => handleApplySample(s)}
              className="text-left p-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EADF] border border-[#E5D8C8] text-xs transition-colors"
            >
              <div className="font-bold text-[#332B25]">{s.label}</div>
              <div className="text-[#75685D] truncate mt-0.5">{s.topic}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Research Form */}
      <form onSubmit={handleSubmit} className="card-warm p-6 md:p-8 space-y-6 bg-[#FFFEFC]">
        {/* Research Topic */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#332B25]">
            Research Topic or Primary Inquiry <span className="text-[#B6534B]">*</span>
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Compare LangGraph vs CrewAI architecture for production AI agents..."
            className="w-full bg-[#FAF7F2] border border-[#E5D8C8] focus:border-[#B89576] rounded-xl px-4 py-3 text-sm text-[#332B25] placeholder-[#75685D]/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#332B25]">
            Special Instructions & Scope Constraints (Optional)
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Specify any required sections, exclusions, domain focus, or specific comparison metrics..."
            className="w-full bg-[#FAF7F2] border border-[#E5D8C8] focus:border-[#B89576] rounded-xl p-4 text-sm text-[#332B25] placeholder-[#75685D]/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Depth & Focus Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Depth */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#332B25]">
              Investigation Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['quick', 'standard', 'deep'] as ResearchDepth[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDepth(d);
                    setMaxSources(d === 'quick' ? 4 : d === 'deep' ? 12 : 8);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-colors border ${
                    depth === d
                      ? 'bg-[#E8D8C5] text-[#332B25] border-[#B89576]'
                      : 'bg-[#FAF7F2] text-[#75685D] border-[#E5D8C8] hover:bg-[#F3EADF]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#75685D]">
              {depth === 'quick' && 'Fast overview with 3-4 key sources.'}
              {depth === 'standard' && 'Comprehensive analysis with 6-8 sources.'}
              {depth === 'deep' && 'Thorough investigation with iterative follow-up and 10-15 sources.'}
            </p>
          </div>

          {/* Focus */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#332B25]">
              Analytical Focus
            </label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value as ResearchFocus)}
              className="w-full bg-[#FAF7F2] border border-[#E5D8C8] focus:border-[#B89576] rounded-xl px-3 py-2.5 text-sm text-[#332B25] focus:outline-none"
            >
              <option value="general">General Overview</option>
              <option value="technical">Technical & Architectural</option>
              <option value="academic">Academic & Empirical Research</option>
              <option value="business">Business & Market Strategy</option>
              <option value="comparative">Comparative Evaluation</option>
            </select>
          </div>
        </div>

        {/* Max Sources Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <label className="font-bold text-[#332B25]">Maximum Verified Sources</label>
            <span className="font-mono font-bold text-[#9B785B]">{maxSources} sources</span>
          </div>
          <input
            type="range"
            min={2}
            max={16}
            step={1}
            value={maxSources}
            onChange={(e) => setMaxSources(Number(e.target.value))}
            className="w-full accent-[#B89576]"
          />
        </div>

        {/* Document Selection */}
        {availableDocs.length > 0 && (
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-[#332B25]">
              Include Uploaded Documents in Evidence Retrieval
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availableDocs.map((doc) => {
                const isSelected = selectedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocSelection(doc.id)}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#F3EADF] border-[#B89576] text-[#332B25]'
                        : 'bg-[#FAF7F2] border-[#E5D8C8] text-[#75685D] hover:bg-[#F3EADF]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#9B785B] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#75685D] shrink-0" />
                      )}
                      <span className="font-medium truncate">{doc.filename}</span>
                    </div>
                    <span className="text-[11px] text-[#75685D] shrink-0">
                      {doc.chunk_count} chunks
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expected Time Note */}
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5D8C8] flex items-center gap-3 text-xs text-[#75685D]">
          <Clock className="w-4 h-4 text-[#B89576] shrink-0" />
          <span>Expected processing duration: <strong>{getEstimatedDuration()}</strong></span>
        </div>

        {error && (
          <div className="p-4 bg-[#B6534B]/10 border border-[#B6534B]/30 rounded-xl flex items-center gap-3 text-sm text-[#B6534B]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting || !topic.trim()}
            className="btn-primary px-8 py-3 text-sm shadow-warm-md"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Launching Multi-Agent System...</span>
              </>
            ) : (
              <>
                <span>Start Research</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
