import logging
from typing import List, Dict, Any
from app.services.llm_service import llm_service
from app.services.citation_engine import citation_engine
from app.schemas.research import (
    PlannerOutput,
    ResearcherOutput,
    AnalystOutput,
    VerifierOutput,
    ReportWriterOutput,
)

logger = logging.getLogger(__name__)

REPORTER_SYSTEM_PROMPT = """
You are the Lead Report Writer for TechResearch Agent (A team of agents writes you a report).
Your task is to synthesize verified research findings into an elegant, authoritative, publication-quality technical report.

Structural Standards:
1. Executive Summary: High-level synthesis of primary discoveries and implications.
2. Research Question & Scope: Contextualize the inquiry and operational boundaries.
3. Methodology: Explain multi-agent planning, evidence retrieval, and verification protocols.
4. Key Findings: 3-5 concise bulleted core insights.
5. Detailed Analysis: In-depth sections referencing verified evidence with numbered brackets like [1], [2].
6. Comparison Tables: Markdown comparison tables highlighting core trade-offs, metrics, or paradigms.
7. Evidence-Backed Recommendations: Actionable next steps grounded in findings.
8. Limitations & Unresolved Questions: Transparent disclosure of evidentiary constraints and uncertainty.
9. Conclusion: Concise strategic wrap-up.

Citation Rule:
- When stating verified claims, cite the evidence using bracket notation: [1], [2], etc., matching the provided numbered source list.
- Do NOT invent citations or URLs.
"""

class ReportWriterAgent:
    def write_report(
        self,
        topic: str,
        plan: PlannerOutput,
        research_data: ResearcherOutput,
        analysis: AnalystOutput,
        verification: VerifierOutput,
        registered_sources: List[Dict[str, Any]]
    ) -> ReportWriterOutput:
        logger.info("ReportWriterAgent compiling comprehensive report")

        sources_dossier = []
        for s in registered_sources:
            sources_dossier.append(f"[{s['index']}] {s['title']} ({s['url']}) - Excerpt: {s['snippet']}")

        verified_claims_text = []
        for c in verification.verified_claims:
            verified_claims_text.append(f"- {c.get('claim')}")

        prompt = (
            f"Research Inquiry: {topic}\n\n"
            f"Registered Sources & Excerpts:\n"
            f"{chr(10).join(sources_dossier)}\n\n"
            f"Verified Core Claims:\n"
            f"{chr(10).join(verified_claims_text)}\n\n"
            f"Key Themes:\n"
            f"{', '.join(analysis.synthesis.key_themes)}\n\n"
            f"Write the full research report adhering to the structural requirements and citation rules."
        )

        output = llm_service.generate_structured(
            prompt=prompt,
            schema_cls=ReportWriterOutput,
            system_instruction=REPORTER_SYSTEM_PROMPT
        )

        # Validate citations in markdown content against registered sources
        validated_md, active_cites, warnings = citation_engine.validate_citations_in_text(
            markdown_text=output.markdown_content,
            registered_sources=registered_sources
        )
        output.markdown_content = validated_md
        if warnings:
            logger.info(f"Citation validation resolved {len(warnings)} issues: {warnings}")

        return output

report_writer_agent = ReportWriterAgent()
