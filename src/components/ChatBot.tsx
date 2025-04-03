import React, { useState, useRef, useEffect, useMemo } from 'react'; // Added useMemo
import { MessageSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button'; // Assuming path is correct

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Define a key for local storage
const CHAT_HISTORY_KEY = 'towerupChatHistory';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    // Initialize state lazily by reading from localStorage once
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                // Basic validation: check if it's an array
                if (Array.isArray(parsedHistory)) {
                    return parsedHistory;
                }
            }
        } catch (error) {
            console.error("Failed to load or parse chat history from localStorage:", error);
            localStorage.removeItem(CHAT_HISTORY_KEY); // Clear corrupted data
        }
        return []; // Default to empty array if nothing found or error
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [popupShown, setPopupShown] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasLoadedInitialHistory = useRef(false); // Flag to prevent premature saving

    // IMPORTANT: API Key Management
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBYfZUfBELv6ywjtqxst8GW7koSUqpS_5E";

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
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // --- Save History to Local Storage --- VVVVV NEW VVVVV
    useEffect(() => {
        // Only save after the initial history has been loaded/attempted
        if (hasLoadedInitialHistory.current) {
            try {
                localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
            } catch (error) {
                console.error("Failed to save chat history to localStorage:", error);
                // Maybe notify user if storage is full?
            }
        } else {
            // Mark initial load as complete after the first render cycle
            // where messages state is potentially populated from localStorage
            hasLoadedInitialHistory.current = true;
        }
    }, [messages]); // Run whenever messages change

    // --- Initial Welcome Message (Modified) ---
    useEffect(() => {
        // Add welcome message only if chat is opened AND messages are currently empty
        // This check runs *after* the initial load attempt from localStorage
        if (isOpen && messages.length === 0 && !isLoading) { // Also check isLoading to avoid race condition
            const welcomeMessage = "Здравствуйте! Я ваш консультант по TOWERUP. Чем я могу помочь вам сегодня? Вы можете спросить о наших проектах (ЖК «Пушкин», ЖК «Кумарык», БЦ «Бочка»), услугах или компании.";
            // Use setMessages carefully to not trigger immediate re-save before needed
            setMessages([{ role: 'assistant', content: welcomeMessage }]);
            // No need for initialMessageRef anymore as we check messages.length
        }
        // Optional: Clear history when chat is closed? Uncomment below.
        // if (!isOpen) {
        //     // setMessages([]); // Clears UI state
        //     // localStorage.removeItem(CHAT_HISTORY_KEY); // Clears persistent storage
        // }
    }, [isOpen, isLoading]); // Depend on isOpen and isLoading

    // --- Send Message Handler (Modified System Prompt) ---
    const handleSendMessage = async () => {
        if (!message.trim() || !API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
             if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
                setErrorDetails("Ошибка конфигурации: API ключ не найден.");
                console.error("Gemini API Key is missing or placeholder.");
             }
            return;
        }

        const userMessage: Message = { role: 'user', content: message };
        // Update state *before* API call to show user message immediately
        setMessages(prev => [...prev, userMessage]);
        const currentMessage = message;
        setMessage('');
        setIsLoading(true);
        setErrorDetails(null);

        // Russian System Prompt (as translated before)
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

        // Prepare messages for API, including history
        // The 'messages' state already contains the loaded history + the new user message
        const messagesForApi = [
            // Map current state `messages` to the API format
            ...messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            // Add the *very latest* user message (already included in the map above now)
            // { role: "user", parts: [{ text: currentMessage }] } // No longer needed separately
        ];


        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: messagesForApi, // Send the history + current message
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: { /* ... */ },
                    safetySettings: [ /* ... */ ]
                })
            });

            // --- Error Handling and Response Processing (Keep as before) ---
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
            // Add assistant response using the *functional update* form of setState
            // This ensures we're updating based on the latest state if multiple responses came back quickly
             setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

        } catch (error) {
            // --- Error handling for fetch/processing (Keep as before) ---
            console.error('Error calling/processing Gemini API:', error);
            const errorMsg = error instanceof Error ? error.message : 'Произошла неизвестная ошибка сети или обработки.';
            setErrorDetails(`Ошибка: ${errorMsg}`);
            // Add error message using functional update
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Извините, произошла ошибка (${errorMsg}). Пожалуйста, попробуйте позже или свяжитесь с нами через контакты на сайте.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };


    // --- JSX Render (Keep UI fixes and structure as before) ---
    return (
        <>
            {/* Chat Popup Message */}
            {popupShown && !isOpen && (
                <div className="fixed bottom-20 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-lg p-4 max-w-[300px] animate-slide-up border border-gray-200">
                   {/* ... popup content ... */}
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

            {/* Chat Button */}
            <div className="fixed bottom-6 right-6 md:right-10 z-[9999]">
                <Button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="rounded-full bg-primary p-3 h-14 w-14 flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                >
                   {isOpen ? <X className="text-white h-6 w-6"/> : <MessageSquare className="text-white h-6 w-6" />}
                </Button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 md:right-10 z-[9998] bg-white rounded-lg shadow-xl w-full max-w-[350px] md:max-w-[400px] h-[500px] flex flex-col border border-gray-200 animate-fade-in">
                    {/* Chat Header */}
                    <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center cursor-grab active:cursor-grabbing">
                        <h3 className="font-semibold text-lg">TOWERUP Ассистент</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={`${msg.role}-${index}`} // More stable key if content can be identical
                                className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`inline-block rounded-lg py-2 px-3 max-w-[85%] text-sm break-words ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-sm' : 'bg-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                                     {/* Basic Markdown rendering (same as before) */}
                                    {msg.content.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
                                        const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                        if (match) { return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{match[1]}</a>;}
                                        return part.split(/(\*\*.*?\*\*)/g).map((boldPart, j) => {
                                             if (boldPart.startsWith('**') && boldPart.endsWith('**')) { return <strong key={`${i}-${j}`}>{boldPart.slice(2, -2)}</strong> }
                                             return boldPart;
                                        });
                                    })}
                                </div>
                            </div>
                        ))}
                        {isLoading && ( /* Loading indicator */ )}
                        {errorDetails && ( /* Error display */ )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 border-t bg-white rounded-b-lg">
                         {/* Input and Send button (same as before) */}
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

// Remember to add the CSS animations to your global CSS file if you haven't already.
