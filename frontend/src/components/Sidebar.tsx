import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Terminal,
  Zap,
  History,
  Database,
  Settings,
  Code2,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Control Center', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Interactive Terminal', path: '/chat', icon: Terminal },
    { label: 'Launch Research', path: '/research/new', icon: Zap },
    { label: 'Research Registry', path: '/history', icon: History },
    { label: 'Vector Knowledge Base', path: '/documents', icon: Database },
    { label: 'System Settings', path: '/settings', icon: Settings },
    { label: 'Architecture Specs', path: '/help', icon: Code2 },
  ];

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-white/70 border-r border-[#E8E1D7] flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto z-20 backdrop-blur-md">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#785135] uppercase">
              // AGENT SWARM
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#785135] animate-pulse" />
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F6F1EB] text-[#785135] font-semibold border border-[#E8E1D7]'
                        : 'text-[#5C5248] hover:bg-[#F6F1EB]/60 hover:text-[#1A1612] border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#785135] shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Multi-Agent Orchestration Status */}
        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D7] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#1A1612] font-semibold">
              <Cpu className="w-3.5 h-3.5 text-[#785135]" />
              <span>Orchestrator</span>
            </span>
            <span className="text-[#2E6B4E] font-medium text-[10px] bg-[#EAF3ED] border border-[#C5DEC8] px-1.5 py-0.2 rounded">
              Ready
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-[#5C5248]">
            <div className="flex items-center justify-between">
              <span>Graph:</span>
              <span className="text-[#1A1612] font-medium">LangGraph</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Vector DB:</span>
              <span className="text-[#1A1612] font-medium">ChromaDB</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Live Search:</span>
              <span className="text-[#1A1612] font-medium">DuckDuckGo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Shield Badge */}
      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E1D7]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E6B4E]">
          <ShieldCheck className="w-4 h-4 text-[#2E6B4E] shrink-0" />
          <span>Evidence Grounded</span>
        </div>
        <p className="text-[11px] text-[#5C5248] mt-1 leading-normal">
          Automated multi-agent verification checks every claim against the registered evidence index.
        </p>
      </div>
    </aside>
  );
};
