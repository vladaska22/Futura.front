import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../components/Profile';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Profile', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the Profile component', () => {
    render(<Profile />);
    expect(screen.getByText('Мій Профіль')).toBeInTheDocument();
  });

  it('renders the page heading', () => {
    render(<Profile />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Мій Профіль');
  });

  it('renders the back navigation button', () => {
    render(<Profile />);
    expect(screen.getByText(/← Назад до дашборду/)).toBeInTheDocument();
  });

  it('calls navigate(-1) when the back button is clicked', () => {
    render(<Profile />);
    const backBtn = screen.getByText(/← Назад до дашборду/);
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls navigate exactly once when back button is clicked once', () => {
    render(<Profile />);
    const backBtn = screen.getByText(/← Назад до дашборду/);
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('calls navigate(-1) twice when clicked twice', () => {
    render(<Profile />);
    const backBtn = screen.getByText(/← Назад до дашборду/);
    fireEvent.click(backBtn);
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    expect(mockNavigate).toHaveBeenNthCalledWith(2, -1);
  });

  it('renders the back button as a button element', () => {
    render(<Profile />);
    const backBtn = screen.getByText(/← Назад до дашборду/).closest('button');
    expect(backBtn).not.toBeNull();
  });

  it('back button has correct cursor style (pointer)', () => {
    render(<Profile />);
    const backBtn = screen.getByText(/← Назад до дашборду/).closest('button');
    expect(backBtn.style.cursor).toBe('pointer');
  });

  it('does not navigate on initial render', () => {
    render(<Profile />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});