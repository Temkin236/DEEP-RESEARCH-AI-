import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Cpu,
  ArrowRight,
  Clock,
  Layers,
  Sliders,
  FileCode2,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
  Sparkles,
  Zap,
  Search,
  Database,
  Plus,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchDepth, ResearchFocus, DocumentItem } from '../types';
import { DocumentUploadModal } from '../components/DocumentUploadModal';

export const NewResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [depth, setDepth] = useState<ResearchDepth>('standard');
  const [focus, setFocus] = useState<ResearchFocus>('technical');
  const [maxSources, setMaxSources] = useState(8);
  const [availableDocs, setAvailableDocs] = useState<DocumentItem[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = () => {
    api.listDocuments().then(setAvailableDocs).catch(() => {});
  };

  useEffect(() => {
    loadDocuments();
    const params = new URLSearchParams(location.search);
    const initialTopic = params.get('topic');
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [location.search]);

  const samplePrompts = [
    {
      label: 'LangGraph vs CrewAI vs PydanticAI',
      topic: 'Compare LangGraph, CrewAI, and PydanticAI for building resilient autonomous Python AI applications',
      depth: 'standard' as ResearchDepth,
      focus: 'comparative' as ResearchFocus,
      sources: 8,
      instructions: 'Examine state graph management, parallel tool calling, loop handling, memory durability, and enterprise reliability.',
    },
    {
      label: 'Rust vs Go Microservices',
      topic: 'Analyze Rust vs Go for high-throughput distributed microservices, network proxies, and cloud infrastructure',
      depth: 'standard' as ResearchDepth,
      focus: 'comparative' as ResearchFocus,
      sources: 8,
      instructions: 'Evaluate memory footprint, async runtime overhead (Tokio vs Goroutines), compile times, and latency profiles under load.',
    },
    {
      label: 'WebGPU & WebAssembly (WASM) LLMs',
      topic: 'Investigate the current state and performance of client-side LLM inference using WebGPU and WebAssembly',
      depth: 'deep' as ResearchDepth,
      focus: 'technical' as ResearchFocus,
      sources: 12,
      instructions: 'Focus on tensor quantization (GGUF/AWQ), browser memory constraints, shader optimizations, and cold-start latency.',
    },
    {
      label: 'Quantum Benchmarks vs HPC',
      topic: 'Assess recent quantum supremacy benchmarks against classical tensor network simulators and hybrid algorithms',
      depth: 'deep' as ResearchDepth,
      focus: 'technical' as ResearchFocus,
      sources: 12,
      instructions: 'Cover qubit coherence times, error correction overhead, surface codes, and practical optimization limits.',
    },
  ];

  const handleApplySample = (s: typeof samplePrompts[0]) => {
    setTopic(s.topic);
    setDepth(s.depth);
    setFocus(s.focus);
    setInstructions(s.instructions);
    setMaxSources(s.sources);
  };

  const handleResetForm = () => {
    setTopic('');
    setInstructions('');
    setDepth('standard');
    setFocus('technical');
    setMaxSources(8);
    setSelectedDocs([]);
    setError(null);
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAllDocs = () => {
    setSelectedDocs(availableDocs.map((d) => d.id));
  };

  const handleClearDocSelection = () => {
    setSelectedDocs([]);
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
      setError(err.message || 'Failed to initialize agent swarm.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#785135]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] tracking-tight">
              Launch Agent Swarm
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#6E6255]">
            Configure research parameters, retrieval boundaries, and vector knowledge grounding.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetForm}
          className="btn-secondary text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#6E6255]" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Preset Benchmarks */}
      <div className="card-clean p-5 space-y-3 border-[#E8E1D7] bg-white">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#785135] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#785135]" />
          <span>Quick Preset Benchmarks (Click to auto-populate)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {samplePrompts.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => handleApplySample(s)}
              className="text-left p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EBE1] border border-[#E8E1D7] hover:border-[#785135]/40 transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1612] group-hover:text-[#785135] font-mono">
                  {s.label}
                </span>
                <span className="text-[10px] font-mono text-[#785135] bg-[#F4EBE1] px-2 py-0.5 rounded border border-[#E0D5C7]">
                  {s.depth}
                </span>
              </div>
              <p className="text-[11px] text-[#6E6255] line-clamp-1">
                {s.topic}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div className="card-clean p-6 space-y-4 border-[#E8E1D7] bg-white">
          <label className="block space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1612] flex items-center gap-2">
              <span>Research Inquiry / Hypothesis</span>
              <span className="text-[#785135]">*</span>
            </span>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Compare Rust Tokio async scheduler performance against Go Goroutines for high-concurrency websocket servers..."
              className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl p-4 text-sm text-[#1A1612] placeholder-[#9E9284] focus:outline-none transition-colors font-mono leading-relaxed"
            />
          </label>

          {/* Supplementary Instructions */}
          <label className="block space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6E6255]">
              Target Scope & Custom Constraints (Optional)
            </span>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Include 2024 benchmarks, emphasize memory limits and garbage collection pause times..."
              className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl px-4 py-2.5 text-xs text-[#1A1612] placeholder-[#9E9284] focus:outline-none transition-colors font-mono"
            />
          </label>
        </div>

        {/* Depth & Focus Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Depth */}
          <div className="card-clean p-5 space-y-3 border-[#E8E1D7] bg-white">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1612] block">
              Investigation Depth
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'quick', label: 'Quick', desc: '4 sources (~30s)' },
                { id: 'standard', label: 'Standard', desc: '8 sources (~60s)' },
                { id: 'deep', label: 'Comprehensive', desc: '12+ sources (~2m)' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDepth(d.id as ResearchDepth);
                    setMaxSources(d.id === 'quick' ? 4 : d.id === 'deep' ? 12 : 8);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    depth === d.id
                      ? 'bg-[#F4EBE1] border-[#785135] text-[#785135] shadow-warm-xs font-bold'
                      : 'bg-[#FAF8F5] border-[#E8E1D7] text-[#6E6255] hover:text-[#1A1612] hover:border-[#D5C4B4]'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{d.label}</div>
                  <div className="text-[10px] text-[#9E9284] mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus */}
          <div className="card-clean p-5 space-y-3 border-[#E8E1D7] bg-white">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1612] block">
              Analytical Focus
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'technical', label: 'Technical Depth' },
                { id: 'comparative', label: 'Comparative Benchmark' },
                { id: 'scientific', label: 'Scientific & Papers' },
                { id: 'industry', label: 'Industry & Scaling' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFocus(f.id as ResearchFocus)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    focus === f.id
                      ? 'bg-[#F4EBE1] border-[#785135] text-[#785135] shadow-warm-xs font-bold'
                      : 'bg-[#FAF8F5] border-[#E8E1D7] text-[#6E6255] hover:text-[#1A1612] hover:border-[#D5C4B4]'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{f.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Max Sources Controls */}
        <div className="card-clean p-5 space-y-3 border-[#E8E1D7] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1612]">
              Maximum Verifiable Sources: <span className="text-[#785135] font-extrabold">{maxSources}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMaxSources(Math.max(2, maxSources - 2))}
                className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E8E1D7] text-[#1A1612] hover:bg-[#F4EBE1] flex items-center justify-center font-mono text-sm hover:border-[#D5C4B4]"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setMaxSources(Math.min(20, maxSources + 2))}
                className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E8E1D7] text-[#1A1612] hover:bg-[#F4EBE1] flex items-center justify-center font-mono text-sm hover:border-[#D5C4B4]"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={maxSources}
            onChange={(e) => setMaxSources(parseInt(e.target.value, 10))}
            className="w-full accent-[#785135] bg-[#F4EBE1] h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Local Vector RAG Documents */}
        <div className="card-clean p-5 space-y-4 border-[#E8E1D7] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E1D7] pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#785135]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1612]">
                Include Local Vector Documents ({selectedDocs.length} selected)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {availableDocs.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleSelectAllDocs}
                    className="text-[11px] font-mono text-[#785135] hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-[#D5C4B4]">|</span>
                  <button
                    type="button"
                    onClick={handleClearDocSelection}
                    className="text-[11px] font-mono text-[#6E6255] hover:underline"
                  >
                    Clear
                  </button>
                  <span className="text-[#D5C4B4]">|</span>
                </>
              )}
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-[#785135]" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>

          {availableDocs.length === 0 ? (
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-dashed border-[#E8E1D7] text-center space-y-2">
              <p className="text-xs font-mono text-[#6E6255]">
                No documents currently indexed in ChromaDB vector repository.
              </p>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-secondary text-xs inline-flex"
              >
                Upload First File to ChromaDB
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {availableDocs.map((doc) => {
                const isSelected = selectedDocs.includes(doc.id);
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => toggleDocSelection(doc.id)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-[#F4EBE1] border-[#785135] text-[#1A1612]'
                        : 'bg-[#FAF8F5] border-[#E8E1D7] text-[#6E6255] hover:border-[#D5C4B4]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#785135] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#D5C4B4] shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate text-[#1A1612]">
                        {doc.filename}
                      </div>
                      <div className="text-[10px] font-mono text-[#6E6255] mt-0.5">
                        {doc.chunk_count} passages • {(doc.file_size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-[#FDF2F2] border border-[#F7D7D6] rounded-xl flex items-center gap-2 text-xs font-mono text-[#A63D38]">
            <AlertCircle className="w-4 h-4 text-[#A63D38] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link to="/dashboard" className="text-xs font-mono text-[#6E6255] hover:text-[#1A1612] transition-colors">
            ← Cancel & Return to Dashboard
          </Link>

          <button
            type="submit"
            disabled={!topic.trim() || submitting}
            className="btn-primary text-sm px-8 py-3.5 shadow-sm w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Multi-Agent Graph...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Launch Research Swarm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Embedded Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          loadDocuments();
        }}
      />
    </div>
  );
};
