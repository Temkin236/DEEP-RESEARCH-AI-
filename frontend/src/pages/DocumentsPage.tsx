import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  FileCode2,
  Trash2,
  Calendar,
  Layers,
  HardDrive,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Search,
  RefreshCw,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem } from '../types';
import { DocumentUploadModal } from '../components/DocumentUploadModal';

export const DocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [docToInspect, setDocToInspect] = useState<DocumentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.listDocuments();
      setDocs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load vector document repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const confirmDelete = async () => {
    if (!docToDelete || deleting) return;
    setDeleting(true);
    try {
      await api.deleteDocument(docToDelete);
      setDocs((prev) => prev.filter((d) => d.id !== docToDelete));
      setDocToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete vector document.');
    } finally {
      setDeleting(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocs = docs.filter((d) =>
    d.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#785135]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1612] tracking-tight">
              Vector Knowledge Repository
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#6E6255]">
            Ingest and manage local technical documentation, RFCs, and papers indexed in ChromaDB.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={fetchDocs}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Refresh repository"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs shadow-warm-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchDocs}
            className="btn-secondary text-xs px-3 py-1.5 self-start sm:self-auto shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Architecture RAG Spec Card */}
      <div className="p-4 rounded-xl bg-white border border-[#E8E1D7] shadow-warm-xs flex items-start gap-3 text-xs text-[#6E6255] font-mono">
        <ShieldCheck className="w-5 h-5 text-[#785135] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#1A1612] block">
            Local ChromaDB Vector Collection Pipeline
          </span>
          <span className="text-[#6E6255]">
            Ingested documents undergo text extraction, tokenization, and semantic chunking with 200-character overlap. Embeddings are stored locally in ChromaDB without sending proprietary internal files to third-party crawlers.
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-clean p-3 bg-white border-[#E8E1D7] shadow-warm-xs flex items-center gap-2 font-mono">
        <Search className="w-4 h-4 text-[#9E9284] ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter documents by filename..."
          className="w-full bg-transparent text-xs text-[#1A1612] placeholder-[#9E9284] focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-[#9E9284] hover:text-[#1A1612] px-2 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="card-clean p-16 text-center text-[#6E6255] space-y-2 border-[#E8E1D7] bg-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#785135] mb-2" />
          <p className="text-sm font-mono">Scanning ChromaDB vector collections...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="card-clean p-12 text-center space-y-3 border-[#E8E1D7] bg-white">
          <Database className="w-10 h-10 mx-auto text-[#9E9284]" />
          <h3 className="font-bold text-sm text-[#1A1612] font-mono">
            {searchTerm ? 'No matching documents found' : 'No vector documents ingested'}
          </h3>
          <p className="text-xs text-[#6E6255] max-w-sm mx-auto">
            {searchTerm
              ? 'Try modifying your search filter.'
              : 'Upload PDF, DOCX, Markdown, or plain text technical papers to ground your research swarms.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs inline-flex mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest First Technical Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="card-clean card-clean-hover p-4 space-y-3 border-[#E8E1D7] bg-white shadow-warm-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8E1D7] flex items-center justify-center text-[#785135] shrink-0">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F4EBE1] border border-[#E0D5C7] text-[#785135]">
                    {doc.chunk_count} Passages
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#1A1612] truncate font-mono" title={doc.filename}>
                    {doc.filename}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#6E6255] mt-1">
                    <span>{formatBytes(doc.file_size)}</span>
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E8E1D7] font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setDocToInspect(doc)}
                  className="text-[#785135] hover:text-[#5E3D24] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Metadata</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDocToDelete(doc.id)}
                  className="p-1.5 rounded-lg text-[#9E9284] hover:text-rose-600 hover:bg-[#FAF8F5] transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Inspector Modal */}
      {docToInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1612]/40 backdrop-blur-sm p-4">
          <div className="card-clean w-full max-w-lg p-6 space-y-4 border-[#E8E1D7] bg-white shadow-warm-lg font-mono">
            <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#785135]" />
                <h3 className="font-bold text-sm text-[#1A1612] truncate">
                  {docToInspect.filename}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDocToInspect(null)}
                className="text-[#9E9284] hover:text-[#1A1612]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#1A1612]">
              <div className="flex justify-between p-2 rounded bg-[#FAF8F5] border border-[#E8E1D7]">
                <span className="text-[#6E6255]">Document ID:</span>
                <span className="text-[#785135] font-semibold">{docToInspect.id}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF8F5] border border-[#E8E1D7]">
                <span className="text-[#6E6255]">Chunk Count:</span>
                <span className="text-[#1A1612] font-bold">{docToInspect.chunk_count} passages</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF8F5] border border-[#E8E1D7]">
                <span className="text-[#6E6255]">File Size:</span>
                <span className="text-[#1A1612]">{formatBytes(docToInspect.file_size)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF8F5] border border-[#E8E1D7]">
                <span className="text-[#6E6255]">Ingested At:</span>
                <span className="text-[#1A1612]">{new Date(docToInspect.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF8F5] border border-[#E8E1D7]">
                <span className="text-[#6E6255]">Vector Collection:</span>
                <span className="text-emerald-700 font-semibold">research_documents</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDocToInspect(null)}
                className="btn-secondary text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1612]/40 backdrop-blur-sm p-4">
          <div className="card-clean w-full max-w-md p-6 space-y-4 border-[#E8E1D7] bg-white shadow-warm-lg font-mono">
            <h3 className="font-bold text-base text-[#1A1612]">Delete Vector Document</h3>
            <p className="text-xs text-[#6E6255]">
              Are you sure you want to remove this document from ChromaDB? All indexed vector embeddings will be pruned.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="btn-secondary text-xs"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="btn-danger text-xs"
              >
                {deleting ? 'Deleting...' : 'Delete From ChromaDB'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchDocs();
        }}
      />
    </div>
  );
};
