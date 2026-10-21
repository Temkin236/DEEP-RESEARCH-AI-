import pytest
from app.workflows.research_graph import research_graph, ResearchWorkflowState

def test_full_langgraph_research_workflow():
    state: ResearchWorkflowState = {
        "job_id": "test_wf_101",
        "topic": "Verify Multi-Agent Research Orchestration",
        "instructions": "Focus on state transitions and verifiable citations",
        "depth": "quick",
        "focus": "technical",
        "max_sources": 3,
        "selected_documents": [],
        "iteration_count": 0,
        "plan": None,
        "research_data": None,
        "analysis": None,
        "verification": None,
        "registered_sources": [],
        "report": None,
        "current_stage": "Initialized",
        "progress": 0,
        "events": [],
        "error": None,
    }

    final_state = research_graph.invoke(state)

    assert final_state.get("error") is None
    assert final_state["current_stage"] == "Completed"
    assert final_state["progress"] == 100
    assert final_state["report"] is not None
    assert len(final_state["registered_sources"]) >= 1
    assert len(final_state["events"]) >= 4
