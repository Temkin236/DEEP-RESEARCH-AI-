import React from 'react';
import { CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Finding } from '../types';

interface FindingCardProps {
  finding: Finding;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  return (
    <div className="card-clean p-4 space-y-2.5 border-[#E8E1D7] bg-white hover:border-[#D6C8B8] transition-colors">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-[#F6F1EB] text-[#785135] border border-[#E8E1D7]">
          <Layers className="w-3.5 h-3.5 text-[#785135]" />
          <span>{finding.subquestion}</span>
        </span>
        <div className="flex items-center gap-1 text-xs font-mono">
          {finding.is_disputed ? (
            <span className="flex items-center gap-1 text-[#8C5212] font-semibold bg-[#FEF5EA] border border-[#F3DFC1] px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B3681E]" />
              <span>Contested Claim</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#2E6B4E] font-semibold bg-[#EAF3ED] border border-[#C5DEC8] px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4E]" />
              <span>Confidence: {Math.round(finding.confidence * 100)}%</span>
            </span>
          )}
        </div>
      </div>

      <p className="text-sm font-medium text-[#1A1612] leading-relaxed">
        {finding.claim}
      </p>

      {finding.evidence_excerpt && (
        <div className="bg-[#FAF8F5] p-3 rounded-lg border-l-2 border-[#785135] text-xs text-[#42382F] italic font-mono leading-relaxed">
          "{finding.evidence_excerpt}"
        </div>
      )}
    </div>
  );
};
