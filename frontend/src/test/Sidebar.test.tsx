import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../components/Sidebar';

describe('Sidebar Component', () => {
  it('renders research workspace navigation links with static styling', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Research Workspace')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('New Research')).toBeInTheDocument();
    expect(screen.getByText('Research History')).toBeInTheDocument();
    expect(screen.getByText('Document Library')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('System Help')).toBeInTheDocument();
    expect(screen.getByText('Evidence Grounded')).toBeInTheDocument();
  });
});
