import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import SignUp from './components/SignUp';
import ChooseRole from './components/ChooseRole';
import VerificationScreen from './components/VerificationScreen';
import Dashboard from './components/Dashboard';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import InvoiceCreation from './components/Invoicecreation';
import GetPayoutPage from './components/Getpayoutmodal';
import SuccessScreen from './components/SuccessScreen';
import InvestorDashboard from './components/InvestorDashboard';
import './App.css';

function App() {
  return (
    <Router>
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
        <Route path="/investor-dashboard" element={<InvestorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;