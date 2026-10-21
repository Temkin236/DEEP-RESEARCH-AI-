import asyncio
import datetime
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.entities import ResearchJob, Source, Finding, Report, WorkflowEvent
from app.workflows.research_graph import research_graph, ResearchWorkflowState

logger = logging.getLogger(__name__)

# In-memory pub/sub queues for SSE connections: job_id -> list of asyncio.Queue
_event_subscribers: Dict[str, List[asyncio.Queue]] = {}

def subscribe_events(job_id: str) -> asyncio.Queue:
    """Subscribe an SSE client to live workflow events for a job."""
    queue = asyncio.Queue()
    if job_id not in _event_subscribers:
        _event_subscribers[job_id] = []
    _event_subscribers[job_id].append(queue)
    return queue

def unsubscribe_events(job_id: str, queue: asyncio.Queue):
    """Unsubscribe an SSE client."""
    if job_id in _event_subscribers:
        if queue in _event_subscribers[job_id]:
            _event_subscribers[job_id].remove(queue)
        if not _event_subscribers[job_id]:
            del _event_subscribers[job_id]

async def broadcast_event(job_id: str, event_data: Dict[str, Any]):
    """Broadcast event to all connected SSE clients for this job."""
    if job_id in _event_subscribers:
        for q in _event_subscribers[job_id]:
            await q.put(event_data)

def emit_and_persist_event(
    db: Session,
    job_id: str,
    agent_name: str,
    stage: str,
    message: str,
    event_type: str = "info",
    payload_json: Dict[str, Any] = None
):
    """Helper to save event to DB and broadcast to SSE streams."""
    payload = payload_json or {}
    db_event = WorkflowEvent(
        job_id=job_id,
        agent_name=agent_name,
        stage=stage,
        message=message,
        event_type=event_type,
        payload_json=payload
    )
    db.add(db_event)
    db.commit()

    event_payload = {
        "id": db_event.id,
        "job_id": job_id,
        "timestamp": db_event.timestamp.isoformat(),
        "agent_name": agent_name,
        "stage": stage,
        "message": message,
        "event_type": event_type,
        "payload_json": payload,
    }

    # Asynchronously dispatch to SSE subscribers
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(broadcast_event(job_id, event_payload))
    except Exception:
        pass

async def execute_research_workflow(job_id: str):
    """
    Background worker task to execute the full LangGraph research workflow.
    """
    logger.info(f"Starting research worker execution for job: {job_id}")
    db: Session = SessionLocal()
    try:
        job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
        if not job:
            logger.error(f"Job {job_id} not found in database.")
            return

        job.status = "running"
        job.progress = 5
        job.current_stage = "Planning"
        db.commit()

        emit_and_persist_event(
            db=db,
            job_id=job_id,
            agent_name="Coordinator",
            stage="Initialized",
            message=f"Initialized multi-agent research workflow for topic: '{job.topic}'",
            event_type="info"
        )

        initial_state: ResearchWorkflowState = {
            "job_id": job.id,
            "topic": job.topic,
            "instructions": job.instructions,
            "depth": job.depth,
            "focus": job.focus,
            "max_sources": job.max_sources,
            "selected_documents": job.selected_documents or [],
            "iteration_count": 0,
            "plan": None,
            "research_data": None,
            "analysis": None,
            "verification": None,
            "registered_sources": [],
            "report": None,
            "current_stage": "Planning",
            "progress": 10,
            "events": [],
            "error": None,
        }

        # Run LangGraph pipeline in background thread to avoid blocking asyncio loop
        final_state = await asyncio.to_thread(research_graph.invoke, initial_state)

        # Re-fetch fresh job instance
        job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()

        if final_state.get("error"):
            job.status = "failed"
            job.error_message = final_state["error"]
            job.current_stage = "Failed"
            db.commit()
            emit_and_persist_event(
                db=db,
                job_id=job_id,
                agent_name="System",
                stage="Failed",
                message=final_state["error"],
                event_type="error"
            )
            return

        # Persist sources
        reg_sources = final_state.get("registered_sources", [])
        source_id_map = {}
        for s in reg_sources:
            src_obj = Source(
                job_id=job_id,
                title=s.get("title", "Untitled Source"),
                url=s.get("url", ""),
                domain=s.get("domain", ""),
                source_type=s.get("source_type", "web"),
                snippet=s.get("snippet", ""),
                publication_date=s.get("publication_date"),
                reliability_score=s.get("reliability_score", 1.0),
                subquestion=s.get("subquestion", ""),
                is_verified=True,
            )
            db.add(src_obj)
            db.flush()
            source_id_map[s["url"]] = src_obj.id

        # Persist findings
        analysis = final_state.get("analysis", {})
        structured_findings = analysis.get("structured_findings", [])
        for f in structured_findings:
            finding_obj = Finding(
                job_id=job_id,
                subquestion=f.get("subquestion", "General Analysis"),
                claim=f.get("claim", ""),
                confidence=f.get("confidence", 0.9),
                is_disputed=f.get("is_disputed", False),
            )
            db.add(finding_obj)

        # Persist report
        rep_data = final_state.get("report")
        if rep_data:
            report_obj = Report(
                job_id=job_id,
                title=rep_data.get("title", f"Research Report: {job.topic}"),
                executive_summary=rep_data.get("executive_summary", ""),
                methodology=rep_data.get("methodology", ""),
                key_findings=rep_data.get("key_findings", []),
                detailed_analysis=rep_data.get("detailed_analysis", ""),
                comparison_tables=rep_data.get("comparison_tables"),
                recommendations=rep_data.get("recommendations", []),
                limitations=rep_data.get("limitations", ""),
                conclusion=rep_data.get("conclusion", ""),
                markdown_content=rep_data.get("markdown_content", ""),
                citations_data=reg_sources,
                word_count=len(rep_data.get("markdown_content", "").split()),
            )
            db.add(report_obj)

        # Persist events from the graph
        for ev in final_state.get("events", []):
            emit_and_persist_event(
                db=db,
                job_id=job_id,
                agent_name=ev.get("agent_name", "Agent"),
                stage=ev.get("stage", "Progress"),
                message=ev.get("message", ""),
                event_type=ev.get("event_type", "info"),
                payload_json=ev.get("payload_json", {})
            )

        job.status = "completed"
        job.progress = 100
        job.current_stage = "Completed"
        job.completed_at = datetime.datetime.now(datetime.timezone.utc)
        db.commit()

        logger.info(f"Research job {job_id} successfully completed and persisted.")

    except Exception as e:
        logger.exception(f"Unhandled exception in research worker for {job_id}: {e}")
        try:
            job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
            if job:
                job.status = "failed"
                job.error_message = str(e)
                job.current_stage = "Failed"
                db.commit()
                emit_and_persist_event(
                    db=db,
                    job_id=job_id,
                    agent_name="System",
                    stage="Failed",
                    message=f"Research job failed: {str(e)}",
                    event_type="error"
                )
        except Exception:
            pass
    finally:
        db.close()
