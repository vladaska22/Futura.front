import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MessageCircle, FileText, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a0633', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#240b45' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <ArrowLeft size={24} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#a855f7', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px' }}>
              F
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>FuturaFlow</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>25 000 $</span>
          
          <button onClick={() => navigate('/messages')} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <MessageCircle size={24} />
          </button>

          {/* Ось тут ми додали перехід на сторінку сповіщень */}
          <button onClick={() => navigate('/notifications')} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <Bell size={24} />
          </button>

          <div onClick={() => navigate('/profile')} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
            <img src="/investor.png" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginTop: '120px' }}>
        <div style={{ backgroundColor: '#240b45', width: '280px', height: '280px', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#06b6d4' }}><FileText size={56} /></div>
          <span style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.3' }}>Створити<br />інвойс</span>
        </div>

        <div style={{ backgroundColor: '#240b45', width: '280px', height: '280px', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#eab308' }}><CreditCard size={56} /></div>
          <span style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.3' }}>Отримати<br />виплату</span>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;