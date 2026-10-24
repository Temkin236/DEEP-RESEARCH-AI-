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
  Download,
  RotateCcw,
  Sliders,
  Terminal,
  Zap,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuration state stored in localStorage for custom user settings
  const [llmProvider, setLlmProvider] = useState(() => localStorage.getItem('tech_research_llm') || localStorage.getItem('deep_tech_llm') || 'gemini');
  const [modelName, setModelName] = useState(() => localStorage.getItem('tech_research_model') || localStorage.getItem('deep_tech_model') || 'gemini-1.5-flash');
  const [searchProvider, setSearchProvider] = useState(() => localStorage.getItem('tech_research_search') || localStorage.getItem('deep_tech_search') || 'duckduckgo');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tech_research_apikey') || localStorage.getItem('deep_tech_apikey') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [depthDefault, setDepthDefault] = useState(() => localStorage.getItem('tech_research_depth') || localStorage.getItem('deep_tech_depth') || 'standard');

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
      setError(err.message || 'Connection test failed. Backend may be offline.');
    } finally {
      setTesting(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tech_research_llm', llmProvider);
    localStorage.setItem('tech_research_model', modelName);
    localStorage.setItem('tech_research_search', searchProvider);
    localStorage.setItem('tech_research_apikey', apiKey);
    localStorage.setItem('tech_research_depth', depthDefault);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset local configuration settings to system defaults?')) return;
    localStorage.removeItem('tech_research_llm');
    localStorage.removeItem('tech_research_model');
    localStorage.removeItem('tech_research_search');
    localStorage.removeItem('tech_research_apikey');
    localStorage.removeItem('tech_research_depth');
    localStorage.removeItem('deep_tech_llm');
    localStorage.removeItem('deep_tech_model');
    localStorage.removeItem('deep_tech_search');
    localStorage.removeItem('deep_tech_apikey');
    localStorage.removeItem('deep_tech_depth');

    setLlmProvider('gemini');
    setModelName('gemini-1.5-flash');
    setSearchProvider('duckduckgo');
    setApiKey('');
    setDepthDefault('standard');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const dynamicEnv = `# TechResearch AI Runtime Environment
ENVIRONMENT=development
LLM_PROVIDER=${llmProvider}
GEMINI_API_KEY=${llmProvider === 'gemini' && apiKey ? apiKey : 'your_gemini_api_key_here'}
GEMINI_MODEL=${modelName}

# OpenAI / Custom Engine (optional)
OPENAI_API_KEY=${llmProvider === 'openai' && apiKey ? apiKey : 'your_openai_key_here'}
OPENAI_MODEL=gpt-4o-mini

# Search Provider (DuckDuckGo requires zero API keys!)
SEARCH_PROVIDER=${searchProvider}
TAVILY_API_KEY=
SERPER_API_KEY=

# Persistence & Vector Embeddings
DATABASE_URL=sqlite:///./tech_research.db
CHROMA_PERSIST_DIRECTORY=./chroma_db
`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(dynamicEnv);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleDownloadEnv = () => {
    const blob = new Blob([dynamicEnv], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.env';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#785135]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] tracking-tight">
              System Settings & Swarm Parameters
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#6E6255]">
            Configure agent LLM providers, search gateways, and test real-time cluster health.
          </p>
        </div>

        <button
          type="button"
          onClick={checkConnection}
          disabled={testing}
          className="btn-secondary text-xs flex items-center gap-1.5 shrink-0 font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-[#785135]' : ''}`} />
          <span>{testing ? 'Testing...' : 'Test Backend Connection'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-mono text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully to local runtime registry!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={checkConnection}
            className="btn-secondary text-xs px-3 py-1.5 self-start sm:self-auto shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {loading ? (
        <div className="card-clean p-12 text-center text-[#6E6255] space-y-2 border-[#E8E1D7] bg-white">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#785135] mb-2" />
          <p className="text-sm font-mono">Pinging FastAPI cluster...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Health & Status Card */}
          <div className="card-clean p-6 space-y-4 border-[#E8E1D7] bg-white shadow-warm-sm">
            <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#785135]" />
                <h2 className="font-bold text-sm text-[#1A1612] font-mono uppercase tracking-wider">
                  Cluster Health & Telemetry
                </h2>
              </div>
              <div className="flex items-center gap-2 font-mono">
                {latency !== null && (
                  <span className="text-[11px] font-semibold text-[#785135] bg-[#F4EBE1] border border-[#E0D5C7] px-2.5 py-0.5 rounded-full">
                    Ping: {latency} ms
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{health?.status ? health.status.toUpperCase() : 'OPERATIONAL'}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-1">
                <span className="text-[#9E9284] block text-[10px]">ENVIRONMENT</span>
                <span className="font-bold text-[#1A1612] capitalize">
                  {health?.environment || 'Development'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-1">
                <span className="text-[#9E9284] block text-[10px]">UPTIME</span>
                <span className="font-bold text-[#785135]">
                  {health?.uptime_seconds ? `${Math.round(health.uptime_seconds)}s` : 'Online'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-1">
                <span className="text-[#9E9284] block text-[10px]">SQLITE ORM</span>
                <span className="font-bold text-emerald-700">
                  {health?.database || 'Healthy'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-1">
                <span className="text-[#9E9284] block text-[10px]">VECTOR STORE</span>
                <span className="font-bold text-emerald-700">
                  {health?.vectorstore || 'ChromaDB Local'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Configuration Form */}
          <form onSubmit={handleSaveSettings} className="card-clean p-6 space-y-5 border-[#E8E1D7] bg-white shadow-warm-sm">
            <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#785135]" />
                <h2 className="font-bold text-sm text-[#1A1612] font-mono uppercase tracking-wider">
                  Model & Search Gateway Configuration
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#6E6255]">
                Local overrides
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LLM Provider */}
              <div className="space-y-1.5 font-mono">
                <label className="text-xs text-[#1A1612] font-semibold block">
                  LLM Provider Engine
                </label>
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl px-3 py-2 text-xs text-[#1A1612] focus:outline-none transition-colors"
                >
                  <option value="gemini">Google Gemini (Default)</option>
                  <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="ollama">Ollama (Local Self-Hosted)</option>
                </select>
              </div>

              {/* Model Identifier */}
              <div className="space-y-1.5 font-mono">
                <label className="text-xs text-[#1A1612] font-semibold block">
                  Model Identifier
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. gemini-1.5-flash or gpt-4o-mini"
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl px-3 py-2 text-xs text-[#1A1612] placeholder-[#9E9284] focus:outline-none transition-colors"
                />
              </div>

              {/* Search Gateway */}
              <div className="space-y-1.5 font-mono">
                <label className="text-xs text-[#1A1612] font-semibold block">
                  Web Crawl Gateway
                </label>
                <select
                  value={searchProvider}
                  onChange={(e) => setSearchProvider(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl px-3 py-2 text-xs text-[#1A1612] focus:outline-none transition-colors"
                >
                  <option value="duckduckgo">DuckDuckGo (Free / 0 API Key Required)</option>
                  <option value="tavily">Tavily AI Search</option>
                  <option value="serper">Serper Google API</option>
                </select>
              </div>

              {/* Default Depth */}
              <div className="space-y-1.5 font-mono">
                <label className="text-xs text-[#1A1612] font-semibold block">
                  Default Swarm Depth
                </label>
                <select
                  value={depthDefault}
                  onChange={(e) => setDepthDefault(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl px-3 py-2 text-xs text-[#1A1612] focus:outline-none transition-colors"
                >
                  <option value="quick">Quick (4 sources)</option>
                  <option value="standard">Standard (8 sources)</option>
                  <option value="deep">Comprehensive (12+ sources)</option>
                </select>
              </div>
            </div>

            {/* Custom API Key input */}
            <div className="space-y-1.5 font-mono pt-2">
              <label className="text-xs text-[#1A1612] font-semibold flex items-center justify-between">
                <span>Custom API Key Override (Optional)</span>
                <span className="text-[10px] text-[#9E9284]">Stored safely in browser storage</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter custom API key if not set in backend .env..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] focus:border-[#785135] rounded-xl pl-3 pr-10 py-2 text-xs text-[#1A1612] placeholder-[#9E9284] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9284] hover:text-[#1A1612]"
                >
                  {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E1D7] font-mono text-xs">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[#6E6255] hover:text-[#1A1612] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button type="submit" className="btn-primary text-xs shadow-warm-sm">
                <Check className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>

          {/* Environment (.env) Generator Card */}
          <div className="card-clean p-6 space-y-4 border-[#E8E1D7] bg-white shadow-warm-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D7] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#785135]" />
                <h2 className="font-bold text-sm text-[#1A1612] font-mono uppercase tracking-wider">
                  Generated Backend .env Configuration
                </h2>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleCopyEnv}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadEnv}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#785135]" />
                  <span>Download .env</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E1D7] text-[11px] font-mono text-[#4A3B32] overflow-x-auto leading-relaxed">
              {dynamicEnv}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
