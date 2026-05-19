import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a0633', color: 'white', padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ← Назад до дашборду
      </button>
      <h1 style={{ marginTop: '40px', fontSize: '32px', fontWeight: 'bold' }}>Мій Профіль</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '10px' }}>Тут будуть налаштування профілю.</p>
    </div>
  );
};

export default Profile;