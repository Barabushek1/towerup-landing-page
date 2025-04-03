import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button'; // Assuming path is correct

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Removed: const CHAT_HISTORY_KEY = 'towerupChatHistory';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  // Initialize state as empty array - history is removed
  const [messages, setMessages] = useState<Message[]>([]); // <<< MODIFIED HERE
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [popupShown, setPopupShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Removed: const hasLoadedInitialHistory = useRef(false);

  // API Key Management
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBYfZUfBELv6ywjtqxst8GW7koSUqpS_5E"; // Replace placeholder if needed

  // --- Popup Logic (Stays the same) ---
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

  // --- Scroll Logic (Stays the same) ---
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen]);

  // --- Removed: useEffect hook for saving history to localStorage ---

  // --- Initial Welcome Message (Slightly adjusted dependencies) ---
  useEffect(() => {
    // Add welcome message only if chat is opened AND messages are currently empty
    if (isOpen && messages.length === 0 && !isLoading) {
      const welcomeMessage = "Здравствуйте! Я ваш консультант по TOWERUP. Чем я могу помочь вам сегодня? Вы можете спросить о наших проектах (ЖК «Пушкин», ЖК «Кумарык», БЦ «Бочка»), услугах или компании.";
      setMessages([{
        role: 'assistant',
        content: welcomeMessage
      }]);
    }
    // Clear messages when chat is closed
    if (!isOpen && messages.length > 0) {
      setMessages([]); // Reset chat on close
    }
  }, [isOpen, isLoading]); // Depend on isOpen and isLoading

  // --- Send Message Handler (Stays mostly the same, API gets current session history) ---
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
    // Update state with user message
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message; // Capture before clearing
    setMessage('');
    setIsLoading(true);
    setErrorDetails(null);

    // Russian System Prompt (Keep as is)
    const systemPrompt = `
        Вы — полезный, профессиональный и компетентный ассистент службы поддержки клиентов компании TOWERUP, ведущей строительно-девелоперской компании, базирующейся в Ташкенте, Узбекистан, и работающей по всей Центральной Азии. Ваша цель — предоставлять точную информацию о компании, ее проектах и услугах, основываясь *исключительно* на приведенной ниже информации. Будьте вежливы и сосредоточьтесь на запросах пользователей, связанных со строительством, недвижимостью, проектами и предложениями TOWERUP.

        **Информация о компании:**
        *   **Название:** TOWERUP
        *   **Специализация:** Современное строительство и девелопмент. Предлагает инновационные строительные решения.
        *   **Основные ценности/Преимущества:** Профессионализм, большой опыт компании, современное оборудование, высокие стандарты качества.

        **Ключевые проекты (Примеры):**
        *   **ЖК «Пушкин»:** Расположен в Ташкенте (Сергелийский район). Статус: Строительство. Современный 16-этажный комплекс, ориентированный на комфорт, безопасность, разнообразные планировки, подземный паркинг.
        *   **ЖК «Кумарык»:** Расположен в Ташкенте (Яшнабадский район). Статус: Проектирование. Планируется как уютный 12-этажный комплекс с современной архитектурой.
        *   **БЦ «Бочка»:** Расположен в Ташкенте (Мирзо-Улугбекский район). Статус: Завершено. Современный 8-этажный бизнес-центр класса А с панорамными окнами, офисами, паркингом, конференц-залами.

        **Инструкции:**
        *   Отвечайте на вопросы, основываясь *только* на приведенной выше информации.
        *   Если вас спрашивают о конкретных деталях, которые не предоставлены (например, точные цены, наличие квартир, специфические технические детали, выходящие за рамки описания), сообщите, что у вас нет этой конкретной информации, и порекомендуйте связаться с компанией напрямую через контактную форму на их веб-сайте или по телефону.
        *   НЕ придумывайте информацию или детали о проектах, услугах или компании.
        *   Поддерживайте вежливый и профессиональный тон.
        *   Если пользователь спрашивает о чем-то, не связанном с TOWERUP, вежливо перенаправьте его обратно к основной тематике компании (строительство, проекты, услуги).

        **Контактные данные**
        * Адрес: Город Ташкент, Сергелийский район, МСГ Янги Қумариқ. Ориентир: Моторный завод GM.
        * Телефон: +998 (55) 510-00-03; +998 (55) 511-00-03
        * Email: info@towerup.uz
        * А также форма для отправки сообщения на странице Контакты, которая находится в конце главной страницы или же в навигационном меню.
        `;

    // Prepare messages for API using the current session's messages state
    // This naturally includes the history *of the current session*
    const messagesForApi = [...messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{
        text: msg.content
      }]
    })),
    // Add the new user message to the history sent to the API
    {
      role: "user",
      parts: [{
        text: currentMessage
      }]
    }];
    try {
      // --- API Fetch and Response Handling (Keep as before) ---
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messagesForApi,
          // Send session history + new message
          systemInstruction: {
            parts: [{
              text: systemPrompt
            }]
          },
          generationConfig: {/* Adjust if needed */},
          safetySettings: [/* Keep safety settings */]
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
          assistantResponse = "Извините, я не могу ответить на этот запрос из-за ограничений безопасности.";
          setErrorDetails("Ответ заблокирован фильтром безопасности.");
        } else if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          assistantResponse = candidate.content.parts[0].text;
        } else {
          console.error('Unexpected API response structure (no content):', data);
          assistantResponse = "Извините, произошла неожиданная ошибка при получении ответа.";
          setErrorDetails("Не удалось извлечь ответ из API.");
        }
      } else {
        console.error('Unexpected API response structure (no candidates):', data);
        assistantResponse = "Извините, возникла проблема с получением ответа от сервера.";
        setErrorDetails("Некорректный формат ответа от API.");
      }
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantResponse
      }]);
    } catch (error) {
      // --- Error handling (Keep as before) ---
      console.error('Error calling/processing Gemini API:', error);
      const errorMsg = error instanceof Error ? error.message : 'Произошла неизвестная ошибка сети или обработки.';
      setErrorDetails(`Ошибка: ${errorMsg}`);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Извините, произошла ошибка (${errorMsg}). Пожалуйста, попробуйте позже или свяжитесь с нами через контакты на сайте.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX Render (Keep UI fixes and structure as before) ---
  return <>
            {/* Chat Popup Message */}
            {popupShown && !isOpen && <div className="fixed bottom-20 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-lg p-4 max-w-[300px] animate-slide-up border border-gray-200">
                    {/* ... popup content ... */}
                    <div className="flex justify-between items-start mb-2">
                         <span className="font-semibold text-gray-800">TOWERUP Ассистент</span>
                         <button onClick={() => setPopupShown(false)} className="text-gray-500 hover:text-gray-700">
                             <X size={18} />
                         </button>
                     </div>
                     <p className="text-sm text-gray-700 mb-3">Привет! Чем я могу помочь?</p>
                     <Button onClick={() => {
        setIsOpen(true);
        setPopupShown(false);
      }} size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
                         Начать чат
                     </Button>
                 </div>}

            {/* Chat Button */}
            <div className="fixed bottom-6 right-6 md:right-10 z-[9999]">
                <Button onClick={() => setIsOpen(prev => !prev)} className="rounded-full bg-primary p-3 h-14 w-14 flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label={isOpen ? "Close chat" : "Open chat"}>
                   {isOpen ? <X className="text-white h-6 w-6" /> : <MessageSquare className="text-white h-6 w-6" />}
                </Button>
            </div>

            {/* Chat Window */}
            {isOpen && <div className="fixed bottom-24 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-xl w-full max-w-[350px] md:max-w-[400px] h-[500px] flex flex-col border border-gray-200 animate-fade-in">
                    {/* Chat Header */}
                    <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center cursor-grab active:cursor-grabbing">
                        <h3 className="font-semibold text-lg">TOWERUP Ассистент</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => <div key={`${msg.role}-${index}-${msg.content.slice(0, 10)}`} // Slightly better key
        className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`inline-block rounded-lg py-2 px-3 max-w-[85%] text-sm break-words ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-sm' : 'bg-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                                     {/* Basic Markdown rendering */}
                                     {msg.content.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
              const match = part.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{match[1]}</a>;
              }
              return part.split(/(\*\*.*?\*\*)/g).map((boldPart, j) => {
                if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                  return <strong key={`${i}-${j}`}>{boldPart.slice(2, -2)}</strong>;
                }
                return boldPart;
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
                            <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ваш вопрос..." disabled={isLoading} className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-gray-700" />
                            <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()} className="bg-primary hover:bg-primary/90 text-white shrink-0 px-3" aria-label="Send message">
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={20} />}
                            </Button>
                        </div>
                    </div>
                </div>}
        </>;
};
export default ChatBot;