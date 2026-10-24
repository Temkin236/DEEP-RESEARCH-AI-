# Limitations and Ethical Boundary Disclosure — Tech Research AI

In accordance with responsible AI development standards, this document discloses known system boundaries, technical constraints, and operating limits.

---

## 1. Web Crawling & Content Ingestion
- **Paywalled & Authenticated Content**: The autonomous researcher agent cannot bypass paywalls, human authentication gates (OAuth, CAPTCHAs), or multi-factor authentication.
- **Client-Side Heavy JavaScript (SPAs)**: The lightweight HTTP search client parses static HTML and direct API metadata; complex client-side rendered DOMs requiring headless browser automation (e.g. Playwright) are not executed during default search passes.
- **Temporal Currency**: Search results depend on the index latency of external search providers (DuckDuckGo, Tavily, Serper). Real-time events occurring within minutes of the search may not yet be indexed.

---

## 2. Document Processing & OCR
- **Raster Scans**: Documents must possess an extractable text stream. Pure raster image scans without embedded text are rejected with a clear error prompt rather than generating hallucinated approximations.
- **File Size Ceiling**: Document uploads are capped at 25MB to prevent memory exhaustion and runaway vector indexing times.

---

## 3. Verification & Citation Boundary
- **Automated Verification vs. Human Fact-Checking**: The Verification Agent cross-corroborates claims against evidence snippets in the registry. While this reliably eliminates pure model hallucinations, it cannot detect subtle factual inaccuracies if the underlying external source itself contains false information.
- **Divergent & Conflicting Topics**: On politically sensitive or rapidly evolving scientific controversies, multiple authoritative sources may state conflicting claims. The Analyst Agent is programmed to record divergence rather than artificially picking a winner.

---

## 4. Operational & Cost Bounds
- **Concurrency & Rate Limits**: Multi-agent iterations are strictly capped at `MAX_RESEARCH_ITERATIONS=2` to prevent infinite LLM loops and uncontrolled API credit consumption.
- **Bounded Sources**: Maximum sources per query are bounded between 2 and 20 to preserve prompt context coherence and maintain sub-second retrieval latency.
