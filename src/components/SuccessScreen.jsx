import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

const SuccessScreen = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    // Навігація на твій основний дашборд
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* ФОН З ГРАДІЄНТОМ ТА БЛОБАМИ */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#240b45] via-[#3d1d6f] to-[#1a0535]" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-1/2 -right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center justify-center gap-8 text-center">
        
        {/* СКЛЯНА КАРТКА */}
        <div className="w-full backdrop-blur-2xl bg-white/10 border border-white/20 rounded-[40px] p-12 shadow-2xl">
          <div className="flex flex-col items-center justify-center gap-6">
            
            {/* СЕРЦЕ ЗАМІСТЬ СМАЙЛИКА */}
            <div className="relative group">
              {/* М'яке сяйво навколо серця */}
              <div className="absolute inset-0 bg-pink-500/50 blur-2xl rounded-full animate-pulse" />
              
              <div className="relative animate-smile-pulse">
                <Heart 
                  size={120} 
                  className="text-pink-400 fill-pink-400/20 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" 
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl font-extrabold text-white tracking-tight">
                Perfect!
              </h1>
              <p className="text-2xl text-pink-200/90 font-light">
                Invoice created with love
              </p>
            </div>

            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mt-4" />
          </div>
        </div>

        {/* КНОПКА ПОВЕРНЕННЯ */}
        <button
          onClick={handleReturnHome}
          className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-white text-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_32px_rgba(236,72,153,0.4)]"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
          }}
        >
          Back to Dashboard
          <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
        </button>

        <p className="text-white/40 text-sm tracking-widest uppercase">
          FuturaFlow Premium
        </p>
      </div>
    </div>
  );
};

export default SuccessScreen;