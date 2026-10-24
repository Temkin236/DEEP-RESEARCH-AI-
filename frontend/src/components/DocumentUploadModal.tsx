import React, { useState } from 'react';
import { UploadCloud, FileCode2, AlertCircle, X, Loader2, Database } from 'lucide-react';
import { api } from '../services/api';
import { DocumentUploadResponse } from '../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (uploaded: DocumentUploadResponse) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const response = await api.uploadDocument(file);
      onSuccess(response);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1612]/40 backdrop-blur-sm p-4">
      <div className="card-clean w-full max-w-lg p-6 space-y-5 shadow-warm-lg border border-[#E8E1D7] bg-white rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F4EBE1] border border-[#E0D5C7] flex items-center justify-center text-[#785135]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1A1612]">Ingest Vector Document</h3>
              <p className="text-[11px] text-[#6E6255] font-mono">ChromaDB Embeddings Pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6E6255] hover:text-[#1A1612] p-1 rounded-lg hover:bg-[#F4EBE1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-[#E8E1D7] hover:border-[#785135] transition-all rounded-xl p-8 text-center bg-[#FAF8F5] space-y-3 cursor-pointer group"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="w-12 h-12 rounded-xl bg-[#F4EBE1] border border-[#E0D5C7] flex items-center justify-center mx-auto text-[#785135] group-hover:scale-105 transition-all shadow-warm-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1A1612]">
              Select or drag technical document into vector pipeline
            </p>
            <p className="text-xs text-[#6E6255] mt-1 font-mono">
              Supported: .pdf, .docx, .md, .txt (Max 25MB)
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-[#F4EBE1] rounded-lg border border-[#E8E1D7] font-mono">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileCode2 className="w-4 h-4 text-[#785135] shrink-0" />
              <span className="text-xs font-medium text-[#1A1612] truncate">
                {file.name}
              </span>
              <span className="text-[11px] text-[#6E6255] shrink-0">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-[#6E6255] hover:text-[#A63D38] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-[#FDF2F2] border border-[#F7D7D6] rounded-lg text-xs text-[#A63D38]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#A63D38]" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-[#E8E1D7]">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="btn-primary text-xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chunking & Vectorizing...</span>
              </>
            ) : (
              <span>Start Ingestion</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
