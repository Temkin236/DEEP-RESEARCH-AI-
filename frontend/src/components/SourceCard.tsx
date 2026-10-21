import React from 'react';
import { ExternalLink, Globe, FileText, ShieldCheck } from 'lucide-react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
  index?: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const isDoc = source.source_type === 'document';
  const isDemo = source.source_type === 'mock_demo';

  return (
    <div className="card-warm card-warm-hover p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#F3EADF] text-[#9B785B] text-xs font-bold border border-[#E5D8C8]">
            {index !== undefined ? index : source.index || '#'}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#75685D] border border-[#E5D8C8]">
            {source.domain || (isDoc ? 'Document RAG' : 'Web')}
          </span>
          {isDemo && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8D8C5] text-[#332B25]">
              Demo Source
            </span>
          )}
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#9B785B] hover:text-[#332B25] transition-colors p-1"
          title="Open Source Link"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <h4 className="font-semibold text-sm text-[#332B25] line-clamp-2 hover:text-[#9B785B] transition-colors">
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {source.title}
        </a>
      </h4>

      {source.snippet && (
        <p className="text-xs text-[#75685D] line-clamp-3 leading-relaxed">
          "{source.snippet}"
        </p>
      )}

      <div className="flex items-center justify-between text-[11px] text-[#75685D] pt-2 border-t border-[#E5D8C8]/60">
        <div className="flex items-center gap-1.5">
          {isDoc ? <FileText className="w-3.5 h-3.5 text-[#B89576]" /> : <Globe className="w-3.5 h-3.5 text-[#B89576]" />}
          <span>{source.publication_date || 'Retrieved via Live Search'}</span>
        </div>
        <div className="flex items-center gap-1 text-[#52785C] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified ({Math.round(source.reliability_score * 100)}%)</span>
        </div>
      </div>
    </div>
  );
};
