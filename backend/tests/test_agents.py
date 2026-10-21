import pytest
from app.agents.planner import planner_agent
from app.agents.researcher import researcher_agent
from app.agents.analyst import analyst_agent
from app.agents.verifier import verifier_agent
from app.agents.reporter import report_writer_agent
from app.services.citation_engine import citation_engine

def test_planner_agent_generates_valid_subtasks():
    plan = planner_agent.plan(
        topic="Evaluate LangGraph vs CrewAI for multi-agent workflows",
        depth="standard",
        focus="technical"
    )
    assert len(plan.subtasks) >= 2
    for st in plan.subtasks:
        assert st.subquestion
        assert len(st.search_queries) >= 1

def test_researcher_agent_collects_evidence():
    plan = planner_agent.plan(topic="Autonomous AI Research Agents", depth="quick")
    research_out = researcher_agent.conduct_research(plan=plan, max_sources_total=4)
    assert len(research_out.evidences) >= 1
    first_ev = research_out.evidences[0]
    assert first_ev.title
    assert first_ev.url
    assert first_ev.snippet

def test_analyst_agent_synthesis():
    plan = planner_agent.plan(topic="AI System Security", depth="quick")
    research_out = researcher_agent.conduct_research(plan=plan, max_sources_total=3)
    analysis = analyst_agent.analyze(topic="AI System Security", research_data=research_out)
    assert len(analysis.synthesis.key_themes) >= 1
    assert len(analysis.structured_findings) >= 1

def test_verifier_agent_validates_claims():
    plan = planner_agent.plan(topic="Retrieval-Augmented Generation", depth="quick")
    research_out = researcher_agent.conduct_research(plan=plan, max_sources_total=3)
    analysis = analyst_agent.analyze(topic="Retrieval-Augmented Generation", research_data=research_out)
    verification = verifier_agent.verify(
        topic="Retrieval-Augmented Generation",
        research_data=research_out,
        analysis=analysis
    )
    assert isinstance(verification.evidence_sufficient, bool)
    assert len(verification.verified_claims) >= 1

def test_reporter_agent_builds_markdown_report():
    plan = planner_agent.plan(topic="Cloud AI Platforms", depth="quick")
    research_out = researcher_agent.conduct_research(plan=plan, max_sources_total=3)
    registered = citation_engine.register_sources([e.model_dump() for e in research_out.evidences])
    analysis = analyst_agent.analyze(topic="Cloud AI Platforms", research_data=research_out)
    verification = verifier_agent.verify(
        topic="Cloud AI Platforms",
        research_data=research_out,
        analysis=analysis
    )
    report = report_writer_agent.write_report(
        topic="Cloud AI Platforms",
        plan=plan,
        research_data=research_out,
        analysis=analysis,
        verification=verification,
        registered_sources=registered
    )
    assert report.title
    assert report.executive_summary
    assert len(report.markdown_content) > 100
    assert "## " in report.markdown_content
