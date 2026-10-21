import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

describe('Navbar Component', () => {
  it('renders brand title and primary navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Deep Research/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/History/i)).toBeInTheDocument();
    expect(screen.getByText(/Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/New Research/i)).toBeInTheDocument();
  });
});
