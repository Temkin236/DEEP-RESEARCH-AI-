# Multi-Agent Research Workflow

## Workflow Architecture Diagram

```
User Query Submitted
        |
        v
+-----------------------+
|   Research Planner    | ---> Dissects inquiry into subquestions & queries
+-----------+-----------+
            |
            v
+-----------------------+
|   Researcher Agent    | ---> Queries Web & Document RAG in parallel
+-----------+-----------+
            |
            v
+-----------------------+
|     Analyst Agent     | ---> Compares evidence, finds themes & divergence
+-----------+-----------+
            |
            v
+-----------------------+
|  Verification Agent   | ---> Checks claims against source registry
+-----------+-----------+
            |
     Evidence Sufficient?
       /            \
     No              Yes
     /                \
+-----------+          +-----------------------+
| Targeted  |          |  Report Writer Agent  | ---> Compiles 11-section report
| Research  |          +-----------+-----------+
+-----+-----+                      |
      |                            v
      +--> (Re-evaluate)   +-----------------------+
                           |  Citation Validation  | ---> Strips ungrounded citations
                           +-----------+-----------+
                                       |
                                       v
                           +-----------------------+
                           |  Database & Frontend  | ---> Persists records & streams SSE
                           +-----------------------+
```

---

## Agent Specifications

### 1. Research Planner / Coordinator
- **Inputs**: User topic, investigation depth (`quick`, `standard`, `deep`), analytical focus (`general`, `technical`, `academic`, `business`, `comparative`), optional constraints.
- **Outputs**: `PlannerOutput` containing structured subtasks, search query sets, and required evidence quotas.

### 2. Researcher Agent
- **Inputs**: `PlannerOutput`, max source limit, selected document IDs.
- **Execution**: Concurrent search queries via configured provider (DuckDuckGo, Tavily, Serper, or transparent demo provider). Queries ChromaDB for top similarity matches.
- **Outputs**: `ResearcherOutput` containing deduplicated evidence snippets, domains, and publication dates.

### 3. Analyst Agent
- **Inputs**: Research dossier from Researcher Agent.
- **Execution**: Cross-corroborates claims, tags consensus vs disagreements, assigns confidence scores.
- **Outputs**: `AnalystOutput` with themes, structured findings, and missing facets.

### 4. Verification Agent
- **Inputs**: Evidence dossier and candidate findings.
- **Execution**: Cross-checks each assertion against registered excerpts. Verifies URL legitimacy. Decides if targeted follow-ups are required (bounded by `MAX_RESEARCH_ITERATIONS=2`).
- **Outputs**: `VerifierOutput` with verified claims, disputed claims, and follow-up targets.

### 5. Report Writer Agent
- **Inputs**: Verified claims, registered sources, and analytical themes.
- **Execution**: Assembles publication-ready markdown report with inline citation markers `[1]`, `[2]`. Passes draft through `citation_engine.validate_citations_in_text()` to guarantee every citation maps to the evidence registry.
- **Outputs**: `ReportWriterOutput` containing executive summary, methodology, key findings, detailed analysis, comparison tables, recommendations, limitations, conclusion, and references.
