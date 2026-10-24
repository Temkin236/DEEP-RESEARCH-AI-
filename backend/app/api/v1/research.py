import asyncio
import json
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse

from app.database.session import get_db
from app.models.entities import ResearchJob, Source, Finding, Report, WorkflowEvent
from app.schemas.research import (
    ResearchCreateRequest,
    ResearchJobSummaryResponse,
    ResearchJobDetailResponse,
    ReportResponse,
    ResearchChatRequest,
    ResearchChatResponse,
)
from app.services.chat_service import ChatService
from app.workers.task_runner import (
    execute_research_workflow,
    subscribe_events,
    unsubscribe_events,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/research", tags=["Research"])

@router.post("", response_model=ResearchJobSummaryResponse, status_code=status.HTTP_201_CREATED)
def create_research_job(
    request: ResearchCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Initiate a new multi-agent tech research investigation."""
    new_job = ResearchJob(
        topic=request.topic.strip(),
        instructions=request.instructions.strip() if request.instructions else None,
        depth=request.depth,
        focus=request.focus,
        max_sources=request.max_sources,
        selected_documents=request.selected_documents or [],
        status="pending",
        progress=0,
        current_stage="Queued"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # Launch background workflow
    background_tasks.add_task(execute_research_workflow, new_job.id)

    return ResearchJobSummaryResponse(
        id=new_job.id,
        topic=new_job.topic,
        depth=new_job.depth,
        focus=new_job.focus,
        status=new_job.status,
        progress=new_job.progress,
        current_stage=new_job.current_stage,
        created_at=new_job.created_at,
        updated_at=new_job.updated_at,
        completed_at=new_job.completed_at,
        source_count=0,
        finding_count=0,
        has_report=False
    )

@router.get("", response_model=List[ResearchJobSummaryResponse])
def list_research_jobs(
    q: Optional[str] = Query(None, description="Search topic keyword"),
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve history of all research jobs with filtering and pagination."""
    query = db.query(ResearchJob)
    if q:
        query = query.filter(ResearchJob.topic.ilike(f"%{q}%"))
    if status_filter:
        query = query.filter(ResearchJob.status == status_filter)

    jobs = query.order_by(ResearchJob.created_at.desc()).offset(skip).limit(limit).all()

    summaries = []
    for j in jobs:
        summaries.append(
            ResearchJobSummaryResponse(
                id=j.id,
                topic=j.topic,
                depth=j.depth,
                focus=j.focus,
                status=j.status,
                progress=j.progress,
                current_stage=j.current_stage,
                created_at=j.created_at,
                updated_at=j.updated_at,
                completed_at=j.completed_at,
                source_count=len(j.sources),
                finding_count=len(j.findings),
                has_report=j.report is not None
            )
        )
    return summaries

@router.get("/{job_id}", response_model=ResearchJobDetailResponse)
def get_research_job(job_id: str, db: Session = Depends(get_db)):
    """Fetch complete research job details, findings, sources, and report."""
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"Research job '{job_id}' not found.")
    return job

@router.get("/{job_id}/events")
async def stream_job_events(job_id: str, db: Session = Depends(get_db)):
    """
    Server-Sent Events (SSE) endpoint to stream live real-time progress updates.
    Handles replay of past events and keeps connection open until completion.
    """
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found.")

    async def event_generator():
        # 1. Yield existing persisted events from DB
        existing_events = db.query(WorkflowEvent).filter(
            WorkflowEvent.job_id == job_id
        ).order_by(WorkflowEvent.timestamp.asc()).all()

        for ev in existing_events:
            yield {
                "event": "message",
                "data": json.dumps({
                    "id": ev.id,
                    "job_id": ev.job_id,
                    "timestamp": ev.timestamp.isoformat(),
                    "agent_name": ev.agent_name,
                    "stage": ev.stage,
                    "message": ev.message,
                    "event_type": ev.event_type,
                    "payload_json": ev.payload_json
                })
            }

        # If job is already finished, emit complete and exit
        refreshed_job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
        if refreshed_job and refreshed_job.status in ("completed", "failed", "cancelled"):
            yield {
                "event": "done",
                "data": json.dumps({"status": refreshed_job.status})
            }
            return

        # 2. Subscribe to live queue for new events
        queue = subscribe_events(job_id)
        try:
            while True:
                try:
                    event_data = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield {
                        "event": "message",
                        "data": json.dumps(event_data)
                    }
                    if event_data.get("event_type") in ("completion", "error"):
                        yield {"event": "done", "data": json.dumps({"status": event_data.get("event_type")})}
                        break
                except asyncio.TimeoutError:
                    # Keep-alive heartbeat comment
                    yield {"event": "ping", "data": "keep-alive"}

                    # Check if job finished while waiting
                    db.expire_all()
                    current_job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
                    if current_job and current_job.status in ("completed", "failed", "cancelled"):
                        yield {"event": "done", "data": json.dumps({"status": current_job.status})}
                        break
        finally:
            unsubscribe_events(job_id, queue)

    return EventSourceResponse(event_generator())

@router.get("/{job_id}/report", response_model=ReportResponse)
def get_research_report(job_id: str, db: Session = Depends(get_db)):
    """Fetch structured markdown report for a completed research job."""
    report = db.query(Report).filter(Report.job_id == job_id).first()
    if not report:
        job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Research job not found.")
        if job.status == "running":
            raise HTTPException(status_code=400, detail="Report is currently being compiled.")
        if job.status == "failed":
            raise HTTPException(status_code=400, detail=f"Job failed: {job.error_message}")
        raise HTTPException(status_code=404, detail="No report generated for this job.")
    return report

@router.post("/{job_id}/retry", response_model=ResearchJobSummaryResponse)
def retry_research_job(
    job_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Retry a failed or incomplete research job."""
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found.")

    job.status = "pending"
    job.progress = 0
    job.current_stage = "Retrying"
    job.error_message = None
    db.commit()

    background_tasks.add_task(execute_research_workflow, job.id)

    return ResearchJobSummaryResponse(
        id=job.id,
        topic=job.topic,
        depth=job.depth,
        focus=job.focus,
        status=job.status,
        progress=job.progress,
        current_stage=job.current_stage,
        created_at=job.created_at,
        updated_at=job.updated_at,
        completed_at=job.completed_at,
        source_count=len(job.sources),
        finding_count=len(job.findings),
        has_report=job.report is not None
    )

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_research_job(job_id: str, db: Session = Depends(get_db)):
    """Delete a research job and all associated findings, sources, and reports."""
    job = db.query(ResearchJob).filter(ResearchJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found.")
    db.delete(job)
    db.commit()
    return None

@router.post("/chat", response_model=ResearchChatResponse)
def research_chat(request: ResearchChatRequest, db: Session = Depends(get_db)):
    """Interactive research chat agent with live web & document search grounding."""
    chat_svc = ChatService()
    return chat_svc.process_chat(request, db=db)

