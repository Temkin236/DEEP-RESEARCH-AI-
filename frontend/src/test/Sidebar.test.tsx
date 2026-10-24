import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../components/Sidebar';

describe('Sidebar Component', () => {
  it('renders research workspace navigation links with tech styling', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('Control Center')).toBeInTheDocument();
    expect(screen.getByText('Interactive Terminal')).toBeInTheDocument();
    expect(screen.getByText('Launch Research')).toBeInTheDocument();
    expect(screen.getByText('Research Registry')).toBeInTheDocument();
    expect(screen.getByText('Vector Knowledge Base')).toBeInTheDocument();
    expect(screen.getByText('System Settings')).toBeInTheDocument();
    expect(screen.getByText('Evidence Grounded')).toBeInTheDocument();
  });
});
