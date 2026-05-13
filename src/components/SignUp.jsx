import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-page-wrapper">
      <header className="welcome-header">
        <div className="logo-section">
          <div className="logo-icon">F</div>
          <div className="logo-text">FuturaFlow</div>
        </div>
      </header>

      <main className="signup-container">
        <button className="back-arrow" onClick={() => navigate('/')}>&#10094;</button>
        
        <div className="signup-white-card">
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <input type="text" placeholder="Value" required />
            </div>
            <div className="field">
              <label>Surname</label>
              <input type="text" placeholder="Value" required />
            </div>
            <div className="field full">
              <label>Email</label>
              <input type="email" placeholder="Value" required />
            </div>
            <div className="field">
              <label>Date of birth</label>
              <div className="dob-row">
                <input type="text" placeholder="DD" maxLength="2" />
                <input type="text" placeholder="MM" maxLength="2" />
                <input type="text" placeholder="YYYY" maxLength="4" />
              </div>
            </div>
            <div className="field">
              <label>Phone number</label>
              <input type="text" placeholder="Value" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="Value" required />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" placeholder="Value" required />
            </div>
          </div>
          <button className="main-create-btn" onClick={() => navigate('/choose-role')}>
            Create account
          </button>
        </div>
      </main>
    </div>
  );
};

export default SignUp;