import os
import pytest
from app.services.document_service import document_service

def test_chunking_with_overlap():
    text = "A" * 1500
    chunks = document_service.chunk_text(text, chunk_size=1000, chunk_overlap=200)
    assert len(chunks) == 2
    assert len(chunks[0]) == 1000

def test_document_indexing_and_similarity_retrieval(tmp_path):
    doc_id = "test_doc_42"
    filename = "agent_architecture.txt"
    chunks = [
        "LangGraph provides stateful cyclic graphs for AI agents.",
        "PostgreSQL and ChromaDB offer scalable relational and vector persistence.",
        "Server-Sent Events stream live progress tokens to the client interface."
    ]

    document_service.index_document(document_id=doc_id, filename=filename, chunks=chunks)

    # Query for LangGraph
    results = document_service.query_similar(query="LangGraph cyclic agents", document_ids=[doc_id], n_results=1)
    assert len(results) >= 1
    assert "LangGraph" in results[0]["content"]

    # Delete
    document_service.delete_document_vectors(doc_id)
    post_delete_results = document_service.query_similar(query="LangGraph", document_ids=[doc_id], n_results=1)
    assert len(post_delete_results) == 0
