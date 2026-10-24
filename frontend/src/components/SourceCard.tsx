import React from 'react';
import { ExternalLink, Globe, FileCode2, ShieldCheck, Database } from 'lucide-react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
  index?: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const isDoc = source.source_type === 'document';
  const isDemo = source.source_type === 'mock_demo';

  return (
    <div className="card-clean card-clean-hover p-4 space-y-2 border-[#E8E1D7] bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap font-mono">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#F6F1EB] text-[#785135] text-xs font-bold border border-[#E8E1D7]">
            {index !== undefined ? index : source.index || '#'}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#5C5248] border border-[#E8E1D7]">
            {source.domain || (isDoc ? 'Vector RAG' : 'Web Crawler')}
          </span>
          {isDemo && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F6F1EB] text-[#785135] border border-[#E8E1D7]">
              Demo Corpus
            </span>
          )}
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#785135] hover:text-[#623F27] transition-colors p-1.5 rounded-lg hover:bg-[#F6F1EB]"
          title="Open External Source"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <h4 className="font-semibold text-sm text-[#1A1612] line-clamp-2 hover:text-[#785135] transition-colors">
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {source.title}
        </a>
      </h4>

      {source.snippet && (
        <p className="text-xs text-[#5C5248] line-clamp-3 leading-relaxed font-sans">
          "{source.snippet}"
        </p>
      )}

      <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5248] pt-2 border-t border-[#E8E1D7]">
        <div className="flex items-center gap-1.5">
          {isDoc ? <Database className="w-3.5 h-3.5 text-[#785135]" /> : <Globe className="w-3.5 h-3.5 text-[#785135]" />}
          <span>{source.publication_date || 'Indexed via Real-Time Web'}</span>
        </div>
        <div className="flex items-center gap-1 text-[#2E6B4E] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B4E]" />
          <span>Reliability: {Math.round(source.reliability_score * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
