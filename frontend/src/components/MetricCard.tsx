import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="card-warm p-5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#75685D] uppercase tracking-wider">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E5D8C8] flex items-center justify-center text-[#B89576]">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold font-mono text-[#332B25]">{value}</span>
        {trend && (
          <span className="text-xs font-semibold text-[#52785C] bg-[#52785C]/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-[#75685D]">{subtext}</p>}
    </div>
  );
};
