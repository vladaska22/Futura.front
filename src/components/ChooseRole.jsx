import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Додаємо навігацію
import './ChooseRole.css';

const ChooseRole = () => {
  const navigate = useNavigate(); // Ініціалізуємо навігацію
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    ipn: '',
    kved: '',
    iban: ''
  });

  const handleRoleClick = (role) => {
    if (role === 'investor') {
      // Для інвестора теж можна зробити верифікацію або відразу в дашборд
      setSelectedRole('investor');
    } else if (role === 'fop') {
      setSelectedRole('fop');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log({
      role: selectedRole,
      ipn: formData.ipn,
      kved: formData.kved,
      iban: formData.iban
    });
    
    // ОСЬ ТУТ МАГІЯ: перекидаємо на імітацію перевірки
    navigate('/verifying'); 
  };

  const handleBackClick = () => {
    setSelectedRole(null);
    setFormData({ ipn: '', kved: '', iban: '' });
  };

  return (
    <div className="choose-role-wrapper">
      <header>
        <div className="logo-box">F</div>
        <a href="/" className="brand-name">FuturaFlow</a>
      </header>

      <div className="main-content">
        {selectedRole === null ? (
          <>
            {/* Використовуємо кнопку для назад, щоб не перезавантажувати сторінку */}
            <button className="back-btn" onClick={() => navigate('/signup')}>&#10094;</button>
            <h1>Choose your role</h1>

            <div className="cards-container">
              {/* КАРТКА ФОП */}
              <div
                className="role-link"
                onClick={() => handleRoleClick('fop')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleRoleClick('fop');
                }}
              >
                <div className="role-card">
                  <div className="avatar">
                    <img src="/fop.png" alt="ФОП" />
                  </div>
                  <div className="role-name">ФОП</div>
                </div>
              </div>

              {/* КАРТКА ІНВЕСТОР */}
              <div
                className="role-link"
                onClick={() => handleRoleClick('investor')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleRoleClick('investor');
                }}
              >
                <div className="role-card">
                  <div className="avatar">
                    <img src="/investor.png" alt="Інвестор" />
                  </div>
                  <div className="role-name">Кредитор</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="back-btn" onClick={handleBackClick}>&#10094;</button>
            <h1>Введіть юридичні дані</h1>

            <form className="fop-form" onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="ipn"
                placeholder="ІПН"
                className="fop-input"
                value={formData.ipn}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="kved"
                placeholder="ФІО"
                className="fop-input"
                value={formData.kved}
                onChange={handleInputChange}
                required
              />
            
              <button type="submit" className="submit-btn">
                Завершити верифікацію
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChooseRole;