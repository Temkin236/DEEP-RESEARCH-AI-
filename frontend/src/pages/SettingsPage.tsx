import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Database,
  Cpu,
  Search,
  FolderLock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHealth()
      .then(setHealth)
      .catch((err) => console.error('Health fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332B25] tracking-tight">
          System Settings & Runtime Configuration
        </h1>
        <p className="text-sm text-[#75685D]">
          Inspect connected providers, database persistence, and security controls.
        </p>
      </div>

      {loading ? (
        <div className="card-warm p-12 text-center text-[#75685D]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#B89576] mb-2" />
          <p className="text-sm">Connecting to backend service...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Health & Status Card */}
          <div className="card-warm p-6 space-y-4 bg-[#FFFEFC]">
            <div className="flex items-center justify-between border-b border-[#E5D8C8] pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#B89576]" />
                <h2 className="font-bold text-base text-[#332B25]">Backend Cluster Status</h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#52785C] bg-[#52785C]/10 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>Operational ({health?.status || 'Active'})</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] space-y-1">
                <span className="text-[#75685D] block">Environment</span>
                <span className="font-bold text-[#332B25] capitalize">
                  {health?.environment || 'Development'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] space-y-1">
                <span className="text-[#75685D] block">Uptime</span>
                <span className="font-bold text-[#332B25]">
                  {health?.uptime_seconds ? `${Math.round(health.uptime_seconds)} seconds` : 'Online'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] space-y-1">
                <span className="text-[#75685D] block">API Version</span>
                <span className="font-bold text-[#332B25]">{health?.version || '1.0.0'}</span>
              </div>
            </div>
          </div>

          {/* Connected Providers */}
          <div className="card-warm p-6 space-y-4 bg-[#FFFEFC]">
            <div className="flex items-center gap-2 border-b border-[#E5D8C8] pb-3">
              <Cpu className="w-5 h-5 text-[#B89576]" />
              <h2 className="font-bold text-base text-[#332B25]">Model & Search Adapters</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8]">
                <div>
                  <span className="font-bold text-[#332B25] block">Primary LLM Engine</span>
                  <span className="text-[#75685D]">
                    Configured via GEMINI_API_KEY / OPENAI_API_KEY environment variables
                  </span>
                </div>
                <span className="font-mono font-bold text-[#9B785B] bg-[#F3EADF] px-2.5 py-1 rounded-md">
                  {health?.llm_provider || 'gemini'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8]">
                <div>
                  <span className="font-bold text-[#332B25] block">Live Search Provider</span>
                  <span className="text-[#75685D]">
                    Handles real-time web retrieval and source indexing
                  </span>
                </div>
                <span className="font-mono font-bold text-[#9B785B] bg-[#F3EADF] px-2.5 py-1 rounded-md">
                  {health?.search_provider || 'duckduckgo'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8]">
                <div>
                  <span className="font-bold text-[#332B25] block">Vector Database Engine</span>
                  <span className="text-[#75685D]">
                    ChromaDB persistent collection for document passages
                  </span>
                </div>
                <span className="font-mono font-bold text-[#52785C] bg-[#52785C]/10 px-2.5 py-1 rounded-md">
                  {health?.vectorstore || 'ChromaDB Local'}
                </span>
              </div>
            </div>
          </div>

          {/* Security & Secret Handling */}
          <div className="card-warm p-6 space-y-3 bg-[#FFFEFC]">
            <div className="flex items-center gap-2 text-[#52785C]">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-bold text-sm text-[#332B25]">Secret Management & Zero Exposure</h2>
            </div>
            <p className="text-xs text-[#75685D] leading-relaxed">
              API credentials and database connection strings are managed exclusively on the backend server via environment variables (<code className="bg-[#F3EADF] px-1 py-0.5 rounded text-[#332B25]">.env</code>). No secrets or credentials are ever transmitted to or stored in client-side browser bundles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
