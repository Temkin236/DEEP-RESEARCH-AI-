import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-clean card-clean-hover p-4 sm:p-5 space-y-2 relative overflow-hidden bg-white border border-[#E8E1D7] ${
        onClick ? 'cursor-pointer hover:border-[#785135]/50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-medium text-[#5C5248] uppercase tracking-wider">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#F6F1EB] border border-[#E8E1D7] flex items-center justify-center text-[#785135]">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1A1612] tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-[10px] font-mono font-semibold text-[#2E6B4E] bg-[#EAF3ED] border border-[#C5DEC8] px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-[#5C5248] leading-tight">{subtext}</p>}
    </div>
  );
};
