import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  FolderOpen,
  Settings,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Research', path: '/research/new', icon: PlusCircle },
    { label: 'Research History', path: '/history', icon: History },
    { label: 'Document Library', path: '/documents', icon: FolderOpen },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'System Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-[#F3EADF]/60 border-r border-[#E5D8C8] flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-[#75685D] uppercase px-3">
            Research Workspace
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E8D8C5] text-[#332B25] font-semibold shadow-warm-sm'
                        : 'text-[#75685D] hover:bg-[#FAF7F2] hover:text-[#332B25]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#9B785B]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Verification Badge */}
      <div className="p-3 bg-[#FFFEFC] rounded-xl border border-[#E5D8C8] shadow-warm-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52785C]">
          <ShieldCheck className="w-4 h-4 text-[#52785C]" />
          <span>Evidence Grounded</span>
        </div>
        <p className="text-[11px] text-[#75685D] mt-1 leading-tight">
          Automated multi-agent verification checks every claim against the evidence registry.
        </p>
      </div>
    </aside>
  );
};
