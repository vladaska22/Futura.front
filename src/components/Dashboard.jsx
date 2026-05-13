import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, CreditCard, Bell, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // Функція для повернення, яка ігнорує екран завантаження
  const handleBack = () => {
    // Ведемо користувача на вибір ролі, минаючи "Verifying"
    navigate('/choose-role'); 
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#240b45', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* Верхня панель з лаконічною кнопкою-іконкою */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '15px 25px',
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack} 
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div style={{ opacity: 0.3, fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em' }}>
            ФОП
          </div>
        </div>
      </div>

      {/* Header */}
      <header style={{ 
        width: '100%', 
        backgroundColor: '#1a0633', 
        padding: '20px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        marginTop: '55px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            backgroundColor: '#9333ea', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold', 
            fontSize: '26px' 
          }}>
            <span>F</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', margin: 0, tracking: '-0.02em' }}>FuturaFlow</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div style={{ fontSize: '26px', fontWeight: '600', borderBottom: '1px solid rgba(147, 81, 234, 0.5)', paddingBottom: '2px' }}>
            25 000 $
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Bell size={26} style={{ cursor: 'pointer', opacity: 0.7 }} />
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              border: '2px solid #9333ea', 
              overflow: 'hidden', 
              backgroundColor: '#fb923c'
            }}>
               <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Vlada" 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content — максимально чистий дизайн без зайвих рамок */}
      <main style={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px' 
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: '60px', 
          justifyContent: 'center' 
        }}>
          
          {/* Картка 1: Створити інвойс */}
          <motion.div
            whileHover={{ y: -10, backgroundColor: 'rgba(74, 29, 150, 0.4)' }}
            onClick={() => navigate('/create-invoice')}
            style={{ 
              width: '320px', 
              height: '320px', 
              borderRadius: '50px', 
              backgroundColor: 'rgba(74, 29, 150, 0.25)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '30px', 
              cursor: 'pointer',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Тільки іконка, без фонового квадрата */}
            <FilePlus size={90} color="#38bdf8" strokeWidth={1.2} />
            <span style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
              Створити<br/>інвойс
            </span>
          </motion.div>

          {/* Картка 2: Отримати виплату */}
          <motion.div
            whileHover={{ y: -10, backgroundColor: 'rgba(74, 29, 150, 0.4)' }}
            style={{ 
              width: '320px', 
              height: '320px', 
              borderRadius: '50px', 
              backgroundColor: 'rgba(74, 29, 150, 0.25)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '30px', 
              cursor: 'pointer',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Тільки іконка, без фонового квадрата */}
            <CreditCard size={90} color="#e8f331" strokeWidth={1.2} />
            <span style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
              Отримати<br/>виплату
            </span>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;