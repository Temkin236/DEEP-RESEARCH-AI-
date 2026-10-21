import {
  ResearchJobSummary,
  ResearchJobDetail,
  ResearchCreateInput,
  Report,
  DocumentItem,
  DocumentUploadResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}/api${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      let errorMsg = `HTTP Error ${res.status}`;
      try {
        const errorJson = await res.json();
        errorMsg = errorJson.detail || errorJson.message || errorMsg;
      } catch {
        // use fallback status
      }
      throw new Error(errorMsg);
    }

    if (res.status === 204) {
      return null as unknown as T;
    }

    return res.json();
  }

  // Health
  async getHealth(): Promise<{ status: string; database: string; uptime_seconds: number; version: string }> {
    return this.request('/v1/health');
  }

  // Research Jobs
  async createResearchJob(input: ResearchCreateInput): Promise<ResearchJobSummary> {
    return this.request('/v1/research', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async listResearchJobs(params: { q?: string; status?: string } = {}): Promise<ResearchJobSummary[]> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return this.request(`/v1/research${query ? `?${query}` : ''}`);
  }

  async getResearchJob(id: string): Promise<ResearchJobDetail> {
    return this.request(`/v1/research/${id}`);
  }

  async getResearchReport(id: string): Promise<Report> {
    return this.request(`/v1/research/${id}/report`);
  }

  async retryResearchJob(id: string): Promise<ResearchJobSummary> {
    return this.request(`/v1/research/${id}/retry`, {
      method: 'POST',
    });
  }

  async deleteResearchJob(id: string): Promise<void> {
    return this.request(`/v1/research/${id}`, {
      method: 'DELETE',
    });
  }

  getEventSourceUrl(jobId: string): string {
    return `${API_BASE}/api/v1/research/${jobId}/events`;
  }

  // Documents
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/v1/documents/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async listDocuments(): Promise<DocumentItem[]> {
    return this.request('/v1/documents');
  }

  async deleteDocument(id: string): Promise<void> {
    return this.request(`/v1/documents/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
