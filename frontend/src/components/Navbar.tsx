import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Cpu,
  Menu,
  X,
  LayoutDashboard,
  Terminal,
  History,
  Database,
  HelpCircle,
  Settings,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const checkHealth = async () => {
    const start = performance.now();
    try {
      setSystemStatus('checking');
      await api.getHealth();
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setSystemStatus('online');
    } catch {
      setSystemStatus('offline');
      setLatencyMs(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Terminal Chat', path: '/chat', icon: Terminal },
    { label: 'Neural History', path: '/history', icon: History },
    { label: 'Vector Knowledge', path: '/documents', icon: Database },
    { label: 'Tech Specs', path: '/help', icon: HelpCircle },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E1D7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#F6F1EB] border border-[#E8E1D7] flex items-center justify-center text-[#785135] group-hover:border-[#785135]/40 transition-colors">
            <Cpu className="w-4 h-4 text-[#785135]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-[#1A1612] tracking-tight">
                TechResearch <span className="text-[#785135] font-semibold">AI</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F6F1EB] border border-[#E8E1D7] text-[#785135] font-medium">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-[#5C5248] hidden sm:block tracking-wide">
              Autonomous Multi-Agent Tech Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.slice(0, 5).map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F6F1EB] text-[#785135] font-semibold border border-[#E8E1D7]'
                    : 'text-[#5C5248] hover:text-[#1A1612] hover:bg-[#F6F1EB]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#785135]' : 'text-[#8C7F73]'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status + CTA + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Health indicator */}
          <button
            type="button"
            onClick={checkHealth}
            title="Backend agent status (Click to ping)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E1D7] text-[11px] font-mono text-[#5C5248] hover:text-[#1A1612] hover:border-[#D6C8B8] transition-colors"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                systemStatus === 'online'
                  ? 'bg-[#2E6B4E]'
                  : systemStatus === 'checking'
                  ? 'bg-[#B3681E] animate-pulse'
                  : 'bg-[#A83A35]'
              }`}
            />
            <span className="hidden xs:inline">
              {systemStatus === 'online'
                ? `${latencyMs ?? 10}ms`
                : systemStatus === 'checking'
                ? 'Pinging...'
                : 'Offline'}
            </span>
          </button>

          <Link
            to="/research/new"
            className="btn-primary text-xs sm:text-sm px-3.5 py-1.5 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Launch Research</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#5C5248] hover:text-[#1A1612] hover:bg-[#F6F1EB] border border-[#E8E1D7] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E1D7] bg-white px-4 pt-3 pb-5 space-y-1 shadow-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F6F1EB] text-[#785135] font-semibold border border-[#E8E1D7]'
                    : 'text-[#5C5248] hover:bg-[#F6F1EB]/60 hover:text-[#1A1612]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#785135]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
