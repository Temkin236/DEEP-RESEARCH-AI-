# Testing & Quality Assurance Guide — Deep Research AI

## Test Suite Overview

Deep Research AI includes multi-layered automated testing across backend agent reasoning, citation validation, SSRF security, vector RAG retrieval, and frontend UI components.

---

## 1. Backend Pytest Suite

The backend test suite is located in `backend/tests/`:
- `test_health.py`: Health endpoint, database connectivity, and uptime metrics.
- `test_security.py`: SSRF network filtering, URL normalization, script sanitization, and prompt injection neutralization.
- `test_agents.py`: Planner subtask generation, Researcher evidence gathering, Analyst synthesis, Verifier claim checking, and Reporter markdown formatting.
- `test_citation_engine.py`: Evidence registry deduplication, citation marker validation, and stripping of hallucinated citations.
- `test_documents.py`: Text chunking with overlap, ChromaDB persistent vector indexing, and semantic similarity search.
- `test_workflow.py`: End-to-end LangGraph StateGraph execution, state transitions, and event emission.
- `test_api.py`: FastAPI endpoints for research job creation, retrieval, listing, retry, deletion, and document upload validation.

### Running Backend Tests:
```bash
cd backend
.venv/bin/pytest tests/ -v
```

---

## 2. Frontend Vitest Suite

The frontend test suite is located in `frontend/src/test/`:
- `Navbar.test.tsx`: Brand navigation, layout, and link routing.
- `ProgressIndicator.test.tsx`: Progress percentage display, milestone dots, and stage text.
- `SourceCard.test.tsx`: Verified badge, domain chip, external links, and snippet presentation.

### Running Frontend Tests:
```bash
cd frontend
npm run test
```

---

## 3. Production Build Validation

Verify TypeScript compilation and Vite bundling:
```bash
cd frontend
npm run build
```
Generates clean static assets in `frontend/dist/`.
