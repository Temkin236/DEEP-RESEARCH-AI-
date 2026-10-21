# Deep Research AI — Autonomous Multi-Agent Research Platform

[![CI Pipeline](https://github.com/temkin/deep-research-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/temkin/deep-research-ai/actions)
[![Python Version](https://img.shields.io/badge/python-3.12%20%7C%203.14-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.2.20-orange.svg)](https://github.com/langchain-ai/langgraph)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://typescriptlang.org)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorStore-red.svg)](https://www.trychroma.com)

> **Deep Research AI** is an autonomous multi-agent research platform that investigates inquiries, retrieves empirical evidence from web searches and user documents, verifies facts against an evidence registry, and synthesizes structured reports with authentic, grounded citations.

---

## Table of Contents
- [Executive Overview](#executive-overview)
- [Key Features](#key-features)
- [Light-Brown UI Design System](#light-brown-ui-design-system)
- [Architecture & Multi-Agent Workflow](#architecture--multi-agent-workflow)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Database Migrations](#database-migrations)
- [Running Automated Tests](#running-automated-tests)
- [Docker & Containerized Deployment](#docker--containerized-deployment)
- [API Documentation](#api-documentation)
- [Security & SSRF Guardrails](#security--ssrf-guardrails)
- [Known Limitations](#known-limitations)
- [Documentation Index](#documentation-index)
- [Project Roadmap](#project-roadmap)

---

## Executive Overview

Standard conversational AI assistants suffer from three pervasive limitations:
1. **Hallucination & Fabrication**: Chatbots invent sources, authors, and dead URLs.
2. **Monolithic Prompting**: Single prompts cannot simultaneously plan, query search engines, evaluate evidence, and audit claims.
3. **Black-Box Execution**: Users are presented with spinning loaders with zero real-time visibility into the research pipeline.

**Deep Research AI** resolves these issues by decomposing research into an explicit, stateful **LangGraph StateGraph** executed across 5 specialized autonomous agents.

---

## Key Features

- **5-Agent Multi-Agent Coordination**: Planner, Researcher, Analyst, Verifier, and Report Writer.
- **Shared Evidence Registry**: Centralized normalization and deduplication of every discovered source.
- **Deterministic Citation Validation**: Every claim is cross-checked against registered excerpts; hallucinated citations are automatically stripped.
- **Document RAG Integration**: Ingests PDF, DOCX, TXT, and Markdown files into persistent ChromaDB vector storage.
- **Real-Time Streaming Workspace**: Server-Sent Events (SSE) broadcast agent thoughts, milestone progress, and discovered evidence as they happen.
- **Publication-Grade Reports**: Formatted in Markdown with Executive Summaries, Methodology, Detailed Analysis, Comparison Tables, Limitations, and Grounded References.
- **Multi-Format Exporting**: One-click Markdown copy, `.md` file download, and print-optimized PDF styling.
- **Enterprise Security**: Egress SSRF network filtering, prompt injection boundary isolation, and zero secret exposure.

---

## Light-Brown UI Design System

The platform features a warm ivory and light-brown theme designed for readability and calm focus:

| Design Token | Role | Hex Value |
|---|---|---|
| Main Background | Warm Ivory | `#FAF7F2` |
| Secondary Background | Light Cream | `#F3EADF` |
| Primary Brand | Warm Light Brown | `#B89576` |
| Primary Hover | Medium Brown | `#9B785B` |
| Soft Surface | Soft Brown Accent | `#E8D8C5` |
| Light Border | Beige Border | `#E5D8C8` |
| Main Typography | Deep Charcoal | `#332B25` |
| Secondary Text | Muted Brown-Gray | `#75685D` |
| Card Surface | Pure White Card | `#FFFEFC` |
| Success State | Forest Green | `#52785C` |
| Warning State | Warm Amber | `#B77932` |
| Error State | Muted Red | `#B6534B` |

---

## Architecture & Multi-Agent Workflow

```
User Query Submitted
        │
        ▼
┌───────────────────────┐
│   Research Planner    │ ─── Formulates subquestions & queries
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Researcher Agent    │ ─── Queries Web & ChromaDB Document RAG
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     Analyst Agent     │ ─── Cross-corroborates evidence & finds themes
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Verification Agent   │ ─── Checks claims against evidence registry
└───────────┬───────────┘
            │
     Evidence Sufficient?
       /            \
     No              Yes
     /                \
┌───────────┐          ┌───────────────────────┐
│ Targeted  │          │  Report Writer Agent  │ ─── Generates 11-section report
│ Research  │          └───────────┬───────────┘
└─────┬─────┘                      │
      │                            ▼
      └──> (Re-evaluate)   ┌───────────────────────┐
                           │  Citation Validation  │ ─── Strips ungrounded markers
                           └───────────┬───────────┘
                                       │
                                       ▼
                           ┌───────────────────────┐
                           │ Database Persistence  │ ─── SQLite / PostgreSQL + SSE
                           └───────────────────────┘
```

---

## Technology Stack

- **Backend**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, LangGraph, LangChain Core, Google Generative AI, OpenAI SDK, ChromaDB, pypdf, python-docx, sse-starlette, duckduckgo-search.
- **Frontend**: React 18, Vite, TypeScript (strict mode), Tailwind CSS, Lucide React, TanStack Query, React Markdown, Remark GFM, Recharts.
- **Containerization**: Docker, Docker Compose, Nginx.
- **Testing**: Pytest (backend), Vitest + Testing Library (frontend).

---

## Prerequisites

- **Python**: 3.12 or compatible Python 3 version
- **Node.js**: v18+ (v20+ recommended)
- **Docker**: (Optional, for containerized run)

---

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/temkin/deep-research-ai.git
cd deep-research-ai
```

### 2. Set Up Backend
```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Set Up Frontend
In a separate terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open `http://localhost:3000` to access the application.

---

## Environment Configuration

Configure `backend/.env` according to your environment:

```env
ENVIRONMENT=development
LOG_LEVEL=INFO
APP_HOST=0.0.0.0
APP_PORT=8000
FRONTEND_URL=http://localhost:3000

# Primary LLM Provider: "gemini" or "openai" or "demo"
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Optional OpenAI Provider Adapter
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Search Provider: "duckduckgo", "tavily", "serper", or "demo"
SEARCH_PROVIDER=duckduckgo
TAVILY_API_KEY=
SERPER_API_KEY=

# Database Configuration (SQLite default; PostgreSQL supported)
DATABASE_URL=sqlite:///./deep_research.db

# Chroma Persistence
CHROMA_PERSIST_DIRECTORY=./chroma_db
UPLOAD_DIRECTORY=./uploads
```

---

## Database Migrations

Apply migrations to initialize all tables:
```bash
cd backend
.venv/bin/alembic upgrade head
```

To autogenerate a migration after editing entities in `app/models/entities.py`:
```bash
cd backend
.venv/bin/alembic revision --autogenerate -m "describe_changes"
```

---

## Running Automated Tests

### Backend Test Suite (Pytest)
```bash
cd backend
.venv/bin/pytest tests/ -v
```
Verifies 18 unit and integration tests across agents, workflows, citation validation, SSRF security, vector similarity, and API endpoints.

### Frontend Test Suite (Vitest)
```bash
cd frontend
npm run test
```

### Production Build Check
```bash
cd frontend
npm run build
```

---

## Docker & Containerized Deployment

To run the entire full-stack application (PostgreSQL + FastAPI + ChromaDB + Nginx React Frontend):

```bash
docker compose up -d --build
```

Access the frontend at `http://localhost:3000` and API docs at `http://localhost:8000/docs`.

To tear down services:
```bash
docker compose down
```

---

## API Documentation

Interactive OpenAPI documentation is automatically served by FastAPI:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- Detailed Markdown endpoint reference: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

---

## Security & SSRF Guardrails

- **SSRF Network Filter**: Validates all search-discovered URLs against RFC-1918 private subnets, loopbacks (`127.0.0.0/8`, `::1`), and cloud metadata (`169.254.169.254`).
- **Prompt Injection Defense**: Neutralizes `<script>` and `<iframe>` tags, flags instruction override phrases, and bounds external evidence within strict untrusted context tags.
- **Secret Isolation**: Zero secrets or credentials are bundled in client-side code or Docker layers.

---

## Known Limitations

- **Paywalled Sites**: Crawler agents cannot access content protected behind paywalls, CAPTCHAs, or authentication gates.
- **Scanned PDFs**: Uploaded documents must have extractable text streams; pure raster image scans without OCR are rejected.
- **Automated Verification**: Fact-checking guarantees alignment with retrieved excerpts; it does not replace human editorial judgment if external sources publish falsehoods.

---

## Documentation Index

Comprehensive guides located in `docs/`:
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): Architectural design, subsystems, and component topologies.
- [`docs/AGENT_WORKFLOW.md`](docs/AGENT_WORKFLOW.md): Detailed 5-agent specifications and LangGraph transitions.
- [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md): Full REST API endpoint reference and payloads.
- [`docs/DATABASE.md`](docs/DATABASE.md): Entity relationship diagrams, schema definitions, and migration protocols.
- [`docs/SECURITY.md`](docs/SECURITY.md): Threat modeling, SSRF filters, and prompt injection isolation.
- [`docs/TESTING.md`](docs/TESTING.md): Multi-tiered test execution guides and coverage notes.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Production cloud guides for Render, Railway, Vercel, and Docker.
- [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md): End-user walkthrough from prompt configuration to report export.
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md): Common error recovery and configuration fixes.
- [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md): Transparent ethical and technical boundary disclosures.
- [`docs/SHOWCASE.md`](docs/SHOWCASE.md): Demonstration script, portfolio summary, and 15+ technical interview Q&As.
- [`docs/Deep_Research_AI_Showcase.pptx`](docs/Deep_Research_AI_Showcase.pptx): 15-slide Executive PowerPoint presentation deck.

---

## Project Roadmap

- [x] **Week 9: Research Agent** — Multi-agent LangGraph workflow, planner, researcher, analyst, verifier, reporter, shared evidence registry, citation validation.
- [x] **Week 11: Production Agent** — FastAPI backend, PostgreSQL/SQLite persistence, Alembic migrations, ChromaDB RAG, SSRF protection, Docker Compose, 100% passing tests.
- [x] **Week 13: Final Showcase** — Executive Light-Brown UI, complete technical documentation suite, 15-slide PowerPoint deck, 5-8 minute demo script, 15+ interview Q&As.

---

## License

This project is licensed under the MIT License.
