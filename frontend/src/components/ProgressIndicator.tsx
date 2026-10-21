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
    { name: 'Planning', threshold: 20 },
    { name: 'Researching', threshold: 45 },
    { name: 'Analyzing', threshold: 70 },
    { name: 'Verifying', threshold: 85 },
    { name: 'Reporting', threshold: 100 },
  ];

  return (
    <div className="card-warm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'running' && <Loader2 className="w-5 h-5 text-[#B89576] animate-spin" />}
          {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#52785C]" />}
          {status === 'failed' && <AlertCircle className="w-5 h-5 text-[#B6534B]" />}
          {status === 'pending' && <Clock className="w-5 h-5 text-[#B77932]" />}
          <span className="font-semibold text-sm text-[#332B25] capitalize">
            {status === 'completed' ? 'Research Completed' : currentStage || 'Preparing'}
          </span>
        </div>
        <span className="font-mono text-sm font-bold text-[#9B785B]">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#F3EADF] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            status === 'failed'
              ? 'bg-[#B6534B]'
              : status === 'completed'
              ? 'bg-[#52785C]'
              : 'bg-[#B89576]'
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
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isPassed
                    ? 'bg-[#52785C] text-white'
                    : isCurrent
                    ? 'bg-[#B89576] text-white animate-pulse'
                    : 'bg-[#E8D8C5] text-[#75685D]'
                }`}
              >
                {isPassed ? '✓' : ''}
              </div>
              <span
                className={`mt-1 text-[11px] font-medium ${
                  isPassed
                    ? 'text-[#332B25]'
                    : isCurrent
                    ? 'text-[#B89576] font-semibold'
                    : 'text-[#75685D]'
                }`}
              >
                {st.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
