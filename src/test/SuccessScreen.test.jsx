import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SuccessScreen from '../components/SuccessScreen';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('lucide-react', () => ({
  Heart: ({ size, className }) => (
    <svg data-testid="icon-heart" className={className} width={size} height={size} />
  ),
  ArrowRight: ({ className }) => (
    <svg data-testid="icon-arrow-right" className={className} />
  ),
}));

describe('SuccessScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the "Perfect!" heading', () => {
    render(<SuccessScreen />);
    expect(screen.getByText('Perfect!')).toBeInTheDocument();
  });

  it('renders the success message', () => {
    render(<SuccessScreen />);
    expect(screen.getByText('Invoice created with love')).toBeInTheDocument();
  });

  it('renders the "Back to Dashboard" button', () => {
    render(<SuccessScreen />);
    expect(
      screen.getByRole('button', { name: /back to dashboard/i })
    ).toBeInTheDocument();
  });

  it('renders the FuturaFlow Premium text', () => {
    render(<SuccessScreen />);
    expect(screen.getByText(/FuturaFlow Premium/i)).toBeInTheDocument();
  });

  it('navigates to /dashboard when "Back to Dashboard" is clicked', () => {
    render(<SuccessScreen />);
    const btn = screen.getByRole('button', { name: /back to dashboard/i });
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('renders the heart icon', () => {
    render(<SuccessScreen />);
    expect(screen.getByTestId('icon-heart')).toBeInTheDocument();
  });
});
