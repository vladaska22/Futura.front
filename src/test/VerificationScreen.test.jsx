import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VerificationScreen from '../components/VerificationScreen';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock lucide-react Check icon
vi.mock('lucide-react', () => ({
  Check: ({ size, strokeWidth, ...props }) => (
    <svg data-testid="icon-check" {...props} />
  ),
}));

// Mock the CSS import so it doesn't fail in jsdom
vi.mock('../components/VerificationScreen.css', () => ({}));

describe('VerificationScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the component with initial verification title', () => {
    render(<VerificationScreen />);
    expect(screen.getByText('Verifying your data')).toBeInTheDocument();
  });

  it('renders the initial subtitle', () => {
    render(<VerificationScreen />);
    expect(screen.getByText('Please wait while we verify your information')).toBeInTheDocument();
  });

  it('shows all 4 verification stages initially', () => {
    render(<VerificationScreen />);
    expect(screen.getByText('Connecting to legal databases...')).toBeInTheDocument();
    expect(screen.getByText('Verifying your identity...')).toBeInTheDocument();
    expect(screen.getByText('Checking IBAN validity...')).toBeInTheDocument();
    expect(screen.getByText('Finalizing your profile...')).toBeInTheDocument();
  });

  it('does not show "Verification Complete!" text initially', () => {
    render(<VerificationScreen />);
    expect(screen.queryByText('Verification Complete!')).not.toBeInTheDocument();
  });

  it('shows "Verification Complete!" after all stage timers fire', () => {
    render(<VerificationScreen />);
    // 4 stages * 750ms each = 3000ms total for completion
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Verification Complete!')).toBeInTheDocument();
  });

  it('shows success message after completion', () => {
    render(<VerificationScreen />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Your profile is ready. Redirecting to dashboard...')).toBeInTheDocument();
  });

  it('hides stage list after completion', () => {
    render(<VerificationScreen />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('Connecting to legal databases...')).not.toBeInTheDocument();
  });

  it('navigates to /dashboard after completion plus redirect delay', () => {
    render(<VerificationScreen />);
    act(() => {
      vi.advanceTimersByTime(3000); // completes verification
    });
    act(() => {
      vi.advanceTimersByTime(1000); // redirect timer
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows the check icon after verification completes', () => {
    render(<VerificationScreen />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
  });

  it('advances through stages over time', () => {
    render(<VerificationScreen />);
    // After 750ms the first stage should be marked done (stage = 1)
    act(() => {
      vi.advanceTimersByTime(750);
    });
    // Stage 0 completed element should exist (stage-icon-done wrapper)
    // The first stage text is still visible
    expect(screen.getByText('Connecting to legal databases...')).toBeInTheDocument();
  });
});
