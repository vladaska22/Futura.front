import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../components/Dashboard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
  Bell: () => <svg data-testid="icon-bell" />,
  MessageCircle: () => <svg data-testid="icon-message" />,
  FileText: () => <svg data-testid="icon-file-text" />,
  CreditCard: () => <svg data-testid="icon-credit-card" />,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the Dashboard component', () => {
    render(<Dashboard />);
    expect(screen.getByText('FuturaFlow')).toBeInTheDocument();
  });

  it('renders the "Створити інвойс" card', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Створити/)).toBeInTheDocument();
    expect(screen.getByText(/інвойс/)).toBeInTheDocument();
  });

  it('renders the "Отримати виплату" card', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Отримати/)).toBeInTheDocument();
    expect(screen.getByText(/виплату/)).toBeInTheDocument();
  });

  it('navigates to /create-invoice when "Створити інвойс" card is clicked', () => {
    render(<Dashboard />);
    // Find the card containing "Створити" text
    const createInvoiceCard = screen.getByText(/Створити/).closest('div[style]');
    fireEvent.click(createInvoiceCard);
    expect(mockNavigate).toHaveBeenCalledWith('/create-invoice');
  });

  it('navigates to /get-payout when "Отримати виплату" card is clicked', () => {
    render(<Dashboard />);
    // Find the card containing "Отримати" text
    const getPayoutCard = screen.getByText(/Отримати/).closest('div[style]');
    fireEvent.click(getPayoutCard);
    expect(mockNavigate).toHaveBeenCalledWith('/get-payout');
  });

  it('navigates to /messages when message icon button is clicked', () => {
    render(<Dashboard />);
    const messageBtn = screen.getByTestId('icon-message').closest('button');
    fireEvent.click(messageBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/messages');
  });

  it('navigates to /notifications when bell icon button is clicked', () => {
    render(<Dashboard />);
    const bellBtn = screen.getByTestId('icon-bell').closest('button');
    fireEvent.click(bellBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/notifications');
  });

  it('navigates to /profile when avatar is clicked', () => {
    render(<Dashboard />);
    const avatar = screen.getByAltText('Avatar').closest('div');
    fireEvent.click(avatar);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('calls navigate(-1) when back button is clicked', () => {
    render(<Dashboard />);
    const backBtn = screen.getByTestId('icon-arrow-left').closest('button');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('displays the balance amount', () => {
    render(<Dashboard />);
    expect(screen.getByText('25 000 $')).toBeInTheDocument();
  });
});
