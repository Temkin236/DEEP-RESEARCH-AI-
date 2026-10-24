# User Guide — Tech Research AI

## 1. Getting Started

1. Open your browser to `http://localhost:3000`.
2. Review the public landing page explaining the 5-agent research pipeline.
3. Click **"Start Research"** or navigate to **Dashboard**.

---

## 2. Launching an Investigation

1. Navigate to **New Research**.
2. **Topic**: Enter your primary research inquiry (e.g., *"Compare LangGraph, CrewAI, and PydanticAI for building a resilient Python AI application"*).
3. **Instructions**: Add any special scope or constraints (e.g., *"Focus on error recovery, state cycles, and production deployment"*).
4. **Depth**: Select:
   - **Quick**: 3-4 sources, ~45s duration.
   - **Standard**: 6-8 sources, ~90s duration.
   - **Deep**: 10-15 sources, multi-iteration gap analysis.
5. **Focus**: Choose between General, Technical, Academic, Business, or Comparative.
6. **Include Documents**: Select any previously uploaded internal PDFs or notes.
7. Click **"Start Research"**.

---

## 3. Real-Time Workspace Monitoring

Upon submission, you are routed to the **Live Research Workspace**:
- **Milestone Bar**: Shows progress across Planning, Researching, Analyzing, Verifying, and Reporting.
- **Agent Activity Timeline**: Displays events emitted in real time by each agent via Server-Sent Events (SSE). Expand any event to inspect its underlying telemetry JSON.
- **Discovered Evidence**: Inspect live source titles, URLs, domains, and snippet excerpts as they are captured.
- **Synthesized Findings**: Read verified claims and confidence scores.

---

## 4. Reading & Exporting Reports

When research completes, click **"Open Completed Report"**:
- **Executive Summary**: Callout summarizing key insights.
- **Markdown Analysis**: In-depth sections with comparison tables and bullet points.
- **Inline Citations**: Numbered citation tags like `[1]`, `[2]` linking directly to verified entries in the evidence registry.
- **Exporting**:
  - Click **Copy Markdown** to copy report text to clipboard.
  - Click **Download** to save as a `.md` file.
  - Click **Print Report** to generate a clean, print-friendly PDF document.
