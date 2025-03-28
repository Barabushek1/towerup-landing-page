import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageRef = useRef(false);
  const {
    toast
  } = useToast();

  // API key
  const API_KEY = "AIzaSyBQohIy_Zf8eV9GMmk7oU-vpmZKblytm8Q";

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (!initialMessageRef.current && isOpen) {
      const welcomeMessage = "Здравствуйте! Я консультант компании TOWER UP. Чем могу помочь с вашим проектом? Вы можете узнать о наших услугах архитектуры, строительства, дизайна или задать любые вопросы о компании.";
      setMessages([{
        role: 'assistant',
        content: welcomeMessage
      }]);
      initialMessageRef.current = true;
    }
  }, [isOpen]);
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      role: 'user' as const,
      content: message
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setErrorDetails(null);
    try {
      // Company information to help the AI provide accurate responses
      const companyInfo = `
        TOWERUP — это строительная компания, специализирующаяся на возведении современных жилых комплексов. 
        Основной проект — ЖК Tower Up в Ташкенте.
        Контактные номера: +998 55 510 00 03 или +998 55 511 00 03
        В продаже есть 1-комнатные, 2-комнатные и 3-комнатные квартиры.
        Компания предлагает различные услуги: проектирование, строительство, дизайн интерьеров.
        Компания находится в г. Ташкент, Узбекистан.
      `;

      // System prompt to guide the AI's responses
      const systemPrompt = `
        TOWERUP — это строительная компания, специализирующаяся на возведении современных жилых комплексов. 
        Основной проект — ЖК Tower Up в Ташкенте. 
        Ты — интеллектуальный чат-бот компании, созданный для общения с клиентами. 
        Твоя задача — быстро и вежливо отвечать на вопросы пользователей о недвижимости, строительстве и услугах компании. 
        
        Основные функции: 
        - приветствуй клиента и уточняй его запрос
        - отвечай на часто задаваемые вопросы (FAQ)
        - предоставляй информацию о наличии квартир, ценах и планировках
        - сообщай о ходе строительства и сроках сдачи объектов
        - давай ссылки на сайт, социальные сети и контактные номера
        - принимай заявки на консультации и бронирование
        
        Если не можешь ответить, предлагай соединение с менеджером.
        
        Примеры диалогов:
        Клиент: "Какие квартиры сейчас в продаже?" 
        Ты: "В продаже есть 1-комнатные, 2-комнатные и 3-комнатные квартиры. Посмотрите планировки и цены на [сайт компании]. Хотите, я помогу с бронированием?"
        
        Клиент: "Когда сдача ЖК Tower Up?" 
        Ты: "Сдача ЖК Tower Up планируется в 4 квартале 2025 года. Следите за обновлениями на нашем сайте и в соцсетях!"
        
        Клиент: "Как связаться с менеджером?" 
        Ты: "Позвоните по номерам +998 55 510 00 03 или +998 55 511 00 03, либо оставьте заявку, и наш менеджер свяжется с вами."
        
        Если не можешь ответить на вопрос, говори: "К сожалению, я не могу помочь с этим вопросом. Давайте свяжу вас с нашим специалистом."
        
        Дополнительная информация о компании: ${companyInfo}
      `;

      // Updated API endpoint and request format for Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: systemPrompt
            }]
          }, {
            role: "model",
            parts: [{
              text: "Понятно. Я буду действовать как интеллектуальный чат-бот компании TOWERUP, специализирующейся на строительстве жилых комплексов в Ташкенте."
            }]
          }, {
            role: "user",
            parts: [{
              text: message
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000
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
      const data = await response.json();

      // Extract the assistant's response
      let assistantResponse = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        assistantResponse = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        // Detailed error handling
        const errorMessage = data.error.message || "Неизвестная ошибка";
        const errorCode = data.error.code || 0;
        setErrorDetails(`Ошибка ${errorCode}: ${errorMessage}`);

        // Fallback response
        assistantResponse = "Извините, возникла проблема с обработкой вашего запроса. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую по номеру +998 55 510 00 03.";
        console.error('Error in Gemini API response:', data);
      }

      // Add assistant response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantResponse
      }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);

      // Set detailed error for debugging
      if (error instanceof Error) {
        setErrorDetails(`Ошибка: ${error.message}`);
      } else {
        setErrorDetails('Произошла неизвестная ошибка');
      }

      // Error message
      const errorMessage = "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, свяжитесь с нами по номеру +998 55 510 00 03.";
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
      toast({
        title: "Ошибка связи",
        description: "Не удалось подключиться к сервису. Пожалуйста, проверьте подключение к интернету.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  return <>
      {/* Chat button */}
      <div className="fixed right-6 bottom-6 z-50">
        <button onClick={toggleChat} aria-label="Чат с консультантом" className="p-3 rounded-full bg-brand-primary text-white shadow-lg transition-all duration-300 hover:bg-brand-primary/90 animate-pulse-slow hover:animate-none my-[94px] py-[15px] px-[16px]">
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Chat window */}
      {isOpen && <div className="fixed right-6 bottom-24 z-50 w-[350px] sm:w-[400px] max-h-[80vh] flex flex-col rounded-t-xl rounded-b-xl shadow-2xl overflow-hidden border border-brand-primary/20 animate-fade-in">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 bg-brand-primary text-white">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-2" />
              <div>
                <h3 className="font-medium">Онлайн-консультант</h3>
                <p className="text-xs text-white/80">TOWER UP</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Chat body */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#1a1a1a]">
            {messages.map((msg, index) => <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-[#252525] text-white/90 border border-white/10'} max-w-[90%] text-sm overflow-hidden break-words shadow-md`}>
                  {msg.content}
                </div>
              </div>)}
            {isLoading && <div className="text-left mb-3">
                <div className="inline-flex items-center px-4 py-3 rounded-lg bg-[#252525] text-white/70 border border-white/10">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span className="text-sm">TOWER UP отвечает...</span>
                </div>
              </div>}
            {errorDetails && <div className="mb-3 p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-xs text-red-300 flex items-start">
                <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Ошибка:</p>
                  <p className="break-all">{errorDetails}</p>
                </div>
              </div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-2 border-t border-white/10 bg-[#161616]">
            <form onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }} className="flex items-center gap-2 bg-[#222] rounded-full overflow-hidden px-3">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Введите ваш вопрос..." className="w-full py-3 px-1 bg-transparent border-none text-white focus:outline-none text-sm" aria-label="Сообщение в чат" />
              <button type="submit" className="p-2 text-white rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={!message.trim() || isLoading} aria-label="Отправить сообщение">
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} color="#26AA56" />}
              </button>
            </form>
          </div>
        </div>}
    </>;
};
export default ChatBot;