# API Reference — Tech Research AI

Base URL: `http://localhost:8000/api`

---

## 1. System Health

### `GET /api/v1/health`
Returns system status, active database connection, vectorstore condition, configured LLM provider, and server uptime.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "environment": "development",
  "database": "healthy",
  "vectorstore": "healthy",
  "llm_provider": "gemini",
  "search_provider": "duckduckgo",
  "uptime_seconds": 124.5,
  "timestamp": "2026-10-21T18:20:00Z",
  "version": "1.0.0"
}
```

---

## 2. Research Jobs

### `POST /api/v1/research`
Initiates a new multi-agent research investigation.

**Request Body**:
```json
{
  "topic": "Compare LangGraph vs CrewAI architecture",
  "instructions": "Focus on state transitions and error recovery",
  "depth": "standard",
  "focus": "comparative",
  "max_sources": 8,
  "selected_documents": ["doc-uuid-1"]
}
```

**Response `201 Created`**:
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "topic": "Compare LangGraph vs CrewAI architecture",
  "depth": "standard",
  "focus": "comparative",
  "status": "pending",
  "progress": 0,
  "current_stage": "Queued",
  "created_at": "2026-10-21T18:21:00Z",
  "updated_at": "2026-10-21T18:21:00Z",
  "source_count": 0,
  "finding_count": 0,
  "has_report": false
}
```

### `GET /api/v1/research`
List research jobs with optional search filtering and pagination.

**Query Parameters**:
- `q`: Search topic query
- `status`: Filter by status (`pending`, `running`, `completed`, `failed`)
- `skip`: Pagination offset (default 0)
- `limit`: Items per page (default 20)

### `GET /api/v1/research/{job_id}`
Retrieve full research job details including sources, findings, and events.

### `GET /api/v1/research/{job_id}/events`
Server-Sent Events (SSE) stream delivering real-time agent workflow events.

**Sample SSE Event**:
```text
event: message
data: {"agent_name": "Research Planner", "stage": "Planning", "message": "Formulated 3 subtasks", "event_type": "progress"}
```

### `GET /api/v1/research/{job_id}/report`
Fetch the compiled structured markdown report.

### `POST /api/v1/research/{job_id}/retry`
Retry a failed research job.

### `DELETE /api/v1/research/{job_id}`
Permanently delete a research job and all associated entities.

---

## 3. Documents

### `POST /api/v1/documents/upload`
Upload a document (`.pdf`, `.docx`, `.txt`, `.md`) up to 25MB for vector indexing.

### `GET /api/v1/documents`
List all indexed documents.

### `DELETE /api/v1/documents/{document_id}`
Delete a document from disk and purge its vector embeddings from ChromaDB.
