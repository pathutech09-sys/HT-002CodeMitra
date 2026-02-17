
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: 'Namaste! I am your AI Coach. To create a personalized Indian diet plan for you, I just need to know three things:\n\n1) What is your age?\n2) What is your height (in cm or feet)?\n3) Are you Vegetarian or Non-Vegetarian?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are an AI Coach integrated into a locally running VS Code project.

The application uses a securely stored API key in the backend configuration.

Important Rules:
- Do NOT mention Gemini.
- Do NOT mention Google AI.
- Do NOT say "Powered by Gemini AI".
- Do NOT reveal API keys, backend details, or technical setup.
- Present yourself only as the app’s built-in AI Coach.

Your Role:
You help users by creating a simple and safe Indian diet plan.

You must ask ONLY these three questions:
1) What is your age?
2) What is your height? (in cm or feet)
3) Are you Vegetarian or Non-Vegetarian?

Rules:
- Do NOT ask any other questions.
- Do NOT ask for weight, gender, lifestyle, or medical history.
- If any information is missing, politely ask only for the missing detail.
- After receiving all three answers, immediately generate the diet plan.
- Keep the plan general and safe.
- Do NOT provide medical advice.

Diet Plan Format:
- Breakfast
- Mid-Morning Snack
- Lunch
- Evening Snack
- Dinner
- 2-3 General Health Tips

Tone:
- Friendly
- Supportive
- Simple English`
      }
    });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message: userMessage });
      let fullText = '';
      
      // Add an empty model message to stream into
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'I apologize, but I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-100px)]">
      <header className="mb-6">
        <h2 className="text-3xl font-black text-indigo-950 flex items-center gap-2">
          <span>🤖</span> AI Coach
        </h2>
        <p className="text-gray-500 font-medium">Personalized Indian diet and health guidance.</p>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {/* Messages area */}
        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth"
        >
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100' 
                  : 'bg-gray-50 text-indigo-950 rounded-tl-none border border-gray-100'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {m.text || (isLoading && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1].role === 'user' && (
             <div className="flex justify-start">
               <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 animate-pulse">
                 <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/50">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me your age, height, or preference..."
              className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-2xl font-bold transition-all flex items-center justify-center ${
                isLoading || !input.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-3">
            Built-in AI Coach • Private & Local
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
