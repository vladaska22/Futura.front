import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChooseRole from '../components/ChooseRole';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock CSS
vi.mock('../components/ChooseRole.css', () => ({}));

describe('ChooseRole — role selection screen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the "Choose your role" heading', () => {
    render(<ChooseRole />);
    expect(screen.getByText('Choose your role')).toBeInTheDocument();
  });

  it('renders the ФОП card', () => {
    render(<ChooseRole />);
    expect(screen.getByText('ФОП')).toBeInTheDocument();
  });

  it('renders the Інвестор card', () => {
    render(<ChooseRole />);
    expect(screen.getByText('Інвестор')).toBeInTheDocument();
  });

  it('shows legal data form when ФОП card is clicked', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    const fopCard = screen.getByText('ФОП').closest('[role="button"]');
    await user.click(fopCard);

    expect(screen.getByText('Введіть юридичні дані')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ІПН')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('КВЕД')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('IBAN')).toBeInTheDocument();
  });

  it('shows legal data form when Інвестор card is clicked', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    const investorCard = screen.getByText('Інвестор').closest('[role="button"]');
    await user.click(investorCard);

    expect(screen.getByText('Введіть юридичні дані')).toBeInTheDocument();
  });

  it('shows "Завершити верифікацію" submit button in the form', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    const fopCard = screen.getByText('ФОП').closest('[role="button"]');
    await user.click(fopCard);

    expect(
      screen.getByRole('button', { name: /Завершити верифікацію/i })
    ).toBeInTheDocument();
  });

  it('navigates back to role selection when back button is clicked on form', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    // Select role to show form
    const fopCard = screen.getByText('ФОП').closest('[role="button"]');
    await user.click(fopCard);
    expect(screen.getByText('Введіть юридичні дані')).toBeInTheDocument();

    // Click back button
    const backBtn = document.querySelector('.back-btn');
    await user.click(backBtn);

    // Should return to role selection
    expect(screen.getByText('Choose your role')).toBeInTheDocument();
  });

  it('navigates to /signup when back button on role selection is clicked', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    const backBtn = document.querySelector('.back-btn');
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('navigates to /verifying when form is submitted', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    const fopCard = screen.getByText('ФОП').closest('[role="button"]');
    await user.click(fopCard);

    // Fill required fields
    await user.type(screen.getByPlaceholderText('ІПН'), '1234567890');
    await user.type(screen.getByPlaceholderText('КВЕД'), '62.01');
    await user.type(screen.getByPlaceholderText('IBAN'), 'UA123456789012345678901234567');

    const submitBtn = screen.getByRole('button', { name: /Завершити верифікацію/i });
    await user.click(submitBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/verifying');
  });

  it('allows typing in the IPN field', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    const fopCard = screen.getByText('ФОП').closest('[role="button"]');
    await user.click(fopCard);

    const ipnInput = screen.getByPlaceholderText('ІПН');
    await user.type(ipnInput, '3456789012');
    expect(ipnInput.value).toBe('3456789012');
  });

  it('ФОП card responds to keyboard Enter key', async () => {
    const user = userEvent.setup();
    render(<ChooseRole />);

    const fopCard = screen.getByText('ФОП').closest('[role="button"]');
    fopCard.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Введіть юридичні дані')).toBeInTheDocument();
  });
});
