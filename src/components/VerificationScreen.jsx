import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import './VerificationScreen.css';

const VerificationScreen = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Текстові етапи перевірки
  const stages = [
    'Connecting to legal databases...',
    'Verifying your identity...',
    'Checking IBAN validity...',
    'Finalizing your profile...'
  ];

  useEffect(() => {
    // Якщо перевірка завершена, перенаправляємо через 1 секунду
    if (isComplete) {
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }

    // Таймер для зміни текстових етапів
    const stageTimers = [];
    
    // Кожен етап довжиться ~750ms
    for (let i = 0; i < stages.length; i++) {
      stageTimers.push(
        setTimeout(() => {
          setStage(i + 1);
        }, (i + 1) * 750)
      );
    }

    // Після всіх етапів - показуємо успіх
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
    }, stages.length * 750);

    stageTimers.push(completeTimer);

    // Очистка таймерів при розмонтуванні
    return () => {
      stageTimers.forEach(timer => clearTimeout(timer));
    };
  }, [isComplete, navigate, stages.length]);

  return (
    <div className="verification-wrapper">
      {/* Фоновий елемент */}
      <div className="verification-background">
        <div className="verification-glow"></div>
      </div>

      {/* Основний контент */}
      <div className="verification-container">
        {/* Анімований лоадер */}
        <div className={`loader-container ${isComplete ? 'complete' : ''}`}>
          {!isComplete ? (
            <>
              {/* Кільцевий спіннер */}
              <div className="spinner-ring">
                <div className="spinner-ring-inner"></div>
              </div>

              {/* Центральний логотип F */}
              <div className="logo-center">
                <span className="logo-letter">F</span>
              </div>

              {/* Пульсуючий фон */}
              <div className="pulse-ring"></div>
            </>
          ) : (
            <>
              {/* Зелена галочка успіху */}
              <div className="success-check">
                <Check size={80} strokeWidth={2} />
              </div>
              <div className="success-pulse"></div>
            </>
          )}
        </div>

        {/* Текстовий зміст */}
        <div className="verification-content">
          <h1 className="verification-title">
            {isComplete ? 'Verification Complete!' : 'Verifying your data'}
          </h1>

          {/* Етапи перевірки */}
          {!isComplete && (
            <div className="stages-container">
              {stages.map((stageName, index) => (
                <div
                  key={index}
                  className={`stage-item ${
                    index < stage ? 'completed' : index === stage ? 'active' : ''
                  }`}
                >
                  {index < stage ? (
                    <>
                      <div className="stage-icon-done">
                        <Check size={16} />
                      </div>
                      <span className="stage-text">{stageName}</span>
                    </>
                  ) : index === stage ? (
                    <>
                      <div className="stage-icon-loading"></div>
                      <span className="stage-text">{stageName}</span>
                    </>
                  ) : (
                    <>
                      <div className="stage-icon-pending"></div>
                      <span className="stage-text">{stageName}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {isComplete && (
            <p className="success-message">
              Your profile is ready. Redirecting to dashboard...
            </p>
          )}

          {!isComplete && (
            <p className="verification-subtitle">
              Please wait while we verify your information
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
