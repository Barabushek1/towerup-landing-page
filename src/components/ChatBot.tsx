
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
  const initialMessageRef = useRef(false);

  // API key for Gemini
  const API_KEY = "AIzaSyBQohIy_Zf8eV9GMmk7oU-vpmZKblytm8Q";

  // Check if we've shown the popup before
  useEffect(() => {
    const hasShownPopup = localStorage.getItem('towerupChatPopupShown');
    if (!hasShownPopup) {
      setTimeout(() => {
        setPopupShown(true);
        // Auto-hide after 10 seconds
        setTimeout(() => {
          setPopupShown(false);
        }, 10000);
      }, 7000);
      localStorage.setItem('towerupChatPopupShown', 'true');
    }
  }, []);

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
      const welcomeMessage = "Здравствуйте! Я ваш консультант по TOWERUP. Чем я могу помочь вам сегодня? Вы можете спросить о наших проектах, услугах, или других деталях.";
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
        TOWERUP - компания, специализирующаяся на современном строительстве.
        Компания предлагает инновационные решения для строительства.
        TOWERUP располагает крупнейшим в Средней Азии автоматизированным производственным комплексом.
        Площадь производства составляет 350 000 м².
        Компания экспортирует продукцию в 32 страны.
        TOWERUP имеет 20 производств.
        Основные преимущества: профессионализм, опыт компании, современное оборудование.
        Компания предлагает услуги в строительстве, дизайне и комплексных решениях.
      `;

      // Prepare system prompt to guide the AI's responses
      const systemPrompt = "Вы - полезный ассистент компании TOWERUP. Отвечайте на вопросы, связанные со строительством, недвижимостью и услугами компании. Если вас спрашивают о конкретной информации о компании, используйте предоставленную информацию. Будьте вежливы и профессиональны. Используйте информацию о компании: " + companyInfo;

      // API request to Gemini
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
              text: "Понятно. Я буду действовать как полезный ассистент компании TOWERUP, используя предоставленную информацию и фокусируясь на строительстве, недвижимости и услугах компании."
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
        assistantResponse = "Извините, возникла проблема с обработкой вашего запроса. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую через форму контактов.";
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
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, свяжитесь с нами через форму контактов."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return <>
      {/* Chat Popup Message */}
      {popupShown && !isOpen && <div className="fixed bottom-24 right-6 md:right-10 z-[9999] bg-white rounded-lg shadow-lg p-4 max-w-[300px] animate-slide-up">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-gray-800">TOWERUP Ассистент</span>
            <button onClick={() => setPopupShown(false)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
          <p className="text-gray-700 mb-3">Привет! Чем я могу помочь?</p>
          <Button onClick={() => {
        setIsOpen(true);
        setPopupShown(false);
      }} className="bg-primary hover:bg-primary/90 text-white w-full">
            Начать чат
          </Button>
        </div>}

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 md:right-10 z-[9999] flex flex-col gap-4 px-0 my-[53px]">
        {/* Chat button */}
        <Button onClick={() => setIsOpen(true)} className="rounded-full bg-primary p-3 h-12 w-12 flex items-center justify-center shadow-lg hover:bg-primary/90 mx-[2px] px-[28px] py-[27px] my-[17px]">
          <MessageSquare className="text-white" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && <div className="fixed bottom-24 right-6 md:right-10 z-[9999] bg-white rounded-lg shadow-xl w-full max-w-[350px] md:max-w-[400px] h-[500px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-lg">TOWERUP Ассистент</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-brand-secondary">
            {messages.map((msg, index) => <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block rounded-lg p-3 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>)}
            {isLoading && <div className="flex items-center mb-4">
                <div className="inline-block rounded-lg p-3 bg-gray-200">
                  <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                </div>
              </div>}
            {errorDetails && <div className="flex items-center mb-4 text-red-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span className="text-sm">{errorDetails}</span>
              </div>}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Напишите сообщение..." className="flex-grow rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-brand-dark" />
              <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()} className="bg-primary hover:bg-primary/90 text-white">
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={20} />}
              </Button>
            </div>
          </div>
        </div>}
    </>;
};

export default ChatBot;
