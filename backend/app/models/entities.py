import datetime
import uuid
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class ResearchJob(Base):
    __tablename__ = "research_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    topic = Column(String(500), nullable=False)
    instructions = Column(Text, nullable=True)
    depth = Column(String(50), default="standard")  # quick, standard, deep
    focus = Column(String(50), default="general")   # general, technical, academic, business, comparative
    max_sources = Column(Integer, default=8)
    selected_documents = Column(JSON, default=list)  # list of doc_ids

    status = Column(String(50), default="pending")  # pending, running, completed, failed, cancelled
    progress = Column(Integer, default=0)          # 0 to 100
    current_stage = Column(String(100), default="Initialized")
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    sources = relationship("Source", back_populates="job", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="job", cascade="all, delete-orphan")
    report = relationship("Report", back_populates="job", uselist=False, cascade="all, delete-orphan")
    events = relationship("WorkflowEvent", back_populates="job", cascade="all, delete-orphan")

class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("research_jobs.id"), nullable=False)
    title = Column(String(500), nullable=False)
    url = Column(String(1000), nullable=False)
    domain = Column(String(255), nullable=True)
    source_type = Column(String(50), default="web")  # web, document, mock_demo
    snippet = Column(Text, nullable=True)
    publication_date = Column(String(100), nullable=True)
    retrieved_at = Column(DateTime, default=utc_now)
    reliability_score = Column(Float, default=1.0)
    subquestion = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=True)

    job = relationship("ResearchJob", back_populates="sources")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("research_jobs.id"), nullable=False)
    subquestion = Column(Text, nullable=False)
    claim = Column(Text, nullable=False)
    evidence_excerpt = Column(Text, nullable=True)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=True)
    confidence = Column(Float, default=0.85)
    is_disputed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    job = relationship("ResearchJob", back_populates="findings")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("research_jobs.id"), nullable=False, unique=True)
    title = Column(String(500), nullable=False)
    executive_summary = Column(Text, nullable=False)
    methodology = Column(Text, nullable=True)
    key_findings = Column(JSON, default=list)
    detailed_analysis = Column(Text, nullable=False)
    comparison_tables = Column(Text, nullable=True)
    recommendations = Column(JSON, default=list)
    limitations = Column(Text, nullable=True)
    conclusion = Column(Text, nullable=False)
    markdown_content = Column(Text, nullable=False)
    citations_data = Column(JSON, default=list)
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)

    job = relationship("ResearchJob", back_populates="report")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    chunk_count = Column(Integer, default=0)
    is_indexed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)

    document = relationship("Document", back_populates="chunks")

class WorkflowEvent(Base):
    __tablename__ = "workflow_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("research_jobs.id"), nullable=False)
    timestamp = Column(DateTime, default=utc_now)
    agent_name = Column(String(100), nullable=False)
    stage = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    event_type = Column(String(50), default="info")  # info, progress, source, finding, warning, error, completion
    payload_json = Column(JSON, default=dict)

    job = relationship("ResearchJob", back_populates="events")
