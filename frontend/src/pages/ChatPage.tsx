import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Terminal,
  Send,
  Globe,
  Zap,
  ExternalLink,
  ArrowRight,
  Loader2,
  Trash2,
  ShieldCheck,
  FileCode2,
  Copy,
  Check,
  Download,
  Database,
  Cpu,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage, ChatSource } from '../types';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '### Tech Research Terminal Ready\n\nI am your real-time technology research agent. I query live web crawl engines and ChromaDB vector embeddings to answer technical questions with authentic, verified citations.',
      timestamp: new Date().toISOString(),
      suggested_followups: [
        'Rust Tokio vs Go Goroutines concurrency benchmark profiles',
        'WebAssembly WASM & WebGPU client-side LLM inference latency',
        'LangGraph vs CrewAI state graph memory persistence and recovery',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (topicParam && !input) {
      setInput(`What are the key technical findings and architectural trade-offs for ${topicParam}?`);
    }
  }, [topicParam]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);
    setError(null);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.chatWithAgent({
        message: textToSend,
        history,
        use_web_search: useWebSearch,
        focus: 'technical',
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toISOString(),
        sources: res.sources,
        suggested_followups: res.suggested_followups,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Terminal query failed. Please verify the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          '### Tech Terminal Cleared\n\nEnter any technical question below or select a suggested topic to query the live research agent.',
        timestamp: new Date().toISOString(),
        suggested_followups: [
          'Rust Tokio vs Go Goroutines memory footprint under 100k connections',
          'WebGPU shader pipeline optimizations for quantized LLM inference',
          'Autonomous multi-agent verification against hallucination',
        ],
      },
    ]);
    setError(null);
  };

  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportChat = () => {
    const text = messages
      .map(
        (m) =>
          `## ${m.role === 'user' ? 'User Inquiry' : 'TechResearch Agent'}\n*${new Date(
            m.timestamp
          ).toLocaleString()}*\n\n${m.content}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terminal_chat_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Top Header Bar */}
      <div className="border-b border-[#E8E1D7] pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#785135]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1612] tracking-tight">
              Interactive Research Terminal
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#785135] bg-[#F4EBE1] border border-[#E0D5C7] px-2 py-0.5 rounded-full">
              Live Search + RAG
            </span>
          </div>
          <p className="text-xs font-mono text-[#6E6255] mt-0.5">
            Real-time multi-agent Q&A with DuckDuckGo live crawl and ChromaDB vector retrieval.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Toggle Web Search Button */}
          <button
            type="button"
            onClick={() => setUseWebSearch(!useWebSearch)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
              useWebSearch
                ? 'bg-[#F4EBE1] text-[#785135] border-[#E0D5C7] shadow-warm-xs font-semibold'
                : 'bg-white text-[#6E6255] border-[#E8E1D7] hover:text-[#1A1612]'
            }`}
            title="Toggle Live Web Search Engine"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Search: {useWebSearch ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportChat}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Export chat transcript as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={clearChat}
            className="p-1.5 rounded-lg text-[#9E9284] hover:text-rose-600 hover:bg-[#FAF8F5] border border-[#E8E1D7] transition-colors"
            title="Clear Terminal Session"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-2 px-1 text-[11px] font-mono text-[#9E9284]">
                <span className={isUser ? 'text-[#6E6255]' : 'text-[#785135] font-semibold'}>
                  {isUser ? 'USER COMMAND' : 'TECHRESEARCH AGENT'}
                </span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div
                className={`max-w-3xl rounded-2xl p-4 sm:p-5 space-y-3 ${
                  isUser
                    ? 'bg-[#F4EBE1] border border-[#E0D5C7] text-[#1A1612] font-mono shadow-warm-xs'
                    : 'card-clean border-[#E8E1D7] bg-white text-[#1A1612] shadow-warm-xs'
                }`}
              >
                <div className="report-markdown text-xs sm:text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Sources pill container if sources exist */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-[#E8E1D7] space-y-2 font-mono">
                    <span className="text-[10px] font-bold text-[#6E6255] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#785135]" />
                      <span>Retrieved Citations & Sources ({msg.sources.length}):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] bg-[#FAF8F5] hover:bg-[#F4EBE1] text-[#785135] border border-[#E8E1D7] hover:border-[#785135]/40 px-2.5 py-1 rounded-md transition-colors font-medium"
                        >
                          <span>[{i + 1}]</span>
                          <span className="max-w-[150px] truncate">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested follow-up prompt chips */}
                {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="pt-2 border-t border-[#E8E1D7] space-y-1.5 font-mono">
                    <span className="text-[10px] text-[#6E6255] uppercase tracking-wider block">
                      Suggested Follow-Up Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggested_followups.map((followup, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(followup)}
                          className="text-xs text-left bg-[#FAF8F5] hover:bg-[#F4EBE1] text-[#6E6255] hover:text-[#785135] border border-[#E8E1D7] hover:border-[#785135]/40 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          ↳ {followup}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant footer toolbar */}
                {!isUser && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E1D7] font-mono text-xs text-[#6E6255]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="hover:text-[#785135] flex items-center gap-1 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/research/new?topic=${encodeURIComponent(msg.content.slice(0, 100))}`)
                      }
                      className="text-[#785135] hover:text-[#5E3D24] font-semibold flex items-center gap-1 transition-colors"
                      title="Launch full 11-section research report on this inquiry"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Launch Comprehensive Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col items-start space-y-1">
            <span className="text-[11px] font-mono text-[#6E6255]">TECHRESEARCH AGENT IS SEARCHING...</span>
            <div className="card-clean p-4 border-[#E8E1D7] bg-white flex items-center gap-3 shadow-warm-xs">
              <Loader2 className="w-4 h-4 text-[#785135] animate-spin" />
              <span className="text-xs font-mono text-[#6E6255]">
                Executing multi-agent crawl & validating citations...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-800 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="text-rose-600 hover:underline ml-2 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="mt-3 card-clean p-2 border-[#E8E1D7] bg-white shadow-warm-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a technical question... (Press Enter to query, Shift+Enter for newline)"
            className="flex-1 bg-transparent text-xs sm:text-sm text-[#1A1612] placeholder-[#9E9284] focus:outline-none p-2 font-mono resize-none leading-relaxed"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary text-xs px-4 py-2.5 shrink-0 self-end shadow-warm-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Query</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
