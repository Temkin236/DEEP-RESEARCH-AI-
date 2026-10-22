import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Server,
  Database,
  Cpu,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Plus,
  FolderOpen,
} from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    const start = performance.now();
    try {
      setTesting(true);
      setError(null);
      const data = await api.getHealth();
      const end = performance.now();
      setHealth(data);
      setLatency(Math.round(end - start));
    } catch (err: any) {
      setError(err.message || 'Connection test failed.');
    } finally {
      setTesting(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const sampleEnv = `# Deep Research AI Environment Configuration
ENVIRONMENT=development
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Optional OpenAI Provider
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o-mini

# Search Provider (duckduckgo requires no key!)
SEARCH_PROVIDER=duckduckgo
TAVILY_API_KEY=
SERPER_API_KEY=

# Persistence
DATABASE_URL=sqlite:///./deep_research.db
CHROMA_PERSIST_DIRECTORY=./chroma_db
`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332B25] tracking-tight">
            System Settings & Runtime Configuration
          </h1>
          <p className="text-sm text-[#75685D]">
            Inspect connected providers, test database persistence, and configure API parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={checkConnection}
          disabled={testing}
          className="btn-secondary text-xs shadow-warm-sm flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing...' : 'Test Backend Connection'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-[#B6534B]/10 border border-[#B6534B]/30 rounded-xl flex items-center gap-3 text-sm text-[#B6534B]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
              <div className="flex items-center gap-2">
                {latency !== null && (
                  <span className="text-[11px] font-mono text-[#75685D] bg-[#FAF7F2] border border-[#E5D8C8] px-2 py-0.5 rounded">
                    {latency} ms
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#52785C] bg-[#52785C]/10 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Operational ({health?.status || 'Active'})</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
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
                <span className="text-[#75685D] block">Relational Database</span>
                <span className="font-bold text-[#52785C]">
                  {health?.database || 'Healthy'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8] space-y-1">
                <span className="text-[#75685D] block">Vector Store</span>
                <span className="font-bold text-[#52785C]">
                  {health?.vectorstore || 'ChromaDB Local'}
                </span>
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
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8]">
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

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D8C8]">
                <div>
                  <span className="font-bold text-[#332B25] block">Live Search Provider</span>
                  <span className="text-[#75685D]">
                    Handles real-time web retrieval and source indexing (DuckDuckGo operates with 0 keys!)
                  </span>
                </div>
                <span className="font-mono font-bold text-[#9B785B] bg-[#F3EADF] px-2.5 py-1 rounded-md">
                  {health?.search_provider || 'duckduckgo'}
                </span>
              </div>
            </div>
          </div>

          {/* Configuration Template Snippet */}
          <div className="card-warm p-6 space-y-4 bg-[#FFFEFC]">
            <div className="flex items-center justify-between border-b border-[#E5D8C8] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#B89576]" />
                <h2 className="font-bold text-base text-[#332B25]">Backend Environment (.env) Template</h2>
              </div>
              <button
                type="button"
                onClick={handleCopyEnv}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#52785C]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy .env Template'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5D8C8] text-[11px] font-mono text-[#332B25] overflow-x-auto leading-relaxed">
              {sampleEnv}
            </pre>
          </div>

          {/* Quick Actions Bar */}
          <div className="card-warm p-6 bg-[#F3EADF]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#332B25]">Ready to conduct research?</h3>
              <p className="text-xs text-[#75685D]">
                Upload documents to ChromaDB or start a live multi-agent investigation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/documents" className="btn-secondary text-xs">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Document Library</span>
              </Link>
              <Link to="/research/new" className="btn-primary text-xs shadow-warm-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>New Research</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
