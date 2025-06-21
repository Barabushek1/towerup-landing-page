
import React from 'react';
import { Mail, MessageCircle, Clock } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo/Brand area */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-benzin">
            Сайт временно недоступен
          </h1>
        </div>

        {/* Main message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 shadow-xl">
          <p className="text-xl md:text-2xl text-slate-200 mb-6 leading-relaxed">
            По техническим причинам доступ временно ограничен.
          </p>
          <p className="text-lg text-slate-300 mb-4">
            Приносим извинения за временные неудобства.
          </p>
        </div>

        {/* Contact information */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6 font-benzin">
            Для вопросов и сотрудничества:
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
              <Mail className="w-6 h-6 text-amber-400" />
              <a 
                href="mailto:info@towerup.uz" 
                className="text-xl text-white hover:text-amber-400 transition-colors duration-300 font-medium"
              >
                info@towerup.uz
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
              <MessageCircle className="w-6 h-6 text-amber-400" />
              <a 
                href="https://t.me/towerup_uz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xl text-white hover:text-amber-400 transition-colors duration-300 font-medium"
              >
                @towerup_uz
              </a>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-lg">
              <span className="text-lg text-slate-300">
                📞 +998 (55) 510-00-03
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-sm text-slate-400">
          <p>Работы ведутся в круглосуточном режиме</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
