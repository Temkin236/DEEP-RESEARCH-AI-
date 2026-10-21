import pytest
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_and_get_research_job():
    payload = {
        "topic": "Compare FastAPI and Starlette performance",
        "depth": "quick",
        "focus": "technical",
        "max_sources": 3
    }
    create_res = client.post("/api/v1/research", json=payload)
    assert create_res.status_code == 201
    job_data = create_res.json()
    job_id = job_data["id"]
    assert job_data["topic"] == payload["topic"]

    # Fetch job details
    get_res = client.get(f"/api/v1/research/{job_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == job_id

    # List jobs
    list_res = client.get("/api/v1/research")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Delete job
    del_res = client.delete(f"/api/v1/research/{job_id}")
    assert del_res.status_code == 204

def test_document_upload_and_validation():
    # Attempt uploading unsupported extension
    bad_file = ("bad.exe", io.BytesIO(b"binary"), "application/octet-stream")
    bad_res = client.post("/api/v1/documents/upload", files={"file": bad_file})
    assert bad_res.status_code == 400

    # Upload valid text document
    good_content = b"# Deep Research AI Technical Note\nThis document outlines multi-agent protocols."
    good_file = ("notes.md", io.BytesIO(good_content), "text/markdown")
    upload_res = client.post("/api/v1/documents/upload", files={"file": good_file})
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    doc_id = doc_data["document"]["id"]

    # List documents
    docs_list = client.get("/api/v1/documents")
    assert docs_list.status_code == 200
    assert any(d["id"] == doc_id for d in docs_list.json())

    # Delete document
    del_res = client.delete(f"/api/v1/documents/{doc_id}")
    assert del_res.status_code == 204
