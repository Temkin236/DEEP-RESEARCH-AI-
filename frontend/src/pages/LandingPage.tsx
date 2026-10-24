import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cpu,
  ArrowRight,
  ShieldCheck,
  Search,
  Layers,
  Database,
  Terminal,
  Activity,
  Zap,
  Network,
  Code2,
  FileCode2,
  CheckCircle2,
  Sparkles,
  CircuitBoard,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroTopic, setHeroTopic] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const teamAgents = [
    {
      role: 'Planner Node',
      action: 'Deconstructing Research Frontiers',
      desc: 'Parses complex technical prompts into structured sub-hypotheses, defines boundary constraints, and generates targeted search vectors.',
      icon: CircuitBoard,
      badge: 'Step 1: Graph Planning',
      codeSnippet: `plan = await planner_agent.decompose(
  topic="Rust vs Go Concurrency Profiles",
  constraints=["latency", "memory_overhead", "gc_pause"]
)`,
    },
    {
      role: 'Researcher Node',
      action: 'Multi-Source Retrieval Swarm',
      desc: 'Dispatches parallel queries across live web search engines and queries local ChromaDB vector collections for ground-truth technical papers.',
      icon: Search,
      badge: 'Step 2: Crawl & Vector RAG',
      codeSnippet: `evidence = await search_swarm.gather(
  queries=plan.subqueries,
  vectorstore="chroma_db",
  max_sources=12
)`,
    },
    {
      role: 'Analyst Node',
      action: 'Synthesis & Trade-Off Benchmarking',
      desc: 'Performs comparative analysis, identifies technical consensus, and cross-checks competing algorithmic claims.',
      icon: Cpu,
      badge: 'Step 3: Synthesis & Benchmarks',
      codeSnippet: `analysis = await analyst_agent.synthesize(
  evidence=evidence,
  extract_benchmarks=True
)`,
    },
    {
      role: 'Verifier Node',
      action: 'Evidence Grounding & Fact Validation',
      desc: 'Eliminates hallucinations by strictly validating every claim against indexed document passages and authentic URLs.',
      icon: ShieldCheck,
      badge: 'Step 4: Hallucination Audit',
      codeSnippet: `audit = await verifier_agent.audit_claims(
  findings=analysis.findings,
  strict_grounding=True
)`,
    },
    {
      role: 'Writer Node',
      action: 'Publishing Comprehensive Tech Report',
      desc: 'Compiles exhaustive 11-section markdown technical documentation complete with comparison tables, limitations, and cited markers.',
      icon: FileCode2,
      badge: 'Step 5: Final Report',
      codeSnippet: `report = await writer_agent.compile_report(
  findings=audit.verified_findings,
  format="markdown_gfm"
)`,
    },
  ];

  const features = [
    {
      icon: Network,
      title: 'Stateful LangGraph Swarm',
      desc: 'Coordinated via state graphs with deterministic transitions between Planner, Researcher, Analyst, and Writer agents.',
    },
    {
      icon: ShieldCheck,
      title: 'Evidence-Grounded Citations',
      desc: 'Eliminates LLM hallucinations by matching every assertion directly to registered source excerpts and web URLs.',
    },
    {
      icon: Database,
      title: 'Local Vector RAG (ChromaDB)',
      desc: 'Embeds and queries local technical papers (PDF, DOCX, MD) with cosine similarity alongside real-time live web crawl.',
    },
    {
      icon: Terminal,
      title: 'Real-Time SSE Telemetry',
      desc: 'Stream workflow events, intermediate findings, and token metrics live to the research console via Server-Sent Events.',
    },
  ];

  const techTopics = [
    'Autonomous AI Agent Architectures: State Machines, Memory & Tool-Use Protocols',
    'Rust vs Go for High-Throughput Distributed Microservices & Cloud Infrastructure',
    'WebAssembly (WASM) & WebGPU: Next-Gen Client-Side AI Inference Runtimes',
    'Quantum Computing vs Classical HPC: Benchmark Frontiers & Hybrid Algorithms',
    'Solid-State Battery Breakthroughs & Commercial Electric Vehicle Scaling',
    'Kubernetes vs Nomad: Operational Complexity vs Scalability at Enterprise Scale',
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroTopic.trim()) {
      navigate(`/research/new?topic=${encodeURIComponent(heroTopic.trim())}`);
    } else {
      navigate('/research/new');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#1F1A15] flex flex-col font-sans warm-grid-bg">
      {/* Header */}
      <header className="border-b border-[#E8E1D7] bg-white/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F6F1EB] border border-[#E8E1D7] flex items-center justify-center text-[#785135]">
              <Cpu className="w-4 h-4 text-[#785135]" />
            </div>
            <div>
              <span className="font-extrabold text-base text-[#1A1612] tracking-tight block leading-none">
                TechResearch <span className="text-[#785135] font-semibold">AI</span>
              </span>
              <span className="text-[10px] text-[#5C5248]">
                Autonomous Multi-Agent Intelligence
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/chat" className="text-xs text-[#5C5248] hover:text-[#785135] transition-colors hidden sm:block">
              Interactive Terminal
            </Link>
            <Link to="/dashboard" className="text-xs text-[#1A1612] hover:text-[#785135] transition-colors font-medium">
              Control Center
            </Link>
            <Link to="/research/new" className="btn-primary text-xs shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Swarm</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F1EB] border border-[#E8E1D7] text-xs font-mono text-[#785135]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#785135] animate-pulse" />
          <span>AUTONOMOUS MULTI-AGENT TECHNOLOGY RESEARCH</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1A1612] leading-tight">
            TechResearch <span className="text-[#785135]">AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#5C5248] font-normal max-w-2xl mx-auto">
            A coordinated team of AI agents writes verified technology reports with zero hallucination.
          </p>
        </div>

        {/* Quick Launch Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-2 card-clean p-2 bg-white border-[#E8E1D7]">
            <div className="relative flex-1 flex items-center">
              <Terminal className="w-4 h-4 absolute left-3.5 text-[#785135]" />
              <input
                type="text"
                value={heroTopic}
                onChange={(e) => setHeroTopic(e.target.value)}
                placeholder="Enter technical query (e.g., Rust vs Go microservice benchmarks)..."
                className="w-full bg-[#FAF8F5] text-[#1A1612] placeholder-[#8C7F73] text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-lg border border-[#E8E1D7] focus:border-[#785135] focus:outline-none font-mono"
              />
            </div>
            <button type="submit" className="btn-primary text-xs sm:text-sm shrink-0 px-5 py-2.5">
              <Zap className="w-4 h-4" />
              <span>Launch Research</span>
            </button>
          </form>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-3xl mx-auto">
          <span className="text-xs text-[#8C7F73] mr-1">Popular:</span>
          {techTopics.slice(0, 3).map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigate(`/research/new?topic=${encodeURIComponent(topic)}`)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E8E1D7] hover:border-[#785135] text-[#5C5248] hover:text-[#1A1612] transition-colors text-left"
            >
              {topic.length > 45 ? topic.slice(0, 42) + '...' : topic}
            </button>
          ))}
        </div>
      </section>

      {/* 3-Step Agent Workflow Pipeline */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-1 mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#785135]">
            // MULTI-AGENT SWARM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1612]">
            How the Autonomous Swarm Operates
          </h2>
          <p className="text-xs text-[#5C5248]">
            Stateful graph coordination between specialized AI worker nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-clean p-6 space-y-3 bg-white border-[#E8E1D7]">
            <div className="w-9 h-9 rounded-xl bg-[#F6F1EB] border border-[#E8E1D7] flex items-center justify-center text-[#785135]">
              <CircuitBoard className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-[#785135] uppercase">
                Step 1: Planning
              </span>
              <h3 className="font-bold text-base text-[#1A1612]">
                Decompose Frontier
              </h3>
            </div>
            <p className="text-xs text-[#5C5248] leading-relaxed">
              Planner parses the inquiry into targeted sub-hypotheses, architectural constraints, and focused search vectors.
            </p>
          </div>

          <div className="card-clean p-6 space-y-3 bg-white border-[#E8E1D7]">
            <div className="w-9 h-9 rounded-xl bg-[#F6F1EB] border border-[#E8E1D7] flex items-center justify-center text-[#785135]">
              <Search className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-[#785135] uppercase">
                Step 2: Retrieval
              </span>
              <h3 className="font-bold text-base text-[#1A1612]">
                Multi-Source Swarm
              </h3>
            </div>
            <p className="text-xs text-[#5C5248] leading-relaxed">
              Parallel execution across live web search engines and local ChromaDB vector collections for ground-truth technical papers.
            </p>
          </div>

          <div className="card-clean p-6 space-y-3 bg-white border-[#E8E1D7]">
            <div className="w-9 h-9 rounded-xl bg-[#F6F1EB] border border-[#E8E1D7] flex items-center justify-center text-[#2E6B4E]">
              <ShieldCheck className="w-4 h-4 text-[#2E6B4E]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-[#2E6B4E] uppercase">
                Step 3: Verification
              </span>
              <h3 className="font-bold text-base text-[#1A1612]">
                Evidence Grounding
              </h3>
            </div>
            <p className="text-xs text-[#5C5248] leading-relaxed">
              Every factual assertion is cross-checked and linked to authentic cited passages before final markdown compilation.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Swarm Node Inspector */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#785135]">
            // SPECIALIZED AGENT SWARM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1612]">
            Inspect the 5 Autonomous Agent Nodes
          </h2>
          <p className="text-xs text-[#5C5248]">
            Click each agent role to inspect its discrete graph responsibilities and Python execution logic.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {teamAgents.map((ag, idx) => {
            const Icon = ag.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={ag.role}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-[#785135] text-white border-[#785135] shadow-sm font-semibold'
                    : 'bg-white text-[#5C5248] border-[#E8E1D7] hover:border-[#785135] hover:text-[#1A1612]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#785135]'}`} />
                <span>{ag.role}</span>
              </button>
            );
          })}
        </div>

        {/* Active Agent Detail Card */}
        <div className="card-clean p-6 bg-white border-[#E8E1D7] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F6F1EB] border border-[#E8E1D7] text-[11px] font-mono text-[#785135]">
              <span>{teamAgents[activeTab].badge}</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#1A1612]">
                {teamAgents[activeTab].action}
              </h3>
              <p className="text-xs text-[#5C5248] leading-relaxed">
                {teamAgents[activeTab].desc}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Link to="/research/new" className="btn-primary text-xs">
                <span>Deploy This Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/dashboard" className="btn-secondary text-xs">
                <span>View Live Telemetry</span>
              </Link>
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="rounded-xl bg-[#1A1612] text-[#F4EBE1] p-4 font-mono text-xs shadow-inner overflow-x-auto border border-[#2D2620]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3A322B] text-[11px] text-[#A8988B]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#785135]" />
                <span>langgraph_swarm_{teamAgents[activeTab].role.toLowerCase().split(' ')[0]}.py</span>
              </div>
              <span className="text-[10px] text-[#2E6B4E]">● state: active</span>
            </div>
            <pre className="text-[11px] leading-relaxed text-[#D8CCC0]">
              <code>{teamAgents[activeTab].codeSnippet}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 w-full">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#785135]">
            // ARCHITECTURE MATRIX
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1612]">
            Engineered for Ground-Truth Technology Research
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="card-clean card-clean-hover p-5 space-y-2.5 bg-white border-[#E8E1D7]">
                <div className="w-8 h-8 rounded-lg bg-[#F6F1EB] border border-[#E8E1D7] flex items-center justify-center text-[#785135]">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#1A1612]">{feat.title}</h3>
                <p className="text-xs text-[#5C5248] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E8E1D7] bg-white py-8 text-xs text-[#5C5248]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#785135]" />
            <span className="font-semibold text-[#1A1612]">TechResearch AI</span> — Autonomous Multi-Agent Tech Intelligence
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link to="/help" className="hover:text-[#785135] transition-colors">Documentation</Link>
            <Link to="/settings" className="hover:text-[#785135] transition-colors">Settings</Link>
            <Link to="/chat" className="hover:text-[#785135] transition-colors">Terminal Chat</Link>
            <a href="/docs" target="_blank" rel="noopener noreferrer" className="text-[#785135] hover:underline transition-colors">
              FastAPI OpenAPI →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
