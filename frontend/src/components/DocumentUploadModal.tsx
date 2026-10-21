import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#332B25]/40 backdrop-blur-sm p-4">
      <div className="card-warm w-full max-w-lg p-6 space-y-5 shadow-warm-lg">
        <div className="flex items-center justify-between border-b border-[#E5D8C8] pb-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#B89576]" />
            <h3 className="font-bold text-base text-[#332B25]">Upload Research Document</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#75685D] hover:text-[#332B25] p-1 rounded-lg hover:bg-[#F3EADF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-[#E5D8C8] hover:border-[#B89576] transition-colors rounded-xl p-8 text-center bg-[#FAF7F2] space-y-3 cursor-pointer"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <UploadCloud className="w-10 h-10 mx-auto text-[#B89576]" />
          <div>
            <p className="text-sm font-semibold text-[#332B25]">
              Click to browse or drag and drop your file here
            </p>
            <p className="text-xs text-[#75685D] mt-1">
              Supported formats: PDF, DOCX, Markdown (.md), Plain Text (.txt) up to 25MB
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
          <div className="flex items-center justify-between p-3 bg-[#F3EADF] rounded-lg border border-[#E5D8C8]">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="w-4 h-4 text-[#9B785B] shrink-0" />
              <span className="text-xs font-medium text-[#332B25] truncate">
                {file.name}
              </span>
              <span className="text-[11px] text-[#75685D] shrink-0">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="text-[#75685D] hover:text-[#B6534B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-[#B6534B]/10 border border-[#B6534B]/30 rounded-lg text-xs text-[#B6534B]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
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
                <span>Processing & Indexing...</span>
              </>
            ) : (
              <span>Upload & Index</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
