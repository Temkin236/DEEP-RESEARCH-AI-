import os
import uuid
import logging
from typing import List, Dict, Any, Optional
from app.config.settings import settings
from app.security.sanitize import sanitize_untrusted_text

logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self):
        self.persist_dir = settings.CHROMA_PERSIST_DIRECTORY
        self._fallback_store: Dict[str, Dict[str, Any]] = {}
        self._init_chroma()

    def _init_chroma(self):
        """Initialize ChromaDB client with persistent local storage."""
        try:
            import chromadb
            self.chroma_client = chromadb.PersistentClient(path=self.persist_dir)
            self.collection = self.chroma_client.get_or_create_collection(
                name="research_documents",
                metadata={"hnsw:space": "cosine"}
            )
            logger.info("ChromaDB vector collection 'research_documents' initialized.")
        except Exception as e:
            logger.warning(f"ChromaDB initialization failed ({e}), using in-memory vector storage fallback.")
            self.chroma_client = None
            self.collection = None

    def extract_text(self, file_path: str, filename: str) -> str:
        """
        Extract clean text from PDF, DOCX, TXT, or MD files.
        Raises ValueError if file cannot be read or contains no extractable text.
        """
        ext = os.path.splitext(filename)[1].lower()
        extracted_text = ""

        if ext == ".pdf":
            try:
                import pypdf
                reader = pypdf.PdfReader(file_path)
                pages_text = []
                for i, page in enumerate(reader.pages):
                    t = page.extract_text()
                    if t:
                        pages_text.append(f"[Page {i+1}]\n{t.strip()}")
                extracted_text = "\n\n".join(pages_text)
                if not extracted_text.strip():
                    raise ValueError("PDF appears to be scanned or contains no extractable text.")
            except Exception as e:
                raise ValueError(f"Error parsing PDF: {str(e)}")

        elif ext == ".docx":
            try:
                import docx
                doc = docx.Document(file_path)
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                extracted_text = "\n\n".join(paragraphs)
            except Exception as e:
                raise ValueError(f"Error parsing DOCX: {str(e)}")

        elif ext in (".txt", ".md"):
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    extracted_text = f.read()
            except Exception as e:
                raise ValueError(f"Error reading text document: {str(e)}")
        else:
            raise ValueError(f"Unsupported document format: {ext}")

        return sanitize_untrusted_text(extracted_text)

    def chunk_text(self, text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
        """Split text into overlapping character chunks."""
        chunks = []
        if not text:
            return chunks

        start = 0
        total_len = len(text)
        while start < total_len:
            end = min(start + chunk_size, total_len)
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            if end >= total_len:
                break
            start += (chunk_size - chunk_overlap)
        return chunks

    def index_document(self, document_id: str, filename: str, chunks: List[str]):
        """Index text chunks into Chroma vector store."""
        if not chunks:
            return

        ids = [f"{document_id}_{i}" for i in range(len(chunks))]
        metadatas = [
            {
                "document_id": document_id,
                "filename": filename,
                "chunk_index": i,
            }
            for i in range(len(chunks))
        ]

        if self.collection:
            try:
                self.collection.add(
                    documents=chunks,
                    ids=ids,
                    metadatas=metadatas,
                )
                logger.info(f"Indexed {len(chunks)} chunks for document {document_id} into ChromaDB.")
                return
            except Exception as e:
                logger.error(f"Error indexing in Chroma: {e}")

        # Fallback in-memory index
        for i, chunk in enumerate(chunks):
            cid = ids[i]
            self._fallback_store[cid] = {
                "document_id": document_id,
                "filename": filename,
                "chunk_index": i,
                "text": chunk
            }

    def query_similar(self, query: str, document_ids: Optional[List[str]] = None, n_results: int = 5) -> List[Dict[str, Any]]:
        """Query vector store for relevant document chunks."""
        results = []
        if self.collection:
            try:
                where_filter = None
                if document_ids and len(document_ids) == 1:
                    where_filter = {"document_id": document_ids[0]}
                elif document_ids and len(document_ids) > 1:
                    where_filter = {"document_id": {"$in": document_ids}}

                res = self.collection.query(
                    query_texts=[query],
                    n_results=min(n_results, 20),
                    where=where_filter,
                )
                docs = res.get("documents", [[]])[0]
                metas = res.get("metadatas", [[]])[0]
                distances = res.get("distances", [[]])[0] if "distances" in res else [0.0]*len(docs)

                for doc_text, meta, dist in zip(docs, metas, distances):
                    results.append({
                        "document_id": meta.get("document_id"),
                        "filename": meta.get("filename"),
                        "chunk_index": meta.get("chunk_index"),
                        "content": doc_text,
                        "similarity_score": round(1.0 - float(dist) if dist else 0.85, 3),
                    })
                return results
            except Exception as e:
                logger.error(f"Error querying ChromaDB: {e}")

        # In-memory keyword matching fallback
        query_words = set(query.lower().split())
        scored = []
        for cid, item in self._fallback_store.items():
            if document_ids and item["document_id"] not in document_ids:
                continue
            text = item["text"].lower()
            match_count = sum(1 for w in query_words if w in text)
            if match_count > 0:
                scored.append((match_count, item))

        scored.sort(key=lambda x: x[0], reverse=True)
        for _, item in scored[:n_results]:
            results.append({
                "document_id": item["document_id"],
                "filename": item["filename"],
                "chunk_index": item["chunk_index"],
                "content": item["text"],
                "similarity_score": 0.8,
            })
        return results

    def delete_document_vectors(self, document_id: str):
        """Delete all vector embeddings for a given document."""
        if self.collection:
            try:
                self.collection.delete(where={"document_id": document_id})
                logger.info(f"Deleted vectors for document {document_id}")
            except Exception as e:
                logger.error(f"Error deleting vectors for document {document_id}: {e}")

        # Clean fallback store
        keys_to_del = [k for k, v in self._fallback_store.items() if v.get("document_id") == document_id]
        for k in keys_to_del:
            del self._fallback_store[k]

document_service = DocumentService()
