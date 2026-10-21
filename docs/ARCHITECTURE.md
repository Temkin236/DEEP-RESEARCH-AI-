# Deep Research AI — Architecture Blueprint

## 1. Executive Architecture Overview

Deep Research AI is an autonomous multi-agent research platform designed to investigate complex subjects, gather empirical evidence from the live web and uploaded documents, cross-check claims against an evidence registry, and compile structured reports with verifiable citations.

```
                    +--------------------------------+
                    |    Client Frontend (SPA)       |
                    |   React / Vite / TypeScript    |
                    |    Warm Ivory / Light-Brown    |
                    +---------------+----------------+
                                    |
                    REST Requests / | Server-Sent Events (SSE)
                                    v
                    +--------------------------------+
                    |      FastAPI Backend Engine    |
                    |     Pydantic / Asynchronous    |
                    +---------------+----------------+
                                    |
       +----------------------------+----------------------------+
       |                            |                            |
       v                            v                            v
+--------------+           +------------------+           +--------------+
|  PostgreSQL  |           |     ChromaDB     |           |  LangGraph   |
|  SQLAlchemy  |           |   Vector Store   |           |  StateGraph  |
|  Alembic Mig |           | Document Embeds  |           | Multi-Agents |
+--------------+           +------------------+           +-------+------+
                                                                  |
      +-----------------------------------------------------------+
      |
      v
+-------------------------------------------------------------------------+
|                       Multi-Agent Orchestration                         |
|                                                                         |
|  [Planner] -> [Researcher] -> [Analyst] -> [Verifier] -> [Reporter]    |
|                     ^                          |                        |
|                     +--- (Targeted Follow-Up) -+                        |
+-------------------------------------------------------------------------+
```

---

## 2. Core Architectural Subsystems

### A. Frontend Layer (React / Vite / Tailwind)
- **Design Tokens**: Standardized warm ivory (`#FAF7F2`), light cream (`#F3EADF`), warm brown (`#B89576`), deep charcoal typography (`#332B25`), and forest green verified badges (`#52785C`).
- **Reactive Streaming**: Subscribes to real-time agent events via Server-Sent Events (SSE) with automatic reconnection and historical event replay.
- **Safe Markdown Rendering**: Uses `react-markdown` with `remark-gfm` and custom citation chip link renderers.

### B. Multi-Agent Engine (LangGraph StateGraph)
1. **Research Planner / Coordinator**: Analyzes questions, scopes boundaries, and breaks problems into targeted subquestions.
2. **Researcher Agent**: Queries external search APIs (DuckDuckGo, Tavily, Serper) and user document embeddings via ChromaDB.
3. **Analyst Agent**: Synthesizes cross-source evidence, separates facts from assumptions, and calculates confidence metrics.
4. **Verification Agent**: Validates claims against raw evidence snippets, checks URL accessibility, and triggers follow-up queries if evidence is insufficient.
5. **Report Writer Agent**: Compiles the comprehensive 11-section research report and attaches citation markers `[1]`, `[2]`.

### C. Evidence Registry & Citation Engine
- **Source Normalization**: Strips fragments, trailing slashes, and deduplicates URLs.
- **Citation Verification**: Scans drafted reports, checks that every `[i]` marker references a real source in the registry, and strips or flags hallucinated references.

### D. Document RAG Layer
- **Ingestion Pipeline**: Validates format (`.pdf`, `.docx`, `.txt`, `.md`), enforces 25MB limits, extracts text safely, and segments text into 1,000-character chunks with 200-character overlap.
- **Persistence**: Persists chunk embeddings into ChromaDB with cosine similarity distance.

### E. Security & Egress Guardrails
- **SSRF Prevention**: Validates target URLs against loopback (`127.0.0.0/8`, `::1`) and private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`).
- **Untrusted Context Framing**: Neutralizes script tags, prompt injection phrases, and frames raw excerpts before presenting them to LLMs.
