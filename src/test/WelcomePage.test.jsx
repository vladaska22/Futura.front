import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WelcomePage from '../components/WelcomePage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock CSS imports
vi.mock('../components/WelcomePage.css', () => ({}));

describe('WelcomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the FuturaFlow brand name', () => {
    render(<WelcomePage />);
    // FuturaFlow appears in logo-text div
    const brandEls = screen.getAllByText('FuturaFlow');
    expect(brandEls.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the hero title', () => {
    render(<WelcomePage />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });

  it('renders the hero subtitle', () => {
    render(<WelcomePage />);
    expect(screen.getByText(/decentralized marketplace/i)).toBeInTheDocument();
  });

  it('renders the Sign Up button', () => {
    render(<WelcomePage />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders the Log in button', () => {
    render(<WelcomePage />);
    expect(screen.getByRole('button', { name: /^log in$/i })).toBeInTheDocument();
  });

  it('navigates to /signup when Sign Up button is clicked', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);
    const signUpBtn = screen.getByRole('button', { name: /sign up/i });
    await user.click(signUpBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('opens login modal when Log in button is clicked', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);
    const loginBtn = screen.getByRole('button', { name: /^log in$/i });
    await user.click(loginBtn);
    // Modal should show phone and password labels
    expect(screen.getByText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('closes login modal when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);

    // Open modal
    await user.click(screen.getByRole('button', { name: /^log in$/i }));
    expect(screen.getByText('Phone number')).toBeInTheDocument();

    // Click overlay (the modal-overlay div, not the card inside it)
    const overlay = document.querySelector('.modal-overlay');
    fireEvent.click(overlay);
    expect(screen.queryByText('Phone number')).not.toBeInTheDocument();
  });

  it('closes login modal when close button (✕) is clicked', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);

    await user.click(screen.getByRole('button', { name: /^log in$/i }));
    expect(screen.getByText('Phone number')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /✕/ });
    await user.click(closeBtn);
    expect(screen.queryByText('Phone number')).not.toBeInTheDocument();
  });

  it('navigates to /choose-role after login form submission', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);

    // Click the header "Log in" button to open modal
    await user.click(screen.getByRole('button', { name: /^log in$/i }));

    // Fill phone input inside the modal form
    const phoneInput = document.querySelector('input[name="phone"]');
    await user.type(phoneInput, '1234567890');

    const passwordInput = document.querySelector('input[name="password"]');
    await user.type(passwordInput, 'password123');

    // Submit the form — the submit button has class login-submit and text "Log In"
    const formSubmit = document.querySelector('.login-submit');
    await user.click(formSubmit);

    expect(mockNavigate).toHaveBeenCalledWith('/choose-role');
  });

  it('renders feature cards', () => {
    render(<WelcomePage />);
    expect(screen.getByText('Tokenize Invoices')).toBeInTheDocument();
    expect(screen.getByText('Instant Liquidity')).toBeInTheDocument();
    expect(screen.getByText('Earn Returns')).toBeInTheDocument();
  });

  it('renders the CTA footer text', () => {
    render(<WelcomePage />);
    expect(screen.getByText('Connect your wallet to get started')).toBeInTheDocument();
  });

  it('login modal contains phone and password input fields', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);

    await user.click(screen.getByRole('button', { name: /^log in$/i }));

    const phoneInput = document.querySelector('input[name="phone"]');
    const passwordInput = document.querySelector('input[name="password"]');
    expect(phoneInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});
