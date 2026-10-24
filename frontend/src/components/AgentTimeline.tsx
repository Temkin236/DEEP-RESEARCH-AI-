import React from 'react';
import {
  Cpu,
  Search,
  ShieldCheck,
  FileCode2,
  Terminal,
  Activity,
  ListTree,
} from 'lucide-react';
import { WorkflowEvent } from '../types';

interface AgentTimelineProps {
  events: WorkflowEvent[];
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ events }) => {
  const getAgentIcon = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('planner') || name.includes('coordinator')) {
      return <ListTree className="w-4 h-4 text-[#785135]" />;
    }
    if (name.includes('researcher')) {
      return <Search className="w-4 h-4 text-[#785135]" />;
    }
    if (name.includes('analyst')) {
      return <Cpu className="w-4 h-4 text-[#785135]" />;
    }
    if (name.includes('verification') || name.includes('verifier')) {
      return <ShieldCheck className="w-4 h-4 text-[#3D7055]" />;
    }
    if (name.includes('report') || name.includes('writer')) {
      return <FileCode2 className="w-4 h-4 text-[#785135]" />;
    }
    return <Terminal className="w-4 h-4 text-[#6E6255]" />;
  };

  const getEventBadgeClass = (eventType: string) => {
    switch (eventType) {
      case 'completion':
        return 'bg-[#EAF3ED] text-[#2D5A42] border-[#C5DEC8]';
      case 'error':
        return 'bg-[#FDF2F2] text-[#A63D38] border-[#F7D7D6]';
      case 'warning':
        return 'bg-[#FEF5EA] text-[#8C5212] border-[#F3DFC1]';
      case 'source':
        return 'bg-[#F4EBE1] text-[#785135] border-[#E0D5C7]';
      case 'finding':
        return 'bg-[#F0EBE5] text-[#523A25] border-[#DDD3C7]';
      default:
        return 'bg-[#F6F1EB] text-[#6E6255] border-[#E8E1D7]';
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="card-clean p-8 text-center text-[#6E6255] space-y-2 bg-white">
        <Activity className="w-8 h-8 mx-auto text-[#785135]/60 animate-pulse" />
        <p className="text-sm font-mono">Agent swarm initialized. Awaiting pipeline telemetry...</p>
      </div>
    );
  }

  return (
    <div className="card-clean p-5 space-y-4 bg-white border border-[#E8E1D7]">
      <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#785135]" />
          <h3 className="font-semibold text-sm text-[#1A1612] font-mono uppercase tracking-wider">
            Agent Execution Stream
          </h3>
        </div>
        <span className="text-xs font-mono text-[#785135] bg-[#F6F1EB] border border-[#E8E1D7] px-2 py-0.5 rounded">
          {events.length} Telemetry Events
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E1D7]">
        {events.map((ev, i) => (
          <div key={ev.id || i} className="relative group">
            {/* Timeline Node */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#785135] flex items-center justify-center shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#785135]" />
            </div>

            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E1D7] space-y-1.5 hover:border-[#D6C8B8] transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getAgentIcon(ev.agent_name)}
                  <span className="text-xs font-bold text-[#1A1612] font-mono">
                    {ev.agent_name}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${getEventBadgeClass(
                      ev.event_type
                    )}`}
                  >
                    {ev.stage}
                  </span>
                </div>
                <time className="text-[11px] font-mono text-[#8C7F73]">
                  {new Date(ev.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </time>
              </div>

              <p className="text-xs text-[#2D251E] leading-relaxed font-sans">
                {ev.message}
              </p>

              {ev.payload_json && Object.keys(ev.payload_json).length > 0 && (
                <div className="pt-1.5">
                  <details className="text-[11px] font-mono text-[#5C5248] cursor-pointer group/details">
                    <summary className="hover:text-[#785135] select-none font-medium transition-colors">
                      [+] View Payload Telemetry
                    </summary>
                    <pre className="mt-1.5 p-2 bg-[#F6F1EB] rounded-md text-[10px] text-[#42382F] overflow-x-auto border border-[#E8E1D7] font-mono">
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
