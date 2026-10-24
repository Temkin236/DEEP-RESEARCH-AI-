import logging
from typing import List, Dict, Any
from app.services.llm_service import llm_service
from app.schemas.research import ResearcherOutput, AnalystOutput, EvidenceSynthesis

logger = logging.getLogger(__name__)

ANALYST_SYSTEM_PROMPT = """
You are the Lead Analyst for TechResearch Agent (A team of agents writes you a report).
Your responsibility is to critically evaluate collected evidence, synthesize cross-source findings,
and separate verified facts from conjectures or divergent opinions on technical and engineering topics.

Requirements:
1. Synthesize common technical patterns, recurring benchmarks, and empirical consensus across sources.
2. Identify distinct architectural trade-offs, performance divergence, or security considerations.
3. Categorize findings by subquestion and assess realistic confidence scores (0.0 to 1.0).
4. Explicitly flag missing technical information or unresolved constraints.
"""

class AnalystAgent:
    def analyze(self, topic: str, research_data: ResearcherOutput) -> AnalystOutput:
        logger.info(f"AnalystAgent synthesizing {len(research_data.evidences)} evidence items")

        # Format evidence items for prompt
        evidence_summary_lines = []
        for i, ev in enumerate(research_data.evidences, start=1):
            evidence_summary_lines.append(
                f"[{i}] Title: {ev.title}\n"
                f"    Subquestion: {ev.subquestion}\n"
                f"    Domain: {ev.domain}\n"
                f"    Snippet: {ev.snippet}\n"
            )

        prompt = (
            f"Research Subject: {topic}\n\n"
            f"Collected Evidence Dossier:\n"
            f"{''.join(evidence_summary_lines)}\n\n"
            f"Perform an exhaustive analytical evaluation. Group claims by subquestion and identify recurring themes."
        )

        output = llm_service.generate_structured(
            prompt=prompt,
            schema_cls=AnalystOutput,
            system_instruction=ANALYST_SYSTEM_PROMPT
        )
        return output

analyst_agent = AnalystAgent()
