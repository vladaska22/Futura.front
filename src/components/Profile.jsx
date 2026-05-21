import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: 'Гість',
    email: 'guest@example.com',
    role: 'Не визначено',
    joinedDate: 'Травень, 2026',
    balance: '0.00 USDT',
    status: 'В процесі верифікації'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('registeredUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(prev => ({
        ...prev,
        name: parsedUser.name || prev.name,
        email: parsedUser.email || prev.email,
        role: parsedUser.role || prev.role,
        status: parsedUser.status || prev.status || 'Активний'
      }));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a0633', color: 'white', padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Кнопка Назад */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'rgba(255,255,255,0.7)', 
          cursor: 'pointer', 
          fontSize: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          transition: '0.2s',
          padding: '0'
        }}
      >
        ← Назад до дашборду
      </button>

      {/* Елементи для тестів */}
      <h1 style={{ marginTop: '20px', fontSize: '32px' }}>Мій Профіль</h1>
      

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Головна картка профілю */}
        <div style={{ 
          backgroundColor: '#250c46', 
          borderRadius: '16px', 
          padding: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '24px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          marginBottom: '30px' 
        }}>
          {/* Аватарка */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#6200ea', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '32px', 
            fontWeight: 'bold', 
            boxShadow: '0 0 15px rgba(98, 0, 234, 0.5)' 
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>{user.name}</h2>
            <span style={{ 
              backgroundColor: 'rgba(98, 0, 234, 0.2)', 
              color: '#b388ff', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '14px', 
              fontWeight: '600', 
              border: '1px solid rgba(179, 136, 255, 0.3)' 
            }}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Інформаційні блоки */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div style={{ backgroundColor: '#250c46', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '18px', color: '#b388ff', marginTop: 0, marginBottom: '20px' }}>Особиста інформація</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Email адреса</label>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>{user.email}</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Статус аккаунта</label>
              <span style={{ fontSize: '16px', fontWeight: '500', color: user.status === 'Активний' ? '#4caf50' : '#ffb74d' }}>
                ● {user.status}
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Дата приєднання</label>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>{user.joinedDate}</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#250c46', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '18px', color: '#b388ff', marginTop: 0, marginBottom: '20px' }}>Баланс гаманця</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>{user.balance}</div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => navigate('/create-invoice')} style={{ flex: 1, backgroundColor: '#6200ea', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Інвойс</button>
              <button onClick={() => navigate('/get-payout')} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Вивести</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;