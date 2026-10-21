import logging
from typing import List, Dict, Any
from app.services.llm_service import llm_service
from app.schemas.research import ResearcherOutput, AnalystOutput, VerifierOutput

logger = logging.getLogger(__name__)

VERIFIER_SYSTEM_PROMPT = """
You are the Strict Verification & Fact-Checking Agent for Deep Research AI.
Your role is to rigorously check candidate claims against the provided evidence snippets.

Strict Grounding Rules:
1. Every claim must have direct support in one or more evidence excerpts.
2. If a claim makes assertions that cannot be verified from the excerpts, categorize it as disputed or unsupported.
3. Validate source URLs and flag low-credibility domains or circular citations.
4. Assess overall evidence sufficiency: if critical facets of the primary question lack grounding, flag evidence_sufficient=False and provide targeted follow-up queries.
"""

class VerificationAgent:
    def verify(self, topic: str, research_data: ResearcherOutput, analysis: AnalystOutput) -> VerifierOutput:
        logger.info("VerificationAgent validating claims against evidence registry")

        evidence_references = []
        for i, ev in enumerate(research_data.evidences, start=1):
            evidence_references.append(f"Source [{i}] ({ev.url}): {ev.snippet}")

        findings_text = []
        for item in analysis.structured_findings:
            findings_text.append(f"- Claim: {item.get('claim')} [Subquestion: {item.get('subquestion')}]")

        prompt = (
            f"Research Subject: {topic}\n\n"
            f"Available Evidence Excerpts:\n"
            f"{chr(10).join(evidence_references)}\n\n"
            f"Candidate Claims from Analysis:\n"
            f"{chr(10).join(findings_text)}\n\n"
            f"Cross-check each claim against the excerpts. Verify claims, identify any disputed statements, and determine if evidence is sufficient."
        )

        output = llm_service.generate_structured(
            prompt=prompt,
            schema_cls=VerifierOutput,
            system_instruction=VERIFIER_SYSTEM_PROMPT
        )
        return output

verifier_agent = VerificationAgent()
