import logging
from typing import Dict, Any, List
from app.services.llm_service import llm_service
from app.schemas.research import PlannerOutput, ResearchSubtask

logger = logging.getLogger(__name__)

PLANNER_SYSTEM_PROMPT = """
You are the Lead Research Planner & Coordinator for Deep Research AI.
Your objective is to dissect a complex research topic into focused, non-overlapping subquestions,
formulate targeted web search queries, and define clear evidence requirements.

Guiding Principles:
1. Deconstruct the primary question into 3-4 granular, logical facets (e.g. Architectural Foundations, Real-World Benchmarks, Security/Limitations).
2. For each facet, produce 2-3 precise, search-engine-friendly search queries (avoid long conversational sentences).
3. Identify relevant domain constraints and estimate total evidence requirements.
4. Distinguish empirical facts from opinions.
"""

class ResearchPlannerAgent:
    def plan(self, topic: str, depth: str = "standard", focus: str = "general", instructions: str = "") -> PlannerOutput:
        logger.info(f"ResearchPlannerAgent creating plan for topic: '{topic}' (depth: {depth}, focus: {focus})")
        
        prompt = (
            f"Primary Research Topic: {topic}\n"
            f"Research Depth: {depth}\n"
            f"Research Focus: {focus}\n"
        )
        if instructions:
            prompt += f"Special Instructions/Constraints: {instructions}\n"

        prompt += "\nDevelop a comprehensive multi-agent research plan with subtasks and query formulation."

        output = llm_service.generate_structured(
            prompt=prompt,
            schema_cls=PlannerOutput,
            system_instruction=PLANNER_SYSTEM_PROMPT
        )
        return output

planner_agent = ResearchPlannerAgent()
