import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import SignUp from './components/SignUp';
import ChooseRole from './components/ChooseRole';
import VerificationScreen from './components/VerificationScreen';
import Dashboard from './components/Dashboard';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
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
        <Route path="/create-invoice" element={<div className="text-white p-10"><h1>Invoice Page</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;