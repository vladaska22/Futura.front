import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ phone: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoginModalOpen(false);
    navigate('/choose-role');
  };

  return (
    <div className="welcome-page-wrapper">
      <header className="welcome-header">
        <div className="logo-section">
          <div className="logo-icon">F</div>
          <div className="logo-text">FuturaFlow</div>
        </div>
        <div className="auth-buttons">
          <button className="btn-signup-main" onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="btn-login-main" onClick={() => setIsLoginModalOpen(true)}>Log in</button>
        </div>
      </header>

      <main className="welcome-main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome <span className="glow-text">FuturaFlow</span>
          </h1>
          <p className="hero-subtitle">
            The decentralized marketplace for invoice factoring. Get instant cash by selling your future invoices as NFTs.
          </p>
        </div>

        <div className="features-container">
          <div className="feature-card">
            <span className="card-emoji">📄</span>
            <h3>Tokenize Invoices</h3>
            <p>Convert your invoices into tradeable NFTs</p>
          </div>
          <div className="feature-card">
            <span className="card-emoji">💰</span>
            <h3>Instant Liquidity</h3>
            <p>Get cash immediately at a discount</p>
          </div>
          <div className="feature-card">
            <span className="card-emoji">📈</span>
            <h3>Earn Returns</h3>
            <p>Investors earn when invoices are paid</p>
          </div>
        </div>
        <p className="cta-footer">Connect your wallet to get started</p>
      </main>

      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsLoginModalOpen(false)}>✕</button>
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label>Phone number</label>
                <input type="text" name="phone" placeholder="Value" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Value" onChange={handleInputChange} required />
              </div>
              <button type="submit" className="login-submit">Log In</button>
              <a href="#" className="forgot-link">Forgot password?</a>
              <button type="button" className="google-login-btn">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" width="18" alt="G" />
                Sign in with Google
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;