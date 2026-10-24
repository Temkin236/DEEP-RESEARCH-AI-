import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import {
  LayoutDashboard,
  Terminal,
  Zap,
  History,
  Database,
  Compass,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] tech-canvas-bg text-[#1A1612] flex flex-col font-sans antialiased">
      <Navbar />
      <div className="flex-1 flex items-start max-w-7xl w-full mx-auto pb-16 lg:pb-0">
        <Sidebar />
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile & Tablet Fixed Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8E1D7] z-40 px-2 py-1 flex items-center justify-around shadow-warm-md pb-[max(0.35rem,env(safe-area-inset-bottom))]"
        aria-label="Mobile Navigation"
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
              isActive ? 'text-[#785135] font-bold' : 'text-[#6E6255] hover:text-[#1A1612]'
            }`
          }
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
              isActive ? 'text-[#785135] font-bold' : 'text-[#6E6255] hover:text-[#1A1612]'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        {/* Central Prominent Launch Button */}
        <NavLink
          to="/research/new"
          className="flex flex-col items-center justify-center -mt-3.5 w-11 h-11 rounded-full bg-[#785135] hover:bg-[#5E3D24] text-white shadow-warm-md transition-transform active:scale-95"
          title="Launch New Tech Research"
          aria-label="Launch Research"
        >
          <Zap className="w-5 h-5 fill-white/20" />
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
              isActive ? 'text-[#785135] font-bold' : 'text-[#6E6255] hover:text-[#1A1612]'
            }`
          }
        >
          <Terminal className="w-4 h-4" />
          <span>Terminal</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
              isActive ? 'text-[#785135] font-bold' : 'text-[#6E6255] hover:text-[#1A1612]'
            }`
          }
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
              isActive ? 'text-[#785135] font-bold' : 'text-[#6E6255] hover:text-[#1A1612]'
            }`
          }
        >
          <Database className="w-4 h-4" />
          <span>Docs</span>
        </NavLink>
      </nav>
    </div>
  );
};
