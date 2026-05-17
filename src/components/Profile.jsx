import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#240b45', color: 'white', padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ArrowLeft size={24} /> Назад
      </button>
      <h1 style={{ marginTop: '40px' }}>Мій Профіль</h1>
      <p>Тут будуть налаштування профілю.</p>
    </div>
  );
};

export default Profile;