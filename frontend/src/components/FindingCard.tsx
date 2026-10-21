import React from 'react';
import { CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Finding } from '../types';

interface FindingCardProps {
  finding: Finding;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  return (
    <div className="card-warm p-4 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F3EADF] text-[#332B25] border border-[#E5D8C8]">
          <Layers className="w-3.5 h-3.5 text-[#9B785B]" />
          <span>{finding.subquestion}</span>
        </span>
        <div className="flex items-center gap-1 text-xs">
          {finding.is_disputed ? (
            <span className="flex items-center gap-1 text-[#B77932] font-semibold bg-[#F3EADF] px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Divergence / Disputed</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#52785C] font-semibold bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E5D8C8]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confidence {Math.round(finding.confidence * 100)}%</span>
            </span>
          )}
        </div>
      </div>

      <p className="text-sm font-medium text-[#332B25] leading-relaxed">
        {finding.claim}
      </p>

      {finding.evidence_excerpt && (
        <div className="bg-[#FAF7F2] p-2.5 rounded-lg border-l-2 border-[#B89576] text-xs text-[#75685D] italic">
          "{finding.evidence_excerpt}"
        </div>
      )}
    </div>
  );
};
