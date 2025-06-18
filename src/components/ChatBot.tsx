import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [popupShown, setPopupShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Key Management
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBYfZUfBELv6ywjtqxst8GW7koSUqpS_5E";

  // Popup Logic
  useEffect(() => {
    const hasShownPopup = localStorage.getItem('towerupChatPopupShown');
    if (!hasShownPopup) {
      const timer1 = setTimeout(() => {
        if (!isOpen) {
          setPopupShown(true);
          const timer2 = setTimeout(() => setPopupShown(false), 10000);
          return () => clearTimeout(timer2);
        }
      }, 7000);
      localStorage.setItem('towerupChatPopupShown', 'true');
      return () => clearTimeout(timer1);
    }
  }, [isOpen]);

  // Scroll Logic
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen]);

  // Initial Welcome Message
  useEffect(() => {
    if (isOpen && messages.length === 0 && !isLoading) {
      const welcomeMessage = "Здравствуйте! Я ваш персональный консультант по TOWERUP. Чем я могу помочь вам сегодня?\n\n🏢 **Наши услуги:**\n• Жилые комплексы премиум-класса\n• Коммерческая недвижимость\n• Строительные услуги\n• Дизайн и проектирование\n\n🏗️ **Текущие проекты:**\n• ЖК «Пушкин» - 16-этажный комплекс в Сергелийском районе\n• ЖК «Кумарык» - 12-этажный комплекс в Яшнабадском районе\n• БЦ «Бочка» - 8-этажный бизнес-центр класса А\n\nВы можете спросить о ценах, планировках, условиях покупки или любых других вопросах!";
      setMessages([{
        role: 'assistant',
        content: welcomeMessage
      }]);
    }
    if (!isOpen && messages.length > 0) {
      setMessages([]);
    }
  }, [isOpen, isLoading]);
  const handleSendMessage = async () => {
    if (!message.trim() || !API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        setErrorDetails("Ошибка конфигурации: API ключ не найден.");
        console.error("Gemini API Key is missing or placeholder.");
      }
      return;
    }
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    setErrorDetails(null);

    // Обновленный системный промпт с детальной информацией о компании
    const systemPrompt = `
        Вы — профессиональный консультант компании TOWERUP, ведущей строительно-девелоперской компании в Ташкенте, Узбекистан. Вы обладаете глубокими знаниями о всех аспектах деятельности компании и можете предоставить детальную информацию.

        **О КОМПАНИИ TOWERUP:**
        • Основана в Ташкенте, работает по всей Центральной Азии
        • Специализация: современное строительство, девелопмент, инновационные решения
        • Основные ценности: профессионализм, качество, современные технологии, высокие стандарты
        • Адрес: г. Ташкент, Сергелийский район, МСГ Янги Қумариқ (ориентир: Моторный завод GM)
        • Телефоны: +998 (55) 510-00-03, +998 (55) 511-00-03
        • Email: info@towerup.uz

        **ОСНОВНЫЕ УСЛУГИ:**
        1. **Жилищное строительство** - премиум ЖК с современной архитектурой
        2. **Коммерческая недвижимость** - бизнес-центры класса А
        3. **Строительные услуги** - полный цикл строительства
        4. **Дизайн и проектирование** - архитектурные и дизайнерские решения
        5. **Управляющая компания** - эксплуатация и обслуживание объектов

        **ТЕКУЩИЕ ПРОЕКТЫ:**

        **ЖК «Пушкин»** (в процессе строительства):
        • Расположение: Ташкент, Сергелийский район
        • Этажность: 16 этажей
        • Особенности: современный дизайн, комфорт, безопасность
        • Планировки: разнообразные варианты квартир
        • Инфраструктура: подземный паркинг, благоустроенная территория
        • Преимущества: панорамные виды, качественная отделка

        **ЖК «Кумарык»** (стадия проектирования):
        • Расположение: Ташкент, Яшнабадский район  
        • Этажность: 12 этажей
        • Концепция: уютный жилой комплекс
        • Архитектура: современное решение с акцентом на комфорт

        **БЦ «Бочка»** (завершен):
        • Расположение: Ташкент, Мирзо-Улугбекский район
        • Этажность: 8 этажей
        • Класс: А
        • Особенности: панорамные окна, современные офисы
        • Инфраструктура: паркинг, конференц-залы
        • Статус: готов к эксплуатации

        **ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ:**
        • Калькулятор стоимости квартир онлайн
        • Консультации по выбору недвижимости
        • Помощь в оформлении документов
        • Рассрочка и кредитные программы
        • Сопровождение сделок

        **ПРЕИМУЩЕСТВА ВЫБОРА TOWERUP:**
        • Многолетний опыт в строительстве
        • Использование современных технологий
        • Качественные материалы от проверенных поставщиков
        • Собственное производство
        • Гарантия качества
        • Профессиональная команда
        • Индивидуальный подход к каждому клиенту

        **ИНСТРУКЦИИ ДЛЯ КОНСУЛЬТАЦИИ:**
        • Отвечайте профессионально и дружелюбно
        • Предоставляйте конкретную информацию на основе приведенных данных
        • При вопросах о ценах говорите, что точную стоимость можно узнать по телефону или через форму на сайте
        • Если не знаете точной информации, честно скажите и предложите связаться с офисом
        • Активно предлагайте дополнительные услуги и возможности
        • Подчеркивайте преимущества работы с TOWERUP
        • Используйте эмодзи для более дружелюбного общения
        • При необходимости предлагайте посетить офис или объекты

        **Если пользователь спрашивает о темах, не связанных с недвижимостью и строительством, вежливо верните разговор к услугам TOWERUP.**
        `;
    const messagesForApi = [...messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{
        text: msg.content
      }]
    })), {
      role: "user",
      parts: [{
        text: currentMessage
      }]
    }];
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messagesForApi,
          systemInstruction: {
            parts: [{
              text: systemPrompt
            }]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          },
          safetySettings: [{
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }, {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }, {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }, {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }]
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        const errorMessage = errorData?.error?.message || `HTTP error! Status: ${response.status}`;
        const errorCode = errorData?.error?.code || response.status;
        throw new Error(`Ошибка API (${errorCode}): ${errorMessage}`);
      }
      const data = await response.json();
      let assistantResponse = "";
      if (data.candidates && data.candidates[0]) {
        const candidate = data.candidates[0];
        if (candidate.finishReason === "SAFETY") {
          console.warn("Response blocked due to safety settings.");
          assistantResponse = "Извините, я не могу ответить на этот запрос из-за ограничений безопасности. Давайте поговорим о наших проектах и услугах! 🏢";
          setErrorDetails("Ответ заблокирован фильтром безопасности.");
        } else if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          assistantResponse = candidate.content.parts[0].text;
        } else {
          console.error('Unexpected API response structure (no content):', data);
          assistantResponse = "Извините, произошла неожиданная ошибка. Пожалуйста, свяжитесь с нами по телефону +998 (55) 510-00-03 для получения консультации.";
          setErrorDetails("Не удалось извлечь ответ из API.");
        }
      } else {
        console.error('Unexpected API response structure (no candidates):', data);
        assistantResponse = "Извините, возникла проблема с получением ответа. Вы можете связаться с нами напрямую через контакты на сайте или по телефону.";
        setErrorDetails("Некорректный формат ответа от API.");
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantResponse
      }]);
    } catch (error) {
      console.error('Error calling/processing Gemini API:', error);
      const errorMsg = error instanceof Error ? error.message : 'Произошла неизвестная ошибка сети или обработки.';
      setErrorDetails(`Ошибка: ${errorMsg}`);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Извините, произошла ошибка (${errorMsg}). Пожалуйста, свяжитесь с нами по телефону +998 (55) 510-00-03 или через форму обратной связи на сайте.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return <>
      {/* Chat Popup Message */}
      {popupShown && !isOpen && <div className="fixed bottom-20 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-lg p-4 max-w-[300px] animate-slide-up border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-gray-800">TOWERUP Консультант</span>
            <button onClick={() => setPopupShown(false)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Привет! Хотите узнать о наших проектах? 🏢
          </p>
          <Button onClick={() => {
        setIsOpen(true);
        setPopupShown(false);
      }} size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
            Начать чат
          </Button>
        </div>}

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 md:right-10 z-[9999]">
        <Button onClick={() => setIsOpen(prev => !prev)} className="rounded-full bg-primary p-3 h-14 w-14 flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}>
          {isOpen ? <X className="text-white h-6 w-6" /> : <MessageSquare className="text-white h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && <div className="fixed bottom-24 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-xl w-full max-w-[350px] md:max-w-[400px] h-[500px] flex flex-col border border-gray-200 animate-fade-in">
          {/* Chat Header */}
          <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">TOWERUP Консультант</h3>
              <p className="text-sm text-white/90">Онлайн • Готов помочь</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => <div key={`${msg.role}-${index}-${msg.content.slice(0, 10)}`} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`inline-block rounded-lg py-2 px-3 max-w-[85%] text-sm break-words ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-sm' : 'bg-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                  {msg.content.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
              const match = part.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                          {match[1]}
                        </a>;
              }
              return part.split(/(\*\*.*?\*\*)/g).map((boldPart, j) => {
                if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                  return <strong key={`${i}-${j}`}>{boldPart.slice(2, -2)}</strong>;
                }
                return boldPart.split('\n').map((line, k) => k === 0 ? line : <><br key={k} />{line}</>);
              });
            })}
                </div>
              </div>)}

            {/* Loading Indicator */}
            {isLoading && <div className="flex justify-start mb-3">
                <div className="inline-flex items-center gap-2 rounded-lg py-2 px-3 bg-gray-200 text-gray-500 shadow-sm">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span className="text-sm italic">Печатает...</span>
                </div>
              </div>}

            {/* Error Display */}
            {errorDetails && <div className="flex items-center p-2 mb-3 text-red-700 bg-red-100 rounded-lg border border-red-200">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="text-xs">{errorDetails}</span>
              </div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ваш вопрос..." disabled={isLoading} className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-gray-800" />
              <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()} className="bg-primary hover:bg-primary/90 text-white shrink-0 px-3" aria-label="Отправить сообщение">
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={20} />}
              </Button>
            </div>
          </div>
        </div>}
    </>;
};
export default ChatBot;