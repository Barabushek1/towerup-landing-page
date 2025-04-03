
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button'; // Assuming path is correct

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

    // IMPORTANT: Treat API keys securely. Avoid hardcoding directly in source code for production.
    // Use environment variables in Vite with import.meta.env instead of process.env
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCPKKHz-nWIS2g4ZxZNq4fe2mB5E2EEJOI"; // Replace placeholder if not using env vars

    // --- Popup Logic ---
    useEffect(() => {
        const hasShownPopup = localStorage.getItem('towerupChatPopupShown');
        if (!hasShownPopup) {
            const timer1 = setTimeout(() => {
                if (!isOpen) { // Only show popup if chat is not already open
                   setPopupShown(true);
                   const timer2 = setTimeout(() => {
                       setPopupShown(false);
                   }, 10000); // Auto-hide after 10 seconds
                   return () => clearTimeout(timer2);
                }
            }, 7000); // Show popup after 7 seconds
            localStorage.setItem('towerupChatPopupShown', 'true');
             return () => clearTimeout(timer1);
        }
    }, [isOpen]); // Re-check if isOpen changes

    // --- Scroll Logic ---
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]); // Also scroll when opening

    // --- Initial Welcome Message ---
    useEffect(() => {
        if (isOpen && !initialMessageRef.current) {
            const welcomeMessage = "Здравствуйте! Я ваш консультант по TOWERUP. Чем я могу помочь вам сегодня? Вы можете спросить о наших проектах (ЖК «Пушкин», ЖК «Кумарык», БЦ «Бочка»), услугах или компании.";
            setMessages([{ role: 'assistant', content: welcomeMessage }]);
            initialMessageRef.current = true; // Set flag only once
        }
        // Reset flag if chat is closed, so welcome message appears next time it's opened
        if (!isOpen) {
            initialMessageRef.current = false;
            // Optionally clear messages on close: setMessages([]);
        }
    }, [isOpen]);

    // --- Send Message Handler ---
    const handleSendMessage = async () => {
        if (!message.trim() || !API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
             if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
                setErrorDetails("Ошибка конфигурации: API ключ не найден.");
                console.error("Gemini API Key is missing or placeholder.");
             }
            return;
        }

        const userMessage: Message = { role: 'user', content: message };
        setMessages(prev => [...prev, userMessage]);
        const currentMessage = message; // Capture message before clearing
        setMessage('');
        setIsLoading(true);
        setErrorDetails(null);

        // --- VVVVV UPDATED INSTRUCTIONS VVVVV ---
        const systemPrompt = `
Вы — полезный, профессиональный и компетентный ассистент службы поддержки клиентов компании TOWERUP, ведущей строительно-девелоперской компании, базирующейся в Ташкенте, Узбекистан, и работающей по всей Центральной Азии. Ваша цель — предоставлять точную информацию о компании, ее проектах и услугах, основываясь *исключительно* на приведенной ниже информации. Будьте вежливы и сосредоточьтесь на запросах пользователей, связанных со строительством, недвижимостью, проектами и предложениями TOWERUP.

**Информация о компании:**
*   **Название:** TOWERUP
*   **Специализация:** Современное строительство и девелопмент. Предлагает инновационные строительные решения.
*   **Ключевое преимущество:** Владеет крупнейшим в Средней Азии автоматизированным производственным комплексом (площадь 350 000 м², 20 отдельных производственных единиц).
*   **Охват:** Экспортирует продукцию в 32 страны.
*   **Основные ценности/Преимущества:** Профессионализм, большой опыт компании, современное оборудование, высокие стандарты качества.
*   **Услуги:** Строительство, Дизайн интерьера/экстерьера, Комплексные интегрированные решения (потенциально объединяющие дизайн, строительство, материалы).

**Ключевые проекты (Примеры):**
*   **ЖК «Пушкин»:** Расположен в Ташкенте (Сергелийский район). Статус: Строительство. Современный 16-этажный комплекс, ориентированный на комфорт, безопасность, разнообразные планировки, подземный паркинг.
*   **ЖК «Кумарык»:** Расположен в Ташкенте (Яшнабадский район). Статус: Проектирование. Планируется как уютный 12-этажный комплекс с современной архитектурой.
*   **БЦ «Бочка»:** Расположен в Ташкенте (Мирзо-Улугбекский район). Статус: Завершено. Современный 8-этажный бизнес-центр класса А с панорамными окнами, офисами, паркингом, конференц-залами.

**Инструкции:**
*   Отвечайте на вопросы, основываясь *только* на приведенной выше информации.
*   Если вас спрашивают о конкретных деталях, которые не предоставлены (например, точные цены, наличие квартир, специфические технические детали, выходящие за рамки описания), сообщите, что у вас нет этой конкретной информации, и порекомендуйте связаться с компанией напрямую через контактную форму на их веб-сайте.
*   НЕ придумывайте информацию или детали о проектах, услугах или компании.
*   Поддерживайте вежливый и профессиональный тон.
*   Если пользователь спрашивает о чем-то, не связанном с TOWERUP, вежливо перенаправьте его обратно к основной тематике компании (строительство, проекты, услуги).
*   Признайте, что вы — ИИ-ассистент.
        `;
        // --- ^^^^^ UPDATED INSTRUCTIONS ^^^^^ ---


        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, { // Using v1beta and latest flash model
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Structure for Gemini API - System instruction first, then conversation history
                    contents: [
                        // Add previous messages for context, alternating roles
                        ...messages.map(msg => ({
                            role: msg.role === 'assistant' ? 'model' : 'user', // Map roles correctly
                            parts: [{ text: msg.content }]
                        })),
                         // Add the current user message
                        { role: "user", parts: [{ text: currentMessage }] }
                    ],
                    // Apply system instruction (new way for Gemini)
                    systemInstruction: {
                         role: "system", // Though role is often implied, being explicit can help
                         parts: [{ text: systemPrompt }]
                     },
                    // Generation Config (optional adjustments)
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024 // Increased slightly
                    },
                    // Safety Settings (keep as before)
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                    ]
                })
            });

            if (!response.ok) { // Check for HTTP errors (like 4xx, 5xx)
                const errorData = await response.json().catch(() => ({})); // Try to parse error JSON
                console.error('API Error Response:', errorData);
                const errorMessage = errorData?.error?.message || `HTTP error! Status: ${response.status}`;
                const errorCode = errorData?.error?.code || response.status;
                throw new Error(`Ошибка API (${errorCode}): ${errorMessage}`);
            }

            const data = await response.json();

            let assistantResponse = "";
            // Check for response content, handling potential block reasons
            if (data.candidates && data.candidates[0]) {
                 const candidate = data.candidates[0];
                 if (candidate.finishReason === "SAFETY") {
                    console.warn("Response blocked due to safety settings.");
                    assistantResponse = "Извините, я не могу ответить на этот запрос из-за ограничений безопасности.";
                     setErrorDetails("Ответ заблокирован фильтром безопасности.");
                 } else if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
                    assistantResponse = candidate.content.parts[0].text;
                 } else {
                     // No content but no specific block? Unusual, provide generic error.
                     console.error('Unexpected API response structure (no content):', data);
                     assistantResponse = "Извините, произошла неожиданная ошибка при получении ответа.";
                     setErrorDetails("Не удалось извлечь ответ из API.");
                 }
            } else {
                 // No candidates array or empty candidates
                 console.error('Unexpected API response structure (no candidates):', data);
                 assistantResponse = "Извините, возникла проблема с получением ответа от сервера.";
                 setErrorDetails("Некорректный формат ответа от API.");
            }

             setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

        } catch (error) {
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


    // --- JSX Render ---
    return (
        <>
            {/* Chat Popup Message - Positioned above the button */}
            {/* Note: Using bottom-20 which is 5rem (80px), should be above the button at bottom-6 */}
            {popupShown && !isOpen && (
                <div className="fixed bottom-20 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-lg p-4 max-w-[300px] animate-slide-up border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800">TOWERUP Ассистент</span>
                        <button onClick={() => setPopupShown(false)} className="text-gray-500 hover:text-gray-700">
                            <X size={18} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Привет! Чем я могу помочь?</p>
                    <Button onClick={() => { setIsOpen(true); setPopupShown(false); }} size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
                        Начать чат
                    </Button>
                </div>
            )}

            {/* Chat Button - Simplified Container and Button Styling */}
            {/* --- VVVVV MODIFIED BUTTON CONTAINER & BUTTON VVVVV --- */}
            <div className="fixed bottom-6 right-6 md:right-10 z-[9999]">
                <Button
                    onClick={() => setIsOpen(prev => !prev)} // Toggle open state
                    className="rounded-full bg-primary p-3 h-14 w-14 flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                >
                   {isOpen ? <X className="text-white h-6 w-6"/> : <MessageSquare className="text-white h-6 w-6" />}
                </Button>
            </div>
             {/* --- ^^^^^ MODIFIED BUTTON CONTAINER & BUTTON ^^^^^ --- */}


            {/* Chat Window - Adjusted positioning slightly */}
            {/* Note: bottom-24 (6rem/96px) starts above the button at bottom-6 + height */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-xl w-full max-w-[350px] md:max-w-[400px] h-[500px] flex flex-col border border-gray-200 animate-fade-in">
                    {/* Chat Header */}
                    <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center cursor-grab active:cursor-grabbing"> {/* Added grab cursor */}
                        <h3 className="font-semibold text-lg">TOWERUP Ассистент</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow p-4 overflow-y-auto bg-gray-50"> {/* Slightly off-white bg */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`inline-block rounded-lg py-2 px-3 max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-sm' : 'bg-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                                    {/* Basic Markdown Links (Example): Replace URLs with clickable links */}
                                    {msg.content.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
                                        const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                        if (match) {
                                            return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{match[1]}</a>;
                                        }
                                        // Basic Markdown Bold (Example)
                                        return part.split(/(\*\*.*?\*\*)/g).map((boldPart, j) => {
                                             if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                                                 return <strong key={`${i}-${j}`}>{boldPart.slice(2, -2)}</strong>
                                             }
                                             return boldPart;
                                        });
                                    })}
                                </div>
                            </div>
                        ))}
                         {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                 <div className="inline-flex items-center gap-2 rounded-lg py-2 px-3 bg-gray-200 text-gray-500 shadow-sm">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <span className="text-sm italic">Печатает...</span>
                                </div>
                            </div>
                        )}
                         {/* Error Display */}
                        {errorDetails && (
                            <div className="flex items-center p-2 mb-3 text-red-700 bg-red-100 rounded-lg border border-red-200">
                                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                                <span className="text-xs">{errorDetails}</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 border-t bg-white rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ваш вопрос..."
                                className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isLoading || !message.trim()}
                                className="bg-primary hover:bg-primary/90 text-white shrink-0 px-3"
                                aria-label="Send message"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={20} />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;

// Add some basic animations in your global CSS (e.g., globals.css or index.css)
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
  .animate-fade-in {
     animation: fade-in 0.2s ease-out forwards;
   }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
   @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
   }
}
*/
