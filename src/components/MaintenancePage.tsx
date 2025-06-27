
import React from 'react';
import { Mail, Send, Clock, ExternalLink, ArrowRight } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo/Brand area */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
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

        {/* Previous version access button */}
        <div className="mb-8">
          <a 
            href="https://tower-up.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
          >
            <ArrowRight className="w-6 h-6" />
            <span>Перейти к предыдущей версии сайта</span>
          </a>
          <p className="text-sm text-slate-400">Для презентационных целей</p>
        </div>

        {/* Developer website highlight */}
        <div className="mb-8">
          <a 
            href="https://genite.uz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ExternalLink className="w-6 h-6" />
            <span>genite.uz</span>
          </a>
          <p className="text-sm text-slate-400 mt-3">Официальный сайт разработчика</p>
        </div>

        {/* Contact information */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6 font-benzin">
            Контакты разработчика:
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
              <Mail className="w-6 h-6 text-green-400" />
              <a 
                href="mailto:genite.solutions@gmail.com" 
                className="text-xl text-white hover:text-green-400 transition-colors duration-300 font-medium"
              >
                genite.solutions@gmail.com
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
              <Send className="w-6 h-6 text-green-400" />
              <a 
                href="https://t.me/genite_technologies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xl text-white hover:text-green-400 transition-colors duration-300 font-medium"
              >
                @genite_technologies
              </a>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-lg">
              <span className="text-lg text-slate-300">
                📞 +998 (94) 581-14-88
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-sm text-slate-400">
          <p>Работы ведутся в круглосуточном режиме</p>
          <p className="mt-2">
            <span className="text-green-400 font-medium">genite.uz</span> — разработка и поддержка сайтов
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
