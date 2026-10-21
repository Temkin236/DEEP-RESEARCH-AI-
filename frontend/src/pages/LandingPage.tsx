import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Search,
  FileText,
  Layers,
  Cpu,
  BookOpen,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const workflowSteps = [
    { title: '1. Plan', desc: 'Deconstructs inquiries into focused subquestions with targeted search queries.' },
    { title: '2. Research', desc: 'Queries live web sources and user-uploaded documents in parallel.' },
    { title: '3. Analyze', desc: 'Cross-evaluates multi-source evidence and separates facts from assumptions.' },
    { title: '4. Verify', desc: 'Strictly validates citations against the evidence registry before drafting.' },
    { title: '5. Report', desc: 'Assembles an authoritative, publication-quality report with grounded citations.' },
  ];

  const features = [
    {
      icon: Cpu,
      title: 'Multi-Agent Collaboration',
      desc: 'Orchestrated via LangGraph with stateful transitions between specialized agents.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Citations & Grounding',
      desc: 'Eliminates hallucinations by matching claims directly to registered source excerpts.',
    },
    {
      icon: BookOpen,
      title: 'Document RAG Integration',
      desc: 'Index and retrieve PDF, DOCX, TXT, and Markdown documents into Chroma vector store.',
    },
    {
      icon: FileText,
      title: 'Structured Executive Reports',
      desc: 'Generates comprehensive analyses with comparison tables, limitations, and recommendations.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#332B25] flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#E5D8C8] bg-[#FFFEFC]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] flex items-center justify-center text-[#B89576]">
              <Compass className="w-5 h-5 text-[#B89576]" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#332B25] tracking-tight block leading-none">
                Deep Research <span className="text-[#B89576]">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-[#75685D] tracking-wider uppercase">
                Multi-Agent System
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-semibold text-[#75685D] hover:text-[#332B25]">
              Dashboard
            </Link>
            <Link to="/research/new" className="btn-primary text-sm shadow-warm-sm">
              <span>Start Research</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EADF] border border-[#E5D8C8] text-xs font-semibold text-[#9B785B]">
          <ShieldCheck className="w-4 h-4 text-[#52785C]" />
          <span>Production-Grade Multi-Agent Research Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#332B25] leading-tight">
          Investigate deeply. <br className="hidden sm:inline" />
          <span className="text-[#9B785B]">Verify rigorously.</span> Report with confidence.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#75685D] leading-relaxed">
          Deep Research AI deploys an autonomous team of specialized agents—Planner, Researcher, Analyst, Verifier, and Reporter—to investigate complex questions, cross-check claims against verifiable evidence, and generate comprehensive research dossiers without hallucinated citations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/research/new" className="btn-primary px-6 py-3 text-base shadow-warm-md w-full sm:w-auto">
            <span>Start a Research Job</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/dashboard" className="btn-secondary px-6 py-3 text-base w-full sm:w-auto">
            <span>Explore Workspace</span>
          </Link>
        </div>
      </section>

      {/* Workflow Diagram */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="card-warm p-8 space-y-6 bg-[#FFFEFC]">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9B785B]">
              Autonomous Workflow
            </span>
            <h2 className="text-2xl font-bold text-[#332B25]">
              How the Multi-Agent System Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.title}
                className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E5D8C8] space-y-2 relative"
              >
                <div className="text-sm font-bold text-[#9B785B]">{step.title}</div>
                <p className="text-xs text-[#75685D] leading-relaxed">{step.desc}</p>
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#E8D8C5] text-[#332B25] flex items-center justify-center text-xs font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9B785B]">
            Engineered for Truth
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#332B25]">
            Built to Eliminate Hallucinations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="card-warm card-warm-hover p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] flex items-center justify-center text-[#B89576]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#332B25]">{feat.title}</h3>
                <p className="text-xs text-[#75685D] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-[#F3EADF]/70 border border-[#E5D8C8] rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#9B785B]" />
            <h3 className="text-lg font-bold text-[#332B25]">
              Enterprise-Grade Security & Isolation
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#75685D] leading-relaxed">
            All external web retrievals pass through strict Server-Side Request Forgery (SSRF) filters preventing loopback or internal subnet egress. Retrieved content is sanitized and isolated within untrusted boundaries to prevent prompt injection attacks. Document embeddings are securely persisted in ChromaDB without unauthorized data leaking.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E5D8C8] bg-[#FFFEFC] py-8 text-center text-xs text-[#75685D]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#332B25]">Deep Research AI</span> — Multi-Agent Research System
          </div>
          <div className="flex items-center gap-6">
            <Link to="/help" className="hover:text-[#332B25]">Documentation</Link>
            <Link to="/settings" className="hover:text-[#332B25]">Settings</Link>
            <a href="/docs" target="_blank" rel="noopener noreferrer" className="hover:text-[#332B25]">
              FastAPI OpenAPI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
