import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUp from '../components/SignUp';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock CSS
vi.mock('../components/SignUp.css', () => ({}));

describe('SignUp', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the FuturaFlow brand', () => {
    render(<SignUp />);
    expect(screen.getByText('FuturaFlow')).toBeInTheDocument();
  });

  it('renders the Name label', () => {
    render(<SignUp />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders the Surname label', () => {
    render(<SignUp />);
    expect(screen.getByText('Surname')).toBeInTheDocument();
  });

  it('renders the Email label', () => {
    render(<SignUp />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders the Phone number label', () => {
    render(<SignUp />);
    expect(screen.getByText('Phone number')).toBeInTheDocument();
  });

  it('renders the Password label', () => {
    render(<SignUp />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders the Confirm password label', () => {
    render(<SignUp />);
    expect(screen.getByText('Confirm password')).toBeInTheDocument();
  });

  it('renders the Date of birth fields (DD, MM, YYYY)', () => {
    render(<SignUp />);
    expect(screen.getByPlaceholderText('DD')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('YYYY')).toBeInTheDocument();
  });

  it('renders the Create account button', () => {
    render(<SignUp />);
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
  });

  it('renders the back arrow button', () => {
    render(<SignUp />);
    const backBtn = document.querySelector('.back-arrow');
    expect(backBtn).toBeInTheDocument();
  });

  it('navigates to / when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    const backBtn = document.querySelector('.back-arrow');
    await user.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to /choose-role when Create account button is clicked', async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    const createBtn = screen.getByRole('button', { name: /create account/i });
    await user.click(createBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/choose-role');
  });

  it('allows typing in the Name input field', async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    // Get the first text input (Name field)
    const inputs = screen.getAllByPlaceholderText('Value');
    // inputs[0] = Name, inputs[1] = Surname
    await user.type(inputs[0], 'Alice');
    expect(inputs[0].value).toBe('Alice');
  });

  it('allows typing in the Email input field', async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    const emailField = document.querySelector('input[type="email"]');
    await user.type(emailField, 'alice@example.com');
    expect(emailField.value).toBe('alice@example.com');
  });

  it('allows typing in the password field', async () => {
    const user = userEvent.setup();
    render(<SignUp />);
    const passwordFields = document.querySelectorAll('input[type="password"]');
    await user.type(passwordFields[0], 'secret123');
    expect(passwordFields[0].value).toBe('secret123');
  });

  it('email input has correct type', () => {
    render(<SignUp />);
    const emailField = document.querySelector('input[type="email"]');
    expect(emailField).toBeInTheDocument();
  });
});
