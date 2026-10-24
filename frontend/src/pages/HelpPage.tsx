import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Cpu,
  Search,
  ShieldCheck,
  FileCode2,
  Database,
  Terminal,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api';

export const HelpPage: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const agents = [
    {
      name: 'Agent 1: Planner Node (Decomposition)',
      icon: Layers,
      color: 'text-cyan-400',
      badge: 'Planning Phase',
      desc: 'Parses the user technical inquiry, establishes architectural scope, and decomposes high-level questions into 3-4 granular sub-hypotheses with specific retrieval queries.',
      specs: 'Input: Natural language research inquiry | Output: Subqueries list, boundary conditions, search queries',
    },
    {
      name: 'Agent 2: Researcher Node (Parallel Retrieval)',
      icon: Search,
      color: 'text-blue-400',
      badge: 'Crawl & Vector RAG',
      desc: 'Spawns asynchronous workers across live web search engines (DuckDuckGo, Tavily) and local ChromaDB vector collections. Gathers snippets, timestamps, domain metadata, and URLs into a deduplicated registry.',
      specs: 'Engines: DuckDuckGo / ChromaDB | Deduplication: URL + Hash-based matching',
    },
    {
      name: 'Agent 3: Analyst Node (Synthesis & Trade-offs)',
      icon: Cpu,
      color: 'text-indigo-400',
      badge: 'Analysis Phase',
      desc: 'Critically evaluates evidence across competing technical viewpoints, identifies architectural trade-offs, detects conflicting benchmark claims, and extracts high-confidence findings.',
      specs: 'Confidence Scoring: 0.0 - 1.0 | Discrepancy Detection: Automatic flagging',
    },
    {
      name: 'Agent 4: Verification Node (Hallucination Audit)',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      badge: 'Verification Phase',
      desc: 'Audits every extracted claim against registered evidence excerpts. Prunes unverified assertions, validates URL accessibility, and guarantees zero hallucinated source references.',
      specs: 'Grounding Mode: Strict Evidence Verification | False Positive Filtering: Enabled',
    },
    {
      name: 'Agent 5: Report Writer Node (Structured Publication)',
      icon: FileCode2,
      color: 'text-cyan-300',
      badge: 'Compilation Phase',
      desc: 'Drafts the final 11-section structured markdown technical publication with executive summary, methodology, comparative matrices, trade-offs, and bracketed [1] citation markers.',
      specs: 'Format: GitHub Flavored Markdown (GFM) with LaTeX and ASCII Tables',
    },
  ];

  const handleTestPing = async () => {
    setPinging(true);
    setPingStatus(null);
    const start = performance.now();
    try {
      const res = await api.getHealth();
      const end = performance.now();
      setPingStatus(`Operational (${Math.round(end - start)}ms) - ${res.database} database & ${res.vectorstore}`);
    } catch (err: any) {
      setPingStatus(`Ping Failed: ${err.message}`);
    } finally {
      setPinging(false);
    }
  };

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#785135]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] tracking-tight">
              Architecture Specs & API Guide
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6255]">
            Technical blueprint for the LangGraph multi-agent swarm, vector RAG, and citation guarantees.
          </p>
        </div>

        {/* Live Diagnostics Test Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestPing}
            disabled={pinging}
            className="btn-secondary text-xs flex items-center gap-1.5 shrink-0"
          >
            <Activity className={`w-3.5 h-3.5 ${pinging ? 'animate-pulse text-[#785135]' : 'text-emerald-600'}`} />
            <span>{pinging ? 'Diagnosing...' : 'Test Cluster Ping'}</span>
          </button>
        </div>
      </div>

      {pingStatus && (
        <div className="p-3.5 bg-[#F4EBE1] border border-[#E0D5C7] rounded-xl text-xs text-[#785135] flex items-center justify-between font-semibold">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{pingStatus}</span>
          </span>
          <button
            type="button"
            onClick={() => setPingStatus(null)}
            className="text-[#6E6255] hover:text-[#1A1612]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="card-clean p-3 bg-white border-[#E8E1D7] shadow-warm-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-[#9E9284] ml-2" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter agent specifications..."
          className="w-full bg-transparent text-xs text-[#1A1612] placeholder-[#9E9284] focus:outline-none"
        />
        {filterQuery && (
          <button
            type="button"
            onClick={() => setFilterQuery('')}
            className="text-[#9E9284] hover:text-[#1A1612] px-2 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Multi-Agent Architecture Breakdown */}
      <div className="card-clean p-6 space-y-4 border-[#E8E1D7] bg-white shadow-warm-sm">
        <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#785135]" />
            <h2 className="text-sm font-bold text-[#1A1612] uppercase tracking-wider">
              The 5 Specialized Agent Nodes
            </h2>
          </div>
          <span className="text-[11px] text-[#6E6255]">
            LangGraph StateMachine Nodes
          </span>
        </div>

        <div className="space-y-3">
          {filteredAgents.map((ag, idx) => {
            const Icon = ag.icon;
            const isOpen = activeAccordion === idx;
            return (
              <div
                key={ag.name}
                className="rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveAccordion(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F4EBE1]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E1D7] flex items-center justify-center text-[#785135] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-[#1A1612]">{ag.name}</h3>
                      <span className="text-[10px] text-[#785135] font-semibold">{ag.badge}</span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#6E6255]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E6255]" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 border-t border-[#E8E1D7] space-y-2.5 text-xs">
                    <p className="text-[#6E6255] leading-relaxed font-sans">{ag.desc}</p>
                    <div className="p-2.5 rounded bg-white border border-[#E8E1D7] text-[11px] text-[#785135]">
                      <code>{ag.specs}</code>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Citation Engine Details */}
      <div className="card-clean p-6 space-y-3 border-[#E8E1D7] bg-white shadow-warm-sm">
        <div className="flex items-center gap-2 border-b border-[#E8E1D7] pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-[#1A1612] uppercase tracking-wider">
            Evidence Registry & Zero-Hallucination Guarantees
          </h2>
        </div>
        <p className="text-xs text-[#6E6255] leading-relaxed font-sans">
          TechResearch AI uses a strict centralized evidence registry. Every retrieved snippet is indexed with a deterministic integer marker. During the synthesis stage, claims lacking direct evidentiary excerpt backing are quarantined and pruned by the Verifier Agent prior to publication.
        </p>
      </div>

      {/* Vector RAG Details */}
      <div className="card-clean p-6 space-y-3 border-[#E8E1D7] bg-white shadow-warm-sm">
        <div className="flex items-center gap-2 border-b border-[#E8E1D7] pb-3">
          <Database className="w-5 h-5 text-[#785135]" />
          <h2 className="text-sm font-bold text-[#1A1612] uppercase tracking-wider">
            Local ChromaDB Vector Collection Pipeline
          </h2>
        </div>
        <p className="text-xs text-[#6E6255] leading-relaxed font-sans">
          Documents (PDF, DOCX, TXT, Markdown) uploaded to the Document Library are parsed and chunked with 200-character overlap. Semantic cosine distance queries are evaluated locally inside ChromaDB to retrieve relevant context for each subquery without sending proprietary documents outside your host.
        </p>
      </div>

      {/* Quick Launch CTA */}
      <div className="card-clean p-6 border-[#E0D5C7] bg-[#F4EBE1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-warm-md">
        <div>
          <h3 className="font-bold text-sm text-[#1A1612]">Ready to test the research swarm?</h3>
          <p className="text-xs text-[#6E6255]">
            Launch an immediate investigation or inspect interactive terminal chat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/chat" className="btn-secondary text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Chat</span>
          </Link>
          <Link to="/research/new" className="btn-primary text-xs shadow-warm-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Swarm</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
