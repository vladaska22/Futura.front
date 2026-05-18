import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  // Список тестових сповіщень
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Ваш інвойс #4029 успішно оплачено контрагентом.', time: '10 хв. тому', isNew: true },
    { id: 2, text: 'Олександр з техпідтримки надіслав вам нове повідомлення.', time: '1 год. тому', isNew: true },
    { id: 3, text: 'Запит на виплату схвалено фінансовим куратором.', time: 'Вчора', isNew: false },
    { id: 4, text: 'Система успішно верифікувала ваші документи.', time: '2 дні тому', isNew: false },
  ]);

  // Функція для видалення одного сповіщення
  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Функція для очищення всього списку
  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a0633', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Шапка сторінки */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', backgroundColor: '#240b45', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>
            ← Назад
          </button>
          <h1 style={{ fontSize: '22px', margin: 0, fontWeight: 'bold' }}>Сповіщення</h1>
        </div>
        
        {notifications.length > 0 && (
          <button onClick={handleClearAll} style={{ background: 'transparent', border: 'none', color: '#a855f7', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            Очистити все
          </button>
        )}
      </header>

      {/* Список сповіщень */}
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '40px' }}>
            <span style={{ fontSize: '48px' }}>🔔</span>
            <p style={{ marginTop: '15px', fontSize: '16px' }}>У вас немає нових сповіщень</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              style={{ 
                backgroundColor: '#240b45', 
                padding: '20px', 
                borderRadius: '16px', 
                border: notif.isNew ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '15px'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4', color: notif.isNew ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                  {notif.text}
                </p>
                <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  {notif.time}
                </span>
              </div>
              
              <button 
                onClick={() => handleDelete(notif.id)} 
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '16px', padding: '0 5px' }}
                title="Видалити"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;