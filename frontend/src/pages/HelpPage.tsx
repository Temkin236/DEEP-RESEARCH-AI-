import React from 'react';
import {
  HelpCircle,
  Compass,
  Search,
  FileSearch,
  ShieldCheck,
  FileText,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const agents = [
    {
      name: 'Agent 1: Research Planner / Coordinator',
      icon: Compass,
      desc: 'Interprets the user research inquiry, delineates scope boundaries, and breaks down the topic into 3-4 granular subquestions with targeted search queries.',
    },
    {
      name: 'Agent 2: Researcher',
      icon: Search,
      desc: 'Executes web searches across live search engines and queries ChromaDB for relevant uploaded document chunks. Gathers snippets, publication dates, and URLs into a deduplicated registry.',
    },
    {
      name: 'Agent 3: Analyst',
      icon: FileSearch,
      desc: 'Critically evaluates evidence across multiple sources, synthesizes core themes, identifies consensus, and highlights trade-offs or conflicting statements.',
    },
    {
      name: 'Agent 4: Verification Agent',
      icon: ShieldCheck,
      desc: 'Fact-checks candidate claims against evidence excerpts, flags unsupported statements, verifies URL accessibility, and triggers follow-up queries if evidence is insufficient.',
    },
    {
      name: 'Agent 5: Report Writer',
      icon: FileText,
      desc: 'Drafts the final 11-section structured markdown report, linking every claim directly to verified sources via [1], [2] citation markers.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332B25] tracking-tight">
          System Guide & Documentation
        </h1>
        <p className="text-sm text-[#75685D]">
          Understand the multi-agent workflow, citation guarantees, and system boundaries.
        </p>
      </div>

      {/* Workflow Architecture */}
      <div className="card-warm p-6 space-y-4 bg-[#FFFEFC]">
        <h2 className="text-base font-bold text-[#332B25] flex items-center gap-2 border-b border-[#E5D8C8] pb-3">
          <Compass className="w-5 h-5 text-[#B89576]" />
          <span>The 5 Specialized Agents</span>
        </h2>

        <div className="space-y-4">
          {agents.map((ag) => {
            const Icon = ag.icon;
            return (
              <div key={ag.name} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8]">
                <div className="w-8 h-8 rounded-lg bg-[#FFFEFC] border border-[#E5D8C8] flex items-center justify-center text-[#B89576] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xs text-[#332B25]">{ag.name}</h3>
                  <p className="text-xs text-[#75685D] leading-relaxed">{ag.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Citation Engine Details */}
      <div className="card-warm p-6 space-y-3 bg-[#FFFEFC]">
        <h2 className="text-base font-bold text-[#332B25] flex items-center gap-2 border-b border-[#E5D8C8] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#52785C]" />
          <span>Evidence Registry & Citation Verification</span>
        </h2>
        <p className="text-xs text-[#75685D] leading-relaxed">
          Deep Research AI employs a centralized evidence registry. Every retrieved source is assigned a permanent numeric index. When the report writer drafts paragraphs, citations are checked against registered sources. Any citation that does not correspond to an authentic collected source is automatically pruned or flagged.
        </p>
      </div>

      {/* Document RAG Details */}
      <div className="card-warm p-6 space-y-3 bg-[#FFFEFC]">
        <h2 className="text-base font-bold text-[#332B25] flex items-center gap-2 border-b border-[#E5D8C8] pb-3">
          <BookOpen className="w-5 h-5 text-[#B89576]" />
          <span>Document RAG (Retrieval-Augmented Generation)</span>
        </h2>
        <p className="text-xs text-[#75685D] leading-relaxed">
          Users can upload PDF, DOCX, TXT, or Markdown documents in the Document Library. Text is chunked with 200-character overlap and indexed into ChromaDB. When starting a research inquiry, selecting documents ensures internal company files or specific papers are queried alongside the web.
        </p>
      </div>

      {/* Known Limitations */}
      <div className="bg-[#FAF7F2] border-l-4 border-[#B77932] p-5 rounded-r-xl space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#B77932] flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Known Limitations</span>
        </h3>
        <ul className="list-disc pl-4 space-y-1 text-xs text-[#75685D]">
          <li>Web pages behind paywalls, captchas, or login screens cannot be accessed by crawler agents.</li>
          <li>Scanned PDFs without an embedded text layer require OCR prior to upload.</li>
          <li>Automated verification reduces hallucination risks but does not replace human editorial review.</li>
        </ul>
      </div>
    </div>
  );
};
