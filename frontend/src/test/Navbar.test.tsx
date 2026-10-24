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

    expect(screen.getByText(/TechResearch/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Terminal Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Neural History/i)).toBeInTheDocument();
    expect(screen.getByText(/Launch Research/i)).toBeInTheDocument();
  });
});
