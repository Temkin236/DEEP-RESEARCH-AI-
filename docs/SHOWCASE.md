# Final Showcase & Portfolio Guide — Tech Research AI

## 1. Project Portfolio Summary

**Title**: Tech Research AI — Autonomous Multi-Agent Research Platform  
**Role**: Full-Stack AI Engineer & Systems Architect  
**Core Technologies**: LangGraph, FastAPI, Python 3.12, React 18, Vite, TypeScript, Tailwind CSS, PostgreSQL, SQLAlchemy, Alembic, ChromaDB, Docker.

### Executive Problem Statement:
Standard LLM chat applications suffer from three critical flaws when handling complex research inquiries:
1. **Hallucination & Fabrication**: Models invent citations, phantom academic papers, and broken URLs.
2. **Uncoordinated Monolithic Reasoning**: A single model context cannot simultaneously plan, execute web crawls, synthesize divergent views, and fact-check its own assertions.
3. **Black-Box Progress**: Long-running research tasks leave users with uninformative spinning loaders and no visibility into discovered evidence.

### Solution & Engineering Architecture:
Tech Research AI resolves these failures through a **stateful multi-agent system** orchestrated via LangGraph:
- **5 Specialized Autonomous Agents**: Planner / Coordinator, Researcher, Analyst, Verification Agent, and Report Writer.
- **Shared Evidence Registry**: Ingests, normalizes, and indexes live web results and uploaded documents into an authoritative evidence database.
- **Strict Citation Validation**: A deterministic citation engine matches every report claim to registry excerpts, stripping hallucinated citation markers before user presentation.
- **Real-Time Streaming Workspace**: Server-Sent Events (SSE) broadcast granular agent actions, findings, and telemetry without blocking API endpoints.
- **Light-Brown Executive Aesthetics**: Designed with warm ivory (`#FAF7F2`), cream (`#F3EADF`), warm brown (`#B89576`), and forest green verified tokens (`#52785C`).

---

## 2. Realistic 5–8 Minute Demonstration Script

### Act 1: The Research Dilemma & Application Launch (0:00 - 1:30)
- **Action**: Open `http://localhost:3000` to the Landing Page.
- **Spoken Narration**: *"Welcome to Tech Research AI. Today, enterprise research requires synthesizing dozens of technical sources without falling prey to hallucinations or fabricated links. Tech Research AI replaces single-prompt chatbots with an orchestrated multi-agent pipeline."*
- **Visual Highlight**: Scroll through the 5-stage workflow diagram (`Plan → Research → Analyze → Verify → Report`) and the light-brown, ivory executive design system.

### Act 2: Initializing an Investigation (1:30 - 3:00)
- **Action**: Click "New Research" or "Dashboard". Select the quick-start prompt: *"Compare LangGraph, CrewAI, and PydanticAI for building a resilient Python AI application"*.
- **Spoken Narration**: *"We configure our inquiry with Standard depth and Comparative focus. Notice we can also attach previously uploaded private documents—such as enterprise architecture memos—to ground the research directly in internal vector embeddings."*
- **Action**: Click "Start Research".

### Act 3: Live Agent Coordination & Event Telemetry (3:00 - 5:00)
- **Action**: Arrive at the Live Research Workspace (`/workspace/:id`).
- **Spoken Narration**: *"The workspace connects immediately via Server-Sent Events. In the timeline, you can observe the Research Planner deconstruct our question into three facets: Core Architecture, Performance Benchmarks, and Security. Next, the Researcher Agent queries search endpoints and retrieves evidence. In the right panel, verified source cards appear in real time."*
- **Visual Highlight**: Expand an event to reveal the raw JSON telemetry payload. Point out the Verification Agent checking claim confidence and verifying source accessibility.

### Act 4: The Verified Research Report & Export (5:00 - 6:45)
- **Action**: Once the progress bar hits 100%, click "Open Completed Report".
- **Spoken Narration**: *"Here is our final research dossier. It includes an Executive Summary, Methodology, Detailed Analysis, and Markdown Comparison Tables. Crucially, notice the bracketed citation chips like [1] and [2]. These are not model memory inventions—every single citation maps directly to our evidence registry with domain metadata, excerpts, and timestamps."*
- **Visual Highlight**: Click "Copy Markdown", click "Download .md", and click "Print Report" to demonstrate the print-optimized document view.

### Act 5: Document Library, Testing & Security Architecture (6:45 - 8:00)
- **Action**: Navigate to Document Library (`/documents`), show drag-and-drop indexing in ChromaDB, and mention the 18 passing backend pytest tests and 3 vitest suites.
- **Closing**: *"Tech Research AI proves that by decoupling research planning, evidence collection, and verification into discrete agents with strict validation boundaries, autonomous AI can produce grounded, enterprise-grade research."*

---

## 3. Technical Interview Preparation (15+ Questions & Truthful Answers)

### Q1: Why did you choose LangGraph for agent orchestration over CrewAI or AutoGen?
**Answer**: *"LangGraph provides explicit, cyclic, stateful graph modeling using a typed `StateGraph`. Unlike CrewAI or AutoGen which often rely on open-ended conversational loops that are prone to infinite agent delegation, LangGraph gives fine-grained programmatic control over state transitions, conditional edges, retry bounds, and node-level error recovery. This guarantees that our research pipeline transitions reliably from Planning to Researching to Verification without runaway cycles."*

### Q2: How does the system prevent hallucinated citations?
**Answer**: *"We decoupled evidence collection from report generation. When sources are retrieved, they are assigned a persistent internal ID and registered in a centralized evidence registry. When the Report Writer drafts the final markdown, the text is processed by a deterministic citation validator (`citation_engine.py`). It parses all bracketed citations e.g. `[1]`, `[2]`, validates that the index exists in the evidence registry, and strips or flags any ungrounded numbers. Claims without matching excerpts are rejected."*

### Q3: How do you handle long-running research tasks without blocking FastAPI requests?
**Answer**: *"Research investigations can take 60 to 180 seconds. We execute the LangGraph pipeline in an asynchronous background worker using `asyncio.to_thread`. The API endpoint immediately returns a `201 Created` with a unique job ID. The client connects to an SSE endpoint (`/events`) which streams live progress events from an in-memory queue while persisting every event to SQLite/PostgreSQL. If the user refreshes their browser, the state and past event logs are replayed from the database."*

### Q4: How is Server-Sent Events (SSE) architected for reconnect resilience?
**Answer**: *"When an SSE connection opens, the generator first queries all persisted `WorkflowEvent` records from the database in chronological order and yields them to the client. It then subscribes an `asyncio.Queue` to live broadcasts. Heartbeat comments (`: keep-alive`) are dispatched every 15 seconds to prevent reverse proxy timeouts. If the connection drops and reconnects, the client receives the complete historical replay followed by any remaining live events."*

### Q5: What security guardrails are implemented against Server-Side Request Forgery (SSRF)?
**Answer**: *"Because our agent autonomously discovers URLs from search queries, making unconstrained HTTP GET requests is a critical SSRF vulnerability. We implemented `app/security/ssrf.py` which inspects every URL before request dispatch. It verifies that schemes are strictly `http` or `https`, resolves the hostname's DNS, and checks the IP against blocked CIDR blocks: loopbacks (`127.0.0.0/8`, `::1`), private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud metadata IP (`169.254.169.254`)."*

### Q6: How do you defend against prompt injection embedded in external web pages or uploaded documents?
**Answer**: *"We treat all external web text and uploaded documents as untrusted data. In `app/security/sanitize.py`, raw text is stripped of HTML scripts, length-capped, and checked for known prompt injection phrases like 'ignore previous instructions'. Crucially, when passed to LLM prompts, the text is wrapped in strict framing markers: `--- BEGIN UNTRUSTED EVIDENCE ---` with explicit system instructions that the content is factual data only and must never be interpreted as commands."*

### Q7: How does Document RAG integrate with web research in the same report?
**Answer**: *"When a user selects uploaded documents during job creation, the Researcher Agent queries ChromaDB using vector similarity search for the subquestions in parallel with external web search. Chunks retrieved from ChromaDB are converted into pseudo-URLs (`document://<doc_id>#chunk-<i>`) and added to the same evidence registry as web sources. The Analyst and Report Writer agents evaluate both types of evidence under the same citation mechanism."*

### Q8: What embedding model and chunking strategy did you use?
**Answer**: *"We implemented recursive character chunking with a 1,000-character window and 200-character overlap to preserve semantic context across chunk boundaries. Embeddings are stored in persistent local ChromaDB collections using cosine distance. In offline or test environments, a fallback in-memory keyword-scoring index ensures zero test failures without requiring active cloud credentials."*

### Q9: How do you manage database schema changes across environments?
**Answer**: *"We use Alembic migrations configured against our SQLAlchemy declarative models in `backend/alembic/`. In development, the system runs with local SQLite for instant developer onboarding without installing PostgreSQL; in production, Docker Compose provisions PostgreSQL 16. Migrations are automatically applied during deployment via `alembic upgrade head`."*

### Q10: How do you test the multi-agent system without spending paid API credits on every CI run?
**Answer**: *"We designed an intelligent fallback service in `LLMService` and a transparent demo provider in `SearchService`. When API keys are absent or when running unit tests, the service generates deterministic, schema-validated Pydantic models. We never claim mock results are real web results—mock sources are explicitly tagged with `source_type='mock_demo'`. This allows our 18 pytest tests and GitHub CI pipeline to run deterministically and free of charge."*

### Q11: What happens if the search provider rate limits or fails?
**Answer**: *"The search adapter catches exceptions gracefully. If DuckDuckGo rate limits or Tavily encounters network timeouts, the system records unresolved queries in `ResearcherOutput.unresolved_queries`, logs a warning, and falls back to cached knowledge or prompts the Verification Agent to flag evidentiary gaps. The pipeline never crashes on a network timeout."*

### Q12: Why did you choose a light-brown / ivory aesthetic instead of a standard dark mode?
**Answer**: *"The product is designed as an executive, commercial research tool. Traditional dark mode interfaces can feel like developer consoles or casual chat apps. The warm ivory (`#FAF7F2`), cream (`#F3EADF`), and warm brown (`#B89576`) palette evokes archival paper, academic journals, and professional publishing houses, while maintaining accessible contrast ratios for long reading sessions."*

### Q13: What is the role of the Verification Agent in the LangGraph conditional routing?
**Answer**: *"In `research_graph.py`, after the Analyst Agent synthesizes claims, the Verification Agent evaluates `evidence_sufficient`. If critical claims lack grounding, a conditional edge routes the state to a `targeted_research` node. This node formulates targeted follow-up queries to fill the gaps, increments `iteration_count`, and loops back. To prevent infinite loops, the graph limits iterations to 1 follow-up loop before forcing compilation."*

### Q14: How does the system handle scanned PDF documents?
**Answer**: *"In `document_service.py`, `pypdf` extracts text from each page stream. If a PDF contains only raster images without an embedded text layer, the system raises a clear `ValueError: 'PDF appears to be scanned or contains no extractable text'`. This returns a 422 Unprocessable Entity error to the user rather than hallucinating content or silently failing."*

### Q15: What are the primary remaining technical bottlenecks for scaling this architecture?
**Answer**: *"First, parsing dynamic JavaScript-rendered single-page applications requires integrating headless browser workers like Playwright. Second, scaling to thousands of concurrent users requires replacing in-memory asyncio queues with a distributed message broker like Redis Pub/Sub or RabbitMQ and running Celery/Temporal workers. Third, implementing hybrid dense-sparse retrieval (BM25 + SPLADE + dense embeddings) would further boost retrieval precision across niche technical vocabularies."*
