import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import SignUp from './components/SignUp';
import ChooseRole from './components/ChooseRole';
import VerificationScreen from './components/VerificationScreen';
import Dashboard from './components/Dashboard';
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
        <Route path="/create-invoice" element={<div className="text-white p-10"><h1>Invoice Page</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;