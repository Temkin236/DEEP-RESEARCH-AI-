import os
import uuid
import shutil
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.config.settings import settings
from app.models.entities import Document, DocumentChunk
from app.schemas.document import DocumentResponse, DocumentUploadResponse
from app.services.document_service import document_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and index a research document (PDF, DOCX, TXT, MD).
    Extracts text safely, generates chunks, and persists embeddings into Chroma.
    """
    filename = file.filename or "uploaded_file"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read content and enforce size limits
    content = await file.read()
    file_size = len(content)
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Save to disk securely
    doc_id = str(uuid.uuid4())
    safe_filename = f"{doc_id}_{filename.replace(' ', '_')}"
    file_path = os.path.join(settings.UPLOAD_DIRECTORY, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    # Extract text and chunk
    try:
        extracted_text = document_service.extract_text(file_path=file_path, filename=filename)
        chunks = document_service.chunk_text(extracted_text)
    except Exception as e:
        # Clean up file on failure
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=422, detail=f"Document parsing error: {str(e)}")

    # Index chunks in vectorstore
    try:
        document_service.index_document(document_id=doc_id, filename=filename, chunks=chunks)
    except Exception as e:
        logger.error(f"Vector indexing error: {e}")

    # Persist in DB
    new_doc = Document(
        id=doc_id,
        filename=filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=file.content_type or "application/octet-stream",
        chunk_count=len(chunks),
        is_indexed=True
    )
    db.add(new_doc)
    db.flush()

    for idx, chunk_text in enumerate(chunks):
        db_chunk = DocumentChunk(
            document_id=doc_id,
            chunk_index=idx,
            content=chunk_text,
            metadata_json={"filename": filename, "chunk_index": idx}
        )
        db.add(db_chunk)

    db.commit()
    db.refresh(new_doc)

    return DocumentUploadResponse(
        document=DocumentResponse.model_validate(new_doc),
        message=f"Document '{filename}' successfully parsed and indexed.",
        extracted_chunks=len(chunks)
    )

@router.get("", response_model=List[DocumentResponse])
def list_documents(db: Session = Depends(get_db)):
    """List all indexed documents available for research grounding."""
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return docs

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, db: Session = Depends(get_db)):
    """Get metadata for a specific document."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: str, db: Session = Depends(get_db)):
    """Delete a document, purge vectors from ChromaDB, and remove local file."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # Delete Chroma vectors
    document_service.delete_document_vectors(document_id)

    # Delete local file
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception as e:
            logger.warning(f"Failed to remove file from disk: {e}")

    db.delete(doc)
    db.commit()
    return None
