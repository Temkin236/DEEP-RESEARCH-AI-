import React from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { JobStatus } from '../types';

interface ProgressIndicatorProps {
  progress: number;
  currentStage: string;
  status: JobStatus;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  currentStage,
  status,
}) => {
  const stages = [
    { name: 'Planning', sub: 'Sub-queries & Scope', threshold: 20 },
    { name: 'Retrieval', sub: 'Web & Vector RAG', threshold: 45 },
    { name: 'Analysis', sub: 'Evidence Extraction', threshold: 70 },
    { name: 'Verification', sub: 'Citation Validation', threshold: 85 },
    { name: 'Report', sub: 'Report Synthesis', threshold: 100 },
  ];

  return (
    <div className="card-clean p-5 space-y-4 bg-white border border-[#E8E1D7]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {status === 'running' && <Loader2 className="w-5 h-5 text-[#785135] animate-spin" />}
          {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#2E6B4E]" />}
          {status === 'failed' && <AlertCircle className="w-5 h-5 text-[#A83A35]" />}
          {status === 'pending' && <Clock className="w-5 h-5 text-[#B3681E]" />}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#1A1612] font-mono uppercase tracking-wide">
              {status === 'completed' ? 'Research Pipeline Complete' : currentStage || 'Initializing Swarm'}
            </span>
            {status === 'running' && (
              <span className="inline-flex h-2 w-2 rounded-full bg-[#785135] animate-ping" />
            )}
          </div>
        </div>
        <span className="font-mono text-sm font-bold text-[#785135] bg-[#F6F1EB] border border-[#E8E1D7] px-2.5 py-0.5 rounded-full">
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#F6F1EB] rounded-full overflow-hidden border border-[#E8E1D7]">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            status === 'failed'
              ? 'bg-[#A83A35]'
              : status === 'completed'
              ? 'bg-[#2E6B4E]'
              : 'bg-gradient-to-r from-[#C7A788] to-[#785135]'
          }`}
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Stage milestones */}
      <div className="grid grid-cols-5 gap-2 pt-2 text-center text-xs">
        {stages.map((st) => {
          const isPassed = progress >= st.threshold || status === 'completed';
          const isCurrent =
            status === 'running' &&
            progress < st.threshold &&
            progress >= st.threshold - 25;
          return (
            <div key={st.name} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                  isPassed
                    ? 'bg-[#2E6B4E] text-white'
                    : isCurrent
                    ? 'bg-[#785135] text-white animate-pulse'
                    : 'bg-[#F6F1EB] text-[#8C7F73] border border-[#E8E1D7]'
                }`}
              >
                {isPassed ? '✓' : ''}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-mono font-medium leading-none ${
                  isPassed
                    ? 'text-[#1A1612]'
                    : isCurrent
                    ? 'text-[#785135] font-bold'
                    : 'text-[#8C7F73]'
                }`}
              >
                {st.name}
              </span>
              <span className="hidden sm:block text-[9px] text-[#5C5248] mt-0.5 leading-tight font-mono">
                {st.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
