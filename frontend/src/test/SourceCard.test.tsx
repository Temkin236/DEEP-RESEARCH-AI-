import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SourceCard } from '../components/SourceCard';
import { Source } from '../types';

describe('SourceCard Component', () => {
  const sampleSource: Source = {
    id: 'src-1',
    job_id: 'job-1',
    title: 'Benchmarking Multi-Agent Systems in Production',
    url: 'https://research.example.org/study/1',
    domain: 'research.example.org',
    source_type: 'web',
    snippet: 'Empirical analysis shows that explicit state management prevents loops.',
    publication_date: '2024-10-15',
    retrieved_at: new Date().toISOString(),
    reliability_score: 0.95,
    is_verified: true,
  };

  it('renders source title, domain, and excerpt snippet', () => {
    render(<SourceCard source={sampleSource} index={1} />);

    expect(screen.getByText('Benchmarking Multi-Agent Systems in Production')).toBeInTheDocument();
    expect(screen.getByText('research.example.org')).toBeInTheDocument();
    expect(screen.getByText(/Empirical analysis shows that explicit state management/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified \(95%\)/i)).toBeInTheDocument();
  });
});
