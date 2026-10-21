import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, BookOpen, FileText, Settings, HelpCircle, Plus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-[#FFFEFC]/90 backdrop-blur-md border-b border-[#E5D8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] flex items-center justify-center text-[#B89576] shadow-warm-sm group-hover:border-[#B89576] transition-colors">
            <Compass className="w-5 h-5 text-[#B89576]" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-[#332B25] tracking-tight block leading-none">
              Deep Research <span className="text-[#B89576]">AI</span>
            </span>
            <span className="text-[11px] font-medium text-[#75685D] tracking-wide uppercase">
              Multi-Agent Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-[#F3EADF] text-[#332B25]'
                : 'text-[#75685D] hover:text-[#332B25] hover:bg-[#FAF7F2]'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/history'
                ? 'bg-[#F3EADF] text-[#332B25]'
                : 'text-[#75685D] hover:text-[#332B25] hover:bg-[#FAF7F2]'
            }`}
          >
            History
          </Link>
          <Link
            to="/documents"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/documents'
                ? 'bg-[#F3EADF] text-[#332B25]'
                : 'text-[#75685D] hover:text-[#332B25] hover:bg-[#FAF7F2]'
            }`}
          >
            Documents
          </Link>
          <Link
            to="/help"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/help'
                ? 'bg-[#F3EADF] text-[#332B25]'
                : 'text-[#75685D] hover:text-[#332B25] hover:bg-[#FAF7F2]'
            }`}
          >
            Help
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link to="/research/new" className="btn-primary text-sm shadow-warm-sm">
            <Plus className="w-4 h-4" />
            <span>New Research</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
