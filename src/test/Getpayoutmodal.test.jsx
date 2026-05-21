import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GetPayoutPage from '../components/Getpayoutmodal';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="icon-x" />,
  CreditCard: () => <svg data-testid="icon-credit-card" />,
  DollarSign: () => <svg data-testid="icon-dollar-sign" />,
  Lock: () => <svg data-testid="icon-lock" />,
  CheckCircle: () => <svg data-testid="icon-check-circle" />,
  AlertCircle: () => <svg data-testid="icon-alert-circle" />,
  Eye: () => <svg data-testid="icon-eye" />,
  EyeOff: () => <svg data-testid="icon-eye-off" />,
  Info: () => <svg data-testid="icon-info" />,
  ArrowRight: () => <svg data-testid="icon-arrow-right" />,
  Shield: () => <svg data-testid="icon-shield" />,
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
  XCircle: () => <svg data-testid="icon-x-circle" />,
}));

describe('GetPayoutPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the component with step 1 (Enter Amount) heading', () => {
    render(<GetPayoutPage />);
    expect(screen.getByText('Enter Amount')).toBeInTheDocument();
  });

  it('shows the step counter "Step 1 / 3" initially', () => {
    render(<GetPayoutPage />);
    // Step counter is rendered as "Step 1 / 3" in a specific mono div
    const stepCounter = document.querySelector('.font-mono');
    expect(stepCounter).not.toBeNull();
    expect(stepCounter.textContent).toMatch(/Step.*1.*3/);
  });

  it('displays available balance in header', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    // Balance appears in the header and in the available balance card — use getAllByText
    const balanceEls = screen.getAllByText(/15000\.00/);
    expect(balanceEls.length).toBeGreaterThanOrEqual(1);
  });

  it('shows the withdrawal amount input', () => {
    render(<GetPayoutPage />);
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('navigates to /dashboard when the exit (ArrowLeft) button is clicked', () => {
    render(<GetPayoutPage />);
    const exitBtn = screen.getByTestId('icon-arrow-left').closest('button');
    fireEvent.click(exitBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows validation error when trying to proceed with empty amount', () => {
    render(<GetPayoutPage />);
    // Continue button should be disabled when amount is empty
    const continueBtn = screen.getByText(/Continue/).closest('button');
    expect(continueBtn).toBeDisabled();
  });

  it('enables Continue button when a valid amount is entered', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '100' } });
    const continueBtn = screen.getByText(/Continue/).closest('button');
    expect(continueBtn).not.toBeDisabled();
  });

  it('shows fee breakdown when amount is entered', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '100' } });
    expect(screen.getByText(/Fee \(1\.5%\):/)).toBeInTheDocument();
    expect(screen.getByText(/Total Deduction:/)).toBeInTheDocument();
  });

  it('advances to step 2 (method) after entering valid amount and clicking Continue', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '100' } });
    const continueBtn = screen.getByText(/Continue/).closest('button');
    fireEvent.click(continueBtn);
    expect(screen.getByText('Select Method')).toBeInTheDocument();
  });

  it('shows Bank Card and IBAN method buttons on step 2', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    expect(screen.getByText('Bank Card')).toBeInTheDocument();
    expect(screen.getByText('IBAN')).toBeInTheDocument();
  });

  it('shows card form fields by default on method step', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('JOHN DOE')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
  });

  it('switches to IBAN form when IBAN method is selected', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    fireEvent.click(screen.getByText('IBAN'));
    expect(screen.getByPlaceholderText('DE89370400440532013000')).toBeInTheDocument();
  });

  it('goes back to step 1 from step 2 when Back button is clicked', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    expect(screen.getByText('Select Method')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Enter Amount')).toBeInTheDocument();
  });

  it('shows validation error for short card number on step 2', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    // Go to step 2
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    // Fill invalid card number
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('JOHN DOE'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/28' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    expect(screen.getByText(/Valid card number required/)).toBeInTheDocument();
  });

  it('advances to step 3 (Verification) with valid card details', () => {
    render(<GetPayoutPage availableBalance={15000} />);
    // Step 1
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    // Step 2 - fill valid card
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), { target: { value: '4111111111111111' } });
    fireEvent.change(screen.getByPlaceholderText('JOHN DOE'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/28' } });
    fireEvent.click(screen.getByText(/Continue/).closest('button'));
    expect(screen.getByText('Verification')).toBeInTheDocument();
    expect(screen.getByText('Security Verification')).toBeInTheDocument();
  });
});
