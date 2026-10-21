import logging
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from app.agents.planner import planner_agent
from app.agents.researcher import researcher_agent
from app.agents.analyst import analyst_agent
from app.agents.verifier import verifier_agent
from app.agents.reporter import report_writer_agent
from app.services.citation_engine import citation_engine
from app.schemas.research import (
    PlannerOutput,
    ResearcherOutput,
    AnalystOutput,
    VerifierOutput,
    ReportWriterOutput,
    ResearchSubtask,
    ResearcherEvidence,
)

logger = logging.getLogger(__name__)

class ResearchWorkflowState(TypedDict):
    job_id: str
    topic: str
    instructions: Optional[str]
    depth: str
    focus: str
    max_sources: int
    selected_documents: List[str]

    iteration_count: int
    plan: Optional[Dict[str, Any]]
    research_data: Optional[Dict[str, Any]]
    analysis: Optional[Dict[str, Any]]
    verification: Optional[Dict[str, Any]]
    registered_sources: List[Dict[str, Any]]
    report: Optional[Dict[str, Any]]

    current_stage: str
    progress: int
    events: List[Dict[str, Any]]
    error: Optional[str]

def plan_node(state: ResearchWorkflowState) -> Dict[str, Any]:
    logger.info(f"[{state['job_id']}] Workflow Node: Planning")
    try:
        plan_output = planner_agent.plan(
            topic=state["topic"],
            depth=state["depth"],
            focus=state["focus"],
            instructions=state.get("instructions") or ""
        )
        subtask_count = len(plan_output.subtasks)
        new_event = {
            "agent_name": "Research Planner",
            "stage": "Planning",
            "message": f"Formulated {subtask_count} research subquestions with targeted search queries.",
            "event_type": "progress",
            "payload_json": {"subtasks": [s.subquestion for s in plan_output.subtasks]}
        }
        return {
            "plan": plan_output.model_dump(),
            "current_stage": "Researching Evidence",
            "progress": 25,
            "events": state["events"] + [new_event]
        }
    except Exception as e:
        logger.error(f"Error in plan_node: {e}")
        return {"error": f"Planning failed: {str(e)}", "current_stage": "Failed"}

def research_node(state: ResearchWorkflowState) -> Dict[str, Any]:
    logger.info(f"[{state['job_id']}] Workflow Node: Research Gathering")
    try:
        plan_obj = PlannerOutput.model_validate(state["plan"])
        research_out = researcher_agent.conduct_research(
            plan=plan_obj,
            max_sources_total=state["max_sources"],
            focus=state["focus"],
            selected_documents=state.get("selected_documents", [])
        )

        # Register and deduplicate sources
        registered = citation_engine.register_sources([
            ev.model_dump() for ev in research_out.evidences
        ])

        new_event = {
            "agent_name": "Researcher Agent",
            "stage": "Research Gathering",
            "message": f"Collected {len(registered)} distinct verified evidence sources.",
            "event_type": "source",
            "payload_json": {"source_count": len(registered), "sources": [s["title"] for s in registered]}
        }
        return {
            "research_data": research_out.model_dump(),
            "registered_sources": registered,
            "current_stage": "Analyzing Findings",
            "progress": 50,
            "events": state["events"] + [new_event]
        }
    except Exception as e:
        logger.error(f"Error in research_node: {e}")
        return {"error": f"Research failed: {str(e)}", "current_stage": "Failed"}

def analyze_node(state: ResearchWorkflowState) -> Dict[str, Any]:
    logger.info(f"[{state['job_id']}] Workflow Node: Analyzing Findings")
    try:
        research_obj = ResearcherOutput.model_validate(state["research_data"])
        analysis_out = analyst_agent.analyze(
            topic=state["topic"],
            research_data=research_obj
        )

        new_event = {
            "agent_name": "Analyst Agent",
            "stage": "Analysis",
            "message": f"Synthesized findings into {len(analysis_out.synthesis.key_themes)} core analytical themes.",
            "event_type": "finding",
            "payload_json": {"themes": analysis_out.synthesis.key_themes}
        }
        return {
            "analysis": analysis_out.model_dump(),
            "current_stage": "Verifying Evidence & Claims",
            "progress": 70,
            "events": state["events"] + [new_event]
        }
    except Exception as e:
        logger.error(f"Error in analyze_node: {e}")
        return {"error": f"Analysis failed: {str(e)}", "current_stage": "Failed"}

def verify_node(state: ResearchWorkflowState) -> Dict[str, Any]:
    logger.info(f"[{state['job_id']}] Workflow Node: Verifying Evidence")
    try:
        research_obj = ResearcherOutput.model_validate(state["research_data"])
        analysis_obj = AnalystOutput.model_validate(state["analysis"])

        verifier_out = verifier_agent.verify(
            topic=state["topic"],
            research_data=research_obj,
            analysis=analysis_obj
        )

        status_msg = "All claims verified against evidence registry." if verifier_out.evidence_sufficient else "Identified evidentiary gaps; initiating targeted follow-up."
        new_event = {
            "agent_name": "Verification Agent",
            "stage": "Verification",
            "message": status_msg,
            "event_type": "progress",
            "payload_json": {
                "verified_claims_count": len(verifier_out.verified_claims),
                "is_sufficient": verifier_out.evidence_sufficient
            }
        }
        return {
            "verification": verifier_out.model_dump(),
            "current_stage": "Drafting Report",
            "progress": 85,
            "events": state["events"] + [new_event]
        }
    except Exception as e:
        logger.error(f"Error in verify_node: {e}")
        return {"error": f"Verification failed: {str(e)}", "current_stage": "Failed"}

def targeted_research_node(state: ResearchWorkflowState) -> Dict[str, Any]:
    """Execute targeted follow-up queries if evidence was judged insufficient."""
    logger.info(f"[{state['job_id']}] Workflow Node: Targeted Follow-Up Research (Iteration {state['iteration_count'] + 1})")
    try:
        verification = state.get("verification", {})
        follow_ups = verification.get("targeted_follow_ups", [])
        if not follow_ups:
            follow_ups = [f"{state['topic']} detailed implementation case studies"]

        additional_evidences = []
        for q in follow_ups[:2]:
            from app.services.search_service import search_service
            extra_res = search_service.search(query=q, max_results=2, focus=state["focus"])
            for item in extra_res:
                additional_evidences.append({
                    "subquestion": "Targeted Follow-Up",
                    "title": item.get("title", "Supplementary Source"),
                    "url": item.get("url", ""),
                    "domain": item.get("domain", ""),
                    "snippet": item.get("snippet", ""),
                    "publication_date": item.get("publication_date"),
                    "reliability_assessment": "high"
                })

        # Update registered sources
        new_registered = citation_engine.register_sources(
            state["registered_sources"] + additional_evidences
        )

        new_event = {
            "agent_name": "Researcher Agent (Targeted)",
            "stage": "Targeted Follow-Up",
            "message": f"Incorporated {len(additional_evidences)} supplementary evidence points to resolve ambiguity.",
            "event_type": "source",
            "payload_json": {"new_sources_count": len(additional_evidences)}
        }
        return {
            "registered_sources": new_registered,
            "iteration_count": state["iteration_count"] + 1,
            "events": state["events"] + [new_event]
        }
    except Exception as e:
        logger.error(f"Error in targeted_research_node: {e}")
        return {"iteration_count": state["iteration_count"] + 1}

def report_node(state: ResearchWorkflowState) -> Dict[str, Any]:
    logger.info(f"[{state['job_id']}] Workflow Node: Assembling Report")
    try:
        plan_obj = PlannerOutput.model_validate(state["plan"])
        research_obj = ResearcherOutput.model_validate(state["research_data"])
        analysis_obj = AnalystOutput.model_validate(state["analysis"])
        verification_obj = VerifierOutput.model_validate(state["verification"])

        report_out = report_writer_agent.write_report(
            topic=state["topic"],
            plan=plan_obj,
            research_data=research_obj,
            analysis=analysis_obj,
            verification=verification_obj,
            registered_sources=state["registered_sources"]
        )

        word_count = len(report_out.markdown_content.split())
        new_event = {
            "agent_name": "Report Writer",
            "stage": "Completed",
            "message": f"Generated structured research report ({word_count} words) with grounded citations.",
            "event_type": "completion",
            "payload_json": {"title": report_out.title, "word_count": word_count}
        }
        return {
            "report": report_out.model_dump(),
            "current_stage": "Completed",
            "progress": 100,
            "events": state["events"] + [new_event]
        }
    except Exception as e:
        logger.error(f"Error in report_node: {e}")
        return {"error": f"Report generation failed: {str(e)}", "current_stage": "Failed"}

def route_after_verification(state: ResearchWorkflowState) -> str:
    """Conditional routing based on evidence sufficiency and iteration limits."""
    if state.get("error"):
        return END

    verification = state.get("verification", {})
    is_sufficient = verification.get("evidence_sufficient", True)
    iteration_count = state.get("iteration_count", 0)

    if not is_sufficient and iteration_count < 1:
        return "targeted_research"
    return "report"

def build_research_graph():
    """Construct and compile the LangGraph StateGraph workflow."""
    builder = StateGraph(ResearchWorkflowState)

    builder.add_node("plan", plan_node)
    builder.add_node("research", research_node)
    builder.add_node("analyze", analyze_node)
    builder.add_node("verify", verify_node)
    builder.add_node("targeted_research", targeted_research_node)
    builder.add_node("report", report_node)

    builder.set_entry_point("plan")
    builder.add_edge("plan", "research")
    builder.add_edge("research", "analyze")
    builder.add_edge("analyze", "verify")

    builder.add_conditional_edges(
        "verify",
        route_after_verification,
        {
            "targeted_research": "targeted_research",
            "report": "report",
            END: END
        }
    )
    builder.add_edge("targeted_research", "analyze")
    builder.add_edge("report", END)

    return builder.compile()

research_graph = build_research_graph()
