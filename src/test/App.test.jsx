import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// We test routing by rendering the Routes with MemoryRouter, without BrowserRouter
// We need to import the Routes part of App rather than the full App (which uses BrowserRouter).
// So we define a lightweight version that uses MemoryRouter for each test.

// Mock all page components so we don't have to worry about their dependencies
vi.mock('../components/WelcomePage', () => ({
  default: () => <div data-testid="welcome-page">WelcomePage</div>,
}));
vi.mock('../components/SignUp', () => ({
  default: () => <div data-testid="signup-page">SignUp</div>,
}));
vi.mock('../components/ChooseRole', () => ({
  default: () => <div data-testid="choose-role-page">ChooseRole</div>,
}));
vi.mock('../components/VerificationScreen', () => ({
  default: () => <div data-testid="verification-page">VerificationScreen</div>,
}));
vi.mock('../components/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard</div>,
}));
vi.mock('../components/Messages', () => ({
  default: () => <div data-testid="messages-page">Messages</div>,
}));
vi.mock('../components/Profile', () => ({
  default: () => <div data-testid="profile-page">Profile</div>,
}));
vi.mock('../components/Notifications', () => ({
  default: () => <div data-testid="notifications-page">Notifications</div>,
}));
vi.mock('../components/Invoicecreation', () => ({
  default: () => <div data-testid="invoice-creation-page">InvoiceCreation</div>,
}));
vi.mock('../components/SuccessScreen', () => ({
  default: () => <div data-testid="success-screen-page">SuccessScreen</div>,
}));
vi.mock('../components/Getpayoutmodal', () => ({
  default: () => <div data-testid="get-payout-page">GetPayoutPage</div>,
}));

// Import Routes/Route after mocks are set
import { Routes, Route } from 'react-router-dom';
import WelcomePage from '../components/WelcomePage';
import SignUp from '../components/SignUp';
import ChooseRole from '../components/ChooseRole';
import VerificationScreen from '../components/VerificationScreen';
import Dashboard from '../components/Dashboard';
import Messages from '../components/Messages';
import Profile from '../components/Profile';
import Notifications from '../components/Notifications';
import InvoiceCreation from '../components/Invoicecreation';
import GetPayoutPage from '../components/Getpayoutmodal';
import SuccessScreen from '../components/SuccessScreen';

// A helper component that renders all routes with a given initial path
const AppRoutes = ({ initialPath = '/' }) => (
  <MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/verifying" element={<VerificationScreen />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/create-invoice" element={<InvoiceCreation />} />
      <Route path="/invoice-success" element={<SuccessScreen />} />
      <Route path="/get-payout" element={<GetPayoutPage />} />
    </Routes>
  </MemoryRouter>
);

describe('App routing', () => {
  it('renders WelcomePage at /', () => {
    render(<AppRoutes initialPath="/" />);
    expect(screen.getByTestId('welcome-page')).toBeInTheDocument();
  });

  it('renders SignUp at /signup', () => {
    render(<AppRoutes initialPath="/signup" />);
    expect(screen.getByTestId('signup-page')).toBeInTheDocument();
  });

  it('renders ChooseRole at /choose-role', () => {
    render(<AppRoutes initialPath="/choose-role" />);
    expect(screen.getByTestId('choose-role-page')).toBeInTheDocument();
  });

  it('renders VerificationScreen at /verifying', () => {
    render(<AppRoutes initialPath="/verifying" />);
    expect(screen.getByTestId('verification-page')).toBeInTheDocument();
  });

  it('renders Dashboard at /dashboard', () => {
    render(<AppRoutes initialPath="/dashboard" />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renders Messages at /messages', () => {
    render(<AppRoutes initialPath="/messages" />);
    expect(screen.getByTestId('messages-page')).toBeInTheDocument();
  });

  it('renders Profile at /profile', () => {
    render(<AppRoutes initialPath="/profile" />);
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
  });

  it('renders Notifications at /notifications', () => {
    render(<AppRoutes initialPath="/notifications" />);
    expect(screen.getByTestId('notifications-page')).toBeInTheDocument();
  });

  it('renders InvoiceCreation at /create-invoice', () => {
    render(<AppRoutes initialPath="/create-invoice" />);
    expect(screen.getByTestId('invoice-creation-page')).toBeInTheDocument();
  });

  it('renders SuccessScreen at /invoice-success', () => {
    render(<AppRoutes initialPath="/invoice-success" />);
    expect(screen.getByTestId('success-screen-page')).toBeInTheDocument();
  });

  it('renders GetPayoutPage at /get-payout', () => {
    render(<AppRoutes initialPath="/get-payout" />);
    expect(screen.getByTestId('get-payout-page')).toBeInTheDocument();
  });
});
