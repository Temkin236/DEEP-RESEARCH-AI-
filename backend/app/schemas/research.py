from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class ResearchCreateRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500, description="Research topic or question")
    instructions: Optional[str] = Field(None, max_length=2000, description="Special instructions or constraints")
    depth: str = Field(default="standard", pattern="^(quick|standard|deep)$")
    focus: str = Field(default="general", pattern="^(general|technical|academic|business|comparative)$")
    max_sources: int = Field(default=8, ge=2, le=20)
    selected_documents: Optional[List[str]] = Field(default_factory=list, description="IDs of previously uploaded documents to include")

class SourceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    job_id: str
    title: str
    url: str
    domain: Optional[str] = None
    source_type: str = "web"
    snippet: Optional[str] = None
    publication_date: Optional[str] = None
    retrieved_at: datetime
    reliability_score: float = 1.0
    subquestion: Optional[str] = None
    is_verified: bool = True

class FindingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    job_id: str
    subquestion: str
    claim: str
    evidence_excerpt: Optional[str] = None
    source_id: Optional[str] = None
    confidence: float = 0.85
    is_disputed: bool = False
    created_at: datetime

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    job_id: str
    title: str
    executive_summary: str
    methodology: Optional[str] = None
    key_findings: List[Any] = []
    detailed_analysis: str
    comparison_tables: Optional[str] = None
    recommendations: List[Any] = []
    limitations: Optional[str] = None
    conclusion: str
    markdown_content: str
    citations_data: List[Any] = []
    word_count: int = 0
    created_at: datetime

class WorkflowEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    job_id: str
    timestamp: datetime
    agent_name: str
    stage: str
    message: str
    event_type: str
    payload_json: Dict[str, Any] = {}

class ResearchJobSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    topic: str
    depth: str
    focus: str
    status: str
    progress: int
    current_stage: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    source_count: int = 0
    finding_count: int = 0
    has_report: bool = False

class ResearchJobDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    topic: str
    instructions: Optional[str] = None
    depth: str
    focus: str
    max_sources: int
    selected_documents: List[str] = []
    status: str
    progress: int
    current_stage: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    sources: List[SourceResponse] = []
    findings: List[FindingResponse] = []
    report: Optional[ReportResponse] = None
    events: List[WorkflowEventResponse] = []

# Agent Typed Inputs and Outputs
class ResearchSubtask(BaseModel):
    subquestion: str
    search_queries: List[str]
    rationale: str

class PlannerOutput(BaseModel):
    subtasks: List[ResearchSubtask]
    identified_constraints: List[str] = []
    estimated_evidence_needed: int = 6

class ResearcherEvidence(BaseModel):
    subquestion: str
    title: str
    url: str
    domain: str
    snippet: str
    publication_date: Optional[str] = None
    reliability_assessment: str = "high"

class ResearcherOutput(BaseModel):
    evidences: List[ResearcherEvidence]
    unresolved_queries: List[str] = []

class EvidenceSynthesis(BaseModel):
    key_themes: List[str]
    factual_claims: List[str]
    disagreements_or_divergence: List[str]
    missing_aspects: List[str]

class AnalystOutput(BaseModel):
    synthesis: EvidenceSynthesis
    structured_findings: List[Dict[str, Any]]

class VerifierOutput(BaseModel):
    verified_claims: List[Dict[str, Any]]
    disputed_claims: List[Dict[str, Any]]
    flagged_sources: List[str]
    evidence_sufficient: bool
    targeted_follow_ups: List[str] = []

class ReportWriterOutput(BaseModel):
    title: str
    executive_summary: str
    methodology: str
    key_findings: List[str]
    detailed_analysis: str
    comparison_tables: Optional[str] = None
    recommendations: List[str]
    limitations: str
    conclusion: str
    markdown_content: str
