export type ResearchDepth = 'quick' | 'standard' | 'deep';
export type ResearchFocus = 'general' | 'technical' | 'academic' | 'business' | 'comparative';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ResearchJobSummary {
  id: string;
  topic: string;
  depth: ResearchDepth;
  focus: ResearchFocus;
  status: JobStatus;
  progress: number;
  current_stage: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  source_count: number;
  finding_count: number;
  has_report: boolean;
}

export interface Source {
  id: string;
  job_id: string;
  title: string;
  url: string;
  domain?: string;
  source_type: 'web' | 'document' | 'mock_demo';
  snippet?: string;
  publication_date?: string | null;
  retrieved_at: string;
  reliability_score: number;
  subquestion?: string;
  is_verified: boolean;
  index?: number;
}

export interface Finding {
  id: string;
  job_id: string;
  subquestion: string;
  claim: string;
  evidence_excerpt?: string | null;
  source_id?: string | null;
  confidence: number;
  is_disputed: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  job_id: string;
  title: string;
  executive_summary: string;
  methodology?: string;
  key_findings: string[];
  detailed_analysis: string;
  comparison_tables?: string | null;
  recommendations: string[];
  limitations?: string;
  conclusion: string;
  markdown_content: string;
  citations_data: any[];
  word_count: number;
  created_at: string;
}

export interface WorkflowEvent {
  id: string;
  job_id: string;
  timestamp: string;
  agent_name: string;
  stage: string;
  message: string;
  event_type: 'info' | 'progress' | 'source' | 'finding' | 'warning' | 'error' | 'completion';
  payload_json?: Record<string, any>;
}

export interface ResearchJobDetail extends ResearchJobSummary {
  instructions?: string | null;
  max_sources: number;
  selected_documents: string[];
  error_message?: string | null;
  sources: Source[];
  findings: Finding[];
  report?: Report | null;
  events: WorkflowEvent[];
}

export interface ResearchCreateInput {
  topic: string;
  instructions?: string;
  depth: ResearchDepth;
  focus: ResearchFocus;
  max_sources: number;
  selected_documents?: string[];
}

export interface DocumentItem {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  chunk_count: number;
  is_indexed: boolean;
  created_at: string;
}

export interface DocumentUploadResponse {
  document: DocumentItem;
  message: string;
  extracted_chunks: number;
}
