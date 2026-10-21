import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  FileText,
  Trash2,
  Calendar,
  Layers,
  HardDrive,
  ShieldCheck,
  Loader2,
  AlertCircle,
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
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await api.listDocuments();
      setDocs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents.');
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
      setError(err.message || 'Failed to delete document.');
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332B25] tracking-tight">
            Document Library
          </h1>
          <p className="text-sm text-[#75685D]">
            Upload private papers, reports, or memos to ground research investigations with local vector RAG.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs shadow-warm-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-[#B6534B]/10 border border-[#B6534B]/30 rounded-xl flex items-center gap-3 text-sm text-[#B6534B]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Document RAG Information Card */}
      <div className="p-4 rounded-xl bg-[#F3EADF]/70 border border-[#E5D8C8] flex items-start gap-3 text-xs text-[#75685D]">
        <ShieldCheck className="w-5 h-5 text-[#52785C] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#332B25] block">
            Safe Vector Indexing via ChromaDB
          </span>
          <span>
            Uploaded documents are parsed, chunked, and embedded into a persistent local Chroma vector collection. When a research question is submitted, relevant passages are injected into the agent reasoning dossier without exposing raw filesystem paths.
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="card-warm p-16 text-center text-[#75685D]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#B89576] mb-2" />
          <p className="text-sm">Loading document repository...</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="card-warm p-12 text-center space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto text-[#B89576] opacity-60" />
          <h3 className="font-bold text-sm text-[#332B25]">No documents uploaded</h3>
          <p className="text-xs text-[#75685D] max-w-sm mx-auto">
            Upload PDF, DOCX, Markdown, or plain text files to enable custom internal retrieval for your research jobs.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary text-xs inline-flex mt-2"
          >
            Upload First File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="card-warm card-warm-hover p-5 space-y-3 bg-[#FFFEFC] flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E5D8C8] flex items-center justify-center text-[#9B785B]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => setDocToDelete(doc.id)}
                    className="p-1.5 text-[#75685D] hover:text-[#B6534B] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-[#332B25] truncate" title={doc.filename}>
                  {doc.filename}
                </h3>

                <div className="flex items-center gap-2 text-xs text-[#75685D]">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-[#9B785B]" />
                    <span>{formatBytes(doc.file_size)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#9B785B]" />
                    <span>{doc.chunk_count} chunks</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5D8C8]/60 flex items-center justify-between text-[11px] text-[#75685D]">
                <span>Indexed in ChromaDB</span>
                <span className="font-semibold text-[#52785C]">Ready</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchDocs()}
      />

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#332B25]/40 backdrop-blur-sm p-4">
          <div className="card-warm w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-base text-[#332B25]">Delete Document</h3>
            <p className="text-xs text-[#75685D] leading-relaxed">
              Are you sure you want to delete this document? Its vector embeddings in ChromaDB and disk file will be permanently purged.
            </p>
            <div className="flex justify-end gap-2 pt-2">
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
                className="bg-[#B6534B] text-white hover:bg-[#9B3C35] font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Document</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
