
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Color palette mapping for the brand colors
const brandColors = {
  primary: '#26AA56', // Brand green color
  dark: '#283745',    // Brand dark color
  background: '#161616'
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageRef = useRef(false);
  const { toast } = useToast();
  
  // API key
  const API_KEY = "AIzaSyBQohIy_Zf8eV9GMmk7oU-vpmZKblytm8Q";
  
  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initial welcome message
  useEffect(() => {
    if (!initialMessageRef.current && isOpen) {
      const welcomeMessage = "Здравствуйте! Я консультант компании TOWER UP. Чем могу помочь с вашим проектом? Вы можете узнать о наших услугах архитектуры, строительства, дизайна или задать любые вопросы о компании.";
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
      initialMessageRef.current = true;
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setErrorDetails(null);
    
    try {
      // Company information to help the AI provide accurate responses
      const companyInfo = `
        TOWER UP - строительная компания, специализирующаяся на архитектуре и строительстве в Узбекистане.
        Контактный номер: +998945811488
        Компания предлагает различные услуги: проектирование, строительство, дизайн интерьеров.
        Компания находится в г. Ташкент, Узбекистан.
        У компании есть Instagram и Telegram для связи.
        Процесс работы включает: консультацию, проектирование, строительство, контроль качества и сдачу проекта.
        Наша команда создает уникальные архитектурные проекты, которые сочетают функциональность и эстетику.
      `;
      
      // System prompt to guide the AI's responses
      const systemPrompt = "Вы - полезный ассистент компании TOWER UP. Отвечайте на вопросы, связанные с архитектурой, строительством и услугами компании. Если вас спрашивают о конкретной информации о компании, используйте предоставленную информацию. Будьте вежливы и профессиональны. Отвечайте на русском языке независимо от языка запроса. Используйте информацию о компании: " + companyInfo;
      
      // Updated API endpoint and request format for Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt }
              ]
            },
            {
              role: "model",
              parts: [
                { text: "Понятно. Я буду действовать как полезный ассистент компании TOWER UP, используя предоставленную информацию и фокусируясь на архитектуре, строительстве и услугах компании." }
              ]
            },
            {
              role: "user", 
              parts: [
                { text: message }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
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
        assistantResponse = "Извините, возникла проблема с обработкой вашего запроса. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую по номеру +998945811488.";
        
        console.error('Error in Gemini API response:', data);
      }
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Set detailed error for debugging
      if (error instanceof Error) {
        setErrorDetails(`Ошибка: ${error.message}`);
      } else {
        setErrorDetails('Произошла неизвестная ошибка');
      }
      
      // Error message
      const errorMessage = "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, свяжитесь с нами по номеру +998945811488.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      
      toast({
        title: "Ошибка связи",
        description: "Не удалось подключиться к сервису. Пожалуйста, проверьте подключение к интернету.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
        <button
          onClick={toggleChat}
          className="p-3 rounded-full bg-brand-primary text-white shadow-lg transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-xl"
          aria-label="Консультация"
        >
          <div className="flex items-center justify-center">
            <MessageSquare size={24} className="mr-2" />
            <span className="font-medium pr-1">Консультация</span>
          </div>
        </button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed right-6 bottom-24 z-50 w-[350px] sm:w-[400px] rounded-2xl shadow-2xl overflow-hidden h-[500px] bg-[#1a1a1a] border border-brand-primary/20 animate-fade-in">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-3">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-medium text-base">Онлайн-консультант</h3>
                <p className="text-xs text-white/80">TOWER UP</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat body */}
          <div 
            className="h-[380px] overflow-y-auto p-4 bg-[#1a1a1a] scrollbar-none"
            style={{
              backgroundImage: "url('/lovable-uploads/588f4168-3957-47f6-b722-795cfc295ea7.png')",
              backgroundSize: "300px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundBlendMode: "luminosity",
              backgroundOpacity: "0.05"
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-white' 
                    : 'bg-[#252525] text-white/90 border border-white/10'
                } max-w-[90%] text-sm overflow-hidden break-words shadow-md`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-flex items-center px-4 py-3 rounded-2xl bg-[#252525] text-white/70 border border-white/10">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span className="text-sm">TOWER UP отвечает...</span>
                </div>
              </div>
            )}
            {errorDetails && (
              <div className="mb-3 p-3 bg-red-900/20 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-start">
                <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Ошибка:</p>
                  <p className="break-all">{errorDetails}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-4 border-t border-white/10 bg-[#161616]">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите ваш вопрос..."
                className="w-full py-3 px-4 rounded-full border border-white/20 bg-[#252525] text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all text-sm"
                aria-label="Сообщение в чат"
              />
              <Button
                type="submit"
                className="p-3 h-auto w-auto bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!message.trim() || isLoading}
                aria-label="Отправить сообщение"
              >
                {isLoading ? 
                  <Loader2 size={18} className="animate-spin" /> : 
                  <Send size={18} />
                }
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
