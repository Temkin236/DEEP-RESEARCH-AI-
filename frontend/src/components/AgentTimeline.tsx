import React from 'react';
import {
  Compass,
  Search,
  FileSearch,
  ShieldCheck,
  FileText,
  AlertCircle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { WorkflowEvent } from '../types';

interface AgentTimelineProps {
  events: WorkflowEvent[];
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ events }) => {
  const getAgentIcon = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('planner') || name.includes('coordinator')) {
      return <Compass className="w-4 h-4 text-[#B89576]" />;
    }
    if (name.includes('researcher')) {
      return <Search className="w-4 h-4 text-[#9B785B]" />;
    }
    if (name.includes('analyst')) {
      return <FileSearch className="w-4 h-4 text-[#B77932]" />;
    }
    if (name.includes('verification') || name.includes('verifier')) {
      return <ShieldCheck className="w-4 h-4 text-[#52785C]" />;
    }
    if (name.includes('report') || name.includes('writer')) {
      return <FileText className="w-4 h-4 text-[#332B25]" />;
    }
    return <Info className="w-4 h-4 text-[#75685D]" />;
  };

  const getEventBadgeClass = (eventType: string) => {
    switch (eventType) {
      case 'completion':
        return 'bg-[#52785C]/15 text-[#52785C] border-[#52785C]/30';
      case 'error':
        return 'bg-[#B6534B]/15 text-[#B6534B] border-[#B6534B]/30';
      case 'warning':
        return 'bg-[#B77932]/15 text-[#B77932] border-[#B77932]/30';
      case 'source':
        return 'bg-[#B89576]/15 text-[#9B785B] border-[#B89576]/30';
      case 'finding':
        return 'bg-[#E8D8C5] text-[#332B25] border-[#E5D8C8]';
      default:
        return 'bg-[#F3EADF] text-[#75685D] border-[#E5D8C8]';
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="card-warm p-8 text-center text-[#75685D]">
        <Info className="w-8 h-8 mx-auto text-[#B89576] mb-2 opacity-60" />
        <p className="text-sm">Workflow initialized. Awaiting agent activity...</p>
      </div>
    );
  }

  return (
    <div className="card-warm p-5 space-y-4">
      <h3 className="font-semibold text-sm text-[#332B25] flex items-center justify-between border-b border-[#E5D8C8] pb-3">
        <span>Agent Activity Timeline</span>
        <span className="text-xs font-normal text-[#75685D]">
          {events.length} events logged
        </span>
      </h3>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5D8C8]">
        {events.map((ev, i) => (
          <div key={ev.id || i} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#FFFEFC] border-2 border-[#B89576] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B89576]" />
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E5D8C8]/80 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getAgentIcon(ev.agent_name)}
                  <span className="text-xs font-bold text-[#332B25]">
                    {ev.agent_name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getEventBadgeClass(
                      ev.event_type
                    )}`}
                  >
                    {ev.stage}
                  </span>
                </div>
                <time className="text-[11px] text-[#75685D]">
                  {new Date(ev.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </time>
              </div>

              <p className="text-xs text-[#332B25] leading-relaxed">
                {ev.message}
              </p>

              {ev.payload_json && Object.keys(ev.payload_json).length > 0 && (
                <div className="pt-1.5">
                  <details className="text-[11px] text-[#75685D] cursor-pointer">
                    <summary className="hover:text-[#332B25] select-none font-medium">
                      Inspect event telemetry
                    </summary>
                    <pre className="mt-1.5 p-2 bg-[#F3EADF]/60 rounded-md text-[10px] text-[#332B25] overflow-x-auto border border-[#E5D8C8]">
                      {JSON.stringify(ev.payload_json, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
