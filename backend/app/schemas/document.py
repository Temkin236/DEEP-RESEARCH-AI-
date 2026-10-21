from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class DocumentChunkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    chunk_index: int
    content: str
    metadata_json: Dict[str, Any] = {}

class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    file_size: int
    mime_type: str
    chunk_count: int
    is_indexed: bool
    created_at: datetime

class DocumentUploadResponse(BaseModel):
    document: DocumentResponse
    message: str
    extracted_chunks: int
