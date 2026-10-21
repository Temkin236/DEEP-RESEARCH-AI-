import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressIndicator } from '../components/ProgressIndicator';

describe('ProgressIndicator Component', () => {
  it('renders progress percentage and stage name', () => {
    render(
      <ProgressIndicator
        progress={65}
        currentStage="Analyzing Evidence"
        status="running"
      />
    );

    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText(/Analyzing Evidence/i)).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Researching')).toBeInTheDocument();
    expect(screen.getByText('Analyzing')).toBeInTheDocument();
    expect(screen.getByText('Reporting')).toBeInTheDocument();
  });
});
